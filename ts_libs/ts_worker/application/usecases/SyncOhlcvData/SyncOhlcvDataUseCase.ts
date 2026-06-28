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

interface TradingPairSyncResult {
    tradingPair: TradingPair;
    syncCount: number;
    tradingPairModel: TradingPairModel | undefined;
}

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
        const nowMillis = requestModel.getUtcNowMilliseconds();
        const shouldSync = buffers.some(buffer => {
            const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();
            const gap = nowMillis - nextStart;
            return gap > TimeFrame.ONE_MINUTE.asMilliseconds();
        });
        if (shouldSync === false) {
            return new SyncOhlcvDataResponse(0, [], []);
        }

        let tradingPairModels: TradingPairModel[] = [];
        let signalModels: SignalModel[] = [];
        const parallelCount = requestModel.getParalelRequestsCount();
        for (let i = 0; i < buffers.length; i += parallelCount) {
            const batch = buffers.slice(i, i + parallelCount);
            const results = await Promise.all(batch.map((buffer) => this.#syncOne(requestModel, buffer, nowMillis)));

            for (let j = 0; j < results.length; j++) {
                const syncResult = results[j];
                const tradingPair = syncResult.tradingPair;
                const tradingPairIndex = i + j + 1;
                if (syncResult.tradingPairModel !== undefined) {
                    tradingPairModels.push(syncResult.tradingPairModel);
                }
                await requestModel.reportProgress({
                    currentTradingPair: tradingPair,
                    syncCount: syncResult.syncCount,
                    currentPairIndex: tradingPairIndex,
                    totalPairsCount: buffers.length
                });
            }
        }
        this.drainSignals(signalModels, requestModel);
        return new SyncOhlcvDataResponse(buffers.length, tradingPairModels, signalModels);
    }

    private shouldSync(){
        
    }

    private drainSignals(signalModels: SignalModel[], requestModel: SyncOhlcvDataRequest) {
        const plugins = requestModel.getPlugins();
        plugins.forEach(plugin => {
            if (!(plugin instanceof BaseSignalGenerator)) {
                return;
            }

            if (plugin.getSignalsCount() > 0) {
                const drained = plugin.drain();
                drained.forEach((m) => signalModels.push(this.createSingleSignalModel(m)));
            }
        });
        signalModels.sort((first, second) => first.timestamp - second.timestamp);
    }

    createSingleSignalModel(s: SignalData): SignalModel {
        const tradingPair = s.tradingPair;
        const exchange = tradingPair.getExchangeDescriptor();
        const tradingPairUrl = this.#exchangeMethodsRegistry.get(exchange).getTradingPairUrl(tradingPair);
        var model = new SignalModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            tradingPairUrl,
            s.source.getFriendlyDescription(),
            s.signalDirection,
            s.timeStamp
        );
        //console.info(JSON.stringify(model.serialize()));
        return model;
    }



    async #syncOne(requestModel: SyncOhlcvDataRequest, mtfBuffer: MultiTimeframeOhlcv, timeStamp: number): Promise<TradingPairSyncResult> {
        const tradingPair: TradingPair = mtfBuffer.getTradingPair();
        const exchangeDescriptor = tradingPair.getExchangeDescriptor();
        const methods = this.#exchangeMethodsRegistry.get(exchangeDescriptor);
        const plugins = requestModel.getPlugins();
        const newEntries = await methods.syncOneMinuteTimeFrame(
            mtfBuffer,
            timeStamp
        );
        if (newEntries === undefined || newEntries === null || newEntries.length === 0) {
            return {
                tradingPair: tradingPair,
                tradingPairModel: undefined,
                syncCount: 0
            };
        }
        for (var entry of newEntries) {
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

            plugins.forEach(plugin => {
                plugin.next(tradingPair, updatedTimeFrames, entry.endTime);
            });
        }

        let tradingPairModel: TradingPairModel = this.createSingleTradingPairModel(tradingPair, plugins);

        return {
            tradingPair: tradingPair,
            syncCount: newEntries.length,
            tradingPairModel: tradingPairModel
        };
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
