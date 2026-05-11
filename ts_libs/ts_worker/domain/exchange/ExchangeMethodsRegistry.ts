import { ExchangeDescriptor } from "./ExchangeDescriptor";
import { ExchangeMethodsBase } from "./ExchangeMethodsBase";

/**
 * Registry to store and retrieve ExchangeMethods by ExchangeDescriptor.
 */
export class ExchangeMethodsRegistry {
    private readonly map: Map<number, ExchangeMethodsBase>;

    constructor() {
        this.map = new Map();
    }

    /**
     * Register exchange methods for a specific exchange.
     * @param exchangeDescriptor - descriptor of the exchange
     * @param methods - implementation of exchange methods
     */
    register(
        exchangeDescriptor: ExchangeDescriptor,
        methods: ExchangeMethodsBase
    ): void {
        this.map.set(exchangeDescriptor.getId(), methods);
    }

    /**
     * Get exchange methods for a specific exchange.
     * @param exchangeDescriptor - descriptor of the exchange
     * @returns registered exchange methods
     * @throws Error if no methods registered for this exchange
     */
    get(exchangeDescriptor: ExchangeDescriptor): ExchangeMethodsBase {
        const methods = this.map.get(exchangeDescriptor.getId());
        if (!methods) {
            throw new Error(
                `No ExchangeMethods registered for exchangeId=${exchangeDescriptor.getId()}`
            );
        }
        return methods;
    }
}
