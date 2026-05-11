import { OhlcvEntry } from "./OhlcvEntry";
import { TimeFrame } from "./TimeFrame";

export class PendingOhlcvEntry {
    static readonly State = Object.freeze({
        INIT: 1,    // waiting for first candle
        UPDATE: 2   // accumulating subsequent candles
    });

    private readonly baseTimeFrame: TimeFrame;

    private state: typeof PendingOhlcvEntry.State[keyof typeof PendingOhlcvEntry.State];


    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    startTime: number;
    endTime: number;

    nextIncrementalUpdate: number | null;
    updateLimit: number | null;

    constructor(baseTimeFrame: TimeFrame) {
        this.baseTimeFrame = baseTimeFrame;

        this.state = PendingOhlcvEntry.State.INIT;

        this.open = 0;
        this.high = 0;
        this.low = 0;
        this.close = 0;
        this.volume = 0;
        this.startTime = 0;
        this.endTime = 0;

        this.nextIncrementalUpdate = null;
        this.updateLimit = null;
    }

    /**
     * Accumulate a closed lower-timeframe candle.
     * @returns true if a base-timeframe candle was completed
     */
    accumulate(
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        isClosed: boolean
    ): boolean {
        this.#validate(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
        );

        if (this.state === PendingOhlcvEntry.State.INIT) {
            this.#initialize(
                timeFrame,
                open,
                high,
                low,
                close,
                volume,
                startTime,
                endTime,
                isClosed
            );
            this.state = PendingOhlcvEntry.State.UPDATE;
            return false;
        }

        // UPDATE
        this.#update(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
        );

        if (this.#isLastCandle(timeFrame, startTime)) {
            this.#finalize();
            return true;
        }

        return false;
    }

    /* =========================
       Core Logic
       ========================= */

    #initialize(
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        _isClosed: boolean
    ): void {
        if (!this.baseTimeFrame.isTimestampAligned(startTime)) {
            throw new Error(
                `Start time ${startTime} not aligned to ${this.baseTimeFrame.getLabel()}`
            );
        }

        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.startTime = startTime;
        this.endTime = endTime;

        this.nextIncrementalUpdate = startTime + timeFrame.asMilliseconds();
        this.updateLimit = startTime + this.baseTimeFrame.asMilliseconds();
    }

    #update(
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        _isClosed: boolean
    ): void {
        if (this.nextIncrementalUpdate === null) {
            throw new Error("PendingOhlcvEntry not initialized");
        }

        if (startTime !== this.nextIncrementalUpdate) {
            throw new Error(
                `Candle gap detected: expected ${this.nextIncrementalUpdate}, got ${startTime}`
            );
        }

        this.high = Math.max(this.high, high);
        this.low = Math.min(this.low, low);
        this.close = close;
        this.volume += volume;
        this.endTime = endTime;

        this.nextIncrementalUpdate = startTime + timeFrame.asMilliseconds();
    }

    #isLastCandle(timeFrame: TimeFrame, startTime: number): boolean {
        if (this.updateLimit === null) {
            throw new Error("Null update limit");
        }
        return (startTime + timeFrame.asMilliseconds()) >= this.updateLimit;
    }

    #finalize(): void {
        this.state = PendingOhlcvEntry.State.INIT;
    }

    /* =========================
       Validation
       ========================= */

    #validate(
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        isClosed: boolean
    ): void {
        if (!isClosed) {
            throw new Error("Pending entry requires closed candles");
        }

        if (timeFrame.isGreaterThanOrEqual(this.baseTimeFrame)) {
            throw new Error(
                `Invalid timeframe: provided=${timeFrame.getLabel()}, base=${this.baseTimeFrame.getLabel()}`
            );
        }

        OhlcvEntry.Validate(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
        );
    }
}
