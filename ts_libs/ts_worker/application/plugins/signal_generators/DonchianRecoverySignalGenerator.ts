import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { RsiAccessor } from "../../../domain/ta/indicators/RsiIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

type DonchianState = {
    don6Low: number;
    don20Low: number;
    don20High: number;
};

export class DonchianRecoverySignalGenerator extends BaseSignalGenerator {

    private readonly signalTimeFrame = TimeFrame.ONE_MINUTE;
    private readonly armTimeFrame = TimeFrame.ONE_HOUR;

    private readonly rsi14: RsiAccessor;
    private readonly don6: DonchianChannelsAccessor;
    private readonly don20: DonchianChannelsAccessor;

    private readonly rsiArmThreshold = 30;

    /**
     * Pairs for which hourly RSI has crossed below the arm threshold.
     */
    private readonly armedPairs = new WeakSet<TradingPair>();

    /**
     * Previous Donchian state, needed to detect the exact moment
     * when Don6 Low separates upward from Don20 Low.
     */
    private readonly previousDonchianState = new WeakMap<
        TradingPair,
        DonchianState
    >();

    /**
     * Don20 Low levels captured on each valid post-arm separation.
     *
     * Example:
     *
     * [10.00, 10.40]
     *
     * means the second structural separation happened at a higher
     * Don20 Low than the first.
     */
    private readonly separationLevelsByPair = new WeakMap<
        TradingPair,
        number[]
    >();

    private readonly friendlyDescription: string;
    private readonly id: string;

    public constructor() {
        super();

        this.rsi14 = this.useRsiIndicator(
            this.armTimeFrame,
            Period.fromUnknown(14),
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
            "donchian-recovery",
            this.rsi14.getParameters().getId(),
            `rsi-arm-${this.rsiArmThreshold}`,
            this.don6.getParameters().getId(),
            this.don20.getParameters().getId(),
        ].join(".");

        this.friendlyDescription =
            "RSI exhaustion followed by rising Donchian structural lows.";
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

        // ------------------------------------------------------------
        // 1. ARM ON HOURLY RSI CROSSUNDER
        // ------------------------------------------------------------

        this.updateArmedState(
            tradingPair,
            updatedTimeFrames,
        );

        // Everything below runs only on a fresh signal-timeframe candle.
        if (!this.wasUpdated(updatedTimeFrames, this.signalTimeFrame)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        // ------------------------------------------------------------
        // 2. READ CURRENT / PREVIOUS DONCHIAN STATE
        // ------------------------------------------------------------

        const previous =
            this.previousDonchianState.get(tradingPair);

        const current =
            this.getCurrentDonchianState(tradingPair);

        // Always update state for the next candle.
        this.previousDonchianState.set(
            tradingPair,
            current,
        );

        // We deliberately ignore all separation events until
        // hourly RSI has armed this pair.
        if (!this.armedPairs.has(tradingPair)) {
            return;
        }

        if (previous === undefined) {
            return;
        }

        // ------------------------------------------------------------
        // 3. DETECT A NEW DONCHIAN LOW SEPARATION
        // ------------------------------------------------------------

        if (!this.isDonchianLowSeparation(current, previous)) {
            return;
        }

        // ------------------------------------------------------------
        // 4. STORE DON20 LOW FOR THIS SEPARATION
        // ------------------------------------------------------------

        const separationLevels =
            this.getSeparationLevels(tradingPair);

        separationLevels.push(current.don20Low);

        // First separation only establishes the first structural level.
        if (separationLevels.length < 2) {
            return;
        }

        // ------------------------------------------------------------
        // 5. COMPARE LATEST TWO SEPARATION LEVELS
        // ------------------------------------------------------------

        const previousSeparation =
            separationLevels[separationLevels.length - 2];

        const currentSeparation =
            separationLevels[separationLevels.length - 1];

        // We want the newer Don20 structural low to be higher.
        if (currentSeparation <= previousSeparation) {
            return;
        }

        // ------------------------------------------------------------
        // 6. BUILD SIGNAL
        // ------------------------------------------------------------

        const orderDetails =
            this.makeOrderDetails(
                tradingPair,
                current,
                previousSeparation,
                currentSeparation,
            );

        if (orderDetails === undefined) {
            return;
        }

        // ------------------------------------------------------------
        // 7. SIGNAL CONSUMES THE COMPLETE SETUP
        // ------------------------------------------------------------

        this.resetState(tradingPair);

        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            ts,
            orderDetails,
        );
    }

    // ========================================================================
    // RSI ARM
    // ========================================================================

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

        if (!crossedUnder) {
            return;
        }

        // Fresh RSI crossunder = completely fresh setup.
        this.armedPairs.add(tradingPair);
        this.separationLevelsByPair.set(tradingPair, []);
    }

    // ========================================================================
    // INDICATOR READINESS
    // ========================================================================

    private areIndicatorsReady(
        tradingPair: TradingPair,
    ): boolean {
        return (
            this.don6.isReady(tradingPair) &&
            this.don20.isReady(tradingPair)
        );
    }

    // ========================================================================
    // DONCHIAN SEPARATION
    // ========================================================================

    private isDonchianLowSeparation(
        current: DonchianState,
        previous: DonchianState,
    ): boolean {

        const wereCoincident =
            previous.don6Low === previous.don20Low;

        const areSeparated =
            current.don6Low > current.don20Low;

        return wereCoincident && areSeparated;
    }

    // ========================================================================
    // SEPARATION LEVELS
    // ========================================================================

    private getSeparationLevels(
        tradingPair: TradingPair,
    ): number[] {

        let levels =
            this.separationLevelsByPair.get(tradingPair);

        if (levels === undefined) {
            levels = [];
            this.separationLevelsByPair.set(
                tradingPair,
                levels,
            );
        }

        return levels;
    }

    // ========================================================================
    // CURRENT DONCHIAN STATE
    // ========================================================================

    private getCurrentDonchianState(
        tradingPair: TradingPair,
    ): DonchianState {

        const don6 =
            this.don6.get(tradingPair);

        const don20 =
            this.don20.get(tradingPair);

        return {
            don6Low: don6.getLow(),
            don20Low: don20.getLow(),
            don20High: don20.getHigh(),
        };
    }

    // ========================================================================
    // ORDER
    // ========================================================================

    private makeOrderDetails(
        tradingPair: TradingPair,
        current: DonchianState,
        previousSeparation: number,
        currentSeparation: number,
    ): OrderDetails | undefined {

        /**
         * The first structural Don20 Low is the deeper low
         * and therefore the natural invalidation level.
         *
         * Example:
         *
         * separation #1 = 10.00
         * separation #2 = 10.40
         *
         * stop = 10.00
         */
        const stopLoss = previousSeparation;

        /**
         * Keeping your previous entry concept here:
         * entry at current Don20 High.
         *
         * This can easily be changed later if the actual trigger
         * becomes close/SMA/etc.
         */
        const entryPrice = current.don20High;

        if (
            !Number.isFinite(entryPrice) ||
            !Number.isFinite(stopLoss) ||
            !Number.isFinite(currentSeparation) ||
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

    // ========================================================================
    // RESET
    // ========================================================================

    private resetState(
        tradingPair: TradingPair,
    ): void {

        this.armedPairs.delete(tradingPair);
        this.separationLevelsByPair.delete(tradingPair);
    }
}