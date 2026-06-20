import { TradingPair } from "../entities/TradingPair";
import { InsufficientOhlcvDataError } from "../errors/InsufficientOhlcvDataError";
import { OhlcvBuffer } from "./OhlcvBuffer";
import { OhlcvEntry } from "./OhlcvEntry";
import { TimeFrame } from "./TimeFrame";

export class MultiTimeframeOhlcv {
    static readonly TimeframeHierarchy: readonly TimeFrame[] = [
        TimeFrame.ONE_MINUTE,
        TimeFrame.FIVE_MINUTES,
        TimeFrame.FIFTEEN_MINUTES,
        TimeFrame.ONE_HOUR,
        TimeFrame.FOUR_HOURS,
        TimeFrame.ONE_DAY
    ] as const;

    private readonly tradingPair: TradingPair;
    private readonly buffers: Map<TimeFrame, OhlcvBuffer>;
    private readonly updatedTimeFrames: Map<TimeFrame, boolean>;

    constructor(
        tradingPair: TradingPair,
        oneDay: OhlcvBuffer,
        fourHours: OhlcvBuffer,
        oneHour: OhlcvBuffer,
        fifteenMinutes: OhlcvBuffer,
        fiveMinutes: OhlcvBuffer,
        oneMinute: OhlcvBuffer
    ) {
        this.tradingPair = TradingPair.fromUnknown(tradingPair);
        this.buffers = new Map<TimeFrame, OhlcvBuffer>([
            [TimeFrame.ONE_DAY, OhlcvBuffer.fromUnknown(oneDay)],
            [TimeFrame.FOUR_HOURS, OhlcvBuffer.fromUnknown(fourHours)],
            [TimeFrame.ONE_HOUR, OhlcvBuffer.fromUnknown(oneHour)],
            [TimeFrame.FIFTEEN_MINUTES, OhlcvBuffer.fromUnknown(fifteenMinutes)],
            [TimeFrame.FIVE_MINUTES, OhlcvBuffer.fromUnknown(fiveMinutes)],
            [TimeFrame.ONE_MINUTE, OhlcvBuffer.fromUnknown(oneMinute)]
        ]);
        
        this.updatedTimeFrames = new Map<TimeFrame, boolean>([
            [TimeFrame.ONE_DAY, true],
            [TimeFrame.FOUR_HOURS, true],
            [TimeFrame.ONE_HOUR, true],
            [TimeFrame.FIFTEEN_MINUTES, true],
            [TimeFrame.FIVE_MINUTES, true],
            [TimeFrame.ONE_MINUTE, true]
        ]);

        // Validate that all higher timeframes have data
        for (let i = 1; i < MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);
            if (buffer.size() === 0) {
                throw new InsufficientOhlcvDataError(`The ${tf.getLabel()} timeframe has no data.`, tradingPair);
            }
        }

        // Backfill higher timeframes from lower ones
        for (let i = 1; i < MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const currentTf = MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const currentBuffer = this.getBuffer(currentTf);

            for (let j = i - 1; j >= 0; j--) {
                const lowerTf = MultiTimeframeOhlcv.TimeframeHierarchy[j];
                const lowerBuffer = this.getBuffer(lowerTf);

                lowerBuffer.stream((_position: number, candle: OhlcvEntry) => {
                    const acceptable = currentBuffer.getNextAcceptableStartTimeOnPendingBuffer();
                    if (candle.startTime === acceptable) {
                        currentBuffer.pushEntry(candle);
                    }
                });
            }
        }

        this.ensureBuffersAreFullyAligned();
    }

    private ensureBuffersAreFullyAligned(): void {
        const oneMinuteBuffer = this.getBuffer(TimeFrame.ONE_MINUTE);
        let expectedNext =
            oneMinuteBuffer.getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();

        for (let i = 1; i < MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);
            const currentNext = buffer.getNextAcceptableStartTimeOnPendingBuffer();

            if (currentNext !== expectedNext) {
                throw new Error(
                    `Inconsistent next pending timestamp for timeframe ${tf.getLabel()}: ` +
                    `expected ${expectedNext}, got ${currentNext}`
                );
            }
        }
    }

    private markUpdated(timeFrame: TimeFrame): void {
        const tf = TimeFrame.fromUnknown(timeFrame);

        if (!this.updatedTimeFrames.has(tf)) {
            throw new Error(`Unsupported timeframe: ${tf.getLabel()}`);
        }

        this.updatedTimeFrames.set(tf, true);
    }

    private clearUpdatedTimeFrames(): void {
        this.updatedTimeFrames.forEach((_value, timeFrame) => {
            this.updatedTimeFrames.set(timeFrame, false);
        });
    }



    pushUpdate(
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        isClosed: boolean
    ): ReadonlyMap<TimeFrame, boolean> {
        this.clearUpdatedTimeFrames();
        if (!TimeFrame.ONE_MINUTE.equals(timeFrame)) {
            throw new Error(`Cannot push updates for the ${timeFrame.getLabel()} timeframe`);
        }
        const mainBuffer = this.getBuffer(timeFrame);
        const updatedMain = mainBuffer.push(
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

        if (updatedMain) {
            this.markUpdated(mainBuffer.getBaseTimeFrame());
        }

        for (let i = 1; i < MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);

            const updated = buffer.push(
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

            if (updated) {
                this.markUpdated(buffer.getBaseTimeFrame());
            }
        }

        this.ensureBuffersAreFullyAligned();
        return this.updatedTimeFrames;
    }

    public forEachUpdatedTimeFrame(callback: (timeFrame: TimeFrame) => void): void {
        this.updatedTimeFrames.forEach((updated, timeFrame) => {
            if (!updated) {
                return;
            }
            callback(timeFrame);
        });
    }

    public getUpdatedTimeFrames():ReadonlyMap<TimeFrame, boolean>{
        return this.updatedTimeFrames;
    }


    getBuffer(timeFrame: TimeFrame): OhlcvBuffer {
        const tf = TimeFrame.fromUnknown(timeFrame);
        const buffer = this.buffers.get(tf);
        return OhlcvBuffer.fromUnknown(buffer);
    }

    public getTradingPair(): TradingPair {
        return this.tradingPair;
    }

    static fromUnknown(instance: unknown): MultiTimeframeOhlcv {
        if (!(instance instanceof MultiTimeframeOhlcv)) {
            throw new TypeError(
                "MultiTimeframeOhlcv.Validate: anInstance is not an instance of MultiTimeframeOhlcv"
            );
        }
        return instance;
    }
}
