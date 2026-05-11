
import { NamedAttributeMetadata } from "../../ts_worker/application/exports/NamedAttribute";
import { ScreenerSettings } from "../../ts_worker/application/exports/ScreenerSettings";
import { SortDirection } from "../../ts_worker/application/exports/SortDirection";
import { TradingPairModel } from "../../ts_worker/application/exports/TradingPairModel";


export class MainModel {
    private multiTimeFrameSnapshot: readonly TradingPairModel[];
    //sortables
    private sortableAttributes: readonly NamedAttributeMetadata[];
    private sortDirection: SortDirection;
    private sortNamedAttributeMetadata: NamedAttributeMetadata;
    //filterables
    private filterableAttributes: readonly NamedAttributeMetadata[];
    private activeFilterableAttributes: NamedAttributeMetadata[] | undefined;
    private screenerSettings: ScreenerSettings | undefined;


    constructor() {
        this.multiTimeFrameSnapshot = [];
        this.sortableAttributes = [];
        this.filterableAttributes = [];
        this.sortDirection = SortDirection.Descending;
        this.sortNamedAttributeMetadata = TradingPairModel.dailyPercentChangeMetadata();
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

    getMultiTimeFrameSnapshot(): readonly TradingPairModel[] {
        return this.multiTimeFrameSnapshot;
    }

    getSortDirection(): SortDirection {
        return this.sortDirection;
    }

    getSortNamedAttributeMetadata(): NamedAttributeMetadata {
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
}