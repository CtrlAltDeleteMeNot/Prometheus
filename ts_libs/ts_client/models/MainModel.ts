
import { NamedAttributeMetadata } from "../../ts_worker/application/exports/NamedAttribute";
import { ScreenerSettings } from "../../ts_worker/application/exports/ScreenerSettings";
import { SignalModel } from "../../ts_worker/application/exports/SignalModel";
import { SortDirection } from "../../ts_worker/application/exports/SortDirection";
import { TradingPairModel } from "../../ts_worker/application/exports/TradingPairModel";


export class MainModel {
    private multiTimeFrameSnapshot: readonly TradingPairModel[];
    //screener sortables
    private sortableAttributes: readonly NamedAttributeMetadata[];
    private sortDirection: SortDirection;
    private sortNamedAttributeMetadata: NamedAttributeMetadata | undefined;
    //screener filterables
    private filterableAttributes: readonly NamedAttributeMetadata[];
    private activeFilterableAttributes: NamedAttributeMetadata[] | undefined;
    private screenerSettings: ScreenerSettings | undefined;
    //signals
    private signals: SignalModel[];

    constructor() {
        this.multiTimeFrameSnapshot = [];
        this.sortableAttributes = [];
        this.filterableAttributes = [];
        this.signals = [];
        this.sortDirection = SortDirection.Descending;
    }

    setSortableAttributes(namedAttributes: readonly NamedAttributeMetadata[]) {
        this.sortableAttributes = namedAttributes;
    }

    setFilterableAttributes(namedAttributes: readonly NamedAttributeMetadata[]) {
        this.filterableAttributes = namedAttributes;
    }

    setActiveFilterableAttributes(namedAttributes: NamedAttributeMetadata[]) {
        this.activeFilterableAttributes = namedAttributes;
    }

    getSortableAttributes(): readonly NamedAttributeMetadata[] {
        return this.sortableAttributes;
    }

    getFilterableAttributes(): readonly NamedAttributeMetadata[] {
        return this.filterableAttributes;
    }

    getActiveFilterableAttributes(): NamedAttributeMetadata[] | undefined {
        return this.activeFilterableAttributes;
    }

    setMultiTimeFrameSnapshot(snapshot: readonly TradingPairModel[]) {
        this.multiTimeFrameSnapshot = snapshot;
    }

    appendSignals(signalModels: readonly SignalModel[]) {
        signalModels.forEach(s=>this.signals.push(s));
    }

    getMultiTimeFrameSnapshot(): readonly TradingPairModel[] {
        return this.multiTimeFrameSnapshot;
    }

    getSortDirection(): SortDirection {
        return this.sortDirection;
    }

    getSortNamedAttributeMetadata(): NamedAttributeMetadata {
        if (this.sortNamedAttributeMetadata === undefined) {
            throw new Error('sortNamedAttributeMetadata not set');
        }
        return this.sortNamedAttributeMetadata;
    }

    setSortNamedAttributeMetadata(sortNamedAttributeMetadata: NamedAttributeMetadata): void {
        this.sortNamedAttributeMetadata = sortNamedAttributeMetadata;
    }

    setSortDirection(direction: SortDirection): void {
        this.sortDirection = direction;
    }

    setScreenerSettings(screenerSettings: ScreenerSettings): void {
        this.screenerSettings = screenerSettings;
    }

    getScreenerSettings(): ScreenerSettings | undefined {
        return this.screenerSettings;
    }

    getScreenerSettingsOrThrow(): ScreenerSettings {
        if (this.screenerSettings === undefined) {
            throw new Error('ScreenerSettings not defined');
        }
        return this.screenerSettings;
    }

    getSignals(): readonly SignalModel[] {
        return this.signals;
    }
}