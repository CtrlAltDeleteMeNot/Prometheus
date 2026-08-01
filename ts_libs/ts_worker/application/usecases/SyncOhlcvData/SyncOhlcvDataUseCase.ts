import { UseCaseBase } from "../UseCaseBase";
import { SyncOhlcvDataRequest } from "./SyncOhlcvDataRequest";
import { SyncOhlcvDataResponse } from "./SyncOhlcvDataResponse";
import { ExchangeMethodsRegistry } from "../../../domain/exchange/ExchangeMethodsRegistry";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TradingPair } from "../../../domain/entities/TradingPair";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { TechnicalAnalisysRepository } from "../../../domain/ta/TechnicalAnalisysRepository";
import { TradingPairModel } from "../../exports/TradingPairModel";
import { BasePlugin } from "../../../domain/ta/export/BasePlugin";
import { BaseFilterableAttributeExtractor } from "../../plugins/BaseFilterableAttributeExtractor";
import { BaseSortableAttributeExtractor } from "../../plugins/BaseSortableAttributeExtractor";
import { SignalModel } from "../../exports/SignalModel";
import { BaseSignalGenerator, SignalData } from "../../plugins/BaseSignalGenerator";
import { OhlcvEntry } from "../../../domain/values/OhlcvEntry";



export class SyncOhlcvDataUseCase extends UseCaseBase<SyncOhlcvDataRequest, SyncOhlcvDataResponse> {
    readonly #exchangeMethodsRegistry: ExchangeMethodsRegistry;
    readonly #technicalAnalisysRepository: TechnicalAnalisysRepository;

    constructor(technicalAnalisysRepository: TechnicalAnalisysRepository, exchangeMethodsRegistry: ExchangeMethodsRegistry) {
        super();
        this.#exchangeMethodsRegistry = exchangeMethodsRegistry;
        this.#technicalAnalisysRepository = technicalAnalisysRepository;
    }

    protected async run(requestModel: SyncOhlcvDataRequest): Promise<SyncOhlcvDataResponse> {
        const buffers = Array.from(this.#technicalAnalisysRepository.getDatasets().values());

        const shouldSync = this.shouldSync(buffers, requestModel);
        if (shouldSync === false) {
            return new SyncOhlcvDataResponse(0, [], []);
        }
        const data = await this.multiFetch(buffers, requestModel);
        this.runDataProcessingPipeline(data, requestModel);
        const signalModels = this.drainSignals(requestModel);
        const tradingPairModels = this.mapModels(buffers, requestModel);
        return new SyncOhlcvDataResponse(buffers.length, tradingPairModels, signalModels);
    }

    mapModels(buffers: readonly MultiTimeframeOhlcv[], requestModel: SyncOhlcvDataRequest): readonly TradingPairModel[] {
        const plugins = requestModel.getPlugins();
        return buffers.map(b => this.createSingleTradingPairModel(b.getTradingPair(), plugins));
    }

    runDataProcessingPipeline(data: Map<TradingPair, OhlcvEntry[]>, requestModel: SyncOhlcvDataRequest) {
        const tradingPairs = Array.from(data.keys());
        const plugins = requestModel.getPlugins();
        const referenceTradingPair = tradingPairs[0];
        const referenceOhlcvEntriesCount = data.get(referenceTradingPair)?.length;
        if (referenceOhlcvEntriesCount === undefined) {
            throw new Error("Pipeline inconsistency, first trading pair has no associated ohlcv items.");
        }
        const sameOhlcvEntriesCount = tradingPairs.every((tp, idx) => referenceOhlcvEntriesCount === data.get(tp)?.length);
        if (false === sameOhlcvEntriesCount) {
            throw new Error("Pipeline inconsistency, all entries should have same amount of ohlcv items.");
        }
        for (let i: number = 0; i < referenceOhlcvEntriesCount; i++) {
            requestModel.reportExecutePluginsProgress({
                currentCandleIndex: i,
                pluginsCount: plugins.length,
                totalCandlesCount: referenceOhlcvEntriesCount,
                totalPairsCount: tradingPairs.length
            });
            const updatedByTradingPair = new Map<TradingPair, ReadonlyMap<TimeFrame, boolean>>();
            const timestampByTradingPair = new Map<TradingPair, number>();
            //first, update all indicators to have consistent correlations in plugins, one ohlcv entry at a time
            for (let j: number = 0; j < tradingPairs.length; j++) {
                const tradingPair = tradingPairs[j];
                const targetEntries = data.get(tradingPair);
                if (targetEntries === undefined) {
                    throw new Error("Pipeline inconsistency, target does not have any ohlcv items.");
                }
                const entry = targetEntries[i];
                var updatedTimeFrames = this.#technicalAnalisysRepository.pushUpdate(
                    tradingPair,
                    entry.timeFrame,
                    entry.open,
                    entry.high,
                    entry.low,
                    entry.close,
                    entry.volume,
                    entry.startTime,
                    entry.endTime,
                    entry.isClosed
                );

                updatedTimeFrames.forEach((isUpdated, timeFrame) => {
                    if (!isUpdated) {
                        return;
                    }
                    this.#technicalAnalisysRepository.updateIndicators(tradingPair, timeFrame);
                });
                updatedByTradingPair.set(tradingPair, updatedTimeFrames);
                timestampByTradingPair.set(tradingPair, entry.endTime);
            }
            // Phase 2: run plugins after all pairs are updated for this candle index
            for (const tradingPair of tradingPairs) {
                const updatedTimeFrames = updatedByTradingPair.get(tradingPair);
                const entryTs = timestampByTradingPair.get(tradingPair);

                if (updatedTimeFrames === undefined || entryTs === undefined) {
                    throw new Error("Pipeline inconsistency, missing data for plugin input.");
                }

                plugins.forEach(plugin => {
                    plugin.next(tradingPair, updatedTimeFrames, entryTs);
                });
            }
        }


    }

    private async multiFetch(buffers: MultiTimeframeOhlcv[], requestModel: SyncOhlcvDataRequest): Promise<Map<TradingPair, OhlcvEntry[]>> {
        const toReturn = new Map<TradingPair, OhlcvEntry[]>();
        const nowMillis = requestModel.getUtcNowMilliseconds();
        const parallelCount = requestModel.getParalelRequestsCount();
        for (let i = 0; i < buffers.length; i += parallelCount) {
            const batch = buffers.slice(i, i + parallelCount);
            const tasks = batch.map(b => this.fetchOneMinuteCandleSticks(b, nowMillis, toReturn));
            await Promise.all(tasks);
            batch.forEach((r, idxBatch) => {
                const tp = r.getTradingPair();
                const count = toReturn.get(tp)?.length ?? 0;
                requestModel.reportFetchProgress({
                    currentTradingPair: tp,
                    syncCount: count,
                    currentPairIndex: i + idxBatch,
                    totalPairsCount: buffers.length
                });
            });
        }
        return toReturn;
    }

    private shouldSync(buffers: MultiTimeframeOhlcv[], requestModel: SyncOhlcvDataRequest): boolean {
        const oneMinuteAsMilliseconds = TimeFrame.ONE_MINUTE.asMilliseconds();
        const nowMillis = requestModel.getUtcNowMilliseconds();
        const shouldSync = buffers.every(buffer => {
            const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + oneMinuteAsMilliseconds;
            const gap = nowMillis - nextStart;
            return gap > oneMinuteAsMilliseconds;
        });
        return shouldSync;
    }

    private drainSignals(requestModel: SyncOhlcvDataRequest): SignalModel[] {
        const toReturn: SignalModel[] = [];
        const plugins = requestModel.getPlugins();
        plugins.forEach(plugin => {
            if (!(plugin instanceof BaseSignalGenerator)) {
                return;
            }

            if (plugin.getSignalsCount() > 0) {
                const drained = plugin.drain();
                drained.forEach((m) => toReturn.push(this.createSingleSignalModel(m)));
            }
        });
        toReturn.sort((first, second) => first.timestamp - second.timestamp);
        return toReturn;
    }

    createSingleSignalModel(signalData: SignalData): SignalModel {
        const tradingPair = signalData.tradingPair;
        const exchange = tradingPair.getExchangeDescriptor();
        const tradingPairUrl = this.#exchangeMethodsRegistry.get(exchange).getTradingPairUrl(tradingPair);
        var model = new SignalModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            tradingPairUrl,
            signalData.source.getFriendlyDescription(),
            signalData.signalDirection,
            signalData.timeStamp,
            signalData.orderDetails?.entryPrice,
            signalData.orderDetails?.stopLossPrice,
            signalData.orderDetails?.takeProfitLevels
        );
        return model;
    }

    private async fetchOneMinuteCandleSticks(mtfBuffer: MultiTimeframeOhlcv, timestamp: number, storage: Map<TradingPair, OhlcvEntry[]>): Promise<void> {
        const tradingPair: TradingPair = mtfBuffer.getTradingPair();
        const exchangeDescriptor = tradingPair.getExchangeDescriptor();
        const methods = this.#exchangeMethodsRegistry.get(exchangeDescriptor);

        const newEntries = await methods.syncOneMinuteTimeFrame(
            mtfBuffer,
            timestamp
        );
        if (newEntries === undefined) {
            throw new Error("No new data available");
        }
        storage.set(tradingPair, newEntries);
    }

    createSingleTradingPairModel(tradingPair: TradingPair, plugins: readonly BasePlugin[]): TradingPairModel {
        const exchange = tradingPair.getExchangeDescriptor();
        const tradingPairUrl = this.#exchangeMethodsRegistry.get(exchange).getTradingPairUrl(tradingPair);

        var model = new TradingPairModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            tradingPairUrl
        );

        plugins.forEach(plugin => {
            if (plugin instanceof BaseFilterableAttributeExtractor) {
                model.addAttr(plugin.extractNamedAttributeFrom(tradingPair));
            }
            if (plugin instanceof BaseSortableAttributeExtractor) {
                model.addAttr(plugin.extractNamedAttributeFrom(tradingPair));
            }
        });
        return model;
    }




}
