import { BaseEvaluator } from "../../domain/ta/evaluators/BaseEvaluator";
import { MultiTimeframeOhlcv } from "../../domain/values/MultiTimeframeOhlcv";
import { BooleanNamedAttribute, NamedAttributeMetadata } from "../exports/NamedAttribute";

export abstract class BaseFilterableAttributeExtractor extends BaseEvaluator {
    public abstract getNamedAttributeMetadata(): NamedAttributeMetadata;
    public abstract extractNamedAttributeFrom(data:MultiTimeframeOhlcv): BooleanNamedAttribute;
}