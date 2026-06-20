import { TradingPair } from "../../../domain/entities/TradingPair";
import { BasePlugin } from "../../../domain/ta/export/BasePlugin";

export interface SyncOhlcvProgress {
    currentTradingPair: TradingPair;
    syncCount: number;
    currentPairIndex: number;
    totalPairsCount: number;
}
export type SyncOhlcvProgressCallback =
    (progress: SyncOhlcvProgress) => Promise<void>;

export class SyncOhlcvDataRequest {
    #paralelRequestsCount: number;
    #utcNowMs: number;
    #progressCallback: SyncOhlcvProgressCallback;
    #plugins: readonly BasePlugin[];

    constructor(
        plugins: readonly BasePlugin[],
        paralelRequestsCount: number,
        utcNowMs: number,
        progressCallback: SyncOhlcvProgressCallback
    ) {
        // Validate input types
        if (paralelRequestsCount <= 0) throw new RangeError("paralelRequestsCount must be > 0");

        this.#plugins = plugins;
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

    getParalelRequestsCount(): number {
        return this.#paralelRequestsCount;
    }

    getPlugins(): readonly BasePlugin[] {
        return this.#plugins;
    }
}
