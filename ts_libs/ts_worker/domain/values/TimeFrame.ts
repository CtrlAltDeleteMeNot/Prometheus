/**
 * Utility functions for representing timeframe durations.
 */
export class TimeFrame {
    static readonly ISO_WEEK_EPOCH = 345600000; // Monday 1970-01-05 UTC
    private readonly milliseconds: number;
    private readonly label: string;

    /**
     * Creates a TimeFrame instance.
     * @param milliseconds - Duration in milliseconds.
     * @param label - Duration as a string.
     */
    private constructor(milliseconds: number, label: string) {
        this.milliseconds = milliseconds;
        this.label = label;
        Object.freeze(this);
    }

    public getLabel(): string {
        return this.label;
    }

    /**
     * One minute duration.
     */
    static readonly ONE_MINUTE = new TimeFrame(60000, '1m');
    /**
     * Five minutes duration.
     */
    static readonly FIVE_MINUTES = new TimeFrame(300000, '5m');
    /**
     * Fifteen minutes duration.
     */
    static readonly FIFTEEN_MINUTES = new TimeFrame(900000, '15m');
    /**
     * One hour duration.
     */
    static readonly ONE_HOUR = new TimeFrame(3600000, '1h');
    /**
     * Four hours duration.
     */
    static readonly FOUR_HOURS = new TimeFrame(14400000, '4h');
    /**
     * One day duration.
     */
    static readonly ONE_DAY = new TimeFrame(86400000, '1d');
    //static readonly ONE_WEEK = new TimeFrame(604800000, '1w');


    static readonly #VALUES = [
        TimeFrame.ONE_MINUTE,
        TimeFrame.FIVE_MINUTES,
        TimeFrame.FIFTEEN_MINUTES,
        TimeFrame.ONE_HOUR,
        TimeFrame.FOUR_HOURS,
        TimeFrame.ONE_DAY
    ];

    /**
     * Returns an array of all enum values.
     */
    public static values(): readonly TimeFrame[] {
        return TimeFrame.#VALUES;
    }

    /**
     * Validates the given value as a TimeFrame instance.
     * @param {unknown|TimeFrame|number} value - The value to validate.
     * @throws {TypeError} If the value is not a TimeFrame instance.
     * @throws {RangeError} If the value is a non-canonical TimeFrame instance.
     * @returns The validated TimeFrame instance.
     */
    public static fromUnknown(value: unknown): TimeFrame {
        if (value instanceof TimeFrame) {
            const canonical = TimeFrame.#VALUES.find(v => v === value);
            if (!canonical) {
                throw new RangeError('Non-canonical TimeFrame instance');
            }
            return canonical;
        }

        if (typeof value === 'number') {
            const canonical = TimeFrame.#VALUES.find(v => v.milliseconds === value);
            if (!canonical) {
                throw new RangeError('No TimeFrame for given milliseconds');
            }
            return canonical;
        }

        throw new TypeError('Value is not a TimeFrame or a number');
    }

    /**
     * Checks if this TimeFrame instance is equal to another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns {boolean} True if the instances are equal, false otherwise.
     */
    equals(other: unknown): boolean {
        try {
            return this === TimeFrame.fromUnknown(other);
        } catch {
            return false;
        }
    }

    /**
     * Compares this TimeFrame instance with another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns A number indicating the comparison result:
     *   < 0 if this is less than other
     *   = 0 if equal
     *   > 0 if this is greater than other
     */
    compareTo(other: TimeFrame): number {
        return this.milliseconds - other.milliseconds;
    }

    /**
     * Checks if this TimeFrame instance is less than another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns {boolean} True if this is less than other, false otherwise.
     */
    isLessThan(other: TimeFrame): boolean {
        return this.compareTo(other) < 0;
    }

    /**
     * Checks if this TimeFrame instance is less than or equal to another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns {boolean} True if this is less than or equal to other, false otherwise.
     */
    isLessThanOrEqual(other: TimeFrame): boolean {
        return this.compareTo(other) <= 0;
    }

    /**
     * Checks if this TimeFrame instance is greater than another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns {boolean} True if this is greater than other, false otherwise.
     */
    isGreaterThan(other: TimeFrame): boolean {
        return this.compareTo(other) > 0;
    }

    /**
     * Checks if this TimeFrame instance is greater than or equal to another.
     * @param other - The other TimeFrame instance to compare with.
     * @returns {boolean} True if this is greater than or equal to other, false otherwise.
     */
    isGreaterThanOrEqual(other: TimeFrame): boolean {
        return this.compareTo(other) >= 0;
    }

    /**
     * Checks if a given timestamp is aligned with this TimeFrame.
     * @param timestamp - The timestamp in milliseconds to check.
     * @returns {boolean} True if the timestamp is aligned, false otherwise.
     */
    isTimestampAligned(timestamp: number): boolean {
        switch (this) {
            case TimeFrame.ONE_MINUTE:
            case TimeFrame.FIVE_MINUTES:
            case TimeFrame.FIFTEEN_MINUTES:
            case TimeFrame.ONE_HOUR:
            case TimeFrame.FOUR_HOURS:
            case TimeFrame.ONE_DAY:
                return timestamp % this.milliseconds === 0;
            //case TimeFrame.ONE_WEEK:
            //    return (
            //        (timestamp - TimeFrame.ISO_WEEK_EPOCH) % TimeFrame.ONE_WEEK.milliseconds === 0
            //    );
            default:
                throw new Error(`Alignment not defined for timeframe ${this.label}`);
        }
    }

    /**
     * Returns the number of minutes that this timeframe represents.
     * @returns {number} The number of minutes as an integer.
     */
    asMinutes(): number {
        return this.milliseconds / TimeFrame.ONE_MINUTE.milliseconds;
    }

    /**
     * Returns the number of milliseconds that this timeframe represents.
     * @returns {number} The number of milliseconds as an integer.
     */
    asMilliseconds(): number {
        return this.milliseconds;
    }

}