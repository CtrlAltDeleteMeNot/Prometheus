import { UseCaseContainer } from "../ts_worker/application/usecases/UseCaseContainer";
import { TimeProvider } from "../ts_worker/infrastructure/time/TimeProvider";
import { describe, test, expect } from '@jest/globals';
import { EnumerateExchangesRequest } from "../ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { Asset } from "../ts_worker/domain/values/Asset";
import { FilterTradingPairsRequest } from "../ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { FetchOhlcvDataRequest } from "../ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest";
import { TimeFrame } from "../ts_worker/domain/values/TimeFrame";
import { SyncOhlcvDataRequest } from "../ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest";
import { ExchangeMethodsBybit } from "../ts_worker/infrastructure/exchanges/ExchangeMethodsBybit";
import { TradingPair } from "../ts_worker/domain/entities/TradingPair";
import { ExchangeDescriptor } from "../ts_worker/domain/exchange/ExchangeDescriptor";
import { ExchangeDescriptorRegistry } from "../ts_worker/domain/exchange/ExchangeDescriptorRegistry";

const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

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
        // -------------------------
        // Test 1: Enumerate Exchanges
        // -------------------------
        console.log("Enumerating exchanges...");
        const exchangesResponse = await container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest());
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
            5000
        );
        const tradingPairsResponse = await container.filterTradingPairsUseCase.execute(tradingPairsRequest);
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        expect(tradingPairs.length).toBeGreaterThanOrEqual(10);

        // -------------------------
        // Test 3: Fetch OHLCV Data
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
            async (progressData) => {
                await delay(5);
                const exchangeName = progressData.currentTradingPair.getExchangeDescriptor().getName();
                const pairSymbol = progressData.currentTradingPair.symbol();
                console.log(`Fetched OHLCV from ${exchangeName} for ${pairSymbol} [${progressData.currentPairIndex} / ${progressData.totalPairsCount}]`);
            }
        );
        const fetchOhlcvResponse = await container.fetchOhlcvDataUseCase.execute(fetchOhlcvRequest);
        const initMtf = fetchOhlcvResponse.getMultiTimeFrameData();
        expect(initMtf.length).toStrictEqual(tradingPairs.length);
        initMtf.forEach(element => {
            expect(element.getBuffer(TimeFrame.ONE_MINUTE).size()).toStrictEqual(candlesPerTimeFrame);
        });


        // -------------------------
        // Test 4: Sync OHLCV Data
        // -------------------------
        console.log("Syncing OHLCV data...");

        const syncOhlcvDataRequest = new SyncOhlcvDataRequest(
            initMtf,
            paralelRequestsCount,
            timeNowMs,
            async (progressData) => {
                await delay(5);
                const exchangeName = progressData.currentTradingPair.getExchangeDescriptor().getName();
                const pairSymbol = progressData.currentTradingPair.symbol();
                console.log(`Synced ${progressData.syncCount} OHLCV from ${exchangeName} for ${pairSymbol} [${progressData.currentPairIndex} / ${progressData.totalPairsCount}]`);
            }
        );

        const syncOhlcvDataResponse = await container.syncOhlcvDataUseCase.execute(syncOhlcvDataRequest);
        const syncMtf = syncOhlcvDataResponse.getMultiTimeFrameData();
        expect(syncMtf.length).toStrictEqual(initMtf.length);
        expect(syncMtf).toStrictEqual(initMtf);
        expect(syncOhlcvDataResponse.getUpdatedEntriesCount()).toStrictEqual(initMtf.length);
        syncMtf.forEach(element => {
            expect(element.getBuffer(TimeFrame.ONE_MINUTE).size()).toStrictEqual(candlesPerTimeFrame);
        });

        const syncOhlcvDataWithEmptyResponse = await container.syncOhlcvDataUseCase.execute(syncOhlcvDataRequest);
        expect(syncOhlcvDataWithEmptyResponse.getUpdatedEntriesCount()).toStrictEqual(0);
    }, 1000000);

});