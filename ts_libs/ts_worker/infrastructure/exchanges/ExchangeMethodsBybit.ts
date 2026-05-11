import { ExchangeMethodsBase } from "../../domain/exchange/ExchangeMethodsBase";
import { TradingPair } from "../../domain/entities/TradingPair";
import { TimeFrame } from "../../domain/values/TimeFrame";
import { OhlcvEntry } from "../../domain/values/OhlcvEntry";
import { Asset } from "../../domain/values/Asset";

/**
 * Bybit-specific implementation of ExchangeMethodsBase (Spot v5)
 */
export class ExchangeMethodsBybit extends ExchangeMethodsBase {
    
    static readonly BASE_URL = "https://api.bybit.com";
    static readonly MAX_LIMIT = 1000; // Bybit v5 spot max

    constructor() {
        super();
    }

    getTradingPairUrl(tradingPair: TradingPair): string {
        return `https://www.bybit.com/en/trade/spot/${tradingPair.getBaseAsset()}/${tradingPair.getQuoteAsset()}`
    }

    /**
     * Fetch trading pairs from Bybit Spot.
     * @param callback Called for each trading pair (baseAsset, quoteAsset)
     */
    async fetchTradingPairs(
        callback: (baseAsset: Asset, quoteAsset: Asset) => void
    ): Promise<void> {
        const url = `${ExchangeMethodsBybit.BASE_URL}/v5/market/instruments-info?category=spot`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Bybit Spot symbols fetch failed (${res.status})`);
        }

        const json = await res.json() as {
            retCode: number;
            retMsg: string;
            result?: { list: Array<{ baseCoin: string; quoteCoin: string; status: string }> };
        };

        if (json.retCode !== 0) {
            throw new Error(`Bybit Spot API error: ${json.retMsg}`);
        }

        const list = json.result?.list ?? [];
        list
            .filter(s => s.status === "Trading")
            .forEach(s => callback(Asset.fromUnknown(s.baseCoin), Asset.fromUnknown(s.quoteCoin)));
    }

    /**
     * Map internal TimeFrame enum to Bybit v5 interval identifiers.
     */
    private static mapTimeFrameToBybitInterval(timeFrame: TimeFrame): string {
        switch (timeFrame) {
            case TimeFrame.ONE_MINUTE: return "1";
            case TimeFrame.FIVE_MINUTES: return "5";
            case TimeFrame.FIFTEEN_MINUTES: return "15";
            case TimeFrame.ONE_HOUR: return "60";
            case TimeFrame.FOUR_HOURS: return "240";
            case TimeFrame.ONE_DAY: return "D";
            // case TimeFrame.ONE_WEEK: return "W"; // if you support weekly
            default:
                throw new RangeError(`Unsupported TimeFrame for Bybit Spot: ${timeFrame.getLabel()}`);
        }
    }

    /**
     * Fetch historical candles for a trading pair.
     */
    async fetchHistoricalCandles(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        startTimeMsInclusive: number,
        endTimeMsExclusive: number
    ): Promise<OhlcvEntry[]> {
        const symbol = tradingPair.symbol();
        const interval = ExchangeMethodsBybit.mapTimeFrameToBybitInterval(timeFrame);

        const toReturn: OhlcvEntry[] = [];
        let cursorTime = startTimeMsInclusive;
        if (!timeFrame.isTimestampAligned(cursorTime)) {
            cursorTime = cursorTime - (cursorTime % timeFrame.asMilliseconds());
        }

        while (cursorTime < endTimeMsExclusive) {
            const url = new URL(`${ExchangeMethodsBybit.BASE_URL}/v5/market/kline`);
            url.searchParams.set("category", "spot");
            url.searchParams.set("symbol", symbol);
            url.searchParams.set("interval", interval);
            url.searchParams.set("start", `${cursorTime}`);
            url.searchParams.set("limit", `${ExchangeMethodsBybit.MAX_LIMIT}`);

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`Bybit Spot OHLCV fetch failed (${res.status})`);

            const json = await res.json() as {
                retCode: number;
                retMsg: string;
                result?: { list: any[] };
            };

            if (json.retCode !== 0) throw new Error(`Bybit Spot API error: ${json.retMsg}`);

            const list = json.result?.list ?? [];
            if (list.length === 0) break;

            // Bybit returns newest → oldest, reverse to ascending
            list.reverse();

            for (const item of list) {
                const startMs = Number(item[0]);
                const endMs = startMs + timeFrame.asMilliseconds() - 1;

                if (startMs >= endTimeMsExclusive) {
                    //avoid useless processing
                    break;
                }
                if (startMs < cursorTime){
                    //sometimes bybit returns more data than required
                    //therefore, moving forward
                    continue;
                }

                const entry = new OhlcvEntry();
                entry.update(
                    timeFrame,
                    +item[1], // open
                    +item[2], // high
                    +item[3], // low
                    +item[4], // close
                    +item[5], // volume
                    startMs,
                    endMs,
                    endMs < endTimeMsExclusive // isClosed
                );

                if (entry.isClosed) {
                    toReturn.push(entry);
                }
            }

            // Advance cursor using last raw startTime
            const lastRawStartTime = Number(list[list.length - 1][0]);
            cursorTime = lastRawStartTime + timeFrame.asMilliseconds();

            if (list.length < ExchangeMethodsBybit.MAX_LIMIT) break;
        }

        // Ensure ascending order
        for (let i = 1; i < toReturn.length; i++) {
            if (toReturn[i].startTime < toReturn[i - 1].startTime) {
                throw new Error("Non-ascending candles returned by Bybit");
            }
        }

        return toReturn;
    }
}
