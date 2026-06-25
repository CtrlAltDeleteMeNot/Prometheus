import { TradingPair } from "../../../domain/entities/TradingPair";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class CurrentPriceExtractor extends BaseSortableAttributeExtractor {
    
    
    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts:number): void {
        if(false === this.wasUpdated(updatedTimeFrames, TimeFrame.ONE_MINUTE)){
            return;
        }
        
        let currentPrice = this.close(tradingPair, TimeFrame.ONE_MINUTE);
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