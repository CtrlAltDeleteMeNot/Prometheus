import { TradingPair } from "../../domain/entities/TradingPair";
import { BasePlugin } from "../../domain/ta/export/BasePlugin";
import { NamedAttributeMetadata, NumericNamedAttribute } from "../exports/NamedAttribute";

export abstract class BaseSortableAttributeExtractor extends BasePlugin {
    private values: Map<TradingPair, number> = new Map();
    public getNamedAttributeMetadata(): NamedAttributeMetadata {
        return new NamedAttributeMetadata(this.getId(), this.getFriendlyDescription(), 'number', this.getPrecision());
    }
    public extractNamedAttributeFrom(tp: TradingPair): NumericNamedAttribute {
        let extracted = this.getValue(tp);
        return NumericNamedAttribute.fromMetadata(this.getNamedAttributeMetadata(), extracted);
    }
    public getValue(tp: TradingPair): number | undefined {
        return this.values.get(tp);
    }
    public setValue(tp: TradingPair, val: number): void {
        this.values.set(tp, val);
    }
    protected abstract getPrecision(): number | undefined;
}