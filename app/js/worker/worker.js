"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ts_libs/ts_worker/application/exports/NamedAttribute.ts
  var NamedAttributeMetadata, NumericNamedAttribute, BooleanNamedAttribute, StringNamedAttribute, NamedAttributeFactory;
  var init_NamedAttribute = __esm({
    "ts_libs/ts_worker/application/exports/NamedAttribute.ts"() {
      "use strict";
      NamedAttributeMetadata = class _NamedAttributeMetadata {
        constructor(key, label, type, precision) {
          this.key = key;
          this.label = label;
          this.type = type;
          this.precision = precision;
        }
        serialize() {
          return {
            key: this.key,
            label: this.label,
            type: this.type,
            precision: this.precision
          };
        }
        static deserialize(dto) {
          return new _NamedAttributeMetadata(
            dto.key,
            dto.label,
            dto.type,
            dto.precision
          );
        }
      };
      NumericNamedAttribute = class _NumericNamedAttribute {
        constructor(key, label, value, precision) {
          this.metadata = new NamedAttributeMetadata(key, label, "number", precision);
          if (value !== void 0 && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
          }
          if (precision !== void 0 && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
          }
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type,
              precision: this.metadata.precision
            },
            value: this.value
          };
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "number") {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
          }
          return new _NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argMetadata.precision);
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return a - b;
        }
        toString() {
          if (this.value === void 0) return "";
          return this.metadata.precision === void 0 ? this.value.toString() : this.value.toFixed(this.metadata.precision);
        }
      };
      BooleanNamedAttribute = class _BooleanNamedAttribute {
        constructor(key, label, value) {
          this.metadata = new NamedAttributeMetadata(key, label, "boolean");
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type
            },
            value: this.value
          };
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return Number(a) - Number(b);
        }
        toString() {
          return this.value === void 0 ? "" : this.value ? "true" : "false";
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "boolean") {
            throw new Error("BooleanNamedAttribute requires a valid metadata type");
          }
          return new _BooleanNamedAttribute(argMetadata.key, argMetadata.label, argValue);
        }
      };
      StringNamedAttribute = class _StringNamedAttribute {
        constructor(key, label, value) {
          this.metadata = new NamedAttributeMetadata(key, label, "string");
          if (value !== void 0 && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
          }
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type
            },
            value: this.value
          };
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "string") {
            throw new Error("StringNamedAttribute requires a valid metadata type");
          }
          return new _StringNamedAttribute(
            argMetadata.key,
            argMetadata.label,
            argValue
          );
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return a.localeCompare(b);
        }
        toString() {
          var _a;
          return (_a = this.value) != null ? _a : "";
        }
      };
      NamedAttributeFactory = class {
        static deserialize(dto) {
          const metadata = NamedAttributeMetadata.deserialize(dto.metadata);
          switch (metadata.type) {
            case "number":
              return NumericNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : this.asNumber(dto.value)
              );
            case "boolean":
              return BooleanNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : this.asBoolean(dto.value)
              );
            case "string":
              return StringNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : String(dto.value)
              );
            default:
              throw new Error(`Unsupported named attribute type: ${metadata.type}`);
          }
        }
        static asBoolean(value) {
          if (value === void 0) return void 0;
          if (typeof value !== "boolean") {
            throw new Error("Boolean attribute value must be boolean");
          }
          return value;
        }
        static asNumber(value) {
          if (value === void 0) return void 0;
          if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error("Numeric attribute value must be finite number");
          }
          return value;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/settings/ExchangeInclusionCriteria.ts
  var ExchangeInclusionCriteria;
  var init_ExchangeInclusionCriteria = __esm({
    "ts_libs/ts_worker/application/exports/settings/ExchangeInclusionCriteria.ts"() {
      "use strict";
      ExchangeInclusionCriteria = class _ExchangeInclusionCriteria {
        constructor(name, id, include) {
          this.name = name;
          this.id = id;
          this.include = include;
        }
        serialize() {
          return {
            name: this.name,
            id: this.id,
            include: this.include
          };
        }
        static deserialize(dto) {
          if (typeof dto.name !== "string") {
            throw new Error("Invalid name");
          }
          if (typeof dto.id !== "number") {
            throw new Error("Invalid id");
          }
          if (typeof dto.include !== "boolean") {
            throw new Error("Invalid include flag");
          }
          return new _ExchangeInclusionCriteria(
            dto.name,
            dto.id,
            dto.include
          );
        }
        deepEquals(other) {
          if (!other) return false;
          return this.name === other.name && this.id === other.id && this.include === other.include;
        }
        deepClone() {
          return new _ExchangeInclusionCriteria(this.name, this.id, this.include);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/ScreenerSettings.ts
  var _ScreenerSettings, ScreenerSettings;
  var init_ScreenerSettings = __esm({
    "ts_libs/ts_worker/application/exports/ScreenerSettings.ts"() {
      "use strict";
      init_NamedAttribute();
      init_ExchangeInclusionCriteria();
      _ScreenerSettings = class _ScreenerSettings {
        constructor(exchangeInclusionCriterias, sortableAttributes, filterableAttributes) {
          this._parallelRequestsCount = 5;
          this._maximumPairsCountPerExchange = 1e3;
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
          this._sortableAttributes = sortableAttributes;
          this._filterableAttributes = filterableAttributes;
        }
        serialize() {
          return {
            parallelRequestsCount: this.parallelRequestsCount,
            sortableAttributes: this.sortableAttributes.map((s) => s.serialize()),
            filterableAttributes: this.filterableAttributes.map((s) => s.serialize()),
            exchangeInclusionCriterias: this._exchangeInclusionCriterias.map((s) => s.serialize()),
            maximumPairsCountPerExchange: this.maximumPairsCountPerExchange
          };
        }
        static deserialize(dto) {
          const criterias = dto.exchangeInclusionCriterias.map(
            (c) => ExchangeInclusionCriteria.deserialize(c)
          );
          const sortableAttributes = dto.sortableAttributes.map(
            (a) => NamedAttributeMetadata.deserialize(a)
          );
          const filterableAttributes = dto.filterableAttributes.map(
            (a) => NamedAttributeMetadata.deserialize(a)
          );
          const settings = new _ScreenerSettings(
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
        get parallelRequestsCount() {
          return this._parallelRequestsCount;
        }
        set parallelRequestsCount(value) {
          if (!Number.isInteger(value) || value < 1 || value > 20) {
            throw new Error("Invalid parallelRequestsCount");
          }
          this._parallelRequestsCount = value;
        }
        get maximumPairsCountPerExchange() {
          return this._maximumPairsCountPerExchange;
        }
        set maximumPairsCountPerExchange(value) {
          if (!Number.isInteger(value) || value < 1 || value > 2e3) {
            throw new Error("Invalid maximumPairsCountPerExchange");
          }
          this._maximumPairsCountPerExchange = value;
        }
        get exchangeInclusionCriterias() {
          return this._exchangeInclusionCriterias;
        }
        set exchangeInclusionCriterias(value) {
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(value);
        }
        get sortableAttributes() {
          return this._sortableAttributes;
        }
        get filterableAttributes() {
          return this._filterableAttributes;
        }
        // =====================
        // Validation
        // =====================
        static validateExchangeInclusionCriterias(criterias) {
          if (!criterias || !Array.isArray(criterias)) {
            throw new Error("Exchange inclusion criterias cannot be null");
          }
          if (criterias.length === 0) {
            throw new Error("At least one exchange must be configured");
          }
          const hasAtLeastOne = criterias.some((c) => c.include === true);
          if (!hasAtLeastOne) {
            throw new Error("At least one exchange must be selected");
          }
          return criterias;
        }
        // =====================
        // Deep Clone & Compare
        // =====================
        deepClone() {
          return _ScreenerSettings.deserialize(this.serialize());
        }
        deepEquals(other) {
          if (!other) return false;
          if (this.parallelRequestsCount !== other.parallelRequestsCount || this.maximumPairsCountPerExchange !== other.maximumPairsCountPerExchange) {
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
        getIncludedExchangeNames() {
          let toReturn = [];
          for (let index = 0; index < this.exchangeInclusionCriterias.length; index++) {
            const element = this.exchangeInclusionCriterias[index];
            if (element.include === true) {
              toReturn.push(element.name);
            }
          }
          return toReturn;
        }
        persist() {
          this.exchangeInclusionCriterias.forEach((element) => {
            localStorage.setItem(`${_ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`, element.include.toString());
          });
          localStorage.setItem(_ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY, this.parallelRequestsCount.toString());
          localStorage.setItem(_ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY, this.maximumPairsCountPerExchange.toString());
        }
        reconcile() {
          this.exchangeInclusionCriterias.forEach((element) => {
            const includeStr = localStorage.getItem(`${_ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`);
            element.include = includeStr !== "false";
          });
          this.parallelRequestsCount = _ScreenerSettings.readIntFromLocalStorage(
            _ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY,
            5,
            1,
            20
          );
          this.maximumPairsCountPerExchange = _ScreenerSettings.readIntFromLocalStorage(
            _ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY,
            1e3,
            1,
            2e3
          );
        }
        static readIntFromLocalStorage(key, fallback, min, max) {
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
      };
      //==========================
      //Persistence methods
      //==========================
      _ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY = "v1.parallel.request.count";
      _ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY = "v1.max.pairs.per.exchange";
      _ScreenerSettings.INCLUDE_EXCHANGE_KEY = "v1.include.exchange";
      ScreenerSettings = _ScreenerSettings;
    }
  });

  // ts_libs/ts_worker/application/exports/SignalModel.ts
  var SignalModel;
  var init_SignalModel = __esm({
    "ts_libs/ts_worker/application/exports/SignalModel.ts"() {
      "use strict";
      SignalModel = class _SignalModel {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, exchangeUrl, description, direction, timestamp, entryPrice, stopLossPrice, takeProfitLevels) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.exchangeUrl = exchangeUrl;
          this.description = description;
          this.direction = direction;
          this.timestamp = timestamp;
          this.entryPrice = entryPrice;
          this.stopLossPrice = stopLossPrice;
          this.takeProfitLevels = takeProfitLevels;
        }
        serialize() {
          return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeId: this.exchangeId,
            exchangeName: this.exchangeName,
            exchangeUrl: this.exchangeUrl,
            description: this.description,
            direction: this.direction,
            timestamp: this.timestamp,
            entryPrice: this.entryPrice,
            stopLossPrice: this.stopLossPrice,
            takeProfitLevels: this.takeProfitLevels
          };
        }
        static deserialize(dto) {
          return new _SignalModel(
            dto.baseAsset,
            dto.quoteAsset,
            dto.exchangeName,
            dto.exchangeId,
            dto.exchangeUrl,
            dto.description,
            dto.direction,
            dto.timestamp,
            dto.entryPrice,
            dto.stopLossPrice,
            dto.takeProfitLevels
          );
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairModel.ts
  var TradingPairModel;
  var init_TradingPairModel = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairModel.ts"() {
      "use strict";
      init_NamedAttribute();
      TradingPairModel = class _TradingPairModel {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, exchangeUrl, attributes = []) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.exchangeUrl = exchangeUrl;
          this.extended = [...attributes];
        }
        serialize() {
          return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeName: this.exchangeName,
            exchangeId: this.exchangeId,
            exchangeUrl: this.exchangeUrl,
            attributes: this.extended.map((attr) => attr.serialize())
          };
        }
        static deserialize(tradingPairModelDto) {
          const attributes = tradingPairModelDto.attributes.map(
            (attr) => NamedAttributeFactory.deserialize(attr)
          );
          const model = new _TradingPairModel(
            tradingPairModelDto.baseAsset,
            tradingPairModelDto.quoteAsset,
            tradingPairModelDto.exchangeName,
            tradingPairModelDto.exchangeId,
            tradingPairModelDto.exchangeUrl,
            attributes
          );
          return model;
        }
        // ------------------------
        // Typed attribute access
        // ------------------------
        addAttr(attr) {
          this.extended.push(attr);
        }
        getAttr(key) {
          return this.extended.find((a) => a.metadata.key === key);
        }
        getAttrValue(key, fallback) {
          var _a, _b;
          return (_b = (_a = this.getAttr(key)) == null ? void 0 : _a.value) != null ? _b : fallback;
        }
        hasAttr(key) {
          return this.extended.some((a) => a.metadata.key === key);
        }
        getAttributes() {
          return this.extended;
        }
        getNumericAttributes() {
          return this.extended.filter((e) => e instanceof NumericNamedAttribute) || [];
        }
        getBooleanAttributes() {
          return this.extended.filter((e) => e instanceof BooleanNamedAttribute) || [];
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/SynchronizationModel.ts
  var SynchronizationModel;
  var init_SynchronizationModel = __esm({
    "ts_libs/ts_worker/application/exports/SynchronizationModel.ts"() {
      "use strict";
      init_SignalModel();
      init_TradingPairModel();
      SynchronizationModel = class _SynchronizationModel {
        constructor(tradingPairs = [], signals = []) {
          this.tradingPairs = tradingPairs;
          this.signals = signals;
        }
        serialize() {
          return {
            tradingPairs: this.tradingPairs.map((tp) => tp.serialize()),
            signals: this.signals.map((signal) => signal.serialize())
          };
        }
        static deserialize(dto) {
          return new _SynchronizationModel(
            dto.tradingPairs.map((tp) => TradingPairModel.deserialize(tp)),
            dto.signals.map((signal) => SignalModel.deserialize(signal))
          );
        }
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest.ts
  var EnumerateExchangesRequest;
  var init_EnumerateExchangesRequest = __esm({
    "ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesRequest.ts"() {
      "use strict";
      EnumerateExchangesRequest = class {
        constructor(includes) {
          this.includes = includes;
          Object.freeze(this);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest.ts
  var _tradingPairs, _candlesPerTimeFrame, _parallelRequestsCount, _utcNowMs, _plugins, _fetchOhlcvProgressCallback, _executePluginProgressCallback, FetchOhlcvDataRequest;
  var init_FetchOhlcvDataRequest = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest.ts"() {
      "use strict";
      FetchOhlcvDataRequest = class {
        constructor(tradingPairs, candlesPerTimeFrame, parallelRequestsCount, utcNowMs, plugins, fetchOhlcvProgressCallback, executePluginProgressCallback) {
          __privateAdd(this, _tradingPairs);
          __privateAdd(this, _candlesPerTimeFrame);
          __privateAdd(this, _parallelRequestsCount);
          __privateAdd(this, _utcNowMs);
          __privateAdd(this, _plugins);
          __privateAdd(this, _fetchOhlcvProgressCallback);
          __privateAdd(this, _executePluginProgressCallback);
          __privateSet(this, _tradingPairs, Object.freeze([...tradingPairs]));
          __privateSet(this, _candlesPerTimeFrame, candlesPerTimeFrame);
          __privateSet(this, _parallelRequestsCount, parallelRequestsCount);
          __privateSet(this, _utcNowMs, utcNowMs);
          __privateSet(this, _plugins, plugins);
          __privateSet(this, _fetchOhlcvProgressCallback, fetchOhlcvProgressCallback);
          __privateSet(this, _executePluginProgressCallback, executePluginProgressCallback);
        }
        reportFetchOhlcvProgress(progress) {
          __privateGet(this, _fetchOhlcvProgressCallback).call(this, progress);
        }
        reportExecutePluginProgress(progress) {
          __privateGet(this, _executePluginProgressCallback).call(this, progress);
        }
        getUtcNowMilliseconds() {
          return __privateGet(this, _utcNowMs);
        }
        getCandlesPerTimeFrame() {
          return __privateGet(this, _candlesPerTimeFrame);
        }
        getTradingPairs() {
          return __privateGet(this, _tradingPairs);
        }
        getParallelRequestsCount() {
          return __privateGet(this, _parallelRequestsCount);
        }
        getPlugins() {
          return __privateGet(this, _plugins);
        }
      };
      _tradingPairs = new WeakMap();
      _candlesPerTimeFrame = new WeakMap();
      _parallelRequestsCount = new WeakMap();
      _utcNowMs = new WeakMap();
      _plugins = new WeakMap();
      _fetchOhlcvProgressCallback = new WeakMap();
      _executePluginProgressCallback = new WeakMap();
    }
  });

  // ts_libs/ts_worker/domain/exchange/ExchangeDescriptor.ts
  var _id, _name, _ExchangeDescriptor, ExchangeDescriptor;
  var init_ExchangeDescriptor = __esm({
    "ts_libs/ts_worker/domain/exchange/ExchangeDescriptor.ts"() {
      "use strict";
      _ExchangeDescriptor = class _ExchangeDescriptor {
        /**
         * Create a new ExchangeDescriptor.
         * @param id - integer ID
         * @param name - non-empty string
         */
        constructor(id, name) {
          // Private fields
          __privateAdd(this, _id);
          __privateAdd(this, _name);
          if (!Number.isInteger(id)) {
            throw new TypeError("id must be an integer");
          }
          if (typeof name !== "string" || name.length === 0) {
            throw new TypeError("name must be a non-empty string");
          }
          __privateSet(this, _id, id);
          __privateSet(this, _name, name);
          Object.freeze(this);
        }
        /** ============================
         * Public getters
         * ============================ */
        getId() {
          return __privateGet(this, _id);
        }
        getName() {
          return __privateGet(this, _name);
        }
        static fromUnknown(value) {
          if (!(value instanceof _ExchangeDescriptor)) {
            throw new TypeError("Expected ExchangeDescriptor");
          }
          return value;
        }
      };
      _id = new WeakMap();
      _name = new WeakMap();
      ExchangeDescriptor = _ExchangeDescriptor;
    }
  });

  // ts_libs/ts_worker/domain/values/Asset.ts
  var Asset;
  var init_Asset = __esm({
    "ts_libs/ts_worker/domain/values/Asset.ts"() {
      "use strict";
      Asset = class _Asset {
        /**
         * @param symbol - asset symbol (non-empty, trimmed string)
         */
        constructor(symbol) {
          if (symbol.trim() === "") {
            throw new TypeError("Asset symbol must be a non-empty string");
          }
          this.symbol = symbol.trim().toUpperCase();
          Object.freeze(this);
        }
        /**
         * Value equality check.
         * @param other another Asset
         */
        equals(other) {
          return this.symbol === other.symbol;
        }
        toString() {
          return this.symbol;
        }
        /**
         * Runtime-safe factory: validate unknown input
         * @param value unknown input (any type)
         * @returns Asset
         * @throws TypeError if value is not an Asset
         */
        static fromUnknown(value) {
          if (value instanceof _Asset) {
            return value;
          }
          if (typeof value === "string") {
            return new _Asset(value);
          }
          throw new TypeError(
            `Cannot create Asset from value: ${String(value)}`
          );
        }
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest.ts
  var _exchanges, _quoteAssets, _requiredQuoteAssets, _excludedBaseAssets, _limit, FilterTradingPairsRequest;
  var init_FilterTradingPairsRequest = __esm({
    "ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsRequest.ts"() {
      "use strict";
      init_ExchangeDescriptor();
      init_Asset();
      FilterTradingPairsRequest = class {
        constructor(exchanges = [], quoteAssets = [], requiredQuoteAssets = [], excludedBaseAssets = [], limit = void 0) {
          __privateAdd(this, _exchanges);
          __privateAdd(this, _quoteAssets);
          __privateAdd(this, _requiredQuoteAssets);
          __privateAdd(this, _excludedBaseAssets);
          __privateAdd(this, _limit);
          __privateSet(this, _exchanges, Object.freeze(
            exchanges.map((ex) => ExchangeDescriptor.fromUnknown(ex))
          ));
          __privateSet(this, _quoteAssets, Object.freeze(
            quoteAssets.map((a) => Asset.fromUnknown(a))
          ));
          __privateSet(this, _requiredQuoteAssets, Object.freeze(
            requiredQuoteAssets.map((a) => Asset.fromUnknown(a))
          ));
          __privateSet(this, _excludedBaseAssets, Object.freeze(
            excludedBaseAssets.map((a) => Asset.fromUnknown(a))
          ));
          __privateSet(this, _limit, limit !== void 0 && limit > 0 ? limit : void 0);
          Object.freeze(this);
        }
        /** Exchanges to include */
        getExchanges() {
          return [...__privateGet(this, _exchanges)];
        }
        /** Quote assets to include (ANY match) */
        getQuoteAssets() {
          return [...__privateGet(this, _quoteAssets)];
        }
        /** Quote assets that MUST ALL exist for a base asset */
        getRequiredQuoteAssets() {
          return [...__privateGet(this, _requiredQuoteAssets)];
        }
        /** Base assets to exclude */
        getExcludedBaseAssets() {
          return [...__privateGet(this, _excludedBaseAssets)];
        }
        /** Whether full quote coverage is required */
        requiresFullQuoteCoverage() {
          return __privateGet(this, _requiredQuoteAssets).length > 0;
        }
        /** Wheter to limit output sizes or not */
        getLimit() {
          return __privateGet(this, _limit);
        }
      };
      _exchanges = new WeakMap();
      _quoteAssets = new WeakMap();
      _requiredQuoteAssets = new WeakMap();
      _excludedBaseAssets = new WeakMap();
      _limit = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsRequest.ts
  var _plugins2, _tradingPairs2, RegisterPluginsRequest;
  var init_RegisterPluginsRequest = __esm({
    "ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsRequest.ts"() {
      "use strict";
      RegisterPluginsRequest = class {
        constructor(plugins, tradingPairs) {
          __privateAdd(this, _plugins2);
          __privateAdd(this, _tradingPairs2);
          __privateSet(this, _plugins2, plugins);
          __privateSet(this, _tradingPairs2, tradingPairs);
          Object.freeze(this);
        }
        get plugins() {
          return __privateGet(this, _plugins2);
        }
        get tradingPairs() {
          return __privateGet(this, _tradingPairs2);
        }
      };
      _plugins2 = new WeakMap();
      _tradingPairs2 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest.ts
  var _paralelRequestsCount, _utcNowMs2, _syncFetchOhlcvProgressCallback, _syncExecutePluginsProgressCallback, _plugins3, SyncOhlcvDataRequest;
  var init_SyncOhlcvDataRequest = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest.ts"() {
      "use strict";
      SyncOhlcvDataRequest = class {
        constructor(plugins, paralelRequestsCount, utcNowMs, syncFetchOhlcvProgressCallback, syncExecutePluginsProgressCallback) {
          __privateAdd(this, _paralelRequestsCount);
          __privateAdd(this, _utcNowMs2);
          __privateAdd(this, _syncFetchOhlcvProgressCallback);
          __privateAdd(this, _syncExecutePluginsProgressCallback);
          __privateAdd(this, _plugins3);
          if (paralelRequestsCount <= 0) throw new RangeError("paralelRequestsCount must be > 0");
          __privateSet(this, _plugins3, plugins);
          __privateSet(this, _paralelRequestsCount, paralelRequestsCount);
          __privateSet(this, _utcNowMs2, utcNowMs);
          __privateSet(this, _syncFetchOhlcvProgressCallback, syncFetchOhlcvProgressCallback);
          __privateSet(this, _syncExecutePluginsProgressCallback, syncExecutePluginsProgressCallback);
          Object.freeze(this);
        }
        reportFetchProgress(progressData) {
          __privateGet(this, _syncFetchOhlcvProgressCallback).call(this, progressData);
        }
        reportExecutePluginsProgress(progressData) {
          __privateGet(this, _syncExecutePluginsProgressCallback).call(this, progressData);
        }
        getUtcNowMilliseconds() {
          return __privateGet(this, _utcNowMs2);
        }
        getParalelRequestsCount() {
          return __privateGet(this, _paralelRequestsCount);
        }
        getPlugins() {
          return __privateGet(this, _plugins3);
        }
      };
      _paralelRequestsCount = new WeakMap();
      _utcNowMs2 = new WeakMap();
      _syncFetchOhlcvProgressCallback = new WeakMap();
      _syncExecutePluginsProgressCallback = new WeakMap();
      _plugins3 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/domain/entities/TradingPair.ts
  var _baseAsset, _quoteAsset, _exchangeDescriptor, _TradingPair, TradingPair;
  var init_TradingPair = __esm({
    "ts_libs/ts_worker/domain/entities/TradingPair.ts"() {
      "use strict";
      init_ExchangeDescriptor();
      init_Asset();
      _TradingPair = class _TradingPair {
        /**
         * @param exchangeDescriptor - ExchangeDescriptor
         * @param baseAsset - Base asset
         * @param quoteAsset - Quote asset
         */
        constructor(exchangeDescriptor, baseAsset, quoteAsset) {
          // Private fields
          __privateAdd(this, _baseAsset);
          __privateAdd(this, _quoteAsset);
          __privateAdd(this, _exchangeDescriptor);
          __privateSet(this, _exchangeDescriptor, ExchangeDescriptor.fromUnknown(exchangeDescriptor));
          __privateSet(this, _baseAsset, Asset.fromUnknown(baseAsset));
          __privateSet(this, _quoteAsset, Asset.fromUnknown(quoteAsset));
          Object.freeze(this);
        }
        /** Returns the base asset */
        getBaseAsset() {
          return __privateGet(this, _baseAsset);
        }
        /** Returns the quote asset */
        getQuoteAsset() {
          return __privateGet(this, _quoteAsset);
        }
        /** Returns the symbol concatenation (e.g., BTCUSDT) */
        symbol() {
          return __privateGet(this, _baseAsset).toString() + __privateGet(this, _quoteAsset).toString();
        }
        /** Returns a unique ID string for this trading pair */
        getId() {
          return `${__privateGet(this, _baseAsset).toString()} ${__privateGet(this, _quoteAsset).toString()} ${__privateGet(this, _exchangeDescriptor).getName()} ${__privateGet(this, _exchangeDescriptor).getId()}`;
        }
        /** Returns the ExchangeDescriptor associated with this pair */
        getExchangeDescriptor() {
          return __privateGet(this, _exchangeDescriptor);
        }
        /**
         * Runtime validation: ensures the object is a TradingPair
         * @param aTradingPair - object to validate
         */
        static fromUnknown(aTradingPair) {
          if (!(aTradingPair instanceof _TradingPair)) {
            throw new TypeError("aTradingPair must be an instance of TradingPair");
          }
          return aTradingPair;
        }
      };
      _baseAsset = new WeakMap();
      _quoteAsset = new WeakMap();
      _exchangeDescriptor = new WeakMap();
      TradingPair = _TradingPair;
    }
  });

  // ts_libs/ts_worker/domain/exchange/ExchangeDescriptorRegistry.ts
  var ExchangeDescriptorRegistry;
  var init_ExchangeDescriptorRegistry = __esm({
    "ts_libs/ts_worker/domain/exchange/ExchangeDescriptorRegistry.ts"() {
      "use strict";
      init_ExchangeDescriptor();
      ExchangeDescriptorRegistry = class {
        constructor() {
          this.exchanges = /* @__PURE__ */ new Map();
        }
        /**
         * Register a new exchange descriptor
         * @param descriptor ExchangeDescriptor instance
         * @returns The registered descriptor
         */
        register(descriptor) {
          if (!(descriptor instanceof ExchangeDescriptor)) {
            throw new TypeError("Must be ExchangeDescriptor");
          }
          this.exchanges.set(descriptor.getId(), descriptor);
          return descriptor;
        }
        /**
         * Find exchange descriptor by id
         * @param id numeric id of the exchange
         */
        byId(id) {
          const ex = this.exchanges.get(id);
          if (!ex) throw new RangeError(`Exchange id=${id} not found`);
          return ex;
        }
        /**
         * Find exchange descriptor by name (case-insensitive)
         * @param name exchange name
         */
        byName(name) {
          for (const ex of this.exchanges.values()) {
            if (ex.getName().toLowerCase() === name.toLowerCase()) return ex;
          }
          throw new RangeError(`Exchange name="${name}" not found`);
        }
        /**
         * Return all registered exchanges
         */
        all() {
          return Array.from(this.exchanges.values());
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/exchange/ExchangeMethodsRegistry.ts
  var ExchangeMethodsRegistry;
  var init_ExchangeMethodsRegistry = __esm({
    "ts_libs/ts_worker/domain/exchange/ExchangeMethodsRegistry.ts"() {
      "use strict";
      ExchangeMethodsRegistry = class {
        constructor() {
          this.map = /* @__PURE__ */ new Map();
        }
        /**
         * Register exchange methods for a specific exchange.
         * @param exchangeDescriptor - descriptor of the exchange
         * @param methods - implementation of exchange methods
         */
        register(exchangeDescriptor, methods) {
          this.map.set(exchangeDescriptor.getId(), methods);
        }
        /**
         * Get exchange methods for a specific exchange.
         * @param exchangeDescriptor - descriptor of the exchange
         * @returns registered exchange methods
         * @throws Error if no methods registered for this exchange
         */
        get(exchangeDescriptor) {
          const methods = this.map.get(exchangeDescriptor.getId());
          if (!methods) {
            throw new Error(
              `No ExchangeMethods registered for exchangeId=${exchangeDescriptor.getId()}`
            );
          }
          return methods;
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/repositories/TradingPairsRepository.ts
  var TradingPairsRepository;
  var init_TradingPairsRepository = __esm({
    "ts_libs/ts_worker/domain/repositories/TradingPairsRepository.ts"() {
      "use strict";
      init_TradingPair();
      init_ExchangeDescriptor();
      init_Asset();
      TradingPairsRepository = class {
        constructor() {
          this.pairs = [];
        }
        /* ============================
         * Public Instance Methods
         * ============================ */
        /** Check if repository is empty */
        isEmpty() {
          return this.pairs.length === 0;
        }
        /**
         * Filter trading pairs by exchanges and quote assets
         * @param exchanges - Array of ExchangeDescriptor
         * @param quoteAssets - Array of quote asset symbols
         * @returns Array of TradingPair
         */
        filter(exchanges, quoteAssets) {
          const givenExchangeIds = new Set(
            exchanges.map((e) => ExchangeDescriptor.fromUnknown(e).getId())
          );
          const givenAssets = new Set(
            quoteAssets.map((e) => Asset.fromUnknown(e).toString())
          );
          return this.pairs.filter(
            (p) => givenExchangeIds.has(p.getExchangeDescriptor().getId()) && givenAssets.has(p.getQuoteAsset().toString())
          );
        }
        /**
         * Lookup a TradingPair by exchange + base + quote
         * @param exchangeDescriptor
         * @param baseAsset
         * @param quoteAsset
         * @returns TradingPair
         */
        lookup(exchangeDescriptor, baseAsset, quoteAsset) {
          const base = Asset.fromUnknown(baseAsset);
          const quote = Asset.fromUnknown(quoteAsset);
          const exchangeId = ExchangeDescriptor.fromUnknown(exchangeDescriptor).getId();
          const toReturn = this.pairs.find(
            (p) => p.getExchangeDescriptor().getId() === exchangeId && p.getBaseAsset().equals(base) && p.getQuoteAsset().equals(quote)
          );
          if (!toReturn) {
            throw new Error(
              `Pair ${baseAsset.toString()}/${quoteAsset.toString()} was not found on ${exchangeDescriptor.getName()}`
            );
          }
          return TradingPair.fromUnknown(toReturn);
        }
        /**
         * Check if a trading pair is available
         * @param exchangeDescriptor
         * @param baseAsset
         * @param quoteAsset
         */
        isTradingPairAvailable(exchangeDescriptor, baseAsset, quoteAsset) {
          const base = Asset.fromUnknown(baseAsset);
          const quote = Asset.fromUnknown(quoteAsset);
          const exchangeId = ExchangeDescriptor.fromUnknown(exchangeDescriptor).getId();
          const match = this.pairs.find(
            (p) => p.getExchangeDescriptor().getId() === exchangeId && p.getBaseAsset().equals(base) && p.getQuoteAsset().equals(quote)
          );
          if (!match) {
            return false;
          }
          const _ = TradingPair.fromUnknown(match);
          return true;
        }
        /** Get a copy of all registered trading pairs */
        getPairs() {
          return this.pairs;
        }
        /** Register a new trading pair */
        registerPair(tradingPair) {
          this.pairs.push(TradingPair.fromUnknown(tradingPair));
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/TechnicalAnalisysRepository.ts
  var TechnicalAnalisysRepository;
  var init_TechnicalAnalisysRepository = __esm({
    "ts_libs/ts_worker/domain/ta/TechnicalAnalisysRepository.ts"() {
      "use strict";
      TechnicalAnalisysRepository = class {
        constructor() {
          this.indicators = /* @__PURE__ */ new Map();
          this.datasets = /* @__PURE__ */ new Map();
          this.indicatorParameters = [];
        }
        pushUpdate(tradingPair, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          const dataset = this.getDataset(tradingPair);
          return dataset.pushUpdate(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
          );
        }
        addDataset(dataset) {
          const tradingPair = dataset.getTradingPair();
          if (this.datasets.has(tradingPair)) {
            throw new Error(`TradingPair ${tradingPair} already added to repo.`);
          }
          this.datasets.set(tradingPair, dataset);
        }
        getDataset(tradingPair) {
          const dataset = this.datasets.get(tradingPair);
          if (!dataset) {
            throw new Error(`No MTF dataset registered for ${tradingPair.symbol()}`);
          }
          return dataset;
        }
        getDatasets() {
          return this.datasets;
        }
        getIndicators(tradingPair) {
          const list = this.indicators.get(tradingPair);
          if (!list) {
            throw new Error(`No indicator found for: ${tradingPair.getId()}`);
          }
          return list;
        }
        initializeIndicatorsWithDatasets(tradingPair) {
          const dataset = this.getDataset(tradingPair);
          const created = this.indicatorParameters.map((indParam) => {
            return indParam.createUsing(dataset);
          });
          this.indicators.set(tradingPair, created);
        }
        addIndicatorParameters(indicatorParams) {
          const exists = this.indicatorParameters.some(
            (ind) => ind.equals(indicatorParams)
          );
          if (exists) {
            return false;
          }
          this.indicatorParameters.push(indicatorParams);
          return true;
        }
        findIndicator(tradingPair, indicatorParams) {
          const list = this.getIndicators(tradingPair);
          const found = list.find(
            (ind) => ind.getParameters().equals(indicatorParams)
          );
          if (!found) {
            throw new Error(`Indicator ${indicatorParams.getId()} was not found for tp ${tradingPair.getId()}.`);
          }
          return found;
        }
        updateIndicators(tradingPair, timeFrame) {
          const list = this.getIndicators(tradingPair);
          list.forEach((ind) => ind.update(timeFrame));
        }
        getTradingPairs() {
          if (this.getDatasets() === void 0) {
            throw new Error("Cannot get trading pairs");
          }
          return [...this.getDatasets().keys()];
        }
        getOhlcvData(tradingPair, source, timeframe, position) {
          let dataset = this.getDataset(tradingPair);
          let tfBuffer = dataset.getBuffer(timeframe);
          return source.extract(tfBuffer.getCandle(position));
        }
        getOhlcvPendingData(tradingPair, source, timeframe) {
          let dataset = this.getDataset(tradingPair);
          let tfBuffer = dataset.getBuffer(timeframe);
          return source.extract(tfBuffer.getPendingCandle());
        }
        getIndicatorValue(indicator, position) {
          return indicator.getValue(position);
        }
        getPendingIndicatorValue(indicator) {
          return indicator.getPendingValue();
        }
        isIndicatorReady(indicator) {
          return indicator.isReady();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/values/TimeFrame.ts
  var _VALUES, _TimeFrame, TimeFrame;
  var init_TimeFrame = __esm({
    "ts_libs/ts_worker/domain/values/TimeFrame.ts"() {
      "use strict";
      _TimeFrame = class _TimeFrame {
        /**
         * Creates a TimeFrame instance.
         * @param milliseconds - Duration in milliseconds.
         * @param label - Duration as a string.
         */
        constructor(milliseconds, label) {
          this.milliseconds = milliseconds;
          this.label = label;
          Object.freeze(this);
        }
        getLabel() {
          return this.label;
        }
        /**
         * Returns an array of all enum values.
         */
        static values() {
          return __privateGet(_TimeFrame, _VALUES);
        }
        /**
         * Validates the given value as a TimeFrame instance.
         * @param {unknown|TimeFrame|number} value - The value to validate.
         * @throws {TypeError} If the value is not a TimeFrame instance.
         * @throws {RangeError} If the value is a non-canonical TimeFrame instance.
         * @returns The validated TimeFrame instance.
         */
        static fromUnknown(value) {
          if (value instanceof _TimeFrame) {
            const canonical = __privateGet(_TimeFrame, _VALUES).find((v) => v === value);
            if (!canonical) {
              throw new RangeError("Non-canonical TimeFrame instance");
            }
            return canonical;
          }
          if (typeof value === "number") {
            const canonical = __privateGet(_TimeFrame, _VALUES).find((v) => v.milliseconds === value);
            if (!canonical) {
              throw new RangeError("No TimeFrame for given milliseconds");
            }
            return canonical;
          }
          throw new TypeError("Value is not a TimeFrame or a number");
        }
        /**
         * Checks if this TimeFrame instance is equal to another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns {boolean} True if the instances are equal, false otherwise.
         */
        equals(other) {
          try {
            return this === _TimeFrame.fromUnknown(other);
          } catch (e) {
            return false;
          }
        }
        /**
         * Compares this TimeFrame instance with another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns A number indicating the comparison result:
         *   < 0 if this is less than other
         *   = 0 if equal
         *   > 0 if this is greater than other
         */
        compareTo(other) {
          return this.milliseconds - other.milliseconds;
        }
        /**
         * Checks if this TimeFrame instance is less than another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns {boolean} True if this is less than other, false otherwise.
         */
        isLessThan(other) {
          return this.compareTo(other) < 0;
        }
        /**
         * Checks if this TimeFrame instance is less than or equal to another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns {boolean} True if this is less than or equal to other, false otherwise.
         */
        isLessThanOrEqual(other) {
          return this.compareTo(other) <= 0;
        }
        /**
         * Checks if this TimeFrame instance is greater than another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns {boolean} True if this is greater than other, false otherwise.
         */
        isGreaterThan(other) {
          return this.compareTo(other) > 0;
        }
        /**
         * Checks if this TimeFrame instance is greater than or equal to another.
         * @param other - The other TimeFrame instance to compare with.
         * @returns {boolean} True if this is greater than or equal to other, false otherwise.
         */
        isGreaterThanOrEqual(other) {
          return this.compareTo(other) >= 0;
        }
        /**
         * Checks if a given timestamp is aligned with this TimeFrame.
         * @param timestamp - The timestamp in milliseconds to check.
         * @returns {boolean} True if the timestamp is aligned, false otherwise.
         */
        isTimestampAligned(timestamp) {
          switch (this) {
            case _TimeFrame.ONE_MINUTE:
            case _TimeFrame.FIVE_MINUTES:
            case _TimeFrame.FIFTEEN_MINUTES:
            case _TimeFrame.ONE_HOUR:
            case _TimeFrame.FOUR_HOURS:
            case _TimeFrame.ONE_DAY:
              return timestamp % this.milliseconds === 0;
            //case TimeFrame.ONE_WEEK:
            //    return (
            //        (timestamp - TimeFrame.ISO_WEEK_EPOCH) % TimeFrame.ONE_WEEK.milliseconds === 0
            //    );
            default:
              throw new Error(`Alignment not defined for timeframe ${this.label}`);
          }
        }
        /**
         * Returns the number of minutes that this timeframe represents.
         * @returns {number} The number of minutes as an integer.
         */
        asMinutes() {
          return this.milliseconds / _TimeFrame.ONE_MINUTE.milliseconds;
        }
        /**
         * Returns the number of milliseconds that this timeframe represents.
         * @returns {number} The number of milliseconds as an integer.
         */
        asMilliseconds() {
          return this.milliseconds;
        }
      };
      _VALUES = new WeakMap();
      _TimeFrame.ISO_WEEK_EPOCH = 3456e5;
      /**
       * One minute duration.
       */
      _TimeFrame.ONE_MINUTE = new _TimeFrame(6e4, "1m");
      /**
       * Five minutes duration.
       */
      _TimeFrame.FIVE_MINUTES = new _TimeFrame(3e5, "5m");
      /**
       * Fifteen minutes duration.
       */
      _TimeFrame.FIFTEEN_MINUTES = new _TimeFrame(9e5, "15m");
      /**
       * One hour duration.
       */
      _TimeFrame.ONE_HOUR = new _TimeFrame(36e5, "1h");
      /**
       * Four hours duration.
       */
      _TimeFrame.FOUR_HOURS = new _TimeFrame(144e5, "4h");
      /**
       * One day duration.
       */
      _TimeFrame.ONE_DAY = new _TimeFrame(864e5, "1d");
      //static readonly ONE_WEEK = new TimeFrame(604800000, '1w');
      __privateAdd(_TimeFrame, _VALUES, [
        _TimeFrame.ONE_MINUTE,
        _TimeFrame.FIVE_MINUTES,
        _TimeFrame.FIFTEEN_MINUTES,
        _TimeFrame.ONE_HOUR,
        _TimeFrame.FOUR_HOURS,
        _TimeFrame.ONE_DAY
      ]);
      TimeFrame = _TimeFrame;
    }
  });

  // ts_libs/ts_worker/domain/util/RingBuffer.ts
  var RingBuffer;
  var init_RingBuffer = __esm({
    "ts_libs/ts_worker/domain/util/RingBuffer.ts"() {
      "use strict";
      RingBuffer = class {
        constructor(capacity, factoryOrArray) {
          this.capacity = capacity;
          this.pointer = 0;
          this.size = 0;
          if (!Number.isInteger(capacity) || capacity <= 0) {
            throw new RangeError(
              `Capacity must be a positive integer, got ${capacity}`
            );
          }
          this.buffer = new Array(capacity);
          if (Array.isArray(factoryOrArray)) {
            if (factoryOrArray.length > capacity) {
              throw new RangeError(
                `Initial array exceeds capacity (${factoryOrArray.length} > ${capacity})`
              );
            }
            for (let i = 0; i < factoryOrArray.length; i++) {
              this.buffer[i] = factoryOrArray[i];
            }
            this.size = factoryOrArray.length;
            this.pointer = factoryOrArray.length % capacity;
          } else if (typeof factoryOrArray === "function") {
            const factory = factoryOrArray;
            for (let i = 0; i < capacity; i++) {
              this.buffer[i] = factory();
            }
          } else {
            throw new TypeError(
              "Second argument must be a factory function or an array"
            );
          }
        }
        /**
         * Push values into the next preallocated object
         * @param setter - function that modifies the preallocated object
         */
        push(setter) {
          const item = this.buffer[this.pointer];
          setter(item);
          this.pointer = (this.pointer + 1) % this.capacity;
          if (this.size < this.capacity) this.size++;
        }
        /**
         * Get an item counted backward from newest.
         * @param n - 0 = last inserted, 1 = previous item
         */
        get(n = 0) {
          if (!Number.isInteger(n)) {
            throw new TypeError(`Index must be an integer, got ${n}`);
          }
          if (n < 0 || n >= this.size) {
            throw new RangeError(`Invalid index ${n}, buffer size is ${this.size}`);
          }
          const idx = (this.pointer - 1 - n + this.capacity) % this.capacity;
          return this.buffer[idx];
        }
        /** Returns full internal buffer */
        raw() {
          return this.buffer;
        }
        /** Capacity of the buffer */
        getCapacity() {
          return this.capacity;
        }
        /** Next insertion pointer */
        getPointer() {
          return this.pointer;
        }
        /** Number of elements currently stored */
        getSize() {
          return this.size;
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/values/OhlcvEntry.ts
  var _OhlcvEntry_static, assertNumber_fn, assertNonNegative_fn, _OhlcvEntry, OhlcvEntry;
  var init_OhlcvEntry = __esm({
    "ts_libs/ts_worker/domain/values/OhlcvEntry.ts"() {
      "use strict";
      init_TimeFrame();
      _OhlcvEntry = class _OhlcvEntry {
        constructor(timeFrame = TimeFrame.ONE_MINUTE, open = 0, high = 0, low = 0, close = 0, volume = 0, startTime = 0, endTime = 0, isClosed = false) {
          this.timeFrame = timeFrame;
          this.open = open;
          this.high = high;
          this.low = low;
          this.close = close;
          this.volume = volume;
          this.startTime = startTime;
          this.endTime = endTime;
          this.isClosed = isClosed;
        }
        /**
         * Update this entry in place
         */
        update(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          _OhlcvEntry.Validate(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
          );
          this.timeFrame = timeFrame;
          this.open = open;
          this.high = high;
          this.low = low;
          this.close = close;
          this.volume = volume;
          this.startTime = startTime;
          this.endTime = endTime;
          this.isClosed = isClosed;
        }
        /* ============================
         * Validation helpers
         * ============================ */
        static Validate(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          const validatedTimeFrame = TimeFrame.fromUnknown(timeFrame);
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, open, "open");
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, high, "high");
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, low, "low");
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, close, "close");
          if (high < low) {
            throw new RangeError("high must be >= low");
          }
          if (open < low || open > high) {
            throw new RangeError("open must be between low and high");
          }
          if (close < low || close > high) {
            throw new RangeError("close must be between low and high");
          }
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, volume, "volume");
          __privateMethod(this, _OhlcvEntry_static, assertNonNegative_fn).call(this, volume, "volume");
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, startTime, "startTime");
          __privateMethod(this, _OhlcvEntry_static, assertNumber_fn).call(this, endTime, "endTime");
          if (endTime <= startTime) {
            throw new RangeError("endTime must be > startTime");
          }
          const expectedDuration = validatedTimeFrame.asMilliseconds();
          const actualDuration = endTime - startTime;
          if (actualDuration > expectedDuration) {
            throw new RangeError(
              `Timeframe mismatch: expected ${expectedDuration}ms, got ${actualDuration}ms`
            );
          }
          if (typeof isClosed !== "boolean") {
            throw new TypeError("isClosed must be boolean");
          }
        }
      };
      _OhlcvEntry_static = new WeakSet();
      assertNumber_fn = function(value, name) {
        if (!Number.isFinite(value)) {
          throw new TypeError(`${name} must be a finite number`);
        }
      };
      assertNonNegative_fn = function(value, name) {
        if (value < 0) {
          throw new RangeError(`${name} must be >= 0`);
        }
      };
      __privateAdd(_OhlcvEntry, _OhlcvEntry_static);
      OhlcvEntry = _OhlcvEntry;
    }
  });

  // ts_libs/ts_worker/domain/values/PendingOhlcvEntry.ts
  var _PendingOhlcvEntry_instances, initialize_fn, update_fn, isLastCandle_fn, finalize_fn, validate_fn, _PendingOhlcvEntry, PendingOhlcvEntry;
  var init_PendingOhlcvEntry = __esm({
    "ts_libs/ts_worker/domain/values/PendingOhlcvEntry.ts"() {
      "use strict";
      init_OhlcvEntry();
      _PendingOhlcvEntry = class _PendingOhlcvEntry {
        constructor(baseTimeFrame) {
          __privateAdd(this, _PendingOhlcvEntry_instances);
          this.baseTimeFrame = baseTimeFrame;
          this.state = _PendingOhlcvEntry.State.INIT;
          this.open = 0;
          this.high = 0;
          this.low = 0;
          this.close = 0;
          this.volume = 0;
          this.startTime = 0;
          this.endTime = 0;
          this.nextIncrementalUpdate = null;
          this.updateLimit = null;
        }
        /**
         * Accumulate a closed lower-timeframe candle.
         * @returns true if a base-timeframe candle was completed
         */
        accumulate(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          __privateMethod(this, _PendingOhlcvEntry_instances, validate_fn).call(this, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed);
          if (this.state === _PendingOhlcvEntry.State.INIT) {
            __privateMethod(this, _PendingOhlcvEntry_instances, initialize_fn).call(this, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed);
            this.state = _PendingOhlcvEntry.State.UPDATE;
            return false;
          }
          __privateMethod(this, _PendingOhlcvEntry_instances, update_fn).call(this, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed);
          if (__privateMethod(this, _PendingOhlcvEntry_instances, isLastCandle_fn).call(this, timeFrame, startTime)) {
            __privateMethod(this, _PendingOhlcvEntry_instances, finalize_fn).call(this);
            return true;
          }
          return false;
        }
      };
      _PendingOhlcvEntry_instances = new WeakSet();
      /* =========================
         Core Logic
         ========================= */
      initialize_fn = function(timeFrame, open, high, low, close, volume, startTime, endTime, _isClosed) {
        if (!this.baseTimeFrame.isTimestampAligned(startTime)) {
          throw new Error(
            `Start time ${startTime} not aligned to ${this.baseTimeFrame.getLabel()}`
          );
        }
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.startTime = startTime;
        this.endTime = endTime;
        this.nextIncrementalUpdate = startTime + timeFrame.asMilliseconds();
        this.updateLimit = startTime + this.baseTimeFrame.asMilliseconds();
      };
      update_fn = function(timeFrame, open, high, low, close, volume, startTime, endTime, _isClosed) {
        if (this.nextIncrementalUpdate === null) {
          throw new Error("PendingOhlcvEntry not initialized");
        }
        if (startTime !== this.nextIncrementalUpdate) {
          throw new Error(
            `Candle gap detected: expected ${this.nextIncrementalUpdate}, got ${startTime}`
          );
        }
        this.high = Math.max(this.high, high);
        this.low = Math.min(this.low, low);
        this.close = close;
        this.volume += volume;
        this.endTime = endTime;
        this.nextIncrementalUpdate = startTime + timeFrame.asMilliseconds();
      };
      isLastCandle_fn = function(timeFrame, startTime) {
        if (this.updateLimit === null) {
          throw new Error("Null update limit");
        }
        return startTime + timeFrame.asMilliseconds() >= this.updateLimit;
      };
      finalize_fn = function() {
        this.state = _PendingOhlcvEntry.State.INIT;
      };
      /* =========================
         Validation
         ========================= */
      validate_fn = function(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
        if (!isClosed) {
          throw new Error("Pending entry requires closed candles");
        }
        if (timeFrame.isGreaterThanOrEqual(this.baseTimeFrame)) {
          throw new Error(
            `Invalid timeframe: provided=${timeFrame.getLabel()}, base=${this.baseTimeFrame.getLabel()}`
          );
        }
        OhlcvEntry.Validate(
          timeFrame,
          open,
          high,
          low,
          close,
          volume,
          startTime,
          endTime,
          isClosed
        );
      };
      _PendingOhlcvEntry.State = Object.freeze({
        INIT: 1,
        // waiting for first candle
        UPDATE: 2
        // accumulating subsequent candles
      });
      PendingOhlcvEntry = _PendingOhlcvEntry;
    }
  });

  // ts_libs/ts_worker/domain/values/OhlcvBuffer.ts
  var _OhlcvBuffer_instances, pushBase_fn, pushUpdate_fn, _OhlcvBuffer, OhlcvBuffer;
  var init_OhlcvBuffer = __esm({
    "ts_libs/ts_worker/domain/values/OhlcvBuffer.ts"() {
      "use strict";
      init_RingBuffer();
      init_OhlcvEntry();
      init_PendingOhlcvEntry();
      _OhlcvBuffer = class _OhlcvBuffer {
        /**
         * @param tradingPair - The trading pair of this buffer
         * @param timeFrame - The base timeframe of this buffer
         * @param capacity - RingBuffer capacity
         */
        constructor(tradingPair, timeFrame, capacity) {
          __privateAdd(this, _OhlcvBuffer_instances);
          this.tradingPair = tradingPair;
          this.baseTimeFrame = timeFrame;
          this.data = new RingBuffer(
            capacity,
            () => new OhlcvEntry()
          );
          this.pending = new PendingOhlcvEntry(timeFrame);
        }
        /* ============================
         * Public API
         * ============================ */
        push(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          if (timeFrame.equals(this.baseTimeFrame)) {
            return __privateMethod(this, _OhlcvBuffer_instances, pushBase_fn).call(this, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed);
          }
          return __privateMethod(this, _OhlcvBuffer_instances, pushUpdate_fn).call(this, timeFrame, open, high, low, close, volume, startTime, endTime, isClosed);
        }
        pushEntry(entry) {
          if (entry.timeFrame.equals(this.baseTimeFrame)) {
            return __privateMethod(this, _OhlcvBuffer_instances, pushBase_fn).call(this, entry.timeFrame, entry.open, entry.high, entry.low, entry.close, entry.volume, entry.startTime, entry.endTime, entry.isClosed);
          }
          return __privateMethod(this, _OhlcvBuffer_instances, pushUpdate_fn).call(this, entry.timeFrame, entry.open, entry.high, entry.low, entry.close, entry.volume, entry.startTime, entry.endTime, entry.isClosed);
        }
        /* ============================
         * Buffer state
         * ============================ */
        isEmpty() {
          return this.data.getSize() === 0;
        }
        size() {
          return this.data.getSize();
        }
        getCapacity() {
          return this.data.getCapacity();
        }
        getBaseTimeFrame() {
          return this.baseTimeFrame;
        }
        stream(accessLambda) {
          if (typeof accessLambda !== "function") {
            throw new TypeError("OhlcvBuffer.stream: accessLambda is not a function");
          }
          for (let n = this.size() - 1; n >= 0; n--) {
            accessLambda(n, this.data.get(n));
          }
        }
        getPendingCandle() {
          return this.pending;
        }
        /* ============================
         * Zero-allocation computations
         * ============================ */
        getCandle(n = 0) {
          return this.data.get(n);
        }
        isBullish(n = 0) {
          const c = this.getCandle(n);
          return c.close > c.open;
        }
        isBearish(n = 0) {
          const c = this.getCandle(n);
          return c.close < c.open;
        }
        range(n = 0) {
          const c = this.getCandle(n);
          return c.high - c.low;
        }
        bodySize(n = 0) {
          const c = this.getCandle(n);
          return Math.abs(c.close - c.open);
        }
        typicalPrice(n = 0) {
          const c = this.getCandle(n);
          return (c.high + c.low + c.close) / 3;
        }
        midPrice(n = 0) {
          const c = this.getCandle(n);
          return (c.high + c.low) / 2;
        }
        getOpen(n = 0) {
          return this.getCandle(n).open;
        }
        getClose(n = 0) {
          return this.getCandle(n).close;
        }
        getHigh(n = 0) {
          return this.getCandle(n).high;
        }
        getLow(n = 0) {
          return this.getCandle(n).low;
        }
        getVolume(n = 0) {
          return this.getCandle(n).volume;
        }
        getStartTime(n = 0) {
          return this.getCandle(n).startTime;
        }
        getEndTime(n = 0) {
          return this.getCandle(n).endTime;
        }
        getNextAcceptableStartTimeOnBaseTimeFrame() {
          if (this.isEmpty()) {
            return null;
          }
          return this.getStartTime() + this.baseTimeFrame.asMilliseconds();
        }
        getNextAcceptableStartTimeOnPendingBuffer() {
          if (this.isEmpty()) {
            throw new Error(
              `Buffer is empty for pair ${this.tradingPair.symbol()} on timeFrame ${this.baseTimeFrame.getLabel()}.`
            );
          }
          if (this.pending.nextIncrementalUpdate === null) {
            const next = this.getNextAcceptableStartTimeOnBaseTimeFrame();
            if (next === null) {
              throw new Error(
                `All buffers are empty for pair ${this.tradingPair.symbol()} on timeFrame ${this.baseTimeFrame.getLabel()}.`
              );
            }
            return next;
          }
          return this.pending.nextIncrementalUpdate;
        }
        static fromUnknown(anInstance) {
          if (!(anInstance instanceof _OhlcvBuffer)) {
            throw new TypeError(
              "OhlcvBuffer.Validate: anInstance is not an instance of OhlcvBuffer"
            );
          }
          return anInstance;
        }
      };
      _OhlcvBuffer_instances = new WeakSet();
      /* ============================
       * Base Timeframe
       * ============================ */
      pushBase_fn = function(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
        if (!isClosed) {
          throw new Error("Base timeframe entry must be closed");
        }
        if (!timeFrame.equals(this.baseTimeFrame)) {
          throw new Error("Entry timeframe is different from base timeframe");
        }
        const expectedTime = this.getNextAcceptableStartTimeOnBaseTimeFrame();
        if (expectedTime !== null && startTime !== expectedTime) {
          throw new Error(
            `Non-contiguous base timeframe (${timeFrame.getLabel()}) entry for pair ${this.tradingPair.symbol()} on exchange ${this.tradingPair.getExchangeDescriptor().getName()}. Expected startTime=${expectedTime}, got ${startTime}`
          );
        }
        this.data.push((candle) => {
          candle.update(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
          );
        });
        return true;
      };
      /* ============================
       * Update Timeframe (Aggregation)
       * ============================ */
      pushUpdate_fn = function(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
        const pendingResult = this.pending.accumulate(
          timeFrame,
          open,
          high,
          low,
          close,
          volume,
          startTime,
          endTime,
          isClosed
        );
        if (pendingResult === false) {
          return false;
        }
        this.data.push((candle) => {
          candle.update(
            this.baseTimeFrame,
            this.pending.open,
            this.pending.high,
            this.pending.low,
            this.pending.close,
            this.pending.volume,
            this.pending.startTime,
            this.pending.endTime,
            true
          );
        });
        return true;
      };
      OhlcvBuffer = _OhlcvBuffer;
    }
  });

  // ts_libs/ts_worker/domain/errors/InsufficientOhlcvDataError.ts
  var InsufficientOhlcvDataError;
  var init_InsufficientOhlcvDataError = __esm({
    "ts_libs/ts_worker/domain/errors/InsufficientOhlcvDataError.ts"() {
      "use strict";
      InsufficientOhlcvDataError = class _InsufficientOhlcvDataError extends Error {
        /**
         * @param reason - Why the data is insufficient
         * @param baseAsset - Base asset symbol
         * @param quoteAsset - Quote asset symbol
         * @param exchangeDescriptor - Exchange name
         */
        constructor(reason, pair) {
          super(`Insufficient OHLCV data for ${pair.symbol()} on ${pair.getExchangeDescriptor().getName()}: ${reason}`);
          this.name = "InsufficientOhlcvDataError";
          this.reason = reason;
          this.baseAsset = pair.getBaseAsset();
          this.quoteAsset = pair.getQuoteAsset();
          this.exchangeDescriptor = pair.getExchangeDescriptor();
          Object.freeze(this);
        }
        /**
         * Safe type guard for this error across realms/bundles
         */
        static isInstance(err) {
          return err instanceof _InsufficientOhlcvDataError;
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/values/MultiTimeframeOhlcv.ts
  var _MultiTimeframeOhlcv, MultiTimeframeOhlcv;
  var init_MultiTimeframeOhlcv = __esm({
    "ts_libs/ts_worker/domain/values/MultiTimeframeOhlcv.ts"() {
      "use strict";
      init_TradingPair();
      init_InsufficientOhlcvDataError();
      init_OhlcvBuffer();
      init_TimeFrame();
      _MultiTimeframeOhlcv = class _MultiTimeframeOhlcv {
        constructor(tradingPair, oneDay, fourHours, oneHour, fifteenMinutes, fiveMinutes, oneMinute) {
          this.tradingPair = TradingPair.fromUnknown(tradingPair);
          this.buffers = /* @__PURE__ */ new Map([
            [TimeFrame.ONE_DAY, OhlcvBuffer.fromUnknown(oneDay)],
            [TimeFrame.FOUR_HOURS, OhlcvBuffer.fromUnknown(fourHours)],
            [TimeFrame.ONE_HOUR, OhlcvBuffer.fromUnknown(oneHour)],
            [TimeFrame.FIFTEEN_MINUTES, OhlcvBuffer.fromUnknown(fifteenMinutes)],
            [TimeFrame.FIVE_MINUTES, OhlcvBuffer.fromUnknown(fiveMinutes)],
            [TimeFrame.ONE_MINUTE, OhlcvBuffer.fromUnknown(oneMinute)]
          ]);
          this.updatedTimeFrames = /* @__PURE__ */ new Map([
            [TimeFrame.ONE_DAY, true],
            [TimeFrame.FOUR_HOURS, true],
            [TimeFrame.ONE_HOUR, true],
            [TimeFrame.FIFTEEN_MINUTES, true],
            [TimeFrame.FIVE_MINUTES, true],
            [TimeFrame.ONE_MINUTE, true]
          ]);
          for (let i = 1; i < _MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = _MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);
            if (buffer.size() === 0) {
              throw new InsufficientOhlcvDataError(`The ${tf.getLabel()} timeframe has no data.`, tradingPair);
            }
          }
          for (let i = 1; i < _MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const currentTf = _MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const currentBuffer = this.getBuffer(currentTf);
            for (let j = i - 1; j >= 0; j--) {
              const lowerTf = _MultiTimeframeOhlcv.TimeframeHierarchy[j];
              const lowerBuffer = this.getBuffer(lowerTf);
              lowerBuffer.stream((_position, candle) => {
                const acceptable = currentBuffer.getNextAcceptableStartTimeOnPendingBuffer();
                if (candle.startTime === acceptable) {
                  currentBuffer.pushEntry(candle);
                }
              });
            }
          }
          this.ensureBuffersAreFullyAligned();
        }
        ensureBuffersAreFullyAligned() {
          const oneMinuteBuffer = this.getBuffer(TimeFrame.ONE_MINUTE);
          let expectedNext = oneMinuteBuffer.getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();
          for (let i = 1; i < _MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = _MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);
            const currentNext = buffer.getNextAcceptableStartTimeOnPendingBuffer();
            if (currentNext !== expectedNext) {
              throw new Error(
                `Inconsistent next pending timestamp for timeframe ${tf.getLabel()}: expected ${expectedNext}, got ${currentNext}`
              );
            }
          }
        }
        markUpdated(timeFrame) {
          const tf = TimeFrame.fromUnknown(timeFrame);
          if (!this.updatedTimeFrames.has(tf)) {
            throw new Error(`Unsupported timeframe: ${tf.getLabel()}`);
          }
          this.updatedTimeFrames.set(tf, true);
        }
        clearUpdatedTimeFrames() {
          this.updatedTimeFrames.forEach((_value5, timeFrame) => {
            this.updatedTimeFrames.set(timeFrame, false);
          });
        }
        pushUpdate(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
          this.clearUpdatedTimeFrames();
          if (!TimeFrame.ONE_MINUTE.equals(timeFrame)) {
            throw new Error(`Cannot push updates for the ${timeFrame.getLabel()} timeframe`);
          }
          const mainBuffer = this.getBuffer(timeFrame);
          const updatedMain = mainBuffer.push(
            timeFrame,
            open,
            high,
            low,
            close,
            volume,
            startTime,
            endTime,
            isClosed
          );
          if (updatedMain) {
            this.markUpdated(mainBuffer.getBaseTimeFrame());
          }
          for (let i = 1; i < _MultiTimeframeOhlcv.TimeframeHierarchy.length; i++) {
            const tf = _MultiTimeframeOhlcv.TimeframeHierarchy[i];
            const buffer = this.getBuffer(tf);
            const updated = buffer.push(
              timeFrame,
              open,
              high,
              low,
              close,
              volume,
              startTime,
              endTime,
              isClosed
            );
            if (updated) {
              this.markUpdated(buffer.getBaseTimeFrame());
            }
          }
          this.ensureBuffersAreFullyAligned();
          return this.updatedTimeFrames;
        }
        forEachUpdatedTimeFrame(callback) {
          this.updatedTimeFrames.forEach((updated, timeFrame) => {
            if (!updated) {
              return;
            }
            callback(timeFrame);
          });
        }
        getUpdatedTimeFrames() {
          return this.updatedTimeFrames;
        }
        getBuffer(timeFrame) {
          const tf = TimeFrame.fromUnknown(timeFrame);
          const buffer = this.buffers.get(tf);
          return OhlcvBuffer.fromUnknown(buffer);
        }
        getTradingPair() {
          return this.tradingPair;
        }
        static fromUnknown(instance) {
          if (!(instance instanceof _MultiTimeframeOhlcv)) {
            throw new TypeError(
              "MultiTimeframeOhlcv.Validate: anInstance is not an instance of MultiTimeframeOhlcv"
            );
          }
          return instance;
        }
      };
      _MultiTimeframeOhlcv.TimeframeHierarchy = [
        TimeFrame.ONE_MINUTE,
        TimeFrame.FIVE_MINUTES,
        TimeFrame.FIFTEEN_MINUTES,
        TimeFrame.ONE_HOUR,
        TimeFrame.FOUR_HOURS,
        TimeFrame.ONE_DAY
      ];
      MultiTimeframeOhlcv = _MultiTimeframeOhlcv;
    }
  });

  // ts_libs/ts_worker/domain/exchange/ExchangeMethodsBase.ts
  var _ExchangeMethodsBase_static, getEntries_fn, _ExchangeMethodsBase, ExchangeMethodsBase;
  var init_ExchangeMethodsBase = __esm({
    "ts_libs/ts_worker/domain/exchange/ExchangeMethodsBase.ts"() {
      "use strict";
      init_TradingPair();
      init_TimeFrame();
      init_OhlcvBuffer();
      init_MultiTimeframeOhlcv();
      _ExchangeMethodsBase = class _ExchangeMethodsBase {
        /**
         * Create a buffer for a single timeframe
         */
        createSingleBuffer(tradingPair, timeFrame, endTimeStamp, count) {
          return __async(this, null, function* () {
            const relevantEndTimeStamp = endTimeStamp;
            const duration = count * timeFrame.asMilliseconds();
            const relevantStartTimeStamp = relevantEndTimeStamp - duration;
            const data = yield this.fetchHistoricalCandles(
              tradingPair,
              timeFrame,
              relevantStartTimeStamp,
              relevantEndTimeStamp
            );
            const buffer = new OhlcvBuffer(tradingPair, timeFrame, count);
            if (data.length === 0) return buffer;
            let startIndex = 0;
            for (let i = data.length - 1; i > 0; i--) {
              const expectedPrev = data[i].startTime - timeFrame.asMilliseconds();
              if (data[i - 1].startTime !== expectedPrev) {
                startIndex = i;
                break;
              }
            }
            for (let i = startIndex; i < data.length; i++) {
              buffer.pushEntry(data[i]);
            }
            return buffer;
          });
        }
        /**
         * Sync a MultiTimeframeOhlcv with new data up to newEndTimeMillis
         */
        syncOneMinuteTimeFrame(multiTimeframeOhlcv, newEndTimeMillis) {
          return __async(this, null, function* () {
            const timeFrame = TimeFrame.ONE_MINUTE;
            const buffer = OhlcvBuffer.fromUnknown(multiTimeframeOhlcv.getBuffer(timeFrame));
            if (buffer.isEmpty()) {
              throw new Error("Cannot sync an empty buffer");
            }
            const relevantStartTimeStamp = buffer.getStartTime() + timeFrame.asMilliseconds();
            const relevantEndTimeStamp = newEndTimeMillis;
            if (relevantEndTimeStamp <= relevantStartTimeStamp) return void 0;
            const data = yield this.fetchHistoricalCandles(
              multiTimeframeOhlcv.getTradingPair(),
              buffer.getBaseTimeFrame(),
              relevantStartTimeStamp,
              relevantEndTimeStamp
            );
            return data;
          });
        }
        /**
         * Create a MultiTimeframeOhlcv from historical data
         */
        createMultiTimeframeOhlcv(tradingPair, endTimeMsExclusive, totalCountPerTimeFrame) {
          return __async(this, null, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!Number.isInteger(totalCountPerTimeFrame) || totalCountPerTimeFrame <= 10) {
              throw new RangeError("totalCountPerTimeFrame must be > 10");
            }
            if (!Number.isFinite(endTimeMsExclusive)) {
              throw new RangeError("endTimeMsExclusive must be finite");
            }
            const timeFrames = MultiTimeframeOhlcv.TimeframeHierarchy;
            const results = yield Promise.all(timeFrames.map((tf) => __async(this, null, function* () {
              const entries = yield this.createSingleBuffer(TradingPair.fromUnknown(tradingPair), tf, endTimeMsExclusive, totalCountPerTimeFrame);
              return { timeFrame: tf, entries };
            })));
            return new MultiTimeframeOhlcv(
              tradingPair,
              __privateMethod(_a = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_a, results, TimeFrame.ONE_DAY),
              __privateMethod(_b = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_b, results, TimeFrame.FOUR_HOURS),
              __privateMethod(_c = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_c, results, TimeFrame.ONE_HOUR),
              __privateMethod(_d = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_d, results, TimeFrame.FIFTEEN_MINUTES),
              __privateMethod(_e = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_e, results, TimeFrame.FIVE_MINUTES),
              __privateMethod(_f = _ExchangeMethodsBase, _ExchangeMethodsBase_static, getEntries_fn).call(_f, results, TimeFrame.ONE_MINUTE)
            );
          });
        }
      };
      _ExchangeMethodsBase_static = new WeakSet();
      getEntries_fn = function(map, timeFrame) {
        const found = map.find((x) => timeFrame.equals(x.timeFrame));
        if (!found || !found.entries) {
          throw new Error(`Entries for timeframe ${timeFrame.getLabel()} not found`);
        }
        return found.entries;
      };
      __privateAdd(_ExchangeMethodsBase, _ExchangeMethodsBase_static);
      ExchangeMethodsBase = _ExchangeMethodsBase;
    }
  });

  // ts_libs/ts_worker/infrastructure/exchanges/ExchangeMethodsBinance.ts
  var _ExchangeMethodsBinance_static, createOhlcvEntry_fn, _ExchangeMethodsBinance, ExchangeMethodsBinance;
  var init_ExchangeMethodsBinance = __esm({
    "ts_libs/ts_worker/infrastructure/exchanges/ExchangeMethodsBinance.ts"() {
      "use strict";
      init_ExchangeMethodsBase();
      init_TimeFrame();
      init_OhlcvEntry();
      init_Asset();
      _ExchangeMethodsBinance = class _ExchangeMethodsBinance extends ExchangeMethodsBase {
        constructor() {
          super();
        }
        getTradingPairUrl(tradingPair) {
          return `https://www.binance.com/en/trade/${tradingPair.getBaseAsset()}_${tradingPair.getQuoteAsset()}?type=spot`;
        }
        /**
         * Fetch trading pairs from Binance.
         * @param callback - called for each trading pair (baseAsset, quoteAsset)
         */
        fetchTradingPairs(callback) {
          return __async(this, null, function* () {
            if (typeof callback !== "function") {
              throw new TypeError("callback must be a function");
            }
            const res = yield fetch(`${_ExchangeMethodsBinance.BASE_URL}/api/v3/exchangeInfo`);
            if (!res.ok) {
              throw new Error(`Binance exchangeInfo failed (${res.status})`);
            }
            const info = yield res.json();
            if (!Array.isArray(info.symbols)) {
              throw new Error("Invalid Binance exchangeInfo response");
            }
            for (const s of info.symbols) {
              if (s.status !== "TRADING") continue;
              if (!s.isSpotTradingAllowed) continue;
              callback(Asset.fromUnknown(s.baseAsset), Asset.fromUnknown(s.quoteAsset));
            }
          });
        }
        /**
         * Fetch historical candles.
         * @param tradingPair - TradingPair instance
         * @param timeFrame - TimeFrame instance
         * @param startTimeMsInclusive - start timestamp (ms)
         * @param endTimeMsExclusive - end timestamp (ms)
         * @returns ordered OHLCV entries
         */
        fetchHistoricalCandles(tradingPair, timeFrame, startTimeMsInclusive, endTimeMsExclusive) {
          return __async(this, null, function* () {
            const symbol = tradingPair.symbol();
            const interval = _ExchangeMethodsBinance.mapTimeFrameToBinanceInterval(timeFrame);
            const toReturn = [];
            let cursorTime = startTimeMsInclusive;
            if (!timeFrame.isTimestampAligned(cursorTime)) {
              cursorTime = cursorTime - cursorTime % timeFrame.asMilliseconds();
            }
            while (cursorTime < endTimeMsExclusive) {
              const url = new URL(`${_ExchangeMethodsBinance.BASE_URL}/api/v3/klines`);
              url.searchParams.set("symbol", symbol);
              url.searchParams.set("interval", interval);
              url.searchParams.set("startTime", `${cursorTime}`);
              url.searchParams.set("limit", `${_ExchangeMethodsBinance.MAX_LIMIT}`);
              const res = yield fetch(url.toString());
              if (!res.ok) throw new Error(`Binance OHLCV fetch failed (${res.status})`);
              const data = yield res.json();
              if (!Array.isArray(data) || data.length === 0) break;
              const entries = data.map(
                (item) => {
                  var _a;
                  return __privateMethod(_a = _ExchangeMethodsBinance, _ExchangeMethodsBinance_static, createOhlcvEntry_fn).call(_a, item, timeFrame, endTimeMsExclusive);
                }
              );
              if (entries.length > 0) {
                const filtered = entries.filter((d) => d.isClosed === true);
                toReturn.push(...filtered);
                const last = entries[entries.length - 1];
                cursorTime = last.startTime + timeFrame.asMilliseconds();
              }
              if (entries.length < _ExchangeMethodsBinance.MAX_LIMIT) {
                break;
              }
            }
            for (let i = 1; i < toReturn.length; i++) {
              if (toReturn[i].startTime < toReturn[i - 1].startTime) {
                throw new Error("Non-ascending candles returned by Binance");
              }
            }
            return toReturn;
          });
        }
        /** Returns the Binance string label for a TimeFrame instance */
        static mapTimeFrameToBinanceInterval(timeFrame) {
          switch (timeFrame) {
            case TimeFrame.ONE_MINUTE:
              return "1m";
            case TimeFrame.FIVE_MINUTES:
              return "5m";
            case TimeFrame.FIFTEEN_MINUTES:
              return "15m";
            case TimeFrame.ONE_HOUR:
              return "1h";
            case TimeFrame.FOUR_HOURS:
              return "4h";
            case TimeFrame.ONE_DAY:
              return "1d";
            default:
              throw new RangeError(`Unsupported TimeFrame for Binance: ${timeFrame.getLabel()}`);
          }
        }
      };
      _ExchangeMethodsBinance_static = new WeakSet();
      createOhlcvEntry_fn = function(item, timeFrame, endTimeMsExclusive) {
        if (!Array.isArray(item) || item.length < 7) {
          throw new Error("Invalid kline format from Binance");
        }
        const entry = new OhlcvEntry();
        entry.update(
          timeFrame,
          +item[1],
          // open
          +item[2],
          // high
          +item[3],
          // low
          +item[4],
          // close
          +item[5],
          // volume
          +item[0],
          // startTime
          +item[6],
          // closeTime
          +item[6] < endTimeMsExclusive
          // isClosed
        );
        return entry;
      };
      __privateAdd(_ExchangeMethodsBinance, _ExchangeMethodsBinance_static);
      _ExchangeMethodsBinance.BASE_URL = "https://api.binance.com";
      _ExchangeMethodsBinance.MAX_LIMIT = 800;
      ExchangeMethodsBinance = _ExchangeMethodsBinance;
    }
  });

  // ts_libs/ts_worker/infrastructure/exchanges/ExchangeMethodsBybit.ts
  var _ExchangeMethodsBybit, ExchangeMethodsBybit;
  var init_ExchangeMethodsBybit = __esm({
    "ts_libs/ts_worker/infrastructure/exchanges/ExchangeMethodsBybit.ts"() {
      "use strict";
      init_ExchangeMethodsBase();
      init_TimeFrame();
      init_OhlcvEntry();
      init_Asset();
      _ExchangeMethodsBybit = class _ExchangeMethodsBybit extends ExchangeMethodsBase {
        // Bybit v5 spot max
        constructor() {
          super();
        }
        getTradingPairUrl(tradingPair) {
          return `https://www.bybit.com/en/trade/spot/${tradingPair.getBaseAsset()}/${tradingPair.getQuoteAsset()}`;
        }
        /**
         * Fetch trading pairs from Bybit Spot.
         * @param callback Called for each trading pair (baseAsset, quoteAsset)
         */
        fetchTradingPairs(callback) {
          return __async(this, null, function* () {
            var _a, _b;
            const url = `${_ExchangeMethodsBybit.BASE_URL}/v5/market/instruments-info?category=spot`;
            const res = yield fetch(url);
            if (!res.ok) {
              throw new Error(`Bybit Spot symbols fetch failed (${res.status})`);
            }
            const json = yield res.json();
            if (json.retCode !== 0) {
              throw new Error(`Bybit Spot API error: ${json.retMsg}`);
            }
            const list = (_b = (_a = json.result) == null ? void 0 : _a.list) != null ? _b : [];
            list.filter((s) => s.status === "Trading").forEach((s) => callback(Asset.fromUnknown(s.baseCoin), Asset.fromUnknown(s.quoteCoin)));
          });
        }
        /**
         * Map internal TimeFrame enum to Bybit v5 interval identifiers.
         */
        static mapTimeFrameToBybitInterval(timeFrame) {
          switch (timeFrame) {
            case TimeFrame.ONE_MINUTE:
              return "1";
            case TimeFrame.FIVE_MINUTES:
              return "5";
            case TimeFrame.FIFTEEN_MINUTES:
              return "15";
            case TimeFrame.ONE_HOUR:
              return "60";
            case TimeFrame.FOUR_HOURS:
              return "240";
            case TimeFrame.ONE_DAY:
              return "D";
            // case TimeFrame.ONE_WEEK: return "W"; // if you support weekly
            default:
              throw new RangeError(`Unsupported TimeFrame for Bybit Spot: ${timeFrame.getLabel()}`);
          }
        }
        /**
         * Fetch historical candles for a trading pair.
         */
        fetchHistoricalCandles(tradingPair, timeFrame, startTimeMsInclusive, endTimeMsExclusive) {
          return __async(this, null, function* () {
            var _a, _b;
            const symbol = tradingPair.symbol();
            const interval = _ExchangeMethodsBybit.mapTimeFrameToBybitInterval(timeFrame);
            const toReturn = [];
            let cursorTime = startTimeMsInclusive;
            if (!timeFrame.isTimestampAligned(cursorTime)) {
              cursorTime = cursorTime - cursorTime % timeFrame.asMilliseconds();
            }
            while (cursorTime < endTimeMsExclusive) {
              const url = new URL(`${_ExchangeMethodsBybit.BASE_URL}/v5/market/kline`);
              url.searchParams.set("category", "spot");
              url.searchParams.set("symbol", symbol);
              url.searchParams.set("interval", interval);
              url.searchParams.set("start", `${cursorTime}`);
              url.searchParams.set("limit", `${_ExchangeMethodsBybit.MAX_LIMIT}`);
              const res = yield fetch(url.toString());
              if (!res.ok) throw new Error(`Bybit Spot OHLCV fetch failed (${res.status})`);
              const json = yield res.json();
              if (json.retCode !== 0) throw new Error(`Bybit Spot API error: ${json.retMsg}`);
              const list = (_b = (_a = json.result) == null ? void 0 : _a.list) != null ? _b : [];
              if (list.length === 0) break;
              list.reverse();
              for (const item of list) {
                const startMs = Number(item[0]);
                const endMs = startMs + timeFrame.asMilliseconds() - 1;
                if (startMs >= endTimeMsExclusive) {
                  break;
                }
                if (startMs < cursorTime) {
                  continue;
                }
                const entry = new OhlcvEntry();
                entry.update(
                  timeFrame,
                  +item[1],
                  // open
                  +item[2],
                  // high
                  +item[3],
                  // low
                  +item[4],
                  // close
                  +item[5],
                  // volume
                  startMs,
                  endMs,
                  endMs < endTimeMsExclusive
                  // isClosed
                );
                if (entry.isClosed) {
                  toReturn.push(entry);
                }
              }
              const lastRawStartTime = Number(list[list.length - 1][0]);
              cursorTime = lastRawStartTime + timeFrame.asMilliseconds();
              if (list.length < _ExchangeMethodsBybit.MAX_LIMIT) break;
            }
            for (let i = 1; i < toReturn.length; i++) {
              if (toReturn[i].startTime < toReturn[i - 1].startTime) {
                throw new Error("Non-ascending candles returned by Bybit");
              }
            }
            return toReturn;
          });
        }
      };
      _ExchangeMethodsBybit.BASE_URL = "https://api.bybit.com";
      _ExchangeMethodsBybit.MAX_LIMIT = 1e3;
      ExchangeMethodsBybit = _ExchangeMethodsBybit;
    }
  });

  // ts_libs/ts_worker/infrastructure/time/TimeProviderBase.ts
  var TimeProviderBase;
  var init_TimeProviderBase = __esm({
    "ts_libs/ts_worker/infrastructure/time/TimeProviderBase.ts"() {
      "use strict";
      TimeProviderBase = class _TimeProviderBase {
        /**
         * Fetch unified server time from local. Optionally checks time skew.
         *
         * If skew <= MAX_ALLOWED_SKEW_MS → return the lowest time.
         * If skew > MAX_ALLOWED_SKEW_MS → throw.
         *
         * @param checkForTimeSkew - whether to check for time skew
         * @returns unified server time in milliseconds
         * @throws Error if clock skew exceeds threshold
         */
        getUtcNowMilliseconds(checkForTimeSkew = false) {
          return __async(this, null, function* () {
            throw new Error("Not implemented");
          });
        }
        /**
         * Format a timestamp (ms) to a human-readable UTC string.
         *
         * Format: YYYY-MM-DD HH:mm:ss.SSS UTC
         *
         * @param timestampMs - timestamp in milliseconds
         * @returns formatted UTC string
         */
        static formatUtc(timestampMs) {
          if (!Number.isFinite(timestampMs)) {
            throw new TypeError("timestampMs must be a finite number");
          }
          const d = new Date(timestampMs);
          const yyyy = d.getUTCFullYear();
          const mm = _TimeProviderBase.pad(d.getUTCMonth() + 1, 2);
          const dd = _TimeProviderBase.pad(d.getUTCDate(), 2);
          const hh = _TimeProviderBase.pad(d.getUTCHours(), 2);
          const mi = _TimeProviderBase.pad(d.getUTCMinutes(), 2);
          const ss = _TimeProviderBase.pad(d.getUTCSeconds(), 2);
          const ms = _TimeProviderBase.pad(d.getUTCMilliseconds(), 3);
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms} UTC`;
        }
        /**
         * Left-pad a number with zeros
         * @param value - number to pad
         * @param width - desired width
         * @returns zero-padded string
         */
        static pad(value, width) {
          let s = String(value);
          while (s.length < width) {
            s = "0" + s;
          }
          return s;
        }
      };
    }
  });

  // ts_libs/ts_worker/infrastructure/time/TimeProvider.ts
  var _TimeProvider_instances, fetchBinanceTime_fn, _TimeProvider, TimeProvider;
  var init_TimeProvider = __esm({
    "ts_libs/ts_worker/infrastructure/time/TimeProvider.ts"() {
      "use strict";
      init_TimeProviderBase();
      _TimeProvider = class _TimeProvider extends TimeProviderBase {
        constructor() {
          super();
          __privateAdd(this, _TimeProvider_instances);
        }
        /**
         * Fetch unified server time from Local. Optionally checks time skew.
         *
         * If skew <= MAX_ALLOWED_SKEW_MS → returns the lowest time.
         * If skew > MAX_ALLOWED_SKEW_MS → throws an Error.
         *
         * @param checkForTimeSkew - whether to check clock skew
         * @returns unified server time in milliseconds
         * @throws Error if clock skew exceeds threshold
         */
        getUtcNowMilliseconds(checkForTimeSkew = false) {
          return __async(this, null, function* () {
            const localTime = Date.now();
            if (!checkForTimeSkew) {
              return localTime;
            }
            const binanceTime = yield __privateMethod(this, _TimeProvider_instances, fetchBinanceTime_fn).call(this);
            if (!Number.isFinite(binanceTime) || !Number.isFinite(localTime)) {
              throw new Error("Invalid server time received");
            }
            const skew = Math.abs(binanceTime - localTime);
            if (skew > _TimeProvider.MAX_ALLOWED_SKEW_MS) {
              throw new Error(
                `Time skew too large: ${skew} ms (Binance=${binanceTime}, LocalTime=${localTime})`
              );
            }
            return Math.min(binanceTime, localTime);
          });
        }
      };
      _TimeProvider_instances = new WeakSet();
      fetchBinanceTime_fn = function() {
        return __async(this, null, function* () {
          const res = yield fetch("https://api.binance.com/api/v3/time");
          if (!res.ok) {
            throw new Error(`Binance time fetch failed (${res.status})`);
          }
          const json = yield res.json();
          if (!Number.isFinite(json.serverTime)) {
            throw new Error("Invalid Binance time response");
          }
          return json.serverTime;
        });
      };
      /** Maximum allowed clock skew in milliseconds (10 seconds) */
      _TimeProvider.MAX_ALLOWED_SKEW_MS = 1e4;
      TimeProvider = _TimeProvider;
    }
  });

  // ts_libs/ts_worker/domain/ta/core/Period.ts
  var Period;
  var init_Period = __esm({
    "ts_libs/ts_worker/domain/ta/core/Period.ts"() {
      "use strict";
      Period = class _Period {
        /**
         * @param aValue Must be a positive integer ≥ 2
         */
        constructor(aValue) {
          if (!Number.isInteger(aValue)) {
            throw new TypeError(
              `Period value must be an integer, got ${aValue}`
            );
          }
          if (aValue < 2) {
            throw new RangeError(
              `Period value must be at least 2, got ${aValue}`
            );
          }
          this.value = aValue;
          Object.freeze(this);
        }
        getValue() {
          return this.value;
        }
        /**
         * Runtime validation / normalization helper
         * Accepts a Period or an integer.
         *
         * @param value unknown
         * @throws TypeError | RangeError
         */
        static fromUnknown(value) {
          if (value instanceof _Period) {
            return value;
          }
          if (typeof value === "number") {
            return new _Period(value);
          }
          throw new TypeError(
            `Value must be a Period or an integer, got ${typeof value}`
          );
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/core/Source.ts
  var _VALUES2, _Source, Source;
  var init_Source = __esm({
    "ts_libs/ts_worker/domain/ta/core/Source.ts"() {
      "use strict";
      _Source = class _Source {
        /**
         * @param label Unique label for the source
         * @param extractor Function to extract the value from an OhlcvEntry
         */
        constructor(label, extractor) {
          if (__privateGet(_Source, _VALUES2).has(label)) {
            throw new Error(`Source with label "${label}" already exists`);
          }
          this.label = label;
          this.extract = extractor;
          __privateGet(_Source, _VALUES2).set(label, this);
          Object.freeze(this);
        }
        /**
         * Get a Source instance by its label
         * @param label
         * @returns Source
         */
        static get(label) {
          const value = __privateGet(_Source, _VALUES2).get(label);
          if (!value) throw new RangeError(`Unknown source: ${label}`);
          return value;
        }
        /**
         * Get all Source values
         */
        static values() {
          return Array.from(__privateGet(_Source, _VALUES2).values());
        }
        /**
         * Check equality with another Source
         * @param other unknown
         */
        equals(other) {
          return other instanceof _Source && this.label === other.label;
        }
        /**
         * Runtime validation helper
         * @param value unknown
         */
        static fromUnknown(value) {
          if (!(value instanceof _Source)) {
            throw new TypeError("Value is not a Source");
          }
          return value;
        }
      };
      _VALUES2 = new WeakMap();
      // Private map of all source instances
      __privateAdd(_Source, _VALUES2, /* @__PURE__ */ new Map());
      // Predefined sources
      _Source.OPEN = new _Source("open", (entry) => entry.open);
      _Source.HIGH = new _Source("high", (entry) => entry.high);
      _Source.LOW = new _Source("low", (entry) => entry.low);
      _Source.CLOSE = new _Source("close", (entry) => entry.close);
      _Source.VOLUME = new _Source("volume", (entry) => entry.volume);
      _Source.TYPICAL = new _Source(
        "typical",
        (entry) => (entry.high + entry.low + entry.close) / 3
      );
      _Source.MEDIAN = new _Source(
        "median",
        (entry) => (entry.high + entry.low) / 2
      );
      Source = _Source;
    }
  });

  // ts_libs/ts_worker/domain/ta/core/MutableFloat.ts
  var _value, MutableFloat;
  var init_MutableFloat = __esm({
    "ts_libs/ts_worker/domain/ta/core/MutableFloat.ts"() {
      "use strict";
      MutableFloat = class {
        /**
         * @param initial Initial value (default 0)
         */
        constructor(initial = 0) {
          __privateAdd(this, _value);
          __privateSet(this, _value, 0);
          this.update(initial);
        }
        /**
         * Get the current value
         */
        getValue() {
          return __privateGet(this, _value);
        }
        /**
         * Update the value
         * @param data New number
         */
        update(data) {
          if (typeof data !== "number" || !Number.isFinite(data)) {
            throw new TypeError("Data must be a finite number");
          }
          __privateSet(this, _value, data);
        }
      };
      _value = new WeakMap();
    }
  });

  // ts_libs/ts_worker/domain/ta/core/RollingExtreme.ts
  var RollingExtreme;
  var init_RollingExtreme = __esm({
    "ts_libs/ts_worker/domain/ta/core/RollingExtreme.ts"() {
      "use strict";
      init_RingBuffer();
      init_MutableFloat();
      init_Period();
      RollingExtreme = class {
        constructor(period, isMoreExtreme) {
          this.period = Period.fromUnknown(period).getValue();
          if (this.period < 1) {
            throw new RangeError(
              "RollingExtreme period must be >= 1"
            );
          }
          this.values = new RingBuffer(this.period, () => new MutableFloat(0));
          this.isMoreExtreme = isMoreExtreme;
        }
        push(value) {
          if (!Number.isFinite(value)) {
            throw new RangeError(
              "RollingExtreme value must be finite"
            );
          }
          this.values.push((s) => s.update(value));
          if (this.values.getSize() < this.period)
            return null;
          let extreme = this.values.get(0);
          for (let i = 1; i < this.period; i++) {
            const candidate = this.values.get(i);
            if (this.isMoreExtreme(candidate, extreme)) {
              extreme = candidate;
            }
          }
          return extreme.getValue();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/export/IndicatorAccessor.ts
  var IndicatorAccessor;
  var init_IndicatorAccessor = __esm({
    "ts_libs/ts_worker/domain/ta/export/IndicatorAccessor.ts"() {
      "use strict";
      IndicatorAccessor = class {
        constructor(plugin, params) {
          this.plugin = plugin;
          this.params = params;
        }
        get(tradingPair, position = 0) {
          const indicator = this.plugin.findIndicator(tradingPair, this.params);
          return indicator.getValue(position);
        }
        getParameters() {
          return this.params;
        }
        pending(tradingPair) {
          return this.plugin.findIndicator(tradingPair, this.params).getPendingValue();
        }
        isReady(tradingPair) {
          return this.plugin.findIndicator(tradingPair, this.params).isReady();
        }
        getValuesCount(tradingPair) {
          return this.plugin.findIndicator(tradingPair, this.params).getValuesCount();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/Indicator.ts
  var IndicatorOutput, IndicatorParameters, Indicator;
  var init_Indicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/Indicator.ts"() {
      "use strict";
      IndicatorOutput = class {
      };
      IndicatorParameters = class _IndicatorParameters {
        /**
         * Compare parameters by identifier
         * @param other unknown
         */
        equals(other) {
          try {
            if (other instanceof _IndicatorParameters) {
              return this.getId() === other.getId();
            }
            return false;
          } catch (e) {
            return false;
          }
        }
      };
      Indicator = class {
        constructor(parameters) {
          if (!(parameters instanceof IndicatorParameters)) {
            throw new TypeError(
              "Invalid indicator parameters"
            );
          }
          this.parameters = parameters;
        }
        getParameters() {
          return this.parameters;
        }
        getId() {
          return this.parameters.getId();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/DonchianChannels.ts
  var _high, _middle, _low, DonchianChannelsIndicatorOutput, DonchianChannelsIndicatorParameters, _DonchianChannelsIndicator_instances, computeCore_fn, DonchianChannelsIndicator, DonchianChannelsAccessor;
  var init_DonchianChannels = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/DonchianChannels.ts"() {
      "use strict";
      init_RingBuffer();
      init_MultiTimeframeOhlcv();
      init_TimeFrame();
      init_MutableFloat();
      init_Period();
      init_RollingExtreme();
      init_Source();
      init_IndicatorAccessor();
      init_Indicator();
      DonchianChannelsIndicatorOutput = class extends IndicatorOutput {
        constructor() {
          super();
          __privateAdd(this, _high);
          __privateAdd(this, _middle);
          __privateAdd(this, _low);
          __privateSet(this, _high, new MutableFloat(0));
          __privateSet(this, _middle, new MutableFloat(0));
          __privateSet(this, _low, new MutableFloat(0));
        }
        update(high, middle, low) {
          __privateGet(this, _high).update(high);
          __privateGet(this, _middle).update(middle);
          __privateGet(this, _low).update(low);
        }
        getHigh() {
          return __privateGet(this, _high).getValue();
        }
        getMiddle() {
          return __privateGet(this, _middle).getValue();
        }
        getLow() {
          return __privateGet(this, _low).getValue();
        }
      };
      _high = new WeakMap();
      _middle = new WeakMap();
      _low = new WeakMap();
      DonchianChannelsIndicatorParameters = class _DonchianChannelsIndicatorParameters extends IndicatorParameters {
        constructor(timeFrame, period, highSource, lowSource) {
          super();
          this.timeFrame = TimeFrame.fromUnknown(timeFrame);
          this.period = Period.fromUnknown(period);
          this.highSource = Source.fromUnknown(highSource);
          this.lowSource = Source.fromUnknown(lowSource);
        }
        getId() {
          return `DONCHIAN CHANNELS (${this.period.getValue()}, ${this.highSource.label}, ${this.lowSource.label}, ${this.timeFrame.getLabel()})`;
        }
        getDescription() {
          return `Donchian Channels (${this.period.getValue()}, ${this.highSource.label}, ${this.lowSource.label}, ${this.timeFrame.getLabel()})`;
        }
        getPeriod() {
          return this.period;
        }
        getTimeFrame() {
          return this.timeFrame;
        }
        getHighSource() {
          return this.highSource;
        }
        getLowSource() {
          return this.lowSource;
        }
        createUsing(buffer) {
          return new DonchianChannelsIndicator(this, buffer);
        }
        static fromUnknown(value) {
          if (!(value instanceof _DonchianChannelsIndicatorParameters)) {
            throw new TypeError(
              "Value is not a DonchianChannelsIndicatorParameters instance"
            );
          }
          if (value.period.getValue() < 1) {
            throw new RangeError(
              "Donchian Channels period must be >= 1"
            );
          }
          return value;
        }
      };
      DonchianChannelsIndicator = class extends Indicator {
        constructor(parameters, mtf) {
          super(
            DonchianChannelsIndicatorParameters.fromUnknown(parameters)
          );
          __privateAdd(this, _DonchianChannelsIndicator_instances);
          this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
          const period = this.getParameters().getPeriod();
          this.rollingHigh = new RollingExtreme(
            period,
            (candidate, currentExtreme) => candidate.getValue() > currentExtreme.getValue()
          );
          this.rollingLow = new RollingExtreme(
            period,
            (candidate, currentExtreme) => candidate.getValue() < currentExtreme.getValue()
          );
          const candleBuffer = this.mtf.getBuffer(
            this.getParameters().getTimeFrame()
          );
          this.history = new RingBuffer(
            candleBuffer.getCapacity(),
            () => new DonchianChannelsIndicatorOutput()
          );
          candleBuffer.stream((_position, candle) => {
            __privateMethod(this, _DonchianChannelsIndicator_instances, computeCore_fn).call(this, this.getParameters().getHighSource().extract(candle), this.getParameters().getLowSource().extract(candle));
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update(timeFrame) {
          const thisTf = this.getParameters().getTimeFrame();
          if (timeFrame != thisTf) {
            return;
          }
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const high = this.getParameters().getHighSource().extract(candle);
          const low = this.getParameters().getLowSource().extract(candle);
          __privateMethod(this, _DonchianChannelsIndicator_instances, computeCore_fn).call(this, high, low);
        }
        getValue(n = 0) {
          return this.history.get(n);
        }
        getValuesCount() {
          return this.history.getSize();
        }
        getPendingValue() {
          throw new Error("Method not implemented.");
        }
      };
      _DonchianChannelsIndicator_instances = new WeakSet();
      computeCore_fn = function(high, low) {
        const channelHigh = this.rollingHigh.push(high);
        const channelLow = this.rollingLow.push(low);
        if (channelHigh === null || channelLow === null) {
          return;
        }
        const channelMiddle = (channelHigh + channelLow) / 2;
        this.history.push((output) => {
          output.update(
            channelHigh,
            channelMiddle,
            channelLow
          );
        });
      };
      DonchianChannelsAccessor = class extends IndicatorAccessor {
        findIndicatorOrThrow(aTp) {
          const indicator = this.plugin.findIndicator(aTp, this.getParameters());
          if (!(indicator instanceof DonchianChannelsIndicator)) throw new Error("Indicator is not a DonchianChannelsIndicator");
          return indicator;
        }
        getHigh(aTp, n = 0) {
          const indicator = this.findIndicatorOrThrow(aTp);
          return indicator.getValue(n).getHigh();
        }
        getLow(aTp, n = 0) {
          const indicator = this.findIndicatorOrThrow(aTp);
          return indicator.getValue(n).getLow();
        }
        getMiddle(aTp, n = 0) {
          const indicator = this.findIndicatorOrThrow(aTp);
          return indicator.getValue(n).getMiddle();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/core/MathContext.ts
  var _MathContext, MathContext;
  var init_MathContext = __esm({
    "ts_libs/ts_worker/domain/ta/core/MathContext.ts"() {
      "use strict";
      _MathContext = class _MathContext {
        /**
         * Round a number to the defined scale
         * @param value - The number to round
         * @returns The rounded number
         */
        static roundToScale(value) {
          if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new TypeError("value must be a finite number");
          }
          return Math.round(value * _MathContext.SCALE) / _MathContext.SCALE;
        }
      };
      /** Scaling factor */
      _MathContext.SCALE = 1e8;
      MathContext = _MathContext;
    }
  });

  // ts_libs/ts_worker/domain/ta/core/PeriodPercentChange.ts
  var PeriodPercentChange;
  var init_PeriodPercentChange = __esm({
    "ts_libs/ts_worker/domain/ta/core/PeriodPercentChange.ts"() {
      "use strict";
      init_RingBuffer();
      init_MathContext();
      init_MutableFloat();
      init_Period();
      PeriodPercentChange = class {
        constructor(period) {
          this.period = Period.fromUnknown(period);
          this.buffer = new RingBuffer(this.period.getValue(), () => new MutableFloat(0));
        }
        /**
             * Add a new value and compute 
             * @param {number} value
             * @returns {number | null} Current PCT_CHANGE or null if not ready or undefined on division by zero error
             */
        push(value) {
          const periodValue = this.period.getValue();
          this.buffer.push((s) => s.update(value));
          if (this.buffer.getSize() < periodValue) {
            return null;
          }
          const oldest = this.buffer.get(periodValue - 1).getValue();
          const current = this.buffer.get().getValue();
          if (oldest === 0) {
            return void 0;
          }
          const pctChange = (current - oldest) / oldest * 100;
          return MathContext.roundToScale(pctChange);
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/PctChangeIndicator.ts
  var _value2, PctChangeIndicatorOutput, PctChangeIndicatorParameters, _PctChangeIndicator_instances, computeCore_fn2, PctChangeIndicator, PctChangeAccessor;
  var init_PctChangeIndicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/PctChangeIndicator.ts"() {
      "use strict";
      init_RingBuffer();
      init_MultiTimeframeOhlcv();
      init_TimeFrame();
      init_MutableFloat();
      init_Period();
      init_Source();
      init_Indicator();
      init_PeriodPercentChange();
      init_IndicatorAccessor();
      PctChangeIndicatorOutput = class extends IndicatorOutput {
        constructor() {
          super();
          __privateAdd(this, _value2);
          __privateSet(this, _value2, new MutableFloat());
        }
        update(argValue) {
          __privateGet(this, _value2).update(argValue);
        }
        getValue() {
          return __privateGet(this, _value2).getValue();
        }
      };
      _value2 = new WeakMap();
      PctChangeIndicatorParameters = class _PctChangeIndicatorParameters extends IndicatorParameters {
        constructor(timeFrame, period, source) {
          super();
          this.timeFrame = TimeFrame.fromUnknown(timeFrame);
          this.period = Period.fromUnknown(period);
          this.source = Source.fromUnknown(source);
        }
        getId() {
          return `PCT_CHANGE (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
        }
        getDescription() {
          return `Percent change (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
        }
        getPeriod() {
          return this.period;
        }
        getTimeFrame() {
          return this.timeFrame;
        }
        getSource() {
          return this.source;
        }
        static fromUnknown(value) {
          if (!(value instanceof _PctChangeIndicatorParameters)) {
            throw new TypeError("Value is not a PctChangeIndicatorParameters instance");
          }
          if (value.getPeriod().getValue() < 2) {
            throw new RangeError("PctChange period must be >= 2");
          }
          return value;
        }
        createUsing(buffer) {
          return new PctChangeIndicator(this, buffer);
        }
      };
      PctChangeIndicator = class extends Indicator {
        constructor(parameters, mtf) {
          super(PctChangeIndicatorParameters.fromUnknown(parameters));
          __privateAdd(this, _PctChangeIndicator_instances);
          this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
          this.history = new RingBuffer(
            mtf.getBuffer(parameters.getTimeFrame()).getCapacity(),
            () => new PctChangeIndicatorOutput()
          );
          this.impl = new PeriodPercentChange(this.getParameters().getPeriod());
          this.mtf.getBuffer(parameters.getTimeFrame()).stream((position, candle) => {
            const extracted = parameters.getSource().extract(candle);
            __privateMethod(this, _PctChangeIndicator_instances, computeCore_fn2).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update(timeFrame) {
          const thisTf = this.getParameters().getTimeFrame();
          if (timeFrame != thisTf) {
            return;
          }
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _PctChangeIndicator_instances, computeCore_fn2).call(this, extracted);
        }
        getValue(n = 0) {
          return this.history.get(n);
        }
        getValuesCount() {
          return this.history.getSize();
        }
        getPendingValue() {
          throw new Error("Method not implemented.");
        }
      };
      _PctChangeIndicator_instances = new WeakSet();
      computeCore_fn2 = function(value) {
        let pctChange = this.impl.push(value);
        if (pctChange === null) {
          return;
        }
        if (pctChange === void 0) {
          this.history.push((sample) => sample.update(0));
        } else {
          this.history.push((sample) => sample.update(pctChange));
        }
      };
      PctChangeAccessor = class extends IndicatorAccessor {
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/core/RollingSimpleMovingAverage.ts
  var RollingSimpleMovingAverage;
  var init_RollingSimpleMovingAverage = __esm({
    "ts_libs/ts_worker/domain/ta/core/RollingSimpleMovingAverage.ts"() {
      "use strict";
      init_MutableFloat();
      init_RingBuffer();
      init_MathContext();
      init_Period();
      RollingSimpleMovingAverage = class {
        constructor(period) {
          this.period = Period.fromUnknown(period);
          this.buffer = new RingBuffer(this.period.getValue(), () => new MutableFloat(0));
          this.sum = 0;
        }
        /**
         * Add a new value and update the average
         * @param {number} value
         * @returns {number | null} Current SMA or null if not ready
         */
        push(value) {
          if (this.buffer.getSize() === this.period.getValue()) {
            const oldest = this.buffer.get(this.period.getValue() - 1);
            this.sum -= oldest.getValue();
          }
          this.buffer.push((s) => s.update(value));
          this.sum += value;
          if (!this.isReady()) {
            return null;
          }
          let computedValue = this.sum / this.period.getValue();
          return MathContext.roundToScale(computedValue);
        }
        isReady() {
          return this.buffer.getSize() === this.period.getValue();
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/core/RelativeStrengthIndex.ts
  var RelativeStrengthIndex;
  var init_RelativeStrengthIndex = __esm({
    "ts_libs/ts_worker/domain/ta/core/RelativeStrengthIndex.ts"() {
      "use strict";
      init_Period();
      init_RollingSimpleMovingAverage();
      init_MathContext();
      RelativeStrengthIndex = class {
        constructor(period, useWilderSmoothing = true) {
          this.prev = null;
          this.avgGain = null;
          this.avgLoss = null;
          this.period = Period.fromUnknown(period);
          this.useWilderSmoothing = useWilderSmoothing;
          this.gainSma = new RollingSimpleMovingAverage(this.period);
          this.lossSma = new RollingSimpleMovingAverage(this.period);
        }
        push(value) {
          if (this.prev === null) {
            this.prev = value;
            return null;
          }
          const delta = value - this.prev;
          this.prev = value;
          const gain = delta > 0 ? delta : 0;
          const loss = delta < 0 ? -delta : 0;
          if (this.avgGain === null || this.avgLoss === null) {
            const g = this.gainSma.push(gain);
            const l = this.lossSma.push(loss);
            if (g === null || l === null) {
              return null;
            }
            this.avgGain = g;
            this.avgLoss = l;
            return this.computeRsi();
          }
          if (this.useWilderSmoothing) {
            const p = this.period.getValue();
            this.avgGain = (this.avgGain * (p - 1) + gain) / p;
            this.avgLoss = (this.avgLoss * (p - 1) + loss) / p;
          } else {
            this.avgGain = this.gainSma.push(gain);
            this.avgLoss = this.lossSma.push(loss);
          }
          return this.computeRsi();
        }
        computeRsi() {
          if (this.avgLoss === 0) {
            return 100;
          }
          const rs = this.avgGain / this.avgLoss;
          const rsi = 100 - 100 / (1 + rs);
          return MathContext.roundToScale(rsi);
        }
        isReady() {
          return this.avgGain !== null;
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/RsiIndicator.ts
  var _value3, RsiIndicatorOutput, RsiIndicatorParameters, _RsiIndicator_instances, computeCore_fn3, RsiIndicator, RsiAccessor;
  var init_RsiIndicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/RsiIndicator.ts"() {
      "use strict";
      init_RingBuffer();
      init_MultiTimeframeOhlcv();
      init_TimeFrame();
      init_MutableFloat();
      init_Period();
      init_Source();
      init_Indicator();
      init_RelativeStrengthIndex();
      init_IndicatorAccessor();
      RsiIndicatorOutput = class extends IndicatorOutput {
        constructor() {
          super();
          __privateAdd(this, _value3);
          __privateSet(this, _value3, new MutableFloat());
        }
        update(argValue) {
          __privateGet(this, _value3).update(argValue);
        }
        getValue() {
          return __privateGet(this, _value3).getValue();
        }
      };
      _value3 = new WeakMap();
      RsiIndicatorParameters = class _RsiIndicatorParameters extends IndicatorParameters {
        constructor(timeFrame, period, source, useWilderSmoothing = true) {
          super();
          this.timeFrame = TimeFrame.fromUnknown(timeFrame);
          this.period = Period.fromUnknown(period);
          this.source = Source.fromUnknown(source);
          this.useWilderSmoothing = Boolean(useWilderSmoothing);
        }
        getId() {
          return `RSI (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()}, ${this.useWilderSmoothing ? "Wilder" : "SMA"})`;
        }
        getDescription() {
          return `Rsi (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
        }
        getPeriod() {
          return this.period;
        }
        getTimeFrame() {
          return this.timeFrame;
        }
        getSource() {
          return this.source;
        }
        useWilder() {
          return this.useWilderSmoothing;
        }
        static fromUnknown(value) {
          if (!(value instanceof _RsiIndicatorParameters)) {
            throw new TypeError("Value is not a RsiIndicatorParameters instance");
          }
          if (value.getPeriod().getValue() < 2) {
            throw new RangeError("RSI period must be >= 2");
          }
          return value;
        }
        createUsing(buffer) {
          return new RsiIndicator(this, buffer);
        }
      };
      RsiIndicator = class extends Indicator {
        constructor(parameters, mtf) {
          super(RsiIndicatorParameters.fromUnknown(parameters));
          __privateAdd(this, _RsiIndicator_instances);
          this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
          this.rolling = new RelativeStrengthIndex(
            parameters.getPeriod(),
            parameters.useWilderSmoothing
          );
          this.history = new RingBuffer(
            mtf.getBuffer(parameters.getTimeFrame()).getCapacity(),
            () => new RsiIndicatorOutput()
          );
          this.mtf.getBuffer(parameters.getTimeFrame()).stream((position, candle) => {
            const extracted = parameters.getSource().extract(candle);
            __privateMethod(this, _RsiIndicator_instances, computeCore_fn3).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update(timeFrame) {
          const thisTf = this.getParameters().getTimeFrame();
          if (timeFrame != thisTf) {
            return;
          }
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _RsiIndicator_instances, computeCore_fn3).call(this, extracted);
        }
        getValue(n = 0) {
          return this.history.get(n);
        }
        getValuesCount() {
          return this.history.getSize();
        }
        getPendingValue() {
          throw new Error("Method not implemented.");
        }
      };
      _RsiIndicator_instances = new WeakSet();
      computeCore_fn3 = function(value) {
        const computed = this.rolling.push(value);
        if (computed === null) {
          return;
        }
        this.history.push((sample) => sample.update(computed));
      };
      RsiAccessor = class extends IndicatorAccessor {
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/RvaIndicator.ts
  var _volumeSma, _relativeValue, RvaIndicatorOutput, RvaIndicatorParameters, _RvaIndicator_instances, computeCore_fn4, RvaIndicator, RvaAccessor;
  var init_RvaIndicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/RvaIndicator.ts"() {
      "use strict";
      init_RingBuffer();
      init_MultiTimeframeOhlcv();
      init_TimeFrame();
      init_MutableFloat();
      init_Period();
      init_Indicator();
      init_RollingSimpleMovingAverage();
      init_Source();
      init_IndicatorAccessor();
      RvaIndicatorOutput = class extends IndicatorOutput {
        constructor() {
          super();
          __privateAdd(this, _volumeSma);
          __privateAdd(this, _relativeValue);
          __privateSet(this, _volumeSma, new MutableFloat());
          __privateSet(this, _relativeValue, new MutableFloat());
        }
        update(volumeSma, relativeValue) {
          __privateGet(this, _volumeSma).update(volumeSma);
          __privateGet(this, _relativeValue).update(relativeValue);
        }
        getVolumeSma() {
          return __privateGet(this, _volumeSma).getValue();
        }
        getRelativeValue() {
          return __privateGet(this, _relativeValue).getValue();
        }
      };
      _volumeSma = new WeakMap();
      _relativeValue = new WeakMap();
      RvaIndicatorParameters = class _RvaIndicatorParameters extends IndicatorParameters {
        constructor(timeFrame, period) {
          super();
          this.timeFrame = TimeFrame.fromUnknown(timeFrame);
          this.period = Period.fromUnknown(period);
          this.source = Source.VOLUME;
        }
        getId() {
          return `RVA (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
        }
        getDescription() {
          return `Rva (${this.period.getValue()}, ${this.timeFrame.getLabel()})`;
        }
        getPeriod() {
          return this.period;
        }
        getTimeFrame() {
          return this.timeFrame;
        }
        getSource() {
          return this.source;
        }
        createUsing(buffer) {
          return new RvaIndicator(this, buffer);
        }
        static fromUnknown(value) {
          if (!(value instanceof _RvaIndicatorParameters)) {
            throw new TypeError("Value is not an RvaIndicatorParameters instance");
          }
          if (value.period.getValue() < 2) {
            throw new RangeError("RVA period must be >= 2");
          }
          return value;
        }
      };
      RvaIndicator = class extends Indicator {
        constructor(parameters, mtf) {
          super(RvaIndicatorParameters.fromUnknown(parameters));
          __privateAdd(this, _RvaIndicator_instances);
          this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
          this.rolling = new RollingSimpleMovingAverage(this.getParameters().getPeriod());
          this.history = new RingBuffer(
            this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCapacity(),
            () => new RvaIndicatorOutput()
          );
          this.pending = new RvaIndicatorOutput();
          this.mtf.getBuffer(this.getParameters().getTimeFrame()).stream((position, candle) => {
            const volume = candle.volume;
            __privateMethod(this, _RvaIndicator_instances, computeCore_fn4).call(this, volume);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        /** Call when a new candle is available */
        update(timeFrame) {
          const thisTf = this.getParameters().getTimeFrame();
          if (timeFrame != thisTf) {
            return;
          }
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const volume = candle.volume;
          __privateMethod(this, _RvaIndicator_instances, computeCore_fn4).call(this, volume);
        }
        getValue(n = 0) {
          const value = this.history.get(n);
          if (!value) throw new RangeError("RVA value not available");
          return value;
        }
        getPendingValue() {
          if (!this.isReady()) {
            throw new RangeError("RVA value is not ready.");
          }
          const pendingCandle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getPendingCandle();
          const pendingVolume = pendingCandle.volume;
          if (!Number.isFinite(pendingVolume)) {
            throw new RangeError("RVA value cannot be computed due to pending value issues.");
          }
          const closedVolumeSma = this.getValue().getVolumeSma();
          if (!Number.isFinite(closedVolumeSma) || closedVolumeSma === 0) {
            this.pending.update(0, 0);
            return this.pending;
          }
          const relativeValue = pendingVolume / closedVolumeSma;
          this.pending.update(closedVolumeSma, relativeValue);
          return this.pending;
        }
        getValuesCount() {
          return this.history.getSize();
        }
      };
      _RvaIndicator_instances = new WeakSet();
      computeCore_fn4 = function(volume) {
        if (!Number.isFinite(volume)) {
          throw new RangeError("Cannot push infinite values to RVA");
        }
        const volumeSma = this.rolling.push(volume);
        if (volumeSma === null) {
          return;
        }
        if (!Number.isFinite(volumeSma)) {
          throw new Error("RVA infinite value detected.");
        }
        if (volumeSma !== 0) {
          const relativeValue = volume / volumeSma;
          this.history.push((sample) => sample.update(volumeSma, relativeValue));
        } else {
          this.history.push((sample) => sample.update(0, 0));
        }
      };
      RvaAccessor = class extends IndicatorAccessor {
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/SmaIndicator.ts
  var _value4, SmaIndicatorOutput, SmaIndicatorParameters, _SmaIndicator_instances, computeCore_fn5, SmaIndicator, SmaAccessor;
  var init_SmaIndicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/SmaIndicator.ts"() {
      "use strict";
      init_RingBuffer();
      init_MultiTimeframeOhlcv();
      init_TimeFrame();
      init_MutableFloat();
      init_Period();
      init_Source();
      init_Indicator();
      init_RollingSimpleMovingAverage();
      init_IndicatorAccessor();
      SmaIndicatorOutput = class extends IndicatorOutput {
        constructor() {
          super();
          __privateAdd(this, _value4);
          __privateSet(this, _value4, new MutableFloat());
        }
        update(argValue) {
          __privateGet(this, _value4).update(argValue);
        }
        getValue() {
          return __privateGet(this, _value4).getValue();
        }
      };
      _value4 = new WeakMap();
      SmaIndicatorParameters = class _SmaIndicatorParameters extends IndicatorParameters {
        constructor(timeFrame, period, source) {
          super();
          this.timeFrame = TimeFrame.fromUnknown(timeFrame);
          this.period = Period.fromUnknown(period);
          this.source = Source.fromUnknown(source);
        }
        getId() {
          return `SMA (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
        }
        getDescription() {
          return `SMA (${this.period.getValue()}, ${this.source.label}, ${this.timeFrame.getLabel()})`;
        }
        getPeriod() {
          return this.period;
        }
        getTimeFrame() {
          return this.timeFrame;
        }
        getSource() {
          return this.source;
        }
        createUsing(buffer) {
          return new SmaIndicator(this, buffer);
        }
        static fromUnknown(value) {
          if (!(value instanceof _SmaIndicatorParameters)) {
            throw new TypeError("Value is not a SmaIndicatorParameters instance");
          }
          if (value.period.getValue() < 2) {
            throw new RangeError("SMA period must be >= 2");
          }
          return value;
        }
      };
      SmaIndicator = class extends Indicator {
        constructor(parameters, mtf) {
          super(SmaIndicatorParameters.fromUnknown(parameters));
          __privateAdd(this, _SmaIndicator_instances);
          this.mtf = MultiTimeframeOhlcv.fromUnknown(mtf);
          this.rolling = new RollingSimpleMovingAverage(this.getParameters().getPeriod());
          this.history = new RingBuffer(
            this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCapacity(),
            () => new SmaIndicatorOutput()
          );
          this.mtf.getBuffer(this.getParameters().getTimeFrame()).stream((position, candle) => {
            const extracted = this.getParameters().getSource().extract(candle);
            __privateMethod(this, _SmaIndicator_instances, computeCore_fn5).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update(timeFrame) {
          const thisTf = this.getParameters().getTimeFrame();
          if (timeFrame != thisTf) {
            return;
          }
          const candle = this.mtf.getBuffer(thisTf).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _SmaIndicator_instances, computeCore_fn5).call(this, extracted);
        }
        getValue(n = 0) {
          const value = this.history.get(n);
          if (!value) throw new RangeError("SMA value not available");
          return value;
        }
        getValuesCount() {
          return this.history.getSize();
        }
        getPendingValue() {
          throw new Error("Method not implemented.");
        }
        isBelowClose(n = 0) {
          const sourceTf = this.getParameters().getTimeFrame();
          if (n < 0 || n >= this.getValuesCount()) {
            throw new RangeError("SMA value not available");
          }
          const price = this.mtf.getBuffer(sourceTf).getClose(n);
          const value = this.getValue(n).getValue();
          return price > value;
        }
        isAboveClose(n = 0) {
          const sourceTf = this.getParameters().getTimeFrame();
          if (n < 0 || n >= this.getValuesCount()) {
            throw new RangeError("SMA value not available");
          }
          const price = this.mtf.getBuffer(sourceTf).getClose(n);
          const value = this.getValue(n).getValue();
          return price < value;
        }
        getSlopeAngle(nBarsAgo = 0, distance = 1) {
          if (!Number.isInteger(distance) || distance < 1) {
            throw new RangeError(
              `Distance must be a positive integer, got ${distance}`
            );
          }
          if (nBarsAgo < 0 || nBarsAgo >= this.history.getSize()) {
            throw new Error("nBarsAgo must be between 0 and history size");
          }
          if (nBarsAgo + distance >= this.history.getSize()) {
            throw new RangeError("Not enough data to compute slope");
          }
          const nBarsAgoValue = this.getValue(nBarsAgo).getValue();
          const nPlusDistanceBarsAgoValue = this.getValue(nBarsAgo + distance).getValue();
          const deltaY = nBarsAgoValue - nPlusDistanceBarsAgoValue;
          const deltaX = distance;
          const slopeRadians = Math.atan(deltaY / deltaX);
          const slopeDegrees = slopeRadians * (180 / Math.PI);
          return slopeDegrees;
        }
      };
      _SmaIndicator_instances = new WeakSet();
      computeCore_fn5 = function(value) {
        const computed = this.rolling.push(value);
        if (computed === null) return;
        this.history.push((sample) => sample.update(computed));
      };
      SmaAccessor = class extends IndicatorAccessor {
        findIndicatorOrThrow(aTp) {
          const indicator = this.plugin.findIndicator(aTp, this.getParameters());
          if (!(indicator instanceof SmaIndicator)) throw new Error("Indicator is not a SmaIndicator");
          return indicator;
        }
        isUptrend(aTp, n = 0) {
          const smaIndicator = this.findIndicatorOrThrow(aTp);
          return smaIndicator.isBelowClose(n) && smaIndicator.getSlopeAngle(n, 1) > 0;
        }
        isDowntrend(aTp, n = 0) {
          const smaIndicator = this.findIndicatorOrThrow(aTp);
          return smaIndicator.isAboveClose(n) && smaIndicator.getSlopeAngle(n, 1) < 0;
        }
        isCrossover(tp, another) {
          if (another.getValuesCount(tp) < 2 || this.getValuesCount(tp) < 2) {
            return false;
          }
          const previous = this.get(tp, 1).getValue() <= another.get(tp, 1).getValue();
          const current = this.get(tp, 0).getValue() > another.get(tp, 0).getValue();
          const toReturn = previous === true && current === true;
          return toReturn;
        }
        isCrossunder(tp, another) {
          if (another.getValuesCount(tp) < 2 || this.getValuesCount(tp) < 2) {
            return false;
          }
          const previous = this.get(tp, 1).getValue() >= another.get(tp, 1).getValue();
          const current = this.get(tp, 0).getValue() < another.get(tp, 0).getValue();
          const toReturn = previous === true && current === true;
          return toReturn;
        }
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/export/BasePlugin.ts
  var BasePlugin;
  var init_BasePlugin = __esm({
    "ts_libs/ts_worker/domain/ta/export/BasePlugin.ts"() {
      "use strict";
      init_Source();
      init_DonchianChannels();
      init_PctChangeIndicator();
      init_RsiIndicator();
      init_RvaIndicator();
      init_SmaIndicator();
      BasePlugin = class {
        constructor() {
          this.indicatorParameters = [];
        }
        transferContext(ctx) {
          this.ctx = ctx;
        }
        getIndicatorParameters() {
          return this.indicatorParameters;
        }
        addIndicatorParams(params) {
          let isRegistered = this.indicatorParameters.some((current) => current.equals(params));
          if (!isRegistered) {
            this.indicatorParameters.push(params);
          }
        }
        useSmaIndicator(timeFrame, period, source) {
          var params = new SmaIndicatorParameters(timeFrame, period, source);
          this.addIndicatorParams(params);
          return new SmaAccessor(this, params);
          ;
        }
        useRsiIndicator(timeFrame, period, source) {
          var params = new RsiIndicatorParameters(timeFrame, period, source);
          this.addIndicatorParams(params);
          return new RsiAccessor(this, params);
        }
        useRvaIndicator(timeFrame, period) {
          var params = new RvaIndicatorParameters(timeFrame, period);
          this.addIndicatorParams(params);
          return new RvaAccessor(this, params);
        }
        usePercentChangeIndicator(timeFrame, period, source) {
          var params = new PctChangeIndicatorParameters(timeFrame, period, source);
          this.addIndicatorParams(params);
          return new PctChangeAccessor(this, params);
        }
        useDonchianChannelsIndicator(timeFrame, period) {
          var params = new DonchianChannelsIndicatorParameters(timeFrame, period, Source.HIGH, Source.LOW);
          this.addIndicatorParams(params);
          return new DonchianChannelsAccessor(this, params);
        }
        getOhlcvData(tradingPair, source, timeframe, position) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.getOhlcvData(tradingPair, source, timeframe, position);
        }
        getOhlcvPendingData(tradingPair, source, timeframe) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.getOhlcvPendingData(tradingPair, source, timeframe);
        }
        getIndicatorValue(indicator, position) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.getIndicatorValue(indicator, position);
        }
        getPendingIndicatorValue(indicator) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.getPendingIndicatorValue(indicator);
        }
        getTradingPairs() {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.getTradingPairs();
        }
        isIndicatorReady(indicator) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.isIndicatorReady(indicator);
        }
        findIndicator(tradingPair, indicatorParameters) {
          if (this.ctx === void 0) {
            throw new Error("Context is not defined");
          }
          return this.ctx.findIndicator(tradingPair, indicatorParameters);
        }
        wasUpdated(updatedTimeFrames, timeFrame) {
          return updatedTimeFrames.get(timeFrame) === true;
        }
        close(tradingPair, timeFrame, position = 0) {
          return this.getOhlcvData(tradingPair, Source.CLOSE, timeFrame, position);
        }
        open(tradingPair, timeFrame, position = 0) {
          return this.getOhlcvData(
            tradingPair,
            Source.OPEN,
            timeFrame,
            position
          );
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/BaseFilterableAttributeExtractor.ts
  var BaseFilterableAttributeExtractor;
  var init_BaseFilterableAttributeExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/BaseFilterableAttributeExtractor.ts"() {
      "use strict";
      init_BasePlugin();
      init_NamedAttribute();
      BaseFilterableAttributeExtractor = class extends BasePlugin {
        constructor() {
          super(...arguments);
          this.values = /* @__PURE__ */ new Map();
        }
        getNamedAttributeMetadata() {
          return new NamedAttributeMetadata(this.getId(), this.getFriendlyDescription(), "boolean");
        }
        extractNamedAttributeFrom(tp) {
          let extracted = this.getValue(tp);
          return BooleanNamedAttribute.fromMetadata(this.getNamedAttributeMetadata(), extracted);
        }
        getValue(tp) {
          return this.values.get(tp);
        }
        setValue(tp, val) {
          this.values.set(tp, val);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/BaseSortableAttributeExtractor.ts
  var BaseSortableAttributeExtractor;
  var init_BaseSortableAttributeExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/BaseSortableAttributeExtractor.ts"() {
      "use strict";
      init_BasePlugin();
      init_NamedAttribute();
      BaseSortableAttributeExtractor = class extends BasePlugin {
        constructor() {
          super(...arguments);
          this.values = /* @__PURE__ */ new Map();
        }
        getNamedAttributeMetadata() {
          return new NamedAttributeMetadata(this.getId(), this.getFriendlyDescription(), "number", this.getPrecision());
        }
        extractNamedAttributeFrom(tp) {
          let extracted = this.getValue(tp);
          return NumericNamedAttribute.fromMetadata(this.getNamedAttributeMetadata(), extracted);
        }
        getValue(tp) {
          return this.values.get(tp);
        }
        setValue(tp, val) {
          this.values.set(tp, val);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/boolean_extractors/RsiOverboughtFilter.ts
  var RsiOverboughtFilter;
  var init_RsiOverboughtFilter = __esm({
    "ts_libs/ts_worker/application/plugins/boolean_extractors/RsiOverboughtFilter.ts"() {
      "use strict";
      init_Source();
      init_BaseFilterableAttributeExtractor();
      RsiOverboughtFilter = class extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame, overboughtTreshold) {
          super();
          this.overboughtTreshold = overboughtTreshold;
          this.rsi = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
        }
        getId() {
          return `rsi.oversold.filter.${this.rsi.getParameters().getId()} > ${this.overboughtTreshold}`;
        }
        getFriendlyDescription() {
          return `Overbought: ${this.rsi.getParameters().getDescription()} > ${this.overboughtTreshold}`;
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.wasUpdated(updatedTimeFrames, this.rsi.getParameters().getTimeFrame())) {
            return;
          }
          this.updateBooeanAttribute(tradingPair);
        }
        updateBooeanAttribute(tradingPair) {
          const indicatorReady = this.rsi.isReady(tradingPair);
          if (!indicatorReady) {
            return;
          }
          const indicatorOutput = this.rsi.get(tradingPair);
          const isOverbought = indicatorOutput.getValue() > this.overboughtTreshold;
          this.setValue(tradingPair, isOverbought);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/boolean_extractors/RsiOversoldFilter.ts
  var RsiOversoldFilter;
  var init_RsiOversoldFilter = __esm({
    "ts_libs/ts_worker/application/plugins/boolean_extractors/RsiOversoldFilter.ts"() {
      "use strict";
      init_Source();
      init_BaseFilterableAttributeExtractor();
      RsiOversoldFilter = class extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame, oversoldTreshold) {
          super();
          this.oversoldTreshold = oversoldTreshold;
          this.rsi = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
        }
        getId() {
          return `rsi.oversold.filter.${this.rsi.getParameters().getId()} < ${this.oversoldTreshold}`;
        }
        getFriendlyDescription() {
          return `Oversold: ${this.rsi.getParameters().getDescription()} <= ${this.oversoldTreshold}`;
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.wasUpdated(updatedTimeFrames, this.rsi.getParameters().getTimeFrame())) {
            return;
          }
          this.updateBooleanAttribute(tradingPair);
        }
        updateBooleanAttribute(tradingPair) {
          const ready = this.rsi.isReady(tradingPair);
          if (!ready) {
            return;
          }
          const indicatorOutput = this.rsi.get(tradingPair);
          const isOversold = indicatorOutput.getValue() < this.oversoldTreshold;
          this.setValue(tradingPair, isOversold);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/boolean_extractors/SmaDowntrendFilter.ts
  var SmaDowntrendFilter;
  var init_SmaDowntrendFilter = __esm({
    "ts_libs/ts_worker/application/plugins/boolean_extractors/SmaDowntrendFilter.ts"() {
      "use strict";
      init_Source();
      init_BaseFilterableAttributeExtractor();
      SmaDowntrendFilter = class extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame) {
          super();
          this.sma = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
        }
        getId() {
          return `close.under.${this.sma.getParameters().getId()}`;
        }
        getFriendlyDescription() {
          return `Downtrend: ${this.sma.getParameters().getDescription()} > Close`;
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.wasUpdated(updatedTimeFrames, this.sma.getParameters().getTimeFrame())) {
            return;
          }
          this.updateBooleanAttribute(tradingPair);
        }
        updateBooleanAttribute(tradingPair) {
          const isReady = this.sma.getValuesCount(tradingPair) > 2;
          if (!isReady) {
            return;
          }
          const isDowntrend = this.sma.isDowntrend(tradingPair);
          this.setValue(tradingPair, isDowntrend);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/boolean_extractors/SmaUptrendFilter.ts
  var SmaUptrendFilter;
  var init_SmaUptrendFilter = __esm({
    "ts_libs/ts_worker/application/plugins/boolean_extractors/SmaUptrendFilter.ts"() {
      "use strict";
      init_Source();
      init_BaseFilterableAttributeExtractor();
      SmaUptrendFilter = class extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame) {
          super();
          this.sma = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
        }
        getId() {
          return `close.above.${this.sma.getParameters().getId()}`;
        }
        getFriendlyDescription() {
          return `Uptrend: ${this.sma.getParameters().getDescription()} < Close`;
        }
        updateBooleanAttribute(tradingPair) {
          const isReady = this.sma.getValuesCount(tradingPair) > 2;
          if (!isReady) {
            return;
          }
          const isUptrend = this.sma.isUptrend(tradingPair);
          this.setValue(tradingPair, isUptrend);
        }
        next(tradingPair, updatedTimeFrames, ts) {
          const tf = this.sma.getParameters().getTimeFrame();
          if (false === this.wasUpdated(updatedTimeFrames, tf)) {
            return;
          }
          this.updateBooleanAttribute(tradingPair);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/numeric_extractors/CurrentPriceExtractor.ts
  var CurrentPriceExtractor;
  var init_CurrentPriceExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/numeric_extractors/CurrentPriceExtractor.ts"() {
      "use strict";
      init_TimeFrame();
      init_BaseSortableAttributeExtractor();
      CurrentPriceExtractor = class _CurrentPriceExtractor extends BaseSortableAttributeExtractor {
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.wasUpdated(updatedTimeFrames, TimeFrame.ONE_MINUTE)) {
            return;
          }
          let currentPrice = this.close(tradingPair, TimeFrame.ONE_MINUTE);
          if (currentPrice === void 0) {
            return;
          }
          this.setValue(tradingPair, currentPrice);
        }
        getPrecision() {
          return void 0;
        }
        getFriendlyDescription() {
          return "Price";
        }
        getId() {
          return _CurrentPriceExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/numeric_extractors/DailyPendingRvaExtractor.ts
  var DailyPendingRvaExtractor;
  var init_DailyPendingRvaExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/numeric_extractors/DailyPendingRvaExtractor.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_BaseSortableAttributeExtractor();
      DailyPendingRvaExtractor = class _DailyPendingRvaExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.rva = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
        }
        next(tradingPair, updatedTimeFrames, ts) {
          const isReady = this.rva.isReady(tradingPair);
          if (!isReady) {
            return;
          }
          let pendingValue = this.rva.pending(tradingPair).getRelativeValue();
          this.setValue(tradingPair, pendingValue);
        }
        getPrecision() {
          return 2;
        }
        getFriendlyDescription() {
          return `Pending ${this.rva.getParameters().getDescription()}`;
        }
        getId() {
          return _DailyPendingRvaExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/numeric_extractors/DailyPriceChangeExtractor.ts
  var DailyPriceChangeExtractor;
  var init_DailyPriceChangeExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/numeric_extractors/DailyPriceChangeExtractor.ts"() {
      "use strict";
      init_Source();
      init_TimeFrame();
      init_BaseSortableAttributeExtractor();
      DailyPriceChangeExtractor = class _DailyPriceChangeExtractor extends BaseSortableAttributeExtractor {
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.wasUpdated(updatedTimeFrames, TimeFrame.ONE_MINUTE)) {
            return;
          }
          const dayOpenPrice = this.getOhlcvPendingData(tradingPair, Source.OPEN, TimeFrame.ONE_DAY);
          const currentPrice = this.getOhlcvData(tradingPair, Source.CLOSE, TimeFrame.ONE_MINUTE, 0);
          if (currentPrice === void 0) {
            return;
          }
          if (dayOpenPrice === void 0) {
            return;
          }
          const percentChange = (currentPrice - dayOpenPrice) / dayOpenPrice * 100;
          this.setValue(tradingPair, percentChange);
        }
        getPrecision() {
          return 2;
        }
        getFriendlyDescription() {
          return "Daily change %";
        }
        getId() {
          return _DailyPriceChangeExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/numeric_extractors/DailyRvaExtractor.ts
  var DailyRvaExtractor;
  var init_DailyRvaExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/numeric_extractors/DailyRvaExtractor.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_BaseSortableAttributeExtractor();
      DailyRvaExtractor = class _DailyRvaExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.rva = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === updatedTimeFrames.get(TimeFrame.ONE_DAY)) {
            return;
          }
          this.findAndStoreRva(tradingPair);
        }
        findAndStoreRva(tradingPair) {
          const isReady = this.rva.isReady(tradingPair);
          if (!isReady) {
            return;
          }
          let relativeValue = this.rva.get(tradingPair).getRelativeValue();
          this.setValue(tradingPair, relativeValue);
        }
        getPrecision() {
          return 2;
        }
        getFriendlyDescription() {
          return this.rva.getParameters().getDescription();
        }
        getId() {
          return _DailyRvaExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/numeric_extractors/ThirtyDayPercentChangeExtractor.ts
  var ThirtyDayPercentChangeExtractor;
  var init_ThirtyDayPercentChangeExtractor = __esm({
    "ts_libs/ts_worker/application/plugins/numeric_extractors/ThirtyDayPercentChangeExtractor.ts"() {
      "use strict";
      init_Period();
      init_Source();
      init_TimeFrame();
      init_BaseSortableAttributeExtractor();
      ThirtyDayPercentChangeExtractor = class _ThirtyDayPercentChangeExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.pctChange = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, new Period(30), Source.CLOSE);
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === updatedTimeFrames.get(TimeFrame.ONE_DAY)) {
            return;
          }
          const isReady = this.pctChange.isReady(tradingPair);
          if (!isReady) {
            return;
          }
          let pctChange = this.pctChange.get(tradingPair).getValue();
          this.setValue(tradingPair, pctChange);
        }
        getPrecision() {
          return 2;
        }
        getFriendlyDescription() {
          return "30 Days Change %";
        }
        getId() {
          return _ThirtyDayPercentChangeExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/BaseSignalGenerator.ts
  var BaseSignalGenerator;
  var init_BaseSignalGenerator = __esm({
    "ts_libs/ts_worker/application/plugins/BaseSignalGenerator.ts"() {
      "use strict";
      init_BasePlugin();
      BaseSignalGenerator = class extends BasePlugin {
        constructor() {
          super(...arguments);
          this.signals = [];
        }
        emit(tradingPair, signalDirection, timeStamp, orderDetails) {
          this.signals.push({
            tradingPair,
            signalDirection,
            source: this,
            timeStamp,
            orderDetails
          });
        }
        drain() {
          const drained = this.signals.slice();
          this.signals.length = 0;
          return drained;
        }
        getSignalsCount() {
          return this.signals.length;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/signal_generators/PotentialRecoverySignalGenerator.ts
  var PotentialRecoverySignalGenerator;
  var init_PotentialRecoverySignalGenerator = __esm({
    "ts_libs/ts_worker/application/plugins/signal_generators/PotentialRecoverySignalGenerator.ts"() {
      "use strict";
      init_Period();
      init_Source();
      init_TimeFrame();
      init_SignalModel();
      init_BaseSignalGenerator();
      PotentialRecoverySignalGenerator = class extends BaseSignalGenerator {
        constructor() {
          super();
          this.rsiThreshold = 5;
          this.don = this.useDonchianChannelsIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(5));
          this.rsi = this.useRsiIndicator(TimeFrame.FOUR_HOURS, Period.fromUnknown(2), Source.CLOSE);
          this.smaFast = this.useSmaIndicator(TimeFrame.ONE_MINUTE, Period.fromUnknown(20), Source.CLOSE);
          this.smaSlow = this.useSmaIndicator(TimeFrame.ONE_HOUR, Period.fromUnknown(5), Source.CLOSE);
          this.id = [
            "potential-recovery",
            this.rsi.getParameters().getId(),
            `rsi-threshold-${this.rsiThreshold}`,
            this.smaFast.getParameters().getId(),
            this.smaSlow.getParameters().getId(),
            this.don.getParameters().getId()
          ].join(".");
          this.friendlyDescription = "Bullish potential recovery when the 1-minute SMA20 crosses above the 1-hour SMA5 while the 4-hour RSI(2) is below 5.";
        }
        getId() {
          return this.id;
        }
        getFriendlyDescription() {
          return this.friendlyDescription;
        }
        next(tradingPair, updatedTimeFrames, ts) {
          if (false === this.isDonchianReady(tradingPair)) {
            return;
          }
          if (false === this.isOversold(tradingPair)) {
            return;
          }
          if (false === this.isSmaRecoveryCrossover(tradingPair, updatedTimeFrames)) {
            return;
          }
          this.emit(tradingPair, "BULLISH" /* BULLISH */, ts, this.makeOrderDetails(tradingPair));
        }
        isSmaRecoveryCrossover(tradingPair, updatedTimeFrames) {
          const fastTimeFrame = this.smaFast.getParameters().getTimeFrame();
          const slowTimeFrame = this.smaSlow.getParameters().getTimeFrame();
          if (!this.wasUpdated(updatedTimeFrames, fastTimeFrame)) {
            return false;
          }
          if (this.smaFast.getValuesCount(tradingPair) < 2) {
            return false;
          }
          if (this.smaSlow.getValuesCount(tradingPair) < 1) {
            return false;
          }
          const slowWasUpdated = this.wasUpdated(
            updatedTimeFrames,
            slowTimeFrame
          );
          if (slowWasUpdated && this.smaSlow.getValuesCount(tradingPair) < 2) {
            return false;
          }
          const previousFast = this.smaFast.get(tradingPair, 1).getValue();
          const currentFast = this.smaFast.get(tradingPair, 0).getValue();
          const previousSlow = this.smaSlow.get(tradingPair, slowWasUpdated ? 1 : 0).getValue();
          const currentSlow = this.smaSlow.get(tradingPair, 0).getValue();
          return previousFast <= previousSlow && currentFast > currentSlow && previousFast < currentFast;
        }
        isDonchianReady(tradingPair) {
          return this.don.isReady(tradingPair);
        }
        isOversold(tradingPair) {
          if (!this.rsi.isReady(tradingPair)) {
            return false;
          }
          return this.rsi.get(tradingPair, 0).getValue() < this.rsiThreshold;
        }
        makeOrderDetails(tradingPair) {
          const donchianHigh = this.don.getHigh(tradingPair);
          const stopLoss = this.don.getLow(tradingPair);
          const entryValue = this.getOhlcvData(tradingPair, Source.CLOSE, TimeFrame.ONE_MINUTE, 0);
          if (entryValue === void 0 || !Number.isFinite(entryValue) || !Number.isFinite(stopLoss) || !Number.isFinite(donchianHigh)) {
            return void 0;
          }
          if (stopLoss >= entryValue) {
            return void 0;
          }
          const decimals = Math.max(this.countDecimals(entryValue), this.countDecimals(stopLoss), this.countDecimals(donchianHigh));
          const risk = entryValue - stopLoss;
          return {
            entryPrice: entryValue,
            stopLossPrice: this.tr(stopLoss, decimals),
            takeProfitLevels: [
              this.tr(entryValue + risk, decimals),
              this.tr(entryValue + risk * 2, decimals),
              this.tr(entryValue + risk * 3, decimals)
            ]
          };
        }
        countDecimals(n) {
          var _a, _b;
          if (n === void 0 || !Number.isFinite(n)) {
            return 0;
          }
          return (_b = (_a = n.toString().split(".")[1]) == null ? void 0 : _a.length) != null ? _b : 0;
        }
        tr(num, decimals) {
          return parseFloat(num.toFixed(decimals));
        }
      };
    }
  });

  // ts_libs/ts_worker/application/plugins/PluginManager.ts
  var _PluginManager, PluginManager;
  var init_PluginManager = __esm({
    "ts_libs/ts_worker/application/plugins/PluginManager.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_BaseFilterableAttributeExtractor();
      init_BaseSortableAttributeExtractor();
      init_RsiOverboughtFilter();
      init_RsiOversoldFilter();
      init_SmaDowntrendFilter();
      init_SmaUptrendFilter();
      init_CurrentPriceExtractor();
      init_DailyPendingRvaExtractor();
      init_DailyPriceChangeExtractor();
      init_DailyRvaExtractor();
      init_ThirtyDayPercentChangeExtractor();
      init_PotentialRecoverySignalGenerator();
      _PluginManager = class _PluginManager {
        constructor() {
          this._plugins = [..._PluginManager.DefaultPlugins];
          this._filterableAttributes = [];
          this._sortableAttributes = [];
          this._plugins.forEach((plugin) => {
            if (plugin instanceof BaseFilterableAttributeExtractor) {
              this._filterableAttributes.push(plugin.getNamedAttributeMetadata());
            }
            if (plugin instanceof BaseSortableAttributeExtractor) {
              this._sortableAttributes.push(plugin.getNamedAttributeMetadata());
            }
          });
        }
        get sortableAttributes() {
          return this._sortableAttributes;
        }
        get filterableAttributes() {
          return this._filterableAttributes;
        }
        get plugins() {
          return this._plugins;
        }
      };
      _PluginManager.DailyPriceChangeExtractor = new DailyPriceChangeExtractor();
      _PluginManager.CurrentPriceExtractor = new CurrentPriceExtractor();
      _PluginManager.DefaultPlugins = [
        _PluginManager.CurrentPriceExtractor,
        _PluginManager.DailyPriceChangeExtractor,
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
        new PotentialRecoverySignalGenerator()
        //new HighVolumeInsideCompressedDonchian()
      ];
      PluginManager = _PluginManager;
    }
  });

  // ts_libs/ts_worker/application/usecases/UseCaseBase.ts
  var UseCaseBase;
  var init_UseCaseBase = __esm({
    "ts_libs/ts_worker/application/usecases/UseCaseBase.ts"() {
      "use strict";
      UseCaseBase = class {
        /**
         * Execute the use case with the given request model.
         * Handles validation, execution, and error handling.
         * @param requestModel - the input for the use case
         * @returns a promise resolving to the response
         */
        execute(requestModel) {
          return __async(this, null, function* () {
            try {
              this.validate(requestModel);
              const result = yield this.run(requestModel);
              return result;
            } catch (err) {
              this.handleError(err);
              throw err;
            }
          });
        }
        /**
         * Validate the request model.
         * Subclasses can override to implement validation logic.
         * @param requestModel - the input to validate
         */
        validate(requestModel) {
        }
        /**
         * Handle errors during execution.
         * Subclasses can override for custom logging or recovery.
         * @param err - the error thrown during execute
         */
        handleError(err) {
          console.error(err);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesResponse.ts
  var _descriptors, EnumerateExchangesResponse;
  var init_EnumerateExchangesResponse = __esm({
    "ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesResponse.ts"() {
      "use strict";
      EnumerateExchangesResponse = class {
        constructor(descriptors) {
          __privateAdd(this, _descriptors);
          __privateSet(this, _descriptors, descriptors);
        }
        get descriptors() {
          return [...__privateGet(this, _descriptors)];
        }
      };
      _descriptors = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesUseCase.ts
  var _exchangeDescriptorRegistry, EnumerateExchangesUseCase;
  var init_EnumerateExchangesUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/EnumerateExchanges/EnumerateExchangesUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_EnumerateExchangesResponse();
      EnumerateExchangesUseCase = class extends UseCaseBase {
        constructor(exchangeDescriptorRegistry) {
          super();
          __privateAdd(this, _exchangeDescriptorRegistry);
          __privateSet(this, _exchangeDescriptorRegistry, exchangeDescriptorRegistry);
        }
        /**
         * Return all exchange descriptors
         * @param _requestModel - empty request (EnumerateExchangesRequest)
         */
        run(_requestModel) {
          return __async(this, null, function* () {
            if (_requestModel.includes === void 0) {
              return new EnumerateExchangesResponse(__privateGet(this, _exchangeDescriptorRegistry).all());
            }
            let filtered = [];
            for (let index = 0; index < _requestModel.includes.length; index++) {
              const exchangeName = _requestModel.includes[index];
              const descriptor = __privateGet(this, _exchangeDescriptorRegistry).byName(exchangeName);
              filtered.push(descriptor);
            }
            return new EnumerateExchangesResponse(filtered);
          });
        }
      };
      _exchangeDescriptorRegistry = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataResponse.ts
  var _count, FetchOhlcvDataResponse;
  var init_FetchOhlcvDataResponse = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataResponse.ts"() {
      "use strict";
      FetchOhlcvDataResponse = class {
        constructor(count) {
          __privateAdd(this, _count);
          __privateSet(this, _count, count);
          Object.freeze(this);
        }
        getCount() {
          return __privateGet(this, _count);
        }
      };
      _count = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataUseCase.ts
  var _exchangeMethodsRegistry, _technicalAnalisysRepository, _FetchOhlcvDataUseCase_instances, fetchOne_fn, FetchOhlcvDataUseCase;
  var init_FetchOhlcvDataUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_FetchOhlcvDataResponse();
      init_InsufficientOhlcvDataError();
      init_TimeFrame();
      FetchOhlcvDataUseCase = class extends UseCaseBase {
        constructor(technicalAnalisysRepository, exchangeMethodsRegistry) {
          super();
          __privateAdd(this, _FetchOhlcvDataUseCase_instances);
          __privateAdd(this, _exchangeMethodsRegistry);
          __privateAdd(this, _technicalAnalisysRepository);
          __privateSet(this, _exchangeMethodsRegistry, exchangeMethodsRegistry);
          __privateSet(this, _technicalAnalisysRepository, technicalAnalisysRepository);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            const tradingPairs = requestModel.getTradingPairs();
            const candlesPerTimeFrame = requestModel.getCandlesPerTimeFrame();
            const utcNowMs = requestModel.getUtcNowMilliseconds();
            const parallelCount = requestModel.getParallelRequestsCount();
            const results = [];
            const plugins = requestModel.getPlugins();
            const fetchTotal = tradingPairs.length;
            for (let i = 0; i < tradingPairs.length; i += parallelCount) {
              const batchPairs = tradingPairs.slice(i, i + parallelCount);
              const batchResults = yield Promise.all(batchPairs.map((tp, idx) => __async(this, null, function* () {
                const result = yield __privateMethod(this, _FetchOhlcvDataUseCase_instances, fetchOne_fn).call(this, tp, utcNowMs, candlesPerTimeFrame);
                return result;
              })));
              const filtered = batchResults.filter((s) => s !== void 0);
              filtered.forEach((batchResult, idx) => {
                results.push(batchResult);
                __privateGet(this, _technicalAnalisysRepository).addDataset(batchResult);
                __privateGet(this, _technicalAnalisysRepository).initializeIndicatorsWithDatasets(batchResult.getTradingPair());
                requestModel.reportFetchOhlcvProgress({
                  currentTradingPair: batchResult.getTradingPair(),
                  currentTradingPairIndex: i + idx,
                  totalTradingPairsCount: fetchTotal
                });
              });
            }
            plugins.forEach((plugin, pluginIndex) => {
              requestModel.reportExecutePluginProgress({
                currentPlugin: plugin,
                currentPluginIndex: pluginIndex,
                totalPluginsCount: plugins.length
              });
              results.forEach((res) => {
                plugin.next(res.getTradingPair(), res.getUpdatedTimeFrames(), res.getBuffer(TimeFrame.ONE_MINUTE).getEndTime());
              });
            });
            return new FetchOhlcvDataResponse(results.length);
          });
        }
      };
      _exchangeMethodsRegistry = new WeakMap();
      _technicalAnalisysRepository = new WeakMap();
      _FetchOhlcvDataUseCase_instances = new WeakSet();
      fetchOne_fn = function(tradingPair, utcNowMs, candlesPerTimeFrame) {
        return __async(this, null, function* () {
          try {
            const methods = __privateGet(this, _exchangeMethodsRegistry).get(
              tradingPair.getExchangeDescriptor()
            );
            const toReturn = yield methods.createMultiTimeframeOhlcv(
              tradingPair,
              utcNowMs,
              candlesPerTimeFrame
            );
            return toReturn;
          } catch (err) {
            if (InsufficientOhlcvDataError.isInstance(err)) {
              console.warn(err);
              return void 0;
            }
            throw err;
          }
        });
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsResponse.ts
  var _tradingPairs3, FilterTradingPairsResponse;
  var init_FilterTradingPairsResponse = __esm({
    "ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsResponse.ts"() {
      "use strict";
      FilterTradingPairsResponse = class {
        constructor(tradingPairs) {
          __privateAdd(this, _tradingPairs3);
          __privateSet(this, _tradingPairs3, Object.freeze([...tradingPairs]));
          Object.freeze(this);
        }
        /**
         * Returns filtered trading pairs
         */
        getTradingPairs() {
          return [...__privateGet(this, _tradingPairs3)];
        }
      };
      _tradingPairs3 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsUseCase.ts
  var _tradingPairRepository, FilterTradingPairsUseCase;
  var init_FilterTradingPairsUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_FilterTradingPairsResponse();
      FilterTradingPairsUseCase = class extends UseCaseBase {
        constructor(tradingPairRepository) {
          super();
          __privateAdd(this, _tradingPairRepository);
          __privateSet(this, _tradingPairRepository, tradingPairRepository);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            const pairs = __privateGet(this, _tradingPairRepository).filter(
              requestModel.getExchanges(),
              requestModel.getQuoteAssets()
            );
            if (!requestModel.requiresFullQuoteCoverage()) {
              if (pairs.length === 0) {
                throw new Error("No matching trading pairs.");
              }
              return new FilterTradingPairsResponse(this.applyLimit(pairs, requestModel));
            }
            const covered = [];
            const requiredQuotes = requestModel.getRequiredQuoteAssets();
            const excludedBaseAssets = requestModel.getExcludedBaseAssets();
            for (const pair of pairs) {
              const baseAsset = pair.getBaseAsset();
              const exchange = pair.getExchangeDescriptor();
              const isExcluded = excludedBaseAssets.some((anExcludedAsset, anIndex) => {
                return anExcludedAsset.equals(baseAsset);
              });
              if (isExcluded) {
                continue;
              }
              let acceptable = true;
              for (const quoteAsset of requiredQuotes) {
                if (!__privateGet(this, _tradingPairRepository).isTradingPairAvailable(exchange, baseAsset, quoteAsset)) {
                  acceptable = false;
                  break;
                }
              }
              if (acceptable) {
                covered.push(pair);
              }
            }
            if (covered.length === 0) {
              throw new Error("No matching trading pairs.");
            }
            return new FilterTradingPairsResponse(this.applyLimit(covered, requestModel));
          });
        }
        applyLimit(pairs, request) {
          const limit = request.getLimit();
          if (limit === void 0 || limit < 1) {
            return pairs;
          }
          const grouped = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const exchange = pair.getExchangeDescriptor().getId();
            if (!grouped.has(exchange)) {
              grouped.set(exchange, []);
            }
            grouped.get(exchange).push(pair);
          }
          const result = [];
          for (const [, exchangePairs] of grouped) {
            result.push(...exchangePairs.slice(0, limit));
          }
          return result;
        }
      };
      _tradingPairRepository = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsResponse.ts
  var _plugins4, RegisterPluginsResponse;
  var init_RegisterPluginsResponse = __esm({
    "ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsResponse.ts"() {
      "use strict";
      RegisterPluginsResponse = class {
        constructor(plugins) {
          __privateAdd(this, _plugins4);
          __privateSet(this, _plugins4, plugins);
          Object.freeze(this);
        }
        get plugins() {
          return __privateGet(this, _plugins4);
        }
      };
      _plugins4 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsUseCase.ts
  var _repo, RegisterPluginsUseCase;
  var init_RegisterPluginsUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/RegisterPlugins/RegisterPluginsUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_RegisterPluginsResponse();
      RegisterPluginsUseCase = class extends UseCaseBase {
        constructor(repo) {
          super();
          __privateAdd(this, _repo);
          __privateSet(this, _repo, repo);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            let plugins = requestModel.plugins;
            let pairs = requestModel.tradingPairs;
            plugins.forEach((plugin) => {
              plugin.transferContext(__privateGet(this, _repo));
              plugin.getIndicatorParameters().forEach((indParam) => {
                __privateGet(this, _repo).addIndicatorParameters(indParam);
              });
            });
            return new RegisterPluginsResponse(plugins);
          });
        }
      };
      _repo = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataResponse.ts
  var _updatedEntriesCount, _tradingPairModels, _signalModels, SyncOhlcvDataResponse;
  var init_SyncOhlcvDataResponse = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataResponse.ts"() {
      "use strict";
      SyncOhlcvDataResponse = class {
        constructor(updatedEntriesCount, tradingPairModels, signalModels) {
          __privateAdd(this, _updatedEntriesCount);
          __privateAdd(this, _tradingPairModels);
          __privateAdd(this, _signalModels);
          __privateSet(this, _updatedEntriesCount, updatedEntriesCount);
          __privateSet(this, _tradingPairModels, tradingPairModels);
          __privateSet(this, _signalModels, signalModels);
          Object.freeze(this);
        }
        getUpdatedEntriesCount() {
          return __privateGet(this, _updatedEntriesCount);
        }
        getTradingPairModels() {
          return __privateGet(this, _tradingPairModels);
        }
        getSignalModels() {
          return __privateGet(this, _signalModels);
        }
      };
      _updatedEntriesCount = new WeakMap();
      _tradingPairModels = new WeakMap();
      _signalModels = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataUseCase.ts
  var _exchangeMethodsRegistry2, _technicalAnalisysRepository2, SyncOhlcvDataUseCase;
  var init_SyncOhlcvDataUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_SyncOhlcvDataResponse();
      init_TimeFrame();
      init_TradingPairModel();
      init_BaseFilterableAttributeExtractor();
      init_BaseSortableAttributeExtractor();
      init_SignalModel();
      init_BaseSignalGenerator();
      SyncOhlcvDataUseCase = class extends UseCaseBase {
        constructor(technicalAnalisysRepository, exchangeMethodsRegistry) {
          super();
          __privateAdd(this, _exchangeMethodsRegistry2);
          __privateAdd(this, _technicalAnalisysRepository2);
          __privateSet(this, _exchangeMethodsRegistry2, exchangeMethodsRegistry);
          __privateSet(this, _technicalAnalisysRepository2, technicalAnalisysRepository);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            const buffers = Array.from(__privateGet(this, _technicalAnalisysRepository2).getDatasets().values());
            const shouldSync = this.shouldSync(buffers, requestModel);
            if (shouldSync === false) {
              return new SyncOhlcvDataResponse(0, [], []);
            }
            const data = yield this.multiFetch(buffers, requestModel);
            this.runDataProcessingPipeline(data, requestModel);
            const signalModels = this.drainSignals(requestModel);
            const tradingPairModels = this.mapModels(buffers, requestModel);
            return new SyncOhlcvDataResponse(buffers.length, tradingPairModels, signalModels);
          });
        }
        mapModels(buffers, requestModel) {
          const plugins = requestModel.getPlugins();
          return buffers.map((b) => this.createSingleTradingPairModel(b.getTradingPair(), plugins));
        }
        runDataProcessingPipeline(data, requestModel) {
          var _a;
          const tradingPairs = Array.from(data.keys());
          const plugins = requestModel.getPlugins();
          const referenceTradingPair = tradingPairs[0];
          const referenceOhlcvEntriesCount = (_a = data.get(referenceTradingPair)) == null ? void 0 : _a.length;
          if (referenceOhlcvEntriesCount === void 0) {
            throw new Error("Pipeline inconsistency, first trading pair has no associated ohlcv items.");
          }
          const sameOhlcvEntriesCount = tradingPairs.every((tp, idx) => {
            var _a2;
            return referenceOhlcvEntriesCount === ((_a2 = data.get(tp)) == null ? void 0 : _a2.length);
          });
          if (false === sameOhlcvEntriesCount) {
            throw new Error("Pipeline inconsistency, all entries should have same amount of ohlcv items.");
          }
          for (let i = 0; i < referenceOhlcvEntriesCount; i++) {
            requestModel.reportExecutePluginsProgress({
              currentCandleIndex: i,
              pluginsCount: plugins.length,
              totalCandlesCount: referenceOhlcvEntriesCount,
              totalPairsCount: tradingPairs.length
            });
            const updatedByTradingPair = /* @__PURE__ */ new Map();
            const timestampByTradingPair = /* @__PURE__ */ new Map();
            for (let j = 0; j < tradingPairs.length; j++) {
              const tradingPair = tradingPairs[j];
              const targetEntries = data.get(tradingPair);
              if (targetEntries === void 0) {
                throw new Error("Pipeline inconsistency, target does not have any ohlcv items.");
              }
              const entry = targetEntries[i];
              var updatedTimeFrames = __privateGet(this, _technicalAnalisysRepository2).pushUpdate(
                tradingPair,
                entry.timeFrame,
                entry.open,
                entry.high,
                entry.low,
                entry.close,
                entry.volume,
                entry.startTime,
                entry.endTime,
                entry.isClosed
              );
              updatedTimeFrames.forEach((isUpdated, timeFrame) => {
                if (!isUpdated) {
                  return;
                }
                __privateGet(this, _technicalAnalisysRepository2).updateIndicators(tradingPair, timeFrame);
              });
              updatedByTradingPair.set(tradingPair, updatedTimeFrames);
              timestampByTradingPair.set(tradingPair, entry.endTime);
            }
            for (const tradingPair of tradingPairs) {
              const updatedTimeFrames2 = updatedByTradingPair.get(tradingPair);
              const entryTs = timestampByTradingPair.get(tradingPair);
              if (updatedTimeFrames2 === void 0 || entryTs === void 0) {
                throw new Error("Pipeline inconsistency, missing data for plugin input.");
              }
              plugins.forEach((plugin) => {
                plugin.next(tradingPair, updatedTimeFrames2, entryTs);
              });
            }
          }
        }
        multiFetch(buffers, requestModel) {
          return __async(this, null, function* () {
            const toReturn = /* @__PURE__ */ new Map();
            const nowMillis = requestModel.getUtcNowMilliseconds();
            const parallelCount = requestModel.getParalelRequestsCount();
            for (let i = 0; i < buffers.length; i += parallelCount) {
              const batch = buffers.slice(i, i + parallelCount);
              const tasks = batch.map((b) => this.fetchOneMinuteCandleSticks(b, nowMillis, toReturn));
              yield Promise.all(tasks);
              batch.forEach((r, idxBatch) => {
                var _a, _b;
                const tp = r.getTradingPair();
                const count = (_b = (_a = toReturn.get(tp)) == null ? void 0 : _a.length) != null ? _b : 0;
                requestModel.reportFetchProgress({
                  currentTradingPair: tp,
                  syncCount: count,
                  currentPairIndex: i + idxBatch,
                  totalPairsCount: buffers.length
                });
              });
            }
            return toReturn;
          });
        }
        shouldSync(buffers, requestModel) {
          const oneMinuteAsMilliseconds = TimeFrame.ONE_MINUTE.asMilliseconds();
          const nowMillis = requestModel.getUtcNowMilliseconds();
          const shouldSync = buffers.every((buffer) => {
            const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + oneMinuteAsMilliseconds;
            const gap = nowMillis - nextStart;
            return gap > oneMinuteAsMilliseconds;
          });
          return shouldSync;
        }
        drainSignals(requestModel) {
          const toReturn = [];
          const plugins = requestModel.getPlugins();
          plugins.forEach((plugin) => {
            if (!(plugin instanceof BaseSignalGenerator)) {
              return;
            }
            if (plugin.getSignalsCount() > 0) {
              const drained = plugin.drain();
              drained.forEach((m) => toReturn.push(this.createSingleSignalModel(m)));
            }
          });
          toReturn.sort((first, second) => first.timestamp - second.timestamp);
          return toReturn;
        }
        createSingleSignalModel(signalData) {
          var _a, _b, _c;
          const tradingPair = signalData.tradingPair;
          const exchange = tradingPair.getExchangeDescriptor();
          const tradingPairUrl = __privateGet(this, _exchangeMethodsRegistry2).get(exchange).getTradingPairUrl(tradingPair);
          var model = new SignalModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            tradingPairUrl,
            signalData.source.getFriendlyDescription(),
            signalData.signalDirection,
            signalData.timeStamp,
            (_a = signalData.orderDetails) == null ? void 0 : _a.entryPrice,
            (_b = signalData.orderDetails) == null ? void 0 : _b.stopLossPrice,
            (_c = signalData.orderDetails) == null ? void 0 : _c.takeProfitLevels
          );
          return model;
        }
        fetchOneMinuteCandleSticks(mtfBuffer, timestamp, storage) {
          return __async(this, null, function* () {
            const tradingPair = mtfBuffer.getTradingPair();
            const exchangeDescriptor = tradingPair.getExchangeDescriptor();
            const methods = __privateGet(this, _exchangeMethodsRegistry2).get(exchangeDescriptor);
            const newEntries = yield methods.syncOneMinuteTimeFrame(
              mtfBuffer,
              timestamp
            );
            if (newEntries === void 0) {
              throw new Error("No new data available");
            }
            storage.set(tradingPair, newEntries);
          });
        }
        createSingleTradingPairModel(tradingPair, plugins) {
          const exchange = tradingPair.getExchangeDescriptor();
          const tradingPairUrl = __privateGet(this, _exchangeMethodsRegistry2).get(exchange).getTradingPairUrl(tradingPair);
          var model = new TradingPairModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            tradingPairUrl
          );
          plugins.forEach((plugin) => {
            if (plugin instanceof BaseFilterableAttributeExtractor) {
              model.addAttr(plugin.extractNamedAttributeFrom(tradingPair));
            }
            if (plugin instanceof BaseSortableAttributeExtractor) {
              model.addAttr(plugin.extractNamedAttributeFrom(tradingPair));
            }
          });
          return model;
        }
      };
      _exchangeMethodsRegistry2 = new WeakMap();
      _technicalAnalisysRepository2 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/UseCaseContainer.ts
  var UseCaseContainer;
  var init_UseCaseContainer = __esm({
    "ts_libs/ts_worker/application/usecases/UseCaseContainer.ts"() {
      "use strict";
      init_TradingPair();
      init_ExchangeDescriptor();
      init_ExchangeDescriptorRegistry();
      init_ExchangeMethodsRegistry();
      init_TradingPairsRepository();
      init_TechnicalAnalisysRepository();
      init_ExchangeMethodsBinance();
      init_ExchangeMethodsBybit();
      init_TimeProvider();
      init_ScreenerSettings();
      init_ExchangeInclusionCriteria();
      init_PluginManager();
      init_EnumerateExchangesUseCase();
      init_FetchOhlcvDataUseCase();
      init_FilterTradingPairsUseCase();
      init_RegisterPluginsUseCase();
      init_SyncOhlcvDataUseCase();
      UseCaseContainer = class _UseCaseContainer {
        constructor(exchangeDescriptorRegistry, exchangeMethodsRegistry, tradingPairsRepository, pluginManager) {
          this.timeProvider = new TimeProvider();
          this.exchangeDescriptorRegistry = exchangeDescriptorRegistry;
          this.exchangeMethodsRegistry = exchangeMethodsRegistry;
          this.tradingPairsRepository = tradingPairsRepository;
          this.technicalAnalisysRepository = new TechnicalAnalisysRepository();
          this.enumerateExchangesUseCase = new EnumerateExchangesUseCase(exchangeDescriptorRegistry);
          this.filterTradingPairsUseCase = new FilterTradingPairsUseCase(tradingPairsRepository);
          this.registerPluginsUseCase = new RegisterPluginsUseCase(this.technicalAnalisysRepository);
          this.fetchOhlcvDataUseCase = new FetchOhlcvDataUseCase(this.technicalAnalisysRepository, exchangeMethodsRegistry);
          this.syncOhlcvDataUseCase = new SyncOhlcvDataUseCase(this.technicalAnalisysRepository, exchangeMethodsRegistry);
          this.pluginManager = pluginManager;
        }
        /** Factory method to create a fully initialized UseCaseContainer */
        static Create() {
          return __async(this, null, function* () {
            const exchangeDescriptorRegistry = new ExchangeDescriptorRegistry();
            const exchangeMethodsRegistry = new ExchangeMethodsRegistry();
            const binanceDescriptor = exchangeDescriptorRegistry.register(new ExchangeDescriptor(1, "Binance"));
            const bybitDescriptor = exchangeDescriptorRegistry.register(new ExchangeDescriptor(2, "Bybit"));
            exchangeMethodsRegistry.register(binanceDescriptor, new ExchangeMethodsBinance());
            exchangeMethodsRegistry.register(bybitDescriptor, new ExchangeMethodsBybit());
            const tradingPairsRepository = new TradingPairsRepository();
            const exchangeDescriptors = exchangeDescriptorRegistry.all();
            for (const exchangeDescriptor of exchangeDescriptors) {
              const methods = exchangeMethodsRegistry.get(exchangeDescriptor);
              yield methods.fetchTradingPairs((baseAsset, quoteAsset) => {
                const pair = new TradingPair(exchangeDescriptor, baseAsset, quoteAsset);
                tradingPairsRepository.registerPair(pair);
              });
            }
            const pluginManager = new PluginManager();
            return new _UseCaseContainer(exchangeDescriptorRegistry, exchangeMethodsRegistry, tradingPairsRepository, pluginManager);
          });
        }
        static CreateDefaultSettings(container) {
          let exchangeInclusionCriterias = [];
          let available = container.exchangeDescriptorRegistry.all();
          for (let i = 0; i < available.length; i++) {
            exchangeInclusionCriterias.push(new ExchangeInclusionCriteria(available[i].getName(), available[i].getId(), true));
          }
          return new ScreenerSettings(exchangeInclusionCriterias, container.pluginManager.sortableAttributes, container.pluginManager.filterableAttributes);
        }
      };
    }
  });

  // ts_libs/ts_worker/worker/WorkerCoreImplementation.ts
  var _container, _timeProvider, _candlesPerTimeFrame2, _settings, _plugins5, _WorkerCoreImplementation, WorkerCoreImplementation;
  var init_WorkerCoreImplementation = __esm({
    "ts_libs/ts_worker/worker/WorkerCoreImplementation.ts"() {
      "use strict";
      init_SynchronizationModel();
      init_EnumerateExchangesRequest();
      init_FetchOhlcvDataRequest();
      init_FilterTradingPairsRequest();
      init_RegisterPluginsRequest();
      init_SyncOhlcvDataRequest();
      init_UseCaseContainer();
      init_Asset();
      init_TimeProvider();
      _WorkerCoreImplementation = class _WorkerCoreImplementation {
        constructor(container) {
          __privateAdd(this, _container);
          __privateAdd(this, _timeProvider);
          __privateAdd(this, _candlesPerTimeFrame2);
          __privateAdd(this, _settings);
          __privateAdd(this, _plugins5);
          __privateSet(this, _container, container);
          __privateSet(this, _timeProvider, new TimeProvider());
          __privateSet(this, _candlesPerTimeFrame2, 400);
          __privateSet(this, _settings, UseCaseContainer.CreateDefaultSettings(container));
        }
        static Create() {
          return __async(this, null, function* () {
            let useCaseContainer = yield UseCaseContainer.Create();
            var toReturn = new _WorkerCoreImplementation(useCaseContainer);
            return toReturn;
          });
        }
        /**
         * Initialize settings for the screener, including exchange inclusion criteria
         */
        getDefaultSettings() {
          return __privateGet(this, _settings);
        }
        /**
         * Fetch initial data from exchanges
         */
        fetch(screenerSettings, progressCallback) {
          return __async(this, null, function* () {
            __privateSet(this, _settings, screenerSettings);
            const exchangesResponse = yield __privateGet(this, _container).enumerateExchangesUseCase.execute(new EnumerateExchangesRequest(screenerSettings.getIncludedExchangeNames()));
            const tradingPairsResponse = yield __privateGet(this, _container).filterTradingPairsUseCase.execute(
              new FilterTradingPairsRequest(
                exchangesResponse.descriptors,
                [Asset.fromUnknown("usdc")],
                [Asset.fromUnknown("usdc"), Asset.fromUnknown("usdt")],
                [Asset.fromUnknown("aedz"), Asset.fromUnknown("xaut"), Asset.fromUnknown("usd1"), Asset.fromUnknown("bfusd"), Asset.fromUnknown("usde"), Asset.fromUnknown("fdusd"), Asset.fromUnknown("euri"), Asset.fromUnknown("eur")],
                __privateGet(this, _settings).maximumPairsCountPerExchange
              )
            );
            const tradingPairs = tradingPairsResponse.getTradingPairs();
            const sixHours = 216e5;
            const nowMs = (yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true)) - sixHours;
            const registerPluginsRequest = new RegisterPluginsRequest(
              __privateGet(this, _container).pluginManager.plugins,
              tradingPairs
            );
            const registerPluginsResponse = yield __privateGet(this, _container).registerPluginsUseCase.execute(registerPluginsRequest);
            __privateSet(this, _plugins5, registerPluginsResponse.plugins);
            const fetchRequest = new FetchOhlcvDataRequest(
              tradingPairs,
              __privateGet(this, _candlesPerTimeFrame2),
              __privateGet(this, _settings).parallelRequestsCount,
              nowMs,
              __privateGet(this, _plugins5),
              (fetchOhlcvDataProgress) => {
                let percent = 0.5 * (fetchOhlcvDataProgress.currentTradingPairIndex * 100) / fetchOhlcvDataProgress.totalTradingPairsCount;
                const message = `Downloading historical candles (${fetchOhlcvDataProgress.currentTradingPairIndex}/${fetchOhlcvDataProgress.totalTradingPairsCount}) 
 ${fetchOhlcvDataProgress.currentTradingPair.symbol()} from ${fetchOhlcvDataProgress.currentTradingPair.getExchangeDescriptor().getName()}`;
                progressCallback(percent, message);
              },
              (executePluginProgress) => {
                let percent = 50 + 0.2 * (executePluginProgress.currentPluginIndex * 100) / executePluginProgress.totalPluginsCount;
                const message = `Analyzing market data (${executePluginProgress.currentPluginIndex}/${executePluginProgress.totalPluginsCount}) 
 ${executePluginProgress.currentPlugin.getFriendlyDescription()}`;
                progressCallback(percent, message);
              }
            );
            const fetchResponse = yield __privateGet(this, _container).fetchOhlcvDataUseCase.execute(fetchRequest);
            if (fetchResponse.getCount() === 0) {
              throw new Error("No data was fetched.");
            }
            const syncMs = yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true);
            const syncRequest = new SyncOhlcvDataRequest(
              __privateGet(this, _plugins5),
              __privateGet(this, _settings).parallelRequestsCount,
              syncMs,
              (fetchProgress) => {
                let percent = 70 + 0.2 * (fetchProgress.currentPairIndex * 100) / fetchProgress.totalPairsCount;
                const message = `Synchronizing latest candles (${fetchProgress.currentPairIndex}/${fetchProgress.totalPairsCount})
Downloaded ${fetchProgress.syncCount} new candle${fetchProgress.syncCount === 1 ? "" : "s"} for ${fetchProgress.currentTradingPair.symbol()} from ${fetchProgress.currentTradingPair.getExchangeDescriptor().getName()}`;
                progressCallback(percent, message);
              },
              (pluginsExecutionProgress) => {
                let percent = 90 + 0.1 * (pluginsExecutionProgress.currentCandleIndex * 100) / pluginsExecutionProgress.totalCandlesCount;
                const message = `Analyzing market data (${pluginsExecutionProgress.currentCandleIndex}/${pluginsExecutionProgress.totalCandlesCount})
Scanning ${pluginsExecutionProgress.totalPairsCount} trading pairs using ${pluginsExecutionProgress.pluginsCount} plugins`;
                progressCallback(percent, message);
              }
            );
            const syncResponse = yield __privateGet(this, _container).syncOhlcvDataUseCase.execute(syncRequest);
            var synchronizationModel = new SynchronizationModel(
              syncResponse.getTradingPairModels(),
              syncResponse.getSignalModels()
            );
            return synchronizationModel;
          });
        }
        synchronize(progressCallback) {
          return __async(this, null, function* () {
            if (__privateGet(this, _plugins5) === void 0) {
              throw new Error("Plugins undefined");
            }
            const syncMs = yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true);
            const syncRequest = new SyncOhlcvDataRequest(
              __privateGet(this, _plugins5),
              __privateGet(this, _settings).parallelRequestsCount,
              syncMs,
              (fetchProgress) => {
                let percent = 0.7 * (fetchProgress.currentPairIndex * 100) / fetchProgress.totalPairsCount;
                const message = `Synchronizing latest candles (${fetchProgress.currentPairIndex}/${fetchProgress.totalPairsCount})
Downloaded ${fetchProgress.syncCount} new candle${fetchProgress.syncCount === 1 ? "" : "s"} for ${fetchProgress.currentTradingPair.symbol()} from ${fetchProgress.currentTradingPair.getExchangeDescriptor().getName()}`;
                progressCallback(percent, message);
              },
              (pluginsExecutionProgress) => {
                let percent = 70 + 0.3 * (pluginsExecutionProgress.currentCandleIndex * 100) / pluginsExecutionProgress.totalCandlesCount;
                const message = `Analyzing market data (${pluginsExecutionProgress.currentCandleIndex}/${pluginsExecutionProgress.totalCandlesCount})
Scanning ${pluginsExecutionProgress.totalPairsCount} trading pairs using ${pluginsExecutionProgress.pluginsCount} plugins`;
                progressCallback(percent, message);
              }
            );
            const syncResponse = yield __privateGet(this, _container).syncOhlcvDataUseCase.execute(syncRequest);
            var synchronizationModel = new SynchronizationModel(
              syncResponse.getTradingPairModels(),
              syncResponse.getSignalModels()
            );
            return synchronizationModel;
          });
        }
      };
      _container = new WeakMap();
      _timeProvider = new WeakMap();
      _candlesPerTimeFrame2 = new WeakMap();
      _settings = new WeakMap();
      _plugins5 = new WeakMap();
      WorkerCoreImplementation = _WorkerCoreImplementation;
    }
  });

  // ts_libs/ts_worker/index.ts
  var require_index = __commonJS({
    "ts_libs/ts_worker/index.ts"() {
      init_ScreenerSettings();
      init_WorkerCoreImplementation();
      function initCall(id) {
        return __async(this, null, function* () {
          try {
            var controller = yield getController();
            var data = controller.getDefaultSettings();
            var jsonData = data.serialize();
            _workerPostResolve(id, jsonData);
          } catch (err) {
            _workerPostReject(id, err);
          }
        });
      }
      function fetchCall(id, progressEventName, payload) {
        return __async(this, null, function* () {
          try {
            var controller = yield getController();
            var settings = ScreenerSettings.deserialize(payload);
            var data = yield controller.fetch(settings, (progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
            _workerPostResolve(id, data.serialize());
          } catch (err) {
            _workerPostReject(id, err);
          }
        });
      }
      function synchronizeCall(id, progressEventName, payload) {
        return __async(this, null, function* () {
          try {
            var controller = yield getController();
            var data = yield controller.synchronize((progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
            _workerPostResolve(id, data.serialize());
          } catch (err) {
            _workerPostReject(id, err);
          }
        });
      }
      var controllerCore = null;
      var controllerPromise = null;
      function getController() {
        return __async(this, null, function* () {
          if (controllerCore) {
            return Promise.resolve(controllerCore);
          }
          if (!controllerPromise) {
            controllerPromise = WorkerCoreImplementation.Create().then((core) => {
              controllerCore = core;
              return core;
            }).catch((err) => {
              controllerPromise = null;
              throw err;
            });
          }
          return controllerPromise;
        });
      }
      self.onmessage = (event) => {
        _workerHandleCalls(event);
      };
      function _workerHandleCalls(event) {
        return __async(this, null, function* () {
          if (event.data.type !== "call") {
            return;
          }
          switch (event.data.method) {
            case "init":
              yield initCall(event.data.id);
              break;
            case "fetch":
              yield fetchCall(event.data.id, "fetch:progress", event.data.args);
              break;
            case "synchronize":
              yield synchronizeCall(event.data.id, "synchronize:progress", event.data.args);
              break;
            default:
              break;
          }
        });
      }
      function _workerPostResolve(anId, aPayload) {
        self.postMessage({ id: anId, type: "resolve", payload: aPayload });
      }
      function _workerPostReject(anId, anError) {
        var _a;
        console.log(`${WorkerCoreImplementation.name}::_workerPostReject, ${JSON.stringify(anError)}`);
        self.postMessage({ id: anId, type: "reject", error: (_a = anError == null ? void 0 : anError.message) != null ? _a : String(anError) });
      }
      function _workerPostEvent(anId, aName, anEvent) {
        self.postMessage({ id: anId, type: "event", payload: anEvent, name: aName });
      }
    }
  });
  require_index();
})();
//# sourceMappingURL=worker.js.map
