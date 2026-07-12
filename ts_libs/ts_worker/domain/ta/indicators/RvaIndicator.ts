import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { Indicator, IndicatorOutput, IndicatorParameters } from "./Indicator";
import { RollingSimpleMovingAverage } from "../core/RollingSimpleMovingAverage";
import { Source } from "../core/Source";
import { IndicatorAccessor } from "../export/IndicatorAccessor";

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
export class RvaIndicatorParameters extends IndicatorParameters {
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
export class RvaIndicator extends Indicator<RvaIndicatorParameters, RvaIndicatorOutput> {

    private readonly mtf: MultiTimeframeOhlcv;
    private readonly rolling: RollingSimpleMovingAverage;
    private readonly history: RingBuffer<RvaIndicatorOutput>;
    private readonly pending: RvaIndicatorOutput;

    constructor(parameters: RvaIndicatorParameters, mtf: MultiTimeframeOhlcv) {
        super(RvaIndicatorParameters.fromUnknown(parameters));
        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
        this.rolling = new RollingSimpleMovingAverage(this.getParameters().getPeriod());
        this.history = new RingBuffer<RvaIndicatorOutput>(
            this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCapacity(),
            () => new RvaIndicatorOutput()
        );
        this.pending = new RvaIndicatorOutput();
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
        if (!Number.isFinite(volume)) {
            throw new RangeError("Cannot push infinite values to RVA");
        }
        const volumeSma = this.rolling.push(volume);
        if (volumeSma === null) {
            return; //rolling is not ready
        }
        if (!Number.isFinite(volumeSma)) {
            throw new Error("RVA infinite value detected.");
        }
        if (volumeSma !== 0) {
            const relativeValue = volume / volumeSma;
            this.history.push(sample => sample.update(volumeSma, relativeValue));
        } else {
            this.history.push(sample => sample.update(0, 0));
        }
    }



    /** Call when a new candle is available */
    update(timeFrame: TimeFrame): void {
        const thisTf = this.getParameters().getTimeFrame();
        if (timeFrame != thisTf) {
            return;
        }
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

    getPendingValue(): RvaIndicatorOutput {
        if (!this.isReady()) {
            throw new RangeError("RVA value is not ready.");
        }
        const pendingCandle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getPendingCandle();
        const pendingVolume = pendingCandle.volume;

        if (!Number.isFinite(pendingVolume)) {
            throw new RangeError("RVA value cannot be computed due to pending value issues.");
        }
        const closedVolumeSma = this.getValue().getVolumeSma();
        if (!Number.isFinite(closedVolumeSma) || closedVolumeSma === 0) {
            this.pending.update(0, 0);
            return this.pending;
        }
        const relativeValue = pendingVolume / closedVolumeSma;
        this.pending.update(closedVolumeSma, relativeValue);
        return this.pending;
    }

    getValuesCount(): number {
        return this.history.getSize();
    }
}

export class RvaAccessor extends IndicatorAccessor<RvaIndicatorParameters, RvaIndicatorOutput> { }
