import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { AtrAccessor } from "../../../domain/ta/indicators/AtrIndicator";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

export class BullishRecoverySignalGenerator extends BaseSignalGenerator {
    private readonly signalTimeFrame = TimeFrame.ONE_MINUTE;

    private readonly rsi14: RsiAccessor;
    private readonly atr: AtrAccessor;

    private readonly sma5: SmaAccessor;
    private readonly sma8: SmaAccessor;
    private readonly sma13: SmaAccessor;

    private readonly dailySma5: SmaAccessor;
    private readonly dailySma8: SmaAccessor;
    private readonly dailySma13: SmaAccessor;

    private readonly fourHourSma5: SmaAccessor;
    private readonly fourHourSma8: SmaAccessor;
    private readonly fourHourSma13: SmaAccessor;

    private readonly armedPairs = new WeakSet<TradingPair>();

    private readonly id: string;
    private readonly friendlyDescription: string;

    public constructor() {
        super();
        this.atr = this.useAtrIndicator(
            TimeFrame.ONE_HOUR,
            Period.fromUnknown(14),
        );
        this.rsi14 = this.useRsiIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(14),
            Source.CLOSE,
        );

        this.sma5 = this.useSmaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(5),
            Source.CLOSE,
        );

        this.sma8 = this.useSmaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(8),
            Source.CLOSE,
        );

        this.sma13 = this.useSmaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(13),
            Source.CLOSE,
        );

        this.dailySma5 = this.useSmaIndicator(
            TimeFrame.ONE_DAY,
            Period.fromUnknown(5),
            Source.CLOSE,
        );

        this.dailySma8 = this.useSmaIndicator(
            TimeFrame.ONE_DAY,
            Period.fromUnknown(8),
            Source.CLOSE,
        );

        this.dailySma13 = this.useSmaIndicator(
            TimeFrame.ONE_DAY,
            Period.fromUnknown(13),
            Source.CLOSE,
        );

        this.fourHourSma5 = this.useSmaIndicator(
            TimeFrame.FOUR_HOURS,
            Period.fromUnknown(5),
            Source.CLOSE,
        );

        this.fourHourSma8 = this.useSmaIndicator(
            TimeFrame.FOUR_HOURS,
            Period.fromUnknown(8),
            Source.CLOSE,
        );

        this.fourHourSma13 = this.useSmaIndicator(
            TimeFrame.FOUR_HOURS,
            Period.fromUnknown(13),
            Source.CLOSE,
        );

        this.id = [
            "prometheus-bullish-recovery",
            this.atr.getParameters().getId(),
            this.rsi14.getParameters().getId(),
            this.sma5.getParameters().getId(),
            this.sma8.getParameters().getId(),
            this.sma13.getParameters().getId(),
            this.dailySma5.getParameters().getId(),
            this.dailySma8.getParameters().getId(),
            this.dailySma13.getParameters().getId(),
            this.fourHourSma5.getParameters().getId(),
            this.fourHourSma8.getParameters().getId(),
            this.fourHourSma13.getParameters().getId(),
        ].join(".");

        this.friendlyDescription =
            "Bullish recovery after 1m RSI(14) crosses below 30, followed by SMA8 crossing above SMA13 while SMA5 is above SMA8, during a daily bearish / 4H bullish regime confluence.";
    }

    public getId(): string {
        return this.id;
    }

    public getFriendlyDescription(): string {
        return this.friendlyDescription;
    }

    public next(
        tradingPair: TradingPair,
        updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>,
        ts: number,
    ): void {
        if (!this.wasUpdated(updatedTimeFrames, this.signalTimeFrame)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        const possiblyGoodDay = this.isPossiblyGoodDay(tradingPair);

        // Pine:
        // if not possiblyGoodDay
        //     armed := false
        if (!possiblyGoodDay) {
            this.armedPairs.delete(tradingPair);
            return;
        }

        // Pine:
        // if possiblyGoodDay and rsi14CrossUnder30
        //     armed := true
        if (this.didRsi14CrossUnder30(tradingPair)) {
            this.armedPairs.add(tradingPair);
        }

        if (!this.armedPairs.has(tradingPair)) {
            return;
        }

        // Pine:
        // longSignal = possiblyGoodDay and armed and sma8Cross13 and sma5 > sma8
        if (!this.isBullishSmaRecovery(tradingPair)) {
            return;
        }

        // Signal consumes the armed setup.
        this.armedPairs.delete(tradingPair);
        const orderDetails = this.makeOrderDetails(tradingPair);
        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            ts,
            orderDetails
        );
    }

    makeOrderDetails(tradingPair: TradingPair): OrderDetails | undefined {
        const entryPrice = this.close(tradingPair, TimeFrame.ONE_MINUTE);
        if (entryPrice === undefined) {
            return undefined;
        }
        const risk = this.atr.get(tradingPair).getValue();
        if (risk === undefined) {
            return undefined;
        }


        const precision = this.inferPricePrecision(tradingPair);

        const stopLoss = this.roundToPrecision(
            entryPrice - risk,
            precision
        );
        const tp1 =
            this.roundToPrecision(
                entryPrice + risk,
                precision,
            );

        const tp2 =
            this.roundToPrecision(
                entryPrice + risk * 2,
                precision,
            );

        const tp3 =
            this.roundToPrecision(
                entryPrice + risk * 3,
                precision,
            );

        return {
            entryPrice,
            stopLossPrice: stopLoss,
            takeProfitLevels: [
                tp1,
                tp2,
                tp3,
            ],
        };
    }

    private isPossiblyGoodDay(tradingPair: TradingPair): boolean {
        const dailySma5 = this.dailySma5.get(tradingPair).getValue();
        const dailySma8 = this.dailySma8.get(tradingPair).getValue();
        const dailySma13 = this.dailySma13.get(tradingPair).getValue();

        const fourHourSma5 = this.fourHourSma5.get(tradingPair).getValue();
        const fourHourSma8 = this.fourHourSma8.get(tradingPair).getValue();
        const fourHourSma13 = this.fourHourSma13.get(tradingPair).getValue();

        const dailySetup = dailySma13 > dailySma8 && dailySma8 > dailySma5;
        const fourHourSetup = fourHourSma5 > fourHourSma8 && fourHourSma8 > fourHourSma13;

        return dailySetup && fourHourSetup;
    }

    private didRsi14CrossUnder30(tradingPair: TradingPair): boolean {
        const previousRsi = this.rsi14.get(tradingPair, 1).getValue();
        const currentRsi = this.rsi14.get(tradingPair, 0).getValue();

        return previousRsi >= 30 && currentRsi < 30;
    }

    private isBullishSmaRecovery(tradingPair: TradingPair): boolean {
        const previousSma8 = this.sma8.get(tradingPair, 1).getValue();
        const currentSma8 = this.sma8.get(tradingPair, 0).getValue();

        const previousSma13 = this.sma13.get(tradingPair, 1).getValue();
        const currentSma13 = this.sma13.get(tradingPair, 0).getValue();

        const currentSma5 = this.sma5.get(tradingPair, 0).getValue();

        const sma8CrossedAboveSma13 = previousSma8 <= previousSma13 && currentSma8 > currentSma13;

        return sma8CrossedAboveSma13 && currentSma5 > currentSma8;
    }

    private areIndicatorsReady(tradingPair: TradingPair): boolean {
        return (
            this.rsi14.getValuesCount(tradingPair) >= 2 &&
            this.sma5.getValuesCount(tradingPair) >= 1 &&
            this.sma8.getValuesCount(tradingPair) >= 2 &&
            this.sma13.getValuesCount(tradingPair) >= 2 &&
            this.dailySma5.isReady(tradingPair) &&
            this.dailySma8.isReady(tradingPair) &&
            this.dailySma13.isReady(tradingPair) &&
            this.fourHourSma5.isReady(tradingPair) &&
            this.fourHourSma8.isReady(tradingPair) &&
            this.fourHourSma13.isReady(tradingPair)
        );
    }
}