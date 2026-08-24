import { Period } from "../../domain/ta/core/Period";
import { BasePlugin } from "../../domain/ta/export/BasePlugin";
import { TimeFrame } from "../../domain/values/TimeFrame";
import { NamedAttributeMetadata } from "../exports/NamedAttribute";
import { BaseFilterableAttributeExtractor } from "./BaseFilterableAttributeExtractor";
import { BaseSortableAttributeExtractor } from "./BaseSortableAttributeExtractor";
import { RsiOverboughtFilter } from "./boolean_extractors/RsiOverboughtFilter";
import { RsiOversoldFilter } from "./boolean_extractors/RsiOversoldFilter";
import { SmaDowntrendFilter } from "./boolean_extractors/SmaDowntrendFilter";
import { SmaUptrendFilter } from "./boolean_extractors/SmaUptrendFilter";
import { CurrentPriceExtractor } from "./numeric_extractors/CurrentPriceExtractor";
import { DailyPendingRvaExtractor } from "./numeric_extractors/DailyPendingRvaExtractor";
import { DailyPriceChangeExtractor } from "./numeric_extractors/DailyPriceChangeExtractor";
import { DailyRvaExtractor } from "./numeric_extractors/DailyRvaExtractor";
import { ThirtyDayPercentChangeExtractor } from "./numeric_extractors/ThirtyDayPercentChangeExtractor";
import { DonchianRecoverySignalGenerator } from "./signal_generators/DonchianRecoverySignalGenerator";
import { HighVolumeDonchianCompressionSignalGenerator } from "./signal_generators/HighVolumeDonchianCompressionSignalGenerator";
import { HighVolumeInsideCompressedDonchian } from "./signal_generators/HighVolumeInsideCompressedDonchian";
import { PotentialRecoverySignalGenerator } from "./signal_generators/PotentialRecoverySignalGenerator";

export class PluginManager {
    private _plugins: readonly BasePlugin[];
    private _sortableAttributes: NamedAttributeMetadata[];
    private _filterableAttributes: NamedAttributeMetadata[];
    public constructor() {
        this._plugins = [...PluginManager.DefaultPlugins];
        this._filterableAttributes = [];
        this._sortableAttributes = [];
        this._plugins.forEach(plugin => {
            if (plugin instanceof BaseFilterableAttributeExtractor) {
                this._filterableAttributes.push(plugin.getNamedAttributeMetadata());
            }
            if (plugin instanceof BaseSortableAttributeExtractor) {
                this._sortableAttributes.push(plugin.getNamedAttributeMetadata());
            }
        });
    }
    public static readonly DailyPriceChangeExtractor: DailyPriceChangeExtractor = new DailyPriceChangeExtractor();
    public static readonly CurrentPriceExtractor: CurrentPriceExtractor = new CurrentPriceExtractor();
    public static readonly DefaultPlugins: readonly BasePlugin[] = [
        PluginManager.CurrentPriceExtractor,
        PluginManager.DailyPriceChangeExtractor,
        new DailyRvaExtractor(),
        new DailyPendingRvaExtractor(),
        new ThirtyDayPercentChangeExtractor(),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.ONE_DAY),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.FOUR_HOURS),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.ONE_HOUR),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.FIFTEEN_MINUTES),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.FIVE_MINUTES),
        new SmaUptrendFilter(Period.fromUnknown(200), TimeFrame.ONE_MINUTE),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.ONE_DAY),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.FOUR_HOURS),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.ONE_HOUR),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.FIFTEEN_MINUTES),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.FIVE_MINUTES),
        new SmaDowntrendFilter(Period.fromUnknown(200), TimeFrame.ONE_MINUTE),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.ONE_DAY, 5),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.FOUR_HOURS, 5),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.ONE_HOUR, 5),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.FIFTEEN_MINUTES, 5),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.FIVE_MINUTES, 5),
        new RsiOversoldFilter(Period.fromUnknown(2), TimeFrame.ONE_MINUTE, 5),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.ONE_DAY, 95),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.FOUR_HOURS, 95),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.ONE_HOUR, 95),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.FIFTEEN_MINUTES, 95),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.FIVE_MINUTES, 95),
        new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.ONE_MINUTE, 95),

        new RsiOversoldFilter(Period.fromUnknown(14), TimeFrame.ONE_HOUR, 30),
        new RsiOverboughtFilter(Period.fromUnknown(14), TimeFrame.ONE_HOUR, 70),

        new DonchianRecoverySignalGenerator()
        //new PotentialRecoverySignalGenerator(),
        //new HighVolumeInsideCompressedDonchian()
    ];

    get sortableAttributes(): readonly NamedAttributeMetadata[] {
        return this._sortableAttributes;
    }

    get filterableAttributes(): readonly NamedAttributeMetadata[] {
        return this._filterableAttributes;
    }


    get plugins(): readonly BasePlugin[] {
        return this._plugins;
    }
}