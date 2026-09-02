import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class BullishReversalRegimeFilter extends BaseFilterableAttributeExtractor {
    daily_sma_05: SmaAccessor;
    daily_sma_08: SmaAccessor;
    daily_sma_13: SmaAccessor;
    four_hours_sma_05: SmaAccessor;
    four_hours_sma_08: SmaAccessor;
    four_hours_sma_13: SmaAccessor;
    id: string;
    friendlyDescription: string;
    public constructor() {
        super();
        this.daily_sma_05 = this.useSmaIndicator(TimeFrame.ONE_DAY, new Period(5), Source.CLOSE);
        this.daily_sma_08 = this.useSmaIndicator(TimeFrame.ONE_DAY, new Period(8), Source.CLOSE);
        this.daily_sma_13 = this.useSmaIndicator(TimeFrame.ONE_DAY, new Period(13), Source.CLOSE);
        this.four_hours_sma_05 = this.useSmaIndicator(TimeFrame.FOUR_HOURS, new Period(5), Source.CLOSE);
        this.four_hours_sma_08 = this.useSmaIndicator(TimeFrame.FOUR_HOURS, new Period(8), Source.CLOSE);
        this.four_hours_sma_13 = this.useSmaIndicator(TimeFrame.FOUR_HOURS, new Period(13), Source.CLOSE);
        this.id = `${BullishReversalRegimeFilter.name}.
                    ${this.daily_sma_05.getParameters().getId()}.
                    ${this.daily_sma_08.getParameters().getId()}.
                    ${this.daily_sma_13.getParameters().getId()}.
                    ${this.four_hours_sma_05.getParameters().getId()}.
                    ${this.four_hours_sma_08.getParameters().getId()}.
                    ${this.four_hours_sma_13.getParameters().getId()}`;
        this.friendlyDescription = 'Daily bearish / 4H bullish SMA reversal regime';
    }
    public getId(): string {
        return this.id;
    }
    public getFriendlyDescription(): string {
        return this.friendlyDescription;
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: ReadonlyMap<TimeFrame, boolean>, nowTs: number): void {
        const notReady = !this.daily_sma_05.isReady(tradingPair) || !this.daily_sma_08.isReady(tradingPair) || !this.daily_sma_13.isReady(tradingPair) || !this.four_hours_sma_05.isReady(tradingPair) || !this.four_hours_sma_08.isReady(tradingPair) || !this.four_hours_sma_13.isReady(tradingPair);
        if (notReady) {
            return;
        }

        const sma_05_day = this.daily_sma_05.get(tradingPair).getValue();
        const sma_08_day = this.daily_sma_08.get(tradingPair).getValue();
        const sma_13_day = this.daily_sma_13.get(tradingPair).getValue();

        const sma_05_four_hours = this.four_hours_sma_05.get(tradingPair).getValue();
        const sma_08_four_hours = this.four_hours_sma_08.get(tradingPair).getValue();
        const sma_13_four_hours = this.four_hours_sma_13.get(tradingPair).getValue();

        const cond = (sma_13_day > sma_08_day) && (sma_08_day > sma_05_day) &&
            (sma_05_four_hours > sma_08_four_hours) && (sma_08_four_hours > sma_13_four_hours);
        this.setValue(tradingPair, cond);
    }

}