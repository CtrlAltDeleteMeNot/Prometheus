import { ISerializable } from "./ISerializable";

export enum SignalDirection {
    BULLISH = "BULLISH",
    BEARISH = "BEARISH",
    NEUTRAL = "NEUTRAL"
};

export type SignalModelDto = {
    baseAsset: string;      // BTC
    quoteAsset: string;     // USDC
    exchangeId: number;     // 1--binance
    exchangeUrl: string,    // https://www.binance.com/en/trade/BNB_USDT?type=spot
    title: string;          // "RSI Oversold Recovery"
    subtitle: string;       // "BTC/USDC · Binance · 1m"
    description: string;    // "RSI crossed back above 30 with elevated volume."
    direction: SignalDirection;
    timestamp: number;
};

export class SignalModel implements ISerializable<SignalModelDto> {
    public constructor(
        public readonly baseAsset: string,
        public readonly quoteAsset: string,
        public readonly exchangeId: number,
        public readonly exchangeUrl: string,
        public readonly title: string,
        public readonly subtitle: string,
        public readonly description: string,
        public readonly direction: SignalDirection,
        public readonly timestamp: number
    ) {}

    public serialize(): SignalModelDto {
        return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeId: this.exchangeId,
            exchangeUrl: this.exchangeUrl,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            direction: this.direction,
            timestamp: this.timestamp
        };
    }

    public static deserialize(dto: SignalModelDto): SignalModel {
        return new SignalModel(
            dto.baseAsset,
            dto.quoteAsset,
            dto.exchangeId,
            dto.exchangeUrl,
            dto.title,
            dto.subtitle,
            dto.description,
            dto.direction,
            dto.timestamp
        );
    }
};