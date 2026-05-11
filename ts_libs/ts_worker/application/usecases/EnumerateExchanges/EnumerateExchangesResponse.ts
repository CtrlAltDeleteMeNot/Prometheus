import { ExchangeDescriptor } from "../../../domain/exchange/ExchangeDescriptor";

/**
 * Response model for EnumerateExchangesUseCase
 */
export class EnumerateExchangesResponse {
    #descriptors: ExchangeDescriptor[];

    constructor(descriptors: ExchangeDescriptor[]) {
        this.#descriptors = descriptors;
    }

    get descriptors(): ExchangeDescriptor[] {
        return [...this.#descriptors];
    }
}
