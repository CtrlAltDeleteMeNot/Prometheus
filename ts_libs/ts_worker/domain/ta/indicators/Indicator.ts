import { MultiTimeframeOhlcv } from "../../values/MultiTimeframeOhlcv";
import { TimeFrame } from "../../values/TimeFrame";
import { Period } from "../core/Period";
import { Source } from "../core/Source";

export abstract class IndicatorParameters<T extends IndicatorOutput> {
    /** @returns {string} */
    abstract getId(): string;

    /** @returns {string} */
    abstract getDescription(): string;

    /** @returns {TimeFrame} */
    abstract getTimeFrame(): TimeFrame;

    /** @returns {Period} */
    abstract getPeriod(): Period;

    /** @returns {Source} */
    abstract getSource(): Source;

    /**
     * @param buffer MultiTimeframeOhlcv
     * @returns Indicator
     */
    abstract createUsing(buffer: MultiTimeframeOhlcv): Indicator<T>;

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
}

export class IndicatorOutput {

}

export abstract class Indicator<T extends IndicatorOutput> {
    protected readonly parameters: IndicatorParameters<T>;

    constructor(parameters: IndicatorParameters<T>) {
        this.parameters = parameters;
    }

    getParameters(): IndicatorParameters<T> {
        return this.parameters;
    }

    getId(): string {
        return this.parameters.getId();
    }

    abstract isReady(): boolean;
    abstract update(): void;
    abstract getValue(n?: number): T;
    abstract getPendingValue(): T;
    abstract getValuesCount(): number;
}
