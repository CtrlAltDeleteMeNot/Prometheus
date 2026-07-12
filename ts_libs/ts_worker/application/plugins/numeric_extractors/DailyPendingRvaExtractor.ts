import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { RvaAccessor, RvaIndicator } from "../../../domain/ta/indicators/RvaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyPendingRvaExtractor extends BaseSortableAttributeExtractor {
    
    private rva: RvaAccessor;
    public constructor() {
        super();
        this.rva = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>,  ts:number): void {
        const isReady = this.rva.isReady(tradingPair);
        if (!isReady) {
            return;
        }
        let pendingValue = this.rva.pending(tradingPair).getRelativeValue();
        this.setValue(tradingPair, pendingValue);
    }

    protected getPrecision(): number | undefined {
        return 2;
    }

    public getFriendlyDescription(): string {
        return `Pending ${this.rva.getParameters().getDescription()}`;
    }

    public getId(): string {
        return DailyPendingRvaExtractor.name;
    }
}