export class MathContext {
    /** Scaling factor */
    static readonly SCALE = 1e8;

    /**
     * Round a number to the defined scale
     * @param value - The number to round
     * @returns The rounded number
     */
    static roundToScale(value: number): number {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("value must be a finite number");
        }
        return Math.round(value * MathContext.SCALE) / MathContext.SCALE;
    }
}
