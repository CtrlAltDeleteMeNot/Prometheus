import { UseCaseBase } from "../UseCaseBase";
import { ExchangeDescriptorRegistry } from "../../../domain/exchange/ExchangeDescriptorRegistry";
import { EnumerateExchangesRequest } from "./EnumerateExchangesRequest";
import { EnumerateExchangesResponse } from "./EnumerateExchangesResponse";
import { ExchangeDescriptor } from "../../../domain/exchange/ExchangeDescriptor";



/**
 * Use case: enumerate all registered exchanges
 */
export class EnumerateExchangesUseCase extends UseCaseBase<EnumerateExchangesRequest, EnumerateExchangesResponse> {
    #exchangeDescriptorRegistry: ExchangeDescriptorRegistry;

    constructor(exchangeDescriptorRegistry: ExchangeDescriptorRegistry) {
        super();
        this.#exchangeDescriptorRegistry = exchangeDescriptorRegistry;
    }

    /**
     * Return all exchange descriptors
     * @param _requestModel - empty request (EnumerateExchangesRequest)
     */
    protected async run(_requestModel: EnumerateExchangesRequest): Promise<EnumerateExchangesResponse> {
        if (_requestModel.includes === undefined) {
            return new EnumerateExchangesResponse(this.#exchangeDescriptorRegistry.all());
        }
        let filtered: ExchangeDescriptor[] = [];
        for (let index = 0; index < _requestModel.includes.length; index++) {
            const exchangeName = _requestModel.includes[index];
            const descriptor = this.#exchangeDescriptorRegistry.byName(exchangeName);
            filtered.push(descriptor);
        }
        return new EnumerateExchangesResponse(filtered);
    }
}
