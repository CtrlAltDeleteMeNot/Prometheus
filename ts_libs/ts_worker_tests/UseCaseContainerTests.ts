import { UseCaseContainer } from "../ts_worker/application/usecases/UseCaseContainer";
import { EnumerateExchangesRequest } from "../ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { FilterTradingPairsRequest } from "../ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { FetchOhlcvDataRequest } from "../ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest";
import { SyncOhlcvDataRequest } from "../ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest";
import { TimeFrame } from "../ts_worker/domain/values/TimeFrame";
import { Assert } from "./Assert";
import { Asset } from "../ts_worker/domain/values/Asset";

export class UseCaseContainerTests {

    static async RunFull(): Promise<void> {
        console.log("Initializing UseCaseContainer...");
        const container = await UseCaseContainer.Create();

        // -------------------------
        // Test 1: Enumerate Exchanges
        // -------------------------
        console.log("Enumerating exchanges...");
        const exchangesResponse = await container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest());
        console.log("Exchanges:", exchangesResponse.descriptors);
        Assert.assertTrue(exchangesResponse.descriptors.length >= 2, "Expected at least 2 exchanges.");

        // -------------------------
        // Test 2: Filter Trading Pairs
        // -------------------------
        console.log("Fetching trading pairs...");
        const usdc = Asset.fromUnknown("USDC");
        const usdt = Asset.fromUnknown("USDT");

        const tradingPairsRequest = new FilterTradingPairsRequest(
            exchangesResponse.descriptors,
            [usdc],
            [usdc, usdt]
        );

        const tradingPairsResponse = await container.filterTradingPairsUseCase.execute(tradingPairsRequest);
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        Assert.assertTrue(tradingPairs.length > 0, "Expected at least 1 trading pair.");
        console.log("Trading Pairs:", tradingPairs);

        // -------------------------
        // Test 3: Fetch OHLCV Data
        // -------------------------
        console.log("Fetching OHLCV data...");
        const candlesPerTimeFrame = 400;
        let timeNowMs = 1767513763334;
        const paralelRequestsCount = 80;

        const fetchOhlcvRequest = new FetchOhlcvDataRequest(
            tradingPairs,
            candlesPerTimeFrame,
            paralelRequestsCount,
            timeNowMs,
            (progressData) => {
                const exchangeName = progressData.currentTradingPair.getExchangeDescriptor().getName();
                const pairSymbol = progressData.currentTradingPair.symbol();
                console.log(`Fetched OHLCV from ${exchangeName} for ${pairSymbol} [${progressData.currentPairIndex} / ${progressData.totalPairsCount}]`);
            }
        );

        const fetchOhlcvResponse = await container.fetchOhlcvDataUseCase.execute(fetchOhlcvRequest);
        const mtfData = fetchOhlcvResponse.getMultiTimeFrameData();
        Assert.assertTrue(mtfData.length > 0, "Expected OHLCV data for each trading pair.");
        console.log("INITIAL OHLCV Data:", mtfData);

        // -------------------------
        // Test 4: Sync OHLCV Data
        // -------------------------
        console.log("Syncing OHLCV data...");
        timeNowMs += TimeFrame.ONE_DAY.asMilliseconds() + TimeFrame.FOUR_HOURS.asMilliseconds();

        const syncOhlcvDataRequest = new SyncOhlcvDataRequest(
            mtfData,
            paralelRequestsCount,
            timeNowMs,
            (progressData) => {
                const exchangeName = progressData.currentTradingPair.getExchangeDescriptor().getName();
                const pairSymbol = progressData.currentTradingPair.symbol();
                console.log(`Synced ${progressData.syncCount} OHLCV from ${exchangeName} for ${pairSymbol} [${progressData.currentPairIndex} / ${progressData.totalPairsCount}]`);
            }
        );

        const syncOhlcvDataResponse = await container.syncOhlcvDataUseCase.execute(syncOhlcvDataRequest);
        console.log("SYNCHRONIZED OHLCV Data:", syncOhlcvDataResponse.getMultiTimeFrameData());

        

        console.log("All tests completed successfully ✅");
    }
}
