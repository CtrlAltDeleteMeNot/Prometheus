import { ExchangeDescriptor } from '../exchange/ExchangeDescriptor';
import { Asset } from '../values/Asset';

/**
 * Represents a trading pair on a specific exchange.
 */
export class TradingPair {
    // Private fields
    #baseAsset: Asset;
    #quoteAsset: Asset;
    #exchangeDescriptor: ExchangeDescriptor;

    /**
     * @param exchangeDescriptor - ExchangeDescriptor
     * @param baseAsset - Base asset
     * @param quoteAsset - Quote asset
     */
    constructor(
        exchangeDescriptor: ExchangeDescriptor,
        baseAsset: Asset,
        quoteAsset: Asset
    ) {
        this.#exchangeDescriptor = ExchangeDescriptor.fromUnknown(exchangeDescriptor);
        this.#baseAsset = Asset.fromUnknown(baseAsset);
        this.#quoteAsset = Asset.fromUnknown(quoteAsset);

        Object.freeze(this); // Immutable instance
    }

    /** Returns the base asset */
    getBaseAsset(): Asset {
        return this.#baseAsset;
    }

    /** Returns the quote asset */
    getQuoteAsset(): Asset {
        return this.#quoteAsset;
    }

    /** Returns the symbol concatenation (e.g., BTCUSDT) */
    symbol(): string {
        return this.#baseAsset.toString() + this.#quoteAsset.toString();
    }

    /** Returns a unique ID string for this trading pair */
    getId(): string {
        return `${this.#baseAsset.toString()} ${this.#quoteAsset.toString()} ${this.#exchangeDescriptor.getName()} ${this.#exchangeDescriptor.getId()}`;
    }

    /** Returns the ExchangeDescriptor associated with this pair */
    getExchangeDescriptor(): ExchangeDescriptor {
        return this.#exchangeDescriptor;
    }

    /**
     * Runtime validation: ensures the object is a TradingPair
     * @param aTradingPair - object to validate
     */
    static fromUnknown(aTradingPair: unknown): TradingPair {
        if (!(aTradingPair instanceof TradingPair)) {
            throw new TypeError("aTradingPair must be an instance of TradingPair");
        }
        return aTradingPair;
    }
}
