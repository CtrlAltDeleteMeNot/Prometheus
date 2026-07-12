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
}

export class SmaAccessor extends IndicatorAccessor<SmaIndicatorParameters, SmaIndicatorOutput> { }