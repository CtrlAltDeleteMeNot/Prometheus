import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiIndicator, RsiIndicatorOutput, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator } from "../BaseSignalGenerator";

export class RsiCrossoverSignalGenerator extends BaseSignalGenerator {
    rsiParams: RsiIndicatorParameters;
    oversoldThreshold: number;
    public constructor(period: Period, timeFrame: TimeFrame, oversoldTreshold: number) {
        super();
        this.oversoldThreshold = oversoldTreshold;
        this.rsiParams = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
    }

    public getId(): string {
        return `rsi.crossover.treshold.signal.${this.rsiParams.getId()} X ${this.oversoldThreshold}`;
    }

    public getFriendlyDescription(): string {
        return `${this.rsiParams.getDescription()} crossed over ${this.oversoldThreshold}`
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        const timeFrame = this.rsiParams.getTimeFrame();

        if (updatedTimeFrames.get(timeFrame) !== true) {
            return;
        }
        const indicator = this.findIndicator(tradingPair, this.rsiParams) as RsiIndicator;
        if (indicator.getValuesCount() < 2) {
            return;
        }
        const previous = this.getIndicatorValue(indicator, 1) as RsiIndicatorOutput;
        const current = this.getIndicatorValue(indicator, 0) as RsiIndicatorOutput;

        const crossedUp =
            previous.getValue() <= this.oversoldThreshold &&
            current.getValue() > this.oversoldThreshold;

        if (!crossedUp) {
            return;
        }

        this.emit(tradingPair, SignalDirection.BULLISH, ts);
    }
}