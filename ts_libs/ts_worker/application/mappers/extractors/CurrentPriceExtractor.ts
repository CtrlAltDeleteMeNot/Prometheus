import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../../exports/NamedAttribute";
import { TradingPairModel } from "../../exports/TradingPairModel";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class CurrentPriceExtractor extends BaseSortableAttributeExtractor {

    private metadata: NamedAttributeMetadata;
    public constructor() {
        super();
        this.metadata = TradingPairModel.currentPriceMetadata();
    }

    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): NumericNamedAttribute {
        const minuteBuffer = data.getBuffer(TimeFrame.ONE_MINUTE);
        const currentPrice = minuteBuffer.getClose();
        return NumericNamedAttribute.fromMetadata(TradingPairModel.currentPriceMetadata(), currentPrice);
    }

    public getId(): string {
        return CurrentPriceExtractor.name;
    }
}