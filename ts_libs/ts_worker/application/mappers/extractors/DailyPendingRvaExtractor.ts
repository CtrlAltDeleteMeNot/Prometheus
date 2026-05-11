import { Period } from "../../../domain/ta/core/Period";
import { RvaIndicator, RvaIndicatorParameters } from "../../../domain/ta/indicators/RvaIndicator";
import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../../exports/NamedAttribute";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyPendingRvaExtractor extends BaseSortableAttributeExtractor {
    private rvaParams: RvaIndicatorParameters;
    private metadata: NamedAttributeMetadata;
    public constructor() {
        super();
        this.rvaParams = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
        this.metadata = new NamedAttributeMetadata(`pending.${this.rvaParams.getId()}`, `Pending ${this.rvaParams.getDescription()}`, 'number');
    }

    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return this.metadata;
    }

    public extractNamedAttributeFrom(data: MultiTimeframeOhlcv): NumericNamedAttribute {
        const rvaIndicator = data.findIndicator(this.rvaParams) as RvaIndicator;
        if (rvaIndicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, rvaIndicator.computePending(), 2);
        }
        return NumericNamedAttribute.fromMetadata(this.metadata, undefined, undefined);
    }

    public getId(): string {
        return DailyPendingRvaExtractor.name;
    }
}