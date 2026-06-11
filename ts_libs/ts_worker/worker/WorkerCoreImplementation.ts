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
import { SmaDowntrendFilter } from "../application/mappers/filters/SmaDowntrendFilter";
import { RsiOverboughtFilter } from "../application/mappers/filters/RsiOverboughtFilter";
import { FifteenMinutesRvaExtractor } from "../application/mappers/extractors/FifteenMinutesRvaExtractor";




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
    #fifteenMinutesRvaExtractor: FifteenMinutesRvaExtractor;
    #thirtyDaysPercentChangeExtractor: ThirtyDayPercentChangeExtractor;

    #filterableFieldsExtractors: BaseFilterableAttributeExtractor[];
   

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
        this.#fifteenMinutesRvaExtractor = new FifteenMinutesRvaExtractor();
        this.#sortableFieldsExtractors = [this.#currentPriceExtractor, this.#dailyPriceChangeExtractor, this.#dailyPendingRvaExtractor, this.#dailyRvaExtractor, this.#fifteenMinutesRvaExtractor ,this.#thirtyDaysPercentChangeExtractor];

        this.#filterableFieldsExtractors = [];
        let tfs = TimeFrame.values();
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaUptrendFilter(Period.fromUnknown(200), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaUptrendFilter(Period.fromUnknown(50), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaUptrendFilter(Period.fromUnknown(20), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaDowntrendFilter(Period.fromUnknown(200), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaDowntrendFilter(Period.fromUnknown(50), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new SmaDowntrendFilter(Period.fromUnknown(20), aTf));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new RsiOversoldFilter(Period.fromUnknown(2), aTf, 5));
        });
        tfs.forEach(aTf=>{
            this.#filterableFieldsExtractors.push(new RsiOverboughtFilter(Period.fromUnknown(2), aTf, 95));
        });
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
            new FilterTradingPairsRequest(
                exchangesResponse.descriptors, 
                [Asset.fromUnknown('usdc')], 
                [Asset.fromUnknown('usdc'), Asset.fromUnknown('usdt')], 
                [Asset.fromUnknown('aedz'), Asset.fromUnknown('xaut'), Asset.fromUnknown('usd1'), Asset.fromUnknown('bfusd'), Asset.fromUnknown('usde'), Asset.fromUnknown('fdusd'), Asset.fromUnknown('euri'), Asset.fromUnknown('eur')],
                screenerSettings.maximumPairsCountPerExchange)
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
