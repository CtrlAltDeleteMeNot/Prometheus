import { TradingPair } from "../entities/TradingPair";
import { ExchangeDescriptor } from "../exchange/ExchangeDescriptor";
import { Asset } from "../values/Asset";

export class InsufficientOhlcvDataError extends Error {
    readonly reason: string;
    readonly baseAsset: Asset;
    readonly quoteAsset: Asset;
    readonly exchangeDescriptor: ExchangeDescriptor;

    /**
     * @param reason - Why the data is insufficient
     * @param baseAsset - Base asset symbol
     * @param quoteAsset - Quote asset symbol
     * @param exchangeDescriptor - Exchange name
     */
    constructor(reason: string, pair: TradingPair) {
        super(`Insufficient OHLCV data for ${pair.symbol()} on ${pair.getExchangeDescriptor().getName()}: ${reason}`);
        this.name = "InsufficientOhlcvDataError";

        this.reason = reason;
        this.baseAsset = pair.getBaseAsset();
        this.quoteAsset = pair.getQuoteAsset();
        this.exchangeDescriptor = pair.getExchangeDescriptor();

        Object.freeze(this);
    }

    /**
     * Safe type guard for this error across realms/bundles
     */
    static isInstance(err: unknown): err is InsufficientOhlcvDataError {
        return err instanceof InsufficientOhlcvDataError;
    }
}
