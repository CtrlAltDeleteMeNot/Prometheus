import { TimeProviderBase } from "./TimeProviderBase";

/**
 * Exchange server time utilities.
 */
export class TimeProvider extends TimeProviderBase {
    /** Maximum allowed clock skew in milliseconds (10 seconds) */
    static readonly MAX_ALLOWED_SKEW_MS = 10_000;

    constructor() {
        super();
    }

    /**
     * Fetch Binance server time via REST API
     * GET /api/v3/time
     * @returns timestamp in milliseconds
     */
    async #fetchBinanceTime(): Promise<number> {
        const res = await fetch("https://api.binance.com/api/v3/time");
        if (!res.ok) {
            throw new Error(`Binance time fetch failed (${res.status})`);
        }

        const json = (await res.json()) as { serverTime: number };

        if (!Number.isFinite(json.serverTime)) {
            throw new Error("Invalid Binance time response");
        }

        return json.serverTime;
    }

    /**
     * Fetch unified server time from Local. Optionally checks time skew.
     *
     * If skew <= MAX_ALLOWED_SKEW_MS → returns the lowest time.
     * If skew > MAX_ALLOWED_SKEW_MS → throws an Error.
     *
     * @param checkForTimeSkew - whether to check clock skew
     * @returns unified server time in milliseconds
     * @throws Error if clock skew exceeds threshold
     */
    async getUtcNowMilliseconds(checkForTimeSkew = false): Promise<number> {
        const localTime = Date.now();

        if (!checkForTimeSkew) {
            return localTime;
        }

        const binanceTime = await this.#fetchBinanceTime();

        if (!Number.isFinite(binanceTime) || !Number.isFinite(localTime)) {
            throw new Error("Invalid server time received");
        }

        const skew = Math.abs(binanceTime - localTime);

        if (skew > TimeProvider.MAX_ALLOWED_SKEW_MS) {
            throw new Error(
                `Time skew too large: ${skew} ms ` +
                `(Binance=${binanceTime}, LocalTime=${localTime})`
            );
        }

        return Math.min(binanceTime, localTime);
    }
}
