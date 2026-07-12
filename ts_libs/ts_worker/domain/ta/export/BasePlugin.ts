import { TradingPair } from "../../entities/TradingPair";
import { TimeFrame } from "../../values/TimeFrame";
import { Period } from "../core/Period";
import { Source } from "../core/Source";
import { DonchianChannelsAccessor, DonchianChannelsIndicatorParameters } from "../indicators/DonchianChannels";
import { IndicatorOutput, IndicatorParameters, IndicatorRuntime } from "../indicators/Indicator";
import { PctChangeAccessor, PctChangeIndicatorParameters } from "../indicators/PctChangeIndicator";
import { RsiAccessor, RsiIndicatorParameters } from "../indicators/RsiIndicator";
import { RvaAccessor, RvaIndicatorParameters } from "../indicators/RvaIndicator";
import { SmaAccessor, SmaIndicatorParameters } from "../indicators/SmaIndicator";



export interface IPluginContext {
    getTradingPairs(): readonly TradingPair[];
    getOhlcvData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame, position: number): number | undefined;
    getOhlcvPendingData(tradingPair: TradingPair, source: Source, timeframe: TimeFrame): number | undefined;
    findIndicator(tradingPair: TradingPair, indicatorParameters: IndicatorParameters): IndicatorRuntime;
    getIndicatorValue(indicator: IndicatorRuntime, position: number): IndicatorOutput;
    getPendingIndicatorValue(indicator: IndicatorRuntime): IndicatorOutput;
    isIndicatorReady(indicator: IndicatorRuntime): boolean;
}



export abstract class BasePlugin implements IPluginContext {


    private ctx: IPluginContext | undefined;
    private readonly indicatorParameters: IndicatorParameters[] = [];

    public abstract getId(): string;
    public abstract getFriendlyDescription(): string;

    public abstract next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, nowTs: number): void;
    public transferContext(ctx: IPluginContext): void {
        this.ctx = ctx;
    }

    public getIndicatorParameters(): readonly IndicatorParameters[] {
        return this.indicatorParameters;
    }

    private addIndicatorParams(params: IndicatorParameters) {
        let isRegistered = this.indicatorParameters.some(current => current.equals(params));
        if (!isRegistered) {
            this.indicatorParameters.push(params);
        }
    }

    public useSmaIndicator(timeFrame: TimeFrame, period: Period, source: Source): SmaAccessor {
        var params = new SmaIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return new SmaAccessor(this, params);;
    }

    public useRsiIndicator(timeFrame: TimeFrame, period: Period, source: Source): RsiAccessor {
        var params = new RsiIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return new RsiAccessor(this, params);
    }

    public useRvaIndicator(timeFrame: TimeFrame, period: Period): RvaAccessor {
        var params = new RvaIndicatorParameters(timeFrame, period);
        this.addIndicatorParams(params);
        return new RvaAccessor(this, params);
    }

    public usePercentChangeIndicator(timeFrame: TimeFrame, period: Period, source: Source): PctChangeAccessor {
        var params = new PctChangeIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return new PctChangeAccessor(this, params);
    }

    useDonchianChannelsIndicator(timeFrame: TimeFrame, period: Period): DonchianChannelsAccessor {
        var params = new DonchianChannelsIndicatorParameters(timeFrame, period, Source.HIGH, Source.LOW);
        this.addIndicatorParams(params);
        return new DonchianChannelsAccessor(this, params);
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

    getIndicatorValue(indicator: IndicatorRuntime, position: number): IndicatorOutput {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.getIndicatorValue(indicator, position);
    }

    getPendingIndicatorValue(indicator: IndicatorRuntime): IndicatorOutput {
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

    isIndicatorReady(indicator: IndicatorRuntime): boolean {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.isIndicatorReady(indicator);
    }

    findIndicator(tradingPair: TradingPair, indicatorParameters: IndicatorParameters): IndicatorRuntime {
        if (this.ctx === undefined) {
            throw new Error("Context is not defined");
        }
        return this.ctx.findIndicator(tradingPair, indicatorParameters);
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

    protected open(
        tradingPair: TradingPair,
        timeFrame: TimeFrame,
        position: number = 0
    ): number | undefined {
        return this.getOhlcvData(
            tradingPair,
            Source.OPEN,
            timeFrame,
            position
        );
    }

}