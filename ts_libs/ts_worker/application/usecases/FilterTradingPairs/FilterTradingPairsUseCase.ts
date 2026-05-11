import { UseCaseBase } from "../UseCaseBase";
import { FilterTradingPairsRequest } from "./FilterTradingPairsRequest";
import { FilterTradingPairsResponse } from "./FilterTradingPairsResponse";
import { TradingPairsRepository } from "../../../domain/repositories/TradingPairsRepository";
import { TradingPair } from "../../../domain/entities/TradingPair";

/**
 * Use case: filter trading pairs by exchange and quote asset constraints
 */
export class FilterTradingPairsUseCase extends UseCaseBase<
    FilterTradingPairsRequest,
    FilterTradingPairsResponse
> {
    readonly #tradingPairRepository: TradingPairsRepository;

    constructor(tradingPairRepository: TradingPairsRepository) {
        super();
        this.#tradingPairRepository = tradingPairRepository;
    }

    protected async run(requestModel: FilterTradingPairsRequest): Promise<FilterTradingPairsResponse> {

        const pairs: TradingPair[] =
            this.#tradingPairRepository.filter(
                requestModel.getExchanges(),
                requestModel.getQuoteAssets()
            );

        if (!requestModel.requiresFullQuoteCoverage()) {
            if (pairs.length === 0) {
                throw new Error("No matching trading pairs.");
            }
            return new FilterTradingPairsResponse(this.applyLimit(pairs, requestModel));
        }

        const covered: TradingPair[] = [];
        const requiredQuotes = requestModel.getRequiredQuoteAssets();

        for (const pair of pairs) {
            const baseAsset = pair.getBaseAsset();
            const exchange = pair.getExchangeDescriptor();

            let acceptable = true;

            for (const quoteAsset of requiredQuotes) {
                if (!this.#tradingPairRepository.isTradingPairAvailable(exchange, baseAsset, quoteAsset)) {
                    acceptable = false;
                    break;
                }
            }

            if (acceptable) {
                covered.push(pair);
            }
        }

        if (covered.length === 0) {
            throw new Error("No matching trading pairs.");
        }

        return new FilterTradingPairsResponse(this.applyLimit(covered, requestModel));
    }

    private applyLimit(pairs: TradingPair[], request: FilterTradingPairsRequest): TradingPair[] {
        const limit = request.getLimit();
        if (limit === undefined || limit < 1) {
            return pairs;
        }

        const grouped = new Map<number, TradingPair[]>();
        for (const pair of pairs) {
            const exchange = pair.getExchangeDescriptor().getId();
            if (!grouped.has(exchange)) {
                grouped.set(exchange, []);
            }
            grouped.get(exchange)!.push(pair);
        }

        const result: TradingPair[] = [];
        for (const [, exchangePairs] of grouped) {
            result.push(...exchangePairs.slice(0, limit));
        }

        return result;
    }
}
