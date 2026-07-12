import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiAccessor, RsiIndicatorOutput, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOversoldFilter extends BaseFilterableAttributeExtractor {

    rsi: RsiAccessor;
    oversoldTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, oversoldTreshold: number) {
        super();
        this.oversoldTreshold = oversoldTreshold;
        this.rsi = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
    }

    public getId(): string {
        return `rsi.oversold.filter.${this.rsi.getParameters().getId()} < ${this.oversoldTreshold}`;
    }
    public getFriendlyDescription(): string {
        return `Oversold: ${this.rsi.getParameters().getDescription()} <= ${this.oversoldTreshold}`
    }
    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        if (false === this.wasUpdated(updatedTimeFrames, this.rsi.getParameters().getTimeFrame())) {
            return;
        }
        this.updateBooleanAttribute(tradingPair);
    }


    private updateBooleanAttribute(tradingPair: TradingPair): void {
        const ready = this.rsi.isReady(tradingPair);
        if (!ready) {
            return;
        }
        const indicatorOutput = this.rsi.get(tradingPair);
        const isOversold = indicatorOutput.getValue() < this.oversoldTreshold;
        this.setValue(tradingPair, isOversold);
    }

}