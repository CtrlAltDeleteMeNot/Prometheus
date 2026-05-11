import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../../exports/NamedAttribute";
import { TradingPairModel } from "../../exports/TradingPairModel";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyPriceChangeExtractor extends BaseSortableAttributeExtractor {
    private metadata: NamedAttributeMetadata;
    public constructor() {
        super();
        this.metadata = TradingPairModel.dailyPercentChangeMetadata();
    }
    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): NumericNamedAttribute {
        const dayBuffer = data.getBuffer(TimeFrame.ONE_DAY);
        const minuteBuffer = data.getBuffer(TimeFrame.ONE_MINUTE);
        const dayOpenPrice = dayBuffer.getPendingCandle().open;
        const currentPrice = minuteBuffer.getClose();
        const percentChange = ((currentPrice - dayOpenPrice) / dayOpenPrice) * 100;
        return NumericNamedAttribute.fromMetadata(this.metadata, percentChange, 2);
    }

    public getId(): string {
        return DailyPriceChangeExtractor.name;
    }
}