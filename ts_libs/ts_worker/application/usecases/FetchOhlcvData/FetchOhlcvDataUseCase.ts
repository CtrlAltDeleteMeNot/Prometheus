import { UseCaseBase } from "../UseCaseBase";
import { FetchOhlcvDataRequest } from "./FetchOhlcvDataRequest";
import { FetchOhlcvDataResponse } from "./FetchOhlcvDataResponse";
import { ExchangeMethodsRegistry } from "../../../domain/exchange/ExchangeMethodsRegistry";
import { TradingPair } from "../../../domain/entities/TradingPair";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { InsufficientOhlcvDataError } from "../../../domain/errors/InsufficientOhlcvDataError";
import { TechnicalAnalisysRepository } from "../../../domain/ta/TechnicalAnalisysRepository";
import { IndicatorParameters } from "../../../domain/ta/indicators/Indicator";
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


            for (let j = 0; j < batchResults.length; j++) {
                const result = batchResults[j];
                if (!result) continue;
                results.push(result);
                const absoluteIndex = i + j;
                await requestModel.reportProgress({
                    currentTradingPair: result.getTradingPair(),
                    currentPairIndex: absoluteIndex + 1,
                    totalPairsCount: tradingPairs.length,
                });
            }
        }
        
        plugins.forEach(plugin => {
            results.forEach(res=>{
                plugin.next(res.getTradingPair(),res.getUpdatedTimeFrames(), res.getBuffer(TimeFrame.ONE_MINUTE).getEndTime());
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
    ): Promise<MultiTimeframeOhlcv | null> {
        try {
            const methods = this.#exchangeMethodsRegistry.get(
                tradingPair.getExchangeDescriptor()
            );

            var toReturn = await methods.createMultiTimeframeOhlcv(
                tradingPair,
                utcNowMs,
                candlesPerTimeFrame
            );

            this.#technicalAnalisysRepository.addDataset(toReturn);
            this.#technicalAnalisysRepository.initializeIndicatorsWithDatasets(tradingPair);

            return toReturn;
        } catch (err) {
            if (InsufficientOhlcvDataError.isInstance(err)) {
                console.warn(err);
                return null;
            }
            throw err;
        }
    }
}
