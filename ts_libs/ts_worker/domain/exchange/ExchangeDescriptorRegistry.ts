import { ExchangeDescriptor } from "./ExchangeDescriptor";

/**
 * Registry for ExchangeDescriptor instances
 */
export class ExchangeDescriptorRegistry {
    private readonly exchanges: Map<number, ExchangeDescriptor>;

    constructor() {
        this.exchanges = new Map<number, ExchangeDescriptor>();
    }

    /**
     * Register a new exchange descriptor
     * @param descriptor ExchangeDescriptor instance
     * @returns The registered descriptor
     */
    register(descriptor: ExchangeDescriptor): ExchangeDescriptor {
        if (!(descriptor instanceof ExchangeDescriptor)) {
            throw new TypeError("Must be ExchangeDescriptor");
        }
        this.exchanges.set(descriptor.getId(), descriptor);
        return descriptor;
    }

    /**
     * Find exchange descriptor by id
     * @param id numeric id of the exchange
     */
    byId(id: number): ExchangeDescriptor {
        const ex = this.exchanges.get(id);
        if (!ex) throw new RangeError(`Exchange id=${id} not found`);
        return ex;
    }

    /**
     * Find exchange descriptor by name (case-insensitive)
     * @param name exchange name
     */
    byName(name: string): ExchangeDescriptor {
        for (const ex of this.exchanges.values()) {
            if (ex.getName().toLowerCase() === name.toLowerCase()) return ex;
        }
        throw new RangeError(`Exchange name="${name}" not found`);
    }

    /**
     * Return all registered exchanges
     */
    all(): ExchangeDescriptor[] {
        return Array.from(this.exchanges.values());
    }
}
