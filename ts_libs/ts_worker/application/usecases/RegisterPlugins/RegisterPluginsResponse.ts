import { BasePlugin } from "../../../domain/ta/export/BasePlugin";


export class RegisterPluginsResponse {
    readonly #plugins: readonly BasePlugin[];
    constructor(
        plugins: readonly BasePlugin[],
    ) {
        this.#plugins = plugins;
        Object.freeze(this);
    }

    get plugins(): readonly BasePlugin[]{
        return this.#plugins;
    }
}
