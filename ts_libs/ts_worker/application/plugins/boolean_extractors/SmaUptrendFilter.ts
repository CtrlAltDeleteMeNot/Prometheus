import { TradingPair } from "../../../domain/entities/TradingPair";
import { Period } from "../../../domain/ta/core/Period";
import { Source } from "../../../domain/ta/core/Source";
import { SmaIndicatorOutput, SmaIndicatorParameters } from "../../../domain/ta/indicators/SmaIndicator";
import { TimeFrame } from "../../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../BaseFilterableAttributeExtractor";

export class SmaUptrendFilter extends BaseFilterableAttributeExtractor {
    smaParameters: SmaIndicatorParameters;
    public constructor(period: Period, timeFrame: TimeFrame) {
        super();
        this.smaParameters = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
    }
    public getId(): string {
        return `close.above.${this.smaParameters.getId()}`;
    }
    public getFriendlyDescription(): string {
        return `Uptrend: ${this.smaParameters.getDescription()} < Close`;
    }
    public next(tradingPair: TradingPair, updatedTimeFrames: Map<TimeFrame, boolean>, ts:number): void {
        if (!updatedTimeFrames.get(this.smaParameters.getTimeFrame())) {
            return;
        }
        const close = this.getOhlcvData(tradingPair, Source.CLOSE, this.smaParameters.getTimeFrame(), 0);
        const smaIndicator = this.findIndicator(tradingPair, this.smaParameters);
        const smaIndicatorReady = this.isIndicatorReady(smaIndicator);
        if(!smaIndicatorReady) {
            return;
        }
        const smaIndicatorOutput = this.getIndicatorValue(smaIndicator, 0) as SmaIndicatorOutput;
        if (close === undefined) {
            return;
        }
        
        const isUptrend = close > smaIndicatorOutput.getValue();
        this.setValue(tradingPair, isUptrend);
    }


}