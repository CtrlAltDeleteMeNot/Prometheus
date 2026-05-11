import { TradingPair } from '../entities/TradingPair';
import { ExchangeDescriptor } from '../exchange/ExchangeDescriptor';
import { Asset } from '../values/Asset';

export class TradingPairsRepository {
    private pairs: TradingPair[] = [];

    /* ============================
     * Public Instance Methods
     * ============================ */

    /** Check if repository is empty */
    isEmpty(): boolean {
        return this.pairs.length === 0;
    }

    /**
     * Filter trading pairs by exchanges and quote assets
     * @param exchanges - Array of ExchangeDescriptor
     * @param quoteAssets - Array of quote asset symbols
     * @returns Array of TradingPair
     */
    filter(exchanges: ExchangeDescriptor[], quoteAssets: Asset[]): TradingPair[] {
        const givenExchangeIds = new Set(
            exchanges.map(e => ExchangeDescriptor.fromUnknown(e).getId())
        );
        const givenAssets = new Set(
            quoteAssets.map(e => Asset.fromUnknown(e).toString())
        );
        

        return this.pairs.filter(
            p =>
                givenExchangeIds.has(p.getExchangeDescriptor().getId()) &&
                givenAssets.has(p.getQuoteAsset().toString())
        );
    }

    /**
     * Lookup a TradingPair by exchange + base + quote
     * @param exchangeDescriptor
     * @param baseAsset
     * @param quoteAsset
     * @returns TradingPair
     */
    lookup(exchangeDescriptor: ExchangeDescriptor, baseAsset: Asset, quoteAsset: Asset): TradingPair {
        const base = Asset.fromUnknown(baseAsset);
        const quote = Asset.fromUnknown(quoteAsset);
        const exchangeId = ExchangeDescriptor.fromUnknown(exchangeDescriptor).getId();

        const toReturn = this.pairs.find(
            p =>
                p.getExchangeDescriptor().getId() === exchangeId &&
                p.getBaseAsset().equals(base) &&
                p.getQuoteAsset().equals(quote)
        );

        if (!toReturn) {
            throw new Error(
                `Pair ${baseAsset.toString()}/${quoteAsset.toString()} was not found on ${exchangeDescriptor.getName()}`
            );
        }

        return TradingPair.fromUnknown(toReturn);
    }

    /**
     * Check if a trading pair is available
     * @param exchangeDescriptor
     * @param baseAsset
     * @param quoteAsset
     */
    isTradingPairAvailable(exchangeDescriptor: ExchangeDescriptor, baseAsset: Asset, quoteAsset: Asset): boolean {
        const base = Asset.fromUnknown(baseAsset);
        const quote = Asset.fromUnknown(quoteAsset);
        const exchangeId = ExchangeDescriptor.fromUnknown(exchangeDescriptor).getId();

        const match = this.pairs.find(
            p =>
                p.getExchangeDescriptor().getId() === exchangeId &&
                p.getBaseAsset().equals(base) &&
                p.getQuoteAsset().equals(quote)
        );

        if (!match) {
            return false;
        }

        const _ = TradingPair.fromUnknown(match);
        return true;
    }

    /** Get a copy of all registered trading pairs */
    getPairs(): readonly TradingPair[] {
        return this.pairs;
    }

    /** Register a new trading pair */
    registerPair(tradingPair: TradingPair): void {
        this.pairs.push(TradingPair.fromUnknown(tradingPair));
    }
}
