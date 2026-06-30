import { UseCaseContainer } from "../ts_worker/application/usecases/UseCaseContainer";
import { TimeProvider } from "../ts_worker/infrastructure/time/TimeProvider";
import { describe, test, expect } from '@jest/globals';
import { EnumerateExchangesRequest } from "../ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { Asset } from "../ts_worker/domain/values/Asset";
import { FilterTradingPairsRequest } from "../ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { FetchOhlcvDataRequest } from "../ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest";
import { TimeFrame } from "../ts_worker/domain/values/TimeFrame";
import { SyncOhlcvDataRequest } from "../ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest";
import { RegisterPluginsRequest } from "../ts_worker/application/usecases/RegisterPlugins/RegisterPluginsRequest";



describe("TimeProvider", () => {
    test("returns valid UTC milliseconds", async () => {
        const timeProvider = new TimeProvider();
        const millis = await timeProvider.getUtcNowMilliseconds(true);
        expect(millis).toBeDefined();
        expect(millis).toBeGreaterThan(0);
    });
});

describe("Container", () => {
    test("can be used", async () => {
        const container = await UseCaseContainer.Create();
        expect(container).toBeDefined();
        const settings = UseCaseContainer.CreateDefaultSettings(container);
        
        // -------------------------
        // Test 1: Enumerate Exchanges
        // -------------------------
        console.log("Enumerating exchanges...");
        const exchangesResponse = await container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest(settings.getIncludedExchangeNames()));
        console.log("Exchanges:", exchangesResponse.descriptors);
        expect(exchangesResponse.descriptors.length).toEqual(2);

        // -------------------------
        // Test 2: Filter Trading Pairs
        // -------------------------
        console.log("Fetching trading pairs...");
        const usdc = Asset.fromUnknown("USDC");
        const usdt = Asset.fromUnknown("USDT");
        const tradingPairsRequest = new FilterTradingPairsRequest(
            exchangesResponse.descriptors,
            [usdc],
            [usdc, usdt],
            undefined,
            5
        );
        const tradingPairsResponse = await container.filterTradingPairsUseCase.execute(tradingPairsRequest);
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        expect(tradingPairs.length).toBeGreaterThanOrEqual(10);

        // -------------------------
        // Test 3: Init plugins
        // -------------------------
        const registerPluginsRequest = new RegisterPluginsRequest(container.pluginManager.plugins, tradingPairs);
        const registerPluginsResponse = await container.registerPluginsUseCase.execute(registerPluginsRequest);
        const plugins = registerPluginsResponse.plugins;

        // -------------------------
        // Test 4: Fetch OHLCV Data
        // -------------------------
        
        console.log("Fetching OHLCV data...");
        const candlesPerTimeFrame = 400;
        const paralelRequestsCount = 10;
        const sixHoursAsMillis = 21_600_000;
        const timeNowMs = await container.timeProvider.getUtcNowMilliseconds();
        let initMs = timeNowMs - sixHoursAsMillis;
        const fetchOhlcvRequest = new FetchOhlcvDataRequest(
            tradingPairs,
            candlesPerTimeFrame,
            paralelRequestsCount,
            initMs,
            plugins,
            (fetchOhlcvDataProgress) => {
                let percent = 0.5 * (fetchOhlcvDataProgress.currentTradingPairIndex * 100) / fetchOhlcvDataProgress.totalTradingPairsCount;
                const message = `Downloading historical candles (${fetchOhlcvDataProgress.currentTradingPairIndex}/${fetchOhlcvDataProgress.totalTradingPairsCount}) \n ${fetchOhlcvDataProgress.currentTradingPair.symbol()} from ${fetchOhlcvDataProgress.currentTradingPair.getExchangeDescriptor().getName()}`;
                progressCallback(percent, message);
            },
            (executePluginProgress) => {
                let percent = 50 + 0.2 * (executePluginProgress.currentPluginIndex * 100) / executePluginProgress.totalPluginsCount;
                const message = `Analyzing market data (${executePluginProgress.currentPluginIndex}/${executePluginProgress.totalPluginsCount}) \n ${executePluginProgress.currentPlugin.getFriendlyDescription()}`;
                progressCallback(percent, message);
            }
        );
        const fetchOhlcvResponse = await container.fetchOhlcvDataUseCase.execute(fetchOhlcvRequest);
        const datasets = container.technicalAnalisysRepository.getDatasets();
        expect(tradingPairs.length).toStrictEqual(fetchOhlcvResponse.getCount());
        datasets.forEach(element => {
            expect(element.getBuffer(TimeFrame.ONE_MINUTE).size()).toStrictEqual(candlesPerTimeFrame);
        });


        // -------------------------
        // Test 4: Sync OHLCV Data
        // -------------------------
        console.log("Syncing OHLCV data...");

        const syncOhlcvDataRequest = new SyncOhlcvDataRequest(
            plugins,
            paralelRequestsCount,
            timeNowMs,
            (fetchProgress) => {
                let percent = 70 + 0.2 * (fetchProgress.currentPairIndex * 100) / fetchProgress.totalPairsCount;
                const message =
                    `Synchronizing latest candles (${fetchProgress.currentPairIndex}/${fetchProgress.totalPairsCount})\n` +
                    `Downloaded ${fetchProgress.syncCount} new candle${fetchProgress.syncCount === 1 ? "" : "s"} for ` +
                    `${fetchProgress.currentTradingPair.symbol()} from ${fetchProgress.currentTradingPair.getExchangeDescriptor().getName()}`;
                progressCallback(percent, message);
            },
            (pluginsExecutionProgress) => {
                let percent = 90 + 0.1 * (pluginsExecutionProgress.currentCandleIndex * 100) / pluginsExecutionProgress.totalCandlesCount;
                const message =
                    `Analyzing market data (${pluginsExecutionProgress.currentCandleIndex}/${pluginsExecutionProgress.totalCandlesCount})\n` +
                    `Scanning ${pluginsExecutionProgress.totalPairsCount} trading pairs using ${pluginsExecutionProgress.pluginsCount} plugins`;
                progressCallback(percent, message);
            }
        );

        const syncOhlcvDataResponse = await container.syncOhlcvDataUseCase.execute(syncOhlcvDataRequest);
        expect(syncOhlcvDataResponse.getUpdatedEntriesCount()).toStrictEqual(tradingPairs.length);
        

        const syncOhlcvDataWithEmptyResponse = await container.syncOhlcvDataUseCase.execute(syncOhlcvDataRequest);
        expect(syncOhlcvDataWithEmptyResponse.getUpdatedEntriesCount()).toStrictEqual(0);
    }, 1000000);

});

function progressCallback(percent: number, message: string) {
    console.info(`${percent} % - ${message}`);
}
