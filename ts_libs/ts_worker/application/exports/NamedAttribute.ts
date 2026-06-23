import { ISerializable } from "./ISerializable";

export type NamedAttributeType = "number" | "boolean" | "string";
export type NamedAttributeMetadataDto = {
    key: string;
    label: string;
    type: NamedAttributeType;
    precision?: number;
};

export type NamedAttributeDto = {
    metadata: NamedAttributeMetadataDto;
    value?: unknown;
};

export class NamedAttributeMetadata implements ISerializable<NamedAttributeMetadataDto> {
    public constructor(
        public readonly key: string,
        public readonly label: string,
        public readonly type: NamedAttributeType,
        public readonly precision?: number
    ) { }
    public serialize(): NamedAttributeMetadataDto {
        return {
            key: this.key,
            label: this.label,
            type: this.type,
            precision: this.precision
        };
    }

    public static deserialize(dto: NamedAttributeMetadataDto): NamedAttributeMetadata{
        return new NamedAttributeMetadata(
            dto.key,
            dto.label,
            dto.type,
            dto.precision
        );
    }

}

export interface NamedAttribute<T = unknown> extends ISerializable<NamedAttributeDto> {
    readonly metadata: NamedAttributeMetadata;
    readonly value?: T;
    toString(): string;
    compare(other: NamedAttribute<unknown>): number;
}



export class NumericNamedAttribute implements NamedAttribute<number> {
    readonly metadata: NamedAttributeMetadata;
    readonly value?: number | undefined;
    constructor(
        key: string,
        label: string,
        value?: number,
        precision?: number
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "number", precision);
        if (value !== undefined && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
        }
        if (precision !== undefined && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
        }
        this.value = value;
    }
    serialize(): NamedAttributeDto {
        return {
            metadata: {
                key: this.metadata.key,
                label: this.metadata.label,
                type: this.metadata.type,
                precision: this.metadata.precision
            },
            value: this.value
        };
    }

    static fromMetadata(
        argMetadata: NamedAttributeMetadata,
        argValue?: number
    ): NumericNamedAttribute {

        if (argMetadata.type !== 'number') {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
        }
        return new NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argMetadata.precision);
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
        return this.metadata.precision === undefined
            ? this.value.toString()
            : this.value.toFixed(this.metadata.precision);
    }
}

export class BooleanNamedAttribute implements NamedAttribute<boolean> {
    readonly metadata: NamedAttributeMetadata;
    readonly value?: boolean | undefined;
    constructor(
        key: string,
        label: string,
        value?: boolean
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "boolean");
        this.value = value;
    }
    serialize(): NamedAttributeDto {
        return {
            metadata: {
                key: this.metadata.key,
                label: this.metadata.label,
                type: this.metadata.type
            },
            value: this.value
        };
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
    readonly value?: string | undefined;
    constructor(
        key: string,
        label: string,
        value?: string
    ) {
        this.metadata = new NamedAttributeMetadata(key, label, "string");
        if (value !== undefined && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
        }
        this.value = value;
    }
    serialize(): NamedAttributeDto {
        return {
            metadata: {
                key: this.metadata.key,
                label: this.metadata.label,
                type: this.metadata.type
            },
            value: this.value
        };
    }

    static fromMetadata(
        argMetadata: NamedAttributeMetadata,
        argValue?: string
    ): StringNamedAttribute {
        if (argMetadata.type !== "string") {
            throw new Error("StringNamedAttribute requires a valid metadata type");
        }

        return new StringNamedAttribute(
            argMetadata.key,
            argMetadata.label,
            argValue
        );
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

export class NamedAttributeFactory {
    public static deserialize(dto: NamedAttributeDto): NamedAttribute<unknown> {
        const metadata = NamedAttributeMetadata.deserialize(dto.metadata);

        switch (metadata.type) {
            case "number":
                return NumericNamedAttribute.fromMetadata(
                    metadata,
                    dto.value === undefined ? undefined : this.asNumber(dto.value)
                );

            case "boolean":
                return BooleanNamedAttribute.fromMetadata(
                    metadata,
                    dto.value === undefined ? undefined : this.asBoolean(dto.value)
                );

            case "string":
                return StringNamedAttribute.fromMetadata(
                    metadata,
                    dto.value === undefined ? undefined : String(dto.value)
                );

            default:
                throw new Error(`Unsupported named attribute type: ${metadata.type}`);
        }
    }

    private static asBoolean(value: unknown): boolean | undefined {
        if (value === undefined) return undefined;
        if (typeof value !== "boolean") {
            throw new Error("Boolean attribute value must be boolean");
        }
        return value;
    }

    private static asNumber(value: unknown): number | undefined {
        if (value === undefined) return undefined;
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error("Numeric attribute value must be finite number");
        }
        return value;
    }
}