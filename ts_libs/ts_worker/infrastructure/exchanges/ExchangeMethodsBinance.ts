import { ExchangeMethodsBase } from "../../domain/exchange/ExchangeMethodsBase";
import { TradingPair } from "../../domain/entities/TradingPair";
import { TimeFrame } from "../../domain/values/TimeFrame";
import { OhlcvEntry } from "../../domain/values/OhlcvEntry";
import { Asset } from "../../domain/values/Asset";

/**
 * Binance-specific implementation of ExchangeMethodsBase
 */
export class ExchangeMethodsBinance extends ExchangeMethodsBase {

    static readonly BASE_URL = "https://api.binance.com";
    static readonly MAX_LIMIT = 800;


    constructor() {
        super();
    }

    getTradingPairUrl(tradingPair: TradingPair): string {
        return `https://www.binance.com/en/trade/${tradingPair.getBaseAsset()}_${tradingPair.getQuoteAsset()}?type=spot`
    }

    /**
     * Fetch trading pairs from Binance.
     * @param callback - called for each trading pair (baseAsset, quoteAsset)
     */
    async fetchTradingPairs(
        callback: (baseAsset: Asset, quoteAsset: Asset) => void
    ): Promise<void> {
        if (typeof callback !== "function") {
            throw new TypeError("callback must be a function");
        }

        const res = await fetch(`${ExchangeMethodsBinance.BASE_URL}/api/v3/exchangeInfo`);
        if (!res.ok) {
            throw new Error(`Binance exchangeInfo failed (${res.status})`);
        }

        const info = (await res.json()) as {
            symbols: Array<{
                symbol: string;
                status: string;
                baseAsset: string;
                quoteAsset: string;
                isSpotTradingAllowed: boolean;
            }>;
        };

        if (!Array.isArray(info.symbols)) {
            throw new Error("Invalid Binance exchangeInfo response");
        }

        for (const s of info.symbols) {
            if (s.status !== "TRADING") continue;
            if (!s.isSpotTradingAllowed) continue;
            callback(Asset.fromUnknown(s.baseAsset), Asset.fromUnknown(s.quoteAsset));
        }
    }

    /**
     * Fetch historical candles.
     * @param tradingPair - TradingPair instance
     * @param timeFrame - TimeFrame instance
     * @param startTimeMsInclusive - start timestamp (ms)
     * @param endTimeMsExclusive - end timestamp (ms)
     * @returns ordered OHLCV entries
     */
    async fetchHistoricalCandles(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        startTimeMsInclusive: number,
        endTimeMsExclusive: number
    ): Promise<OhlcvEntry[]> {

        const symbol = tradingPair.symbol();
        const interval = ExchangeMethodsBinance.mapTimeFrameToBinanceInterval(timeFrame);

        const toReturn: OhlcvEntry[] = [];
        let cursorTime = startTimeMsInclusive;
        if (!timeFrame.isTimestampAligned(cursorTime)) {
            cursorTime = cursorTime - (cursorTime % timeFrame.asMilliseconds());
        }

        while (cursorTime < endTimeMsExclusive) {
            const url = new URL(`${ExchangeMethodsBinance.BASE_URL}/api/v3/klines`);
            url.searchParams.set("symbol", symbol);
            url.searchParams.set("interval", interval);
            url.searchParams.set("startTime", `${cursorTime}`);
            url.searchParams.set("limit", `${ExchangeMethodsBinance.MAX_LIMIT}`);

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`Binance OHLCV fetch failed (${res.status})`);

            const data: any[] = await res.json();
            if (!Array.isArray(data) || data.length === 0) break;

            const entries = data.map(item =>
                ExchangeMethodsBinance.#createOhlcvEntry(item, timeFrame, endTimeMsExclusive)
            );

            if (entries.length > 0) {
                const filtered = entries.filter(d => d.isClosed === true);
                toReturn.push(...filtered);
                const last = entries[entries.length - 1];
                cursorTime = last.startTime + timeFrame.asMilliseconds();
            }

            if (entries.length < ExchangeMethodsBinance.MAX_LIMIT) {
                break;
            }
        }

        // Ensure ascending order
        for (let i = 1; i < toReturn.length; i++) {
            if (toReturn[i].startTime < toReturn[i - 1].startTime) {
                throw new Error("Non-ascending candles returned by Binance");
            }
        }

        return toReturn;
    }

    /**
     * Create OhlcvEntry from raw Binance kline data
     */
    static #createOhlcvEntry(
        item: any,
        timeFrame: TimeFrame,
        endTimeMsExclusive: number
    ): OhlcvEntry {
        if (!Array.isArray(item) || item.length < 7) {
            throw new Error("Invalid kline format from Binance");
        }

        const entry = new OhlcvEntry();
        entry.update(
            timeFrame,
            +item[1], // open
            +item[2], // high
            +item[3], // low
            +item[4], // close
            +item[5], // volume
            +item[0], // startTime
            +item[6], // closeTime
            +item[6] < endTimeMsExclusive // isClosed
        );

        return entry;
    }

    /** Returns the Binance string label for a TimeFrame instance */
    private static mapTimeFrameToBinanceInterval(timeFrame: TimeFrame): string {
        switch (timeFrame) {
            case TimeFrame.ONE_MINUTE: return "1m";
            case TimeFrame.FIVE_MINUTES: return "5m";
            case TimeFrame.FIFTEEN_MINUTES: return "15m";
            case TimeFrame.ONE_HOUR: return "1h";
            case TimeFrame.FOUR_HOURS: return "4h";
            case TimeFrame.ONE_DAY: return "1d";
            default:
                throw new RangeError(`Unsupported TimeFrame for Binance: ${timeFrame.getLabel()}`);
        }
    }

}
