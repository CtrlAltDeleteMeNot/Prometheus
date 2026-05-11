import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";

export class FetchOhlcvDataResponse {
    readonly #multiTimeFrameData: readonly MultiTimeframeOhlcv[];

    constructor(multiTimeFrameData: MultiTimeframeOhlcv[]) {
        this.#multiTimeFrameData = Object.freeze([...multiTimeFrameData]);
        Object.freeze(this);
    }

    getMultiTimeFrameData(): readonly MultiTimeframeOhlcv[] {
        return this.#multiTimeFrameData;
    }
}
