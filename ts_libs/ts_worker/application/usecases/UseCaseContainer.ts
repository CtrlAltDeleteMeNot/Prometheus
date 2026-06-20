import { TradingPair } from "../../domain/entities/TradingPair";
import { ExchangeDescriptor } from "../../domain/exchange/ExchangeDescriptor";
import { ExchangeDescriptorRegistry } from "../../domain/exchange/ExchangeDescriptorRegistry";
import { ExchangeMethodsRegistry } from "../../domain/exchange/ExchangeMethodsRegistry";
import { TradingPairsRepository } from "../../domain/repositories/TradingPairsRepository";
import { TechnicalAnalisysRepository } from "../../domain/ta/TechnicalAnalisysRepository";
import { Asset } from "../../domain/values/Asset";
import { ExchangeMethodsBinance } from "../../infrastructure/exchanges/ExchangeMethodsBinance";
import { ExchangeMethodsBybit } from "../../infrastructure/exchanges/ExchangeMethodsBybit";
import { TimeProvider } from "../../infrastructure/time/TimeProvider";
import { ScreenerSettings } from "../exports/ScreenerSettings";
import { ExchangeInclusionCriteria } from "../exports/settings/ExchangeInclusionCriteria";
import { EnumerateExchangesUseCase } from "./EnumerateExchanges/EnumerateExchangesUseCase";
import { FetchOhlcvDataUseCase } from "./FetchOhlcvData/FetchOhlcvDataUseCase";
import { FilterTradingPairsUseCase } from "./FilterTradingPairs/FilterTradingPairsUseCase";
import { RegisterPluginsUseCase } from "./RegisterPlugins/RegisterPluginsUseCase";
import { SyncOhlcvDataUseCase } from "./SyncOhlcvData/SyncOhlcvDataUseCase";


export class UseCaseContainer {
    public readonly timeProvider: TimeProvider;
    public readonly exchangeMethodsRegistry: ExchangeMethodsRegistry;
    public readonly exchangeDescriptorRegistry: ExchangeDescriptorRegistry;
    public readonly tradingPairsRepository: TradingPairsRepository;
    public readonly enumerateExchangesUseCase: EnumerateExchangesUseCase;
    public readonly filterTradingPairsUseCase: FilterTradingPairsUseCase;
    public readonly registerPluginsUseCase: RegisterPluginsUseCase;
    public readonly fetchOhlcvDataUseCase: FetchOhlcvDataUseCase;
    public readonly syncOhlcvDataUseCase: SyncOhlcvDataUseCase;
    public readonly technicalAnalisysRepository: TechnicalAnalisysRepository;

    constructor(
        exchangeDescriptorRegistry: ExchangeDescriptorRegistry,
        exchangeMethodsRegistry: ExchangeMethodsRegistry,
        tradingPairsRepository: TradingPairsRepository
    ) {
        this.timeProvider = new TimeProvider();
        this.exchangeDescriptorRegistry = exchangeDescriptorRegistry;
        this.exchangeMethodsRegistry = exchangeMethodsRegistry;
        this.tradingPairsRepository = tradingPairsRepository;
        this.technicalAnalisysRepository = new TechnicalAnalisysRepository();
        this.enumerateExchangesUseCase = new EnumerateExchangesUseCase(exchangeDescriptorRegistry);
        this.filterTradingPairsUseCase = new FilterTradingPairsUseCase(tradingPairsRepository);
        this.registerPluginsUseCase = new RegisterPluginsUseCase(this.technicalAnalisysRepository);
        this.fetchOhlcvDataUseCase = new FetchOhlcvDataUseCase(this.technicalAnalisysRepository, exchangeMethodsRegistry);
        this.syncOhlcvDataUseCase = new SyncOhlcvDataUseCase(this.technicalAnalisysRepository, exchangeMethodsRegistry);
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

    static CreateDefaultSettings(container: UseCaseContainer) {
        let exchangeInclusionCriterias: ExchangeInclusionCriteria[] = [];
        let available = container.exchangeDescriptorRegistry.all();
        for (let i = 0; i < available.length; i++) {
            exchangeInclusionCriterias.push(new ExchangeInclusionCriteria(available[i].getName(), available[i].getId(), true));
        }
        return new ScreenerSettings(exchangeInclusionCriterias);
    }
}
