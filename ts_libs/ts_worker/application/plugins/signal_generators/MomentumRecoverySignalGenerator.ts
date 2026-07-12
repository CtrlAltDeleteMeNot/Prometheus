import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { PctChangeAccessor } from "../../../domain/ta/indicators/PctChangeIndicator";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator } from "../BaseSignalGenerator";

export class MomentumRecoverySignalGenerator extends BaseSignalGenerator {
    rsiFast: RsiAccessor;
    rsiSlopeFilter: RsiAccessor;
    fastCrossoverThreshold: number;
    rsiSlopeMax: number;
    smaTrendFilter: SmaAccessor;
    smaFast: SmaAccessor;
    gainersFilter: PctChangeAccessor;
    topGainers: Set<TradingPair> | undefined;
    topGainersUpdatedAt: number | undefined;
    topGainersCount: number;
    public constructor() {
        super();
        this.topGainersCount = 10;
        this.fastCrossoverThreshold = 5;
        this.rsiSlopeMax = 95;
        this.rsiFast = this.useRsiIndicator(TimeFrame.FIVE_MINUTES, Period.fromUnknown(2), Source.CLOSE);
        this.smaFast = this.useSmaIndicator(TimeFrame.FIVE_MINUTES, Period.fromUnknown(200), Source.CLOSE);
        this.rsiSlopeFilter = this.useRsiIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(2), Source.CLOSE);
        this.smaTrendFilter = this.useSmaIndicator(TimeFrame.FOUR_HOURS, Period.fromUnknown(200), Source.CLOSE);
        this.gainersFilter = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, Period.fromUnknown(30), Source.CLOSE);
    }

    public getId(): string {
        return `rsi.crossover.signal.${this.rsiFast.getParameters().getId()}.${this.fastCrossoverThreshold}`;
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
        if (false === this.isUptrend(tradingPair, this.smaFast)) {
            return;
        }

        if (false === this.isUptrend(tradingPair, this.smaTrendFilter)) {
            return;
        }

        this.emit(tradingPair, SignalDirection.BULLISH, ts);
    }

    isHigherTimeFrameRsiSlopingUp(tradingPair: TradingPair) {
        if (this.rsiSlopeFilter.getValuesCount(tradingPair) < 2) {
            return false;
        }
        const previous = this.rsiSlopeFilter.get(tradingPair, 1);
        const current = this.rsiSlopeFilter.get(tradingPair, 0);
        const acceptable =
            previous.getValue() <= current.getValue() &&
            current.getValue() < this.rsiSlopeMax;
        return acceptable;
    }

    isUptrend(tradingPair: TradingPair, smaAccessor: SmaAccessor): boolean {
        if (!smaAccessor.isReady(tradingPair)) {
            return false;
        }
        const sma = smaAccessor.get(tradingPair).getValue();
        const close = this.close(tradingPair, smaAccessor.getParameters().getTimeFrame());
        if (sma === undefined || close === undefined) {
            return false;
        }
        return sma < close;
    }

    isFastRsiCrossover(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>): boolean {
        if (false === this.wasUpdated(updatedTimeFrames, this.rsiFast.getParameters().getTimeFrame())) {
            return false;
        }
        if (this.rsiFast.getValuesCount(tradingPair) < 2) {
            return false;
        }
        
        const previousFast = this.rsiFast.get(tradingPair, 1).getValue();
        const currentFast = this.rsiFast.get(tradingPair, 0).getValue();

        const crossedUp =
            previousFast <= this.fastCrossoverThreshold &&
            currentFast > this.fastCrossoverThreshold;
        return crossedUp;
    }



    private updateTopPairs(updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number) {
        if (this.topGainersUpdatedAt === ts) {
            return;
        }
        if (false === this.wasUpdated(updatedTimeFrames, this.gainersFilter.getParameters().getTimeFrame())) {
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
                    percentChange: this.gainersFilter.isReady(pair) ? this.gainersFilter.get(pair).getValue() : Number.NEGATIVE_INFINITY
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