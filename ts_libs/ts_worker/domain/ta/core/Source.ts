
import { OhlcvEntry } from '../../values/OhlcvEntry';

type OhlcvExtractor = (entry: OhlcvEntry) => number;

export class Source {
    // Private map of all source instances
    static #VALUES: Map<string, Source> = new Map();

    // Predefined sources
    static readonly OPEN = new Source("open", (entry) => entry.open);
    static readonly HIGH = new Source("high", (entry) => entry.high);
    static readonly LOW = new Source("low", (entry) => entry.low);
    static readonly CLOSE = new Source("close", (entry) => entry.close);
    static readonly VOLUME = new Source("volume", (entry) => entry.volume);
    static readonly TYPICAL = new Source(
        "typical",
        (entry) => (entry.high + entry.low + entry.close) / 3
    );
    static readonly MEDIAN = new Source(
        "median",
        (entry) => (entry.high + entry.low) / 2
    );

    public readonly label: string;
    public readonly extract: OhlcvExtractor;

    /**
     * @param label Unique label for the source
     * @param extractor Function to extract the value from an OhlcvEntry
     */
    private constructor(label: string, extractor: OhlcvExtractor) {
        if (Source.#VALUES.has(label)) {
            throw new Error(`Source with label "${label}" already exists`);
        }

        this.label = label;
        this.extract = extractor;

        Source.#VALUES.set(label, this);
        Object.freeze(this);
    }

    /**
     * Get a Source instance by its label
     * @param label
     * @returns Source
     */
    static get(label: string): Source {
        const value = Source.#VALUES.get(label);
        if (!value) throw new RangeError(`Unknown source: ${label}`);
        return value;
    }

    /**
     * Get all Source values
     */
    static values(): Source[] {
        return Array.from(Source.#VALUES.values());
    }

    /**
     * Check equality with another Source
     * @param other unknown
     */
    equals(other: unknown): boolean {
        return other instanceof Source && this.label === other.label;
    }

    /**
     * Runtime validation helper
     * @param value unknown
     */
    static fromUnknown(value: unknown): Source {
        if (!(value instanceof Source)) {
            throw new TypeError("Value is not a Source");
        }
        return value;
    }
}
