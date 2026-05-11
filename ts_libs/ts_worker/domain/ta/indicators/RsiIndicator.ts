import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame"
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { Source } from "../core/Source"
import { Indicator, IndicatorOutput, IndicatorParameters } from "./Indicator"
import { RelativeStrengthIndex } from "../core/RelativeStrengthIndex"
import { OhlcvEntry } from "../../values/OhlcvEntry";

export class RsiIndicatorOutput extends IndicatorOutput {
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

export class RsiIndicatorParameters extends IndicatorParameters<RsiIndicatorOutput> {
    
    
    public readonly timeFrame: TimeFrame;
    public readonly period: Period;
    public readonly source: Source;
    public readonly useWilderSmoothing: boolean;

    constructor(
        timeFrame: TimeFrame,
        period: Period,
        source: Source,
        useWilderSmoothing: boolean = true
    ) {
        super();
        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
        this.source = Source.fromUnknown(source);
        this.useWilderSmoothing = Boolean(useWilderSmoothing);
    }

    getId(): string {
        return `RSI (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()}, ${this.useWilderSmoothing ? 'Wilder' : 'SMA'})`;
    }

    getDescription(): string {
        return `Rsi (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
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

    useWilder(): boolean {
        return this.useWilderSmoothing;
    }

    static fromUnknown(value: unknown): RsiIndicatorParameters {
        if (!(value instanceof RsiIndicatorParameters)) {
            throw new TypeError('Value is not a RsiIndicatorParameters instance');
        }
        if (value.getPeriod().getValue() < 2) {
            throw new RangeError('RSI period must be >= 2');
        }
        return value;
    }

    createUsing(buffer: MultiTimeframeOhlcv): RsiIndicator {
        return new RsiIndicator(this, buffer);
    }
}



export class RsiIndicator extends Indicator<RsiIndicatorOutput> {
    private readonly mtf: MultiTimeframeOhlcv;
    private readonly rolling: RelativeStrengthIndex;
    private readonly history: RingBuffer<RsiIndicatorOutput>;

    constructor(parameters: RsiIndicatorParameters, mtf: MultiTimeframeOhlcv) {
        super(RsiIndicatorParameters.fromUnknown(parameters));
        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
        this.rolling = new RelativeStrengthIndex(
            parameters.getPeriod(),
            parameters.useWilderSmoothing
        );

        this.history = new RingBuffer<RsiIndicatorOutput>(
            mtf.getBuffer(parameters.getTimeFrame()).getCapacity(),
            () => new RsiIndicatorOutput()
        );

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
        const computed: number | null = this.rolling.push(value);
        if (computed === null) {
            return;
        }
        this.history.push(sample => sample.update(computed));
    }

    update(): void {
        const candle = this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .getCandle();

        const extracted = this.getParameters().getSource().extract(candle);
        this.#computeCore(extracted);
    }

    getValue(n: number = 0): RsiIndicatorOutput {
        return this.history.get(n);
    }

    getValuesCount(): number {
        return this.history.getSize();
    }
}
