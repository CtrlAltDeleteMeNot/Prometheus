import { TradingPair } from "../../entities/TradingPair";
import { TimeFrame } from "../../values/TimeFrame";
import { Period } from "../core/Period";
import { Source } from "../core/Source";
import { Indicator, IndicatorOutput, IndicatorParameters } from "../indicators/Indicator";
import { PctChangeIndicatorParameters } from "../indicators/PctChangeIndicator";
import { RsiIndicatorParameters } from "../indicators/RsiIndicator";
import { RvaIndicatorParameters } from "../indicators/RvaIndicator";
import { SmaIndicatorParameters } from "../indicators/SmaIndicator";

export type SupportedNumericalIndicatorParameters =
    | SmaIndicatorParameters
    | RsiIndicatorParameters
    | RvaIndicatorParameters
    | PctChangeIndicatorParameters;

export type SupportedNumericalIndicatorWithPendingParameters =
    | RvaIndicatorParameters;

export interface IPluginContext {
    getTradingPairs(): TradingPair[] | undefined;
    getOhlcvData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame, position: number): number | undefined;
    getOhlcvPendingData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame): number | undefined;
    findIndicator(tradingPair: TradingPair, indicatorParameters: IndicatorParameters<any>): Indicator<any>;
    getIndicatorValue(indicator: Indicator<any>, position: number): IndicatorOutput;
    getPendingIndicatorValue(indicator: Indicator<any>): IndicatorOutput;
    isIndicatorReady(indicator: Indicator<any>): boolean;
}

export abstract class BasePlugin implements IPluginContext {

    private ctx: IPluginContext | undefined;
    private readonly indicatorParameters: IndicatorParameters<any>[] = [];

    public abstract getId(): string;
    public abstract getFriendlyDescription(): string;
    public abstract next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>): void;
    public transferContext(ctx: IPluginContext): void {
        this.ctx = ctx;
    }

    public getIndicatorParameters(): readonly IndicatorParameters<any>[] {
        return this.indicatorParameters;
    }

    private addIndicatorParams(params: IndicatorParameters<any>) {
        let isRegistered = this.indicatorParameters.some(current => current.equals(params));
        if (!isRegistered) {
            this.indicatorParameters.push(params);
        }
    }

    public useSmaIndicator(timeFrame: TimeFrame, period: Period, source: Source): SmaIndicatorParameters {
        var params = new SmaIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    public useRsiIndicator(timeFrame: TimeFrame, period: Period, source: Source): RsiIndicatorParameters {
        var params = new RsiIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    public useRvaIndicator(timeFrame: TimeFrame, period: Period): RvaIndicatorParameters {
        var params = new RvaIndicatorParameters(timeFrame, period);
        this.addIndicatorParams(params);
        return params;
    }

    public usePercentChangeIndicator(timeFrame: TimeFrame, period: Period, source: Source): PctChangeIndicatorParameters {
        var params = new PctChangeIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    getOhlcvData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame, position: number): number | undefined {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getOhlcvData(tradingPair, source, timeframe, position);
    }

    getOhlcvPendingData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame): number | undefined {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getOhlcvPendingData(tradingPair, source, timeframe);
    }

    getIndicatorValue(indicator: Indicator<any>, position: number): IndicatorOutput {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getIndicatorValue(indicator, position);
    }

    getPendingIndicatorValue(indicator: Indicator<any>): IndicatorOutput {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getPendingIndicatorValue(indicator);
    }

    getTradingPairs(): TradingPair[] | undefined {
        throw new Error("Method not implemented.");
    }

    isIndicatorReady(indicator: Indicator<any>): boolean {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.isIndicatorReady(indicator);
    }

    findIndicator(tradingPair: TradingPair, indicatorParameters: IndicatorParameters<any>): Indicator<any> {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.findIndicator(tradingPair, indicatorParameters);
    }
}