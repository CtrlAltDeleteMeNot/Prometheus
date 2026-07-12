import { TradingPair } from "../entities/TradingPair";
import { ExchangeMethodsRegistry } from "../exchange/ExchangeMethodsRegistry";
import { MultiTimeframeOhlcv } from "../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../values/TimeFrame";
import { Source } from "./core/Source";
import { IPluginContext } from "./export/BasePlugin";
import { IndicatorOutput, IndicatorParameters, IndicatorRuntime } from "./indicators/Indicator";

export class TechnicalAnalisysRepository implements IPluginContext {
    private indicators: Map<TradingPair, IndicatorRuntime[]>;
    private indicatorParameters: IndicatorParameters[];
    private datasets: Map<TradingPair, MultiTimeframeOhlcv>;

    public constructor() {
        this.indicators = new Map();
        this.datasets = new Map();
        this.indicatorParameters = [];
    }

    public pushUpdate(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        open: number,
        high: number,
        low: number,
        close: number,
        volume: number,
        startTime: number,
        endTime: number,
        isClosed: boolean
    ): ReadonlyMap<TimeFrame, boolean> {
        const dataset = this.getDataset(tradingPair);
        return dataset.pushUpdate(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
        );
    }

    public addDataset(dataset: MultiTimeframeOhlcv): void {
        const tradingPair = dataset.getTradingPair();
        if (this.datasets.has(tradingPair)) {
            throw new Error(`TradingPair ${tradingPair} already added to repo.`);
        }
        this.datasets.set(tradingPair, dataset);
    }

    public getDataset(tradingPair: TradingPair): MultiTimeframeOhlcv {
        const dataset = this.datasets.get(tradingPair);

        if (!dataset) {
            throw new Error(`No MTF dataset registered for ${tradingPair.symbol()}`);
        }

        return dataset;
    }

    public getDatasets(): ReadonlyMap<TradingPair, MultiTimeframeOhlcv> {
        return this.datasets;
    }

    public getIndicators(
        tradingPair: TradingPair
    ): IndicatorRuntime[] {
        const list = this.indicators.get(tradingPair);
        if (!list) {
            throw new Error(`No indicator found for: ${tradingPair.getId()}`);
        }
        return list;
    }

    public initializeIndicatorsWithDatasets(
        tradingPair: TradingPair
    ): void {
        const dataset = this.getDataset(tradingPair);
        const created = this.indicatorParameters.map(indParam => {
            return indParam.createUsing(dataset);
        });
        this.indicators.set(tradingPair, created);
    }

    public addIndicatorParameters(
        indicatorParams: IndicatorParameters
    ): boolean {
        const exists = this.indicatorParameters.some(ind =>
            ind.equals(indicatorParams)
        );

        if (exists) {
            return false;
        }
        this.indicatorParameters.push(indicatorParams);
        return true;
    }

    public findIndicator(
        tradingPair: TradingPair,
        indicatorParams: IndicatorParameters
    ): IndicatorRuntime {

        const list = this.getIndicators(tradingPair);
        const found = list.find(ind =>
            ind.getParameters().equals(indicatorParams)
        );

        if (!found) {
            throw new Error(`Indicator ${indicatorParams.getId()} was not found for tp ${tradingPair.getId()}.`);
        }
        return found;
    }


    public updateIndicators(
        tradingPair: TradingPair,
        timeFrame: TimeFrame
    ): void {
        const list = this.getIndicators(tradingPair);
        list.forEach(ind => ind.update(timeFrame));
    }


    getTradingPairs(): readonly TradingPair[] {
        if (this.getDatasets() === undefined) {
            throw new Error("Cannot get trading pairs");
        }
        return [...this.getDatasets().keys()]
    }

    getOhlcvData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame, position: number): number | undefined {
        let dataset = this.getDataset(tradingPair);
        let tfBuffer = dataset.getBuffer(timeframe);
        return source.extract(tfBuffer.getCandle(position));
    }
    getOhlcvPendingData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame): number | undefined {
        let dataset = this.getDataset(tradingPair);
        let tfBuffer = dataset.getBuffer(timeframe);
        return source.extract(tfBuffer.getPendingCandle());
    }

    getIndicatorValue(indicator: IndicatorRuntime, position: number): IndicatorOutput {
        return indicator.getValue(position);
    }

    getPendingIndicatorValue(indicator: IndicatorRuntime): IndicatorOutput {
        return indicator.getPendingValue();
    }

    isIndicatorReady(indicator: IndicatorRuntime): boolean {
        return indicator.isReady();
    }
}