export class Period {
    private readonly value: number;

    /**
     * @param aValue Must be a positive integer ≥ 2
     */
    constructor(aValue: number) {
        if (!Number.isInteger(aValue)) {
            throw new TypeError(
                `Period value must be an integer, got ${aValue}`
            );
        }
        if (aValue < 2) {
            throw new RangeError(
                `Period value must be at least 2, got ${aValue}`
            );
        }

        this.value = aValue;
        Object.freeze(this);
    }

    getValue(): number {
        return this.value;
    }

    /**
     * Runtime validation / normalization helper
     * Accepts a Period or an integer.
     *
     * @param value unknown
     * @throws TypeError | RangeError
     */
    static fromUnknown(value: unknown): Period {
        if (value instanceof Period) {
            return value;
        }

        if (typeof value === "number") {
            return new Period(value);
        }

        throw new TypeError(
            `Value must be a Period or an integer, got ${typeof value}`
        );
    }
}
