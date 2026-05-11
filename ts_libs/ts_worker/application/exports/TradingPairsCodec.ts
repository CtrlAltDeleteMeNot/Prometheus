import { BooleanNamedAttribute, NamedAttribute, NamedAttributeMetadata, NumericNamedAttribute, StringNamedAttribute } from "./NamedAttribute";
import { TradingPairModel } from "./TradingPairModel";


export class TradingPairsCodec {
    /** Serialize array of TradingPairModel to JSON string */
    public static toJsonString(tradingPairs: readonly TradingPairModel[]): string {
        const dto = tradingPairs.map(tp => ({
            baseAsset: tp.baseAsset,
            quoteAsset: tp.quoteAsset,
            exchangeName: tp.exchangeName,
            exchangeId: tp.exchangeId,
            exchangeUrl: tp.exchangeUrl,
            price: tp.price,
            extended: tp.getAttributes().map(attr => ({
                key: attr.metadata.key,
                label: attr.metadata.label,
                type: attr.metadata.type,
                value: attr.value,
                precision: (attr as any).precision ?? undefined
            }))
        }));

        return JSON.stringify(dto);
    }

    public static extractUniqueSortableAttributes(tradingPairs: readonly TradingPairModel[]): readonly NamedAttributeMetadata[] {
        const toReturn: NamedAttributeMetadata[] = [];
        const count = Math.min(10, tradingPairs.length);
        for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getNumericAttributes();
            for (let j = 0; j < attrs.length; j++) {
                const meta = attrs[j].metadata;
                const metaKey = meta.key;
                const isNew = !toReturn.some(s => s.key === metaKey);
                if (isNew) {
                    toReturn.push(meta);
                }
            }
        }
        return toReturn;
    }

    public static extractUniqueFilterableAttributes(tradingPairs: readonly TradingPairModel[]): readonly NamedAttributeMetadata[] {
        const toReturn: NamedAttributeMetadata[] = [];
        const count = Math.min(10, tradingPairs.length);
        for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getBooleanAttributes();
            for (let j = 0; j < attrs.length; j++) {
                const meta = attrs[j].metadata;
                const metaKey = meta.key;
                const isNew = !toReturn.some(s => s.key === metaKey);
                if (isNew) {
                    toReturn.push(meta);
                }
            }
        }
        return toReturn;
    }

    /** Deserialize from JSON string to array of TradingPairModel */
    public static fromJsonString(buffer: string): readonly TradingPairModel[] {
        const dtoArray = JSON.parse(buffer) as any[];

        return dtoArray.map(dto => {
            const model = new TradingPairModel(
                dto.baseAsset,
                dto.quoteAsset,
                dto.exchangeName,
                dto.exchangeId,
                dto.price,
                dto.exchangeUrl
            );

            for (const attrDto of dto.extended) {
                let attr: NamedAttribute<any>;

                switch (attrDto.type) {
                    case 'number':
                        attr = new NumericNamedAttribute(
                            attrDto.key,
                            attrDto.label,
                            attrDto.value,
                            attrDto.precision
                        );
                        break;
                    case 'string':
                        attr = new StringNamedAttribute(
                            attrDto.key,
                            attrDto.label,
                            attrDto.value
                        );
                        break;
                    case 'boolean':
                        // fallback as string for simplicity
                        attr = new BooleanNamedAttribute(
                            attrDto.key,
                            attrDto.label,
                            attrDto.value ?? false
                        );
                        break;
                    default:
                        throw new Error(`Type conversion failed for ${attrDto.type} -> ${attrDto.key}`);
                }

                model.addAttr(attr);
            }

            return model;
        });
    }
}