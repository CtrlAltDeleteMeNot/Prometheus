import { TradingPair } from "../../domain/entities/TradingPair";
import { BasePlugin } from "../../domain/ta/export/BasePlugin";
import { BooleanNamedAttribute, NamedAttributeMetadata } from "../exports/NamedAttribute";

export abstract class BaseFilterableAttributeExtractor extends BasePlugin {
    private values: Map<TradingPair, boolean> = new Map();
    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return new NamedAttributeMetadata(this.getId(), this.getFriendlyDescription(), 'boolean');
    }

    public extractNamedAttributeFrom(tp: TradingPair): BooleanNamedAttribute {
        let extracted = this.getValue(tp);
        return BooleanNamedAttribute.fromMetadata(this.getNamedAttributeMetadata(), extracted);
    }

    public getValue(tp: TradingPair): boolean | undefined {
        return this.values.get(tp);
    }

    public setValue(tp: TradingPair, val: boolean): void {
        this.values.set(tp, val);
    }
}