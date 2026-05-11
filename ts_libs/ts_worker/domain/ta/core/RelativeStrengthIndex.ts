import { Period } from "./Period";
import { RollingSimpleMovingAverage } from "./RollingSimpleMovingAverage";
import { MathContext } from "./MathContext"

export class RelativeStrengthIndex {
    private readonly period: Period;
    private readonly useWilderSmoothing: boolean;

    private prev: number | null = null;

    private gainSma: RollingSimpleMovingAverage;
    private lossSma: RollingSimpleMovingAverage;

    private avgGain: number | null = null;
    private avgLoss: number | null = null;

    constructor(period: Period, useWilderSmoothing: boolean = true) {
        this.period = Period.fromUnknown(period);
        this.useWilderSmoothing = useWilderSmoothing;

        this.gainSma = new RollingSimpleMovingAverage(this.period);
        this.lossSma = new RollingSimpleMovingAverage(this.period);
    }

    push(value: number): number | null {
        if (this.prev === null) {
            this.prev = value;
            return null;
        }

        const delta = value - this.prev;
        this.prev = value;

        const gain = delta > 0 ? delta : 0;
        const loss = delta < 0 ? -delta : 0;

        // ---- Bootstrap (SMA) ----
        if (this.avgGain === null || this.avgLoss === null) {
            const g = this.gainSma.push(gain);
            const l = this.lossSma.push(loss);

            if (g === null || l === null) {
                return null;
            }

            this.avgGain = g;
            this.avgLoss = l;

            return this.computeRsi();
        }

        // ---- Update phase ----
        if (this.useWilderSmoothing) {
            const p = this.period.getValue();
            this.avgGain = (this.avgGain * (p - 1) + gain) / p;
            this.avgLoss = (this.avgLoss * (p - 1) + loss) / p;
        } else {
            this.avgGain = this.gainSma.push(gain);
            this.avgLoss = this.lossSma.push(loss);
        }

        return this.computeRsi();
    }

    private computeRsi(): number {
        if (this.avgLoss === 0) {
            return 100;
        }

        const rs = this.avgGain! / this.avgLoss!;
        const rsi = 100 - (100 / (1 + rs));
        return MathContext.roundToScale(rsi);
    }

    isReady(): boolean {
        return this.avgGain !== null;
    }
}
