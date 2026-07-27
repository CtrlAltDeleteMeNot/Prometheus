import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { Source } from "../core/Source";
import { Indicator, IndicatorOutput, IndicatorParameters, IndicatorRuntime } from "./Indicator";
import { RollingSimpleMovingAverage } from "../core/RollingSimpleMovingAverage";
import { IndicatorAccessor } from "../export/IndicatorAccessor";
import { TradingPair } from "../../entities/TradingPair";

/** SMA output container */
export class SmaIndicatorOutput extends IndicatorOutput {
    #value: MutableFloat;

    constructor() {
        super();
        this.#value = new MutableFloat();
    }

    update(argValue: number): void {
        this.#value.update(argValue);
    }

    getValue(): number {
        return this.#value.getValue();
    }
}

/** SMA parameters */
export class SmaIndicatorParameters extends IndicatorParameters {
    public readonly timeFrame: TimeFrame;
    public readonly period: Period;
    public readonly source: Source;

    constructor(timeFrame: TimeFrame, period: Period, source: Source) {
        super();
        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
        this.source = Source.fromUnknown(source);
    }

    getId(): string {
        return `SMA (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
    }

    getDescription(): string {
        return `SMA (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
    }

    getPeriod(): Period {
        return this.period;
    }

    getTimeFrame(): TimeFrame {
        return this.timeFrame;
    }

    getSource(): Source {
        return this.source;
    }

    createUsing(buffer: MultiTimeframeOhlcv): SmaIndicator {
        return new SmaIndicator(this, buffer);
    }

    static fromUnknown(value: unknown): SmaIndicatorParameters {
        if (!(value instanceof SmaIndicatorParameters)) {
            throw new TypeError("Value is not a SmaIndicatorParameters instance");
        }
        if (value.period.getValue() < 2) {
            throw new RangeError("SMA period must be >= 2");
        }
        return value;
    }
}

/** SMA indicator */
export class SmaIndicator extends Indicator<SmaIndicatorParameters, SmaIndicatorOutput> {

    private readonly mtf: MultiTimeframeOhlcv;
    private readonly rolling: RollingSimpleMovingAverage;
    private readonly history: RingBuffer<SmaIndicatorOutput>;

    constructor(parameters: SmaIndicatorParameters, mtf: MultiTimeframeOhlcv) {
        super(SmaIndicatorParameters.fromUnknown(parameters));
        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
        this.rolling = new RollingSimpleMovingAverage(this.getParameters().getPeriod());
        this.history = new RingBuffer<SmaIndicatorOutput>(
            this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCapacity(),
            () => new SmaIndicatorOutput()
        );

        // Bootstrap existing buffer
        this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .stream((position: number, candle) => {
                const extracted = this.getParameters().getSource().extract(candle);
                this.#computeCore(extracted);
            });
    }

    isReady(): boolean {
        return this.history.getSize() > 0;
    }

    #computeCore(value: number): void {
        const computed = this.rolling.push(value);
        if (computed === null) return;
        this.history.push(sample => sample.update(computed));
    }

    update(timeFrame: TimeFrame): void {
        const thisTf = this.getParameters().getTimeFrame();
        if (timeFrame != thisTf) {
            return;
        }
        const candle = this.mtf
            .getBuffer(thisTf)
            .getCandle();

        const extracted = this.getParameters().getSource().extract(candle);
        this.#computeCore(extracted);
    }

    getValue(n: number = 0): SmaIndicatorOutput {
        const value = this.history.get(n);
        if (!value) throw new RangeError("SMA value not available");
        return value;
    }

    getValuesCount(): number {
        return this.history.getSize();
    }

    getPendingValue(): SmaIndicatorOutput {
        throw new Error("Method not implemented.");
    }


    isBelowClose(n: number = 0): boolean {
        const sourceTf = this.getParameters().getTimeFrame();
        if (n < 0 || n >= this.getValuesCount()) {
            throw new RangeError("SMA value not available");
        }
        const price = this.mtf.getBuffer(sourceTf).getClose(n);
        const value = this.getValue(n).getValue();
        return price > value;
    }

    isAboveClose(n: number = 0): boolean {
        const sourceTf = this.getParameters().getTimeFrame();
        if (n < 0 || n >= this.getValuesCount()) {
            throw new RangeError("SMA value not available");
        }
        const price = this.mtf.getBuffer(sourceTf).getClose(n);
        const value = this.getValue(n).getValue();
        return price < value;
    }

    getSlopeAngle(nBarsAgo: number = 0, distance: number = 1): number {
        if (!Number.isInteger(distance) || distance < 1) {
            throw new RangeError(
                `Distance must be a positive integer, got ${distance}`
            );
        }
        if (nBarsAgo < 0 || nBarsAgo >= this.history.getSize()) {
            throw new Error("nBarsAgo must be between 0 and history size");
        }
        if (nBarsAgo + distance >= this.history.getSize()) {
            throw new RangeError("Not enough data to compute slope");
        }

        const nBarsAgoValue = this.getValue(nBarsAgo).getValue();
        const nPlusDistanceBarsAgoValue = this.getValue(nBarsAgo + distance).getValue();
        const deltaY = nBarsAgoValue - nPlusDistanceBarsAgoValue
        const deltaX = distance;
        const slopeRadians = Math.atan(deltaY / deltaX);
        const slopeDegrees = slopeRadians * (180 / Math.PI);
        return slopeDegrees;
    }
}

export class SmaAccessor extends IndicatorAccessor<SmaIndicatorParameters, SmaIndicatorOutput> {
    findIndicatorOrThrow(aTp: TradingPair): SmaIndicator {
        const indicator = this.plugin.findIndicator(aTp, this.getParameters());
        if (!(indicator instanceof SmaIndicator)) throw new Error("Indicator is not a SmaIndicator");
        return indicator;
    }

    isUptrend(aTp: TradingPair, n: number = 0): boolean {
        const smaIndicator = this.findIndicatorOrThrow(aTp);
        return smaIndicator.isBelowClose(n) && smaIndicator.getSlopeAngle(n, 1) > 0;
    }

    isDowntrend(aTp: TradingPair, n: number = 0): boolean {
        const smaIndicator = this.findIndicatorOrThrow(aTp);
        return smaIndicator.isAboveClose(n) && smaIndicator.getSlopeAngle(n, 1) < 0;
    }

    isCrossover(tp: TradingPair, another: SmaAccessor): boolean {
        if (another.getValuesCount(tp) < 2 || this.getValuesCount(tp) < 2) {
            return false;
        }
        const previous = this.get(tp, 1).getValue() <= another.get(tp, 1).getValue();
        const current = this.get(tp, 0).getValue() > another.get(tp, 0).getValue();
        const toReturn = previous === true && current === true;
        return toReturn;
    }

    isCrossunder(tp: TradingPair, another: SmaAccessor): boolean {
        if (another.getValuesCount(tp) < 2 || this.getValuesCount(tp) < 2) {
            return false;
        }
        const previous = this.get(tp, 1).getValue() >= another.get(tp, 1).getValue();
        const current = this.get(tp, 0).getValue() < another.get(tp, 0).getValue();
        const toReturn = previous === true && current === true;
        return toReturn;
    }
}