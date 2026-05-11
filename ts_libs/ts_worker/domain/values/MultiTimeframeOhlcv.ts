import { TradingPair } from "../entities/TradingPair";
import { InsufficientOhlcvDataError } from "../errors/InsufficientOhlcvDataError";
import { Indicator, IndicatorParameters } from "../ta/indicators/Indicator";
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

    private readonly indicators: Map<TimeFrame, Indicator<any>[]> = new Map([
        [TimeFrame.ONE_DAY, []],
        [TimeFrame.FOUR_HOURS, []],
        [TimeFrame.ONE_HOUR, []],
        [TimeFrame.FIFTEEN_MINUTES, []],
        [TimeFrame.FIVE_MINUTES, []],
        [TimeFrame.ONE_MINUTE, []]
    ]);

    private readonly buffers: Map<TimeFrame, OhlcvBuffer>;

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
    ): void {
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
            this.updateIndicators(mainBuffer.getBaseTimeFrame());
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
                this.updateIndicators(buffer.getBaseTimeFrame());
            }
        }

        this.ensureBuffersAreFullyAligned();
    }

    getBuffer(timeFrame: TimeFrame): OhlcvBuffer {
        const tf = TimeFrame.fromUnknown(timeFrame);
        const buffer = this.buffers.get(tf);
        return OhlcvBuffer.fromUnknown(buffer);
    }

    getIndicators(timeFrame: TimeFrame): Indicator<any>[] {
        const tf = TimeFrame.fromUnknown(timeFrame);
        const list = this.indicators.get(tf);

        if (!list) {
            throw new Error(`Unsupported timeframe: ${tf.getLabel()}`);
        }
        return list;
    }

    addIndicator(indicatorParams: IndicatorParameters<any>): boolean {
        const tf = indicatorParams.getTimeFrame();
        const list = this.getIndicators(tf);

        const exists = list.some(ind =>
            ind.getParameters().equals(indicatorParams)
        );

        if (exists) {
            return false;
        }

        const indicator = indicatorParams.createUsing(this);
        list.push(indicator);
        return true;
    }

    findIndicator(indicatorParams: IndicatorParameters<any>): Indicator<any> {
        const tf = indicatorParams.getTimeFrame();
        const list = this.getIndicators(tf);

        const found = list.find(ind =>
            ind.getParameters().equals(indicatorParams)
        );

        if (!found) {
            throw new Error(`Indicator ${indicatorParams.getId()} was not found.`);
        }

        return found;
    }

    removeIndicator(indicatorParams: IndicatorParameters<any>): boolean {
        const tf = indicatorParams.getTimeFrame();
        const list = this.getIndicators(tf);

        const index = list.findIndex(ind =>
            ind.getParameters().equals(indicatorParams)
        );

        if (index === -1) {
            return false;
        }

        list.splice(index, 1);
        return true;
    }

    private updateIndicators(timeFrame: TimeFrame): void {
        const tf = TimeFrame.fromUnknown(timeFrame);
        const list = this.getIndicators(tf);
        list.forEach(ind => ind.update());
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
