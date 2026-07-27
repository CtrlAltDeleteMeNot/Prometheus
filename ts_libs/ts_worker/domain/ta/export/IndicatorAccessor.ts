import { TradingPair } from "../../entities/TradingPair";
import { IndicatorOutput, IndicatorParameters } from "../indicators/Indicator";
import { BasePlugin } from "./BasePlugin";

export class IndicatorAccessor<TParams extends IndicatorParameters, TOutput extends IndicatorOutput> {

    constructor(
        protected readonly plugin: BasePlugin,
        protected readonly params: TParams
    ) { }

    get(
        tradingPair: TradingPair,
        position = 0
    ): TOutput {
        const indicator =
            this.plugin.findIndicator(tradingPair, this.params);
        return indicator.getValue(position) as TOutput;
    }

    getParameters(): TParams {
        return this.params;
    }

    pending(
        tradingPair: TradingPair
    ): TOutput {

        return this.plugin
            .findIndicator(tradingPair, this.params)
            .getPendingValue() as TOutput;
    }

    isReady(
        tradingPair: TradingPair
    ): boolean {

        return this.plugin
            .findIndicator(tradingPair, this.params)
            .isReady();
    }

    getValuesCount(tradingPair: TradingPair): number {
        return this.plugin
            .findIndicator(tradingPair, this.params).getValuesCount();
    }
}