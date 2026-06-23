import { SignalModel } from "../../exports/SignalModel";
import { TradingPairModel } from "../../exports/TradingPairModel";

export class SyncOhlcvDataResponse {
    #updatedEntriesCount: number;
    #tradingPairModels: readonly TradingPairModel[];
    #signalModels: readonly SignalModel[];
    constructor(updatedEntriesCount: number, tradingPairModels: readonly TradingPairModel[], signalModels: readonly SignalModel[]) {
        this.#updatedEntriesCount = updatedEntriesCount;
        this.#tradingPairModels = tradingPairModels;
        this.#signalModels = signalModels;
        Object.freeze(this);
    }

    getUpdatedEntriesCount(): number {
        return this.#updatedEntriesCount;
    }

    getTradingPairModels(): readonly TradingPairModel[] {
        return this.#tradingPairModels;
    }

    getSignalModels(): readonly SignalModel[] {
        return this.#signalModels;
    }
}
