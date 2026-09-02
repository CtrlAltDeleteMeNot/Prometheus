import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { RvaAccessor, RvaIndicator, RvaIndicatorParameters } from "../../../domain/ta/indicators/RvaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyRvaExtractor extends BaseSortableAttributeExtractor {

    private rva: RvaAccessor;
    public constructor() {
        super();
        this.rva = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(50));
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts: number): void {
        if (false === updatedTimeFrames.get(TimeFrame.ONE_DAY)) {
            return;
        }
        this.findAndStoreRva(tradingPair);
    }

    private findAndStoreRva(tradingPair: TradingPair) {
        const isReady = this.rva.isReady(tradingPair);
        if (!isReady) {
            return;
        }
        let relativeValue = this.rva.get(tradingPair).getRelativeValue();
        this.setValue(tradingPair, relativeValue);
    }

    protected getPrecision(): number | undefined {
        return 2;
    }

    public getFriendlyDescription(): string {
        return this.rva.getParameters().getDescription();
    }

    public getId(): string {
        return DailyRvaExtractor.name;
    }
}