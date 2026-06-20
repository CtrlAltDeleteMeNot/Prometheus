
export class FetchOhlcvDataResponse {
    readonly #count: number;

    constructor(count: number) {
        this.#count = count;
        Object.freeze(this);
    }

    getCount(): number {
        return this.#count;
    }
}
