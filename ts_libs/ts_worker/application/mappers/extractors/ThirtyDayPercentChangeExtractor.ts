import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { PctChangeIndicator, PctChangeIndicatorParameters } from "../../../domain/ta/indicators/PctChangeIndicator";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../../exports/NamedAttribute";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class ThirtyDayPercentChangeExtractor extends BaseSortableAttributeExtractor {
    private params: PctChangeIndicatorParameters;
    private metadata: NamedAttributeMetadata;
    public constructor() {
        super();
        this.params = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, new Period(30), Source.CLOSE);
        this.metadata = new NamedAttributeMetadata(this.params.getId(), '30 Days Change %', 'number');
    }

    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): NumericNamedAttribute {
        const indicator = data.findIndicator(this.params) as PctChangeIndicator;
        if (indicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, indicator.getValue().getValue(), 2);
        }
        return NumericNamedAttribute.fromMetadata(this.metadata, undefined, undefined);
    }

    public getId(): string {
        return ThirtyDayPercentChangeExtractor.name;
    }
}