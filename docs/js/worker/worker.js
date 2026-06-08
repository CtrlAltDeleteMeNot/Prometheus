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
        static fromJson(json) {
          if (typeof json.name !== "string") {
            throw new Error("Invalid name");
          }
          if (typeof json.id !== "number") {
            throw new Error("Invalid id");
          }
          if (typeof json.include !== "boolean") {
            throw new Error("Invalid include flag");
          }
          return new _ExchangeInclusionCriteria(json.name, json.id, json.include);
        }
        toJson() {
          return {
            name: this.name,
            id: this.id,
            include: this.include
          };
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
  var ScreenerSettings;
  var init_ScreenerSettings = __esm({
    "ts_libs/ts_worker/application/exports/ScreenerSettings.ts"() {
      "use strict";
      init_ExchangeInclusionCriteria();
      ScreenerSettings = class _ScreenerSettings {
        constructor(exchangeInclusionCriterias) {
          this._parallelRequestsCount = 5;
          this._maximumPairsCountPerExchange = 1e3;
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
        }
        // =====================
        // Getters / Setters
        // =====================
        get parallelRequestsCount() {
          return this._parallelRequestsCount;
        }
        set parallelRequestsCount(value) {
          if (typeof value !== "number" || value < 1 || value > 20) {
            throw new Error("Invalid parallelRequestsCount");
          }
          this._parallelRequestsCount = value;
        }
        get maximumPairsCountPerExchange() {
          return this._maximumPairsCountPerExchange;
        }
        set maximumPairsCountPerExchange(value) {
          if (typeof value !== "number" || value < 1 || value > 1e4) {
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
        // =====================
        // Factory
        // =====================
        static fromJson(json) {
          if (!Array.isArray(json.exchangeInclusionCriterias)) {
            throw new Error("exchangeInclusionCriterias must be an array");
          }
          const criterias = json.exchangeInclusionCriterias.map(
            (c) => ExchangeInclusionCriteria.fromJson(c)
          );
          const settings = new _ScreenerSettings(criterias);
          settings.parallelRequestsCount = json.parallelRequestsCount;
          settings.maximumPairsCountPerExchange = json.maximumPairsCountPerExchange;
          return settings;
        }
        // =====================
        // Serialization
        // =====================
        toJson() {
          return {
            parallelRequestsCount: this.parallelRequestsCount,
            maximumPairsCountPerExchange: this.maximumPairsCountPerExchange,
            exchangeInclusionCriterias: this.exchangeInclusionCriterias.map((c) => ({
              name: c.name,
              id: c.id,
              include: c.include
            }))
          };
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
          const clonedCriterias = this.exchangeInclusionCriterias.map((c) => c.deepClone());
          const newSettings = new _ScreenerSettings(clonedCriterias);
          newSettings.parallelRequestsCount = this.parallelRequestsCount;
          newSettings.maximumPairsCountPerExchange = this.maximumPairsCountPerExchange;
          return newSettings;
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
      };
    }
  });

  // ts_libs/ts_worker/application/exports/NamedAttribute.ts
  var NamedAttributeMetadata, NumericNamedAttribute, BooleanNamedAttribute, StringNamedAttribute;
  var init_NamedAttribute = __esm({
    "ts_libs/ts_worker/application/exports/NamedAttribute.ts"() {
      "use strict";
      NamedAttributeMetadata = class {
        constructor(key, label, type) {
          this.key = key;
          this.label = label;
          this.type = type;
        }
      };
      NumericNamedAttribute = class _NumericNamedAttribute {
        constructor(key, label, value, precision) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.precision = precision;
          this.metadata = new NamedAttributeMetadata(key, label, "number");
          if (value !== void 0 && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
          }
          if (precision !== void 0 && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
          }
        }
        static fromMetadata(argMetadata, argValue, argPrecision) {
          if (argMetadata.type !== "number") {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
          }
          return new _NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argPrecision);
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
          return this.precision === void 0 ? this.value.toString() : this.value.toFixed(this.precision);
        }
      };
      BooleanNamedAttribute = class _BooleanNamedAttribute {
        constructor(key, label, value) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.metadata = new NamedAttributeMetadata(key, label, "boolean");
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
      StringNamedAttribute = class {
        constructor(key, label, value) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.metadata = new NamedAttributeMetadata(key, label, "string");
          if (value !== void 0 && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
          }
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
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairModel.ts
  var TradingPairModel;
  var init_TradingPairModel = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairModel.ts"() {
      "use strict";
      init_NamedAttribute();
      TradingPairModel = class {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, price, exchangeUrl) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.price = price;
          this.exchangeUrl = exchangeUrl;
          this.extended = [];
          Object.freeze(this);
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
        static dailyPercentChangeMetadata() {
          return new NamedAttributeMetadata("daily_percent_change", "Daily change %", "number");
        }
        static currentPriceMetadata() {
          return new NamedAttributeMetadata("price", "Price", "number");
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairsCodec.ts
  var TradingPairsCodec;
  var init_TradingPairsCodec = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairsCodec.ts"() {
      "use strict";
      init_NamedAttribute();
      init_TradingPairModel();
      TradingPairsCodec = class {
        /** Serialize array of TradingPairModel to JSON string */
        static toJsonString(tradingPairs) {
          const dto = tradingPairs.map((tp) => ({
            baseAsset: tp.baseAsset,
            quoteAsset: tp.quoteAsset,
            exchangeName: tp.exchangeName,
            exchangeId: tp.exchangeId,
            exchangeUrl: tp.exchangeUrl,
            price: tp.price,
            extended: tp.getAttributes().map((attr) => {
              var _a;
              return {
                key: attr.metadata.key,
                label: attr.metadata.label,
                type: attr.metadata.type,
                value: attr.value,
                precision: (_a = attr.precision) != null ? _a : void 0
              };
            })
          }));
          return JSON.stringify(dto);
        }
        static extractUniqueSortableAttributes(tradingPairs) {
          const toReturn = [];
          const count = Math.min(10, tradingPairs.length);
          for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getNumericAttributes();
            for (let j = 0; j < attrs.length; j++) {
              const meta = attrs[j].metadata;
              const metaKey = meta.key;
              const isNew = !toReturn.some((s) => s.key === metaKey);
              if (isNew) {
                toReturn.push(meta);
              }
            }
          }
          return toReturn;
        }
        static extractUniqueFilterableAttributes(tradingPairs) {
          const toReturn = [];
          const count = Math.min(10, tradingPairs.length);
          for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getBooleanAttributes();
            for (let j = 0; j < attrs.length; j++) {
              const meta = attrs[j].metadata;
              const metaKey = meta.key;
              const isNew = !toReturn.some((s) => s.key === metaKey);
              if (isNew) {
                toReturn.push(meta);
              }
            }
          }
          return toReturn;
        }
        /** Deserialize from JSON string to array of TradingPairModel */
        static fromJsonString(buffer) {
          const dtoArray = JSON.parse(buffer);
          return dtoArray.map((dto) => {
            var _a;
            const model = new TradingPairModel(
              dto.baseAsset,
              dto.quoteAsset,
              dto.exchangeName,
              dto.exchangeId,
              dto.price,
              dto.exchangeUrl
            );
            for (const attrDto of dto.extended) {
              let attr;
              switch (attrDto.type) {
                case "number":
                  attr = new NumericNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    attrDto.value,
                    attrDto.precision
                  );
                  break;
                case "string":
                  attr = new StringNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    attrDto.value
                  );
                  break;
                case "boolean":
                  attr = new BooleanNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    (_a = attrDto.value) != null ? _a : false
                  );
                  break;
                default:
                  throw new Error(`Type conversion failed for ${attrDto.type} -> ${attrDto.key}`);
              }
              model.addAttr(attr);
            }
            return model;
          });
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
          if (capacity <= 0) {
            throw new RangeError(
              `Capacity must be greater than zero, got ${capacity}`
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
          this.indicators = /* @__PURE__ */ new Map([
            [TimeFrame.ONE_DAY, []],
            [TimeFrame.FOUR_HOURS, []],
            [TimeFrame.ONE_HOUR, []],
            [TimeFrame.FIFTEEN_MINUTES, []],
            [TimeFrame.FIVE_MINUTES, []],
            [TimeFrame.ONE_MINUTE, []]
          ]);
          this.tradingPair = TradingPair.fromUnknown(tradingPair);
          this.buffers = /* @__PURE__ */ new Map([
            [TimeFrame.ONE_DAY, OhlcvBuffer.fromUnknown(oneDay)],
            [TimeFrame.FOUR_HOURS, OhlcvBuffer.fromUnknown(fourHours)],
            [TimeFrame.ONE_HOUR, OhlcvBuffer.fromUnknown(oneHour)],
            [TimeFrame.FIFTEEN_MINUTES, OhlcvBuffer.fromUnknown(fifteenMinutes)],
            [TimeFrame.FIVE_MINUTES, OhlcvBuffer.fromUnknown(fiveMinutes)],
            [TimeFrame.ONE_MINUTE, OhlcvBuffer.fromUnknown(oneMinute)]
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
        pushUpdate(timeFrame, open, high, low, close, volume, startTime, endTime, isClosed) {
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
            this.updateIndicators(mainBuffer.getBaseTimeFrame());
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
              this.updateIndicators(buffer.getBaseTimeFrame());
            }
          }
          this.ensureBuffersAreFullyAligned();
        }
        getBuffer(timeFrame) {
          const tf = TimeFrame.fromUnknown(timeFrame);
          const buffer = this.buffers.get(tf);
          return OhlcvBuffer.fromUnknown(buffer);
        }
        getIndicators(timeFrame) {
          const tf = TimeFrame.fromUnknown(timeFrame);
          const list = this.indicators.get(tf);
          if (!list) {
            throw new Error(`Unsupported timeframe: ${tf.getLabel()}`);
          }
          return list;
        }
        addIndicator(indicatorParams) {
          const tf = indicatorParams.getTimeFrame();
          const list = this.getIndicators(tf);
          const exists = list.some(
            (ind) => ind.getParameters().equals(indicatorParams)
          );
          if (exists) {
            return false;
          }
          const indicator = indicatorParams.createUsing(this);
          list.push(indicator);
          return true;
        }
        findIndicator(indicatorParams) {
          const tf = indicatorParams.getTimeFrame();
          const list = this.getIndicators(tf);
          const found = list.find(
            (ind) => ind.getParameters().equals(indicatorParams)
          );
          if (!found) {
            throw new Error(`Indicator ${indicatorParams.getId()} was not found.`);
          }
          return found;
        }
        removeIndicator(indicatorParams) {
          const tf = indicatorParams.getTimeFrame();
          const list = this.getIndicators(tf);
          const index = list.findIndex(
            (ind) => ind.getParameters().equals(indicatorParams)
          );
          if (index === -1) {
            return false;
          }
          list.splice(index, 1);
          return true;
        }
        updateIndicators(timeFrame) {
          const tf = TimeFrame.fromUnknown(timeFrame);
          const list = this.getIndicators(tf);
          list.forEach((ind) => ind.update());
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

  // ts_libs/ts_worker/domain/ta/indicators/Indicator.ts
  var IndicatorParameters, IndicatorOutput, Indicator;
  var init_Indicator = __esm({
    "ts_libs/ts_worker/domain/ta/indicators/Indicator.ts"() {
      "use strict";
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
      IndicatorOutput = class {
      };
      Indicator = class {
        constructor(parameters) {
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
  var _value2, RsiIndicatorOutput, RsiIndicatorParameters, _RsiIndicator_instances, computeCore_fn, RsiIndicator;
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
      RsiIndicatorOutput = class extends IndicatorOutput {
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
            __privateMethod(this, _RsiIndicator_instances, computeCore_fn).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update() {
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _RsiIndicator_instances, computeCore_fn).call(this, extracted);
        }
        getValue(n = 0) {
          return this.history.get(n);
        }
        getValuesCount() {
          return this.history.getSize();
        }
      };
      _RsiIndicator_instances = new WeakSet();
      computeCore_fn = function(value) {
        const computed = this.rolling.push(value);
        if (computed === null) {
          return;
        }
        this.history.push((sample) => sample.update(computed));
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/RvaIndicator.ts
  var _volumeSma, _relativeValue, RvaIndicatorOutput, RvaIndicatorParameters, _RvaIndicator_instances, computeCore_fn2, RvaIndicator;
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
          this.mtf.getBuffer(this.getParameters().getTimeFrame()).stream((position, candle) => {
            const volume = candle.volume;
            __privateMethod(this, _RvaIndicator_instances, computeCore_fn2).call(this, volume);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        computePending() {
          if (!this.rolling.isReady()) {
            return void 0;
          }
          if (this.parameters.getTimeFrame() === TimeFrame.ONE_MINUTE) {
            return void 0;
          }
          let pendingVolume = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getPendingCandle().volume;
          if (pendingVolume === void 0 || pendingVolume === null || pendingVolume === Infinity) {
            return void 0;
          }
          const volumeSma = this.getValue().getVolumeSma();
          if (volumeSma == null || volumeSma === 0) return void 0;
          const relativeValue = pendingVolume / volumeSma;
          return relativeValue;
        }
        /** Call when a new candle is available */
        update() {
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const volume = candle.volume;
          __privateMethod(this, _RvaIndicator_instances, computeCore_fn2).call(this, volume);
        }
        getValue(n = 0) {
          const value = this.history.get(n);
          if (!value) throw new RangeError("RVA value not available");
          return value;
        }
        getValuesCount() {
          return this.history.getSize();
        }
      };
      _RvaIndicator_instances = new WeakSet();
      computeCore_fn2 = function(volume) {
        const volumeSma = this.rolling.push(volume);
        if (volumeSma === null) return;
        const relativeValue = volumeSma !== 0 ? volume / volumeSma : 0;
        this.history.push((sample) => sample.update(volumeSma, relativeValue));
      };
    }
  });

  // ts_libs/ts_worker/domain/ta/indicators/SmaIndicator.ts
  var _value3, SmaIndicatorOutput, SmaIndicatorParameters, _SmaIndicator_instances, computeCore_fn3, SmaIndicator;
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
      SmaIndicatorOutput = class extends IndicatorOutput {
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
            __privateMethod(this, _SmaIndicator_instances, computeCore_fn3).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update() {
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _SmaIndicator_instances, computeCore_fn3).call(this, extracted);
        }
        getValue(n = 0) {
          const value = this.history.get(n);
          if (!value) throw new RangeError("SMA value not available");
          return value;
        }
        getValuesCount() {
          return this.history.getSize();
        }
      };
      _SmaIndicator_instances = new WeakSet();
      computeCore_fn3 = function(value) {
        const computed = this.rolling.push(value);
        if (computed === null) return;
        this.history.push((sample) => sample.update(computed));
      };
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
  var _value4, PctChangeIndicatorOutput, PctChangeIndicatorParameters, _PctChangeIndicator_instances, computeCore_fn4, PctChangeIndicator;
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
      PctChangeIndicatorOutput = class extends IndicatorOutput {
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
            __privateMethod(this, _PctChangeIndicator_instances, computeCore_fn4).call(this, extracted);
          });
        }
        isReady() {
          return this.history.getSize() > 0;
        }
        update() {
          const candle = this.mtf.getBuffer(this.getParameters().getTimeFrame()).getCandle();
          const extracted = this.getParameters().getSource().extract(candle);
          __privateMethod(this, _PctChangeIndicator_instances, computeCore_fn4).call(this, extracted);
        }
        getValue(n = 0) {
          return this.history.get(n);
        }
        getValuesCount() {
          return this.history.getSize();
        }
      };
      _PctChangeIndicator_instances = new WeakSet();
      computeCore_fn4 = function(value) {
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
    }
  });

  // ts_libs/ts_worker/domain/ta/evaluators/BaseEvaluator.ts
  var BaseEvaluator;
  var init_BaseEvaluator = __esm({
    "ts_libs/ts_worker/domain/ta/evaluators/BaseEvaluator.ts"() {
      "use strict";
      init_RsiIndicator();
      init_RvaIndicator();
      init_SmaIndicator();
      init_PctChangeIndicator();
      BaseEvaluator = class {
        constructor() {
          this.indicatorParameters = [];
        }
        ensureIndicatorsRegisteredNoThrow(mtf) {
          if (mtf === null) {
            return;
          }
          mtf.forEach((item) => {
            this.indicatorParameters.forEach((indicator) => item.addIndicator(indicator));
          });
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
          return params;
        }
        useRsiIndicator(timeFrame, period, source) {
          var params = new RsiIndicatorParameters(timeFrame, period, source);
          this.addIndicatorParams(params);
          return params;
        }
        useRvaIndicator(timeFrame, period) {
          var params = new RvaIndicatorParameters(timeFrame, period);
          this.addIndicatorParams(params);
          return params;
        }
        usePercentChangeIndicator(timeFrame, period, source) {
          var params = new PctChangeIndicatorParameters(timeFrame, period, source);
          this.addIndicatorParams(params);
          return params;
        }
        valuesCount(dataset, params) {
          return dataset.findIndicator(params).getValuesCount();
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/BaseSortableAttributeExtractor.ts
  var BaseSortableAttributeExtractor;
  var init_BaseSortableAttributeExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/BaseSortableAttributeExtractor.ts"() {
      "use strict";
      init_BaseEvaluator();
      BaseSortableAttributeExtractor = class extends BaseEvaluator {
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/DailyPriceChangeExtractor.ts
  var DailyPriceChangeExtractor;
  var init_DailyPriceChangeExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/DailyPriceChangeExtractor.ts"() {
      "use strict";
      init_TimeFrame();
      init_NamedAttribute();
      init_TradingPairModel();
      init_BaseSortableAttributeExtractor();
      DailyPriceChangeExtractor = class _DailyPriceChangeExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.metadata = TradingPairModel.dailyPercentChangeMetadata();
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const dayBuffer = data.getBuffer(TimeFrame.ONE_DAY);
          const minuteBuffer = data.getBuffer(TimeFrame.ONE_MINUTE);
          const dayOpenPrice = dayBuffer.getPendingCandle().open;
          const currentPrice = minuteBuffer.getClose();
          const percentChange = (currentPrice - dayOpenPrice) / dayOpenPrice * 100;
          return NumericNamedAttribute.fromMetadata(this.metadata, percentChange, 2);
        }
        getId() {
          return _DailyPriceChangeExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/CurrentPriceExtractor.ts
  var CurrentPriceExtractor;
  var init_CurrentPriceExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/CurrentPriceExtractor.ts"() {
      "use strict";
      init_TimeFrame();
      init_NamedAttribute();
      init_TradingPairModel();
      init_BaseSortableAttributeExtractor();
      CurrentPriceExtractor = class _CurrentPriceExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.metadata = TradingPairModel.currentPriceMetadata();
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const minuteBuffer = data.getBuffer(TimeFrame.ONE_MINUTE);
          const currentPrice = minuteBuffer.getClose();
          return NumericNamedAttribute.fromMetadata(TradingPairModel.currentPriceMetadata(), currentPrice);
        }
        getId() {
          return _CurrentPriceExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/DailyPendingRvaExtractor.ts
  var DailyPendingRvaExtractor;
  var init_DailyPendingRvaExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/DailyPendingRvaExtractor.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_NamedAttribute();
      init_BaseSortableAttributeExtractor();
      DailyPendingRvaExtractor = class _DailyPendingRvaExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.rvaParams = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
          this.metadata = new NamedAttributeMetadata(`pending.${this.rvaParams.getId()}`, `Pending ${this.rvaParams.getDescription()}`, "number");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const rvaIndicator = data.findIndicator(this.rvaParams);
          if (rvaIndicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, rvaIndicator.computePending(), 2);
          }
          return NumericNamedAttribute.fromMetadata(this.metadata, void 0, void 0);
        }
        getId() {
          return _DailyPendingRvaExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/ScreenerItemMapper.ts
  var _exchangeMethodRegistry, ScreenerItemMapper;
  var init_ScreenerItemMapper = __esm({
    "ts_libs/ts_worker/application/mappers/ScreenerItemMapper.ts"() {
      "use strict";
      init_TimeFrame();
      init_TradingPairModel();
      ScreenerItemMapper = class {
        constructor(exchangeMethodRegistry) {
          __privateAdd(this, _exchangeMethodRegistry);
          __privateSet(this, _exchangeMethodRegistry, exchangeMethodRegistry);
        }
        /**
         * Map an array of MultiTimeframeOhlcv to TradingPairModel[]
         * @param buffers 
         */
        mapMultiple(sortableAttributeExtractors, filterableAttributeExtractors, buffers) {
          return buffers.map((buffer) => this.mapSingle(sortableAttributeExtractors, filterableAttributeExtractors, buffer));
        }
        /**
         * Map a single MultiTimeframeOhlcv to TradingPairModel
         * @param buffer 
         */
        mapSingle(sortableAttributeExtractors, filterableAttributeExtractors, buffer) {
          const minuteBuffer = buffer.getBuffer(TimeFrame.ONE_MINUTE);
          const tradingPair = buffer.getTradingPair();
          const exchange = tradingPair.getExchangeDescriptor();
          const tradingPairUrl = __privateGet(this, _exchangeMethodRegistry).get(exchange).getTradingPairUrl(tradingPair);
          const currentPrice = minuteBuffer.getClose();
          var model = new TradingPairModel(
            tradingPair.getBaseAsset().toString(),
            tradingPair.getQuoteAsset().toString(),
            exchange.getName(),
            exchange.getId(),
            currentPrice,
            tradingPairUrl
          );
          for (let index = 0; index < sortableAttributeExtractors.length; index++) {
            const extractor = sortableAttributeExtractors[index];
            model.addAttr(extractor.extractNamedAttributeFrom(buffer));
          }
          for (let index = 0; index < filterableAttributeExtractors.length; index++) {
            const extractor = filterableAttributeExtractors[index];
            model.addAttr(extractor.extractNamedAttributeFrom(buffer));
          }
          return model;
        }
      };
      _exchangeMethodRegistry = new WeakMap();
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
  var _tradingPairs, _candlesPerTimeFrame, _parallelRequestsCount, _utcNowMs, _progressCallback, FetchOhlcvDataRequest;
  var init_FetchOhlcvDataRequest = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataRequest.ts"() {
      "use strict";
      FetchOhlcvDataRequest = class {
        constructor(tradingPairs, candlesPerTimeFrame, parallelRequestsCount, utcNowMs, progressCallback) {
          __privateAdd(this, _tradingPairs);
          __privateAdd(this, _candlesPerTimeFrame);
          __privateAdd(this, _parallelRequestsCount);
          __privateAdd(this, _utcNowMs);
          __privateAdd(this, _progressCallback);
          __privateSet(this, _tradingPairs, Object.freeze([...tradingPairs]));
          __privateSet(this, _candlesPerTimeFrame, candlesPerTimeFrame);
          __privateSet(this, _parallelRequestsCount, parallelRequestsCount);
          __privateSet(this, _utcNowMs, utcNowMs);
          __privateSet(this, _progressCallback, progressCallback);
          Object.freeze(this);
        }
        reportProgress(progress) {
          return __privateGet(this, _progressCallback).call(this, progress);
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
      };
      _tradingPairs = new WeakMap();
      _candlesPerTimeFrame = new WeakMap();
      _parallelRequestsCount = new WeakMap();
      _utcNowMs = new WeakMap();
      _progressCallback = new WeakMap();
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

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest.ts
  var _multiTimeFrameData, _paralelRequestsCount, _utcNowMs2, _progressCallback2, SyncOhlcvDataRequest;
  var init_SyncOhlcvDataRequest = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataRequest.ts"() {
      "use strict";
      init_MultiTimeframeOhlcv();
      SyncOhlcvDataRequest = class {
        constructor(multiTimeFrameData, paralelRequestsCount, utcNowMs, progressCallback) {
          __privateAdd(this, _multiTimeFrameData);
          __privateAdd(this, _paralelRequestsCount);
          __privateAdd(this, _utcNowMs2);
          __privateAdd(this, _progressCallback2);
          multiTimeFrameData.forEach((mtf) => MultiTimeframeOhlcv.fromUnknown(mtf));
          if (paralelRequestsCount <= 0) throw new RangeError("paralelRequestsCount must be > 0");
          __privateSet(this, _multiTimeFrameData, multiTimeFrameData);
          __privateSet(this, _paralelRequestsCount, paralelRequestsCount);
          __privateSet(this, _utcNowMs2, utcNowMs);
          __privateSet(this, _progressCallback2, progressCallback);
          Object.freeze(this);
        }
        reportProgress(progressData) {
          return __privateGet(this, _progressCallback2).call(this, progressData);
        }
        getUtcNowMilliseconds() {
          return __privateGet(this, _utcNowMs2);
        }
        getTradingPairBuffers() {
          return __privateGet(this, _multiTimeFrameData);
        }
        getParalelRequestsCount() {
          return __privateGet(this, _paralelRequestsCount);
        }
      };
      _multiTimeFrameData = new WeakMap();
      _paralelRequestsCount = new WeakMap();
      _utcNowMs2 = new WeakMap();
      _progressCallback2 = new WeakMap();
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
        syncMultiTimeFrameOhlcv(multiTimeframeOhlcv, newEndTimeMillis) {
          return __async(this, null, function* () {
            const timeFrame = TimeFrame.ONE_MINUTE;
            const buffer = OhlcvBuffer.fromUnknown(multiTimeframeOhlcv.getBuffer(timeFrame));
            if (buffer.isEmpty()) {
              throw new Error("Cannot sync an empty buffer");
            }
            const relevantStartTimeStamp = buffer.getStartTime() + timeFrame.asMilliseconds();
            const relevantEndTimeStamp = newEndTimeMillis;
            if (relevantEndTimeStamp <= relevantStartTimeStamp) return 0;
            const data = yield this.fetchHistoricalCandles(
              multiTimeframeOhlcv.getTradingPair(),
              buffer.getBaseTimeFrame(),
              relevantStartTimeStamp,
              relevantEndTimeStamp
            );
            for (const entry of data) {
              multiTimeframeOhlcv.pushUpdate(
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
            }
            return data.length;
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
  var _multiTimeFrameData2, FetchOhlcvDataResponse;
  var init_FetchOhlcvDataResponse = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataResponse.ts"() {
      "use strict";
      FetchOhlcvDataResponse = class {
        constructor(multiTimeFrameData) {
          __privateAdd(this, _multiTimeFrameData2);
          __privateSet(this, _multiTimeFrameData2, Object.freeze([...multiTimeFrameData]));
          Object.freeze(this);
        }
        getMultiTimeFrameData() {
          return __privateGet(this, _multiTimeFrameData2);
        }
      };
      _multiTimeFrameData2 = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataUseCase.ts
  var _exchangeMethodsRegistry, _FetchOhlcvDataUseCase_instances, fetchOne_fn, FetchOhlcvDataUseCase;
  var init_FetchOhlcvDataUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/FetchOhlcvData/FetchOhlcvDataUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_FetchOhlcvDataResponse();
      init_InsufficientOhlcvDataError();
      FetchOhlcvDataUseCase = class extends UseCaseBase {
        constructor(exchangeMethodsRegistry) {
          super();
          __privateAdd(this, _FetchOhlcvDataUseCase_instances);
          __privateAdd(this, _exchangeMethodsRegistry);
          __privateSet(this, _exchangeMethodsRegistry, exchangeMethodsRegistry);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            const tradingPairs = requestModel.getTradingPairs();
            const candlesPerTimeFrame = requestModel.getCandlesPerTimeFrame();
            const utcNowMs = requestModel.getUtcNowMilliseconds();
            const parallelCount = requestModel.getParallelRequestsCount();
            const results = [];
            for (let i = 0; i < tradingPairs.length; i += parallelCount) {
              const batchPairs = tradingPairs.slice(i, i + parallelCount);
              const batchResults = yield Promise.all(batchPairs.map((tp) => {
                return __privateMethod(this, _FetchOhlcvDataUseCase_instances, fetchOne_fn).call(this, tp, utcNowMs, candlesPerTimeFrame);
              }));
              for (let j = 0; j < batchResults.length; j++) {
                const result = batchResults[j];
                if (!result) continue;
                results.push(result);
                const absoluteIndex = i + j;
                yield requestModel.reportProgress({
                  currentTradingPair: result.getTradingPair(),
                  currentPairIndex: absoluteIndex + 1,
                  totalPairsCount: tradingPairs.length
                });
              }
            }
            return new FetchOhlcvDataResponse(results);
          });
        }
      };
      _exchangeMethodsRegistry = new WeakMap();
      _FetchOhlcvDataUseCase_instances = new WeakSet();
      fetchOne_fn = function(tradingPair, utcNowMs, candlesPerTimeFrame) {
        return __async(this, null, function* () {
          try {
            const methods = __privateGet(this, _exchangeMethodsRegistry).get(
              tradingPair.getExchangeDescriptor()
            );
            return yield methods.createMultiTimeframeOhlcv(
              tradingPair,
              utcNowMs,
              candlesPerTimeFrame
            );
          } catch (err) {
            if (InsufficientOhlcvDataError.isInstance(err)) {
              console.warn(err);
              return null;
            }
            throw err;
          }
        });
      };
    }
  });

  // ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsResponse.ts
  var _tradingPairs2, FilterTradingPairsResponse;
  var init_FilterTradingPairsResponse = __esm({
    "ts_libs/ts_worker/application/usecases/FilterTradingPairs/FilterTradingPairsResponse.ts"() {
      "use strict";
      FilterTradingPairsResponse = class {
        constructor(tradingPairs) {
          __privateAdd(this, _tradingPairs2);
          __privateSet(this, _tradingPairs2, Object.freeze([...tradingPairs]));
          Object.freeze(this);
        }
        /**
         * Returns filtered trading pairs
         */
        getTradingPairs() {
          return [...__privateGet(this, _tradingPairs2)];
        }
      };
      _tradingPairs2 = new WeakMap();
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

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataResponse.ts
  var _multiTimeFrameData3, _updatedEntriesCount, SyncOhlcvDataResponse;
  var init_SyncOhlcvDataResponse = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataResponse.ts"() {
      "use strict";
      init_MultiTimeframeOhlcv();
      SyncOhlcvDataResponse = class {
        constructor(multiTimeFrameData, updatedEntriesCount) {
          __privateAdd(this, _multiTimeFrameData3);
          __privateAdd(this, _updatedEntriesCount);
          multiTimeFrameData.forEach((mtf) => MultiTimeframeOhlcv.fromUnknown(mtf));
          __privateSet(this, _multiTimeFrameData3, multiTimeFrameData);
          __privateSet(this, _updatedEntriesCount, updatedEntriesCount);
          Object.freeze(this);
        }
        getMultiTimeFrameData() {
          return __privateGet(this, _multiTimeFrameData3);
        }
        getUpdatedEntriesCount() {
          return __privateGet(this, _updatedEntriesCount);
        }
      };
      _multiTimeFrameData3 = new WeakMap();
      _updatedEntriesCount = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataUseCase.ts
  var _exchangeMethodsRegistry2, _SyncOhlcvDataUseCase_instances, syncOne_fn, SyncOhlcvDataUseCase;
  var init_SyncOhlcvDataUseCase = __esm({
    "ts_libs/ts_worker/application/usecases/SyncOhlcvData/SyncOhlcvDataUseCase.ts"() {
      "use strict";
      init_UseCaseBase();
      init_SyncOhlcvDataResponse();
      init_TimeFrame();
      SyncOhlcvDataUseCase = class extends UseCaseBase {
        constructor(exchangeMethodsRegistry) {
          super();
          __privateAdd(this, _SyncOhlcvDataUseCase_instances);
          __privateAdd(this, _exchangeMethodsRegistry2);
          __privateSet(this, _exchangeMethodsRegistry2, exchangeMethodsRegistry);
        }
        run(requestModel) {
          return __async(this, null, function* () {
            const buffers = requestModel.getTradingPairBuffers();
            const parallelCount = requestModel.getParalelRequestsCount();
            const ts = requestModel.getUtcNowMilliseconds();
            const shouldSync = buffers.some((buffer) => {
              const nextStart = buffer.getBuffer(TimeFrame.ONE_MINUTE).getStartTime() + TimeFrame.ONE_MINUTE.asMilliseconds();
              const gap = ts - nextStart;
              return gap > TimeFrame.ONE_MINUTE.asMilliseconds();
            });
            if (shouldSync === false) {
              return new SyncOhlcvDataResponse(buffers, 0);
            }
            for (let i = 0; i < buffers.length; i += parallelCount) {
              const batch = buffers.slice(i, i + parallelCount);
              const results = yield Promise.all(batch.map((buffer) => __privateMethod(this, _SyncOhlcvDataUseCase_instances, syncOne_fn).call(this, buffer, ts)));
              for (let j = 0; j < results.length; j++) {
                const syncResult = results[j];
                const tradingPair = syncResult.multiTimeframeBuffer.getTradingPair();
                const tradingPairIndex = i + j + 1;
                yield requestModel.reportProgress({
                  currentTradingPair: tradingPair,
                  syncCount: syncResult.syncCount,
                  currentPairIndex: tradingPairIndex,
                  totalPairsCount: buffers.length
                });
              }
            }
            return new SyncOhlcvDataResponse(buffers, buffers.length);
          });
        }
      };
      _exchangeMethodsRegistry2 = new WeakMap();
      _SyncOhlcvDataUseCase_instances = new WeakSet();
      syncOne_fn = function(mtfBuffer, timeStamp) {
        return __async(this, null, function* () {
          const tradingPair = mtfBuffer.getTradingPair();
          const exchangeDescriptor = tradingPair.getExchangeDescriptor();
          const methods = __privateGet(this, _exchangeMethodsRegistry2).get(exchangeDescriptor);
          const count = yield methods.syncMultiTimeFrameOhlcv(
            mtfBuffer,
            timeStamp
          );
          return {
            multiTimeframeBuffer: mtfBuffer,
            syncCount: count
          };
        });
      };
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
      init_ExchangeMethodsBinance();
      init_ExchangeMethodsBybit();
      init_TimeProvider();
      init_EnumerateExchangesUseCase();
      init_FetchOhlcvDataUseCase();
      init_FilterTradingPairsUseCase();
      init_SyncOhlcvDataUseCase();
      UseCaseContainer = class _UseCaseContainer {
        constructor(exchangeDescriptorRegistry, exchangeMethodsRegistry, tradingPairsRepository) {
          this.timeProvider = new TimeProvider();
          this.exchangeDescriptorRegistry = exchangeDescriptorRegistry;
          this.exchangeMethodsRegistry = exchangeMethodsRegistry;
          this.tradingPairsRepository = tradingPairsRepository;
          this.enumerateExchangesUseCase = new EnumerateExchangesUseCase(exchangeDescriptorRegistry);
          this.filterTradingPairsUseCase = new FilterTradingPairsUseCase(tradingPairsRepository);
          this.fetchOhlcvDataUseCase = new FetchOhlcvDataUseCase(exchangeMethodsRegistry);
          this.syncOhlcvDataUseCase = new SyncOhlcvDataUseCase(exchangeMethodsRegistry);
          Object.freeze(this);
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
            return new _UseCaseContainer(exchangeDescriptorRegistry, exchangeMethodsRegistry, tradingPairsRepository);
          });
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/DailyRvaExtractor.ts
  var DailyRvaExtractor;
  var init_DailyRvaExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/DailyRvaExtractor.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_NamedAttribute();
      init_BaseSortableAttributeExtractor();
      DailyRvaExtractor = class _DailyRvaExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.rvaParams = this.useRvaIndicator(TimeFrame.ONE_DAY, new Period(14));
          this.metadata = new NamedAttributeMetadata(this.rvaParams.getId(), this.rvaParams.getDescription(), "number");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const rvaIndicator = data.findIndicator(this.rvaParams);
          if (rvaIndicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, rvaIndicator.getValue().getRelativeValue(), 2);
          }
          return NumericNamedAttribute.fromMetadata(this.metadata, void 0, void 0);
        }
        getId() {
          return _DailyRvaExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/ThirtyDayPercentChangeExtractor.ts
  var ThirtyDayPercentChangeExtractor;
  var init_ThirtyDayPercentChangeExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/ThirtyDayPercentChangeExtractor.ts"() {
      "use strict";
      init_Period();
      init_Source();
      init_TimeFrame();
      init_NamedAttribute();
      init_BaseSortableAttributeExtractor();
      ThirtyDayPercentChangeExtractor = class _ThirtyDayPercentChangeExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.params = this.usePercentChangeIndicator(TimeFrame.ONE_DAY, new Period(30), Source.CLOSE);
          this.metadata = new NamedAttributeMetadata(this.params.getId(), "30 Days Change %", "number");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const indicator = data.findIndicator(this.params);
          if (indicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, indicator.getValue().getValue(), 2);
          }
          return NumericNamedAttribute.fromMetadata(this.metadata, void 0, void 0);
        }
        getId() {
          return _ThirtyDayPercentChangeExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/BaseFilterableAttributeExtractor.ts
  var BaseFilterableAttributeExtractor;
  var init_BaseFilterableAttributeExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/BaseFilterableAttributeExtractor.ts"() {
      "use strict";
      init_BaseEvaluator();
      BaseFilterableAttributeExtractor = class extends BaseEvaluator {
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/filters/SmaUptrendFilter.ts
  var SmaUptrendFilter;
  var init_SmaUptrendFilter = __esm({
    "ts_libs/ts_worker/application/mappers/filters/SmaUptrendFilter.ts"() {
      "use strict";
      init_Source();
      init_NamedAttribute();
      init_BaseFilterableAttributeExtractor();
      SmaUptrendFilter = class _SmaUptrendFilter extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame) {
          super();
          this.params = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
          this.metadata = new NamedAttributeMetadata(`close.above.${this.params.getId()}`, `Uptrend: ${this.params.getDescription()} < Close`, "boolean");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const indicator = data.findIndicator(this.params);
          const close = data.getBuffer(this.params.timeFrame).getClose();
          if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
          }
          const isUptrend = close > indicator.getValue().getValue();
          return BooleanNamedAttribute.fromMetadata(this.metadata, isUptrend);
        }
        getId() {
          return `${_SmaUptrendFilter.name}.${this.getNamedAttributeMetadata().key}`;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/filters/RsiOversoldFilter.ts
  var RsiOversoldFilter;
  var init_RsiOversoldFilter = __esm({
    "ts_libs/ts_worker/application/mappers/filters/RsiOversoldFilter.ts"() {
      "use strict";
      init_Source();
      init_NamedAttribute();
      init_BaseFilterableAttributeExtractor();
      RsiOversoldFilter = class _RsiOversoldFilter extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame, oversoldTreshold) {
          super();
          this.oversoldTreshold = oversoldTreshold;
          this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
          this.metadata = new NamedAttributeMetadata(`rsi.oversold.filter.${this.params.getId()} < ${oversoldTreshold}`, `Oversold: ${this.params.getDescription()} <= ${oversoldTreshold}`, "boolean");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const indicator = data.findIndicator(this.params);
          if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
          }
          const isOversold = this.oversoldTreshold > indicator.getValue().getValue();
          return BooleanNamedAttribute.fromMetadata(this.metadata, isOversold);
        }
        getId() {
          return `${_RsiOversoldFilter.name}.${this.getNamedAttributeMetadata().key}`;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/filters/SmaDowntrendFilter.ts
  var SmaDowntrendFilter;
  var init_SmaDowntrendFilter = __esm({
    "ts_libs/ts_worker/application/mappers/filters/SmaDowntrendFilter.ts"() {
      "use strict";
      init_Source();
      init_NamedAttribute();
      init_BaseFilterableAttributeExtractor();
      SmaDowntrendFilter = class _SmaDowntrendFilter extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame) {
          super();
          this.params = this.useSmaIndicator(timeFrame, period, Source.CLOSE);
          this.metadata = new NamedAttributeMetadata(`close.below.${this.params.getId()}`, `Downtrend: ${this.params.getDescription()} > Close`, "boolean");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const indicator = data.findIndicator(this.params);
          const close = data.getBuffer(this.params.timeFrame).getClose();
          if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
          }
          const isDowntrend = close < indicator.getValue().getValue();
          return BooleanNamedAttribute.fromMetadata(this.metadata, isDowntrend);
        }
        getId() {
          return `${_SmaDowntrendFilter.name}.${this.getNamedAttributeMetadata().key}`;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/filters/RsiOverboughtFilter.ts
  var RsiOverboughtFilter;
  var init_RsiOverboughtFilter = __esm({
    "ts_libs/ts_worker/application/mappers/filters/RsiOverboughtFilter.ts"() {
      "use strict";
      init_Source();
      init_NamedAttribute();
      init_BaseFilterableAttributeExtractor();
      RsiOverboughtFilter = class _RsiOverboughtFilter extends BaseFilterableAttributeExtractor {
        constructor(period, timeFrame, overboughtTreshold) {
          super();
          this.overboughtTreshold = overboughtTreshold;
          this.params = this.useRsiIndicator(timeFrame, period, Source.CLOSE);
          this.metadata = new NamedAttributeMetadata(`rsi.overbought.filter.${this.params.getId()} > ${overboughtTreshold}`, `Overbought: ${this.params.getDescription()} >= ${overboughtTreshold}`, "boolean");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const indicator = data.findIndicator(this.params);
          if (!indicator.isReady()) {
            return BooleanNamedAttribute.fromMetadata(this.metadata);
          }
          const isOverBought = this.overboughtTreshold < indicator.getValue().getValue();
          return BooleanNamedAttribute.fromMetadata(this.metadata, isOverBought);
        }
        getId() {
          return `${_RsiOverboughtFilter.name}.${this.getNamedAttributeMetadata().key}`;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/mappers/extractors/FifteenMinutesRvaExtractor.ts
  var FifteenMinutesRvaExtractor;
  var init_FifteenMinutesRvaExtractor = __esm({
    "ts_libs/ts_worker/application/mappers/extractors/FifteenMinutesRvaExtractor.ts"() {
      "use strict";
      init_Period();
      init_TimeFrame();
      init_NamedAttribute();
      init_BaseSortableAttributeExtractor();
      FifteenMinutesRvaExtractor = class _FifteenMinutesRvaExtractor extends BaseSortableAttributeExtractor {
        constructor() {
          super();
          this.rvaParams = this.useRvaIndicator(TimeFrame.FIFTEEN_MINUTES, new Period(14));
          this.metadata = new NamedAttributeMetadata(`${this.rvaParams.getId()}`, `${this.rvaParams.getDescription()}`, "number");
        }
        getNamedAttributeMetadata() {
          return this.metadata;
        }
        extractNamedAttributeFrom(data) {
          const rvaIndicator = data.findIndicator(this.rvaParams);
          if (rvaIndicator.isReady()) {
            return NumericNamedAttribute.fromMetadata(this.metadata, rvaIndicator.getValue().getRelativeValue(), 2);
          }
          return NumericNamedAttribute.fromMetadata(this.metadata, void 0, void 0);
        }
        getId() {
          return _FifteenMinutesRvaExtractor.name;
        }
      };
    }
  });

  // ts_libs/ts_worker/worker/WorkerCoreImplementation.ts
  var _container, _mapper, _timeProvider, _mtf, _candlesPerTimeFrame2, _sortableFieldsExtractors, _dailyPriceChangeExtractor, _currentPriceExtractor, _dailyPendingRvaExtractor, _dailyRvaExtractor, _fifteenMinutesRvaExtractor, _thirtyDaysPercentChangeExtractor, _filterableFieldsExtractors, _WorkerCoreImplementation, WorkerCoreImplementation;
  var init_WorkerCoreImplementation = __esm({
    "ts_libs/ts_worker/worker/WorkerCoreImplementation.ts"() {
      "use strict";
      init_ScreenerSettings();
      init_ExchangeInclusionCriteria();
      init_DailyPriceChangeExtractor();
      init_CurrentPriceExtractor();
      init_DailyPendingRvaExtractor();
      init_ScreenerItemMapper();
      init_EnumerateExchangesRequest();
      init_FetchOhlcvDataRequest();
      init_FilterTradingPairsRequest();
      init_SyncOhlcvDataRequest();
      init_UseCaseContainer();
      init_Asset();
      init_TimeProvider();
      init_DailyRvaExtractor();
      init_ThirtyDayPercentChangeExtractor();
      init_SmaUptrendFilter();
      init_TimeFrame();
      init_Period();
      init_RsiOversoldFilter();
      init_SmaDowntrendFilter();
      init_RsiOverboughtFilter();
      init_FifteenMinutesRvaExtractor();
      _WorkerCoreImplementation = class _WorkerCoreImplementation {
        constructor(container) {
          __privateAdd(this, _container);
          __privateAdd(this, _mapper);
          __privateAdd(this, _timeProvider);
          __privateAdd(this, _mtf);
          __privateAdd(this, _candlesPerTimeFrame2);
          __privateAdd(this, _sortableFieldsExtractors);
          __privateAdd(this, _dailyPriceChangeExtractor);
          __privateAdd(this, _currentPriceExtractor);
          __privateAdd(this, _dailyPendingRvaExtractor);
          __privateAdd(this, _dailyRvaExtractor);
          __privateAdd(this, _fifteenMinutesRvaExtractor);
          __privateAdd(this, _thirtyDaysPercentChangeExtractor);
          __privateAdd(this, _filterableFieldsExtractors);
          __privateSet(this, _container, container);
          __privateSet(this, _timeProvider, new TimeProvider());
          __privateSet(this, _mtf, null);
          __privateSet(this, _mapper, new ScreenerItemMapper(container.exchangeMethodsRegistry));
          __privateSet(this, _candlesPerTimeFrame2, 400);
          __privateSet(this, _dailyPriceChangeExtractor, new DailyPriceChangeExtractor());
          __privateSet(this, _currentPriceExtractor, new CurrentPriceExtractor());
          __privateSet(this, _dailyPendingRvaExtractor, new DailyPendingRvaExtractor());
          __privateSet(this, _dailyRvaExtractor, new DailyRvaExtractor());
          __privateSet(this, _thirtyDaysPercentChangeExtractor, new ThirtyDayPercentChangeExtractor());
          __privateSet(this, _fifteenMinutesRvaExtractor, new FifteenMinutesRvaExtractor());
          __privateSet(this, _sortableFieldsExtractors, [__privateGet(this, _currentPriceExtractor), __privateGet(this, _dailyPriceChangeExtractor), __privateGet(this, _dailyPendingRvaExtractor), __privateGet(this, _dailyRvaExtractor), __privateGet(this, _fifteenMinutesRvaExtractor), __privateGet(this, _thirtyDaysPercentChangeExtractor)]);
          __privateSet(this, _filterableFieldsExtractors, []);
          let tfs = TimeFrame.values();
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaUptrendFilter(Period.fromUnknown(200), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaUptrendFilter(Period.fromUnknown(50), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaUptrendFilter(Period.fromUnknown(20), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaDowntrendFilter(Period.fromUnknown(200), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaDowntrendFilter(Period.fromUnknown(50), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new SmaDowntrendFilter(Period.fromUnknown(20), aTf));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new RsiOversoldFilter(Period.fromUnknown(2), aTf, 5));
          });
          tfs.forEach((aTf) => {
            __privateGet(this, _filterableFieldsExtractors).push(new RsiOverboughtFilter(Period.fromUnknown(2), aTf, 95));
          });
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
        createDefaultSettings() {
          return __async(this, null, function* () {
            let exchangeInclusionCriterias = [];
            let available = __privateGet(this, _container).exchangeDescriptorRegistry.all();
            for (let i = 0; i < available.length; i++) {
              exchangeInclusionCriterias.push(new ExchangeInclusionCriteria(available[i].getName(), available[i].getId(), true));
            }
            return new ScreenerSettings(exchangeInclusionCriterias);
          });
        }
        /**
         * Fetch initial data from exchanges
         */
        fetch(screenerSettings, progressCallback) {
          return __async(this, null, function* () {
            const exchangesResponse = yield __privateGet(this, _container).enumerateExchangesUseCase.execute(new EnumerateExchangesRequest(screenerSettings.getIncludedExchangeNames()));
            const tradingPairsResponse = yield __privateGet(this, _container).filterTradingPairsUseCase.execute(
              new FilterTradingPairsRequest(
                exchangesResponse.descriptors,
                [Asset.fromUnknown("usdc")],
                [Asset.fromUnknown("usdc"), Asset.fromUnknown("usdt")],
                [Asset.fromUnknown("usd1"), Asset.fromUnknown("bfusd"), Asset.fromUnknown("usde"), Asset.fromUnknown("fdusd"), Asset.fromUnknown("euri"), Asset.fromUnknown("eur")],
                screenerSettings.maximumPairsCountPerExchange
              )
            );
            const tradingPairs = tradingPairsResponse.getTradingPairs();
            const sixHours = 216e5;
            const nowMs = (yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true)) - sixHours;
            const fetchRequest = new FetchOhlcvDataRequest(
              tradingPairs,
              __privateGet(this, _candlesPerTimeFrame2),
              screenerSettings.parallelRequestsCount,
              nowMs,
              (progress) => __async(this, null, function* () {
                let percent = 0.7 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Fetched ${progress.currentTradingPair.symbol()} initial data from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
              })
            );
            const fetchResponse = yield __privateGet(this, _container).fetchOhlcvDataUseCase.execute(fetchRequest);
            __privateSet(this, _mtf, fetchResponse.getMultiTimeFrameData());
            __privateGet(this, _sortableFieldsExtractors).forEach((sfe) => sfe.ensureIndicatorsRegisteredNoThrow(__privateGet(this, _mtf)));
            __privateGet(this, _filterableFieldsExtractors).forEach((sfe) => sfe.ensureIndicatorsRegisteredNoThrow(__privateGet(this, _mtf)));
            const syncMs = yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true);
            const syncRequest = new SyncOhlcvDataRequest(
              __privateGet(this, _mtf),
              screenerSettings.parallelRequestsCount,
              syncMs,
              (progress) => __async(this, null, function* () {
                let percent = 70 + 0.3 * (progress.currentPairIndex * 100) / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
              })
            );
            const syncResponse = yield __privateGet(this, _container).syncOhlcvDataUseCase.execute(syncRequest);
            const mapped = __privateGet(this, _mapper).mapMultiple(__privateGet(this, _sortableFieldsExtractors), __privateGet(this, _filterableFieldsExtractors), syncResponse.getMultiTimeFrameData());
            return mapped;
          });
        }
        sync(screenerSettings, progressCallback) {
          return __async(this, null, function* () {
            if (__privateGet(this, _mtf) === null) {
              throw new Error(`Synchronization is not possible`);
            }
            __privateGet(this, _sortableFieldsExtractors).forEach((sfe) => sfe.ensureIndicatorsRegisteredNoThrow(__privateGet(this, _mtf)));
            __privateGet(this, _filterableFieldsExtractors).forEach((sfe) => sfe.ensureIndicatorsRegisteredNoThrow(__privateGet(this, _mtf)));
            const syncMs = yield __privateGet(this, _timeProvider).getUtcNowMilliseconds(true);
            const syncRequest = new SyncOhlcvDataRequest(
              __privateGet(this, _mtf),
              screenerSettings.parallelRequestsCount,
              syncMs,
              (progress) => __async(this, null, function* () {
                let percent = progress.currentPairIndex * 100 / progress.totalPairsCount;
                var message = `${progress.currentPairIndex} / ${progress.totalPairsCount} - Synced ${progress.syncCount} candles for ${progress.currentTradingPair.symbol()} from ${progress.currentTradingPair.getExchangeDescriptor().getName()} ...`;
                progressCallback(percent, message);
              })
            );
            const syncResponse = yield __privateGet(this, _container).syncOhlcvDataUseCase.execute(syncRequest);
            const mapped = __privateGet(this, _mapper).mapMultiple(__privateGet(this, _sortableFieldsExtractors), __privateGet(this, _filterableFieldsExtractors), syncResponse.getMultiTimeFrameData());
            return mapped;
          });
        }
      };
      _container = new WeakMap();
      _mapper = new WeakMap();
      _timeProvider = new WeakMap();
      _mtf = new WeakMap();
      _candlesPerTimeFrame2 = new WeakMap();
      _sortableFieldsExtractors = new WeakMap();
      _dailyPriceChangeExtractor = new WeakMap();
      _currentPriceExtractor = new WeakMap();
      _dailyPendingRvaExtractor = new WeakMap();
      _dailyRvaExtractor = new WeakMap();
      _fifteenMinutesRvaExtractor = new WeakMap();
      _thirtyDaysPercentChangeExtractor = new WeakMap();
      _filterableFieldsExtractors = new WeakMap();
      WorkerCoreImplementation = _WorkerCoreImplementation;
    }
  });

  // ts_libs/ts_worker/index.ts
  var require_index = __commonJS({
    "ts_libs/ts_worker/index.ts"() {
      init_ScreenerSettings();
      init_TradingPairsCodec();
      init_WorkerCoreImplementation();
      function initCall(id) {
        return __async(this, null, function* () {
          try {
            var controller = yield getController();
            var data = yield controller.createDefaultSettings();
            var jsonData = data.toJson();
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
            var settings = ScreenerSettings.fromJson(payload);
            var data = yield controller.fetch(settings, (progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
            var dataForWorker = TradingPairsCodec.toJsonString(data);
            _workerPostResolve(id, dataForWorker);
          } catch (err) {
            _workerPostReject(id, err);
          }
        });
      }
      function synchronizeCall(id, progressEventName, payload) {
        return __async(this, null, function* () {
          try {
            var controller = yield getController();
            var settings = ScreenerSettings.fromJson(payload);
            var data = yield controller.sync(settings, (progress, message) => _workerPostEvent(id, progressEventName, { progress, message }));
            var dataForWorker = TradingPairsCodec.toJsonString(data);
            _workerPostResolve(id, dataForWorker);
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
        console.log(`${WorkerCoreImplementation.name}::onmessage, ${JSON.stringify(event.data)}`);
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
