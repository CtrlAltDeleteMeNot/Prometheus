import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";

export abstract class IndicatorOutput {}
export interface IndicatorRuntime {
    getId(): string;
    getParameters(): IndicatorParameters;

    update(timeFrame: TimeFrame): void;
    isReady(): boolean;

    getValue(n?: number): IndicatorOutput;
    getPendingValue(): IndicatorOutput;
    getValuesCount(): number;
}

export abstract class IndicatorParameters{
    /** @returns {string} */
    abstract getId(): string;

    /** @returns {string} */
    abstract getDescription(): string;
    /**
     * Compare parameters by identifier
     * @param other unknown
     */
    equals(other: unknown): boolean {
        try {
            if (other instanceof IndicatorParameters) {
                return this.getId() === other.getId();
            }
            return false;
        } catch {
            return false;
        }
    }
    abstract createUsing(
        buffer: MultiTimeframeOhlcv
    ): IndicatorRuntime;
}




export abstract class Indicator<TParameters extends IndicatorParameters, TOutput extends IndicatorOutput> implements IndicatorRuntime {
    protected readonly parameters: TParameters;

    protected constructor(parameters: TParameters) {
        if (!(parameters instanceof IndicatorParameters)) {
            throw new TypeError(
                "Invalid indicator parameters"
            );
        }
        this.parameters = parameters;
    }

    getParameters(): TParameters {
        return this.parameters;
    }

    getId(): string {
        return this.parameters.getId();
    }

    abstract update(timeFrame: TimeFrame): void;
    abstract isReady(): boolean;
    abstract getValue(n?: number): TOutput;
    abstract getPendingValue(): TOutput;
    abstract getValuesCount(): number;
}

