import { TradingPair } from "../../entities/TradingPair";
import { TimeFrame } from "../../values/TimeFrame";
import { Period } from "../core/Period";
import { Source } from "../core/Source";
import { Indicator, IndicatorOutput, IndicatorParameters } from "../indicators/Indicator";
import { PctChangeIndicatorOutput, PctChangeIndicatorParameters } from "../indicators/PctChangeIndicator";
import { RsiIndicatorOutput, RsiIndicatorParameters } from "../indicators/RsiIndicator";
import { RvaIndicatorOutput, RvaIndicatorParameters } from "../indicators/RvaIndicator";
import { SmaIndicatorOutput, SmaIndicatorParameters } from "../indicators/SmaIndicator";

export type SupportedNumericalIndicatorParameters =
    | SmaIndicatorParameters
    | RsiIndicatorParameters
    | RvaIndicatorParameters
    | PctChangeIndicatorParameters;

export type SupportedNumericalIndicatorWithPendingParameters =
    | RvaIndicatorParameters;

export interface IPluginContext {
    getTradingPairs(): readonly TradingPair[];
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
    
    public abstract next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, nowTs: number): void;
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

    getTradingPairs(): readonly TradingPair[] {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getTradingPairs();
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

    protected getIndicatorNumericValue(
        tradingPair: TradingPair,
        params: SupportedNumericalIndicatorParameters,
        position: number = 0
    ): number | undefined {

        const indicator = this.findIndicator(tradingPair, params);

        if (!this.isIndicatorReady(indicator)) {
            return undefined;
        }

        const output = this.getIndicatorValue(indicator, position);

        switch (true) {
            case output instanceof RsiIndicatorOutput:
                return output.getValue();

            case output instanceof SmaIndicatorOutput:
                return output.getValue();

            case output instanceof PctChangeIndicatorOutput:
                return output.getValue();

            case output instanceof RvaIndicatorOutput:
                return output.getRelativeValue();

            default:
                throw new Error(
                    `Unsupported output type: ${output.constructor.name}`
                );
        }
    }

    protected wasUpdated(
        updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>,
        timeFrame: TimeFrame
    ): boolean {
        return updatedTimeFrames.get(timeFrame) === true;
    }

    protected close(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        position: number = 0
    ): number | undefined {
        return this.getOhlcvData(tradingPair, Source.CLOSE, timeFrame, position);
    }


}