/**
 * Represents a single asset symbol (e.g., "BTC", "USDT").
 * Immutable value object.
 */
export class Asset {
    public readonly symbol: string;

    /**
     * @param symbol - asset symbol (non-empty, trimmed string)
     */
    constructor(symbol: string) {
        if (symbol.trim() === '') {
            throw new TypeError('Asset symbol must be a non-empty string');
        }
        this.symbol = symbol.trim().toUpperCase();

        Object.freeze(this); // immutable
    }

    /**
     * Value equality check.
     * @param other another Asset
     */
    equals(other: Asset): boolean {
        return this.symbol === other.symbol;
    }

    toString(): string {
        return this.symbol;
    }

    /**
     * Runtime-safe factory: validate unknown input
     * @param value unknown input (any type)
     * @returns Asset
     * @throws TypeError if value is not an Asset
     */
    static fromUnknown(value: unknown): Asset {
        if (value instanceof Asset) {
            return value;
        }
        if (typeof value === 'string') {
            return new Asset(value);
        }
        throw new TypeError(
            `Cannot create Asset from value: ${String(value)}`
        );
    }
}
