import { ExchangeDescriptor } from '../exchange/ExchangeDescriptor';

export class ExchangeDescriptorRepository {
    private exchanges: Map<number, ExchangeDescriptor>;

    constructor() {
        this.exchanges = new Map<number, ExchangeDescriptor>();
    }

    /**
     * Register an ExchangeDescriptor
     * @param descriptor - Descriptor to register
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
     * Lookup descriptor by numeric ID
     * @param id - Exchange ID
     * @returns ExchangeDescriptor
     */
    byId(id: number): ExchangeDescriptor {
        const ex = this.exchanges.get(id);
        if (!ex) throw new RangeError(`Exchange id=${id} not found`);
        return ex;
    }

    /**
     * Lookup descriptor by name (case-insensitive)
     * @param name - Exchange name
     * @returns ExchangeDescriptor
     */
    byName(name: string): ExchangeDescriptor {
        for (const ex of this.exchanges.values()) {
            if (ex.getName().toLowerCase() === name.toLowerCase()) return ex;
        }
        throw new RangeError(`Exchange name="${name}" not found`);
    }

    /**
     * Get all registered ExchangeDescriptors
     * @returns Array of ExchangeDescriptor
     */
    all(): ExchangeDescriptor[] {
        return Array.from(this.exchanges.values());
    }
}
