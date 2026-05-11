import { Period } from "../core/Period";
import { Source } from "../core/Source";
import { RsiIndicatorParameters } from "../indicators/RsiIndicator";
import { RvaIndicatorParameters } from "../indicators/RvaIndicator";
import { SmaIndicatorParameters } from "../indicators/SmaIndicator";
import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { IndicatorParameters } from "../indicators/Indicator";
import { PctChangeIndicator, PctChangeIndicatorParameters } from "../indicators/PctChangeIndicator";

export abstract class BaseEvaluator {
    indicatorParameters: IndicatorParameters<any>[];
    constructor() {
        this.indicatorParameters = [];
    }

    public abstract getId(): string;

    public ensureIndicatorsRegisteredNoThrow(mtf: readonly MultiTimeframeOhlcv[] | null) {
        if (mtf === null) {
            return;
        }
        mtf.forEach(item => {
            this.indicatorParameters.forEach(indicator => item.addIndicator(indicator));
        });
    }

    private addIndicatorParams(params: IndicatorParameters<any>) {
        let isRegistered = this.indicatorParameters.some(current => current.equals(params));
        if (!isRegistered) {
            this.indicatorParameters.push(params);
        }
    }

    public useSmaIndicator(timeFrame: TimeFrame, period: Period, source: Source): SmaIndicatorParameters {
        var params = new SmaIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    public useRsiIndicator(timeFrame: TimeFrame, period: Period, source: Source): RsiIndicatorParameters {
        var params = new RsiIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    public useRvaIndicator(timeFrame: TimeFrame, period: Period): RvaIndicatorParameters {
        var params = new RvaIndicatorParameters(timeFrame, period);
        this.addIndicatorParams(params);
        return params;
    }

    public usePercentChangeIndicator(timeFrame: TimeFrame, period: Period, source: Source): PctChangeIndicatorParameters {
        var params = new PctChangeIndicatorParameters(timeFrame, period, source);
        this.addIndicatorParams(params);
        return params;
    }

    public valuesCount(dataset: MultiTimeframeOhlcv, params: IndicatorParameters<any>): number {
        return dataset.findIndicator(params).getValuesCount();
    }



}