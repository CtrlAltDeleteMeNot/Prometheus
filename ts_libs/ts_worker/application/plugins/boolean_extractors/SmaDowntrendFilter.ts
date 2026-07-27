import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class SmaDowntrendFilter extends BaseFilterableAttributeExtractor {
    
    sma: SmaAccessor;
    public constructor(period: Period, timeFrame: TimeFrame) {
        super();
        this.sma = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
    }
    public getId(): string {
        return `close.under.${this.sma.getParameters().getId()}`;
    }
    public getFriendlyDescription(): string {
        return `Downtrend: ${this.sma.getParameters().getDescription()} > Close`;
    }
    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts: number): void {
        if (false === this.wasUpdated(updatedTimeFrames, this.sma.getParameters().getTimeFrame())) {
            return;
        }
        this.updateBooleanAttribute(tradingPair);
    }

    private updateBooleanAttribute(tradingPair: TradingPair) {
        const isReady = this.sma.isReady(tradingPair);
        if (!isReady) {
            return;
        }
        const isDowntrend = this.sma.isDowntrend(tradingPair);
        this.setValue(tradingPair, isDowntrend);
    }


}