import { ISerializable } from "./ISerializable";
import { BooleanNamedAttribute, NamedAttribute, NamedAttributeDto, NamedAttributeFactory, NamedAttributeMetadata, NumericNamedAttribute } from "./NamedAttribute";

export type TradingPairModelDto = {
    baseAsset: string;
    quoteAsset: string;
    exchangeName: string;
    exchangeId: number;
    exchangeUrl: string;
    attributes: NamedAttributeDto[];
};

export class TradingPairModel implements ISerializable<TradingPairModelDto> {
    public readonly baseAsset: string;
    public readonly quoteAsset: string;
    public readonly exchangeName: string;
    public readonly exchangeId: number;
    public readonly exchangeUrl: string;
    private readonly extended: NamedAttribute<unknown>[];

    constructor(
        baseAsset: string,
        quoteAsset: string,
        exchangeName: string,
        exchangeId: number,
        exchangeUrl: string,
        attributes: readonly NamedAttribute<unknown>[] = []
    ) {
        this.baseAsset = baseAsset;
        this.quoteAsset = quoteAsset;
        this.exchangeName = exchangeName;
        this.exchangeId = exchangeId;
        this.exchangeUrl = exchangeUrl;
        this.extended = [...attributes];
    }

    serialize(): TradingPairModelDto {
        return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeName: this.exchangeName,
            exchangeId: this.exchangeId,
            exchangeUrl: this.exchangeUrl,
            attributes: this.extended.map(attr => attr.serialize())
        };
    }

    public static deserialize(tradingPairModelDto: TradingPairModelDto): TradingPairModel {
        const attributes = tradingPairModelDto.attributes.map(attr =>
            NamedAttributeFactory.deserialize(attr)
        );
        const model = new TradingPairModel(
            tradingPairModelDto.baseAsset,
            tradingPairModelDto.quoteAsset,
            tradingPairModelDto.exchangeName,
            tradingPairModelDto.exchangeId,
            tradingPairModelDto.exchangeUrl,
            attributes
        );
        return model;
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
        return this.extended.filter(e => e instanceof NumericNamedAttribute) || [];
    }

    getBooleanAttributes(): readonly BooleanNamedAttribute[] {
        return this.extended.filter(e => e instanceof BooleanNamedAttribute) || [];
    }


}