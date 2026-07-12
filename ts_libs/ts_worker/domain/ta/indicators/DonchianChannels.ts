import { RingBuffer } from "../../util/RingBuffer";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { MutableFloat } from "../core/MutableFloat";
import { Period } from "../core/Period";
import { RollingExtreme } from "../core/RollingExtreme";
import { Source } from "../core/Source";
import { IndicatorAccessor } from "../export/IndicatorAccessor";
import {
    Indicator,
    IndicatorOutput,
    IndicatorParameters
} from "./Indicator";

/** Donchian Channels output container. */
export class DonchianChannelsIndicatorOutput extends IndicatorOutput {
    readonly #high: MutableFloat;
    readonly #middle: MutableFloat;
    readonly #low: MutableFloat;

    constructor() {
        super();

        this.#high = new MutableFloat(0);
        this.#middle = new MutableFloat(0);
        this.#low = new MutableFloat(0);
    }

    update(
        high: number,
        middle: number,
        low: number
    ): void {
        this.#high.update(high);
        this.#middle.update(middle);
        this.#low.update(low);
    }

    getHigh(): number {
        return this.#high.getValue();
    }

    getMiddle(): number {
        return this.#middle.getValue();
    }

    getLow(): number {
        return this.#low.getValue();
    }
}

/** Donchian Channels parameters. */
export class DonchianChannelsIndicatorParameters
    extends IndicatorParameters {

    public readonly timeFrame: TimeFrame;
    public readonly period: Period;
    public readonly highSource: Source;
    public readonly lowSource: Source;

    constructor(
        timeFrame: TimeFrame,
        period: Period,
        highSource: Source,
        lowSource: Source
    ) {
        super();

        this.timeFrame = TimeFrame.fromUnknown(timeFrame);
        this.period = Period.fromUnknown(period);
        this.highSource = Source.fromUnknown(highSource);
        this.lowSource = Source.fromUnknown(lowSource);
    }

    getId(): string {
        return (
            `DONCHIAN CHANNELS (` +
            `${this.period.getValue()}, ` +
            `${this.highSource.label}, ` +
            `${this.lowSource.label}, ` +
            `${this.timeFrame.getLabel()}` +
            `)`
        );
    }

    getDescription(): string {
        return (
            `Donchian Channels (` +
            `${this.period.getValue()}, ` +
            `${this.highSource.label}, ` +
            `${this.lowSource.label}, ` +
            `${this.timeFrame.getLabel()}` +
            `)`
        );
    }

    getPeriod(): Period {
        return this.period;
    }

    getTimeFrame(): TimeFrame {
        return this.timeFrame;
    }

    getHighSource(): Source {
        return this.highSource;
    }

    getLowSource(): Source {
        return this.lowSource;
    }

    createUsing(
        buffer: MultiTimeframeOhlcv
    ): DonchianChannelsIndicator {
        return new DonchianChannelsIndicator(this, buffer);
    }

    static fromUnknown(
        value: unknown
    ): DonchianChannelsIndicatorParameters {
        if (!(value instanceof DonchianChannelsIndicatorParameters)) {
            throw new TypeError(
                "Value is not a DonchianChannelsIndicatorParameters instance"
            );
        }

        if (value.period.getValue() < 1) {
            throw new RangeError(
                "Donchian Channels period must be >= 1"
            );
        }

        return value;
    }
}

/** Donchian Channels indicator. */
export class DonchianChannelsIndicator
    extends Indicator<DonchianChannelsIndicatorParameters, DonchianChannelsIndicatorOutput> {


    private readonly mtf: MultiTimeframeOhlcv;

    private readonly rollingHigh: RollingExtreme;
    private readonly rollingLow: RollingExtreme;

    private readonly history:
        RingBuffer<DonchianChannelsIndicatorOutput>;

    constructor(
        parameters: DonchianChannelsIndicatorParameters,
        mtf: MultiTimeframeOhlcv
    ) {
        super(
            DonchianChannelsIndicatorParameters.fromUnknown(parameters)
        );

        this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);

        const period = this.getParameters().getPeriod();

        this.rollingHigh = new RollingExtreme(
            period,
            (candidate, currentExtreme) =>
                candidate.getValue() > currentExtreme.getValue()
        );

        this.rollingLow = new RollingExtreme(
            period,
            (candidate, currentExtreme) =>
                candidate.getValue() < currentExtreme.getValue()
        );

        const candleBuffer = this.mtf.getBuffer(
            this.getParameters().getTimeFrame()
        );

        this.history = new RingBuffer<DonchianChannelsIndicatorOutput>(
            candleBuffer.getCapacity(),
            () => new DonchianChannelsIndicatorOutput()
        );

        // Bootstrap existing candles.
        candleBuffer.stream((_position: number, candle) => {
            this.#computeCore(
                this.getParameters().getHighSource().extract(candle),
                this.getParameters().getLowSource().extract(candle)
            );
        });
    }

    isReady(): boolean {
        return this.history.getSize() > 0;
    }

    update(timeFrame: TimeFrame): void {
        const thisTf = this.getParameters().getTimeFrame();
        if (timeFrame != thisTf) {
            return;
        }
        const candle = this.mtf
            .getBuffer(this.getParameters().getTimeFrame())
            .getCandle();

        const high = this.getParameters()
            .getHighSource()
            .extract(candle);

        const low = this.getParameters()
            .getLowSource()
            .extract(candle);

        this.#computeCore(high, low);
    }

    getValue(
        n: number = 0
    ): DonchianChannelsIndicatorOutput {
        return this.history.get(n);
    }

    getValuesCount(): number {
        return this.history.getSize();
    }

    #computeCore(
        high: number,
        low: number
    ): void {
        const channelHigh = this.rollingHigh.push(high);
        const channelLow = this.rollingLow.push(low);

        if (channelHigh === null || channelLow === null) {
            return;
        }

        const channelMiddle =
            (channelHigh + channelLow) / 2;

        this.history.push(output => {
            output.update(
                channelHigh,
                channelMiddle,
                channelLow
            );
        });
    }

    getPendingValue(): DonchianChannelsIndicatorOutput {
        throw new Error("Method not implemented.");
    }
}

export class DonchianChannelsAccessor extends IndicatorAccessor<DonchianChannelsIndicatorParameters, DonchianChannelsIndicatorOutput> { }
