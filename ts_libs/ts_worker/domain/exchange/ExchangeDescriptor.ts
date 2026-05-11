export class ExchangeDescriptor {
    // Private fields
    #id: number;
    #name: string;

    /**
     * Create a new ExchangeDescriptor.
     * @param id - integer ID
     * @param name - non-empty string
     */
    constructor(id: number, name: string) {
        if (!Number.isInteger(id)) {
            throw new TypeError("id must be an integer");
        }
        if (typeof name !== "string" || name.length === 0) {
            throw new TypeError("name must be a non-empty string");
        }

        this.#id = id;
        this.#name = name;

        Object.freeze(this); // Immutable instance
    }

    /** ============================
     * Public getters
     * ============================ */
    getId(): number {
        return this.#id;
    }

    getName(): string {
        return this.#name;
    }

    static fromUnknown(value: unknown): ExchangeDescriptor {
        if (!(value instanceof ExchangeDescriptor)) {
            throw new TypeError("Expected ExchangeDescriptor");
        }
        return value;
    }
}
