export class MutableFloat {
    #value: number;

    /**
     * @param initial Initial value (default 0)
     */
    constructor(initial = 0) {
        this.#value = 0;
        this.update(initial);
    }

    /**
     * Get the current value
     */
    getValue(): number {
        return this.#value;
    }

    /**
     * Update the value
     * @param data New number
     */
    update(data: number): void {
        if (typeof data !== "number" || !Number.isFinite(data)) {
            throw new TypeError("Data must be a finite number");
        }
        this.#value = data;
    }
}
