import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame"
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { Source } from "../core/Source"
import { Indicator, IndicatorOutput, IndicatorParameters } from "./Indicator"
import { OhlcvEntry } from "../../values/OhlcvEntry";
import { PeriodPercentChange } from "../core/PeriodPercentChange";
import { IndicatorAccessor } from "../export/IndicatorAccessor";

export class PctChangeIndicatorOutput extends IndicatorOutput {
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

export class PctChangeIndicatorParameters extends IndicatorParameters {
    public readonly timeFrame: TimeFrame;
    public readonly period: Period;
    public readonly source: Source;

    constructor(
        timeFrame: TimeFrame,
        period: Period,
        source: Source,
    ) {
        super();
        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
        this.source = Source.fromUnknown(source);
    }

    getId(): string {
        return `PCT_CHANGE (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
    }

    getDescription(): string {
        return `Percent change (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
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



    static fromUnknown(value: unknown): PctChangeIndicatorParameters {
        if (!(value instanceof PctChangeIndicatorParameters)) {
            throw new TypeError('Value is not a PctChangeIndicatorParameters instance');
        }
        if (value.getPeriod().getValue() < 2) {
            throw new RangeError('PctChange period must be >= 2');
        }
        return value;
    }

    createUsing(buffer: MultiTimeframeOhlcv): PctChangeIndicator {
        return new PctChangeIndicator(this, buffer);
    }
}



export class PctChangeIndicator extends Indicator<PctChangeIndicatorParameters, PctChangeIndicatorOutput> {

    private readonly mtf: MultiTimeframeOhlcv;
    private readonly history: RingBuffer<PctChangeIndicatorOutput>;
    private readonly impl: PeriodPercentChange;

    constructor(parameters: PctChangeIndicatorParameters, mtf: MultiTimeframeOhlcv) {
        super(PctChangeIndicatorParameters.fromUnknown(parameters));
        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
        this.history = new RingBuffer<PctChangeIndicatorOutput>(
            mtf.getBuffer(parameters.getTimeFrame()).getCapacity(),
            () => new PctChangeIndicatorOutput()
        );
        this.impl = new PeriodPercentChange(this.getParameters().getPeriod())

        // Bootstrap from existing buffer
        this.mtf
            .getBuffer(parameters.getTimeFrame())
            .stream((position: number, candle: OhlcvEntry) => {
                const extracted = parameters.getSource().extract(candle);
                this.#computeCore(extracted);
            });
    }

    isReady(): boolean {
        return this.history.getSize() > 0;
    }

    #computeCore(value: number): void {
        let pctChange = this.impl.push(value);
        if (pctChange === null) {
            return;
        }
        if (pctChange === undefined) {
            this.history.push(sample => sample.update(0));
        } else {
            this.history.push(sample => sample.update(pctChange));
        }
    }

    update(timeFrame: TimeFrame): void {
        const thisTf = this.getParameters().getTimeFrame();
        if (timeFrame != thisTf) {
            return;
        }
        const candle = this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .getCandle();

        const extracted = this.getParameters().getSource().extract(candle);
        this.#computeCore(extracted);
    }

    getValue(n: number = 0): PctChangeIndicatorOutput {
        return this.history.get(n);
    }

    getValuesCount(): number {
        return this.history.getSize();
    }

    getPendingValue(): PctChangeIndicatorOutput {
        throw new Error("Method not implemented.");
    }
}

export class PctChangeAccessor extends IndicatorAccessor<PctChangeIndicatorParameters,PctChangeIndicatorOutput> {}
