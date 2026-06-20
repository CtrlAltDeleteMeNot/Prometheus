import { Period } from "../../domain/ta/core/Period";
import { BasePlugin } from "../../domain/ta/export/BasePlugin";
import { TimeFrame } from "../../domain/values/TimeFrame";
import { BaseFilterableAttributeExtractor } from "../plugins/BaseFilterableAttributeExtractor";
import { BaseSortableAttributeExtractor } from "../plugins/BaseSortableAttributeExtractor";
import { RsiOverboughtFilter } from "../plugins/boolean_extractors/RsiOverboughtFilter";
import { RsiOversoldFilter } from "../plugins/boolean_extractors/RsiOversoldFilter";
import { SmaDowntrendFilter } from "../plugins/boolean_extractors/SmaDowntrendFilter";
import { SmaUptrendFilter } from "../plugins/boolean_extractors/SmaUptrendFilter";
import { CurrentPriceExtractor } from "../plugins/numeric_extractors/CurrentPriceExtractor";
import { DailyPendingRvaExtractor } from "../plugins/numeric_extractors/DailyPendingRvaExtractor";
import { DailyPriceChangeExtractor } from "../plugins/numeric_extractors/DailyPriceChangeExtractor";
import { DailyRvaExtractor } from "../plugins/numeric_extractors/DailyRvaExtractor";
import { ThirtyDayPercentChangeExtractor } from "../plugins/numeric_extractors/ThirtyDayPercentChangeExtractor";
import { NamedAttributeMetadata } from "./NamedAttribute";
import { ExchangeInclusionCriteria } from "./settings/ExchangeInclusionCriteria";

export class ScreenerSettings {
  private _parallelRequestsCount: number;
  private _maximumPairsCountPerExchange: number;
  private _exchangeInclusionCriterias: ExchangeInclusionCriteria[];
  private _plugins: readonly BasePlugin[];
  private _sortableAttributes: NamedAttributeMetadata[];
  private _filterableAttributes: NamedAttributeMetadata[];

  constructor(exchangeInclusionCriterias: ExchangeInclusionCriteria[]) {
    this._parallelRequestsCount = 5;
    this._maximumPairsCountPerExchange = 1000;
    this._exchangeInclusionCriterias = ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
    this._plugins = [...ScreenerSettings.DefaultPlugins];
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
    ScreenerSettings.CurrentPriceExtractor,
    ScreenerSettings.DailyPriceChangeExtractor,
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
    new RsiOverboughtFilter(Period.fromUnknown(2), TimeFrame.ONE_MINUTE, 95)
  ];

  // =====================
  // Getters / Setters
  // =====================

  get parallelRequestsCount(): number {
    return this._parallelRequestsCount;
  }

  set parallelRequestsCount(value: number) {
    if (typeof value !== 'number' || value < 1 || value > 20) {
      throw new Error('Invalid parallelRequestsCount');
    }
    this._parallelRequestsCount = value;
  }

  get maximumPairsCountPerExchange(): number {
    return this._maximumPairsCountPerExchange;
  }

  set maximumPairsCountPerExchange(value: number) {
    if (typeof value !== 'number' || value < 1 || value > 10000) {
      throw new Error('Invalid maximumPairsCountPerExchange');
    }
    this._maximumPairsCountPerExchange = value;
  }


  get exchangeInclusionCriterias(): ExchangeInclusionCriteria[] {
    return this._exchangeInclusionCriterias;
  }

  set exchangeInclusionCriterias(value: ExchangeInclusionCriteria[]) {
    this._exchangeInclusionCriterias =
      ScreenerSettings.validateExchangeInclusionCriterias(value);
  }

  get plugins(): readonly BasePlugin[] {
    return this._plugins;
  }

  get sortableAttributes(): readonly NamedAttributeMetadata[] {
    return this._sortableAttributes;
  }

  get filterableAttributes(): readonly NamedAttributeMetadata[] {
    return this._filterableAttributes;
  }

  // =====================
  // Factory
  // =====================

  static fromJson(json: any): ScreenerSettings {
    if (!Array.isArray(json.exchangeInclusionCriterias)) {
      throw new Error('exchangeInclusionCriterias must be an array');
    }

    const criterias = json.exchangeInclusionCriterias.map((c: any) =>
      ExchangeInclusionCriteria.fromJson(c)
    );

    const settings = new ScreenerSettings(criterias);

    settings.parallelRequestsCount = json.parallelRequestsCount;
    settings.maximumPairsCountPerExchange = json.maximumPairsCountPerExchange;

    return settings;
  }

  // =====================
  // Serialization
  // =====================

  toJson(): any {
    return {
      parallelRequestsCount: this.parallelRequestsCount,
      maximumPairsCountPerExchange: this.maximumPairsCountPerExchange,
      exchangeInclusionCriterias: this.exchangeInclusionCriterias.map(c => ({
        name: c.name,
        id: c.id,
        include: c.include
      }))
    };
  }

  // =====================
  // Validation
  // =====================

  private static validateExchangeInclusionCriterias(
    criterias: ExchangeInclusionCriteria[]
  ): ExchangeInclusionCriteria[] {
    if (!criterias || !Array.isArray(criterias)) {
      throw new Error("Exchange inclusion criterias cannot be null");
    }

    if (criterias.length === 0) {
      throw new Error("At least one exchange must be configured");
    }

    const hasAtLeastOne = criterias.some(c => c.include === true);

    if (!hasAtLeastOne) {
      throw new Error('At least one exchange must be selected');
    }

    return criterias;
  }

  // =====================
  // Deep Clone & Compare
  // =====================

  deepClone(): ScreenerSettings {
    const clonedCriterias = this.exchangeInclusionCriterias.map(c => c.deepClone());
    const newSettings = new ScreenerSettings(clonedCriterias);

    newSettings.parallelRequestsCount = this.parallelRequestsCount;
    newSettings.maximumPairsCountPerExchange = this.maximumPairsCountPerExchange;

    return newSettings;
  }

  deepEquals(other: ScreenerSettings | undefined): boolean {
    if (!other) return false;

    if (this.parallelRequestsCount !== other.parallelRequestsCount ||
      this.maximumPairsCountPerExchange !== other.maximumPairsCountPerExchange) {
      return false;
    }

    if (this.exchangeInclusionCriterias.length !== other.exchangeInclusionCriterias.length) {
      return false;
    }

    for (let i = 0; i < this.exchangeInclusionCriterias.length; i++) {
      if (!this.exchangeInclusionCriterias[i].deepEquals(other.exchangeInclusionCriterias[i])) {
        return false;
      }
    }

    return true;
  }

  //=========================
  //Utility methods
  //=========================
  public getIncludedExchangeNames(): string[] {
    let toReturn: string[] = [];
    for (let index = 0; index < this.exchangeInclusionCriterias.length; index++) {
      const element = this.exchangeInclusionCriterias[index];
      if (element.include === true) {
        toReturn.push(element.name);
      }
    }
    return toReturn;
  }
}