import { MultiTimeframeOhlcv } from "../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../domain/values/TimeFrame";
import { TradingPairModel } from "../exports/TradingPairModel";
import { ExchangeMethodsRegistry } from "../../domain/exchange/ExchangeMethodsRegistry";
import { BaseSortableAttributeExtractor } from "./BaseSortableAttributeExtractor";
import { BaseFilterableAttributeExtractor } from "./BaseFilterableAttributeExtractor";

export class ScreenerItemMapper {
    #exchangeMethodRegistry: ExchangeMethodsRegistry;

    constructor(exchangeMethodRegistry: ExchangeMethodsRegistry) {
        this.#exchangeMethodRegistry = exchangeMethodRegistry;
    }
    /**
     * Map an array of MultiTimeframeOhlcv to TradingPairModel[]
     * @param buffers 
     */
    public mapMultiple(sortableAttributeExtractors: readonly BaseSortableAttributeExtractor[], filterableAttributeExtractors: readonly BaseFilterableAttributeExtractor[], buffers: readonly MultiTimeframeOhlcv[]): TradingPairModel[] {
        return buffers.map(buffer => this.mapSingle(sortableAttributeExtractors, filterableAttributeExtractors, buffer));
    }

    /**
     * Map a single MultiTimeframeOhlcv to TradingPairModel
     * @param buffer 
     */
    public mapSingle(sortableAttributeExtractors: readonly BaseSortableAttributeExtractor[], filterableAttributeExtractors: readonly BaseFilterableAttributeExtractor[], buffer: MultiTimeframeOhlcv): TradingPairModel {
        const minuteBuffer = buffer.getBuffer(TimeFrame.ONE_MINUTE);
        const tradingPair = buffer.getTradingPair();
        const exchange = tradingPair.getExchangeDescriptor();
        const tradingPairUrl = this.#exchangeMethodRegistry.get(exchange).getTradingPairUrl(tradingPair);
        const currentPrice = minuteBuffer.getClose();
        var model = new TradingPairModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            currentPrice,
            tradingPairUrl
        );

        for (let index = 0; index < sortableAttributeExtractors.length; index++) {
            const extractor = sortableAttributeExtractors[index];
            model.addAttr(extractor.extractNamedAttributeFrom(buffer))
        }

         for (let index = 0; index < filterableAttributeExtractors.length; index++) {
            const extractor = filterableAttributeExtractors[index];
            model.addAttr(extractor.extractNamedAttributeFrom(buffer))
        }


        return model;
    }
}
