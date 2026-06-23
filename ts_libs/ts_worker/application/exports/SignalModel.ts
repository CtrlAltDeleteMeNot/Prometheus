import { ISerializable } from "./ISerializable";

export enum SignalDirection {
    BULLISH = "BULLISH",
    BEARISH = "BEARISH",
    NEUTRAL = "NEUTRAL"
};

export type SignalModelDto = {
    baseAsset: string;
    quoteAsset: string;
    exchangeName: string;
    exchangeId: number;
    exchangeUrl: string,    // https://www.binance.com/en/trade/BNB_USDT?type=spot
    description: string;    // "RSI crossed back above 30 with elevated volume."
    direction: SignalDirection;
    timestamp: number;
};

export class SignalModel implements ISerializable<SignalModelDto> {
    public constructor(
        public readonly baseAsset: string,
        public readonly quoteAsset: string,
        public readonly exchangeName: string,
        public readonly exchangeId: number,
        public readonly exchangeUrl: string,
        public readonly description: string,
        public readonly direction: SignalDirection,
        public readonly timestamp: number
    ) { }

    public serialize(): SignalModelDto {
        return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeId: this.exchangeId,
            exchangeName: this.exchangeName,
            exchangeUrl: this.exchangeUrl,
            description: this.description,
            direction: this.direction,
            timestamp: this.timestamp
        };
    }

    public static deserialize(dto: SignalModelDto): SignalModel {
        return new SignalModel(
            dto.baseAsset,
            dto.quoteAsset,
            dto.exchangeName,
            dto.exchangeId,
            dto.exchangeUrl,
            dto.description,
            dto.direction,
            dto.timestamp
        );
    }
};