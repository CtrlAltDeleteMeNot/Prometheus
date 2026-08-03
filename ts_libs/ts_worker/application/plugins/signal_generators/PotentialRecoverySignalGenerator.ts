import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

export class PotentialRecoverySignalGenerator extends BaseSignalGenerator {
    rsi: RsiAccessor;
    rsiThreshold: number;
    don: DonchianChannelsAccessor;
    smaSlow: SmaAccessor;
    smaFast: SmaAccessor;
    id: string;
    friendlyDescription: string;
    public constructor() {
        super();
        this.rsiThreshold = 5;
        this.don = this.useDonchianChannelsIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(5));
        this.rsi = this.useRsiIndicator(TimeFrame.FOUR_HOURS, Period.fromUnknown(2), Source.CLOSE);
        this.smaFast = this.useSmaIndicator(TimeFrame.ONE_MINUTE, Period.fromUnknown(20), Source.CLOSE);
        this.smaSlow = this.useSmaIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(5), Source.CLOSE);
        this.id = [
            "potential-recovery",
            this.rsi.getParameters().getId(),
            `rsi-threshold-${this.rsiThreshold}`,
            this.smaFast.getParameters().getId(),
            this.smaSlow.getParameters().getId(),
            this.don.getParameters().getId(),
        ].join(".");

        this.friendlyDescription =
            "Bullish potential recovery when the 1-minute SMA20 crosses above the 1-hour SMA5 while the 4-hour RSI(2) is below 5.";
    }

    public getId(): string {
        return this.id;
    }

    public getFriendlyDescription(): string {
        return this.friendlyDescription;
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, ts: number): void {
        if (false === this.isDonchianReady(tradingPair)) {
            return;
        }
        if (false === this.isOversold(tradingPair)) {
            return;
        }
        if (false === this.isSmaRecoveryCrossover(tradingPair, updatedTimeFrames)) {
            return;
        }
        this.emit(tradingPair, SignalDirection.BULLISH, ts, this.makeOrderDetails(tradingPair));
    }

    private isSmaRecoveryCrossover(
        tradingPair: TradingPair,
        updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>,
    ): boolean {
        const fastTimeFrame = this.smaFast.getParameters().getTimeFrame();
        const slowTimeFrame = this.smaSlow.getParameters().getTimeFrame();

        if (!this.wasUpdated(updatedTimeFrames, fastTimeFrame)) {
            return false;
        }

        if (this.smaFast.getValuesCount(tradingPair) < 2) {
            return false;
        }

        if (this.smaSlow.getValuesCount(tradingPair) < 1) {
            return false;
        }

        const slowWasUpdated = this.wasUpdated(
            updatedTimeFrames,
            slowTimeFrame,
        );

        if (
            slowWasUpdated &&
            this.smaSlow.getValuesCount(tradingPair) < 2
        ) {
            return false;
        }

        const previousFast = this.smaFast
            .get(tradingPair, 1)
            .getValue();

        const currentFast = this.smaFast
            .get(tradingPair, 0)
            .getValue();

        const previousSlow = this.smaSlow
            .get(tradingPair, slowWasUpdated ? 1 : 0)
            .getValue();

        const currentSlow = this.smaSlow
            .get(tradingPair, 0)
            .getValue();

        return (
            previousFast <= previousSlow &&
            currentFast > currentSlow &&
            previousFast < currentFast
        );
    }

    private isDonchianReady(
        tradingPair: TradingPair,
    ): boolean {
        return this.don.isReady(tradingPair);
    }

    isOversold(tradingPair: TradingPair): boolean {
        if (!this.rsi.isReady(tradingPair)) {
            return false;
        }
        return this.rsi.get(tradingPair, 0).getValue() < this.rsiThreshold;
    }



    private makeOrderDetails(tradingPair: TradingPair): OrderDetails | undefined {
        const donchianHigh = this.don.getHigh(tradingPair);
        const stopLoss = this.don.getLow(tradingPair);
        const entryValue = this.getOhlcvData(tradingPair,Source.CLOSE,TimeFrame.ONE_MINUTE, 0);

        if (entryValue === undefined || !Number.isFinite(entryValue) || !Number.isFinite(stopLoss) || !Number.isFinite(donchianHigh)) {
            return undefined;
        }

        if (stopLoss >= entryValue) {
            return undefined;
        }
        
        const decimals = Math.max(this.countDecimals(entryValue), this.countDecimals(stopLoss), this.countDecimals(donchianHigh));
        const risk = entryValue - stopLoss;

        return {
            entryPrice: entryValue,
            stopLossPrice: this.tr(stopLoss, decimals),
            takeProfitLevels: [
                this.tr(entryValue + risk, decimals),
                this.tr(entryValue + risk * 2, decimals),
                this.tr(entryValue + risk * 3, decimals),
            ],
        };
    }

    private countDecimals(n?: number): number {
        if (n === undefined || !Number.isFinite(n)) {
            return 0;
        }

        return n.toString().split(".")[1]?.length ?? 0;
    }

    private tr(num: number, decimals: number): number {
        return parseFloat(num.toFixed(decimals));
    }
}