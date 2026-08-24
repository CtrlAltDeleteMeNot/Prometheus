export class MathContext {
    
    /**
     * Round a number to the defined scale
     * @param value - The number to round
     * @returns The rounded number
     */
    static roundToScale(value: number): number {
        if (!Number.isFinite(value)) {
            throw new TypeError("value must be a finite number");
        }
        return Number(value.toFixed(8));
    }
}
