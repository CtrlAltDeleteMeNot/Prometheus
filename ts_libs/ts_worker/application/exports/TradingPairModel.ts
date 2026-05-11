import { BooleanNamedAttribute, NamedAttribute, NamedAttributeMetadata, NumericNamedAttribute } from "./NamedAttribute";


export class TradingPairModel {
    public readonly baseAsset: string;
    public readonly quoteAsset: string;
    public readonly exchangeName: string;
    public readonly exchangeId: number;
    public readonly price: number;
    public readonly exchangeUrl: string;

    private readonly extended: NamedAttribute<unknown>[];

    constructor(
        baseAsset: string,
        quoteAsset: string,
        exchangeName: string,
        exchangeId: number,
        price: number, 
        exchangeUrl: string
    ) {
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.exchangeName = exchangeName;
        this.exchangeId = exchangeId;
        this.price = price;
        this.exchangeUrl = exchangeUrl;
        this.extended = [];

        Object.freeze(this);
    }

    // ------------------------
    // Typed attribute access
    // ------------------------

    addAttr(attr: NamedAttribute<unknown>): void {
        this.extended.push(attr);
    }

    getAttr<T = unknown>(key: string): NamedAttribute<T> | undefined {
        return this.extended.find(a => a.metadata.key === key) as NamedAttribute<T> | undefined;
    }

    getAttrValue<T = unknown>(key: string, fallback?: T): T | undefined {
        return this.getAttr<T>(key)?.value ?? fallback;
    }

    hasAttr(key: string): boolean {
        return this.extended.some(a => a.metadata.key === key);
    }

    getAttributes(): readonly NamedAttribute<unknown>[] {
        return this.extended;
    }

    getNumericAttributes(): readonly NumericNamedAttribute[] {
        return this.extended.filter(e=>e instanceof NumericNamedAttribute) || [];
    }

    getBooleanAttributes(): readonly BooleanNamedAttribute[] {
        return this.extended.filter(e=>e instanceof BooleanNamedAttribute) || [];
    }

    static dailyPercentChangeMetadata(): NamedAttributeMetadata {
        return new NamedAttributeMetadata('daily_percent_change', "Daily change %", 'number');
    }

    static currentPriceMetadata(): NamedAttributeMetadata {
        return new NamedAttributeMetadata('price', "Price", 'number');
    }
}