import { ScreenerSettings } from "../application/exports/ScreenerSettings";
import { ExchangeInclusionCriteria } from "../application/exports/settings/ExchangeInclusionCriteria";
import { TradingPairModel } from "../application/exports/TradingPairModel";
import { BaseSortableAttributeExtractor } from "../application/mappers/BaseSortableAttributeExtractor";
import { DailyPriceChangeExtractor } from "../application/mappers/extractors/DailyPriceChangeExtractor";
import { CurrentPriceExtractor } from "../application/mappers/extractors/CurrentPriceExtractor";
import { DailyPendingRvaExtractor } from "../application/mappers/extractors/DailyPendingRvaExtractor";
import { ScreenerItemMapper } from "../application/mappers/ScreenerItemMapper";
import { EnumerateExchangesRequest } from "../application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { FetchOhlcvDataRequest } from "../application/usecases/FetchOhlcvData/FetchOhlcvDataRequest";
import { FilterTradingPairsRequest } from "../application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { SyncOhlcvDataRequest } from "../application/usecases/SyncOhlcvData/SyncOhlcvDataRequest";
import { UseCaseContainer } from "../application/usecases/UseCaseContainer";
import { Asset } from "../domain/values/Asset";
import { MultiTimeframeOhlcv } from "../domain/values/MultiTimeframeOhlcv";
import { TimeProvider } from "../infrastructure/time/TimeProvider";
import { DailyRvaExtractor } from "../application/mappers/extractors/DailyRvaExtractor";
import { ThirtyDayPercentChangeExtractor } from "../application/mappers/extractors/ThirtyDayPercentChangeExtractor";
import { BaseFilterableAttributeExtractor } from "../application/mappers/BaseFilterableAttributeExtractor";
import { SmaUptrendFilter } from "../application/mappers/filters/SmaUptrendFilter";
import { TimeFrame } from "../domain/values/TimeFrame";
import { Period } from "../domain/ta/core/Period";
import { RsiOversoldFilter } from "../application/mappers/filters/RsiOversoldFilter";




export type ProgressCallback =
    (progress: number, message: string) => void;

export class WorkerCoreImplementation {
   
    static async Create() {
        let useCaseContainer = await UseCaseContainer.Create();
        var toReturn = new WorkerCoreImplementation(useCaseContainer);
        return toReturn;
    }
    #container: UseCaseContainer;
    #mapper: ScreenerItemMapper;
    #timeProvider: TimeProvider;
    #mtf: readonly MultiTimeframeOhlcv[] | null;
    #candlesPerTimeFrame: number;
    #sortableFieldsExtractors: BaseSortableAttributeExtractor[];

    #dailyPriceChangeExtractor: DailyPriceChangeExtractor;
    #currentPriceExtractor: CurrentPriceExtractor;
    #dailyPendingRvaExtractor: DailyPendingRvaExtractor;
    #dailyRvaExtractor: DailyRvaExtractor;
    #thirtyDaysPercentChangeExtractor: ThirtyDayPercentChangeExtractor;

    #filterableFieldsExtractors: BaseFilterableAttributeExtractor[];
    #dailyUptrendFilter: SmaUptrendFilter;
    #fourHoursUptrendFilter: SmaUptrendFilter;
    #oneHourUptrendFilter: SmaUptrendFilter;
    #fifteenMinutesUptrendFilter: SmaUptrendFilter;
    #fifteenMinutesRsiTwoOversoldFilter: RsiOversoldFilter;
    #oneHourRsiTwoOversoldFilter: RsiOversoldFilter;
    #fourHoursRsiTwoOversoldFilter: RsiOversoldFilter;
    #dailyRsiTwoOversoldFilter: RsiOversoldFilter;

    constructor(container: UseCaseContainer) {
        this.#container = container;
        this.#timeProvider = new TimeProvider();
        this.#mtf = null;
        this.#mapper = new ScreenerItemMapper(container.exchangeMethodsRegistry);
        this.#candlesPerTimeFrame = 400;
        this.#dailyPriceChangeExtractor = new DailyPriceChangeExtractor();
        this.#currentPriceExtractor = new CurrentPriceExtractor();
        this.#dailyPendingRvaExtractor = new DailyPendingRvaExtractor();
        this.#dailyRvaExtractor = new DailyRvaExtractor();
        this.#thirtyDaysPercentChangeExtractor = new ThirtyDayPercentChangeExtractor();
        this.#sortableFieldsExtractors = [this.#currentPriceExtractor, this.#dailyPriceChangeExtractor, this.#dailyPendingRvaExtractor, this.#dailyRvaExtractor, this.#thirtyDaysPercentChangeExtractor];

        this.#dailyUptrendFilter = new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.ONE_DAY);
        this.#fourHoursUptrendFilter = new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.FOUR_HOURS); 
        this.#oneHourUptrendFilter = new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.ONE_HOUR); 
        this.#fifteenMinutesUptrendFilter = new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.FIFTEEN_MINUTES); 
        this.#fifteenMinutesRsiTwoOversoldFilter = new RsiOversoldFilter(Period.fromUnknown(2),TimeFrame.FIFTEEN_MINUTES,5);
        this.#oneHourRsiTwoOversoldFilter = new RsiOversoldFilter(Period.fromUnknown(2),TimeFrame.ONE_HOUR,5);
        this.#fourHoursRsiTwoOversoldFilter = new RsiOversoldFilter(Period.fromUnknown(2),TimeFrame.FOUR_HOURS,5);
        this.#dailyRsiTwoOversoldFilter = new RsiOversoldFilter(Period.fromUnknown(2),TimeFrame.ONE_DAY,5);
        this.#filterableFieldsExtractors = [this.#dailyUptrendFilter, this.#fourHoursUptrendFilter, this.#oneHourUptrendFilter, this.#fifteenMinutesUptrendFilter, this.#fifteenMinutesRsiTwoOversoldFilter, this.#oneHourRsiTwoOversoldFilter, this.#fourHoursRsiTwoOversoldFilter, this.#dailyRsiTwoOversoldFilter];
    }

    /**
     * Initialize settings for the screener, including exchange inclusion criteria
     */
    public async createDefaultSettings(): Promise<ScreenerSettings> {
        let exchangeInclusionCriterias: ExchangeInclusionCriteria[] = [];
        let available = this.#container.exchangeDescriptorRegistry.all();
        for (let i = 0; i < available.length; i++) {
            exchangeInclusionCriterias.push(new ExchangeInclusionCriteria(available[i].getName(), available[i].getId(), true));
        }
        return new ScreenerSettings(exchangeInclusionCriterias);
    }

    /**
     * Fetch initial data from exchanges
     */
    public async fetch(screenerSettings: ScreenerSettings, progressCallback: ProgressCallback): Promise<readonly TradingPairModel[]> {
        const exchangesResponse = await this.#container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest(screenerSettings.getIncludedExchangeNames()));
        const tradingPairsResponse = await this.#container.filterTradingPairsUseCase.execute(
            new FilterTradingPairsRequest(exchangesResponse.descriptors, [Asset.fromUnknown('usdc')], [Asset.fromUnknown('usdc'), Asset.fromUnknown('usdt')], screenerSettings.maximumPairsCountPerExchange)
        );
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        const sixHours = 21_600_000;
        const nowMs = await this.#timeProvider.getUtcNowMilliseconds(true) - sixHours;


        const fetchRequest = new FetchOhlcvDataRequest(
            tradingPairs,
            this.#candlesPerTimeFrame,
            screenerSettings.parallelRequestsCount,
            nowMs,
            async (progress) => {
                let percent = 0.7 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Fetched ${progress.currentTradingPair.symbol()} initial data from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
            }
        );

        const fetchResponse = await this.#container.fetchOhlcvDataUseCase.execute(fetchRequest);
        this.#mtf = fetchResponse.getMultiTimeFrameData();
        this.#sortableFieldsExtractors.forEach(sfe => sfe.ensureIndicatorsRegisteredNoThrow(this.#mtf));
        this.#filterableFieldsExtractors.forEach(sfe => sfe.ensureIndicatorsRegisteredNoThrow(this.#mtf));


        const syncMs = await this.#timeProvider.getUtcNowMilliseconds(true);
        const syncRequest = new SyncOhlcvDataRequest(
            this.#mtf,
            screenerSettings.parallelRequestsCount,
            syncMs,
            async (progress) => {
                let percent = 70 + 0.3 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;

                progressCallback(percent, message);
            }
        );
        const syncResponse = await this.#container.syncOhlcvDataUseCase.execute(syncRequest);
        const mapped = this.#mapper.mapMultiple(this.#sortableFieldsExtractors, this.#filterableFieldsExtractors, syncResponse.getMultiTimeFrameData());

        return mapped;
    }

    async sync(screenerSettings: ScreenerSettings, progressCallback: ProgressCallback): Promise<readonly TradingPairModel[]> {
        if (this.#mtf === null) {
            throw new Error(`Synchronization is not possible`);
        }
        this.#sortableFieldsExtractors.forEach(sfe => sfe.ensureIndicatorsRegisteredNoThrow(this.#mtf));
        this.#filterableFieldsExtractors.forEach(sfe => sfe.ensureIndicatorsRegisteredNoThrow(this.#mtf));
        const syncMs = await this.#timeProvider.getUtcNowMilliseconds(true);
        const syncRequest = new SyncOhlcvDataRequest(
            this.#mtf,
            screenerSettings.parallelRequestsCount,
            syncMs,
            async (progress) => {
                let percent = (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
            }
        );
        const syncResponse = await this.#container.syncOhlcvDataUseCase.execute(syncRequest);
        const mapped = this.#mapper.mapMultiple(this.#sortableFieldsExtractors, this.#filterableFieldsExtractors, syncResponse.getMultiTimeFrameData());
        return mapped;
    }
}
