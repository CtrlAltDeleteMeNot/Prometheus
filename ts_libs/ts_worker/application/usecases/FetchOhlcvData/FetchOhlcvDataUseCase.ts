import { UseCaseBase } from "../UseCaseBase";
import { FetchOhlcvDataRequest } from "./FetchOhlcvDataRequest";
import { FetchOhlcvDataResponse } from "./FetchOhlcvDataResponse";
import { ExchangeMethodsRegistry } from "../../../domain/exchange/ExchangeMethodsRegistry";
import { TradingPair } from "../../../domain/entities/TradingPair";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { InsufficientOhlcvDataError } from "../../../domain/errors/InsufficientOhlcvDataError";
import { TechnicalAnalisysRepository } from "../../../domain/ta/TechnicalAnalisysRepository";
import { TimeFrame } from "../../../domain/values/TimeFrame";

/**
 * Use case: fetch initial OHLCV data for multiple trading pairs
 */
export class FetchOhlcvDataUseCase extends UseCaseBase<FetchOhlcvDataRequest, FetchOhlcvDataResponse> {
    readonly #exchangeMethodsRegistry: ExchangeMethodsRegistry;
    readonly #technicalAnalisysRepository: TechnicalAnalisysRepository;
    constructor(technicalAnalisysRepository: TechnicalAnalisysRepository, exchangeMethodsRegistry: ExchangeMethodsRegistry) {
        super();
        this.#exchangeMethodsRegistry = exchangeMethodsRegistry;
        this.#technicalAnalisysRepository = technicalAnalisysRepository;
    }

    protected async run(
        requestModel: FetchOhlcvDataRequest
    ): Promise<FetchOhlcvDataResponse> {
        const tradingPairs = requestModel.getTradingPairs();
        const candlesPerTimeFrame = requestModel.getCandlesPerTimeFrame();
        const utcNowMs = requestModel.getUtcNowMilliseconds();
        const parallelCount = requestModel.getParallelRequestsCount();
        const results: MultiTimeframeOhlcv[] = [];
        const plugins = requestModel.getPlugins();

        for (let i = 0; i < tradingPairs.length; i += parallelCount) {
            const batchPairs = tradingPairs.slice(i, i + parallelCount);
            const batchResults = await Promise.all(batchPairs.map((tp) => {
                return this.#fetchOne(tp, utcNowMs, candlesPerTimeFrame)
            }));
            const filtered = batchResults.filter(s=>s!==undefined);
            filtered.forEach((batchResult, idx) => {
                results.push(batchResult);
                this.#technicalAnalisysRepository.addDataset(batchResult);
                this.#technicalAnalisysRepository.initializeIndicatorsWithDatasets(batchResult.getTradingPair());
                const absoluteIndex = i + idx;
                requestModel.reportProgress({
                    currentTradingPair: batchResult.getTradingPair(),
                    currentPairIndex: absoluteIndex + 1,
                    totalPairsCount: tradingPairs.length,
                });
            });
        }

        plugins.forEach(plugin => {
            results.forEach(res => {
                plugin.next(res.getTradingPair(), res.getUpdatedTimeFrames(), res.getBuffer(TimeFrame.ONE_MINUTE).getEndTime());
            });
        });

        return new FetchOhlcvDataResponse(results.length);
    }

    /**
     * Fetch OHLCV data for a single trading pair
     */
    async #fetchOne(
        tradingPair: TradingPair,
        utcNowMs: number,
        candlesPerTimeFrame: number
    ): Promise<MultiTimeframeOhlcv | undefined> {
        try {
            const methods = this.#exchangeMethodsRegistry.get(
                tradingPair.getExchangeDescriptor()
            );
            const toReturn = await methods.createMultiTimeframeOhlcv(
                tradingPair,
                utcNowMs,
                candlesPerTimeFrame
            );
            return toReturn;
        } catch (err) {
            if (InsufficientOhlcvDataError.isInstance(err)) {
                console.warn(err);
                return undefined;
            }
            throw err;
        }
    }
}
