import { RingBuffer } from "../../util/RingBuffer";
import { MathContext } from "./MathContext";
import { MutableFloat } from "./MutableFloat";
import { Period } from "./Period";

export class PeriodPercentChange {
    period: Period;
    buffer: RingBuffer<MutableFloat>;
    constructor(period: Period) {
        this.period = Period.fromUnknown(period);
        this.buffer = new RingBuffer(this.period.getValue(), () => new MutableFloat(0));
    }

    /**
         * Add a new value and compute 
         * @param {number} value
         * @returns {number | null} Current PCT_CHANGE or null if not ready or undefined on division by zero error
         */
    push(value: number): number | null | undefined {
        const periodValue = this.period.getValue();
        this.buffer.push((s) => s.update(value));
        if (this.buffer.getSize() < periodValue) {
            return null;
        }
        const oldest = this.buffer.get(periodValue - 1).getValue();
        const current = this.buffer.get().getValue();
        if (oldest === 0) {
            return undefined;
        }
        const pctChange = ((current - oldest) / oldest) * 100;
        return pctChange;

    }
}