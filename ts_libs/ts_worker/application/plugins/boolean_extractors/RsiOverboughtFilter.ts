import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiIndicatorOutput, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOverboughtFilter extends BaseFilterableAttributeExtractor {
    params: RsiIndicatorParameters;
    overboughtTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, overboughtTreshold: number) {
        super();
        this.overboughtTreshold = overboughtTreshold;
        this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
    }

    public getId(): string {
        return `rsi.oversold.filter.${this.params.getId()} > ${this.overboughtTreshold}`;
    }

    public getFriendlyDescription(): string {
        return `Overbought: ${this.params.getDescription()} > ${this.overboughtTreshold}`
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        if (!updatedTimeFrames.get(this.params.getTimeFrame())) {
            return;
        }
        const indicator = this.findIndicator(tradingPair, this.params);
        const indicatorReady = this.isIndicatorReady(indicator);
        if (!indicatorReady) {
            return;
        }
        const indicatorOutput = this.getIndicatorValue(indicator, 0) as RsiIndicatorOutput;
        const isOverbought = indicatorOutput.getValue() > this.overboughtTreshold;
        this.setValue(tradingPair, isOverbought);
    }

}