import { TradingPair } from "../../../domain/entities/TradingPair";
import { BasePlugin } from "../../../domain/ta/export/BasePlugin";

export interface SyncFetchOhlcvProgress {
    currentTradingPair: TradingPair;
    syncCount: number;
    currentPairIndex: number;
    totalPairsCount: number;
}

export interface SyncExecutePluginsProgress {
    pluginsCount: number;
    totalPairsCount: number;
    currentCandleIndex: number;
    totalCandlesCount: number;
}

export type SyncFetchOhlcvProgressCallback =
    (progress: SyncFetchOhlcvProgress) => void;
export type SyncExecutePluginsProgressCallback =
    (progress: SyncExecutePluginsProgress) => void;

export class SyncOhlcvDataRequest {
    #paralelRequestsCount: number;
    #utcNowMs: number;
    #syncFetchOhlcvProgressCallback: SyncFetchOhlcvProgressCallback;
    #syncExecutePluginsProgressCallback:SyncExecutePluginsProgressCallback;
    #plugins: readonly BasePlugin[];

    constructor(
        plugins: readonly BasePlugin[],
        paralelRequestsCount: number,
        utcNowMs: number,
        syncFetchOhlcvProgressCallback: SyncFetchOhlcvProgressCallback,
        syncExecutePluginsProgressCallback: SyncExecutePluginsProgressCallback
    ) {
        // Validate input types
        if (paralelRequestsCount <= 0) throw new RangeError("paralelRequestsCount must be > 0");

        this.#plugins = plugins;
        this.#paralelRequestsCount = paralelRequestsCount;
        this.#utcNowMs = utcNowMs;
        this.#syncFetchOhlcvProgressCallback = syncFetchOhlcvProgressCallback;
        this.#syncExecutePluginsProgressCallback = syncExecutePluginsProgressCallback;

        Object.freeze(this);
    }

    reportFetchProgress(progressData: SyncFetchOhlcvProgress): void {
        this.#syncFetchOhlcvProgressCallback(progressData);
    }

    reportExecutePluginsProgress(progressData: SyncExecutePluginsProgress): void {
        this.#syncExecutePluginsProgressCallback(progressData);
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
