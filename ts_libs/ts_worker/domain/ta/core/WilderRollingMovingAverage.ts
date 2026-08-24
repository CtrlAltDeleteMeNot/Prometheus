import { MathContext } from "./MathContext";
import { Period } from "./Period";

/**
 * Wilder's Moving Average.
 *
 * Bootstrap:
 *     SMA of the first `period` samples
 *
 * Subsequent values:
 *     Wilder MA = previous + (value - previous) / period
 *
 * Also known as RMA / SMMA.
 */
export class WilderRollingMovingAverage {

    constructor(period: Period) {
        this.period = Period.fromUnknown(period);
        this.bootstrapSum = 0;
        this.samplesCount = 0;
        this.currentValue = null;
    }

    /**
     * Adds a new value and updates the Wilder moving average.
     *
     * @param value New sample
     * @returns Current Wilder MA, or null until enough samples are available
     */
    push(value: number): number | null {
        if (!Number.isFinite(value)) {
            throw new TypeError(
                `Wilder MA value must be finite, got ${value}`
            );
        }

        const period = this.period.getValue();

        // Bootstrap using SMA.
        if (this.currentValue === null) {
            this.bootstrapSum += value;
            this.samplesCount++;

            if (this.samplesCount < period) {
                return null;
            }

            this.currentValue = this.bootstrapSum / period;

            return this.currentValue;
        }

        // Wilder smoothing:
        //
        // previous + (value - previous) / period
        this.currentValue = this.currentValue + (value - this.currentValue) / period;
        return this.currentValue;
    }

    isReady(): boolean {
        return this.currentValue !== null;
    }

    private readonly period: Period;
    private bootstrapSum: number;
    private samplesCount: number;
    private currentValue: number | null;
}