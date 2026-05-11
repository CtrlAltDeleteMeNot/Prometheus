import { TradingPair } from "../entities/TradingPair";
import { RingBuffer } from "../util/RingBuffer";
import { OhlcvEntry } from "./OhlcvEntry";
import { TimeFrame } from "./TimeFrame";
import { PendingOhlcvEntry } from "./PendingOhlcvEntry";

export class OhlcvBuffer {
    private readonly tradingPair: TradingPair;
    private readonly baseTimeFrame: TimeFrame;

    private readonly data: RingBuffer<OhlcvEntry>;
    private readonly pending: PendingOhlcvEntry;

    /**
     * @param tradingPair - The trading pair of this buffer
     * @param timeFrame - The base timeframe of this buffer
     * @param capacity - RingBuffer capacity
     */
    constructor(tradingPair: TradingPair, timeFrame: TimeFrame, capacity: number) {
        this.tradingPair = tradingPair;
        this.baseTimeFrame = timeFrame;

        this.data = new RingBuffer<OhlcvEntry>(
            capacity,
            () => new OhlcvEntry()
        );

        this.pending = new PendingOhlcvEntry(timeFrame);
    }

    /* ============================
     * Public API
     * ============================ */

    push(
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
        if (timeFrame.equals(this.baseTimeFrame)) {
            return this.#pushBase(
                timeFrame, open, high, low, close,
                volume, startTime, endTime, isClosed
            );
        }
        return this.#pushUpdate(
            timeFrame, open, high, low, close,
            volume, startTime, endTime, isClosed
        );
    }

    pushEntry(entry: OhlcvEntry): boolean {
        if (entry.timeFrame.equals(this.baseTimeFrame)) {
            return this.#pushBase(
                entry.timeFrame,
                entry.open,
                entry.high,
                entry.low,
                entry.close,
                entry.volume,
                entry.startTime,
                entry.endTime,
                entry.isClosed
            );
        }
        return this.#pushUpdate(
            entry.timeFrame,
            entry.open,
            entry.high,
            entry.low,
            entry.close,
            entry.volume,
            entry.startTime,
            entry.endTime,
            entry.isClosed
        );
    }

    /* ============================
     * Base Timeframe
     * ============================ */

    #pushBase(
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
        if (!isClosed) {
            throw new Error("Base timeframe entry must be closed");
        }
        if (!timeFrame.equals(this.baseTimeFrame)) {
            throw new Error("Entry timeframe is different from base timeframe");
        }

        const expectedTime = this.getNextAcceptableStartTimeOnBaseTimeFrame();
        if (expectedTime !== null && startTime !== expectedTime) {
            throw new Error(
                `Non-contiguous base timeframe (${timeFrame.getLabel()}) entry for pair ` +
                `${this.tradingPair.symbol()} on exchange ` +
                `${this.tradingPair.getExchangeDescriptor().getName()}. ` +
                `Expected startTime=${expectedTime}, got ${startTime}`
            );
        }

        this.data.push(candle => {
            candle.update(
                timeFrame,
                open, high, low, close,
                volume,
                startTime,
                endTime,
                isClosed
            );
        });

        return true;
    }

    /* ============================
     * Update Timeframe (Aggregation)
     * ============================ */

    #pushUpdate(
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
        const pendingResult = this.pending.accumulate(
            timeFrame,
            open, high, low, close,
            volume,
            startTime,
            endTime,
            isClosed
        );

        if (pendingResult === false) {
            return false;
        }

        this.data.push(candle => {
            candle.update(
                this.baseTimeFrame,
                this.pending.open,
                this.pending.high,
                this.pending.low,
                this.pending.close,
                this.pending.volume,
                this.pending.startTime,
                this.pending.endTime,
                true
            );
        });

        return true;
    }

    /* ============================
     * Buffer state
     * ============================ */

    isEmpty(): boolean {
        return this.data.getSize() === 0;
    }

    size(): number {
        return this.data.getSize();
    }

    getCapacity(): number {
        return this.data.getCapacity();
    }

    getBaseTimeFrame(): TimeFrame {
        return this.baseTimeFrame;
    }

    stream(accessLambda: (position: number, candle: OhlcvEntry) => void): void {
        if (typeof accessLambda !== 'function') {
            throw new TypeError("OhlcvBuffer.stream: accessLambda is not a function");
        }

        for (let n = this.size() - 1; n >= 0; n--) {
            accessLambda(n, this.data.get(n));
        }
    }

    getPendingCandle():PendingOhlcvEntry{
        return this.pending;
    }

    /* ============================
     * Zero-allocation computations
     * ============================ */

    getCandle(n = 0): OhlcvEntry {
        return this.data.get(n);
    }

    isBullish(n = 0): boolean {
        const c = this.getCandle(n);
        return c.close > c.open;
    }

    isBearish(n = 0): boolean {
        const c = this.getCandle(n);
        return c.close < c.open;
    }

    range(n = 0): number {
        const c = this.getCandle(n);
        return c.high - c.low;
    }

    bodySize(n = 0): number {
        const c = this.getCandle(n);
        return Math.abs(c.close - c.open);
    }

    typicalPrice(n = 0): number {
        const c = this.getCandle(n);
        return (c.high + c.low + c.close) / 3;
    }

    midPrice(n = 0): number {
        const c = this.getCandle(n);
        return (c.high + c.low) / 2;
    }

    getOpen(n = 0): number {
        return this.getCandle(n).open;
    }

    getClose(n = 0): number {
        return this.getCandle(n).close;
    }

    getHigh(n = 0): number {
        return this.getCandle(n).high;
    }

    getLow(n = 0): number {
        return this.getCandle(n).low;
    }

    getVolume(n = 0): number {
        return this.getCandle(n).volume;
    }

    getStartTime(n = 0): number {
        return this.getCandle(n).startTime;
    }

    getEndTime(n = 0): number {
        return this.getCandle(n).endTime;
    }

    getNextAcceptableStartTimeOnBaseTimeFrame(): number | null {
        if (this.isEmpty()) {
            return null;
        }
        return this.getStartTime() + this.baseTimeFrame.asMilliseconds();
    }

    getNextAcceptableStartTimeOnPendingBuffer(): number {
        if (this.isEmpty()) {
            throw new Error(
                `Buffer is empty for pair ${this.tradingPair.symbol()} ` +
                `on timeFrame ${this.baseTimeFrame.getLabel()}.`
            );
        }

        if (this.pending.nextIncrementalUpdate === null) {
            const next = this.getNextAcceptableStartTimeOnBaseTimeFrame();
            if (next === null) {
                throw new Error(
                    `All buffers are empty for pair ${this.tradingPair.symbol()} ` +
                    `on timeFrame ${this.baseTimeFrame.getLabel()}.`
                );
            }
            return next;
        }

        return this.pending.nextIncrementalUpdate;
    }

    static fromUnknown(anInstance: unknown): OhlcvBuffer {
        if (!(anInstance instanceof OhlcvBuffer)) {
            throw new TypeError(
                "OhlcvBuffer.Validate: anInstance is not an instance of OhlcvBuffer"
            );
        }
        return anInstance;
    }
}
