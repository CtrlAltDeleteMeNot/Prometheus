import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { PctChangeIndicatorParameters } from "../../../domain/ta/indicators/PctChangeIndicator";
import { RsiIndicator, RsiIndicatorOutput, RsiIndicatorParameters } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaIndicatorParameters } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator } from "../BaseSignalGenerator";

export class MomentumRecoverySignalGenerator extends BaseSignalGenerator {

    rsiParamsFast: RsiIndicatorParameters;
    rsiParamsSlopeFilter: RsiIndicatorParameters;
    fastCrossoverThreshold: number;
    rsiSlopeMax: number;
    smaParamsTrendFilter: SmaIndicatorParameters;
    smaParamsFast: SmaIndicatorParameters;
    gainersFilter: PctChangeIndicatorParameters;
    topGainers: Set<TradingPair> | undefined;
    topGainersUpdatedAt: number | undefined;
    topGainersCount: number;
    public constructor() {
        super();
        this.topGainersCount = 10;
        this.fastCrossoverThreshold = 5;
        this.rsiSlopeMax = 95;
        this.rsiParamsFast = this.useRsiIndicator(TimeFrame.FIVE_MINUTES, Period.fromUnknown(2), Source.CLOSE);
        this.smaParamsFast = this.useSmaIndicator(TimeFrame.FIVE_MINUTES, Period.fromUnknown(200), Source.CLOSE);
        this.rsiParamsSlopeFilter = this.useRsiIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(2), Source.CLOSE);
        this.smaParamsTrendFilter = this.useSmaIndicator(TimeFrame.FOUR_HOURS, Period.fromUnknown(200), Source.CLOSE);
        this.gainersFilter = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, Period.fromUnknown(30), Source.CLOSE);
    }

    public getId(): string {
        return `rsi.crossover.treshold.signal.${this.rsiParamsFast.getId()} X ${this.fastCrossoverThreshold}`;
    }

    public getFriendlyDescription(): string {
        return "Bullish pullback recovery on a top 30-day momentum performer.";
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        this.updateTopPairs(updatedTimeFrames, ts);
        if (false === this.isTopGainer(tradingPair)) {
            return;
        }
        if (false === this.isFastRsiCrossover(tradingPair, updatedTimeFrames)) {
            return;
        }
        if (false === this.isHigherTimeFrameRsiSlopingUp(tradingPair)) {
            return;
        }
        if (false === this.isUptrend(tradingPair, this.smaParamsFast)) {
            return;
        }

        if (false === this.isUptrend(tradingPair, this.smaParamsTrendFilter)) {
            return;
        }

        this.emit(tradingPair, SignalDirection.BULLISH, ts);
    }

    isHigherTimeFrameRsiSlopingUp(tradingPair: TradingPair) {
        const indicator = this.findIndicator(tradingPair, this.rsiParamsSlopeFilter) as RsiIndicator;
        if (indicator.getValuesCount() < 2) {
            return false;
        }
        const previous = this.getIndicatorValue(indicator, 1) as RsiIndicatorOutput;
        const current = this.getIndicatorValue(indicator, 0) as RsiIndicatorOutput;

        const acceptable =
            previous.getValue() <= current.getValue() &&
            current.getValue() < this.rsiSlopeMax;
        return acceptable;
    }

    isUptrend(tradingPair: TradingPair, smaParameters: SmaIndicatorParameters): boolean {
        const sma = this.getIndicatorNumericValue(tradingPair, smaParameters);
        const close = this.close(tradingPair, smaParameters.getTimeFrame());
        if (sma === undefined || close === undefined) {
            return false;
        }
        return sma < close;
    }

    isFastRsiCrossover(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>): boolean {
        if (false === this.wasUpdated(updatedTimeFrames, this.rsiParamsFast.getTimeFrame())) {
            return false;
        }
        const indicatorFast = this.findIndicator(tradingPair, this.rsiParamsFast) as RsiIndicator;
        if (indicatorFast.getValuesCount() < 2) {
            return false;
        }

        const previousFast = this.getIndicatorValue(indicatorFast, 1) as RsiIndicatorOutput;
        const currentFast = this.getIndicatorValue(indicatorFast, 0) as RsiIndicatorOutput;


        const crossedUp =
            previousFast.getValue() <= this.fastCrossoverThreshold &&
            currentFast.getValue() > this.fastCrossoverThreshold;
        return crossedUp;
    }



    private updateTopPairs(updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number) {
        if (this.topGainersUpdatedAt === ts) {
            return;
        }
        if (false === this.wasUpdated(updatedTimeFrames, this.gainersFilter.getTimeFrame())) {
            return;
        }
        const grouped = new Map<number, TradingPair[]>();

        this.getTradingPairs().forEach(pair => {
            const exchangeId = pair.getExchangeDescriptor().getId();

            let list = grouped.get(exchangeId);
            if (!list) {
                list = [];
                grouped.set(exchangeId, list);
            }

            list.push(pair);
        });

        const top = new Set<TradingPair>();

        grouped.forEach(pairs => {
            const ranked = pairs
                .map(pair => ({
                    pair,
                    percentChange:
                        this.getIndicatorNumericValue(pair, this.gainersFilter)
                        ?? Number.NEGATIVE_INFINITY
                }))
                .sort((a, b) => b.percentChange - a.percentChange);

            ranked.slice(0, this.topGainersCount).forEach(x => top.add(x.pair));
        });

        this.topGainers = top;
        this.topGainersUpdatedAt = ts;
    }

    private isTopGainer(tradingPair: TradingPair) {
        if (this.topGainers === undefined) {
            return false;
        }
        return this.topGainers.has(tradingPair);
    }
}