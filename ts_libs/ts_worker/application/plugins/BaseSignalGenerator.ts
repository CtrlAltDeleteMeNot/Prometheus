import { TradingPair } from "../../domain/entities/TradingPair";
import { BasePlugin } from "../../domain/ta/export/BasePlugin";
import { SignalDirection } from "../exports/SignalModel";

export type OrderDetails = {
    entryPrice?: number;
    stopLossPrice?: number;
    takeProfitLevels?: number[];
};

export type SignalData = {
    tradingPair: TradingPair,
    signalDirection: SignalDirection,
    source: BaseSignalGenerator,
    timeStamp: number,
    orderDetails?: OrderDetails;
}

export abstract class BaseSignalGenerator extends BasePlugin {
    private signals: SignalData[] = [];

    protected emit(tradingPair: TradingPair, signalDirection: SignalDirection, timeStamp: number,  orderDetails?: OrderDetails): void {
        this.signals.push({
            tradingPair: tradingPair,
            signalDirection: signalDirection,
            source: this,
            timeStamp: timeStamp,
            orderDetails: orderDetails
        });
    }

    public drain(): SignalData[] {
        const drained = this.signals.slice();
        this.signals.length = 0;
        return drained;
    }

    public getSignalsCount(): number {
        return this.signals.length;
    }
}