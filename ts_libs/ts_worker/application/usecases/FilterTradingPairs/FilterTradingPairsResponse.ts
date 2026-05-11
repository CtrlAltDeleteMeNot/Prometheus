import { TradingPair } from "../../../domain/entities/TradingPair";

/**
 * Response model for FilterTradingPairsUseCase
 */
export class FilterTradingPairsResponse {
    readonly #tradingPairs: readonly TradingPair[];

    constructor(tradingPairs: readonly TradingPair[]) {
        this.#tradingPairs = Object.freeze([...tradingPairs]);
        Object.freeze(this);
    }

    /**
     * Returns filtered trading pairs
     */
    getTradingPairs(): TradingPair[] {
        return [...this.#tradingPairs];
    }
}
