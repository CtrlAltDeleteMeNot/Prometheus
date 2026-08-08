import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { DonchianChannelsAccessor } from "../../../domain/ta/indicators/DonchianChannels";
import { RvaAccessor } from "../../../domain/ta/indicators/RvaIndicator";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { SignalDirection } from "../../exports/SignalModel";
import { BaseSignalGenerator, OrderDetails } from "../BaseSignalGenerator";

export class HighVolumeDonchianCompressionSignalGenerator extends BaseSignalGenerator {
    private readonly donchian5m: DonchianChannelsAccessor;
    private readonly donchian15m: DonchianChannelsAccessor;
    private readonly donchian1h: DonchianChannelsAccessor;

    private readonly sma200_1h: SmaAccessor;

    private readonly rva21_1m: RvaAccessor;
    private readonly rva89_1m: RvaAccessor;
    private readonly rva200_1m: RvaAccessor;

    private readonly rvaThreshold: number;

    private readonly id: string;
    private readonly friendlyDescription: string;

    public constructor() {
        super();

        this.rvaThreshold = 4;

        this.donchian5m = this.useDonchianChannelsIndicator(
            TimeFrame.FIVE_MINUTES,
            Period.fromUnknown(20),
        );

        this.donchian15m = this.useDonchianChannelsIndicator(
            TimeFrame.FIFTEEN_MINUTES,
            Period.fromUnknown(20),
        );

        this.donchian1h = this.useDonchianChannelsIndicator(
            TimeFrame.ONE_HOUR,
            Period.fromUnknown(20),
        );

        this.sma200_1h = this.useSmaIndicator(
            TimeFrame.ONE_HOUR,
            Period.fromUnknown(200),
            Source.CLOSE,
        );

        this.rva21_1m = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(21),
        );

        this.rva89_1m = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(89),
        );

        this.rva200_1m = this.useRvaIndicator(
            TimeFrame.ONE_MINUTE,
            Period.fromUnknown(200),
        );

        this.id = [
            "high-volume-donchian-compression",
            this.donchian5m.getParameters().getId(),
            this.donchian15m.getParameters().getId(),
            this.donchian1h.getParameters().getId(),
            this.sma200_1h.getParameters().getId(),
            this.rva21_1m.getParameters().getId(),
            this.rva89_1m.getParameters().getId(),
            this.rva200_1m.getParameters().getId(),
            `rva-threshold-${this.rvaThreshold}`,
        ].join(".");

        this.friendlyDescription =
            "Bullish one-minute high-volume expansion while price is above the hourly SMA200, the 15-minute Donchian high remains below the hourly Donchian midpoint, and the 5-minute Donchian midpoint is above the 15-minute midpoint.";
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
        if (!this.wasUpdated(updatedTimeFrames, TimeFrame.ONE_MINUTE)) {
            return;
        }

        if (!this.areIndicatorsReady(tradingPair)) {
            return;
        }

        if (!this.hasTripleRvaSpike(tradingPair)) {
            return;
        }

        if (!this.isPriceAboveHourlySma200(tradingPair)) {
            return;
        }

        if (!this.isMediumDonchianCompressedBelowHourlyMid(tradingPair)) {
            return;
        }

        if (!this.isFastDonchianLeading(tradingPair)) {
            return;
        }

        const orderDetails = this.makeOrderDetails(tradingPair);

        if (orderDetails === undefined) {
            return;
        }


        this.emit(
            tradingPair,
            SignalDirection.BULLISH,
            ts,
            orderDetails
        );
    }

    private areIndicatorsReady(
        tradingPair: TradingPair,
    ): boolean {
        return (
            this.donchian5m.isReady(tradingPair) &&
            this.donchian15m.isReady(tradingPair) &&
            this.donchian1h.isReady(tradingPair) &&
            this.sma200_1h.isReady(tradingPair) &&
            this.rva21_1m.isReady(tradingPair) &&
            this.rva89_1m.isReady(tradingPair) &&
            this.rva200_1m.isReady(tradingPair)
        );
    }

    /**
     * Pine:
     *
     * rva1m
     *
     * RVA21, RVA89 and RVA200 must all be >= 4.
     */
    private hasTripleRvaSpike(
        tradingPair: TradingPair,
    ): boolean {
        const rva21 = this.rva21_1m
            .get(tradingPair)
            .getRelativeValue();

        const rva89 = this.rva89_1m
            .get(tradingPair)
            .getRelativeValue();

        const rva200 = this.rva200_1m
            .get(tradingPair)
            .getRelativeValue();

        return (
            rva21 >= this.rvaThreshold &&
            rva89 >= this.rvaThreshold &&
            rva200 >= this.rvaThreshold
        );
    }

    /**
     * Pine:
     *
     * close > sma3
     *
     * sma3 = SMA(200, 1H)
     */
    private isPriceAboveHourlySma200(
        tradingPair: TradingPair,
    ): boolean {
        const close = this.close(
            tradingPair,
            TimeFrame.ONE_MINUTE,
        );

        if (close === undefined) {
            return false;
        }

        const sma200 = this.sma200_1h
            .get(tradingPair)
            .getValue();

        return close > sma200;
    }

    /**
     * Pine:
     *
     * high2 < mid3
     *
     * high2 = Donchian(20, 15m).high
     * mid3  = Donchian(20, 1h).middle
     */
    private isMediumDonchianCompressedBelowHourlyMid(
        tradingPair: TradingPair,
    ): boolean {
        const donchian15m = this.donchian15m.get(tradingPair);
        const donchian1h = this.donchian1h.get(tradingPair);

        const mediumHigh = donchian15m.getHigh();
        const hourlyMiddle = donchian1h.getMiddle();

        return mediumHigh < hourlyMiddle;
    }

    /**
     * Pine:
     *
     * mid1 > mid2
     *
     * mid1 = Donchian(20, 5m).middle
     * mid2 = Donchian(20, 15m).middle
     */
    private isFastDonchianLeading(
        tradingPair: TradingPair,
    ): boolean {
        const donchian5m = this.donchian5m.get(tradingPair);
        const donchian15m = this.donchian15m.get(tradingPair);

        const fastMiddle = donchian5m.getMiddle();
        const mediumMiddle = donchian15m.getMiddle();

        return fastMiddle > mediumMiddle;
    }


    /**
     * Entry:
     * current 1m close
     *
     * Stop:
     * Donchian(20, 15m) low
     *
     * Targets:
     * 1R / 2R / 3R
     */
    private makeOrderDetails(
        tradingPair: TradingPair,
    ): OrderDetails | undefined {
        const entryPrice = this.getOhlcvData(
            tradingPair,
            Source.CLOSE,
            TimeFrame.ONE_MINUTE,
            0,
        );

        const stopLoss = this.donchian1h
            .get(tradingPair)
            .getLow();

        if (
            entryPrice === undefined ||
            !Number.isFinite(entryPrice) ||
            !Number.isFinite(stopLoss)
        ) {
            return undefined;
        }

        if (stopLoss >= entryPrice) {
            return undefined;
        }

        const risk = entryPrice - stopLoss;

        if (!Number.isFinite(risk) || risk <= 0) {
            return undefined;
        }

        const decimals = Math.max(
            this.countDecimals(entryPrice),
            this.countDecimals(stopLoss),
        );

        return {
            entryPrice: this.tr(entryPrice, decimals),
            stopLossPrice: this.tr(stopLoss, decimals),
            takeProfitLevels: [
                this.tr(entryPrice + risk, decimals),
                this.tr(entryPrice + risk * 2, decimals),
                this.tr(entryPrice + risk * 3, decimals),
            ],
        };
    }

    private countDecimals(
        n?: number,
    ): number {
        if (n === undefined || !Number.isFinite(n)) {
            return 0;
        }

        return n.toString().split(".")[1]?.length ?? 0;
    }

    private tr(
        num: number,
        decimals: number,
    ): number {
        return parseFloat(num.toFixed(decimals));
    }

}