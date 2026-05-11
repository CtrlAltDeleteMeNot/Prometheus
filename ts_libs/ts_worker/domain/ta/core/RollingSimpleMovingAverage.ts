import { MutableFloat } from "./MutableFloat";
import { RingBuffer } from "../../util/RingBuffer";
import { MathContext } from "./MathContext"
import { Period } from "./Period";

/**
 * @param {Period} period - Number of elements to average
 */
export class RollingSimpleMovingAverage {
    constructor(period: Period) {
        this.period = Period.fromUnknown(period);
        this.buffer = new RingBuffer(this.period.getValue(), () => new MutableFloat(0));
        this.sum = 0;
    }

    /**
     * Add a new value and update the average
     * @param {number} value
     * @returns {number | null} Current SMA or null if not ready
     */
    push(value: number): number | null {
        if (this.buffer.getSize() === this.period.getValue()) {
            const oldest = this.buffer.get(this.period.getValue() - 1);
            this.sum -= oldest.getValue();
        }

        this.buffer.push((s) => s.update(value));
        this.sum += value;
        if (!this.isReady()) {
            return null;
        }
        let computedValue = this.sum / this.period.getValue();
        return MathContext.roundToScale(computedValue);
    }

    isReady(): boolean {
        return this.buffer.getSize() === this.period.getValue();
    }

    private period: Period;
    private buffer: RingBuffer<MutableFloat>;
    private sum: number;
}