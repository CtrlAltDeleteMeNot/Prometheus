import { TradingPair } from "../../domain/entities/TradingPair";
import { ExchangeDescriptor } from "../../domain/exchange/ExchangeDescriptor";
import { ExchangeDescriptorRegistry } from "../../domain/exchange/ExchangeDescriptorRegistry";
import { ExchangeMethodsRegistry } from "../../domain/exchange/ExchangeMethodsRegistry";
import { TradingPairsRepository } from "../../domain/repositories/TradingPairsRepository";
import { Asset } from "../../domain/values/Asset";
import { ExchangeMethodsBinance } from "../../infrastructure/exchanges/ExchangeMethodsBinance";
import { ExchangeMethodsBybit } from "../../infrastructure/exchanges/ExchangeMethodsBybit";
import { TimeProvider } from "../../infrastructure/time/TimeProvider";
import { EnumerateExchangesUseCase } from "./EnumerateExchanges/EnumerateExchangesUseCase";
import { FetchOhlcvDataUseCase } from "./FetchOhlcvData/FetchOhlcvDataUseCase";
import { FilterTradingPairsUseCase } from "./FilterTradingPairs/FilterTradingPairsUseCase";
import { SyncOhlcvDataUseCase } from "./SyncOhlcvData/SyncOhlcvDataUseCase";


export class UseCaseContainer {
    public readonly timeProvider: TimeProvider;
    public readonly exchangeMethodsRegistry: ExchangeMethodsRegistry;
    public readonly exchangeDescriptorRegistry: ExchangeDescriptorRegistry;
    public readonly tradingPairsRepository: TradingPairsRepository;
    public readonly enumerateExchangesUseCase: EnumerateExchangesUseCase;
    public readonly filterTradingPairsUseCase: FilterTradingPairsUseCase;
    public readonly fetchOhlcvDataUseCase: FetchOhlcvDataUseCase;
    public readonly syncOhlcvDataUseCase: SyncOhlcvDataUseCase;

    constructor(
        exchangeDescriptorRegistry: ExchangeDescriptorRegistry,
        exchangeMethodsRegistry: ExchangeMethodsRegistry,
        tradingPairsRepository: TradingPairsRepository
    ) {
        this.timeProvider = new TimeProvider();
        this.exchangeDescriptorRegistry = exchangeDescriptorRegistry;
        this.exchangeMethodsRegistry = exchangeMethodsRegistry;
        this.tradingPairsRepository = tradingPairsRepository;
        this.enumerateExchangesUseCase = new EnumerateExchangesUseCase(exchangeDescriptorRegistry);
        this.filterTradingPairsUseCase = new FilterTradingPairsUseCase(tradingPairsRepository);
        this.fetchOhlcvDataUseCase = new FetchOhlcvDataUseCase(exchangeMethodsRegistry);
        this.syncOhlcvDataUseCase = new SyncOhlcvDataUseCase(exchangeMethodsRegistry);

        Object.freeze(this);
    }

    /** Factory method to create a fully initialized UseCaseContainer */
    static async Create(): Promise<UseCaseContainer> {
        const exchangeDescriptorRegistry = new ExchangeDescriptorRegistry();
        const exchangeMethodsRegistry = new ExchangeMethodsRegistry();

        // Register exchanges
        const binanceDescriptor = exchangeDescriptorRegistry.register(new ExchangeDescriptor(1, "Binance"));
        const bybitDescriptor = exchangeDescriptorRegistry.register(new ExchangeDescriptor(2, "Bybit"));

        // Register exchange methods
        exchangeMethodsRegistry.register(binanceDescriptor, new ExchangeMethodsBinance());
        exchangeMethodsRegistry.register(bybitDescriptor, new ExchangeMethodsBybit());

        // Initialize trading pair repository
        const tradingPairsRepository = new TradingPairsRepository();
        const exchangeDescriptors = exchangeDescriptorRegistry.all();

        for (const exchangeDescriptor of exchangeDescriptors) {
            const methods = exchangeMethodsRegistry.get(exchangeDescriptor);
            await methods.fetchTradingPairs((baseAsset: Asset, quoteAsset: Asset) => {
                const pair = new TradingPair(exchangeDescriptor, baseAsset, quoteAsset);
                tradingPairsRepository.registerPair(pair);
            });
        }

        return new UseCaseContainer(exchangeDescriptorRegistry, exchangeMethodsRegistry, tradingPairsRepository);
    }
}
