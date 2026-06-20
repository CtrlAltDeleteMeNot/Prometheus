import { ScreenerSettings } from "../application/exports/ScreenerSettings";
import { ExchangeInclusionCriteria } from "../application/exports/settings/ExchangeInclusionCriteria";
import { SynchronizationModel } from "../application/exports/SynchronizationModel";
import { EnumerateExchangesRequest } from "../application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { FetchOhlcvDataRequest } from "../application/usecases/FetchOhlcvData/FetchOhlcvDataRequest";
import { FilterTradingPairsRequest } from "../application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { RegisterPluginsRequest } from "../application/usecases/RegisterPlugins/RegisterPluginsRequest";
import { SyncOhlcvDataRequest } from "../application/usecases/SyncOhlcvData/SyncOhlcvDataRequest";
import { UseCaseContainer } from "../application/usecases/UseCaseContainer";
import { Asset } from "../domain/values/Asset";
import { TimeProvider } from "../infrastructure/time/TimeProvider";




export type ProgressCallback =
    (progress: number, message: string) => void;

export class WorkerCoreImplementation {

    static async Create() {
        let useCaseContainer = await UseCaseContainer.Create();
        var toReturn = new WorkerCoreImplementation(useCaseContainer);
        return toReturn;
    }
    #container: UseCaseContainer;
    #timeProvider: TimeProvider;
    #candlesPerTimeFrame: number;
    #settings: ScreenerSettings;


    constructor(container: UseCaseContainer) {
        this.#container = container;
        this.#timeProvider = new TimeProvider();
        this.#candlesPerTimeFrame = 400;
        let exchangeInclusionCriterias: ExchangeInclusionCriteria[] = [];
        let available = this.#container.exchangeDescriptorRegistry.all();
        for (let i = 0; i < available.length; i++) {
            exchangeInclusionCriterias.push(new ExchangeInclusionCriteria(available[i].getName(), available[i].getId(), true));
        }
        this.#settings = new ScreenerSettings(exchangeInclusionCriterias);
    }

    /**
     * Initialize settings for the screener, including exchange inclusion criteria
     */
    public async getDefaultSettings(): Promise<ScreenerSettings> {
        return this.#settings;
    }

    /**
     * Fetch initial data from exchanges
     */
    public async fetch(screenerSettings: ScreenerSettings, progressCallback: ProgressCallback): Promise<SynchronizationModel> {
        this.#settings = screenerSettings;
        const exchangesResponse = await this.#container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest(screenerSettings.getIncludedExchangeNames()));
        const tradingPairsResponse = await this.#container.filterTradingPairsUseCase.execute(
            new FilterTradingPairsRequest(
                exchangesResponse.descriptors,
                [Asset.fromUnknown('usdc')],
                [Asset.fromUnknown('usdc'), Asset.fromUnknown('usdt')],
                [Asset.fromUnknown('aedz'), Asset.fromUnknown('xaut'), Asset.fromUnknown('usd1'), Asset.fromUnknown('bfusd'), Asset.fromUnknown('usde'), Asset.fromUnknown('fdusd'), Asset.fromUnknown('euri'), Asset.fromUnknown('eur')],
                this.#settings.maximumPairsCountPerExchange)
        );
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        const sixHours = 21_600_000;
        const nowMs = await this.#timeProvider.getUtcNowMilliseconds(true) - sixHours;

        const registerPluginsRequest = new RegisterPluginsRequest(this.#settings.plugins, tradingPairs);
        const registerPluginsResponse = await this.#container.registerPluginsUseCase.execute(registerPluginsRequest);
        const plugins = registerPluginsResponse.plugins;

        const fetchRequest = new FetchOhlcvDataRequest(
            tradingPairs,
            this.#candlesPerTimeFrame,
            this.#settings.parallelRequestsCount,
            nowMs,
            this.#settings.plugins,
            async (progress) => {
                let percent = 0.7 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Fetched ${progress.currentTradingPair.symbol()} initial data from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
            }
        );

        const fetchResponse = await this.#container.fetchOhlcvDataUseCase.execute(fetchRequest);
        if (fetchResponse.getCount() === 0) {
            throw new Error("No data was fetched.");
        }

        const syncMs = await this.#timeProvider.getUtcNowMilliseconds(true);
        const syncRequest = new SyncOhlcvDataRequest(
            this.#settings.plugins,
            this.#settings.parallelRequestsCount,
            syncMs,
            async (progress) => {
                let percent = 70 + 0.3 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;

                progressCallback(percent, message);
            }
        );
        const syncResponse = await this.#container.syncOhlcvDataUseCase.execute(syncRequest);
        var synchronizationModel = new SynchronizationModel(
            syncResponse.getTradingPairModel(),
            []
        );
        return synchronizationModel;
    }

    async synchronize(progressCallback: ProgressCallback): Promise<SynchronizationModel> {
        const syncMs = await this.#timeProvider.getUtcNowMilliseconds(true);
        const syncRequest = new SyncOhlcvDataRequest(
            this.#settings.plugins,
            this.#settings.parallelRequestsCount,
            syncMs,
            async (progress) => {
                let percent = (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
            }
        );
        const syncResponse = await this.#container.syncOhlcvDataUseCase.execute(syncRequest);
        var synchronizationModel = new SynchronizationModel(
            syncResponse.getTradingPairModel(),
            []
        );
        return synchronizationModel;
    }
}
