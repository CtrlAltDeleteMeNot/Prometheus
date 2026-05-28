import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { SmaIndicator, SmaIndicatorParameters } from "../../../domain/ta/indicators/SmaIndicator";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, BooleanNamedAttribute } from "../../exports/NamedAttribute";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class SmaDowntrendFilter extends BaseFilterableAttributeExtractor {
    params: SmaIndicatorParameters;
    metadata: NamedAttributeMetadata;
    public constructor(period: Period, timeFrame: TimeFrame) {
        super();
        this.params = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
        this.metadata = new NamedAttributeMetadata(`close.below.${this.params.getId()}`, `Downtrend: ${this.params.getDescription()} > Close`, 'boolean');
    }
    
    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): BooleanNamedAttribute {
        const indicator = data.findIndicator(this.params) as SmaIndicator;
        const close = data.getBuffer(this.params.timeFrame).getClose();
        if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
        }
        const isDowntrend = close < indicator.getValue().getValue();
        return BooleanNamedAttribute.fromMetadata(this.metadata, isDowntrend);
    }

    public getId(): string {
        return `${SmaDowntrendFilter.name}.${this.getNamedAttributeMetadata().key}`;
    }

}