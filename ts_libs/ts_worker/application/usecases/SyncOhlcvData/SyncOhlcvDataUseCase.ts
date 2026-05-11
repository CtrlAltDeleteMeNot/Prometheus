import { UseCaseBase } from "../UseCaseBase";
import { SyncOhlcvDataRequest } from "./SyncOhlcvDataRequest";
import { SyncOhlcvDataResponse } from "./SyncOhlcvDataResponse";
import { ExchangeMethodsRegistry } from "../../../domain/exchange/ExchangeMethodsRegistry";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TradingPair } from "../../../domain/entities/TradingPair";
import { TimeFrame } from "../../../domain/values/TimeFrame";

interface TradingPairSyncResult {
    multiTimeframeBuffer: MultiTimeframeOhlcv;
    syncCount: number
}
export class SyncOhlcvDataUseCase extends UseCaseBase<SyncOhlcvDataRequest, SyncOhlcvDataResponse> {
    #exchangeMethodsRegistry: ExchangeMethodsRegistry;

    constructor(exchangeMethodsRegistry: ExchangeMethodsRegistry) {
        super();
        this.#exchangeMethodsRegistry = exchangeMethodsRegistry;
    }

    protected async run(requestModel: SyncOhlcvDataRequest): Promise<SyncOhlcvDataResponse> {
        const buffers: readonly MultiTimeframeOhlcv[] = requestModel.getTradingPairBuffers();
        const parallelCount = requestModel.getParalelRequestsCount();
        const ts = requestModel.getUtcNowMilliseconds();
        const shouldSync = buffers.some(buffer => {
            const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();
            const gap = ts - nextStart;
            return gap > TimeFrame.ONE_MINUTE.asMilliseconds();
        });

        if (shouldSync === false) {
            return new SyncOhlcvDataResponse(buffers, 0);
        }
        for (let i = 0; i < buffers.length; i += parallelCount) {
            const batch = buffers.slice(i, i + parallelCount);
            const results = await Promise.all(batch.map((buffer) => this.#syncOne(buffer, ts)));

            for (let j = 0; j < results.length; j++) {
                const syncResult = results[j];
                const tradingPair = syncResult.multiTimeframeBuffer.getTradingPair();
                const tradingPairIndex = i + j + 1;

                await requestModel.reportProgress({
                    currentTradingPair: tradingPair,
                    syncCount: syncResult.syncCount,
                    currentPairIndex: tradingPairIndex,
                    totalPairsCount: buffers.length
                });
            }
        }

        return new SyncOhlcvDataResponse(buffers, buffers.length);
    }

    async #syncOne(mtfBuffer: MultiTimeframeOhlcv, timeStamp: number): Promise<TradingPairSyncResult> {
        const tradingPair: TradingPair = mtfBuffer.getTradingPair();
        const exchangeDescriptor = tradingPair.getExchangeDescriptor();
        const methods = this.#exchangeMethodsRegistry.get(exchangeDescriptor);
        const count = await methods.syncMultiTimeFrameOhlcv(
            mtfBuffer,
            timeStamp
        );
        return {
            multiTimeframeBuffer: mtfBuffer,
            syncCount: count
        };
    };

}
