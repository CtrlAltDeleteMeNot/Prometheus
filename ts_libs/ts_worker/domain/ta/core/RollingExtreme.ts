import { RingBuffer } from "../../util/RingBuffer";
import { MutableFloat } from "./MutableFloat";
import { Period } from "./Period";

export class RollingExtreme {

    private readonly period: number;
    private readonly values: RingBuffer<MutableFloat>;
    private readonly isMoreExtreme: (candidate: MutableFloat, currentExtreme: MutableFloat) => boolean;

    constructor(
        period: Period,
        isMoreExtreme: (candidate: MutableFloat, currentExtreme: MutableFloat) => boolean
    ) {
        this.period = Period.fromUnknown(period).getValue();
        if (this.period < 1) {
            throw new RangeError(
                "RollingExtreme period must be >= 1"
            );
        }
        this.values = new RingBuffer<MutableFloat>(this.period, () => new MutableFloat(0));
        this.isMoreExtreme = isMoreExtreme;
    }

    push(value: number): number | null {
        if (!Number.isFinite(value)) {
            throw new RangeError(
                "RollingExtreme value must be finite"
            );
        }
        this.values.push(s => s.update(value));

        if (this.values.getSize() < this.period)
            return null;

        let extreme = this.values.get(0);
        for (let i = 1; i < this.period; i++) {
            const candidate = this.values.get(i);
            if (this.isMoreExtreme(candidate, extreme)) {
                extreme = candidate;
            }
        }
        return extreme.getValue();
    }

}