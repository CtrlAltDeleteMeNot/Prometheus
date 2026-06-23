import { ISerializable } from "../ISerializable";

export type ExchangeInclusionCriteriaDto = {
    name: string;
    id: number;
    include: boolean;
}

export class ExchangeInclusionCriteria implements ISerializable<ExchangeInclusionCriteriaDto> {
    name: string;
    id: number;
    include: boolean;

    constructor(name: string, id: number, include: boolean) {
        this.name = name;
        this.id = id;
        this.include = include;
    }

    serialize(): ExchangeInclusionCriteriaDto {
        return {
            name: this.name,
            id: this.id,
            include: this.include
        }
    }

    public static deserialize(dto: ExchangeInclusionCriteriaDto): ExchangeInclusionCriteria {
        if (typeof dto.name !== 'string') {
            throw new Error('Invalid name');
        }
        if (typeof dto.id !== 'number') {
            throw new Error('Invalid id');
        }
        if (typeof dto.include !== 'boolean') {
            throw new Error('Invalid include flag');
        }
        return new ExchangeInclusionCriteria(
            dto.name,
            dto.id,
            dto.include
        );

    }


    deepEquals(other: ExchangeInclusionCriteria): boolean {
        if (!other) return false;
        return this.name === other.name &&
            this.id === other.id &&
            this.include === other.include;
    }

    deepClone(): ExchangeInclusionCriteria {
        return new ExchangeInclusionCriteria(this.name, this.id, this.include);
    }
}