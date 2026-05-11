import { TradingPair } from "../../../domain/entities/TradingPair";

export interface FetchOhlcvProgress {
    currentTradingPair: TradingPair;
    currentPairIndex: number;
    totalPairsCount: number;
}

export type FetchOhlcvProgressCallback =
    (progress: FetchOhlcvProgress) => Promise<void>;

export class FetchOhlcvDataRequest {
    readonly #tradingPairs: readonly TradingPair[];
    readonly #candlesPerTimeFrame: number;
    readonly #parallelRequestsCount: number;
    readonly #utcNowMs: number;
    readonly #progressCallback: FetchOhlcvProgressCallback;

    constructor(
        tradingPairs: TradingPair[],
        candlesPerTimeFrame: number,
        parallelRequestsCount: number,
        utcNowMs: number,
        progressCallback: FetchOhlcvProgressCallback
    ) {
        this.#tradingPairs = Object.freeze([...tradingPairs]);
        this.#candlesPerTimeFrame = candlesPerTimeFrame;
        this.#parallelRequestsCount = parallelRequestsCount;
        this.#utcNowMs = utcNowMs;
        this.#progressCallback = progressCallback;

        Object.freeze(this);
    }

    reportProgress(progress: FetchOhlcvProgress): Promise<void> {
        return this.#progressCallback(progress);
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
}
