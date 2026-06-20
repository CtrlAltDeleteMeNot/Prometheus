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

interface TradingPairSyncResult {
    multiTimeframeBuffer: MultiTimeframeOhlcv;
    syncCount: number;
    mappedModel: TradingPairModel | undefined;
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
        const parallelCount = requestModel.getParalelRequestsCount();
        const ts = requestModel.getUtcNowMilliseconds();
        const shouldSync = buffers.some(buffer => {
            const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();
            const gap = ts - nextStart;
            return gap > TimeFrame.ONE_MINUTE.asMilliseconds();
        });
        let tradingPairModels: TradingPairModel[] = [];
        if (shouldSync === false) {
            return new SyncOhlcvDataResponse(0, tradingPairModels);
        }

        for (let i = 0; i < buffers.length; i += parallelCount) {
            const batch = buffers.slice(i, i + parallelCount);
            const results = await Promise.all(batch.map((buffer) => this.#syncOne(requestModel, buffer, ts)));

            for (let j = 0; j < results.length; j++) {
                const syncResult = results[j];
                const tradingPair = syncResult.multiTimeframeBuffer.getTradingPair();
                const tradingPairIndex = i + j + 1;
                if (syncResult.mappedModel !== undefined) {
                    tradingPairModels.push(syncResult.mappedModel);
                }
                await requestModel.reportProgress({
                    currentTradingPair: tradingPair,
                    syncCount: syncResult.syncCount,
                    currentPairIndex: tradingPairIndex,
                    totalPairsCount: buffers.length
                });
            }
        }
        return new SyncOhlcvDataResponse(buffers.length, tradingPairModels);
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
                multiTimeframeBuffer: mtfBuffer,
                mappedModel: undefined,
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
            
            updatedTimeFrames.forEach((isUpdated,timeFrame) => {
                if(!isUpdated){
                    return;
                }
                this.#technicalAnalisysRepository.updateIndicators(tradingPair, timeFrame);
            });
            
            plugins.forEach(plugin => {
                plugin.next(tradingPair, updatedTimeFrames);
            });
        }

        let mappedModel: TradingPairModel = this.mapUiData(mtfBuffer, plugins);

        return {
            multiTimeframeBuffer: mtfBuffer,
            syncCount: newEntries.length,
            mappedModel: mappedModel
        };
    }

    mapUiData(mtfBuffer: MultiTimeframeOhlcv, plugins: readonly BasePlugin[]): TradingPairModel {
       
        const tradingPair = mtfBuffer.getTradingPair();
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
