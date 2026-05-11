import { MultiTimeframeOhlcv } from "../../../domain/values/MultiTimeframeOhlcv";

export class SyncOhlcvDataResponse {
    #multiTimeFrameData: readonly MultiTimeframeOhlcv[];
    #updatedEntriesCount: number;

    constructor(multiTimeFrameData: readonly MultiTimeframeOhlcv[], updatedEntriesCount: number) {
        // Validate input
        multiTimeFrameData.forEach(mtf => MultiTimeframeOhlcv.fromUnknown(mtf));

        this.#multiTimeFrameData = multiTimeFrameData;
        this.#updatedEntriesCount = updatedEntriesCount;
        Object.freeze(this);
    }

    getMultiTimeFrameData(): readonly MultiTimeframeOhlcv[] {
        return this.#multiTimeFrameData;
    }

    getUpdatedEntriesCount(): number {
        return this.#updatedEntriesCount;
    }


}
