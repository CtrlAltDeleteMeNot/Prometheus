import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiIndicator, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, BooleanNamedAttribute } from "../../exports/NamedAttribute";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOverboughtFilter extends BaseFilterableAttributeExtractor {
    params: RsiIndicatorParameters;
    metadata: NamedAttributeMetadata;
    overboughtTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, overboughtTreshold: number) {
        super();
        this.overboughtTreshold = overboughtTreshold;
        this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
        this.metadata = new NamedAttributeMetadata(`rsi.overbought.filter.${this.params.getId()} > ${overboughtTreshold}`, `Overbought: ${this.params.getDescription()} >= ${overboughtTreshold}`, 'boolean');
    }

    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): BooleanNamedAttribute {
        const indicator = data.findIndicator(this.params) as RsiIndicator;
        if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
        }
        const isOverBought = this.overboughtTreshold < indicator.getValue().getValue();
        return BooleanNamedAttribute.fromMetadata(this.metadata, isOverBought);
    }

    public getId(): string {
        return `${RsiOverboughtFilter.name}.${this.getNamedAttributeMetadata().key}`;
    }
}