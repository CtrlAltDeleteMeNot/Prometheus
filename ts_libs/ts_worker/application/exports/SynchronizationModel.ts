import { ISerializable } from "./ISerializable";
import { SignalModel, SignalModelDto } from "./SignalModel";
import { TradingPairModel, TradingPairModelDto } from "./TradingPairModel";

export type SynchronizationModelDto = {
    tradingPairs: TradingPairModelDto[];
    signals: SignalModelDto[];
};

export class SynchronizationModel implements ISerializable<SynchronizationModelDto> {
    public constructor(
        public readonly tradingPairs: readonly TradingPairModel[] = [],
        public readonly signals: readonly SignalModel[] = []
    ) {}

    public serialize(): SynchronizationModelDto {
        return {
            tradingPairs: this.tradingPairs.map(tp => tp.serialize()),
            signals: this.signals.map(signal => signal.serialize())
        };
    }

    public static deserialize(dto: SynchronizationModelDto): SynchronizationModel {
        return new SynchronizationModel(
            dto.tradingPairs.map(tp => TradingPairModel.deserialize(tp)),
            dto.signals.map(signal => SignalModel.deserialize(signal))
        );
    }
}