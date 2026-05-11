export class ExchangeInclusionCriteria {
    name: string;
    id: number;
    include: boolean;

    constructor(name: string, id: number, include: boolean) {
        this.name = name;
        this.id = id;
        this.include = include;
    }

    static fromJson(json: any): ExchangeInclusionCriteria {
        if (typeof json.name !== 'string') {
            throw new Error('Invalid name');
        }
        if (typeof json.id !== 'number') {
            throw new Error('Invalid id');
        }
        if (typeof json.include !== 'boolean') {
            throw new Error('Invalid include flag');
        }

        return new ExchangeInclusionCriteria(json.name, json.id, json.include);
    }

    toJson(): any {
        return {
            name: this.name,
            id: this.id,
            include: this.include
        }
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