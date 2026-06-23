import { TradingPair } from "../../../domain/entities/TradingPair";
import { Source } from "../../../domain/ta/core/Source";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class DailyPriceChangeExtractor extends BaseSortableAttributeExtractor {
    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>,  ts:number): void {
        if(false === updatedTimeFrames.has(TimeFrame.ONE_MINUTE)){
            return;
        }
        const dayOpenPrice = this.getOhlcvPendingData(tradingPair, Source.OPEN, TimeFrame.ONE_DAY);
        const currentPrice = this.getOhlcvData(tradingPair, Source.CLOSE, TimeFrame.ONE_MINUTE, 0);
        if (currentPrice === undefined) {
            return;
        }
        if (dayOpenPrice === undefined) {
            return;
        }
        const percentChange = ((currentPrice - dayOpenPrice) / dayOpenPrice) * 100;
        this.setValue(tradingPair, percentChange);
    }

    protected getPrecision(): number | undefined {
        return 2;
    }

    public getFriendlyDescription(): string {
        return "Daily change %";
    }

    public getId(): string {
        return DailyPriceChangeExtractor.name;
    }

}