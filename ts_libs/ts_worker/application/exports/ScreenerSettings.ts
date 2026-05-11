import { ExchangeInclusionCriteria } from "./settings/ExchangeInclusionCriteria";

export class ScreenerSettings {
  private _parallelRequestsCount: number;
  private _maximumPairsCountPerExchange: number;
  private _exchangeInclusionCriterias: ExchangeInclusionCriteria[];

  constructor(exchangeInclusionCriterias: ExchangeInclusionCriteria[]) {
    this._parallelRequestsCount = 5;
    this._maximumPairsCountPerExchange = 1000;
    this._exchangeInclusionCriterias = ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
  }

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
      if(element.include === true){
        toReturn.push(element.name);
      }
    }
    return toReturn;
  }
}