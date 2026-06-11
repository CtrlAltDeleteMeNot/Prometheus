import { EnumerateExchangesRequest } from "../../ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest";
import { FilterTradingPairsRequest } from "../../ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest";
import { UseCaseContainer } from "../../ts_libs/ts_worker/application/usecases/UseCaseContainer";
import { TradingPair } from "../../ts_libs/ts_worker/domain/entities/TradingPair";
import { Asset } from "../../ts_libs/ts_worker/domain/values/Asset";
import fs from "fs";
import path from "path";
import { CoinMarketCapRegistry } from "./CoinMarketCapRegistry";

export class Downloader {
    private readonly outputDir: string;
    private readonly reportingDir: string;

    public constructor(outputDir: string, reportingDir: string) {
        this.outputDir = outputDir;
        this.reportingDir = reportingDir;
    }

    private async fetchTradingPairs(container: UseCaseContainer): Promise<TradingPair[]> {
       
        // -------------------------
        // Test 1: Enumerate Exchanges
        // -------------------------
        console.log("Enumerating exchanges...");
        const exchangesResponse = await container.enumerateExchangesUseCase.execute(new EnumerateExchangesRequest());
        console.log("Exchanges:", exchangesResponse.descriptors);


        // -------------------------
        // Test 2: Filter Trading Pairs
        // -------------------------
        console.log("Fetching trading pairs...");
        const usdc = Asset.fromUnknown("USDC");
        const usdt = Asset.fromUnknown("USDT");
        const tradingPairsRequest = new FilterTradingPairsRequest(
            exchangesResponse.descriptors,
            [usdc],
            [usdc, usdt],
            [Asset.fromUnknown('aedz'), Asset.fromUnknown('xaut'), Asset.fromUnknown('usd1'), Asset.fromUnknown('bfusd'), Asset.fromUnknown('usde'), Asset.fromUnknown('fdusd'), Asset.fromUnknown('euri'), Asset.fromUnknown('eur')],
            5000
        );
        const tradingPairsResponse = await container.filterTradingPairsUseCase.execute(tradingPairsRequest);
        const tradingPairs = tradingPairsResponse.getTradingPairs();
        return tradingPairs;
    }

    private async downloadAllCoinImages(container: UseCaseContainer, tradingPairs: TradingPair[], registry: CoinMarketCapRegistry): Promise<void> {
        let resolved = path.resolve(this.outputDir);
        console.log(`Checking dir ${resolved}`);
        //await fs.mkdir(OUTPUT_DIR, { recursive: true });
        const exists = fs.existsSync(resolved);
        if (!exists) {
            fs.mkdirSync(resolved, { recursive: true });
        }else{
            fs.rmSync(resolved, {recursive:true, force:true});
            fs.mkdirSync(resolved, { recursive: true });
        }
        const seen = new Set<string>();
        const missing: string[] = [];
        for (var tradingPair of tradingPairs) {
            let methods = container.exchangeMethodsRegistry.get(tradingPair.getExchangeDescriptor());
            const url = methods.getTradingPairUrl(tradingPair);
            if (seen.has(url)) {
                continue;
            }
            seen.add(url);
            const downloaded = await registry.downloadIcon(tradingPair, resolved);
            if (!downloaded) {
                missing.push(url);
            }
        }

        let fallbackDir = path.resolve(this.reportingDir);
        console.log(`Checking dir ${fallbackDir}`);
        //await fs.mkdir(OUTPUT_DIR, { recursive: true });
        const fallbackExists = fs.existsSync(fallbackDir);
        if (!fallbackExists) {
            fs.mkdirSync(fallbackDir, { recursive: true });
        }

        const missingPath = path.join(fallbackDir, "missing-icons.json");
        fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2), "utf8");

        console.log("================================");
        console.log(`Downloaded/checked ${seen.size} unique symbols`);
        console.log(`Missing icons: ${missing.length}`);
        console.log(`Missing report: ${missingPath}`);
        console.log("================================");
    }

    public async execute(registry: CoinMarketCapRegistry): Promise<void> {
        const container = await UseCaseContainer.Create();
        let coinNames = await this.fetchTradingPairs(container);
        await this.downloadAllCoinImages(container, coinNames, registry);
    }
}