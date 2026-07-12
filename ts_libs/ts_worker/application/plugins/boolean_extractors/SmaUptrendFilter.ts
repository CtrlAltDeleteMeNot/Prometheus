import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { SmaAccessor } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class SmaUptrendFilter extends BaseFilterableAttributeExtractor {
    sma: SmaAccessor;
    public constructor(period: Period, timeFrame: TimeFrame) {
        super();
        this.sma = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
    }
    public getId(): string {
        return `close.above.${this.sma.getParameters().getId()}`;
    }
    public getFriendlyDescription(): string {
        return `Uptrend: ${this.sma.getParameters().getDescription()} < Close`;
    }

    private updateBooleanAttribute(tradingPair: TradingPair): void {
        const tf = this.sma.getParameters().getTimeFrame();
        const close = this.close(tradingPair, tf);
        if (close === undefined) {
            return;
        }
        const isReady = this.sma.isReady(tradingPair);
        if (!isReady) {
            return;
        }

        const isUptrend = close > this.sma.get(tradingPair).getValue();
        this.setValue(tradingPair, isUptrend);
    }

    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts: number): void {
        const tf = this.sma.getParameters().getTimeFrame();
        if (false === this.wasUpdated(updatedTimeFrames, tf)) {
            return;
        }
        this.updateBooleanAttribute(tradingPair);
    }
}