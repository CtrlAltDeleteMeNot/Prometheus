import { BaseEvaluator } from "../../domain/ta/evaluators/BaseEvaluator";
import { MultiTimeframeOhlcv } from "../../domain/values/MultiTimeframeOhlcv";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../exports/NamedAttribute";

export abstract class BaseSortableAttributeExtractor extends BaseEvaluator {
    public abstract getNamedAttributeMetadata(): NamedAttributeMetadata;
    public abstract extractNamedAttributeFrom(data:MultiTimeframeOhlcv): NumericNamedAttribute;
}