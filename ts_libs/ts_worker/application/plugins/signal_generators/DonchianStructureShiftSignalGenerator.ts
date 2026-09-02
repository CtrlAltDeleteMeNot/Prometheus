import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

type SignalState = {
    sma2: number;
    don40Low: number;
    don18Low: number;
};

export class DonchianStructureShiftSignalGenerator extends BaseSignalGenerator {

    // =========================================================================
    // TIMEFRAMES
    // =========================================================================

    private readonly signalTimeFrame = TimeFrame.ONE_MINUTE;
    private readonly structureTimeFrame = TimeFrame.FIVE_MINUTES;
    private readonly masterTrendTimeFrame = TimeFrame.FOUR_HOURS;

    // =========================================================================
    // INDICATORS
    // =========================================================================

    private readonly sma2: SmaAccessor;

    private readonly structureSma200: SmaAccessor;
    private readonly don40: DonchianChannelsAccessor;
    private readonly don10: DonchianChannelsAccessor;

    private readonly masterTrendSma200: SmaAccessor;

    // =========================================================================
    // STATE
    // =========================================================================

    /**
     * Pair has completed the bearish activation:
     *
     * 1. Don40 High < structure SMA200
     * 2. 1m SMA2 crosses below Don40 Low
     * 3. 1m SMA2 < structure SMA200
     */
    private readonly armedPairs = new WeakSet<TradingPair>();

    /**
     * Previous 1-minute state used to detect exact crossunders.
     *
     * The Donchian values themselves are calculated on the 15m timeframe,
     * but they are sampled here on each 1m iteration.
     */
    private readonly previousStateByPair = new WeakMap<
        TradingPair,
        SignalState
    >();

    private readonly friendlyDescription: string;
    private readonly id: string;

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    public constructor() {
        super();

        this.sma2 = this.useSmaIndicator(
            this.signalTimeFrame,
            Period.fromUnknown(2),
            Source.CLOSE,
        );

        this.structureSma200 = this.useSmaIndicator(
            this.structureTimeFrame,
            Period.fromUnknown(200),
            Source.CLOSE,
        );

        this.don40 = this.useDonchianChannelsIndicator(
            this.structureTimeFrame,
            Period.fromUnknown(40),
        );

        this.don10 = this.useDonchianChannelsIndicator(
            this.structureTimeFrame,
            Period.fromUnknown(10),
        );

        this.masterTrendSma200 = this.useSmaIndicator(
            this.masterTrendTimeFrame,
            Period.fromUnknown(200),
            Source.CLOSE,
        );

        this.id = [
            "donchian-structure-shift",
            this.sma2.getParameters().getId(),
            this.structureSma200.getParameters().getId(),
            this.don40.getParameters().getId(),
            this.don10.getParameters().getId(),
            this.masterTrendSma200.getParameters().getId(),
        ].join(".");

        this.friendlyDescription =
            "Donchian 40 exhaustion below SMA200 followed by Donchian 18 structure shift above SMA200 with bullish 4H master trend.";
    }

    // =========================================================================
    // META
    // =========================================================================

    public getId(): string {
        return this.id;
    }

    public getFriendlyDescription(): string {
        return this.friendlyDescription;
    }

    // =========================================================================
    // NEXT
    // =========================================================================

    public next(
        tradingPair: TradingPair,
        updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>,
        ts: number,
    ): void {

        // Everything is evaluated from the 1-minute event stream.
        if (!this.wasUpdated(updatedTimeFrames, this.signalTimeFrame)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        // ---------------------------------------------------------------------
        // READ CURRENT VALUES
        // ---------------------------------------------------------------------

        const current = this.getCurrentState(tradingPair);

        const previous =
            this.previousStateByPair.get(tradingPair);

        // Always store current state for next 1m candle.
        this.previousStateByPair.set(
            tradingPair,
            current,
        );

        // We cannot detect a crossover without previous state.
        if (previous === undefined) {
            return;
        }

        // ---------------------------------------------------------------------
        // ACTIVATION
        // ---------------------------------------------------------------------

        if (!this.armedPairs.has(tradingPair)) {
            if (this.isActivation(tradingPair, current, previous)) {
                //console.log(`TradingPair ${tradingPair.symbol()} `);
                this.armedPairs.add(tradingPair);
            }

            return;
        }

        // ---------------------------------------------------------------------
        // CONFIRMATION
        // ---------------------------------------------------------------------

        if (!this.isConfirmation(tradingPair, current, previous)) {
            return;
        }

        // ---------------------------------------------------------------------
        // ORDER
        // ---------------------------------------------------------------------

        const orderDetails =
            this.makeOrderDetails(tradingPair);

        if (orderDetails === undefined) {
            return;
        }

        // ---------------------------------------------------------------------
        // SIGNAL CONSUMES SETUP
        // ---------------------------------------------------------------------

        this.resetState(tradingPair);

        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            ts,
            orderDetails,
        );
    }

    // =========================================================================
    // ACTIVATION
    // =========================================================================

    private isActivation(
        tradingPair: TradingPair,
        current: SignalState,
        previous: SignalState,
    ): boolean {

        const sma200 =
            this.structureSma200
                .get(tradingPair)
                .getValue();

        const don40High =
            this.don40
                .get(tradingPair)
                .getHigh();

        /**
         * Exact 1m SMA2 crossunder of the 15m Don40 Low:
         *
         * previous SMA2 >= previous Don40 Low
         * current SMA2 < current Don40 Low
         */
        const crossedUnderDon40Low =
            previous.sma2 >= previous.don40Low &&
            current.sma2 < current.don40Low;

        if (!crossedUnderDon40Low) {
            return false;
        }

        /**
         * Entire Don40 structure must be below SMA200.
         */
        if (don40High >= sma200) {
            return false;
        }

        /**
         * SMA2 itself must also be below SMA200.
         *
         * Technically implied by Don40 High < SMA200 plus the crossunder,
         * but kept explicit because it is part of the strategy definition.
         */
        if (current.sma2 >= sma200) {
            return false;
        }

        return true;
    }

    // =========================================================================
    // CONFIRMATION
    // =========================================================================

    private isConfirmation(
        tradingPair: TradingPair,
        current: SignalState,
        previous: SignalState,
    ): boolean {

        const structureSma200 =
            this.structureSma200
                .get(tradingPair)
                .getValue();

        /**
         * Exact 1m SMA2 crossunder of the 15m Don18 Low.
         */
        const crossedUnderDon18Low =
            previous.sma2 >= previous.don18Low &&
            current.sma2 < current.don18Low;

        if (!crossedUnderDon18Low) {
            return false;
        }

        /**
         * Confirmation must happen above the 15m SMA200.
         */
        if (current.sma2 <= structureSma200) {
            return false;
        }

        /**
         * Master trend:
         *
         * 4H Close > 4H SMA200.
         *
         * SmaAccessor.isBelowClose() means the SMA itself
         * is below price/close.
         */
        if (!this.masterTrendSma200.isUptrend(tradingPair)) {
            return false;
        }

        return true;
    }

    // =========================================================================
    // INDICATOR READINESS
    // =========================================================================

    private areIndicatorsReady(
        tradingPair: TradingPair,
    ): boolean {

        return (
            this.sma2.isReady(tradingPair) &&
            this.structureSma200.isReady(tradingPair) &&
            this.don40.isReady(tradingPair) &&
            this.don10.isReady(tradingPair) &&
            this.masterTrendSma200.isReady(tradingPair)
        );
    }

    // =========================================================================
    // CURRENT STATE
    // =========================================================================

    private getCurrentState(
        tradingPair: TradingPair,
    ): SignalState {

        const sma2 =
            this.sma2
                .get(tradingPair)
                .getValue();

        const don40 =
            this.don40
                .get(tradingPair);

        const don18 =
            this.don10
                .get(tradingPair);

        return {
            sma2,
            don40Low: don40.getLow(),
            don18Low: don18.getLow(),
        };
    }

    // =========================================================================
    // ORDER
    // =========================================================================

    private makeOrderDetails(
        tradingPair: TradingPair,
    ): OrderDetails | undefined {

        /**
         * ENTRY
         *
         * Donchian 40 High at the exact confirmation moment.
         */
        const entryPrice =
            this.don40
                .get(tradingPair)
                .getHigh();

        /**
         * STOP LOSS
         *
         * Donchian 18 Low at the exact confirmation moment.
         */
        const stopLoss =
            this.don10
                .get(tradingPair)
                .getLow();

        if (
            !Number.isFinite(entryPrice) ||
            !Number.isFinite(stopLoss) ||
            stopLoss >= entryPrice
        ) {
            return undefined;
        }

        const risk =
            entryPrice - stopLoss;

        if (risk <= 0) {
            return undefined;
        }

        const precision =
            this.inferPricePrecision(tradingPair);

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

    // =========================================================================
    // RESET
    // =========================================================================

    private resetState(
        tradingPair: TradingPair,
    ): void {

        this.armedPairs.delete(tradingPair);
    }
}