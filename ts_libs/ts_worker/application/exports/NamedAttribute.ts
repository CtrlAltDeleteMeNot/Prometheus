export class NamedAttributeMetadata {
    readonly key: string;          // stable identifier (used for lookup)
    readonly label: string;        // UI-facing name (datatable column title)
    readonly type: string;

    constructor(key: string, label: string, type: string) {
        this.key = key;
        this.label = label;
        this.type = type;
    }
}

export interface NamedAttribute<T = unknown> {
    readonly metadata: NamedAttributeMetadata;
    readonly value?: T;
    toString(): string;
    compare(other: NamedAttribute<unknown>): number;
}



export class NumericNamedAttribute implements NamedAttribute<number> {
    readonly metadata: NamedAttributeMetadata;
    constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly value?: number,
        private readonly precision?: number
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "number");
        if (value !== undefined && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
        }
        if (precision !== undefined && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
        }
    }

    static fromMetadata(
        argMetadata: NamedAttributeMetadata,
        argValue?: number,
        argPrecision?: number
    ): NumericNamedAttribute {

        if (argMetadata.type !== 'number') {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
        }
        return new NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argPrecision);
    }

    compare(other: NamedAttribute<any>): number {
        if (other.metadata.type !== this.metadata.type) {
            throw new Error(
                `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
        }

        const a = this.value as number | undefined;
        const b = other.value as number | undefined;

        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;

        return a - b;
    }

    toString(): string {
        if (this.value === undefined) return '';
        return this.precision === undefined
            ? this.value.toString()
            : this.value.toFixed(this.precision);
    }
}

export class BooleanNamedAttribute implements NamedAttribute<boolean> {
    readonly metadata: NamedAttributeMetadata;

    constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly value?: boolean
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "boolean");
    }

    compare(other: NamedAttribute<boolean>): number {
        if (other.metadata.type !== this.metadata.type) {
            throw new Error(
                `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
        }

        const a = this.value as boolean | undefined;
        const b = other.value as boolean | undefined;

        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;

        return Number(a) - Number(b);
    }

    toString(): string {
        return this.value === undefined ? '' : (this.value ? 'true' : 'false');
    }

    static fromMetadata(
        argMetadata: NamedAttributeMetadata,
        argValue?: boolean
    ): BooleanNamedAttribute {
        if (argMetadata.type !== 'boolean') {
            throw new Error("BooleanNamedAttribute requires a valid metadata type");
        }
        return new BooleanNamedAttribute(argMetadata.key, argMetadata.label, argValue);
    }
}


export class StringNamedAttribute implements NamedAttribute<string> {
    readonly metadata: NamedAttributeMetadata;

    constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly value?: string
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "string");
        if (value !== undefined && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
        }
    }

    compare(other: NamedAttribute<any>): number {
        if (other.metadata.type !== this.metadata.type) {
            throw new Error(
                `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
        }

        const a = this.value as string | undefined;
        const b = other.value as string | undefined;

        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;

        return a.localeCompare(b);
    }

    toString(): string {
        return this.value ?? '';
    }
}