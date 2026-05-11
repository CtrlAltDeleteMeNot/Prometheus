import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { Indicator, IndicatorOutput, IndicatorParameters } from "./Indicator";
import { RollingSimpleMovingAverage } from "../core/RollingSimpleMovingAverage";
import { Source } from "../core/Source";

/** RVA output container: volume SMA + relative value */
export class RvaIndicatorOutput extends IndicatorOutput {
    #volumeSma: MutableFloat;
    #relativeValue: MutableFloat;

    constructor() {
        super();
        this.#volumeSma = new MutableFloat();
        this.#relativeValue = new MutableFloat();
    }

    update(volumeSma: number, relativeValue: number): void {
        this.#volumeSma.update(volumeSma);
        this.#relativeValue.update(relativeValue);
    }

    getVolumeSma(): number {
        return this.#volumeSma.getValue();
    }

    getRelativeValue(): number {
        return this.#relativeValue.getValue();
    }
}

/** RVA parameters */
export class RvaIndicatorParameters extends IndicatorParameters<RvaIndicatorOutput> {
    public readonly timeFrame: TimeFrame;
    public readonly period: Period;
    public readonly source: Source;

    constructor(timeFrame: TimeFrame, period: Period) {
        super();
        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
        this.source = Source.VOLUME;
    }

    getId(): string {
        return `RVA (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
    }

    getDescription(): string {
        return `Rva (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
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

    createUsing(buffer: MultiTimeframeOhlcv): RvaIndicator {
        return new RvaIndicator(this, buffer);
    }

    static fromUnknown(value: unknown): RvaIndicatorParameters {
        if (!(value instanceof RvaIndicatorParameters)) {
            throw new TypeError("Value is not an RvaIndicatorParameters instance");
        }
        if (value.period.getValue() < 2) {
            throw new RangeError("RVA period must be >= 2");
        }
        return value;
    }
}

/** RVA indicator */
export class RvaIndicator extends Indicator<RvaIndicatorOutput> {
    private readonly mtf: MultiTimeframeOhlcv;
    private readonly rolling: RollingSimpleMovingAverage;
    private readonly history: RingBuffer<RvaIndicatorOutput>;

    constructor(parameters: RvaIndicatorParameters, mtf: MultiTimeframeOhlcv) {
        super(RvaIndicatorParameters.fromUnknown(parameters));
        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
        this.rolling = new RollingSimpleMovingAverage(this.getParameters().getPeriod());
        this.history = new RingBuffer<RvaIndicatorOutput>(
            this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCapacity(),
            () => new RvaIndicatorOutput()
        );

        // Bootstrap existing buffer
        this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .stream((position: number, candle) => {
                const volume = candle.volume;
                this.#computeCore(volume);
            });
    }

    isReady(): boolean {
        return this.history.getSize() > 0;
    }

    #computeCore(volume: number): void {
        const volumeSma = this.rolling.push(volume);
        if (volumeSma === null) return;

        const relativeValue = volumeSma !== 0 ? volume / volumeSma : 0;
        this.history.push(sample => sample.update(volumeSma, relativeValue));
    }

    computePending(): number | undefined {
        if (!this.rolling.isReady()) {
            return undefined;
        }
        if (this.parameters.getTimeFrame() === TimeFrame.ONE_MINUTE) {
            return undefined;
        }
        let pendingVolume = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getPendingCandle().volume;
        if (pendingVolume === undefined || pendingVolume === null || pendingVolume === Infinity) {
            return undefined;
        }
        const volumeSma = this.getValue().getVolumeSma();
        if (volumeSma == null || volumeSma === 0) return undefined;
        const relativeValue = pendingVolume / volumeSma;

        return relativeValue;
    }

    /** Call when a new candle is available */
    update(): void {
        const candle = this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .getCandle();

        const volume = candle.volume;
        this.#computeCore(volume);
    }

    getValue(n: number = 0): RvaIndicatorOutput {
        const value = this.history.get(n);
        if (!value) throw new RangeError("RVA value not available");
        return value;
    }

    getValuesCount(): number {
        return this.history.getSize();
    }
}
