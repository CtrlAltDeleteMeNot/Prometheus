import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { PctChangeAccessor, PctChangeIndicator, PctChangeIndicatorParameters } from "../../../domain/ta/indicators/PctChangeIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseSortableAttributeExtractor } from "../BaseSortableAttributeExtractor";

export class ThirtyDayPercentChangeExtractor extends BaseSortableAttributeExtractor {

    private pctChange: PctChangeAccessor;
    public constructor() {
        super();
        this.pctChange = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, new Period(30), Source.CLOSE);
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts: number): void {
        if (false === updatedTimeFrames.get(TimeFrame.ONE_DAY)) {
            return;
        }
        const isReady = this.pctChange.isReady(tradingPair);
        if(!isReady){
            return;
        }
        let pctChange = this.pctChange.get(tradingPair).getValue();
        this.setValue(tradingPair, pctChange);
    }

    protected getPrecision(): number | undefined {
        return 2;
    }

    public getFriendlyDescription(): string {
        return '30 Days Change %';
    }

    public getId(): string {
        return ThirtyDayPercentChangeExtractor.name;
    }
}