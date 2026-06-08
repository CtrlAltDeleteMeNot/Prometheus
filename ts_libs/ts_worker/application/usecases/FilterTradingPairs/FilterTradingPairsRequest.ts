import { ExchangeDescriptor } from "../../../domain/exchange/ExchangeDescriptor";
import { Asset } from "../../../domain/values/Asset";

/**
 * Request model for filtering trading pairs.
 *
 * - exchanges: limit to specific exchanges
 * - quoteAssets: include pairs quoted in ANY of these assets
 * - requiredQuoteAssets: include base assets ONLY if tradable against ALL of these assets
 */
export class FilterTradingPairsRequest {
    readonly #exchanges: readonly ExchangeDescriptor[];
    readonly #quoteAssets: readonly Asset[];
    readonly #requiredQuoteAssets: readonly Asset[];
    readonly #excludedBaseAssets: readonly Asset[];
    readonly #limit: number | undefined;

    constructor(
        exchanges: readonly ExchangeDescriptor[] = [],
        quoteAssets: readonly Asset[] = [],
        requiredQuoteAssets: readonly Asset[] = [],
        excludedBaseAssets: readonly Asset[] = [],
        limit: number | undefined = undefined
    ) {
        // Validate + canonicalize exchanges
        this.#exchanges = Object.freeze(
            exchanges.map(ex => ExchangeDescriptor.fromUnknown(ex))
        );

        // Validate + canonicalize quote assets
        this.#quoteAssets = Object.freeze(
            quoteAssets.map(a => Asset.fromUnknown(a))
        );

        // Validate + canonicalize required quote assets
        this.#requiredQuoteAssets = Object.freeze(
            requiredQuoteAssets.map(a => Asset.fromUnknown(a))
        );

        this.#excludedBaseAssets = Object.freeze(
            excludedBaseAssets.map(a => Asset.fromUnknown(a))
        );

        this.#limit = (limit !== undefined && limit > 0) ? limit : undefined;

        Object.freeze(this);
    }

    /** Exchanges to include */
    getExchanges(): ExchangeDescriptor[] {
        return [...this.#exchanges];
    }

    /** Quote assets to include (ANY match) */
    getQuoteAssets(): Asset[] {
        return [...this.#quoteAssets];
    }

    /** Quote assets that MUST ALL exist for a base asset */
    getRequiredQuoteAssets(): Asset[] {
        return [...this.#requiredQuoteAssets];
    }

     /** Base assets to exclude */
    getExcludedBaseAssets(): Asset[] {
        return [...this.#excludedBaseAssets];
    }

    /** Whether full quote coverage is required */
    requiresFullQuoteCoverage(): boolean {
        return this.#requiredQuoteAssets.length > 0;
    }

    /** Wheter to limit output sizes or not */
    getLimit(): number | undefined {
        return this.#limit;
    }
}
