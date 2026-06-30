import { TradingPair } from "../../../domain/entities/TradingPair";
import { BasePlugin } from "../../../domain/ta/export/BasePlugin";

export interface FetchOhlcvProgress {
    currentTradingPair: TradingPair;
    currentTradingPairIndex: number;
    totalTradingPairsCount: number;
}


export interface ExecutePluginProgress {
    currentPlugin: BasePlugin;
    currentPluginIndex: number;
    totalPluginsCount: number;
}

export type FetchOhlcvProgressCallback = (progress: FetchOhlcvProgress) => void;
export type ExecutePluginProgressCallback = (progress: ExecutePluginProgress) => void;



export class FetchOhlcvDataRequest {
    readonly #tradingPairs: readonly TradingPair[];
    readonly #candlesPerTimeFrame: number;
    readonly #parallelRequestsCount: number;
    readonly #utcNowMs: number;
    readonly #plugins: readonly BasePlugin[];
    readonly #fetchOhlcvProgressCallback: FetchOhlcvProgressCallback;
    readonly #executePluginProgressCallback: ExecutePluginProgressCallback;
    
    constructor(
        tradingPairs: TradingPair[],
        candlesPerTimeFrame: number,
        parallelRequestsCount: number,
        utcNowMs: number,
        plugins: readonly BasePlugin[],
        fetchOhlcvProgressCallback: FetchOhlcvProgressCallback,
        executePluginProgressCallback: ExecutePluginProgressCallback
    ) {
        this.#tradingPairs = Object.freeze([...tradingPairs]);
        this.#candlesPerTimeFrame = candlesPerTimeFrame;
        this.#parallelRequestsCount = parallelRequestsCount;
        this.#utcNowMs = utcNowMs;
        this.#plugins = plugins;
        this.#fetchOhlcvProgressCallback = fetchOhlcvProgressCallback;
        this.#executePluginProgressCallback = executePluginProgressCallback;
    }

    reportFetchOhlcvProgress(progress: FetchOhlcvProgress): void {
        this.#fetchOhlcvProgressCallback(progress);
    }

    reportExecutePluginProgress(progress: ExecutePluginProgress): void {
        this.#executePluginProgressCallback(progress);
    }

    getUtcNowMilliseconds(): number {
        return this.#utcNowMs;
    }

    getCandlesPerTimeFrame(): number {
        return this.#candlesPerTimeFrame;
    }

    getTradingPairs(): readonly TradingPair[] {
        return this.#tradingPairs;
    }

    getParallelRequestsCount(): number {
        return this.#parallelRequestsCount;
    }

    getPlugins() {
        return this.#plugins;
    }
}
