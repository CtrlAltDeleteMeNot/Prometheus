import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiIndicatorOutput, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOversoldFilter extends BaseFilterableAttributeExtractor {
    params: RsiIndicatorParameters;
    oversoldTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, oversoldTreshold: number) {
        super();
        this.oversoldTreshold = oversoldTreshold;
        this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
    }

    public getId(): string {
        return `rsi.oversold.filter.${this.params.getId()} < ${this.oversoldTreshold}`;
    }
    public getFriendlyDescription(): string {
        return `Oversold: ${this.params.getDescription()} <= ${this.oversoldTreshold}`
    }
    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts:number): void {
        if (!updatedTimeFrames.get(this.params.getTimeFrame())) {
            return;
        }
        const indicator = this.findIndicator(tradingPair, this.params);
        const indicatorReady = this.isIndicatorReady(indicator);
        if (!indicatorReady) {
            return;
        }
        const indicatorOutput = this.getIndicatorValue(indicator, 0) as RsiIndicatorOutput;
        const isOversold = indicatorOutput.getValue() < this.oversoldTreshold;
        this.setValue(tradingPair, isOversold);
    }

}