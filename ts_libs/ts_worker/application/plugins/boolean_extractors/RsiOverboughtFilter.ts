import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiAccessor, RsiIndicatorOutput } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class RsiOverboughtFilter extends BaseFilterableAttributeExtractor {

    rsi: RsiAccessor;
    overboughtTreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, overboughtTreshold: number) {
        super();
        this.overboughtTreshold = overboughtTreshold;
        this.rsi = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
    }

    public getId(): string {
        return `rsi.oversold.filter.${this.rsi.getParameters().getId()} > ${this.overboughtTreshold}`;
    }

    public getFriendlyDescription(): string {
        return `Overbought: ${this.rsi.getParameters().getDescription()} > ${this.overboughtTreshold}`
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        if (false === this.wasUpdated(updatedTimeFrames, this.rsi.getParameters().getTimeFrame())) {
            return;
        }
        this.updateBooeanAttribute(tradingPair);
    }

    private updateBooeanAttribute(tradingPair: TradingPair) {
        const indicatorReady = this.rsi.isReady(tradingPair);
        if (!indicatorReady) {
            return;
        }
        const indicatorOutput = this.rsi.get(tradingPair);
        const isOverbought = indicatorOutput.getValue() > this.overboughtTreshold;
        this.setValue(tradingPair, isOverbought);
    }
}