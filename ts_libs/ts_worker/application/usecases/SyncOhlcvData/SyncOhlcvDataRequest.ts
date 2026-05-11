import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TradingPair } from "../../../domain/entities/TradingPair";

export interface SyncOhlcvProgress {
    currentTradingPair: TradingPair;
    syncCount: number;
    currentPairIndex: number;
    totalPairsCount: number;
}
export type SyncOhlcvProgressCallback =
    (progress: SyncOhlcvProgress) => Promise<void>;

export class SyncOhlcvDataRequest {
    #multiTimeFrameData: readonly MultiTimeframeOhlcv[];
    #paralelRequestsCount: number;
    #utcNowMs: number;
    #progressCallback: SyncOhlcvProgressCallback;

    constructor(
        multiTimeFrameData: readonly MultiTimeframeOhlcv[],
        paralelRequestsCount: number,
        utcNowMs: number,
        progressCallback: SyncOhlcvProgressCallback
    ) {
        // Validate input types
        multiTimeFrameData.forEach(mtf => MultiTimeframeOhlcv.fromUnknown(mtf));
        if (paralelRequestsCount <= 0) throw new RangeError("paralelRequestsCount must be > 0");

        this.#multiTimeFrameData = multiTimeFrameData;
        this.#paralelRequestsCount = paralelRequestsCount;
        this.#utcNowMs = utcNowMs;
        this.#progressCallback = progressCallback;

        Object.freeze(this);
    }

    reportProgress(progressData: SyncOhlcvProgress): Promise<void> {
        return this.#progressCallback(progressData);
    }

    getUtcNowMilliseconds(): number {
        return this.#utcNowMs;
    }

    getTradingPairBuffers(): readonly MultiTimeframeOhlcv[] {
        return this.#multiTimeFrameData;
    }

    getParalelRequestsCount(): number {
        return this.#paralelRequestsCount;
    }
}
