import { TradingPair } from "../../../domain/entities/TradingPair";
import { BasePlugin } from "../../../domain/ta/export/BasePlugin";


export class RegisterPluginsRequest {
    readonly #plugins: readonly BasePlugin[];
    readonly #tradingPairs: readonly TradingPair[];
    constructor(
        plugins: readonly BasePlugin[],
        tradingPairs: readonly TradingPair[]
    ) {
        this.#plugins = plugins;
        this.#tradingPairs = tradingPairs;
        Object.freeze(this);
    }

    get plugins(): readonly BasePlugin[]{
        return this.#plugins;
    }

    get tradingPairs():readonly TradingPair[]{
        return this.#tradingPairs;
    }
}
