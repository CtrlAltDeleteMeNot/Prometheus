import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator } from "../BaseSignalGenerator";

export class MomentumRecoverySignalGenerator extends BaseSignalGenerator {
    rsi: RsiAccessor;
    rsiSmaLen: number;
    fastCrossoverThreshold: number;
    smaSlow: SmaAccessor;
    smaFast: SmaAccessor;
    id:string;
    friendlyDescription: string;
    public constructor() {
        super();
        this.rsiSmaLen = 3;
        this.fastCrossoverThreshold = 5;
        this.rsi = this.useRsiIndicator(TimeFrame.FIVE_MINUTES, Period.fromUnknown(2), Source.CLOSE);
        this.smaFast = this.useSmaIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(200), Source.CLOSE);
        this.smaSlow = this.useSmaIndicator(TimeFrame.FOUR_HOURS, Period.fromUnknown(200), Source.CLOSE);
        this.id = [
            "momentum-recovery",
            this.rsi.getParameters().getId(),
            `rsi-sma-${this.rsiSmaLen}`,
            `threshold-${this.fastCrossoverThreshold}`,
        ].join(".");
        this.friendlyDescription = `Bullish ${this.rsi.getParameters().getDescription()} recovery during a strong uptrend.`;
    }

    public getId(): string {
        return this.id;
    }

    public getFriendlyDescription(): string {
        return this.friendlyDescription;
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {

        if (false === this.isFastRsiCrossover(tradingPair, updatedTimeFrames)) {
            return;
        }
        if (false === this.isUptrend(tradingPair, this.smaFast)) {
            return;
        }
        if (false === this.isUptrend(tradingPair, this.smaSlow)) {
            return;
        }

        this.emit(tradingPair, SignalDirection.BULLISH, ts);
    }

    isUptrend(tradingPair: TradingPair, smaAccessor: SmaAccessor): boolean {
        const isReady = smaAccessor.getValuesCount(tradingPair) > 2;
        if (!isReady) {
            return false;
        }
        return smaAccessor.isUptrend(tradingPair);
    }

    isFastRsiCrossover(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>): boolean {
        if (false === this.wasUpdated(updatedTimeFrames, this.rsi.getParameters().getTimeFrame())) {
            return false;
        }
        if (this.rsi.getValuesCount(tradingPair) < this.rsiSmaLen + 1) {
            return false;
        }

        const previousFast = this.rsi.get(tradingPair, 1).getValue();
        const currentFast = this.rsi.get(tradingPair, 0).getValue();

        const rsiCrossedAboveTreshold =
            previousFast <= this.fastCrossoverThreshold &&
            currentFast > this.fastCrossoverThreshold;
        if (!rsiCrossedAboveTreshold) {
            return false;
        }
        const previousRsiSma = this.getRsiSma(tradingPair, 1, this.rsiSmaLen);
        const rsiSmaWasBelowTreshold =
            previousRsiSma < this.fastCrossoverThreshold;

        return rsiSmaWasBelowTreshold && rsiCrossedAboveTreshold;
    }

    private getRsiSma(
        tradingPair: TradingPair,
        startIndex: number,
        period: number,
    ): number {
        let sum = 0;

        for (let index = startIndex; index < startIndex + period; index++) {
            sum += this.rsi.get(tradingPair, index).getValue();
        }

        return sum / period;
    }
}