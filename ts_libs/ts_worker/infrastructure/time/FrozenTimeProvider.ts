import { TimeProviderBase } from "./TimeProviderBase";

/**
 * FrozenTimeProvider always returns a fixed timestamp (for testing).
 */
export class FrozenTimeProvider extends TimeProviderBase {
    private readonly frozenTimeMs: number;

    /**
     * @param frozenTimeMs - timestamp in milliseconds to always return
     */
    constructor(frozenTimeMs: number) {
        super();
        this.frozenTimeMs = frozenTimeMs;
    }

    /**
     * Returns the frozen timestamp, ignoring skew checks.
     * @param checkForTimeSkew - ignored
     * @returns the frozen time in milliseconds
     */
    async getUtcNowMilliseconds(checkForTimeSkew = false): Promise<number> {
        return this.frozenTimeMs;
    }
}
