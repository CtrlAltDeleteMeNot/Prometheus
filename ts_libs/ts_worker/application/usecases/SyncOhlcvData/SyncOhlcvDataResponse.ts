import { TradingPairModel } from "../../exports/TradingPairModel";

export class SyncOhlcvDataResponse {
    #updatedEntriesCount: number;
    #tradingPairModel: readonly TradingPairModel[];
    constructor(updatedEntriesCount: number, tradingPairModel: readonly TradingPairModel[]) {
        this.#updatedEntriesCount = updatedEntriesCount;
        this.#tradingPairModel = tradingPairModel;
        Object.freeze(this);
    }

    getUpdatedEntriesCount(): number {
        return this.#updatedEntriesCount;
    }

    getTradingPairModel(): readonly TradingPairModel[] {
        return this.#tradingPairModel;
    }
}
