import { TradingPair } from "../../../domain/entities/TradingPair";
import { Source } from "../../../domain/ta/core/Source";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class CurrentPriceExtractor extends BaseSortableAttributeExtractor {

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts:number): void {
        let hasOneMinuteData = updatedTimeFrames.get(TimeFrame.ONE_MINUTE) === true || undefined;
        if (hasOneMinuteData === undefined) {
            return;
        }
        let currentPrice = this.getOhlcvData(tradingPair, Source.CLOSE, TimeFrame.ONE_MINUTE, 0);
        if (currentPrice === undefined) {
            return;
        }
        this.setValue(tradingPair, currentPrice);
    }

    protected getPrecision(): number | undefined {
        return undefined;
    }

    public getFriendlyDescription(): string {
        return "Price";
    }

    public getId(): string {
        return CurrentPriceExtractor.name;
    }
}