import { TradingPair } from '../entities/TradingPair';
import { TimeFrame } from '../values/TimeFrame';
import { OhlcvEntry } from '../values/OhlcvEntry';
import { OhlcvBuffer } from '../values/OhlcvBuffer';
import { MultiTimeframeOhlcv } from '../values/MultiTimeframeOhlcv';
import { Asset } from '../values/Asset';
import { timeStamp } from 'console';

export abstract class ExchangeMethodsBase {

    /**
     * Fetch trading pairs from the exchange.
     * Must be overridden in subclass.
     *
     * @param callback Called for each trading pair as it is retrieved
     */
    abstract fetchTradingPairs(callback: (baseAsset: Asset, quoteAsset: Asset) => void): Promise<void>;

    abstract getTradingPairUrl(tradingPair: TradingPair): string;

    /**
     * Fetch historical candles.
     * CONTRACT:
     * - Returned array MUST be ordered by ascending startTime
     * - Returned array MAY be shorter than totalCount
     * - Returned candles MUST NOT overlap
     * - Gaps MAY exist
     *
     * @param tradingPair
     * @param timeFrame
     * @param startTimeMsInclusive
     * @param endTimeMsExclusive
     */
    abstract fetchHistoricalCandles(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        startTimeMsInclusive: number,
        endTimeMsExclusive: number
    ): Promise<OhlcvEntry[]>;

    /**
     * Create a buffer for a single timeframe
     */
    async createSingleBuffer(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        endTimeStamp: number,
        count: number
    ): Promise<OhlcvBuffer> {
        const relevantEndTimeStamp = endTimeStamp;
        const duration = count * timeFrame.asMilliseconds();
        const relevantStartTimeStamp = relevantEndTimeStamp - duration;
        const data: OhlcvEntry[] = await this.fetchHistoricalCandles(
            tradingPair,
            timeFrame,
            relevantStartTimeStamp,
            relevantEndTimeStamp
        );

        const buffer = new OhlcvBuffer(tradingPair, timeFrame, count);

        if (data.length === 0) return buffer;

        // Find first gap from the end backwards
        let startIndex = 0;
        for (let i = data.length - 1; i > 0; i--) {
            const expectedPrev = data[i].startTime - timeFrame.asMilliseconds();
            if (data[i - 1].startTime !== expectedPrev) {
                startIndex = i; // first candle after last gap
                break;
            }
        }

        for (let i = startIndex; i < data.length; i++) {
            buffer.pushEntry(data[i]);
        }

        return buffer;
    }

    /**
     * Sync a MultiTimeframeOhlcv with new data up to newEndTimeMillis
     */
    async syncMultiTimeFrameOhlcv(
        multiTimeframeOhlcv: MultiTimeframeOhlcv,
        newEndTimeMillis: number
    ): Promise<number> {
        const timeFrame = TimeFrame.ONE_MINUTE;
        const buffer = OhlcvBuffer.fromUnknown(multiTimeframeOhlcv.getBuffer(timeFrame));

        if (buffer.isEmpty()) {
            throw new Error("Cannot sync an empty buffer");
        }


        const relevantStartTimeStamp = buffer.getStartTime() + timeFrame.asMilliseconds();
        const relevantEndTimeStamp = newEndTimeMillis;

        if (relevantEndTimeStamp <= relevantStartTimeStamp) return 0;

        const data = await this.fetchHistoricalCandles(
            multiTimeframeOhlcv.getTradingPair(),
            buffer.getBaseTimeFrame(),
            relevantStartTimeStamp,
            relevantEndTimeStamp
        );


        for (const entry of data) {
            multiTimeframeOhlcv.pushUpdate(
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

        return data.length;
    }

    /**
     * Create a MultiTimeframeOhlcv from historical data
     */
    async createMultiTimeframeOhlcv(
        tradingPair: TradingPair,
        endTimeMsExclusive: number,
        totalCountPerTimeFrame: number
    ): Promise<MultiTimeframeOhlcv> {
        if (!Number.isInteger(totalCountPerTimeFrame) || totalCountPerTimeFrame <= 10) {
            throw new RangeError("totalCountPerTimeFrame must be > 10");
        }

        if (!Number.isFinite(endTimeMsExclusive)) {
            throw new RangeError("endTimeMsExclusive must be finite");
        }

        const timeFrames = MultiTimeframeOhlcv.TimeframeHierarchy;

        const results = await Promise.all(timeFrames.map(async (tf) => {
            const entries = await this.createSingleBuffer(TradingPair.fromUnknown(tradingPair), tf, endTimeMsExclusive, totalCountPerTimeFrame);
            return { timeFrame: tf, entries };
        }));

        return new MultiTimeframeOhlcv(
            tradingPair,
            ExchangeMethodsBase.#getEntries(results, TimeFrame.ONE_DAY),
            ExchangeMethodsBase.#getEntries(results, TimeFrame.FOUR_HOURS),
            ExchangeMethodsBase.#getEntries(results, TimeFrame.ONE_HOUR),
            ExchangeMethodsBase.#getEntries(results, TimeFrame.FIFTEEN_MINUTES),
            ExchangeMethodsBase.#getEntries(results, TimeFrame.FIVE_MINUTES),
            ExchangeMethodsBase.#getEntries(results, TimeFrame.ONE_MINUTE)
        );
    }

    /** Private helper to find buffer by timeframe */
    static #getEntries(
        map: Array<{ timeFrame: TimeFrame; entries: OhlcvBuffer }>,
        timeFrame: TimeFrame
    ): OhlcvBuffer {
        const found = map.find(x => timeFrame.equals(x.timeFrame));
        if (!found || !found.entries) {
            throw new Error(`Entries for timeframe ${timeFrame.getLabel()} not found`);
        }
        return found.entries;
    }
}
