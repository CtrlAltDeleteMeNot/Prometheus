import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { WilderRollingMovingAverage } from "../core/WilderRollingMovingAverage";
import {
    Indicator,
    IndicatorOutput,
    IndicatorParameters
} from "./Indicator";
import { IndicatorAccessor } from "../export/IndicatorAccessor";
import { TradingPair } from "../../entities/TradingPair";

/**
 * ATR output container.
 */
export class AtrIndicatorOutput extends IndicatorOutput {

    #value: MutableFloat;

    constructor() {
        super();
        this.#value = new MutableFloat();
    }

    update(value: number): void {
        this.#value.update(value);
    }

    getValue(): number {
        return this.#value.getValue();
    }
}

/**
 * ATR parameters.
 */
export class AtrIndicatorParameters extends IndicatorParameters {

    public readonly timeFrame: TimeFrame;
    public readonly period: Period;

    constructor(
        timeFrame: TimeFrame,
        period: Period
    ) {
        super();

        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
    }

    getId(): string {
        return `ATR (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
    }

    getDescription(): string {
        return `ATR (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
    }

    getPeriod(): Period {
        return this.period;
    }

    getTimeFrame(): TimeFrame {
        return this.timeFrame;
    }

    createUsing(buffer: MultiTimeframeOhlcv): AtrIndicator {
        return new AtrIndicator(this, buffer);
    }

    static fromUnknown(value: unknown): AtrIndicatorParameters {
        if (!(value instanceof AtrIndicatorParameters)) {
            throw new TypeError(
                "Value is not an AtrIndicatorParameters instance"
            );
        }

        if (value.period.getValue() < 1) {
            throw new RangeError(
                "ATR period must be >= 1"
            );
        }

        return value;
    }
}

/**
 * Average True Range using Wilder smoothing.
 *
 * True Range:
 *
 * max(
 *     high - low,
 *     abs(high - previousClose),
 *     abs(low - previousClose)
 * )
 *
 * ATR:
 *
 * WilderMovingAverage(TrueRange, period)
 */
export class AtrIndicator extends Indicator<
    AtrIndicatorParameters,
    AtrIndicatorOutput
> {

    private readonly mtf: MultiTimeframeOhlcv;
    private readonly rolling: WilderRollingMovingAverage;
    private readonly history: RingBuffer<AtrIndicatorOutput>;

    private previousClose: number | null = null;

    constructor(
        parameters: AtrIndicatorParameters,
        mtf: MultiTimeframeOhlcv
    ) {
        super(AtrIndicatorParameters.fromUnknown(parameters));

        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);

        this.rolling = new WilderRollingMovingAverage(
            this.getParameters().getPeriod()
        );

        this.history = new RingBuffer<AtrIndicatorOutput>(
            this.mtf
                .getBuffer(this.getParameters().getTimeFrame())
                .getCapacity(),
            () => new AtrIndicatorOutput()
        );

        // Bootstrap existing candles.
        this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .stream((position: number, candle) => {
                this.#computeCore(
                    candle.high,
                    candle.low,
                    candle.close
                );
            });
    }

    isReady(): boolean {
        return this.history.getSize() > 0;
    }

    #computeTrueRange(
        high: number,
        low: number,
        previousClose: number | null
    ): number {

        const currentRange = high - low;

        // No previous candle available yet.
        if (previousClose === null) {
            return currentRange;
        }

        return Math.max(
            currentRange,
            Math.abs(high - previousClose),
            Math.abs(low - previousClose)
        );
    }

    #computeCore(
        high: number,
        low: number,
        close: number
    ): void {

        const trueRange = this.#computeTrueRange(
            high,
            low,
            this.previousClose
        );

        // Important: update only AFTER TR calculation.
        this.previousClose = close;

        const computed = this.rolling.push(trueRange);

        if (computed === null) {
            return;
        }

        this.history.push(
            sample => sample.update(computed)
        );
    }

    update(timeFrame: TimeFrame): void {

        const thisTf = this.getParameters().getTimeFrame();

        if (timeFrame !== thisTf) {
            return;
        }

        const candle = this.mtf
            .getBuffer(thisTf)
            .getCandle();

        this.#computeCore(
            candle.high,
            candle.low,
            candle.close
        );
    }

    getValue(n: number = 0): AtrIndicatorOutput {

        const value = this.history.get(n);

        if (!value) {
            throw new RangeError(
                "ATR value not available"
            );
        }

        return value;
    }

    getValuesCount(): number {
        return this.history.getSize();
    }

    getPendingValue(): AtrIndicatorOutput {
        throw new Error(
            "Method not implemented."
        );
    }
}

/**
 * ATR accessor.
 */
export class AtrAccessor extends IndicatorAccessor<
    AtrIndicatorParameters,
    AtrIndicatorOutput
> {

    findIndicatorOrThrow(tp: TradingPair): AtrIndicator {

        const indicator = this.plugin.findIndicator(
            tp,
            this.getParameters()
        );

        if (!(indicator instanceof AtrIndicator)) {
            throw new Error(
                "Indicator is not an AtrIndicator"
            );
        }

        return indicator;
    }

    /**
     * Returns a distance expressed in ATR units.
     *
     * Example:
     *
     * distance = 3
     * ATR = 2
     * result = 1.5
     */
    getDistanceInAtr(
        tp: TradingPair,
        distance: number,
        n: number = 0
    ): number {

        const atr = this.get(tp, n).getValue();

        if (atr === 0) {
            return 0;
        }

        return Math.abs(distance) / atr;
    }

    /**
     * Returns true when distance >= multiplier * ATR.
     */
    isDistanceAtLeast(
        tp: TradingPair,
        distance: number,
        multiplier: number = 1,
        n: number = 0
    ): boolean {

        if (!Number.isFinite(multiplier) || multiplier < 0) {
            throw new RangeError(
                `ATR multiplier must be >= 0, got ${multiplier}`
            );
        }

        const atr = this.get(tp, n).getValue();

        return Math.abs(distance) >= atr * multiplier;
    }

    /**
     * Returns true when distance <= multiplier * ATR.
     *
     * Useful for conditions such as:
     *
     * |SMA89 - SMA200| < 2 * ATR200
     */
    isDistanceAtMost(
        tp: TradingPair,
        distance: number,
        multiplier: number = 1,
        n: number = 0
    ): boolean {

        if (!Number.isFinite(multiplier) || multiplier < 0) {
            throw new RangeError(
                `ATR multiplier must be >= 0, got ${multiplier}`
            );
        }

        const atr = this.get(tp, n).getValue();

        return Math.abs(distance) <= atr * multiplier;
    }
}