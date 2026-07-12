import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { RvaAccessor } from "../../../domain/ta/indicators/RvaIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator } from "../BaseSignalGenerator";

export class HighVolumeInsideCompressedDonchian extends BaseSignalGenerator {
    private readonly sma50: SmaAccessor;
    private readonly sma200Trend: SmaAccessor;
    private readonly donchian20: DonchianChannelsAccessor;

    private readonly rva21: RvaAccessor;
    private readonly rva89: RvaAccessor;
    private readonly rva200: RvaAccessor;

    private readonly rvaThreshold: number;

    public constructor() {
        super();

        this.rvaThreshold = 4;

        this.sma50 = this.useSmaIndicator(
            TimeFrame.ONE_HOUR,
            Period.fromUnknown(50),
            Source.CLOSE
        );

        this.sma200Trend = this.useSmaIndicator(
            TimeFrame.FOUR_HOURS,
            Period.fromUnknown(200),
            Source.CLOSE
        );

        this.donchian20 = this.useDonchianChannelsIndicator(
            TimeFrame.ONE_HOUR,
            Period.fromUnknown(20)
        );

        this.rva21 = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(21)
        );

        this.rva89 = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(89)
        );

        this.rva200 = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(200)
        );
    }


    public getId(): string {
        return [
            "donchian.high-volume-up",
            this.sma50.getParameters().getId(),
            this.donchian20.getParameters().getId(),
            this.rva21.getParameters().getId(),
            this.rva89.getParameters().getId(),
            this.rva200.getParameters().getId(),
            this.rvaThreshold
        ].join(".");
    }
    public getFriendlyDescription(): string {
        return (
            "Bullish one-minute volume expansion inside the upper half " +
            "of an hourly Donchian channel whose upper band remains below " +
            "the hourly SMA 50."
        );
    }
    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, nowTs: number): void {
        if (!this.wasUpdated(updatedTimeFrames, TimeFrame.ONE_MINUTE)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        if (!this.isLongTermBullTrend(tradingPair)) {
            return;
        }

        if (!this.isDonchianBelowSma50(tradingPair)) {
            return;
        }

        if (!this.isHighVolumeUp(tradingPair)) {
            return;
        }

        if (!this.isInsideUpperDonchianHalf(tradingPair)) {
            return;
        }

        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            nowTs
        );
    }

    private areIndicatorsReady(
        tradingPair: TradingPair
    ): boolean {
        return (
            this.sma50.isReady(tradingPair) &&
            this.sma200Trend.isReady(tradingPair) &&
            this.donchian20.isReady(tradingPair) &&
            this.rva21.isReady(tradingPair) &&
            this.rva89.isReady(tradingPair) &&
            this.rva200.isReady(tradingPair)
        );
    }

    private isLongTermBullTrend(
        tradingPair: TradingPair
    ): boolean {

        if (!this.sma200Trend.isReady(tradingPair)) {
            return false;
        }

        const sma200 =
            this.sma200Trend.get(tradingPair).getValue();

        const close =
            this.close(
                tradingPair,
                TimeFrame.ONE_MINUTE
            );

        if (
            sma200 === undefined ||
            close === undefined
        ) {
            return false;
        }

        return close > sma200;
    }

    /**
     * The complete hourly Donchian range must remain below SMA 50.
     */
    private isDonchianBelowSma50(
        tradingPair: TradingPair
    ): boolean {
        const sma50 = this.sma50
            .get(tradingPair)
            .getValue();

        const donchianUpper = this.donchian20
            .get(tradingPair)
            .getHigh();

        return donchianUpper < sma50;
    }

    /**
     * The one-minute trigger candle must be bullish and all three
     * relative-volume readings must be at least the configured threshold.
     */
    private isHighVolumeUp(
        tradingPair: TradingPair
    ): boolean {
        const open = this.open(
            tradingPair,
            TimeFrame.ONE_MINUTE
        );

        const close = this.close(
            tradingPair,
            TimeFrame.ONE_MINUTE
        );

        if (open === undefined || close === undefined) {
            return false;
        }

        const rva21 = this.rva21
            .get(tradingPair)
            .getRelativeValue();

        const rva89 = this.rva89
            .get(tradingPair)
            .getRelativeValue();

        const rva200 = this.rva200
            .get(tradingPair)
            .getRelativeValue();

        const tripleRvaPassed =
            rva21 >= this.rvaThreshold &&
            rva89 >= this.rvaThreshold &&
            rva200 >= this.rvaThreshold;

        const bullishCandle =
            close > open;

        return tripleRvaPassed && bullishCandle;
    }

    /**
     * The one-minute close must be above the hourly Donchian midpoint
     * but still below its upper band.
     */
    private isInsideUpperDonchianHalf(
        tradingPair: TradingPair
    ): boolean {
        const close = this.close(
            tradingPair,
            TimeFrame.ONE_MINUTE
        );

        if (close === undefined) {
            return false;
        }

        const donchian = this.donchian20.get(tradingPair);

        const middle = donchian.getMiddle();
        const upper = donchian.getHigh();

        return (
            close > middle &&
            close < upper
        );
    }

}