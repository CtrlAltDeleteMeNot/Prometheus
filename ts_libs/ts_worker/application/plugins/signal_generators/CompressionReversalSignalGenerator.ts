import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

type DonchianState = {
    don6High: number;
    don20High: number;
    don6Low: number;
    don20Low: number;
};

export class CompressionReversalSignalGenerator extends BaseSignalGenerator {
    private readonly signalTimeFrame = TimeFrame.ONE_MINUTE;
    private readonly armTimeFrame = TimeFrame.ONE_HOUR;

    private readonly rsi14: RsiAccessor;
    private readonly sma89: SmaAccessor;
    private readonly sma200: SmaAccessor;
    private readonly don6: DonchianChannelsAccessor;
    private readonly don20: DonchianChannelsAccessor;

    private readonly rsiArmThreshold = 30;

    private readonly armedPairs = new WeakSet<TradingPair>();
    private readonly previousDonchianState = new WeakMap<TradingPair, DonchianState>();
    private readonly stopLossByPair = new WeakMap<TradingPair, number>();
    private readonly friendlyDescription: string;
    private readonly id: string;

    public constructor() {
        super();

        this.rsi14 = this.useRsiIndicator(
            this.armTimeFrame,
            Period.fromUnknown(14),
            Source.CLOSE,
        );

        this.sma89 = this.useSmaIndicator(
            this.signalTimeFrame,
            Period.fromUnknown(89),
            Source.CLOSE,
        );

        this.sma200 = this.useSmaIndicator(
            this.signalTimeFrame,
            Period.fromUnknown(200),
            Source.CLOSE,
        );

        this.don6 = this.useDonchianChannelsIndicator(
            this.signalTimeFrame,
            Period.fromUnknown(6),
        );

        this.don20 = this.useDonchianChannelsIndicator(
            this.signalTimeFrame,
            Period.fromUnknown(20),
        );
        this.id = [
            "armed-compression-recovery",
            this.rsi14.getParameters().getId(),
            `rsi-arm-${this.rsiArmThreshold}`,
            this.sma89.getParameters().getId(),
            this.sma200.getParameters().getId(),
            this.don6.getParameters().getId(),
            this.don20.getParameters().getId(),
        ].join(".");
        this.friendlyDescription = "Catching the turn before the trend knows it."
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
        this.updateArmedState(
            tradingPair,
            updatedTimeFrames,
        );

        if (!this.wasUpdated(updatedTimeFrames, this.signalTimeFrame)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        const previous = this.previousDonchianState.get(tradingPair);
        const current = this.getCurrentDonchianState(tradingPair);

        this.captureStopLossOnLowSeparation(
            tradingPair,
            current,
            previous,
        );

        this.previousDonchianState.set(
            tradingPair,
            current,
        );

        if (!this.armedPairs.has(tradingPair)) {
            return;
        }

        if (!this.isSmaCompression(tradingPair)) {
            return;
        }

        if (!this.isDonchianHighSeparationDown(current, previous)) {
            return;
        }

        const orderDetails = this.makeOrderDetails(
            tradingPair,
            current,
        );

        if (orderDetails === undefined) {
            return;
        }

        this.armedPairs.delete(tradingPair);
        this.stopLossByPair.delete(tradingPair);

        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            ts,
            orderDetails,
        );
    }

    private updateArmedState(
        tradingPair: TradingPair,
        updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>,
    ): void {
        if (!this.wasUpdated(updatedTimeFrames, this.armTimeFrame)) {
            return;
        }

        if (this.rsi14.getValuesCount(tradingPair) < 2) {
            return;
        }

        const previousRsi = this.rsi14
            .get(tradingPair, 1)
            .getValue();

        const currentRsi = this.rsi14
            .get(tradingPair, 0)
            .getValue();

        const crossedUnder =
            previousRsi >= this.rsiArmThreshold &&
            currentRsi < this.rsiArmThreshold;

        if (crossedUnder) {
            this.armedPairs.add(tradingPair);
        }
    }

    private areIndicatorsReady(
        tradingPair: TradingPair,
    ): boolean {
        return (
            this.sma89.getValuesCount(tradingPair) >= 2 &&
            this.sma200.getValuesCount(tradingPair) >= 2 &&
            this.don6.isReady(tradingPair) &&
            this.don20.isReady(tradingPair)
        );
    }

    private isSmaCompression(
        tradingPair: TradingPair,
    ): boolean {
        const previousSma89 = this.sma89
            .get(tradingPair, 1)
            .getValue();

        const currentSma89 = this.sma89
            .get(tradingPair, 0)
            .getValue();

        const previousSma200 = this.sma200
            .get(tradingPair, 1)
            .getValue();

        const currentSma200 = this.sma200
            .get(tradingPair, 0)
            .getValue();

        return (
            currentSma89 < currentSma200 &&
            currentSma89 > previousSma89 &&
            currentSma200 < previousSma200
        );
    }

    private captureStopLossOnLowSeparation(
        tradingPair: TradingPair,
        current: DonchianState,
        previous?: DonchianState,
    ): void {
        if (previous === undefined) {
            return;
        }

        if (!this.rsi14.isReady(tradingPair)) {
            return;
        }

        const currentRsi = this.rsi14
            .get(tradingPair, 0)
            .getValue();

        if (currentRsi >= this.rsiArmThreshold) {
            return;
        }

        const wereCoincident =
            previous.don6Low === previous.don20Low;

        const separated =
            current.don20Low < current.don6Low;

        if (wereCoincident && separated) {
            this.stopLossByPair.set(
                tradingPair,
                current.don20Low,
            );
        }
    }

    private isDonchianHighSeparationDown(
        current: DonchianState,
        previous?: DonchianState,
    ): boolean {
        if (previous === undefined) {
            return false;
        }

        return (
            current.don20High > current.don6High &&
            previous.don6High === previous.don20High
        );
    }

    private getCurrentDonchianState(
        tradingPair: TradingPair,
    ): DonchianState {
        const don6 = this.don6.get(tradingPair);
        const don20 = this.don20.get(tradingPair);

        return {
            don6High: don6.getHigh(),
            don20High: don20.getHigh(),
            don6Low: don6.getLow(),
            don20Low: don20.getLow(),
        };
    }

    private makeOrderDetails(
        tradingPair: TradingPair,
        current: DonchianState,
    ): OrderDetails | undefined {
        const stopLoss = this.stopLossByPair.get(tradingPair);

        if (stopLoss === undefined) {
            return undefined;
        }

        const entryPrice = current.don20High;


        if (
            !Number.isFinite(entryPrice) ||
            !Number.isFinite(stopLoss) ||
            stopLoss >= entryPrice
        ) {
            return undefined;
        }

        const donchianWidth = entryPrice - stopLoss;
        const precision = this.inferPricePrecision(tradingPair);
        const tp1 = this.roundToPrecision(entryPrice + donchianWidth, precision);
        const tp2 = this.roundToPrecision(tp1 + donchianWidth, precision);
        const tp3 = this.roundToPrecision(tp2 + donchianWidth, precision);
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
}