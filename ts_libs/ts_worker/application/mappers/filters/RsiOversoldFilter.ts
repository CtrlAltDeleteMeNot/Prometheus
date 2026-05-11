import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiIndicator, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, BooleanNamedAttribute } from "../../exports/NamedAttribute";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOversoldFilter extends BaseFilterableAttributeExtractor {
    params: RsiIndicatorParameters;
    metadata: NamedAttributeMetadata;
    oversoldTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, oversoldTreshold: number) {
        super();
        this.oversoldTreshold = oversoldTreshold;
        this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
        this.metadata = new NamedAttributeMetadata(`rsi.oversold.filter.${this.params.getId()} < ${oversoldTreshold}`, `${this.params.getDescription()} <= ${oversoldTreshold}`, 'boolean');
    }

    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): BooleanNamedAttribute {
        const indicator = data.findIndicator(this.params) as RsiIndicator;
        if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
        }
        const isOversold = this.oversoldTreshold > indicator.getValue().getValue();
        return BooleanNamedAttribute.fromMetadata(this.metadata, isOversold);
    }

    public getId(): string {
        return `${RsiOversoldFilter.name}.${this.getNamedAttributeMetadata().key}`;
    }
}