import { TimeFrame } from "./TimeFrame";

export class OhlcvEntry {
    timeFrame: TimeFrame;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    startTime: number;
    endTime: number;
    isClosed: boolean;

    constructor(
        timeFrame: TimeFrame = TimeFrame.ONE_MINUTE,
        open = 0,
        high = 0,
        low = 0,
        close = 0,
        volume = 0,
        startTime = 0,
        endTime = 0,
        isClosed = false
    ) {
        this.timeFrame = timeFrame;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isClosed = isClosed;
    }

    /**
     * Update this entry in place
     */
    update(
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

        this.timeFrame = timeFrame;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isClosed = isClosed;
    }

    /* ============================
     * Validation helpers
     * ============================ */

    static Validate(
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

        const validatedTimeFrame = TimeFrame.fromUnknown(timeFrame);

        this.#assertNumber(open, "open");
        this.#assertNumber(high, "high");
        this.#assertNumber(low, "low");
        this.#assertNumber(close, "close");

        if (high < low) {
            throw new RangeError("high must be >= low");
        }
        if (open < low || open > high) {
            throw new RangeError("open must be between low and high");
        }
        if (close < low || close > high) {
            throw new RangeError("close must be between low and high");
        }

        this.#assertNumber(volume, "volume");
        this.#assertNonNegative(volume, "volume");

        this.#assertNumber(startTime, "startTime");
        this.#assertNumber(endTime, "endTime");

        if (endTime <= startTime) {
            throw new RangeError("endTime must be > startTime");
        }

        const expectedDuration = validatedTimeFrame.asMilliseconds();
        const actualDuration = endTime - startTime;

        if (actualDuration > expectedDuration) {
            throw new RangeError(
                `Timeframe mismatch: expected ${expectedDuration}ms, got ${actualDuration}ms`
            );
        }

        if (typeof isClosed !== "boolean") {
            throw new TypeError("isClosed must be boolean");
        }
    }

    static #assertNumber(value: unknown, name: string): void {
        if (!Number.isFinite(value)) {
            throw new TypeError(`${name} must be a finite number`);
        }
    }

    static #assertNonNegative(value: number, name: string): void {
        if (value < 0) {
            throw new RangeError(`${name} must be >= 0`);
        }
    }
}
