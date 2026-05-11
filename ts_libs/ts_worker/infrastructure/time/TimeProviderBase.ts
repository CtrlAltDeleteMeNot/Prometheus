export abstract class TimeProviderBase {
    /**
     * Fetch unified server time from local. Optionally checks time skew.
     *
     * If skew <= MAX_ALLOWED_SKEW_MS → return the lowest time.
     * If skew > MAX_ALLOWED_SKEW_MS → throw.
     *
     * @param checkForTimeSkew - whether to check for time skew
     * @returns unified server time in milliseconds
     * @throws Error if clock skew exceeds threshold
     */
    async getUtcNowMilliseconds(checkForTimeSkew = false): Promise<number> {
        throw new Error("Not implemented");
    }

    /**
     * Format a timestamp (ms) to a human-readable UTC string.
     *
     * Format: YYYY-MM-DD HH:mm:ss.SSS UTC
     *
     * @param timestampMs - timestamp in milliseconds
     * @returns formatted UTC string
     */
    public static formatUtc(timestampMs: number): string {
        if (!Number.isFinite(timestampMs)) {
            throw new TypeError("timestampMs must be a finite number");
        }

        const d = new Date(timestampMs);

        const yyyy = d.getUTCFullYear();
        const mm = TimeProviderBase.pad(d.getUTCMonth() + 1, 2);
        const dd = TimeProviderBase.pad(d.getUTCDate(), 2);

        const hh = TimeProviderBase.pad(d.getUTCHours(), 2);
        const mi = TimeProviderBase.pad(d.getUTCMinutes(), 2);
        const ss = TimeProviderBase.pad(d.getUTCSeconds(), 2);
        const ms = TimeProviderBase.pad(d.getUTCMilliseconds(), 3);

        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms} UTC`;
    }

    /**
     * Left-pad a number with zeros
     * @param value - number to pad
     * @param width - desired width
     * @returns zero-padded string
     */
    public static pad(value: number, width: number): string {
        let s = String(value);
        while (s.length < width) {
            s = "0" + s;
        }
        return s;
    }
}
