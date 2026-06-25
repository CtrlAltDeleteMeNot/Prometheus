import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { RvaIndicator, RvaIndicatorParameters } from "../../../domain/ta/indicators/RvaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyPendingRvaExtractor extends BaseSortableAttributeExtractor {
    
    private params: RvaIndicatorParameters;
    public constructor() {
        super();
        this.params = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>,  ts:number): void {
        const indicator = this.findIndicator(tradingPair, this.params) as RvaIndicator;
        if (false === indicator.isReady()) {
            return;
        }
        let pendingValue = indicator.getPendingValue().getRelativeValue();
        this.setValue(tradingPair, pendingValue);
    }

    protected getPrecision(): number | undefined {
        return 2;
    }

    public getFriendlyDescription(): string {
        return `Pending ${this.params.getDescription()}`;
    }

    public getId(): string {
        return DailyPendingRvaExtractor.name;
    }
}