import { ISerializable } from "./ISerializable";
import { NamedAttributeMetadata, NamedAttributeMetadataDto } from "./NamedAttribute";
import { ExchangeInclusionCriteria, ExchangeInclusionCriteriaDto } from "./settings/ExchangeInclusionCriteria";
export type ScreenerSettingsDto = {
  parallelRequestsCount: number;
  maximumPairsCountPerExchange: number;
  exchangeInclusionCriterias: ExchangeInclusionCriteriaDto[];
  sortableAttributes: NamedAttributeMetadataDto[];
  filterableAttributes: NamedAttributeMetadataDto[];
}

export class ScreenerSettings implements ISerializable<ScreenerSettingsDto> {
  private _parallelRequestsCount: number;
  private _maximumPairsCountPerExchange: number;
  private _exchangeInclusionCriterias: ExchangeInclusionCriteria[];
  private _sortableAttributes: readonly NamedAttributeMetadata[];
  private _filterableAttributes: readonly NamedAttributeMetadata[];

  constructor(
    exchangeInclusionCriterias: ExchangeInclusionCriteria[],
    sortableAttributes: readonly NamedAttributeMetadata[],
    filterableAttributes: readonly NamedAttributeMetadata[]) {
    this._parallelRequestsCount = 5;
    this._maximumPairsCountPerExchange = 1000;
    this._exchangeInclusionCriterias = ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
    this._sortableAttributes = sortableAttributes;
    this._filterableAttributes = filterableAttributes;
  }

  serialize(): ScreenerSettingsDto {
    return {
      parallelRequestsCount: this.parallelRequestsCount,
      sortableAttributes: this.sortableAttributes.map(s => s.serialize()),
      filterableAttributes: this.filterableAttributes.map(s => s.serialize()),
      exchangeInclusionCriterias: this._exchangeInclusionCriterias.map(s => s.serialize()),
      maximumPairsCountPerExchange: this.maximumPairsCountPerExchange
    };
  }

  public static deserialize(dto: ScreenerSettingsDto): ScreenerSettings {
    const criterias = dto.exchangeInclusionCriterias.map(c =>
      ExchangeInclusionCriteria.deserialize(c)
    );

    const sortableAttributes = dto.sortableAttributes.map(a =>
      NamedAttributeMetadata.deserialize(a)
    );

    const filterableAttributes = dto.filterableAttributes.map(a =>
      NamedAttributeMetadata.deserialize(a)
    );

    const settings = new ScreenerSettings(
      criterias,
      sortableAttributes,
      filterableAttributes
    );

    settings.parallelRequestsCount = dto.parallelRequestsCount;
    settings.maximumPairsCountPerExchange = dto.maximumPairsCountPerExchange;

    return settings;
  }

  // =====================
  // Getters / Setters
  // =====================

  get parallelRequestsCount(): number {
    return this._parallelRequestsCount;
  }

  set parallelRequestsCount(value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 20) {
      throw new Error('Invalid parallelRequestsCount');
    }
    this._parallelRequestsCount = value;
  }

  get maximumPairsCountPerExchange(): number {
    return this._maximumPairsCountPerExchange;
  }

  set maximumPairsCountPerExchange(value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 2000) {
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

  get sortableAttributes(): readonly NamedAttributeMetadata[] {
    return this._sortableAttributes;
  }

  get filterableAttributes(): readonly NamedAttributeMetadata[] {
    return this._filterableAttributes;
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
    return ScreenerSettings.deserialize(this.serialize());
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

  //==========================
  //Persistence methods
  //==========================
  private static MAX_PARALLEL_REQUESTS_COUNT_KEY = "v1.parallel.request.count";
  private static MAX_PAIRS_PER_EXCHANGE_KEY = "v1.max.pairs.per.exchange"
  private static INCLUDE_EXCHANGE_KEY = "v1.include.exchange"
  public persist() {
    this.exchangeInclusionCriterias.forEach(element => {
      localStorage.setItem(`${ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`, element.include.toString());
    });
    localStorage.setItem(ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY, this.parallelRequestsCount.toString());
    localStorage.setItem(ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY, this.maximumPairsCountPerExchange.toString());
  }

  public reconcile() {
    this.exchangeInclusionCriterias.forEach(element => {
      const includeStr = localStorage.getItem(`${ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`);
      element.include = includeStr !== "false"; //only if explicitly denied by user
    });
    this.parallelRequestsCount = ScreenerSettings.readIntFromLocalStorage(
      ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY,
      5,
      1,
      20
    );

    this.maximumPairsCountPerExchange = ScreenerSettings.readIntFromLocalStorage(
      ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY,
      1000,
      1,
      2000
    );
  }

  private static readIntFromLocalStorage(
    key: string,
    fallback: number,
    min: number,
    max: number
  ): number {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    const parsed = Number.parseInt(raw, 10);

    if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
      return fallback;
    }

    return parsed;
  }
}