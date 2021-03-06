(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name4 in all)
      __defProp(target, name4, { get: all[name4], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
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

  // node_modules/@firebase/util/dist/index.esm2017.js
  function isIndexedDBAvailable() {
    return typeof indexedDB === "object";
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
      if (!bKeys.includes(k)) {
        return false;
      }
      const aProp = a[k];
      const bProp = b[k];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k of bKeys) {
      if (!aKeys.includes(k)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function promisifyRequest(request, errorMessage) {
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        var _a;
        reject(`${errorMessage}: ${(_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message}`);
      };
    });
  }
  function openDB(dbName, dbVersion, upgradeCallback) {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(dbName, dbVersion);
        request.onsuccess = (event) => {
          resolve(new DBWrapper(event.target.result));
        };
        request.onerror = (event) => {
          var _a;
          reject(`Error opening indexedDB: ${(_a = event.target.error) === null || _a === void 0 ? void 0 : _a.message}`);
        };
        request.onupgradeneeded = (event) => {
          upgradeCallback(new DBWrapper(request.result), event.oldVersion, event.newVersion, new TransactionWrapper(request.transaction));
        };
      } catch (e) {
        reject(`Error opening indexedDB: ${e.message}`);
      }
    });
  }
  var stringToByteArray$1, byteArrayToString, base64, base64Encode, base64urlEncodeWithoutPadding, Deferred, ERROR_NAME, FirebaseError, ErrorFactory, PATTERN, MAX_VALUE_MILLIS, DBWrapper, TransactionWrapper, ObjectStoreWrapper, IndexWrapper;
  var init_index_esm2017 = __esm({
    "node_modules/@firebase/util/dist/index.esm2017.js"() {
      stringToByteArray$1 = function(str) {
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c < 128) {
            out[p++] = c;
          } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
          } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          }
        }
        return out;
      };
      byteArrayToString = function(bytes) {
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
          const c1 = bytes[pos++];
          if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
          } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
          } else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
          } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          }
        }
        return out.join("");
      };
      base64 = {
        byteToCharMap_: null,
        charToByteMap_: null,
        byteToCharMapWebSafe_: null,
        charToByteMapWebSafe_: null,
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/=";
        },
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_.";
        },
        HAS_NATIVE_SUPPORT: typeof atob === "function",
        encodeByteArray(input, webSafe) {
          if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
          }
          this.init_();
          const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
          const output = [];
          for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
              outByte4 = 64;
              if (!haveByte2) {
                outByte3 = 64;
              }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
          }
          return output.join("");
        },
        encodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
          }
          return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        decodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
          }
          return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        decodeStringToByteArray(input, webSafe) {
          this.init_();
          const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
          const output = [];
          for (let i = 0; i < input.length; ) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
              throw Error();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
              const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
              output.push(outByte2);
              if (byte4 !== 64) {
                const outByte3 = byte3 << 6 & 192 | byte4;
                output.push(outByte3);
              }
            }
          }
          return output;
        },
        init_() {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
              this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
              this.charToByteMap_[this.byteToCharMap_[i]] = i;
              this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
              this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
              if (i >= this.ENCODED_VALS_BASE.length) {
                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
              }
            }
          }
        }
      };
      base64Encode = function(str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
      };
      base64urlEncodeWithoutPadding = function(str) {
        return base64Encode(str).replace(/\./g, "");
      };
      Deferred = class {
        constructor() {
          this.reject = () => {
          };
          this.resolve = () => {
          };
          this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
          });
        }
        wrapCallback(callback) {
          return (error, value) => {
            if (error) {
              this.reject(error);
            } else {
              this.resolve(value);
            }
            if (typeof callback === "function") {
              this.promise.catch(() => {
              });
              if (callback.length === 1) {
                callback(error);
              } else {
                callback(error, value);
              }
            }
          };
        }
      };
      ERROR_NAME = "FirebaseError";
      FirebaseError = class extends Error {
        constructor(code, message, customData) {
          super(message);
          this.code = code;
          this.customData = customData;
          this.name = ERROR_NAME;
          Object.setPrototypeOf(this, FirebaseError.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
          }
        }
      };
      ErrorFactory = class {
        constructor(service, serviceName, errors) {
          this.service = service;
          this.serviceName = serviceName;
          this.errors = errors;
        }
        create(code, ...data) {
          const customData = data[0] || {};
          const fullCode = `${this.service}/${code}`;
          const template = this.errors[code];
          const message = template ? replaceTemplate(template, customData) : "Error";
          const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
          const error = new FirebaseError(fullCode, fullMessage, customData);
          return error;
        }
      };
      PATTERN = /\{\$([^}]+)}/g;
      MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
      DBWrapper = class {
        constructor(_db) {
          this._db = _db;
          this.objectStoreNames = this._db.objectStoreNames;
        }
        transaction(storeNames, mode) {
          return new TransactionWrapper(this._db.transaction.call(this._db, storeNames, mode));
        }
        createObjectStore(storeName, options) {
          return new ObjectStoreWrapper(this._db.createObjectStore(storeName, options));
        }
        close() {
          this._db.close();
        }
      };
      TransactionWrapper = class {
        constructor(_transaction) {
          this._transaction = _transaction;
          this.complete = new Promise((resolve, reject) => {
            this._transaction.oncomplete = function() {
              resolve();
            };
            this._transaction.onerror = () => {
              reject(this._transaction.error);
            };
            this._transaction.onabort = () => {
              reject(this._transaction.error);
            };
          });
        }
        objectStore(storeName) {
          return new ObjectStoreWrapper(this._transaction.objectStore(storeName));
        }
      };
      ObjectStoreWrapper = class {
        constructor(_store) {
          this._store = _store;
        }
        index(name4) {
          return new IndexWrapper(this._store.index(name4));
        }
        createIndex(name4, keypath, options) {
          return new IndexWrapper(this._store.createIndex(name4, keypath, options));
        }
        get(key) {
          const request = this._store.get(key);
          return promisifyRequest(request, "Error reading from IndexedDB");
        }
        put(value, key) {
          const request = this._store.put(value, key);
          return promisifyRequest(request, "Error writing to IndexedDB");
        }
        delete(key) {
          const request = this._store.delete(key);
          return promisifyRequest(request, "Error deleting from IndexedDB");
        }
        clear() {
          const request = this._store.clear();
          return promisifyRequest(request, "Error clearing IndexedDB object store");
        }
      };
      IndexWrapper = class {
        constructor(_index) {
          this._index = _index;
        }
        get(key) {
          const request = this._index.get(key);
          return promisifyRequest(request, "Error reading from IndexedDB");
        }
      };
    }
  });

  // node_modules/@firebase/component/dist/esm/index.esm2017.js
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var Component, DEFAULT_ENTRY_NAME, Provider, ComponentContainer;
  var init_index_esm20172 = __esm({
    "node_modules/@firebase/component/dist/esm/index.esm2017.js"() {
      init_index_esm2017();
      Component = class {
        constructor(name4, instanceFactory, type) {
          this.name = name4;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          this.serviceProps = {};
          this.instantiationMode = "LAZY";
          this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }
        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }
        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }
        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }
      };
      DEFAULT_ENTRY_NAME = "[DEFAULT]";
      Provider = class {
        constructor(name4, container) {
          this.name = name4;
          this.container = container;
          this.component = null;
          this.instances = new Map();
          this.instancesDeferred = new Map();
          this.instancesOptions = new Map();
          this.onInitCallbacks = new Map();
        }
        get(identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
              try {
                const instance = this.getOrInitializeService({
                  instanceIdentifier: normalizedIdentifier
                });
                if (instance) {
                  deferred.resolve(instance);
                }
              } catch (e) {
              }
            }
          }
          return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
          var _a;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
          const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              return this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
            } catch (e) {
              if (optional) {
                return null;
              } else {
                throw e;
              }
            }
          } else {
            if (optional) {
              return null;
            } else {
              throw Error(`Service ${this.name} is not available`);
            }
          }
        }
        getComponent() {
          return this.component;
        }
        setComponent(component) {
          if (component.name !== this.name) {
            throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
          }
          if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
          }
          this.component = component;
          if (!this.shouldAutoInitialize()) {
            return;
          }
          if (isComponentEager(component)) {
            try {
              this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
            } catch (e) {
            }
          }
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
              const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              instanceDeferred.resolve(instance);
            } catch (e) {
            }
          }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME) {
          this.instancesDeferred.delete(identifier);
          this.instancesOptions.delete(identifier);
          this.instances.delete(identifier);
        }
        async delete() {
          const services = Array.from(this.instances.values());
          await Promise.all([
            ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
            ...services.filter((service) => "_delete" in service).map((service) => service._delete())
          ]);
        }
        isComponentSet() {
          return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME) {
          return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME) {
          return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
          const { options = {} } = opts;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
          if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
          }
          if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
          }
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
          });
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
              instanceDeferred.resolve(instance);
            }
          }
          return instance;
        }
        onInit(callback, identifier) {
          var _a;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
          existingCallbacks.add(callback);
          this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
          const existingInstance = this.instances.get(normalizedIdentifier);
          if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
          }
          return () => {
            existingCallbacks.delete(callback);
          };
        }
        invokeOnInitCallbacks(instance, identifier) {
          const callbacks = this.onInitCallbacks.get(identifier);
          if (!callbacks) {
            return;
          }
          for (const callback of callbacks) {
            try {
              callback(instance, identifier);
            } catch (_a) {
            }
          }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
          let instance = this.instances.get(instanceIdentifier);
          if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
              instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
              options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            if (this.component.onInstanceCreated) {
              try {
                this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
              } catch (_a) {
              }
            }
          }
          return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
          if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
          } else {
            return identifier;
          }
        }
        shouldAutoInitialize() {
          return !!this.component && this.component.instantiationMode !== "EXPLICIT";
        }
      };
      ComponentContainer = class {
        constructor(name4) {
          this.name = name4;
          this.providers = new Map();
        }
        addComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
          }
          provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            this.providers.delete(component.name);
          }
          this.addComponent(component);
        }
        getProvider(name4) {
          if (this.providers.has(name4)) {
            return this.providers.get(name4);
          }
          const provider = new Provider(name4, this);
          this.providers.set(name4, provider);
          return provider;
        }
        getProviders() {
          return Array.from(this.providers.values());
        }
      };
    }
  });

  // node_modules/@firebase/logger/dist/esm/index.esm2017.js
  function setLogLevel(level) {
    instances.forEach((inst) => {
      inst.setLogLevel(level);
    });
  }
  function setUserLogHandler(logCallback, options) {
    for (const instance of instances) {
      let customLogLevel = null;
      if (options && options.level) {
        customLogLevel = levelStringToEnum[options.level];
      }
      if (logCallback === null) {
        instance.userLogHandler = null;
      } else {
        instance.userLogHandler = (instance2, level, ...args) => {
          const message = args.map((arg) => {
            if (arg == null) {
              return null;
            } else if (typeof arg === "string") {
              return arg;
            } else if (typeof arg === "number" || typeof arg === "boolean") {
              return arg.toString();
            } else if (arg instanceof Error) {
              return arg.message;
            } else {
              try {
                return JSON.stringify(arg);
              } catch (ignored) {
                return null;
              }
            }
          }).filter((arg) => arg).join(" ");
          if (level >= (customLogLevel !== null && customLogLevel !== void 0 ? customLogLevel : instance2.logLevel)) {
            logCallback({
              level: LogLevel[level].toLowerCase(),
              message,
              args,
              type: instance2.name
            });
          }
        };
      }
    }
  }
  var instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler, Logger;
  var init_index_esm20173 = __esm({
    "node_modules/@firebase/logger/dist/esm/index.esm2017.js"() {
      instances = [];
      (function(LogLevel2) {
        LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
        LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
        LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
        LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
        LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
        LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
      })(LogLevel || (LogLevel = {}));
      levelStringToEnum = {
        "debug": LogLevel.DEBUG,
        "verbose": LogLevel.VERBOSE,
        "info": LogLevel.INFO,
        "warn": LogLevel.WARN,
        "error": LogLevel.ERROR,
        "silent": LogLevel.SILENT
      };
      defaultLogLevel = LogLevel.INFO;
      ConsoleMethod = {
        [LogLevel.DEBUG]: "log",
        [LogLevel.VERBOSE]: "log",
        [LogLevel.INFO]: "info",
        [LogLevel.WARN]: "warn",
        [LogLevel.ERROR]: "error"
      };
      defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
          return;
        }
        const now = new Date().toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
          console[method](`[${now}]  ${instance.name}:`, ...args);
        } else {
          throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
      };
      Logger = class {
        constructor(name4) {
          this.name = name4;
          this._logLevel = defaultLogLevel;
          this._logHandler = defaultLogHandler;
          this._userLogHandler = null;
          instances.push(this);
        }
        get logLevel() {
          return this._logLevel;
        }
        set logLevel(val) {
          if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
          }
          this._logLevel = val;
        }
        setLogLevel(val) {
          this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
        }
        get logHandler() {
          return this._logHandler;
        }
        set logHandler(val) {
          if (typeof val !== "function") {
            throw new TypeError("Value assigned to `logHandler` must be a function");
          }
          this._logHandler = val;
        }
        get userLogHandler() {
          return this._userLogHandler;
        }
        set userLogHandler(val) {
          this._userLogHandler = val;
        }
        debug(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
          this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
          this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
          this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
          this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
          this._logHandler(this, LogLevel.ERROR, ...args);
        }
      };
    }
  });

  // node_modules/@firebase/app/dist/esm/index.esm2017.js
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  function _addComponent(app, component) {
    try {
      app.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
    }
  }
  function _addOrOverwriteComponent(app, component) {
    app.container.addOrOverwriteComponent(component);
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app of _apps.values()) {
      _addComponent(app, component);
    }
    return true;
  }
  function _getProvider(app, name4) {
    const heartbeatController = app.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app.container.getProvider(name4);
  }
  function _removeServiceInstance(app, name4, instanceIdentifier = DEFAULT_ENTRY_NAME2) {
    _getProvider(app, name4).clearInstance(instanceIdentifier);
  }
  function _clearComponents() {
    _components.clear();
  }
  function initializeApp(options, rawConfig = {}) {
    if (typeof rawConfig !== "object") {
      const name5 = rawConfig;
      rawConfig = { name: name5 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name4 = config.name;
    if (typeof name4 !== "string" || !name4) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name4)
      });
    }
    const existingApp = _apps.get(name4);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name4 });
      }
    }
    const container = new ComponentContainer(name4);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name4, newApp);
    return newApp;
  }
  function getApp(name4 = DEFAULT_ENTRY_NAME2) {
    const app = _apps.get(name4);
    if (!app) {
      throw ERROR_FACTORY.create("no-app", { appName: name4 });
    }
    return app;
  }
  function getApps() {
    return Array.from(_apps.values());
  }
  async function deleteApp(app) {
    const name4 = app.name;
    if (_apps.has(name4)) {
      _apps.delete(name4);
      await Promise.all(app.container.getProviders().map((provider) => provider.delete()));
      app.isDeleted = true;
    }
  }
  function registerVersion(libraryKeyOrName, version4, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version4.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version4}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version4}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(`${library}-version`, () => ({ library, version: version4 }), "VERSION"));
  }
  function onLog(logCallback, options) {
    if (logCallback !== null && typeof logCallback !== "function") {
      throw ERROR_FACTORY.create("invalid-log-argument");
    }
    setUserLogHandler(logCallback, options);
  }
  function setLogLevel2(logLevel) {
    setLogLevel(logLevel);
  }
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, (db, oldVersion) => {
        switch (oldVersion) {
          case 0:
            db.createObjectStore(STORE_NAME);
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("storage-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app) {
    try {
      const db = await getDbPromise();
      return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app));
    } catch (e) {
      throw ERROR_FACTORY.create("storage-get", {
        originalErrorMessage: e.message
      });
    }
  }
  async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app));
      return tx.complete;
    } catch (e) {
      throw ERROR_FACTORY.create("storage-set", {
        originalErrorMessage: e.message
      });
    }
  }
  function computeKey(app) {
    return `${app.name}!${app.options.appId}`;
  }
  function getUTCDateString() {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
    _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
    registerVersion(name$o, version$1, variant);
    registerVersion(name$o, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  var PlatformLoggerServiceImpl, name$o, version$1, logger, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, version, DEFAULT_ENTRY_NAME2, PLATFORM_LOG_STRING, _apps, _components, ERRORS, ERROR_FACTORY, FirebaseAppImpl, SDK_VERSION, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, STORED_HEARTBEAT_RETENTION_MAX_MILLIS, HeartbeatServiceImpl, HeartbeatStorageImpl;
  var init_index_esm20174 = __esm({
    "node_modules/@firebase/app/dist/esm/index.esm2017.js"() {
      init_index_esm20172();
      init_index_esm20173();
      init_index_esm2017();
      init_index_esm2017();
      PlatformLoggerServiceImpl = class {
        constructor(container) {
          this.container = container;
        }
        getPlatformInfoString() {
          const providers = this.container.getProviders();
          return providers.map((provider) => {
            if (isVersionServiceProvider(provider)) {
              const service = provider.getImmediate();
              return `${service.library}/${service.version}`;
            } else {
              return null;
            }
          }).filter((logString) => logString).join(" ");
        }
      };
      name$o = "@firebase/app";
      version$1 = "0.7.20";
      logger = new Logger("@firebase/app");
      name$n = "@firebase/app-compat";
      name$m = "@firebase/analytics-compat";
      name$l = "@firebase/analytics";
      name$k = "@firebase/app-check-compat";
      name$j = "@firebase/app-check";
      name$i = "@firebase/auth";
      name$h = "@firebase/auth-compat";
      name$g = "@firebase/database";
      name$f = "@firebase/database-compat";
      name$e = "@firebase/functions";
      name$d = "@firebase/functions-compat";
      name$c = "@firebase/installations";
      name$b = "@firebase/installations-compat";
      name$a = "@firebase/messaging";
      name$9 = "@firebase/messaging-compat";
      name$8 = "@firebase/performance";
      name$7 = "@firebase/performance-compat";
      name$6 = "@firebase/remote-config";
      name$5 = "@firebase/remote-config-compat";
      name$4 = "@firebase/storage";
      name$3 = "@firebase/storage-compat";
      name$2 = "@firebase/firestore";
      name$1 = "@firebase/firestore-compat";
      name = "firebase";
      version = "9.6.10";
      DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
      PLATFORM_LOG_STRING = {
        [name$o]: "fire-core",
        [name$n]: "fire-core-compat",
        [name$l]: "fire-analytics",
        [name$m]: "fire-analytics-compat",
        [name$j]: "fire-app-check",
        [name$k]: "fire-app-check-compat",
        [name$i]: "fire-auth",
        [name$h]: "fire-auth-compat",
        [name$g]: "fire-rtdb",
        [name$f]: "fire-rtdb-compat",
        [name$e]: "fire-fn",
        [name$d]: "fire-fn-compat",
        [name$c]: "fire-iid",
        [name$b]: "fire-iid-compat",
        [name$a]: "fire-fcm",
        [name$9]: "fire-fcm-compat",
        [name$8]: "fire-perf",
        [name$7]: "fire-perf-compat",
        [name$6]: "fire-rc",
        [name$5]: "fire-rc-compat",
        [name$4]: "fire-gcs",
        [name$3]: "fire-gcs-compat",
        [name$2]: "fire-fst",
        [name$1]: "fire-fst-compat",
        "fire-js": "fire-js",
        [name]: "fire-js-all"
      };
      _apps = new Map();
      _components = new Map();
      ERRORS = {
        ["no-app"]: "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
        ["bad-app-name"]: "Illegal App name: '{$appName}",
        ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
        ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
        ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
        ["storage-open"]: "Error thrown when opening storage. Original error: {$originalErrorMessage}.",
        ["storage-get"]: "Error thrown when reading from storage. Original error: {$originalErrorMessage}.",
        ["storage-set"]: "Error thrown when writing to storage. Original error: {$originalErrorMessage}.",
        ["storage-delete"]: "Error thrown when deleting from storage. Original error: {$originalErrorMessage}."
      };
      ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
      FirebaseAppImpl = class {
        constructor(options, config, container) {
          this._isDeleted = false;
          this._options = Object.assign({}, options);
          this._config = Object.assign({}, config);
          this._name = config.name;
          this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
          this._container = container;
          this.container.addComponent(new Component("app", () => this, "PUBLIC"));
        }
        get automaticDataCollectionEnabled() {
          this.checkDestroyed();
          return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
          this.checkDestroyed();
          this._automaticDataCollectionEnabled = val;
        }
        get name() {
          this.checkDestroyed();
          return this._name;
        }
        get options() {
          this.checkDestroyed();
          return this._options;
        }
        get config() {
          this.checkDestroyed();
          return this._config;
        }
        get container() {
          return this._container;
        }
        get isDeleted() {
          return this._isDeleted;
        }
        set isDeleted(val) {
          this._isDeleted = val;
        }
        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
          }
        }
      };
      SDK_VERSION = version;
      DB_NAME = "firebase-heartbeat-database";
      DB_VERSION = 1;
      STORE_NAME = "firebase-heartbeat-store";
      dbPromise = null;
      MAX_HEADER_BYTES = 1024;
      STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
      HeartbeatServiceImpl = class {
        constructor(container) {
          this.container = container;
          this._heartbeatsCache = null;
          const app = this.container.getProvider("app").getImmediate();
          this._storage = new HeartbeatStorageImpl(app);
          this._heartbeatsCachePromise = this._storage.read().then((result) => {
            this._heartbeatsCache = result;
            return result;
          });
        }
        async triggerHeartbeat() {
          const platformLogger = this.container.getProvider("platform-logger").getImmediate();
          const agent = platformLogger.getPlatformInfoString();
          const date = getUTCDateString();
          if (this._heartbeatsCache === null) {
            this._heartbeatsCache = await this._heartbeatsCachePromise;
          }
          if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
            return;
          } else {
            this._heartbeatsCache.heartbeats.push({ date, agent });
          }
          this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
            const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
            const now = Date.now();
            return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
          });
          return this._storage.overwrite(this._heartbeatsCache);
        }
        async getHeartbeatsHeader() {
          if (this._heartbeatsCache === null) {
            await this._heartbeatsCachePromise;
          }
          if (this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0) {
            return "";
          }
          const date = getUTCDateString();
          const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
          const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
          this._heartbeatsCache.lastSentHeartbeatDate = date;
          if (unsentEntries.length > 0) {
            this._heartbeatsCache.heartbeats = unsentEntries;
            await this._storage.overwrite(this._heartbeatsCache);
          } else {
            this._heartbeatsCache.heartbeats = [];
            void this._storage.overwrite(this._heartbeatsCache);
          }
          return headerString;
        }
      };
      HeartbeatStorageImpl = class {
        constructor(app) {
          this.app = app;
          this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
          if (!isIndexedDBAvailable()) {
            return false;
          } else {
            return validateIndexedDBOpenable().then(() => true).catch(() => false);
          }
        }
        async read() {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return { heartbeats: [] };
          } else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            return idbHeartbeatObject || { heartbeats: [] };
          }
        }
        async overwrite(heartbeatsObject) {
          var _a;
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: heartbeatsObject.heartbeats
            });
          }
        }
        async add(heartbeatsObject) {
          var _a;
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: [
                ...existingHeartbeatsObject.heartbeats,
                ...heartbeatsObject.heartbeats
              ]
            });
          }
        }
      };
      registerCoreComponents("");
    }
  });

  // node_modules/firebase/app/dist/index.esm.js
  var index_esm_exports = {};
  __export(index_esm_exports, {
    FirebaseError: () => FirebaseError,
    SDK_VERSION: () => SDK_VERSION,
    _DEFAULT_ENTRY_NAME: () => DEFAULT_ENTRY_NAME2,
    _addComponent: () => _addComponent,
    _addOrOverwriteComponent: () => _addOrOverwriteComponent,
    _apps: () => _apps,
    _clearComponents: () => _clearComponents,
    _components: () => _components,
    _getProvider: () => _getProvider,
    _registerComponent: () => _registerComponent,
    _removeServiceInstance: () => _removeServiceInstance,
    deleteApp: () => deleteApp,
    getApp: () => getApp,
    getApps: () => getApps,
    initializeApp: () => initializeApp,
    onLog: () => onLog,
    registerVersion: () => registerVersion,
    setLogLevel: () => setLogLevel2
  });
  var name2, version2;
  var init_index_esm = __esm({
    "node_modules/firebase/app/dist/index.esm.js"() {
      init_index_esm20174();
      init_index_esm20174();
      name2 = "firebase";
      version2 = "9.6.10";
      registerVersion(name2, version2, "app");
    }
  });

  // node_modules/@firebase/auth/node_modules/@firebase/util/dist/index.esm2017.js
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isIE() {
    const ua = getUA();
    return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
  }
  function replaceTemplate2(template, data) {
    return template.replace(PATTERN2, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  function isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  function deepEqual2(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k of aKeys) {
      if (!bKeys.includes(k)) {
        return false;
      }
      const aProp = a[k];
      const bProp = b[k];
      if (isObject2(aProp) && isObject2(bProp)) {
        if (!deepEqual2(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k of bKeys) {
      if (!aKeys.includes(k)) {
        return false;
      }
    }
    return true;
  }
  function isObject2(thing) {
    return thing !== null && typeof thing === "object";
  }
  function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
      if (Array.isArray(value)) {
        value.forEach((arrayVal) => {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
        });
      } else {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return params.length ? "&" + params.join("&") : "";
  }
  function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token) => {
      if (token) {
        const [key, value] = token.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return obj;
  }
  function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
      return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
  }
  function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
  }
  function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    for (const method of methods) {
      if (method in obj && typeof obj[method] === "function") {
        return true;
      }
    }
    return false;
  }
  function noop() {
  }
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }
  var stringToByteArray$12, byteArrayToString2, base642, base64Decode, ERROR_NAME2, FirebaseError2, ErrorFactory2, PATTERN2, ObserverProxy, MAX_VALUE_MILLIS2;
  var init_index_esm20175 = __esm({
    "node_modules/@firebase/auth/node_modules/@firebase/util/dist/index.esm2017.js"() {
      stringToByteArray$12 = function(str) {
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c < 128) {
            out[p++] = c;
          } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
          } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          }
        }
        return out;
      };
      byteArrayToString2 = function(bytes) {
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
          const c1 = bytes[pos++];
          if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
          } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
          } else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
          } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          }
        }
        return out.join("");
      };
      base642 = {
        byteToCharMap_: null,
        charToByteMap_: null,
        byteToCharMapWebSafe_: null,
        charToByteMapWebSafe_: null,
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/=";
        },
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_.";
        },
        HAS_NATIVE_SUPPORT: typeof atob === "function",
        encodeByteArray(input, webSafe) {
          if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
          }
          this.init_();
          const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
          const output = [];
          for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
              outByte4 = 64;
              if (!haveByte2) {
                outByte3 = 64;
              }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
          }
          return output.join("");
        },
        encodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
          }
          return this.encodeByteArray(stringToByteArray$12(input), webSafe);
        },
        decodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
          }
          return byteArrayToString2(this.decodeStringToByteArray(input, webSafe));
        },
        decodeStringToByteArray(input, webSafe) {
          this.init_();
          const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
          const output = [];
          for (let i = 0; i < input.length; ) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
              throw Error();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
              const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
              output.push(outByte2);
              if (byte4 !== 64) {
                const outByte3 = byte3 << 6 & 192 | byte4;
                output.push(outByte3);
              }
            }
          }
          return output;
        },
        init_() {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
              this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
              this.charToByteMap_[this.byteToCharMap_[i]] = i;
              this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
              this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
              if (i >= this.ENCODED_VALS_BASE.length) {
                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
              }
            }
          }
        }
      };
      base64Decode = function(str) {
        try {
          return base642.decodeString(str, true);
        } catch (e) {
          console.error("base64Decode failed: ", e);
        }
        return null;
      };
      ERROR_NAME2 = "FirebaseError";
      FirebaseError2 = class extends Error {
        constructor(code, message, customData) {
          super(message);
          this.code = code;
          this.customData = customData;
          this.name = ERROR_NAME2;
          Object.setPrototypeOf(this, FirebaseError2.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory2.prototype.create);
          }
        }
      };
      ErrorFactory2 = class {
        constructor(service, serviceName, errors) {
          this.service = service;
          this.serviceName = serviceName;
          this.errors = errors;
        }
        create(code, ...data) {
          const customData = data[0] || {};
          const fullCode = `${this.service}/${code}`;
          const template = this.errors[code];
          const message = template ? replaceTemplate2(template, customData) : "Error";
          const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
          const error = new FirebaseError2(fullCode, fullMessage, customData);
          return error;
        }
      };
      PATTERN2 = /\{\$([^}]+)}/g;
      ObserverProxy = class {
        constructor(executor, onNoObservers) {
          this.observers = [];
          this.unsubscribes = [];
          this.observerCount = 0;
          this.task = Promise.resolve();
          this.finalized = false;
          this.onNoObservers = onNoObservers;
          this.task.then(() => {
            executor(this);
          }).catch((e) => {
            this.error(e);
          });
        }
        next(value) {
          this.forEachObserver((observer) => {
            observer.next(value);
          });
        }
        error(error) {
          this.forEachObserver((observer) => {
            observer.error(error);
          });
          this.close(error);
        }
        complete() {
          this.forEachObserver((observer) => {
            observer.complete();
          });
          this.close();
        }
        subscribe(nextOrObserver, error, complete) {
          let observer;
          if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
            throw new Error("Missing Observer.");
          }
          if (implementsAnyMethods(nextOrObserver, [
            "next",
            "error",
            "complete"
          ])) {
            observer = nextOrObserver;
          } else {
            observer = {
              next: nextOrObserver,
              error,
              complete
            };
          }
          if (observer.next === void 0) {
            observer.next = noop;
          }
          if (observer.error === void 0) {
            observer.error = noop;
          }
          if (observer.complete === void 0) {
            observer.complete = noop;
          }
          const unsub = this.unsubscribeOne.bind(this, this.observers.length);
          if (this.finalized) {
            this.task.then(() => {
              try {
                if (this.finalError) {
                  observer.error(this.finalError);
                } else {
                  observer.complete();
                }
              } catch (e) {
              }
              return;
            });
          }
          this.observers.push(observer);
          return unsub;
        }
        unsubscribeOne(i) {
          if (this.observers === void 0 || this.observers[i] === void 0) {
            return;
          }
          delete this.observers[i];
          this.observerCount -= 1;
          if (this.observerCount === 0 && this.onNoObservers !== void 0) {
            this.onNoObservers(this);
          }
        }
        forEachObserver(fn) {
          if (this.finalized) {
            return;
          }
          for (let i = 0; i < this.observers.length; i++) {
            this.sendOne(i, fn);
          }
        }
        sendOne(i, fn) {
          this.task.then(() => {
            if (this.observers !== void 0 && this.observers[i] !== void 0) {
              try {
                fn(this.observers[i]);
              } catch (e) {
                if (typeof console !== "undefined" && console.error) {
                  console.error(e);
                }
              }
            }
          });
        }
        close(err) {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          if (err !== void 0) {
            this.finalError = err;
          }
          this.task.then(() => {
            this.observers = void 0;
            this.onNoObservers = void 0;
          });
        }
      };
      MAX_VALUE_MILLIS2 = 4 * 60 * 60 * 1e3;
    }
  });

  // node_modules/tslib/tslib.js
  var require_tslib = __commonJS({
    "node_modules/tslib/tslib.js"(exports, module) {
      var __extends2;
      var __assign2;
      var __rest2;
      var __decorate2;
      var __param2;
      var __metadata2;
      var __awaiter2;
      var __generator2;
      var __exportStar2;
      var __values2;
      var __read2;
      var __spread2;
      var __spreadArrays2;
      var __spreadArray2;
      var __await2;
      var __asyncGenerator2;
      var __asyncDelegator2;
      var __asyncValues2;
      var __makeTemplateObject2;
      var __importStar2;
      var __importDefault2;
      var __classPrivateFieldGet2;
      var __classPrivateFieldSet2;
      var __createBinding2;
      (function(factory) {
        var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) {
          define("tslib", ["exports"], function(exports2) {
            factory(createExporter(root, createExporter(exports2)));
          });
        } else if (typeof module === "object" && typeof module.exports === "object") {
          factory(createExporter(root, createExporter(module.exports)));
        } else {
          factory(createExporter(root));
        }
        function createExporter(exports2, previous) {
          if (exports2 !== root) {
            if (typeof Object.create === "function") {
              Object.defineProperty(exports2, "__esModule", { value: true });
            } else {
              exports2.__esModule = true;
            }
          }
          return function(id, v) {
            return exports2[id] = previous ? previous(id, v) : v;
          };
        }
      })(function(exporter) {
        var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p))
              d[p] = b[p];
        };
        __extends2 = function(d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        __assign2 = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
          }
          return t;
        };
        __rest2 = function(s, e) {
          var t = {};
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
              t[p] = s[p];
          if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
            }
          return t;
        };
        __decorate2 = function(decorators, target, key, desc) {
          var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        __param2 = function(paramIndex, decorator) {
          return function(target, key) {
            decorator(target, key, paramIndex);
          };
        };
        __metadata2 = function(metadataKey, metadataValue) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
        };
        __awaiter2 = function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve) {
              resolve(value);
            });
          }
          return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        __generator2 = function(thisArg, body) {
          var _ = { label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: [] }, f, y, t, g;
          return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return { value: op[1], done: false };
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
          }
        };
        __exportStar2 = function(m, o) {
          for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
              __createBinding2(o, m, p);
        };
        __createBinding2 = Object.create ? function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          Object.defineProperty(o, k2, { enumerable: true, get: function() {
            return m[k];
          } });
        } : function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          o[k2] = m[k];
        };
        __values2 = function(o) {
          var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
          if (m)
            return m.call(o);
          if (o && typeof o.length === "number")
            return {
              next: function() {
                if (o && i >= o.length)
                  o = void 0;
                return { value: o && o[i++], done: !o };
              }
            };
          throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        __read2 = function(o, n) {
          var m = typeof Symbol === "function" && o[Symbol.iterator];
          if (!m)
            return o;
          var i = m.call(o), r, ar = [], e;
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value);
          } catch (error) {
            e = { error };
          } finally {
            try {
              if (r && !r.done && (m = i["return"]))
                m.call(i);
            } finally {
              if (e)
                throw e.error;
            }
          }
          return ar;
        };
        __spread2 = function() {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read2(arguments[i]));
          return ar;
        };
        __spreadArrays2 = function() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        };
        __spreadArray2 = function(to, from, pack) {
          if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
              if (ar || !(i in from)) {
                if (!ar)
                  ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
              }
            }
          return to.concat(ar || Array.prototype.slice.call(from));
        };
        __await2 = function(v) {
          return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
        };
        __asyncGenerator2 = function(thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var g = generator.apply(thisArg, _arguments || []), i, q = [];
          return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
            return this;
          }, i;
          function verb(n) {
            if (g[n])
              i[n] = function(v) {
                return new Promise(function(a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v);
                });
              };
          }
          function resume(n, v) {
            try {
              step(g[n](v));
            } catch (e) {
              settle(q[0][3], e);
            }
          }
          function step(r) {
            r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f, v) {
            if (f(v), q.shift(), q.length)
              resume(q[0][0], q[0][1]);
          }
        };
        __asyncDelegator2 = function(o) {
          var i, p;
          return i = {}, verb("next"), verb("throw", function(e) {
            throw e;
          }), verb("return"), i[Symbol.iterator] = function() {
            return this;
          }, i;
          function verb(n, f) {
            i[n] = o[n] ? function(v) {
              return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f ? f(v) : v;
            } : f;
          }
        };
        __asyncValues2 = function(o) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var m = o[Symbol.asyncIterator], i;
          return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
            return this;
          }, i);
          function verb(n) {
            i[n] = o[n] && function(v) {
              return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
              });
            };
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function(v2) {
              resolve({ value: v2, done: d });
            }, reject);
          }
        };
        __makeTemplateObject2 = function(cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
          } else {
            cooked.raw = raw;
          }
          return cooked;
        };
        var __setModuleDefault = Object.create ? function(o, v) {
          Object.defineProperty(o, "default", { enumerable: true, value: v });
        } : function(o, v) {
          o["default"] = v;
        };
        __importStar2 = function(mod) {
          if (mod && mod.__esModule)
            return mod;
          var result = {};
          if (mod != null) {
            for (var k in mod)
              if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding2(result, mod, k);
          }
          __setModuleDefault(result, mod);
          return result;
        };
        __importDefault2 = function(mod) {
          return mod && mod.__esModule ? mod : { "default": mod };
        };
        __classPrivateFieldGet2 = function(receiver, state, kind, f) {
          if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
          return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
        };
        __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
          if (kind === "m")
            throw new TypeError("Private method is not writable");
          if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
          return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
        };
        exporter("__extends", __extends2);
        exporter("__assign", __assign2);
        exporter("__rest", __rest2);
        exporter("__decorate", __decorate2);
        exporter("__param", __param2);
        exporter("__metadata", __metadata2);
        exporter("__awaiter", __awaiter2);
        exporter("__generator", __generator2);
        exporter("__exportStar", __exportStar2);
        exporter("__createBinding", __createBinding2);
        exporter("__values", __values2);
        exporter("__read", __read2);
        exporter("__spread", __spread2);
        exporter("__spreadArrays", __spreadArrays2);
        exporter("__spreadArray", __spreadArray2);
        exporter("__await", __await2);
        exporter("__asyncGenerator", __asyncGenerator2);
        exporter("__asyncDelegator", __asyncDelegator2);
        exporter("__asyncValues", __asyncValues2);
        exporter("__makeTemplateObject", __makeTemplateObject2);
        exporter("__importStar", __importStar2);
        exporter("__importDefault", __importDefault2);
        exporter("__classPrivateFieldGet", __classPrivateFieldGet2);
        exporter("__classPrivateFieldSet", __classPrivateFieldSet2);
      });
    }
  });

  // node_modules/tslib/modules/index.js
  var import_tslib, __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __createBinding, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet;
  var init_modules = __esm({
    "node_modules/tslib/modules/index.js"() {
      import_tslib = __toModule(require_tslib());
      ({
        __extends,
        __assign,
        __rest,
        __decorate,
        __param,
        __metadata,
        __awaiter,
        __generator,
        __exportStar,
        __createBinding,
        __values,
        __read,
        __spread,
        __spreadArrays,
        __spreadArray,
        __await,
        __asyncGenerator,
        __asyncDelegator,
        __asyncValues,
        __makeTemplateObject,
        __importStar,
        __importDefault,
        __classPrivateFieldGet,
        __classPrivateFieldSet
      } = import_tslib.default);
    }
  });

  // node_modules/@firebase/auth/node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component2;
  var init_index_esm20176 = __esm({
    "node_modules/@firebase/auth/node_modules/@firebase/component/dist/esm/index.esm2017.js"() {
      init_index_esm20175();
      Component2 = class {
        constructor(name4, instanceFactory, type) {
          this.name = name4;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          this.serviceProps = {};
          this.instantiationMode = "LAZY";
          this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }
        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }
        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }
        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }
      };
    }
  });

  // node_modules/@firebase/auth/dist/esm2017/index-139b42ee.js
  function _debugErrorMap() {
    return {
      ["admin-restricted-operation"]: "This operation is restricted to administrators only.",
      ["argument-error"]: "",
      ["app-not-authorized"]: "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.",
      ["app-not-installed"]: "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
      ["captcha-check-failed"]: "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
      ["code-expired"]: "The SMS code has expired. Please re-send the verification code to try again.",
      ["cordova-not-ready"]: "Cordova framework is not ready.",
      ["cors-unsupported"]: "This browser is not supported.",
      ["credential-already-in-use"]: "This credential is already associated with a different user account.",
      ["custom-token-mismatch"]: "The custom token corresponds to a different audience.",
      ["requires-recent-login"]: "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
      ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
      ["dynamic-link-not-activated"]: "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
      ["email-change-needs-verification"]: "Multi-factor users must always have a verified email.",
      ["email-already-in-use"]: "The email address is already in use by another account.",
      ["emulator-config-failed"]: 'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',
      ["expired-action-code"]: "The action code has expired.",
      ["cancelled-popup-request"]: "This operation has been cancelled due to another conflicting popup being opened.",
      ["internal-error"]: "An internal AuthError has occurred.",
      ["invalid-app-credential"]: "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
      ["invalid-app-id"]: "The mobile app identifier is not registed for the current project.",
      ["invalid-user-token"]: "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
      ["invalid-auth-event"]: "An internal AuthError has occurred.",
      ["invalid-verification-code"]: "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.",
      ["invalid-continue-uri"]: "The continue URL provided in the request is invalid.",
      ["invalid-cordova-configuration"]: "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
      ["invalid-custom-token"]: "The custom token format is incorrect. Please check the documentation.",
      ["invalid-dynamic-link-domain"]: "The provided dynamic link domain is not configured or authorized for the current project.",
      ["invalid-email"]: "The email address is badly formatted.",
      ["invalid-emulator-scheme"]: "Emulator URL must start with a valid scheme (http:// or https://).",
      ["invalid-api-key"]: "Your API key is invalid, please check you have copied it correctly.",
      ["invalid-cert-hash"]: "The SHA-1 certificate hash provided is invalid.",
      ["invalid-credential"]: "The supplied auth credential is malformed or has expired.",
      ["invalid-message-payload"]: "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
      ["invalid-multi-factor-session"]: "The request does not contain a valid proof of first factor successful sign-in.",
      ["invalid-oauth-provider"]: "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
      ["invalid-oauth-client-id"]: "The OAuth client ID provided is either invalid or does not match the specified API key.",
      ["unauthorized-domain"]: "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
      ["invalid-action-code"]: "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
      ["wrong-password"]: "The password is invalid or the user does not have a password.",
      ["invalid-persistence-type"]: "The specified persistence type is invalid. It can only be local, session or none.",
      ["invalid-phone-number"]: "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
      ["invalid-provider-id"]: "The specified provider ID is invalid.",
      ["invalid-recipient-email"]: "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
      ["invalid-sender"]: "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
      ["invalid-verification-id"]: "The verification ID used to create the phone auth credential is invalid.",
      ["invalid-tenant-id"]: "The Auth instance's tenant ID is invalid.",
      ["missing-android-pkg-name"]: "An Android Package Name must be provided if the Android App is required to be installed.",
      ["auth-domain-config-required"]: "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
      ["missing-app-credential"]: "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
      ["missing-verification-code"]: "The phone auth credential was created with an empty SMS verification code.",
      ["missing-continue-uri"]: "A continue URL must be provided in the request.",
      ["missing-iframe-start"]: "An internal AuthError has occurred.",
      ["missing-ios-bundle-id"]: "An iOS Bundle ID must be provided if an App Store ID is provided.",
      ["missing-or-invalid-nonce"]: "The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
      ["missing-multi-factor-info"]: "No second factor identifier is provided.",
      ["missing-multi-factor-session"]: "The request is missing proof of first factor successful sign-in.",
      ["missing-phone-number"]: "To send verification codes, provide a phone number for the recipient.",
      ["missing-verification-id"]: "The phone auth credential was created with an empty verification ID.",
      ["app-deleted"]: "This instance of FirebaseApp has been deleted.",
      ["multi-factor-info-not-found"]: "The user does not have a second factor matching the identifier provided.",
      ["multi-factor-auth-required"]: "Proof of ownership of a second factor is required to complete sign-in.",
      ["account-exists-with-different-credential"]: "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
      ["network-request-failed"]: "A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.",
      ["no-auth-event"]: "An internal AuthError has occurred.",
      ["no-such-provider"]: "User was not linked to an account with the given provider.",
      ["null-user"]: "A null user object was provided as the argument for an operation which requires a non-null user object.",
      ["operation-not-allowed"]: "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
      ["operation-not-supported-in-this-environment"]: 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
      ["popup-blocked"]: "Unable to establish a connection with the popup. It may have been blocked by the browser.",
      ["popup-closed-by-user"]: "The popup has been closed by the user before finalizing the operation.",
      ["provider-already-linked"]: "User can only be linked to one identity for the given provider.",
      ["quota-exceeded"]: "The project's quota for this operation has been exceeded.",
      ["redirect-cancelled-by-user"]: "The redirect operation has been cancelled by the user before finalizing.",
      ["redirect-operation-pending"]: "A redirect sign-in operation is already pending.",
      ["rejected-credential"]: "The request contains malformed or mismatching credentials.",
      ["second-factor-already-in-use"]: "The second factor is already enrolled on this account.",
      ["maximum-second-factor-count-exceeded"]: "The maximum allowed number of second factors on a user has been exceeded.",
      ["tenant-id-mismatch"]: "The provided tenant ID does not match the Auth instance's tenant ID",
      ["timeout"]: "The operation has timed out.",
      ["user-token-expired"]: "The user's credential is no longer valid. The user must sign in again.",
      ["too-many-requests"]: "We have blocked all requests from this device due to unusual activity. Try again later.",
      ["unauthorized-continue-uri"]: "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
      ["unsupported-first-factor"]: "Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.",
      ["unsupported-persistence-type"]: "The current environment does not support the specified persistence type.",
      ["unsupported-tenant-operation"]: "This operation is not supported in a multi-tenant context.",
      ["unverified-email"]: "The operation requires a verified email.",
      ["user-cancelled"]: "The user did not grant your application the permissions it requested.",
      ["user-not-found"]: "There is no user record corresponding to this identifier. The user may have been deleted.",
      ["user-disabled"]: "The user account has been disabled by an administrator.",
      ["user-mismatch"]: "The supplied credentials do not correspond to the previously signed in user.",
      ["user-signed-out"]: "",
      ["weak-password"]: "The password must be 6 characters long or more.",
      ["web-storage-unsupported"]: "This browser is not supported or 3rd party cookies and data may be disabled.",
      ["already-initialized"]: "initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.",
      ["invalid-recaptcha-score"]: "The recaptcha score sent to backend is invalid.",
      ["missing-recaptcha-token"]: "The recaptcha token is missing when sending request to the backend.",
      ["invalid-recaptcha-token"]: "The recaptcha token is invalid when sending request to the backend.",
      ["invalide-recaptcha-action"]: "The recaptcha action is invalid when sending request to the backend.",
      ["invalid-recaptcha-enforcement-state"]: "The recaptcha enforcement state is invalid.",
      ["recaptcha-not-enabled"]: "The recaptcha integration is not enabled for this project.",
      ["missing-client-type"]: "The recaptcha client type is missing when sending request to the backend.",
      ["missing-recaptcha-version"]: "The recaptcha version is missing when sending request to the backend.",
      ["invalid-req-type"]: "The recaptcha client type / version is invalid when retrieving the site key.",
      ["invalid-recaptcha-version"]: "The recaptcha version is invalid when sending request to the backend."
    };
  }
  function _prodErrorMap() {
    return {
      ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
  }
  function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
      logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
  }
  function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
  }
  function _errorWithCustomMessage(auth, code, message) {
    const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
    const factory = new ErrorFactory2("auth", "Firebase", errorMap);
    return factory.create(code, {
      appName: auth.name
    });
  }
  function _assertInstanceOf(auth, object, instance) {
    const constructorInstance = instance;
    if (!(object instanceof constructorInstance)) {
      if (constructorInstance.name !== object.constructor.name) {
        _fail(auth, "argument-error");
      }
      throw _errorWithCustomMessage(auth, "argument-error", `Type of ${object.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`);
    }
  }
  function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
      const code = rest[0];
      const fullParams = [...rest.slice(1)];
      if (fullParams[0]) {
        fullParams[0].appName = authOrCode.name;
      }
      return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
  }
  function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
      throw createErrorInternal(authOrCode, ...rest);
    }
  }
  function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
  }
  function debugAssert(assertion, message) {
    if (!assertion) {
      debugFail(message);
    }
  }
  function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
      debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
      return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
  }
  function initializeAuth(app, deps) {
    const provider = _getProvider(app, "auth");
    if (provider.isInitialized()) {
      const auth2 = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (deepEqual2(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
        return auth2;
      } else {
        _fail(auth2, "already-initialized");
      }
    }
    const auth = provider.initialize({ options: deps });
    return auth;
  }
  function _initializeAuthInstance(auth, deps) {
    const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
      auth._updateErrorMap(deps.errorMap);
    }
    auth._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
  }
  function _getCurrentUrl() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
  }
  function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
  }
  function _getCurrentScheme() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
  }
  function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
      return navigator.onLine;
    }
    return true;
  }
  function _getUserLanguage() {
    if (typeof navigator === "undefined") {
      return null;
    }
    const navigatorLanguage = navigator;
    return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
  }
  function _emulatorUrl(config, path) {
    debugAssert(config.emulator, "Emulator should always be set here");
    const { url } = config.emulator;
    if (!path) {
      return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
  }
  function _addTidIfNecessary(auth, request) {
    if (auth.tenantId && !request.tenantId) {
      return Object.assign(Object.assign({}, request), { tenantId: auth.tenantId });
    }
    return request;
  }
  async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth, customErrorMap, async () => {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query = querystring(Object.assign({ key: auth.config.apiKey }, params)).slice(1);
      const headers = await auth._getAdditionalHeaders();
      headers["Content-Type"] = "application/json";
      if (auth.languageCode) {
        headers["X-Firebase-Locale"] = auth.languageCode;
      }
      return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), Object.assign({
        method,
        headers,
        referrerPolicy: "no-referrer"
      }, body));
    });
  }
  async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
    auth._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
      const networkTimeout = new NetworkTimeout(auth);
      const response = await Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = await response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth, "email-already-in-use", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
        } else {
          _fail(auth, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError2) {
        throw e;
      }
      _fail(auth, "network-request-failed");
    }
  }
  async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  }
  function _getFinalTarget(auth, host, path, query) {
    const base = `${host}${path}?${query}`;
    if (!auth.config.emulator) {
      return `${auth.config.apiScheme}://${base}`;
    }
    return _emulatorUrl(auth.config, base);
  }
  function _makeTaggedError(auth, code, response) {
    const errorParams = {
      appName: auth.name
    };
    if (response.email) {
      errorParams.email = response.email;
    }
    if (response.phoneNumber) {
      errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth, code, errorParams);
    error.customData._tokenResponse = response;
    return error;
  }
  async function deleteAccount(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
  }
  async function deleteLinkedAccounts(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  }
  async function getAccountInfo(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
  }
  function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
      return void 0;
    }
    try {
      const date = new Date(Number(utcTimestamp));
      if (!isNaN(date.getTime())) {
        return date.toUTCString();
      }
    } catch (e) {
    }
    return void 0;
  }
  function getIdToken(user, forceRefresh = false) {
    return getModularInstance(user).getIdToken(forceRefresh);
  }
  async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_second_factor"]) || null
    };
  }
  function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1e3;
  }
  function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
      _logError("JWT malformed, contained fewer than 3 sections");
      return null;
    }
    try {
      const decoded = base64Decode(payload);
      if (!decoded) {
        _logError("Failed to decode base64 JWT payload");
        return null;
      }
      return JSON.parse(decoded);
    } catch (e) {
      _logError("Caught error parsing JWT payload as JSON", e);
      return null;
    }
  }
  function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(parsedToken, "internal-error");
    _assert(typeof parsedToken.exp !== "undefined", "internal-error");
    _assert(typeof parsedToken.iat !== "undefined", "internal-error");
    return Number(parsedToken.exp) - Number(parsedToken.iat);
  }
  async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return await promise;
    } catch (e) {
      if (e instanceof FirebaseError2 && isUserInvalidated(e)) {
        if (user.auth.currentUser === user) {
          await user.auth.signOut();
        }
      }
      throw e;
    }
  }
  function isUserInvalidated({ code }) {
    return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
  }
  async function _reloadWithoutSaving(user) {
    var _a;
    const auth = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth, { idToken }));
    _assert(response === null || response === void 0 ? void 0 : response.users.length, auth, "internal-error");
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  }
  async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  }
  function mergeProviderData(original, newData) {
    const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
    return [...deduped, ...newData];
  }
  function extractProviderData(providers) {
    return providers.map((_a) => {
      var { providerId } = _a, provider = __rest(_a, ["providerId"]);
      return {
        providerId,
        uid: provider.rawId || "",
        displayName: provider.displayName || null,
        email: provider.email || null,
        phoneNumber: provider.phoneNumber || null,
        photoURL: provider.photoUrl || null
      };
    });
  }
  async function requestStsToken(auth, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth, {}, async () => {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth.config;
      const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = await auth._getAdditionalHeaders();
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      return FetchProvider.fetch()(url, {
        method: "POST",
        headers,
        body
      });
    });
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  }
  function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
  }
  function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase"}:${key}:${apiKey}:${appName}`;
  }
  function _getBrowserName(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
      return "Opera";
    } else if (_isIEMobile(ua)) {
      return "IEMobile";
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      return "IE";
    } else if (ua.includes("edge/")) {
      return "Edge";
    } else if (_isFirefox(ua)) {
      return "Firefox";
    } else if (ua.includes("silk/")) {
      return "Silk";
    } else if (_isBlackBerry(ua)) {
      return "Blackberry";
    } else if (_isWebOS(ua)) {
      return "Webos";
    } else if (_isSafari(ua)) {
      return "Safari";
    } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
      return "Chrome";
    } else if (_isAndroid(ua)) {
      return "Android";
    } else {
      const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
      const matches = userAgent.match(re);
      if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
        return matches[1];
      }
    }
    return "Other";
  }
  function _isFirefox(ua = getUA()) {
    return /firefox\//i.test(ua);
  }
  function _isSafari(userAgent = getUA()) {
    const ua = userAgent.toLowerCase();
    return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
  }
  function _isChromeIOS(ua = getUA()) {
    return /crios\//i.test(ua);
  }
  function _isIEMobile(ua = getUA()) {
    return /iemobile/i.test(ua);
  }
  function _isAndroid(ua = getUA()) {
    return /android/i.test(ua);
  }
  function _isBlackBerry(ua = getUA()) {
    return /blackberry/i.test(ua);
  }
  function _isWebOS(ua = getUA()) {
    return /webos/i.test(ua);
  }
  function _isIOS(ua = getUA()) {
    return /iphone|ipad|ipod/i.test(ua);
  }
  function _isIOSStandalone(ua = getUA()) {
    var _a;
    return _isIOS(ua) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
  }
  function _isIE10() {
    return isIE() && document.documentMode === 10;
  }
  function _isMobileBrowser(ua = getUA()) {
    return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
  }
  function _isIframe() {
    try {
      return !!(window && window !== window.top);
    } catch (e) {
      return false;
    }
  }
  function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
      case "Browser":
        reportedPlatform = _getBrowserName(getUA());
        break;
      case "Worker":
        reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
        break;
      default:
        reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
  }
  function _castAuth(auth) {
    return getModularInstance(auth);
  }
  function connectAuthEmulator(auth, url, options) {
    const authInternal = _castAuth(auth);
    _assert(authInternal._canInitEmulator, authInternal, "emulator-config-failed");
    _assert(/^https?:\/\//.test(url), authInternal, "invalid-emulator-scheme");
    const disableWarnings = !!(options === null || options === void 0 ? void 0 : options.disableWarnings);
    const protocol = extractProtocol(url);
    const { host, port } = extractHostAndPort(url);
    const portStr = port === null ? "" : `:${port}`;
    authInternal.config.emulator = { url: `${protocol}//${host}${portStr}/` };
    authInternal.settings.appVerificationDisabledForTesting = true;
    authInternal.emulatorConfig = Object.freeze({
      host,
      port,
      protocol: protocol.replace(":", ""),
      options: Object.freeze({ disableWarnings })
    });
    if (!disableWarnings) {
      emitEmulatorWarning();
    }
  }
  function extractProtocol(url) {
    const protocolEnd = url.indexOf(":");
    return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
  }
  function extractHostAndPort(url) {
    const protocol = extractProtocol(url);
    const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
    if (!authority) {
      return { host: "", port: null };
    }
    const hostAndPort = authority[2].split("@").pop() || "";
    const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
      const host = bracketedIPv6[1];
      return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    } else {
      const [host, port] = hostAndPort.split(":");
      return { host, port: parsePort(port) };
    }
  }
  function parsePort(portStr) {
    if (!portStr) {
      return null;
    }
    const port = Number(portStr);
    if (isNaN(port)) {
      return null;
    }
    return port;
  }
  function emitEmulatorWarning() {
    function attachBanner() {
      const el = document.createElement("p");
      const sty = el.style;
      el.innerText = "Running in emulator mode. Do not use with production credentials.";
      sty.position = "fixed";
      sty.width = "100%";
      sty.backgroundColor = "#ffffff";
      sty.border = ".1em solid #000000";
      sty.color = "#b50000";
      sty.bottom = "0px";
      sty.left = "0px";
      sty.margin = "0px";
      sty.zIndex = "10000";
      sty.textAlign = "center";
      el.classList.add("firebase-emulator-warning");
      document.body.appendChild(el);
    }
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", attachBanner);
      } else {
        attachBanner();
      }
    }
  }
  async function resetPassword(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:resetPassword", _addTidIfNecessary(auth, request));
  }
  async function updateEmailPassword(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  }
  async function applyActionCode$1(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", _addTidIfNecessary(auth, request));
  }
  async function signInWithPassword(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
  }
  async function sendOobCode(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:sendOobCode", _addTidIfNecessary(auth, request));
  }
  async function sendEmailVerification$1(auth, request) {
    return sendOobCode(auth, request);
  }
  async function sendPasswordResetEmail$1(auth, request) {
    return sendOobCode(auth, request);
  }
  async function sendSignInLinkToEmail$1(auth, request) {
    return sendOobCode(auth, request);
  }
  async function verifyAndChangeEmail(auth, request) {
    return sendOobCode(auth, request);
  }
  async function signInWithEmailLink$1(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  }
  async function signInWithEmailLinkForLinking(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  }
  function isV2(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.getResponse !== void 0;
  }
  function isEnterprise(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
  }
  async function getRecaptchaParams(auth) {
    return (await _performApiRequest(auth, "GET", "/v1/recaptchaParams")).recaptchaSiteKey || "";
  }
  async function getRecaptchaConfig(auth, request) {
    return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
  }
  function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName("head")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
  }
  function _loadJS(url) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.setAttribute("src", url);
      el.onload = resolve;
      el.onerror = (e) => {
        const error = _createError("internal-error");
        error.customData = e;
        reject(error);
      };
      el.type = "text/javascript";
      el.charset = "UTF-8";
      getScriptParentElement().appendChild(el);
    });
  }
  function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
  }
  async function injectRecaptchaFields(auth, request, action, captchaResp = false) {
    const verifier = new RecaptchaEnterpriseVerifier(auth);
    let captchaResponse;
    try {
      captchaResponse = await verifier.verify(action);
    } catch (error) {
      captchaResponse = await verifier.verify(action, true);
    }
    const newRequest = Object.assign({}, request);
    if (!captchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, { "clientType": "CLIENT_TYPE_WEB" });
    Object.assign(newRequest, { "recaptchaVersion": "RECAPTCHA_ENTERPRISE" });
    return newRequest;
  }
  async function signInWithIdp(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
  }
  async function sendPhoneVerificationCode(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth, request));
  }
  async function signInWithPhoneNumber$1(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
  }
  async function linkWithPhoneNumber$1(auth, request) {
    const response = await _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
    if (response.temporaryProof) {
      throw _makeTaggedError(auth, "account-exists-with-different-credential", response);
    }
    return response;
  }
  async function verifyPhoneNumberForExisting(auth, request) {
    const apiRequest = Object.assign(Object.assign({}, request), { operation: "REAUTH" });
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
  }
  function parseMode(mode) {
    switch (mode) {
      case "recoverEmail":
        return "RECOVER_EMAIL";
      case "resetPassword":
        return "PASSWORD_RESET";
      case "signIn":
        return "EMAIL_SIGNIN";
      case "verifyEmail":
        return "VERIFY_EMAIL";
      case "verifyAndChangeEmail":
        return "VERIFY_AND_CHANGE_EMAIL";
      case "revertSecondFactorAddition":
        return "REVERT_SECOND_FACTOR_ADDITION";
      default:
        return null;
    }
  }
  function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
  }
  function parseActionCodeURL(link) {
    return ActionCodeURL.parseLink(link);
  }
  async function signUp(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth, request));
  }
  function providerIdForResponse(response) {
    if (response.providerId) {
      return response.providerId;
    }
    if ("phoneNumber" in response) {
      return "phone";
    }
    return null;
  }
  async function signInAnonymously(auth) {
    var _a;
    const authInternal = _castAuth(auth);
    await authInternal._initializationPromise;
    if ((_a = authInternal.currentUser) === null || _a === void 0 ? void 0 : _a.isAnonymous) {
      return new UserCredentialImpl({
        user: authInternal.currentUser,
        providerId: null,
        operationType: "signIn"
      });
    }
    const response = await signUp(authInternal, {
      returnSecureToken: true
    });
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response, true);
    await authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  }
  function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
    return idTokenProvider.catch((error) => {
      if (error.code === `auth/${"multi-factor-auth-required"}`) {
        throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
      }
      throw error;
    });
  }
  function providerDataAsNames(providerData) {
    return new Set(providerData.map(({ providerId }) => providerId).filter((pid) => !!pid));
  }
  async function unlink(user, providerId) {
    const userInternal = getModularInstance(user);
    await _assertLinkedStatus(true, userInternal, providerId);
    const { providerUserInfo } = await deleteLinkedAccounts(userInternal.auth, {
      idToken: await userInternal.getIdToken(),
      deleteProvider: [providerId]
    });
    const providersLeft = providerDataAsNames(providerUserInfo || []);
    userInternal.providerData = userInternal.providerData.filter((pd) => providersLeft.has(pd.providerId));
    if (!providersLeft.has("phone")) {
      userInternal.phoneNumber = null;
    }
    await userInternal.auth._persistUserIfCurrent(userInternal);
    return userInternal;
  }
  async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
  }
  async function _assertLinkedStatus(expected, user, provider) {
    await _reloadWithoutSaving(user);
    const providerIds = providerDataAsNames(user.providerData);
    const code = expected === false ? "provider-already-linked" : "no-such-provider";
    _assert(providerIds.has(provider) === expected, user.auth, code);
  }
  async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth } = user;
    const operationType = "reauthenticate";
    try {
      const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
      _assert(response.idToken, auth, "internal-error");
      const parsed = _parseToken(response.idToken);
      _assert(parsed, auth, "internal-error");
      const { sub: localId } = parsed;
      _assert(user.uid === localId, auth, "user-mismatch");
      return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e) {
      if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
        _fail(auth, "user-mismatch");
      }
      throw e;
    }
  }
  async function _signInWithCredential(auth, credential, bypassAuthState = false) {
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
    if (!bypassAuthState) {
      await auth._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  }
  async function signInWithCredential(auth, credential) {
    return _signInWithCredential(_castAuth(auth), credential);
  }
  async function linkWithCredential(user, credential) {
    const userInternal = getModularInstance(user);
    await _assertLinkedStatus(false, userInternal, credential.providerId);
    return _link$1(userInternal, credential);
  }
  async function reauthenticateWithCredential(user, credential) {
    return _reauthenticate(getModularInstance(user), credential);
  }
  async function signInWithCustomToken$1(auth, request) {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithCustomToken", _addTidIfNecessary(auth, request));
  }
  async function signInWithCustomToken(auth, customToken) {
    const authInternal = _castAuth(auth);
    const response = await signInWithCustomToken$1(authInternal, {
      token: customToken,
      returnSecureToken: true
    });
    const cred = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    await authInternal._updateCurrentUser(cred.user);
    return cred;
  }
  function _setActionCodeSettingsOnRequest(auth, request, actionCodeSettings) {
    var _a;
    _assert(((_a = actionCodeSettings.url) === null || _a === void 0 ? void 0 : _a.length) > 0, auth, "invalid-continue-uri");
    _assert(typeof actionCodeSettings.dynamicLinkDomain === "undefined" || actionCodeSettings.dynamicLinkDomain.length > 0, auth, "invalid-dynamic-link-domain");
    request.continueUrl = actionCodeSettings.url;
    request.dynamicLinkDomain = actionCodeSettings.dynamicLinkDomain;
    request.canHandleCodeInApp = actionCodeSettings.handleCodeInApp;
    if (actionCodeSettings.iOS) {
      _assert(actionCodeSettings.iOS.bundleId.length > 0, auth, "missing-ios-bundle-id");
      request.iOSBundleId = actionCodeSettings.iOS.bundleId;
    }
    if (actionCodeSettings.android) {
      _assert(actionCodeSettings.android.packageName.length > 0, auth, "missing-android-pkg-name");
      request.androidInstallApp = actionCodeSettings.android.installApp;
      request.androidMinimumVersionCode = actionCodeSettings.android.minimumVersion;
      request.androidPackageName = actionCodeSettings.android.packageName;
    }
  }
  async function sendPasswordResetEmail(auth, email, actionCodeSettings) {
    var _a;
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "PASSWORD_RESET",
      email
    };
    if ((_a = authInternal._recaptchaConfig) === null || _a === void 0 ? void 0 : _a.emailPasswordEnabled) {
      const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "getOobCode", true);
      if (actionCodeSettings) {
        _setActionCodeSettingsOnRequest(authInternal, requestWithRecaptcha, actionCodeSettings);
      }
      await sendPasswordResetEmail$1(authInternal, requestWithRecaptcha);
    } else {
      if (actionCodeSettings) {
        _setActionCodeSettingsOnRequest(authInternal, request, actionCodeSettings);
      }
      await sendPasswordResetEmail$1(authInternal, request).catch(async (error) => {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log("Pssword reset is protected by reCAPTCHA for this project. Automatically triggers reCAPTCHA flow and restarts the password reset flow.");
          const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "getOobCode", true);
          if (actionCodeSettings) {
            _setActionCodeSettingsOnRequest(authInternal, requestWithRecaptcha, actionCodeSettings);
          }
          await sendPasswordResetEmail$1(authInternal, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      });
    }
  }
  async function confirmPasswordReset(auth, oobCode, newPassword) {
    await resetPassword(getModularInstance(auth), {
      oobCode,
      newPassword
    });
  }
  async function applyActionCode(auth, oobCode) {
    await applyActionCode$1(getModularInstance(auth), { oobCode });
  }
  async function checkActionCode(auth, oobCode) {
    const authModular = getModularInstance(auth);
    const response = await resetPassword(authModular, { oobCode });
    const operation = response.requestType;
    _assert(operation, authModular, "internal-error");
    switch (operation) {
      case "EMAIL_SIGNIN":
        break;
      case "VERIFY_AND_CHANGE_EMAIL":
        _assert(response.newEmail, authModular, "internal-error");
        break;
      case "REVERT_SECOND_FACTOR_ADDITION":
        _assert(response.mfaInfo, authModular, "internal-error");
      default:
        _assert(response.email, authModular, "internal-error");
    }
    let multiFactorInfo = null;
    if (response.mfaInfo) {
      multiFactorInfo = MultiFactorInfoImpl._fromServerResponse(_castAuth(authModular), response.mfaInfo);
    }
    return {
      data: {
        email: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.newEmail : response.email) || null,
        previousEmail: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.email : response.newEmail) || null,
        multiFactorInfo
      },
      operation
    };
  }
  async function verifyPasswordResetCode(auth, code) {
    const { data } = await checkActionCode(getModularInstance(auth), code);
    return data.email;
  }
  async function createUserWithEmailAndPassword(auth, email, password) {
    var _a;
    const authInternal = _castAuth(auth);
    const request = {
      returnSecureToken: true,
      email,
      password
    };
    let signUpResponse;
    if ((_a = authInternal._recaptchaConfig) === null || _a === void 0 ? void 0 : _a.emailPasswordEnabled) {
      const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "signUpPassword");
      signUpResponse = signUp(authInternal, requestWithRecaptcha);
    } else {
      signUpResponse = signUp(authInternal, request).catch(async (error) => {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log("Sign up is protected by reCAPTCHA for this project. Automatically triggers reCAPTCHA flow and restarts the sign up flow.");
          const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "signUpPassword");
          return signUp(authInternal, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      });
    }
    const response = await signUpResponse.catch((error) => {
      return Promise.reject(error);
    });
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    await authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  }
  function signInWithEmailAndPassword(auth, email, password) {
    return signInWithCredential(getModularInstance(auth), EmailAuthProvider.credential(email, password));
  }
  async function sendSignInLinkToEmail(auth, email, actionCodeSettings) {
    var _a;
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "EMAIL_SIGNIN",
      email
    };
    function setActionCodeSettings(request2, actionCodeSettings2) {
      _assert(actionCodeSettings2.handleCodeInApp, authInternal, "argument-error");
      if (actionCodeSettings2) {
        _setActionCodeSettingsOnRequest(authInternal, request2, actionCodeSettings2);
      }
    }
    if ((_a = authInternal._recaptchaConfig) === null || _a === void 0 ? void 0 : _a.emailPasswordEnabled) {
      const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "getOobCode", true);
      setActionCodeSettings(requestWithRecaptcha, actionCodeSettings);
      await sendSignInLinkToEmail$1(authInternal, requestWithRecaptcha);
    } else {
      setActionCodeSettings(request, actionCodeSettings);
      await sendSignInLinkToEmail$1(authInternal, request).catch(async (error) => {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log("Sign in with email link is protected by reCAPTCHA for this project. Automatically triggers reCAPTCHA flow and restarts the sign in flow.");
          const requestWithRecaptcha = await injectRecaptchaFields(authInternal, request, "getOobCode", true);
          setActionCodeSettings(requestWithRecaptcha, actionCodeSettings);
          await sendSignInLinkToEmail$1(authInternal, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      });
    }
  }
  function isSignInWithEmailLink(auth, emailLink) {
    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    return (actionCodeUrl === null || actionCodeUrl === void 0 ? void 0 : actionCodeUrl.operation) === "EMAIL_SIGNIN";
  }
  async function signInWithEmailLink(auth, email, emailLink) {
    const authModular = getModularInstance(auth);
    const credential = EmailAuthProvider.credentialWithLink(email, emailLink || _getCurrentUrl());
    _assert(credential._tenantId === (authModular.tenantId || null), authModular, "tenant-id-mismatch");
    return signInWithCredential(authModular, credential);
  }
  async function createAuthUri(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:createAuthUri", _addTidIfNecessary(auth, request));
  }
  async function fetchSignInMethodsForEmail(auth, email) {
    const continueUri = _isHttpOrHttps() ? _getCurrentUrl() : "http://localhost";
    const request = {
      identifier: email,
      continueUri
    };
    const { signinMethods } = await createAuthUri(getModularInstance(auth), request);
    return signinMethods || [];
  }
  async function sendEmailVerification(user, actionCodeSettings) {
    const userInternal = getModularInstance(user);
    const idToken = await user.getIdToken();
    const request = {
      requestType: "VERIFY_EMAIL",
      idToken
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const { email } = await sendEmailVerification$1(userInternal.auth, request);
    if (email !== user.email) {
      await user.reload();
    }
  }
  async function verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings) {
    const userInternal = getModularInstance(user);
    const idToken = await user.getIdToken();
    const request = {
      requestType: "VERIFY_AND_CHANGE_EMAIL",
      idToken,
      newEmail
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const { email } = await verifyAndChangeEmail(userInternal.auth, request);
    if (email !== user.email) {
      await user.reload();
    }
  }
  async function updateProfile$1(auth, request) {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  }
  async function updateProfile(user, { displayName, photoURL: photoUrl }) {
    if (displayName === void 0 && photoUrl === void 0) {
      return;
    }
    const userInternal = getModularInstance(user);
    const idToken = await userInternal.getIdToken();
    const profileRequest = {
      idToken,
      displayName,
      photoUrl,
      returnSecureToken: true
    };
    const response = await _logoutIfInvalidated(userInternal, updateProfile$1(userInternal.auth, profileRequest));
    userInternal.displayName = response.displayName || null;
    userInternal.photoURL = response.photoUrl || null;
    const passwordProvider = userInternal.providerData.find(({ providerId }) => providerId === "password");
    if (passwordProvider) {
      passwordProvider.displayName = userInternal.displayName;
      passwordProvider.photoURL = userInternal.photoURL;
    }
    await userInternal._updateTokensIfNecessary(response);
  }
  function updateEmail(user, newEmail) {
    return updateEmailOrPassword(getModularInstance(user), newEmail, null);
  }
  function updatePassword(user, newPassword) {
    return updateEmailOrPassword(getModularInstance(user), null, newPassword);
  }
  async function updateEmailOrPassword(user, email, password) {
    const { auth } = user;
    const idToken = await user.getIdToken();
    const request = {
      idToken,
      returnSecureToken: true
    };
    if (email) {
      request.email = email;
    }
    if (password) {
      request.password = password;
    }
    const response = await _logoutIfInvalidated(user, updateEmailPassword(auth, request));
    await user._updateTokensIfNecessary(response, true);
  }
  function _fromIdTokenResponse(idTokenResponse) {
    var _a, _b;
    if (!idTokenResponse) {
      return null;
    }
    const { providerId } = idTokenResponse;
    const profile = idTokenResponse.rawUserInfo ? JSON.parse(idTokenResponse.rawUserInfo) : {};
    const isNewUser = idTokenResponse.isNewUser || idTokenResponse.kind === "identitytoolkit#SignupNewUserResponse";
    if (!providerId && (idTokenResponse === null || idTokenResponse === void 0 ? void 0 : idTokenResponse.idToken)) {
      const signInProvider = (_b = (_a = _parseToken(idTokenResponse.idToken)) === null || _a === void 0 ? void 0 : _a.firebase) === null || _b === void 0 ? void 0 : _b["sign_in_provider"];
      if (signInProvider) {
        const filteredProviderId = signInProvider !== "anonymous" && signInProvider !== "custom" ? signInProvider : null;
        return new GenericAdditionalUserInfo(isNewUser, filteredProviderId);
      }
    }
    if (!providerId) {
      return null;
    }
    switch (providerId) {
      case "facebook.com":
        return new FacebookAdditionalUserInfo(isNewUser, profile);
      case "github.com":
        return new GithubAdditionalUserInfo(isNewUser, profile);
      case "google.com":
        return new GoogleAdditionalUserInfo(isNewUser, profile);
      case "twitter.com":
        return new TwitterAdditionalUserInfo(isNewUser, profile, idTokenResponse.screenName || null);
      case "custom":
      case "anonymous":
        return new GenericAdditionalUserInfo(isNewUser, null);
      default:
        return new GenericAdditionalUserInfo(isNewUser, providerId, profile);
    }
  }
  function getAdditionalUserInfo(userCredential) {
    const { user, _tokenResponse } = userCredential;
    if (user.isAnonymous && !_tokenResponse) {
      return {
        providerId: null,
        isNewUser: false,
        profile: null
      };
    }
    return _fromIdTokenResponse(_tokenResponse);
  }
  function setPersistence(auth, persistence) {
    return getModularInstance(auth).setPersistence(persistence);
  }
  function setRecaptchaConfig(auth, config) {
    return getModularInstance(auth).setRecaptchaConfig(config);
  }
  function onIdTokenChanged(auth, nextOrObserver, error, completed) {
    return getModularInstance(auth).onIdTokenChanged(nextOrObserver, error, completed);
  }
  function onAuthStateChanged(auth, nextOrObserver, error, completed) {
    return getModularInstance(auth).onAuthStateChanged(nextOrObserver, error, completed);
  }
  function useDeviceLanguage(auth) {
    getModularInstance(auth).useDeviceLanguage();
  }
  function updateCurrentUser(auth, user) {
    return getModularInstance(auth).updateCurrentUser(user);
  }
  function signOut(auth) {
    return getModularInstance(auth).signOut();
  }
  async function deleteUser(user) {
    return getModularInstance(user).delete();
  }
  function getMultiFactorResolver(auth, error) {
    var _a;
    const authModular = getModularInstance(auth);
    const errorInternal = error;
    _assert(error.customData.operationType, authModular, "argument-error");
    _assert((_a = errorInternal.customData._serverResponse) === null || _a === void 0 ? void 0 : _a.mfaPendingCredential, authModular, "argument-error");
    return MultiFactorResolverImpl._fromError(authModular, errorInternal);
  }
  function startEnrollPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
  }
  function finalizeEnrollPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
  }
  function withdrawMfa(auth, request) {
    return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:withdraw", _addTidIfNecessary(auth, request));
  }
  function multiFactor(user) {
    const userModular = getModularInstance(user);
    if (!multiFactorUserCache.has(userModular)) {
      multiFactorUserCache.set(userModular, MultiFactorUserImpl._fromUser(userModular));
    }
    return multiFactorUserCache.get(userModular);
  }
  function _iframeCannotSyncWebStorage() {
    const ua = getUA();
    return _isSafari(ua) || _isIOS(ua);
  }
  function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
      try {
        const value = await promise;
        return {
          fulfilled: true,
          value
        };
      } catch (reason) {
        return {
          fulfilled: false,
          reason
        };
      }
    }));
  }
  function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for (let i = 0; i < digits; i++) {
      random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
  }
  function _window() {
    return window;
  }
  function _setWindowLocation(url) {
    _window().location.href = url;
  }
  function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
  }
  async function _getActiveServiceWorker() {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch (_a) {
      return null;
    }
  }
  function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
  }
  function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
  }
  function getObjectStore(db, isReadWrite) {
    return db.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
  }
  function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME2);
    return new DBPromise(request).toPromise();
  }
  function _openDatabase() {
    const request = indexedDB.open(DB_NAME2, DB_VERSION2);
    return new Promise((resolve, reject) => {
      request.addEventListener("error", () => {
        reject(request.error);
      });
      request.addEventListener("upgradeneeded", () => {
        const db = request.result;
        try {
          db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
        } catch (e) {
          reject(e);
        }
      });
      request.addEventListener("success", async () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
          db.close();
          await _deleteDatabase();
          resolve(await _openDatabase());
        } else {
          resolve(db);
        }
      });
    });
  }
  async function _putObject(db, key, value) {
    const request = getObjectStore(db, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  }
  async function getObject(db, key) {
    const request = getObjectStore(db, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  }
  function _deleteObject(db, key) {
    const request = getObjectStore(db, true).delete(key);
    return new DBPromise(request).toPromise();
  }
  function startSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth, request));
  }
  function finalizeSignInPhoneMfa(auth, request) {
    return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
  }
  function generateRandomAlphaNumericString(len) {
    const chars = [];
    const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < len; i++) {
      chars.push(allowedChars.charAt(Math.floor(Math.random() * allowedChars.length)));
    }
    return chars.join("");
  }
  function isHostLanguageValid(hl) {
    return hl.length <= 6 && /^\s*[a-zA-Z0-9\-]*\s*$/.test(hl);
  }
  function domReady() {
    let resolver = null;
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      resolver = () => resolve();
      window.addEventListener("load", resolver);
    }).catch((e) => {
      if (resolver) {
        window.removeEventListener("load", resolver);
      }
      throw e;
    });
  }
  async function signInWithPhoneNumber(auth, phoneNumber, appVerifier) {
    const authInternal = _castAuth(auth);
    const verificationId = await _verifyPhoneNumber(authInternal, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => signInWithCredential(authInternal, cred));
  }
  async function linkWithPhoneNumber(user, phoneNumber, appVerifier) {
    const userInternal = getModularInstance(user);
    await _assertLinkedStatus(false, userInternal, "phone");
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => linkWithCredential(userInternal, cred));
  }
  async function reauthenticateWithPhoneNumber(user, phoneNumber, appVerifier) {
    const userInternal = getModularInstance(user);
    const verificationId = await _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => reauthenticateWithCredential(userInternal, cred));
  }
  async function _verifyPhoneNumber(auth, options, verifier) {
    var _a;
    const recaptchaToken = await verifier.verify();
    try {
      _assert(typeof recaptchaToken === "string", auth, "argument-error");
      _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error");
      let phoneInfoOptions;
      if (typeof options === "string") {
        phoneInfoOptions = {
          phoneNumber: options
        };
      } else {
        phoneInfoOptions = options;
      }
      if ("session" in phoneInfoOptions) {
        const session = phoneInfoOptions.session;
        if ("phoneNumber" in phoneInfoOptions) {
          _assert(session.type === "enroll", auth, "internal-error");
          const response = await startEnrollPhoneMfa(auth, {
            idToken: session.credential,
            phoneEnrollmentInfo: {
              phoneNumber: phoneInfoOptions.phoneNumber,
              recaptchaToken
            }
          });
          return response.phoneSessionInfo.sessionInfo;
        } else {
          _assert(session.type === "signin", auth, "internal-error");
          const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === void 0 ? void 0 : _a.uid) || phoneInfoOptions.multiFactorUid;
          _assert(mfaEnrollmentId, auth, "missing-multi-factor-info");
          const response = await startSignInPhoneMfa(auth, {
            mfaPendingCredential: session.credential,
            mfaEnrollmentId,
            phoneSignInInfo: {
              recaptchaToken
            }
          });
          return response.phoneResponseInfo.sessionInfo;
        }
      } else {
        const { sessionInfo } = await sendPhoneVerificationCode(auth, {
          phoneNumber: phoneInfoOptions.phoneNumber,
          recaptchaToken
        });
        return sessionInfo;
      }
    } finally {
      verifier._reset();
    }
  }
  async function updatePhoneNumber(user, credential) {
    await _link$1(getModularInstance(user), credential);
  }
  function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
      return _getInstance(resolverOverride);
    }
    _assert(auth._popupRedirectResolver, auth, "argument-error");
    return auth._popupRedirectResolver;
  }
  function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
  }
  function _reauth(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error");
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
  }
  async function _link(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error");
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
  }
  async function signInWithPopup(auth, provider, resolver) {
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    const action = new PopupOperation(authInternal, "signInViaPopup", provider, resolverInternal);
    return action.executeNotNull();
  }
  async function reauthenticateWithPopup(user, provider, resolver) {
    const userInternal = getModularInstance(user);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "reauthViaPopup", provider, resolverInternal, userInternal);
    return action.executeNotNull();
  }
  async function linkWithPopup(user, provider, resolver) {
    const userInternal = getModularInstance(user);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "linkViaPopup", provider, resolverInternal, userInternal);
    return action.executeNotNull();
  }
  async function _getAndClearPendingRedirectStatus(resolver, auth) {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!await persistence._isAvailable()) {
      return false;
    }
    const hasPendingRedirect = await persistence._get(key) === "true";
    await persistence._remove(key);
    return hasPendingRedirect;
  }
  async function _setPendingRedirectStatus(resolver, auth) {
    return resolverPersistence(resolver)._set(pendingRedirectKey(auth), "true");
  }
  function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
  }
  function pendingRedirectKey(auth) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
  }
  function signInWithRedirect(auth, provider, resolver) {
    return _signInWithRedirect(auth, provider, resolver);
  }
  async function _signInWithRedirect(auth, provider, resolver) {
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    await _setPendingRedirectStatus(resolverInternal, authInternal);
    return resolverInternal._openRedirect(authInternal, provider, "signInViaRedirect");
  }
  function reauthenticateWithRedirect(user, provider, resolver) {
    return _reauthenticateWithRedirect(user, provider, resolver);
  }
  async function _reauthenticateWithRedirect(user, provider, resolver) {
    const userInternal = getModularInstance(user);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    await _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = await prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "reauthViaRedirect", eventId);
  }
  function linkWithRedirect(user, provider, resolver) {
    return _linkWithRedirect(user, provider, resolver);
  }
  async function _linkWithRedirect(user, provider, resolver) {
    const userInternal = getModularInstance(user);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    await _assertLinkedStatus(false, userInternal, provider.providerId);
    await _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = await prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "linkViaRedirect", eventId);
  }
  async function getRedirectResult(auth, resolver) {
    await _castAuth(auth)._initializationPromise;
    return _getRedirectResult(auth, resolver, false);
  }
  async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      await authInternal._persistUserIfCurrent(result.user);
      await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  }
  async function prepareUserForRedirect(user) {
    const eventId = _generateEventId(`${user.uid}:::`);
    user._redirectEventId = eventId;
    await user.auth._setRedirectUser(user);
    await user.auth._persistUserIfCurrent(user);
    return eventId;
  }
  function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v) => v).join("-");
  }
  function isNullRedirectEvent({ type, error }) {
    return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
  }
  function isRedirectEvent(event) {
    switch (event.type) {
      case "signInViaRedirect":
      case "linkViaRedirect":
      case "reauthViaRedirect":
        return true;
      case "unknown":
        return isNullRedirectEvent(event);
      default:
        return false;
    }
  }
  async function _getProjectConfig(auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v1/projects", request);
  }
  async function _validateOrigin(auth) {
    if (auth.config.emulator) {
      return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth);
    for (const domain of authorizedDomains) {
      try {
        if (matchDomain(domain)) {
          return;
        }
      } catch (_a) {
      }
    }
    _fail(auth, "unauthorized-domain");
  }
  function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith("chrome-extension://")) {
      const ceUrl = new URL(expected);
      if (ceUrl.hostname === "" && hostname === "") {
        return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
      }
      return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
      return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
      return hostname === expected;
    }
    const escapedDomainPattern = expected.replace(/\./g, "\\.");
    const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
    return re.test(hostname);
  }
  function resetUnloadedGapiModules() {
    const beacon = _window().___jsl;
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
      for (const hint of Object.keys(beacon.H)) {
        beacon.H[hint].r = beacon.H[hint].r || [];
        beacon.H[hint].L = beacon.H[hint].L || [];
        beacon.H[hint].r = [...beacon.H[hint].L];
        if (beacon.CP) {
          for (let i = 0; i < beacon.CP.length; i++) {
            beacon.CP[i] = null;
          }
        }
      }
    }
  }
  function loadGapi(auth) {
    return new Promise((resolve, reject) => {
      var _a, _b, _c;
      function loadGapiIframe() {
        resetUnloadedGapiModules();
        gapi.load("gapi.iframes", {
          callback: () => {
            resolve(gapi.iframes.getContext());
          },
          ontimeout: () => {
            resetUnloadedGapiModules();
            reject(_createError(auth, "network-request-failed"));
          },
          timeout: NETWORK_TIMEOUT.get()
        });
      }
      if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
        resolve(gapi.iframes.getContext());
      } else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
        loadGapiIframe();
      } else {
        const cbName = _generateCallbackName("iframefcb");
        _window()[cbName] = () => {
          if (!!gapi.load) {
            loadGapiIframe();
          } else {
            reject(_createError(auth, "network-request-failed"));
          }
        };
        return _loadJS(`https://apis.google.com/js/api.js?onload=${cbName}`).catch((e) => reject(e));
      }
    }).catch((error) => {
      cachedGApiLoader = null;
      throw error;
    });
  }
  function _loadGapi(auth) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
    return cachedGApiLoader;
  }
  function getIframeUrl(auth) {
    const config = auth.config;
    _assert(config.authDomain, auth, "auth-domain-config-required");
    const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
    const params = {
      apiKey: config.apiKey,
      appName: auth.name,
      v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
      params.eid = eid;
    }
    const frameworks = auth._getFrameworks();
    if (frameworks.length) {
      params.fw = frameworks.join(",");
    }
    return `${url}?${querystring(params).slice(1)}`;
  }
  async function _openIframe(auth) {
    const context = await _loadGapi(auth);
    const gapi2 = _window().gapi;
    _assert(gapi2, auth, "internal-error");
    return context.open({
      where: document.body,
      url: getIframeUrl(auth),
      messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
      attributes: IFRAME_ATTRIBUTES,
      dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
      await iframe.restyle({
        setHideOnLeave: false
      });
      const networkError = _createError(auth, "network-request-failed");
      const networkErrorTimer = _window().setTimeout(() => {
        reject(networkError);
      }, PING_TIMEOUT.get());
      function clearTimerAndResolve() {
        _window().clearTimeout(networkErrorTimer);
        resolve(iframe);
      }
      iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
        reject(networkError);
      });
    }));
  }
  function _open(auth, url, name4, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = "";
    const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
      width: width.toString(),
      height: height.toString(),
      top,
      left
    });
    const ua = getUA().toLowerCase();
    if (name4) {
      target = _isChromeIOS(ua) ? TARGET_BLANK : name4;
    }
    if (_isFirefox(ua)) {
      url = url || FIREFOX_EMPTY_URL;
      options.scrollbars = "yes";
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
    if (_isIOSStandalone(ua) && target !== "_self") {
      openAsNewWindowIOS(url || "", target);
      return new AuthPopup(null);
    }
    const newWin = window.open(url || "", target, optionsString);
    _assert(newWin, auth, "popup-blocked");
    try {
      newWin.focus();
    } catch (e) {
    }
    return new AuthPopup(newWin);
  }
  function openAsNewWindowIOS(url, target) {
    const el = document.createElement("a");
    el.href = url;
    el.target = target;
    const click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
  }
  function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(auth.config.authDomain, auth, "auth-domain-config-required");
    _assert(auth.config.apiKey, auth, "invalid-api-key");
    const params = {
      apiKey: auth.config.apiKey,
      appName: auth.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth.tenantId) {
      params.tid = auth.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}`;
  }
  function getHandlerBase({ config }) {
    if (!config.emulator) {
      return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
  }
  function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
      case "Node":
        return "node";
      case "ReactNative":
        return "rn";
      case "Worker":
        return "webworker";
      case "Cordova":
        return "cordova";
      default:
        return void 0;
    }
  }
  function registerAuth(clientPlatform) {
    _registerComponent(new Component2("auth", (container, { options: deps }) => {
      const app = container.getProvider("app").getImmediate();
      const { apiKey, authDomain } = app.options;
      return ((app2) => {
        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
        _assert(!(authDomain === null || authDomain === void 0 ? void 0 : authDomain.includes(":")), "argument-error", {
          appName: app2.name
        });
        const config = {
          apiKey,
          authDomain,
          clientPlatform,
          apiHost: "identitytoolkit.googleapis.com",
          tokenApiHost: "securetoken.googleapis.com",
          apiScheme: "https",
          sdkClientVersion: _getClientVersion(clientPlatform)
        };
        const authInstance = new AuthImpl(app2, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
      })(app);
    }, "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
      const authInternalProvider = container.getProvider("auth-internal");
      authInternalProvider.initialize();
    }));
    _registerComponent(new Component2("auth-internal", (container) => {
      const auth = _castAuth(container.getProvider("auth").getImmediate());
      return ((auth2) => new AuthInterop(auth2))(auth);
    }, "PRIVATE").setInstantiationMode("EXPLICIT"));
    registerVersion(name3, version3, getVersionForPlatform(clientPlatform));
    registerVersion(name3, version3, "esm2017");
  }
  function getAuth(app = getApp()) {
    const provider = _getProvider(app, "auth");
    if (provider.isInitialized()) {
      return provider.getImmediate();
    }
    return initializeAuth(app, {
      popupRedirectResolver: browserPopupRedirectResolver,
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
      ]
    });
  }
  var FactorId, ProviderId, SignInMethod, OperationType, ActionCodeOperation, debugErrorMap, prodErrorMap, _DEFAULT_AUTH_ERROR_FACTORY, AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY, logClient, instanceCache, Delay, FetchProvider, SERVER_ERROR_MAP, DEFAULT_API_TIMEOUT_MS, NetworkTimeout, ProactiveRefresh, UserMetadata, StsTokenManager, UserImpl, InMemoryPersistence, inMemoryPersistence, PersistenceUserManager, AuthImpl, Subscription, AuthCredential, RECAPTCHA_ENTERPRISE_URL, RECAPTCHA_ENTERPRISE_VERIFIER_TYPE, RecaptchaEnterpriseVerifier, EmailAuthCredential, IDP_REQUEST_URI$1, OAuthCredential, VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_, PhoneAuthCredential, ActionCodeURL, EmailAuthProvider, FederatedAuthProvider, BaseOAuthProvider, OAuthProvider, FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider, IDP_REQUEST_URI, SAMLAuthCredential, SAML_PROVIDER_PREFIX, SAMLAuthProvider, TwitterAuthProvider, UserCredentialImpl, MultiFactorError, MultiFactorInfoImpl, PhoneMultiFactorInfoImpl, GenericAdditionalUserInfo, FederatedAdditionalUserInfoWithUsername, FacebookAdditionalUserInfo, GithubAdditionalUserInfo, GoogleAdditionalUserInfo, TwitterAdditionalUserInfo, MultiFactorSessionImpl, MultiFactorResolverImpl, MultiFactorUserImpl, multiFactorUserCache, STORAGE_AVAILABLE_KEY, BrowserPersistenceClass, _POLLING_INTERVAL_MS$1, IE10_LOCAL_STORAGE_SYNC_DELAY, BrowserLocalPersistence, browserLocalPersistence, BrowserSessionPersistence, browserSessionPersistence, Receiver, Sender, DB_NAME2, DB_VERSION2, DB_OBJECTSTORE_NAME, DB_DATA_KEYPATH, DBPromise, _POLLING_INTERVAL_MS, _TRANSACTION_RETRY_COUNT, IndexedDBLocalPersistence, indexedDBLocalPersistence, _SOLVE_TIME_MS, _EXPIRATION_TIME_MS, _WIDGET_ID_START, MockReCaptcha, MockWidget, _JSLOAD_CALLBACK, NETWORK_TIMEOUT_DELAY, RECAPTCHA_BASE, ReCaptchaLoaderImpl, MockReCaptchaLoaderImpl, RECAPTCHA_VERIFIER_TYPE, DEFAULT_PARAMS, RecaptchaVerifier, ConfirmationResultImpl, PhoneAuthProvider, IdpCredential, AbstractPopupRedirectOperation, _POLL_WINDOW_CLOSE_TIMEOUT, PopupOperation, PENDING_REDIRECT_KEY, redirectOutcomeMap, RedirectAction, EVENT_DUPLICATION_CACHE_DURATION_MS, AuthEventManager, IP_ADDRESS_REGEX, HTTP_REGEX, NETWORK_TIMEOUT, cachedGApiLoader, PING_TIMEOUT, IFRAME_PATH, EMULATED_IFRAME_PATH, IFRAME_ATTRIBUTES, EID_FROM_APIHOST, BASE_POPUP_OPTIONS, DEFAULT_WIDTH, DEFAULT_HEIGHT, TARGET_BLANK, FIREFOX_EMPTY_URL, AuthPopup, WIDGET_PATH, EMULATOR_WIDGET_PATH, WEB_STORAGE_SUPPORT_KEY, BrowserPopupRedirectResolver, browserPopupRedirectResolver, MultiFactorAssertionImpl, PhoneMultiFactorAssertionImpl, PhoneMultiFactorGenerator, name3, version3, AuthInterop;
  var init_index_139b42ee = __esm({
    "node_modules/@firebase/auth/dist/esm2017/index-139b42ee.js"() {
      init_index_esm20175();
      init_index_esm20174();
      init_modules();
      init_index_esm20173();
      init_index_esm20176();
      FactorId = {
        PHONE: "phone"
      };
      ProviderId = {
        FACEBOOK: "facebook.com",
        GITHUB: "github.com",
        GOOGLE: "google.com",
        PASSWORD: "password",
        PHONE: "phone",
        TWITTER: "twitter.com"
      };
      SignInMethod = {
        EMAIL_LINK: "emailLink",
        EMAIL_PASSWORD: "password",
        FACEBOOK: "facebook.com",
        GITHUB: "github.com",
        GOOGLE: "google.com",
        PHONE: "phone",
        TWITTER: "twitter.com"
      };
      OperationType = {
        LINK: "link",
        REAUTHENTICATE: "reauthenticate",
        SIGN_IN: "signIn"
      };
      ActionCodeOperation = {
        EMAIL_SIGNIN: "EMAIL_SIGNIN",
        PASSWORD_RESET: "PASSWORD_RESET",
        RECOVER_EMAIL: "RECOVER_EMAIL",
        REVERT_SECOND_FACTOR_ADDITION: "REVERT_SECOND_FACTOR_ADDITION",
        VERIFY_AND_CHANGE_EMAIL: "VERIFY_AND_CHANGE_EMAIL",
        VERIFY_EMAIL: "VERIFY_EMAIL"
      };
      debugErrorMap = _debugErrorMap;
      prodErrorMap = _prodErrorMap;
      _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory2("auth", "Firebase", _prodErrorMap());
      AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY = {
        ADMIN_ONLY_OPERATION: "auth/admin-restricted-operation",
        ARGUMENT_ERROR: "auth/argument-error",
        APP_NOT_AUTHORIZED: "auth/app-not-authorized",
        APP_NOT_INSTALLED: "auth/app-not-installed",
        CAPTCHA_CHECK_FAILED: "auth/captcha-check-failed",
        CODE_EXPIRED: "auth/code-expired",
        CORDOVA_NOT_READY: "auth/cordova-not-ready",
        CORS_UNSUPPORTED: "auth/cors-unsupported",
        CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use",
        CREDENTIAL_MISMATCH: "auth/custom-token-mismatch",
        CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "auth/requires-recent-login",
        DEPENDENT_SDK_INIT_BEFORE_AUTH: "auth/dependent-sdk-initialized-before-auth",
        DYNAMIC_LINK_NOT_ACTIVATED: "auth/dynamic-link-not-activated",
        EMAIL_CHANGE_NEEDS_VERIFICATION: "auth/email-change-needs-verification",
        EMAIL_EXISTS: "auth/email-already-in-use",
        EMULATOR_CONFIG_FAILED: "auth/emulator-config-failed",
        EXPIRED_OOB_CODE: "auth/expired-action-code",
        EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request",
        INTERNAL_ERROR: "auth/internal-error",
        INVALID_API_KEY: "auth/invalid-api-key",
        INVALID_APP_CREDENTIAL: "auth/invalid-app-credential",
        INVALID_APP_ID: "auth/invalid-app-id",
        INVALID_AUTH: "auth/invalid-user-token",
        INVALID_AUTH_EVENT: "auth/invalid-auth-event",
        INVALID_CERT_HASH: "auth/invalid-cert-hash",
        INVALID_CODE: "auth/invalid-verification-code",
        INVALID_CONTINUE_URI: "auth/invalid-continue-uri",
        INVALID_CORDOVA_CONFIGURATION: "auth/invalid-cordova-configuration",
        INVALID_CUSTOM_TOKEN: "auth/invalid-custom-token",
        INVALID_DYNAMIC_LINK_DOMAIN: "auth/invalid-dynamic-link-domain",
        INVALID_EMAIL: "auth/invalid-email",
        INVALID_EMULATOR_SCHEME: "auth/invalid-emulator-scheme",
        INVALID_IDP_RESPONSE: "auth/invalid-credential",
        INVALID_MESSAGE_PAYLOAD: "auth/invalid-message-payload",
        INVALID_MFA_SESSION: "auth/invalid-multi-factor-session",
        INVALID_OAUTH_CLIENT_ID: "auth/invalid-oauth-client-id",
        INVALID_OAUTH_PROVIDER: "auth/invalid-oauth-provider",
        INVALID_OOB_CODE: "auth/invalid-action-code",
        INVALID_ORIGIN: "auth/unauthorized-domain",
        INVALID_PASSWORD: "auth/wrong-password",
        INVALID_PERSISTENCE: "auth/invalid-persistence-type",
        INVALID_PHONE_NUMBER: "auth/invalid-phone-number",
        INVALID_PROVIDER_ID: "auth/invalid-provider-id",
        INVALID_RECIPIENT_EMAIL: "auth/invalid-recipient-email",
        INVALID_SENDER: "auth/invalid-sender",
        INVALID_SESSION_INFO: "auth/invalid-verification-id",
        INVALID_TENANT_ID: "auth/invalid-tenant-id",
        MFA_INFO_NOT_FOUND: "auth/multi-factor-info-not-found",
        MFA_REQUIRED: "auth/multi-factor-auth-required",
        MISSING_ANDROID_PACKAGE_NAME: "auth/missing-android-pkg-name",
        MISSING_APP_CREDENTIAL: "auth/missing-app-credential",
        MISSING_AUTH_DOMAIN: "auth/auth-domain-config-required",
        MISSING_CODE: "auth/missing-verification-code",
        MISSING_CONTINUE_URI: "auth/missing-continue-uri",
        MISSING_IFRAME_START: "auth/missing-iframe-start",
        MISSING_IOS_BUNDLE_ID: "auth/missing-ios-bundle-id",
        MISSING_OR_INVALID_NONCE: "auth/missing-or-invalid-nonce",
        MISSING_MFA_INFO: "auth/missing-multi-factor-info",
        MISSING_MFA_SESSION: "auth/missing-multi-factor-session",
        MISSING_PHONE_NUMBER: "auth/missing-phone-number",
        MISSING_SESSION_INFO: "auth/missing-verification-id",
        MODULE_DESTROYED: "auth/app-deleted",
        NEED_CONFIRMATION: "auth/account-exists-with-different-credential",
        NETWORK_REQUEST_FAILED: "auth/network-request-failed",
        NULL_USER: "auth/null-user",
        NO_AUTH_EVENT: "auth/no-auth-event",
        NO_SUCH_PROVIDER: "auth/no-such-provider",
        OPERATION_NOT_ALLOWED: "auth/operation-not-allowed",
        OPERATION_NOT_SUPPORTED: "auth/operation-not-supported-in-this-environment",
        POPUP_BLOCKED: "auth/popup-blocked",
        POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user",
        PROVIDER_ALREADY_LINKED: "auth/provider-already-linked",
        QUOTA_EXCEEDED: "auth/quota-exceeded",
        REDIRECT_CANCELLED_BY_USER: "auth/redirect-cancelled-by-user",
        REDIRECT_OPERATION_PENDING: "auth/redirect-operation-pending",
        REJECTED_CREDENTIAL: "auth/rejected-credential",
        SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use",
        SECOND_FACTOR_LIMIT_EXCEEDED: "auth/maximum-second-factor-count-exceeded",
        TENANT_ID_MISMATCH: "auth/tenant-id-mismatch",
        TIMEOUT: "auth/timeout",
        TOKEN_EXPIRED: "auth/user-token-expired",
        TOO_MANY_ATTEMPTS_TRY_LATER: "auth/too-many-requests",
        UNAUTHORIZED_DOMAIN: "auth/unauthorized-continue-uri",
        UNSUPPORTED_FIRST_FACTOR: "auth/unsupported-first-factor",
        UNSUPPORTED_PERSISTENCE: "auth/unsupported-persistence-type",
        UNSUPPORTED_TENANT_OPERATION: "auth/unsupported-tenant-operation",
        UNVERIFIED_EMAIL: "auth/unverified-email",
        USER_CANCELLED: "auth/user-cancelled",
        USER_DELETED: "auth/user-not-found",
        USER_DISABLED: "auth/user-disabled",
        USER_MISMATCH: "auth/user-mismatch",
        USER_SIGNED_OUT: "auth/user-signed-out",
        WEAK_PASSWORD: "auth/weak-password",
        WEB_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported",
        ALREADY_INITIALIZED: "auth/already-initialized",
        INVALID_RECAPTCHA_SCORE: "auth/invalid-recaptcha-score",
        MISSING_RECAPTCHA_TOKEN: "auth/missing-recaptcha-token",
        INVALID_RECAPTCHA_TOKEN: "auth/invalid-recaptcha-token",
        INVALID_RECAPTCHA_ACTION: "auth/invalide-recaptcha-action",
        INVALID_RECAPTCHA_ENFORCEMENT_STATE: "auth/invalid-recaptcha-enforcement-state",
        RECAPTCHA_NOT_ENABLED: "auth/recaptcha-not-enabled",
        MISSING_CLIENT_TYPE: "auth/missing-client-type",
        MISSING_RECAPTCHA_VERSION: "auth/missing-recaptcha-version",
        INVALID_REQ_TYPE: "auth/invalid-req-type",
        INVALID_RECAPTCHA_VERSION: "auth/invalid-recaptcha-version"
      };
      logClient = new Logger("@firebase/auth");
      instanceCache = new Map();
      Delay = class {
        constructor(shortDelay, longDelay) {
          this.shortDelay = shortDelay;
          this.longDelay = longDelay;
          debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
          this.isMobile = isMobileCordova() || isReactNative();
        }
        get() {
          if (!_isOnline()) {
            return Math.min(5e3, this.shortDelay);
          }
          return this.isMobile ? this.longDelay : this.shortDelay;
        }
      };
      FetchProvider = class {
        static initialize(fetchImpl, headersImpl, responseImpl) {
          this.fetchImpl = fetchImpl;
          if (headersImpl) {
            this.headersImpl = headersImpl;
          }
          if (responseImpl) {
            this.responseImpl = responseImpl;
          }
        }
        static fetch() {
          if (this.fetchImpl) {
            return this.fetchImpl;
          }
          if (typeof self !== "undefined" && "fetch" in self) {
            return self.fetch;
          }
          debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
        static headers() {
          if (this.headersImpl) {
            return this.headersImpl;
          }
          if (typeof self !== "undefined" && "Headers" in self) {
            return self.Headers;
          }
          debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
        static response() {
          if (this.responseImpl) {
            return this.responseImpl;
          }
          if (typeof self !== "undefined" && "Response" in self) {
            return self.Response;
          }
          debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
      };
      SERVER_ERROR_MAP = {
        ["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
        ["MISSING_CUSTOM_TOKEN"]: "internal-error",
        ["INVALID_IDENTIFIER"]: "invalid-email",
        ["MISSING_CONTINUE_URI"]: "internal-error",
        ["INVALID_PASSWORD"]: "wrong-password",
        ["MISSING_PASSWORD"]: "internal-error",
        ["EMAIL_EXISTS"]: "email-already-in-use",
        ["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
        ["INVALID_IDP_RESPONSE"]: "invalid-credential",
        ["INVALID_PENDING_TOKEN"]: "invalid-credential",
        ["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
        ["MISSING_REQ_TYPE"]: "internal-error",
        ["EMAIL_NOT_FOUND"]: "user-not-found",
        ["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
        ["EXPIRED_OOB_CODE"]: "expired-action-code",
        ["INVALID_OOB_CODE"]: "invalid-action-code",
        ["MISSING_OOB_CODE"]: "internal-error",
        ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
        ["INVALID_ID_TOKEN"]: "invalid-user-token",
        ["TOKEN_EXPIRED"]: "user-token-expired",
        ["USER_NOT_FOUND"]: "user-token-expired",
        ["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
        ["INVALID_CODE"]: "invalid-verification-code",
        ["INVALID_SESSION_INFO"]: "invalid-verification-id",
        ["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
        ["MISSING_SESSION_INFO"]: "missing-verification-id",
        ["SESSION_EXPIRED"]: "code-expired",
        ["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
        ["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
        ["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
        ["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
        ["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
        ["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
        ["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
        ["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
        ["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
        ["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
        ["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error"
      };
      DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
      NetworkTimeout = class {
        constructor(auth) {
          this.auth = auth;
          this.timer = null;
          this.promise = new Promise((_, reject) => {
            this.timer = setTimeout(() => {
              return reject(_createError(this.auth, "network-request-failed"));
            }, DEFAULT_API_TIMEOUT_MS.get());
          });
        }
        clearNetworkTimeout() {
          clearTimeout(this.timer);
        }
      };
      ProactiveRefresh = class {
        constructor(user) {
          this.user = user;
          this.isRunning = false;
          this.timerId = null;
          this.errorBackoff = 3e4;
        }
        _start() {
          if (this.isRunning) {
            return;
          }
          this.isRunning = true;
          this.schedule();
        }
        _stop() {
          if (!this.isRunning) {
            return;
          }
          this.isRunning = false;
          if (this.timerId !== null) {
            clearTimeout(this.timerId);
          }
        }
        getInterval(wasError) {
          var _a;
          if (wasError) {
            const interval = this.errorBackoff;
            this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4);
            return interval;
          } else {
            this.errorBackoff = 3e4;
            const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
            const interval = expTime - Date.now() - 3e5;
            return Math.max(0, interval);
          }
        }
        schedule(wasError = false) {
          if (!this.isRunning) {
            return;
          }
          const interval = this.getInterval(wasError);
          this.timerId = setTimeout(async () => {
            await this.iteration();
          }, interval);
        }
        async iteration() {
          try {
            await this.user.getIdToken(true);
          } catch (e) {
            if (e.code === `auth/${"network-request-failed"}`) {
              this.schedule(true);
            }
            return;
          }
          this.schedule();
        }
      };
      UserMetadata = class {
        constructor(createdAt, lastLoginAt) {
          this.createdAt = createdAt;
          this.lastLoginAt = lastLoginAt;
          this._initializeTime();
        }
        _initializeTime() {
          this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
          this.creationTime = utcTimestampToDateString(this.createdAt);
        }
        _copy(metadata) {
          this.createdAt = metadata.createdAt;
          this.lastLoginAt = metadata.lastLoginAt;
          this._initializeTime();
        }
        toJSON() {
          return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
          };
        }
      };
      StsTokenManager = class {
        constructor() {
          this.refreshToken = null;
          this.accessToken = null;
          this.expirationTime = null;
        }
        get isExpired() {
          return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
        }
        updateFromServerResponse(response) {
          _assert(response.idToken, "internal-error");
          _assert(typeof response.idToken !== "undefined", "internal-error");
          _assert(typeof response.refreshToken !== "undefined", "internal-error");
          const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
          this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
        }
        async getToken(auth, forceRefresh = false) {
          _assert(!this.accessToken || this.refreshToken, auth, "user-token-expired");
          if (!forceRefresh && this.accessToken && !this.isExpired) {
            return this.accessToken;
          }
          if (this.refreshToken) {
            await this.refresh(auth, this.refreshToken);
            return this.accessToken;
          }
          return null;
        }
        clearRefreshToken() {
          this.refreshToken = null;
        }
        async refresh(auth, oldToken) {
          const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth, oldToken);
          this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
        }
        updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
          this.refreshToken = refreshToken || null;
          this.accessToken = accessToken || null;
          this.expirationTime = Date.now() + expiresInSec * 1e3;
        }
        static fromJSON(appName, object) {
          const { refreshToken, accessToken, expirationTime } = object;
          const manager = new StsTokenManager();
          if (refreshToken) {
            _assert(typeof refreshToken === "string", "internal-error", {
              appName
            });
            manager.refreshToken = refreshToken;
          }
          if (accessToken) {
            _assert(typeof accessToken === "string", "internal-error", {
              appName
            });
            manager.accessToken = accessToken;
          }
          if (expirationTime) {
            _assert(typeof expirationTime === "number", "internal-error", {
              appName
            });
            manager.expirationTime = expirationTime;
          }
          return manager;
        }
        toJSON() {
          return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
          };
        }
        _assign(stsTokenManager) {
          this.accessToken = stsTokenManager.accessToken;
          this.refreshToken = stsTokenManager.refreshToken;
          this.expirationTime = stsTokenManager.expirationTime;
        }
        _clone() {
          return Object.assign(new StsTokenManager(), this.toJSON());
        }
        _performRefresh() {
          return debugFail("not implemented");
        }
      };
      UserImpl = class {
        constructor(_a) {
          var { uid, auth, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
          this.providerId = "firebase";
          this.emailVerified = false;
          this.isAnonymous = false;
          this.tenantId = null;
          this.providerData = [];
          this.proactiveRefresh = new ProactiveRefresh(this);
          this.reloadUserInfo = null;
          this.reloadListener = null;
          this.uid = uid;
          this.auth = auth;
          this.stsTokenManager = stsTokenManager;
          this.accessToken = stsTokenManager.accessToken;
          this.displayName = opt.displayName || null;
          this.email = opt.email || null;
          this.emailVerified = opt.emailVerified || false;
          this.phoneNumber = opt.phoneNumber || null;
          this.photoURL = opt.photoURL || null;
          this.isAnonymous = opt.isAnonymous || false;
          this.tenantId = opt.tenantId || null;
          this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
        }
        async getIdToken(forceRefresh) {
          const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
          _assert(accessToken, this.auth, "internal-error");
          if (this.accessToken !== accessToken) {
            this.accessToken = accessToken;
            await this.auth._persistUserIfCurrent(this);
            this.auth._notifyListenersIfCurrent(this);
          }
          return accessToken;
        }
        getIdTokenResult(forceRefresh) {
          return getIdTokenResult(this, forceRefresh);
        }
        reload() {
          return reload(this);
        }
        _assign(user) {
          if (this === user) {
            return;
          }
          _assert(this.uid === user.uid, this.auth, "internal-error");
          this.displayName = user.displayName;
          this.photoURL = user.photoURL;
          this.email = user.email;
          this.emailVerified = user.emailVerified;
          this.phoneNumber = user.phoneNumber;
          this.isAnonymous = user.isAnonymous;
          this.tenantId = user.tenantId;
          this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
          this.metadata._copy(user.metadata);
          this.stsTokenManager._assign(user.stsTokenManager);
        }
        _clone(auth) {
          return new UserImpl(Object.assign(Object.assign({}, this), { auth, stsTokenManager: this.stsTokenManager._clone() }));
        }
        _onReload(callback) {
          _assert(!this.reloadListener, this.auth, "internal-error");
          this.reloadListener = callback;
          if (this.reloadUserInfo) {
            this._notifyReloadListener(this.reloadUserInfo);
            this.reloadUserInfo = null;
          }
        }
        _notifyReloadListener(userInfo) {
          if (this.reloadListener) {
            this.reloadListener(userInfo);
          } else {
            this.reloadUserInfo = userInfo;
          }
        }
        _startProactiveRefresh() {
          this.proactiveRefresh._start();
        }
        _stopProactiveRefresh() {
          this.proactiveRefresh._stop();
        }
        async _updateTokensIfNecessary(response, reload2 = false) {
          let tokensRefreshed = false;
          if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
            this.stsTokenManager.updateFromServerResponse(response);
            tokensRefreshed = true;
          }
          if (reload2) {
            await _reloadWithoutSaving(this);
          }
          await this.auth._persistUserIfCurrent(this);
          if (tokensRefreshed) {
            this.auth._notifyListenersIfCurrent(this);
          }
        }
        async delete() {
          const idToken = await this.getIdToken();
          await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
          this.stsTokenManager.clearRefreshToken();
          return this.auth.signOut();
        }
        toJSON() {
          return Object.assign(Object.assign({
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
            stsTokenManager: this.stsTokenManager.toJSON(),
            _redirectEventId: this._redirectEventId
          }, this.metadata.toJSON()), {
            apiKey: this.auth.config.apiKey,
            appName: this.auth.name
          });
        }
        get refreshToken() {
          return this.stsTokenManager.refreshToken || "";
        }
        static _fromJSON(auth, object) {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
          const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
          const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : void 0;
          const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
          const tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : void 0;
          const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
          const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
          const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : void 0;
          const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
          _assert(uid && plainObjectTokenManager, auth, "internal-error");
          const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
          _assert(typeof uid === "string", auth, "internal-error");
          assertStringOrUndefined(displayName, auth.name);
          assertStringOrUndefined(email, auth.name);
          _assert(typeof emailVerified === "boolean", auth, "internal-error");
          _assert(typeof isAnonymous === "boolean", auth, "internal-error");
          assertStringOrUndefined(phoneNumber, auth.name);
          assertStringOrUndefined(photoURL, auth.name);
          assertStringOrUndefined(tenantId, auth.name);
          assertStringOrUndefined(_redirectEventId, auth.name);
          assertStringOrUndefined(createdAt, auth.name);
          assertStringOrUndefined(lastLoginAt, auth.name);
          const user = new UserImpl({
            uid,
            auth,
            email,
            emailVerified,
            displayName,
            isAnonymous,
            photoURL,
            phoneNumber,
            tenantId,
            stsTokenManager,
            createdAt,
            lastLoginAt
          });
          if (providerData && Array.isArray(providerData)) {
            user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
          }
          if (_redirectEventId) {
            user._redirectEventId = _redirectEventId;
          }
          return user;
        }
        static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
          const stsTokenManager = new StsTokenManager();
          stsTokenManager.updateFromServerResponse(idTokenResponse);
          const user = new UserImpl({
            uid: idTokenResponse.localId,
            auth,
            stsTokenManager,
            isAnonymous
          });
          await _reloadWithoutSaving(user);
          return user;
        }
      };
      InMemoryPersistence = class {
        constructor() {
          this.type = "NONE";
          this.storage = {};
        }
        async _isAvailable() {
          return true;
        }
        async _set(key, value) {
          this.storage[key] = value;
        }
        async _get(key) {
          const value = this.storage[key];
          return value === void 0 ? null : value;
        }
        async _remove(key) {
          delete this.storage[key];
        }
        _addListener(_key, _listener) {
          return;
        }
        _removeListener(_key, _listener) {
          return;
        }
      };
      InMemoryPersistence.type = "NONE";
      inMemoryPersistence = InMemoryPersistence;
      PersistenceUserManager = class {
        constructor(persistence, auth, userKey) {
          this.persistence = persistence;
          this.auth = auth;
          this.userKey = userKey;
          const { config, name: name4 } = this.auth;
          this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name4);
          this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name4);
          this.boundEventHandler = auth._onStorageEvent.bind(auth);
          this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
        }
        setCurrentUser(user) {
          return this.persistence._set(this.fullUserKey, user.toJSON());
        }
        async getCurrentUser() {
          const blob = await this.persistence._get(this.fullUserKey);
          return blob ? UserImpl._fromJSON(this.auth, blob) : null;
        }
        removeCurrentUser() {
          return this.persistence._remove(this.fullUserKey);
        }
        savePersistenceForRedirect() {
          return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
        }
        async setPersistence(newPersistence) {
          if (this.persistence === newPersistence) {
            return;
          }
          const currentUser = await this.getCurrentUser();
          await this.removeCurrentUser();
          this.persistence = newPersistence;
          if (currentUser) {
            return this.setCurrentUser(currentUser);
          }
        }
        delete() {
          this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
        }
        static async create(auth, persistenceHierarchy, userKey = "authUser") {
          if (!persistenceHierarchy.length) {
            return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
          }
          const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
            if (await persistence._isAvailable()) {
              return persistence;
            }
            return void 0;
          }))).filter((persistence) => persistence);
          let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
          const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
          let userToMigrate = null;
          for (const persistence of persistenceHierarchy) {
            try {
              const blob = await persistence._get(key);
              if (blob) {
                const user = UserImpl._fromJSON(auth, blob);
                if (persistence !== selectedPersistence) {
                  userToMigrate = user;
                }
                selectedPersistence = persistence;
                break;
              }
            } catch (_a) {
            }
          }
          const migrationHierarchy = availablePersistences.filter((p) => p._shouldAllowMigration);
          if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
            return new PersistenceUserManager(selectedPersistence, auth, userKey);
          }
          selectedPersistence = migrationHierarchy[0];
          if (userToMigrate) {
            await selectedPersistence._set(key, userToMigrate.toJSON());
          }
          await Promise.all(persistenceHierarchy.map(async (persistence) => {
            if (persistence !== selectedPersistence) {
              try {
                await persistence._remove(key);
              } catch (_a) {
              }
            }
          }));
          return new PersistenceUserManager(selectedPersistence, auth, userKey);
        }
      };
      AuthImpl = class {
        constructor(app, config) {
          this.app = app;
          this.config = config;
          this.currentUser = null;
          this.emulatorConfig = null;
          this.operations = Promise.resolve();
          this.authStateSubscription = new Subscription(this);
          this.idTokenSubscription = new Subscription(this);
          this.redirectUser = null;
          this.isProactiveRefreshEnabled = false;
          this._canInitEmulator = true;
          this._isInitialized = false;
          this._deleted = false;
          this._initializationPromise = null;
          this._popupRedirectResolver = null;
          this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
          this._recaptchaConfig = null;
          this.lastNotifiedUid = void 0;
          this.languageCode = null;
          this.tenantId = null;
          this.settings = { appVerificationDisabledForTesting: false };
          this.frameworks = [];
          this.name = app.name;
          this.clientVersion = config.sdkClientVersion;
        }
        _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
          if (popupRedirectResolver) {
            this._popupRedirectResolver = _getInstance(popupRedirectResolver);
          }
          this._initializationPromise = this.queue(async () => {
            var _a, _b;
            if (this._deleted) {
              return;
            }
            this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
            if (this._deleted) {
              return;
            }
            if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
              try {
                await this._popupRedirectResolver._initialize(this);
              } catch (e) {
              }
            }
            await this.initializeCurrentUser(popupRedirectResolver);
            this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
            if (this._deleted) {
              return;
            }
            this._isInitialized = true;
          });
          return this._initializationPromise;
        }
        async _onStorageEvent() {
          if (this._deleted) {
            return;
          }
          const user = await this.assertedPersistence.getCurrentUser();
          if (!this.currentUser && !user) {
            return;
          }
          if (this.currentUser && user && this.currentUser.uid === user.uid) {
            this._currentUser._assign(user);
            await this.currentUser.getIdToken();
            return;
          }
          await this._updateCurrentUser(user);
        }
        async initializeCurrentUser(popupRedirectResolver) {
          var _a;
          let storedUser = await this.assertedPersistence.getCurrentUser();
          if (popupRedirectResolver && this.config.authDomain) {
            await this.getOrInitRedirectPersistenceManager();
            const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
            const storedUserEventId = storedUser === null || storedUser === void 0 ? void 0 : storedUser._redirectEventId;
            const result = await this.tryRedirectSignIn(popupRedirectResolver);
            if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
              storedUser = result.user;
            }
          }
          if (!storedUser) {
            return this.directlySetCurrentUser(null);
          }
          if (!storedUser._redirectEventId) {
            return this.reloadAndSetCurrentUserOrClear(storedUser);
          }
          _assert(this._popupRedirectResolver, this, "argument-error");
          await this.getOrInitRedirectPersistenceManager();
          if (this.redirectUser && this.redirectUser._redirectEventId === storedUser._redirectEventId) {
            return this.directlySetCurrentUser(storedUser);
          }
          return this.reloadAndSetCurrentUserOrClear(storedUser);
        }
        async tryRedirectSignIn(redirectResolver) {
          let result = null;
          try {
            result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
          } catch (e) {
            await this._setRedirectUser(null);
          }
          return result;
        }
        async reloadAndSetCurrentUserOrClear(user) {
          try {
            await _reloadWithoutSaving(user);
          } catch (e) {
            if (e.code !== `auth/${"network-request-failed"}`) {
              return this.directlySetCurrentUser(null);
            }
          }
          return this.directlySetCurrentUser(user);
        }
        useDeviceLanguage() {
          this.languageCode = _getUserLanguage();
        }
        async _delete() {
          this._deleted = true;
        }
        async updateCurrentUser(userExtern) {
          const user = userExtern ? getModularInstance(userExtern) : null;
          if (user) {
            _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
          }
          return this._updateCurrentUser(user && user._clone(this));
        }
        async _updateCurrentUser(user) {
          if (this._deleted) {
            return;
          }
          if (user) {
            _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
          }
          return this.queue(async () => {
            await this.directlySetCurrentUser(user);
            this.notifyAuthListeners();
          });
        }
        async signOut() {
          if (this.redirectPersistenceManager || this._popupRedirectResolver) {
            await this._setRedirectUser(null);
          }
          return this._updateCurrentUser(null);
        }
        setPersistence(persistence) {
          return this.queue(async () => {
            await this.assertedPersistence.setPersistence(_getInstance(persistence));
          });
        }
        setRecaptchaConfig(config) {
          this._recaptchaConfig = config;
        }
        _getPersistence() {
          return this.assertedPersistence.persistence.type;
        }
        _updateErrorMap(errorMap) {
          this._errorFactory = new ErrorFactory2("auth", "Firebase", errorMap());
        }
        onAuthStateChanged(nextOrObserver, error, completed) {
          return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
        }
        onIdTokenChanged(nextOrObserver, error, completed) {
          return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
        }
        toJSON() {
          var _a;
          return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
          };
        }
        async _setRedirectUser(user, popupRedirectResolver) {
          const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
          return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
        }
        async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
          if (!this.redirectPersistenceManager) {
            const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
            _assert(resolver, this, "argument-error");
            this.redirectPersistenceManager = await PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser");
            this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
          }
          return this.redirectPersistenceManager;
        }
        async _redirectUserForId(id) {
          var _a, _b;
          if (this._isInitialized) {
            await this.queue(async () => {
            });
          }
          if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id) {
            return this._currentUser;
          }
          if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id) {
            return this.redirectUser;
          }
          return null;
        }
        async _persistUserIfCurrent(user) {
          if (user === this.currentUser) {
            return this.queue(async () => this.directlySetCurrentUser(user));
          }
        }
        _notifyListenersIfCurrent(user) {
          if (user === this.currentUser) {
            this.notifyAuthListeners();
          }
        }
        _key() {
          return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
        }
        _startProactiveRefresh() {
          this.isProactiveRefreshEnabled = true;
          if (this.currentUser) {
            this._currentUser._startProactiveRefresh();
          }
        }
        _stopProactiveRefresh() {
          this.isProactiveRefreshEnabled = false;
          if (this.currentUser) {
            this._currentUser._stopProactiveRefresh();
          }
        }
        get _currentUser() {
          return this.currentUser;
        }
        notifyAuthListeners() {
          var _a, _b;
          if (!this._isInitialized) {
            return;
          }
          this.idTokenSubscription.next(this.currentUser);
          const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
          if (this.lastNotifiedUid !== currentUid) {
            this.lastNotifiedUid = currentUid;
            this.authStateSubscription.next(this.currentUser);
          }
        }
        registerStateListener(subscription, nextOrObserver, error, completed) {
          if (this._deleted) {
            return () => {
            };
          }
          const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
          const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
          _assert(promise, this, "internal-error");
          promise.then(() => cb(this.currentUser));
          if (typeof nextOrObserver === "function") {
            return subscription.addObserver(nextOrObserver, error, completed);
          } else {
            return subscription.addObserver(nextOrObserver);
          }
        }
        async directlySetCurrentUser(user) {
          if (this.currentUser && this.currentUser !== user) {
            this._currentUser._stopProactiveRefresh();
            if (user && this.isProactiveRefreshEnabled) {
              user._startProactiveRefresh();
            }
          }
          this.currentUser = user;
          if (user) {
            await this.assertedPersistence.setCurrentUser(user);
          } else {
            await this.assertedPersistence.removeCurrentUser();
          }
        }
        queue(action) {
          this.operations = this.operations.then(action, action);
          return this.operations;
        }
        get assertedPersistence() {
          _assert(this.persistenceManager, this, "internal-error");
          return this.persistenceManager;
        }
        _logFramework(framework) {
          if (!framework || this.frameworks.includes(framework)) {
            return;
          }
          this.frameworks.push(framework);
          this.frameworks.sort();
          this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
        }
        _getFrameworks() {
          return this.frameworks;
        }
        async _getAdditionalHeaders() {
          const headers = {
            ["X-Client-Version"]: this.clientVersion
          };
          if (this.app.options.appId) {
            headers["X-Firebase-gmpid"] = this.app.options.appId;
          }
          return headers;
        }
      };
      Subscription = class {
        constructor(auth) {
          this.auth = auth;
          this.observer = null;
          this.addObserver = createSubscribe((observer) => this.observer = observer);
        }
        get next() {
          _assert(this.observer, this.auth, "internal-error");
          return this.observer.next.bind(this.observer);
        }
      };
      AuthCredential = class {
        constructor(providerId, signInMethod) {
          this.providerId = providerId;
          this.signInMethod = signInMethod;
        }
        toJSON() {
          return debugFail("not implemented");
        }
        _getIdTokenResponse(_auth) {
          return debugFail("not implemented");
        }
        _linkToIdToken(_auth, _idToken) {
          return debugFail("not implemented");
        }
        _getReauthenticationResolver(_auth) {
          return debugFail("not implemented");
        }
      };
      RECAPTCHA_ENTERPRISE_URL = "https://www.google.com/recaptcha/enterprise.js?render=";
      RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
      RecaptchaEnterpriseVerifier = class {
        constructor(authExtern) {
          this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
          this.auth = _castAuth(authExtern);
        }
        async verify(action = "verify", forceRefresh = false) {
          async function retrieveSiteKey(auth) {
            if (!forceRefresh) {
              if (auth.tenantId == null && RecaptchaEnterpriseVerifier.agentSiteKey != null) {
                return RecaptchaEnterpriseVerifier.agentSiteKey;
              }
              if (auth.tenantId != null && RecaptchaEnterpriseVerifier.agentSiteKey !== void 0) {
                return RecaptchaEnterpriseVerifier.siteKeys[auth.tenantId];
              }
            }
            return new Promise(async (resolve, reject) => {
              getRecaptchaConfig(auth, {
                clientType: "CLIENT_TYPE_WEB",
                version: "RECAPTCHA_ENTERPRISE"
              }).then((response) => {
                if (response.recaptchaKey === void 0) {
                  reject(new Error("recaptchaKey undefined"));
                } else {
                  const siteKey = response.recaptchaKey.split("/")[3];
                  if (auth.tenantId == null) {
                    RecaptchaEnterpriseVerifier.agentSiteKey = siteKey;
                  } else {
                    RecaptchaEnterpriseVerifier.siteKeys[auth.tenantId] = siteKey;
                  }
                  return resolve(siteKey);
                }
              }).catch((error) => {
                reject(error);
              });
            });
          }
          function retrieveRecaptchaToken(siteKey, resolve, reject) {
            const grecaptcha = window.grecaptcha;
            if (isEnterprise(grecaptcha)) {
              grecaptcha.enterprise.ready(() => {
                try {
                  grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
                    resolve(token);
                  }).catch((error) => {
                    reject(error);
                  });
                } catch (error) {
                  reject(error);
                }
              });
            } else {
              reject(Error("No reCAPTCHA enterprise script loaded."));
            }
          }
          return new Promise((resolve, reject) => {
            retrieveSiteKey(this.auth).then((siteKey) => {
              if (!forceRefresh && isEnterprise(window.grecaptcha)) {
                retrieveRecaptchaToken(siteKey, resolve, reject);
              } else {
                _loadJS(RECAPTCHA_ENTERPRISE_URL + siteKey).then(() => {
                  retrieveRecaptchaToken(siteKey, resolve, reject);
                }).catch((error) => {
                  reject(error);
                });
              }
            }).catch((error) => {
              reject(error);
            });
          });
        }
      };
      EmailAuthCredential = class extends AuthCredential {
        constructor(_email, _password, signInMethod, _tenantId = null) {
          super("password", signInMethod);
          this._email = _email;
          this._password = _password;
          this._tenantId = _tenantId;
        }
        static _fromEmailAndPassword(email, password) {
          return new EmailAuthCredential(email, password, "password");
        }
        static _fromEmailAndCode(email, oobCode, tenantId = null) {
          return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
        }
        toJSON() {
          return {
            email: this._email,
            password: this._password,
            signInMethod: this.signInMethod,
            tenantId: this._tenantId
          };
        }
        static fromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
            if (obj.signInMethod === "password") {
              return this._fromEmailAndPassword(obj.email, obj.password);
            } else if (obj.signInMethod === "emailLink") {
              return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
            }
          }
          return null;
        }
        async _getIdTokenResponse(auth) {
          var _a;
          switch (this.signInMethod) {
            case "password":
              const request = {
                returnSecureToken: true,
                email: this._email,
                password: this._password
              };
              if ((_a = auth._recaptchaConfig) === null || _a === void 0 ? void 0 : _a.emailPasswordEnabled) {
                const requestWithRecaptcha = await injectRecaptchaFields(auth, request, "signInWithPassword");
                return signInWithPassword(auth, requestWithRecaptcha);
              } else {
                return signInWithPassword(auth, request).catch(async (error) => {
                  if (error.code === `auth/${"missing-recaptcha-token"}`) {
                    console.log("Sign in with email password is protected by reCAPTCHA for this project. Automatically triggers reCAPTCHA flow and restarts the sign in flow.");
                    const requestWithRecaptcha = await injectRecaptchaFields(auth, request, "signInWithPassword");
                    return signInWithPassword(auth, requestWithRecaptcha);
                  } else {
                    return Promise.reject(error);
                  }
                });
              }
            case "emailLink":
              return signInWithEmailLink$1(auth, {
                email: this._email,
                oobCode: this._password
              });
            default:
              _fail(auth, "internal-error");
          }
        }
        async _linkToIdToken(auth, idToken) {
          switch (this.signInMethod) {
            case "password":
              return updateEmailPassword(auth, {
                idToken,
                returnSecureToken: true,
                email: this._email,
                password: this._password
              });
            case "emailLink":
              return signInWithEmailLinkForLinking(auth, {
                idToken,
                email: this._email,
                oobCode: this._password
              });
            default:
              _fail(auth, "internal-error");
          }
        }
        _getReauthenticationResolver(auth) {
          return this._getIdTokenResponse(auth);
        }
      };
      IDP_REQUEST_URI$1 = "http://localhost";
      OAuthCredential = class extends AuthCredential {
        constructor() {
          super(...arguments);
          this.pendingToken = null;
        }
        static _fromParams(params) {
          const cred = new OAuthCredential(params.providerId, params.signInMethod);
          if (params.idToken || params.accessToken) {
            if (params.idToken) {
              cred.idToken = params.idToken;
            }
            if (params.accessToken) {
              cred.accessToken = params.accessToken;
            }
            if (params.nonce && !params.pendingToken) {
              cred.nonce = params.nonce;
            }
            if (params.pendingToken) {
              cred.pendingToken = params.pendingToken;
            }
          } else if (params.oauthToken && params.oauthTokenSecret) {
            cred.accessToken = params.oauthToken;
            cred.secret = params.oauthTokenSecret;
          } else {
            _fail("argument-error");
          }
          return cred;
        }
        toJSON() {
          return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
          };
        }
        static fromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
          if (!providerId || !signInMethod) {
            return null;
          }
          const cred = new OAuthCredential(providerId, signInMethod);
          cred.idToken = rest.idToken || void 0;
          cred.accessToken = rest.accessToken || void 0;
          cred.secret = rest.secret;
          cred.nonce = rest.nonce;
          cred.pendingToken = rest.pendingToken || null;
          return cred;
        }
        _getIdTokenResponse(auth) {
          const request = this.buildRequest();
          return signInWithIdp(auth, request);
        }
        _linkToIdToken(auth, idToken) {
          const request = this.buildRequest();
          request.idToken = idToken;
          return signInWithIdp(auth, request);
        }
        _getReauthenticationResolver(auth) {
          const request = this.buildRequest();
          request.autoCreate = false;
          return signInWithIdp(auth, request);
        }
        buildRequest() {
          const request = {
            requestUri: IDP_REQUEST_URI$1,
            returnSecureToken: true
          };
          if (this.pendingToken) {
            request.pendingToken = this.pendingToken;
          } else {
            const postBody = {};
            if (this.idToken) {
              postBody["id_token"] = this.idToken;
            }
            if (this.accessToken) {
              postBody["access_token"] = this.accessToken;
            }
            if (this.secret) {
              postBody["oauth_token_secret"] = this.secret;
            }
            postBody["providerId"] = this.providerId;
            if (this.nonce && !this.pendingToken) {
              postBody["nonce"] = this.nonce;
            }
            request.postBody = querystring(postBody);
          }
          return request;
        }
      };
      VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
        ["USER_NOT_FOUND"]: "user-not-found"
      };
      PhoneAuthCredential = class extends AuthCredential {
        constructor(params) {
          super("phone", "phone");
          this.params = params;
        }
        static _fromVerification(verificationId, verificationCode) {
          return new PhoneAuthCredential({ verificationId, verificationCode });
        }
        static _fromTokenResponse(phoneNumber, temporaryProof) {
          return new PhoneAuthCredential({ phoneNumber, temporaryProof });
        }
        _getIdTokenResponse(auth) {
          return signInWithPhoneNumber$1(auth, this._makeVerificationRequest());
        }
        _linkToIdToken(auth, idToken) {
          return linkWithPhoneNumber$1(auth, Object.assign({ idToken }, this._makeVerificationRequest()));
        }
        _getReauthenticationResolver(auth) {
          return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
        }
        _makeVerificationRequest() {
          const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
          if (temporaryProof && phoneNumber) {
            return { temporaryProof, phoneNumber };
          }
          return {
            sessionInfo: verificationId,
            code: verificationCode
          };
        }
        toJSON() {
          const obj = {
            providerId: this.providerId
          };
          if (this.params.phoneNumber) {
            obj.phoneNumber = this.params.phoneNumber;
          }
          if (this.params.temporaryProof) {
            obj.temporaryProof = this.params.temporaryProof;
          }
          if (this.params.verificationCode) {
            obj.verificationCode = this.params.verificationCode;
          }
          if (this.params.verificationId) {
            obj.verificationId = this.params.verificationId;
          }
          return obj;
        }
        static fromJSON(json) {
          if (typeof json === "string") {
            json = JSON.parse(json);
          }
          const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
          if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
            return null;
          }
          return new PhoneAuthCredential({
            verificationId,
            verificationCode,
            phoneNumber,
            temporaryProof
          });
        }
      };
      ActionCodeURL = class {
        constructor(actionLink) {
          var _a, _b, _c, _d, _e, _f;
          const searchParams = querystringDecode(extractQuerystring(actionLink));
          const apiKey = (_a = searchParams["apiKey"]) !== null && _a !== void 0 ? _a : null;
          const code = (_b = searchParams["oobCode"]) !== null && _b !== void 0 ? _b : null;
          const operation = parseMode((_c = searchParams["mode"]) !== null && _c !== void 0 ? _c : null);
          _assert(apiKey && code && operation, "argument-error");
          this.apiKey = apiKey;
          this.operation = operation;
          this.code = code;
          this.continueUrl = (_d = searchParams["continueUrl"]) !== null && _d !== void 0 ? _d : null;
          this.languageCode = (_e = searchParams["languageCode"]) !== null && _e !== void 0 ? _e : null;
          this.tenantId = (_f = searchParams["tenantId"]) !== null && _f !== void 0 ? _f : null;
        }
        static parseLink(link) {
          const actionLink = parseDeepLink(link);
          try {
            return new ActionCodeURL(actionLink);
          } catch (_a) {
            return null;
          }
        }
      };
      EmailAuthProvider = class {
        constructor() {
          this.providerId = EmailAuthProvider.PROVIDER_ID;
        }
        static credential(email, password) {
          return EmailAuthCredential._fromEmailAndPassword(email, password);
        }
        static credentialWithLink(email, emailLink) {
          const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
          _assert(actionCodeUrl, "argument-error");
          return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
        }
      };
      EmailAuthProvider.PROVIDER_ID = "password";
      EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
      EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
      FederatedAuthProvider = class {
        constructor(providerId) {
          this.providerId = providerId;
          this.defaultLanguageCode = null;
          this.customParameters = {};
        }
        setDefaultLanguage(languageCode) {
          this.defaultLanguageCode = languageCode;
        }
        setCustomParameters(customOAuthParameters) {
          this.customParameters = customOAuthParameters;
          return this;
        }
        getCustomParameters() {
          return this.customParameters;
        }
      };
      BaseOAuthProvider = class extends FederatedAuthProvider {
        constructor() {
          super(...arguments);
          this.scopes = [];
        }
        addScope(scope) {
          if (!this.scopes.includes(scope)) {
            this.scopes.push(scope);
          }
          return this;
        }
        getScopes() {
          return [...this.scopes];
        }
      };
      OAuthProvider = class extends BaseOAuthProvider {
        static credentialFromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          _assert("providerId" in obj && "signInMethod" in obj, "argument-error");
          return OAuthCredential._fromParams(obj);
        }
        credential(params) {
          return this._credential(Object.assign(Object.assign({}, params), { nonce: params.rawNonce }));
        }
        _credential(params) {
          _assert(params.idToken || params.accessToken, "argument-error");
          return OAuthCredential._fromParams(Object.assign(Object.assign({}, params), { providerId: this.providerId, signInMethod: this.providerId }));
        }
        static credentialFromResult(userCredential) {
          return OAuthProvider.oauthCredentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return OAuthProvider.oauthCredentialFromTaggedObject(error.customData || {});
        }
        static oauthCredentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { oauthIdToken, oauthAccessToken, oauthTokenSecret, pendingToken, nonce, providerId } = tokenResponse;
          if (!oauthAccessToken && !oauthTokenSecret && !oauthIdToken && !pendingToken) {
            return null;
          }
          if (!providerId) {
            return null;
          }
          try {
            return new OAuthProvider(providerId)._credential({
              idToken: oauthIdToken,
              accessToken: oauthAccessToken,
              nonce,
              pendingToken
            });
          } catch (e) {
            return null;
          }
        }
      };
      FacebookAuthProvider = class extends BaseOAuthProvider {
        constructor() {
          super("facebook.com");
        }
        static credential(accessToken) {
          return OAuthCredential._fromParams({
            providerId: FacebookAuthProvider.PROVIDER_ID,
            signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
            accessToken
          });
        }
        static credentialFromResult(userCredential) {
          return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
          }
          if (!tokenResponse.oauthAccessToken) {
            return null;
          }
          try {
            return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
          } catch (_a) {
            return null;
          }
        }
      };
      FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
      FacebookAuthProvider.PROVIDER_ID = "facebook.com";
      GoogleAuthProvider = class extends BaseOAuthProvider {
        constructor() {
          super("google.com");
          this.addScope("profile");
        }
        static credential(idToken, accessToken) {
          return OAuthCredential._fromParams({
            providerId: GoogleAuthProvider.PROVIDER_ID,
            signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
            idToken,
            accessToken
          });
        }
        static credentialFromResult(userCredential) {
          return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { oauthIdToken, oauthAccessToken } = tokenResponse;
          if (!oauthIdToken && !oauthAccessToken) {
            return null;
          }
          try {
            return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
          } catch (_a) {
            return null;
          }
        }
      };
      GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
      GoogleAuthProvider.PROVIDER_ID = "google.com";
      GithubAuthProvider = class extends BaseOAuthProvider {
        constructor() {
          super("github.com");
        }
        static credential(accessToken) {
          return OAuthCredential._fromParams({
            providerId: GithubAuthProvider.PROVIDER_ID,
            signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
            accessToken
          });
        }
        static credentialFromResult(userCredential) {
          return GithubAuthProvider.credentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
          }
          if (!tokenResponse.oauthAccessToken) {
            return null;
          }
          try {
            return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
          } catch (_a) {
            return null;
          }
        }
      };
      GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
      GithubAuthProvider.PROVIDER_ID = "github.com";
      IDP_REQUEST_URI = "http://localhost";
      SAMLAuthCredential = class extends AuthCredential {
        constructor(providerId, pendingToken) {
          super(providerId, providerId);
          this.pendingToken = pendingToken;
        }
        _getIdTokenResponse(auth) {
          const request = this.buildRequest();
          return signInWithIdp(auth, request);
        }
        _linkToIdToken(auth, idToken) {
          const request = this.buildRequest();
          request.idToken = idToken;
          return signInWithIdp(auth, request);
        }
        _getReauthenticationResolver(auth) {
          const request = this.buildRequest();
          request.autoCreate = false;
          return signInWithIdp(auth, request);
        }
        toJSON() {
          return {
            signInMethod: this.signInMethod,
            providerId: this.providerId,
            pendingToken: this.pendingToken
          };
        }
        static fromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          const { providerId, signInMethod, pendingToken } = obj;
          if (!providerId || !signInMethod || !pendingToken || providerId !== signInMethod) {
            return null;
          }
          return new SAMLAuthCredential(providerId, pendingToken);
        }
        static _create(providerId, pendingToken) {
          return new SAMLAuthCredential(providerId, pendingToken);
        }
        buildRequest() {
          return {
            requestUri: IDP_REQUEST_URI,
            returnSecureToken: true,
            pendingToken: this.pendingToken
          };
        }
      };
      SAML_PROVIDER_PREFIX = "saml.";
      SAMLAuthProvider = class extends FederatedAuthProvider {
        constructor(providerId) {
          _assert(providerId.startsWith(SAML_PROVIDER_PREFIX), "argument-error");
          super(providerId);
        }
        static credentialFromResult(userCredential) {
          return SAMLAuthProvider.samlCredentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return SAMLAuthProvider.samlCredentialFromTaggedObject(error.customData || {});
        }
        static credentialFromJSON(json) {
          const credential = SAMLAuthCredential.fromJSON(json);
          _assert(credential, "argument-error");
          return credential;
        }
        static samlCredentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { pendingToken, providerId } = tokenResponse;
          if (!pendingToken || !providerId) {
            return null;
          }
          try {
            return SAMLAuthCredential._create(providerId, pendingToken);
          } catch (e) {
            return null;
          }
        }
      };
      TwitterAuthProvider = class extends BaseOAuthProvider {
        constructor() {
          super("twitter.com");
        }
        static credential(token, secret) {
          return OAuthCredential._fromParams({
            providerId: TwitterAuthProvider.PROVIDER_ID,
            signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
            oauthToken: token,
            oauthTokenSecret: secret
          });
        }
        static credentialFromResult(userCredential) {
          return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
        }
        static credentialFromError(error) {
          return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
          if (!oauthAccessToken || !oauthTokenSecret) {
            return null;
          }
          try {
            return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
          } catch (_a) {
            return null;
          }
        }
      };
      TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
      TwitterAuthProvider.PROVIDER_ID = "twitter.com";
      UserCredentialImpl = class {
        constructor(params) {
          this.user = params.user;
          this.providerId = params.providerId;
          this._tokenResponse = params._tokenResponse;
          this.operationType = params.operationType;
        }
        static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
          const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
          const providerId = providerIdForResponse(idTokenResponse);
          const userCred = new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: idTokenResponse,
            operationType
          });
          return userCred;
        }
        static async _forOperation(user, operationType, response) {
          await user._updateTokensIfNecessary(response, true);
          const providerId = providerIdForResponse(response);
          return new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: response,
            operationType
          });
        }
      };
      MultiFactorError = class extends FirebaseError2 {
        constructor(auth, error, operationType, user) {
          var _a;
          super(error.code, error.message);
          this.operationType = operationType;
          this.user = user;
          Object.setPrototypeOf(this, MultiFactorError.prototype);
          this.customData = {
            appName: auth.name,
            tenantId: (_a = auth.tenantId) !== null && _a !== void 0 ? _a : void 0,
            _serverResponse: error.customData._serverResponse,
            operationType
          };
        }
        static _fromErrorAndOperation(auth, error, operationType, user) {
          return new MultiFactorError(auth, error, operationType, user);
        }
      };
      MultiFactorInfoImpl = class {
        constructor(factorId, response) {
          this.factorId = factorId;
          this.uid = response.mfaEnrollmentId;
          this.enrollmentTime = new Date(response.enrolledAt).toUTCString();
          this.displayName = response.displayName;
        }
        static _fromServerResponse(auth, enrollment) {
          if ("phoneInfo" in enrollment) {
            return PhoneMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
          }
          return _fail(auth, "internal-error");
        }
      };
      PhoneMultiFactorInfoImpl = class extends MultiFactorInfoImpl {
        constructor(response) {
          super("phone", response);
          this.phoneNumber = response.phoneInfo;
        }
        static _fromServerResponse(_auth, enrollment) {
          return new PhoneMultiFactorInfoImpl(enrollment);
        }
      };
      GenericAdditionalUserInfo = class {
        constructor(isNewUser, providerId, profile = {}) {
          this.isNewUser = isNewUser;
          this.providerId = providerId;
          this.profile = profile;
        }
      };
      FederatedAdditionalUserInfoWithUsername = class extends GenericAdditionalUserInfo {
        constructor(isNewUser, providerId, profile, username) {
          super(isNewUser, providerId, profile);
          this.username = username;
        }
      };
      FacebookAdditionalUserInfo = class extends GenericAdditionalUserInfo {
        constructor(isNewUser, profile) {
          super(isNewUser, "facebook.com", profile);
        }
      };
      GithubAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
        constructor(isNewUser, profile) {
          super(isNewUser, "github.com", profile, typeof (profile === null || profile === void 0 ? void 0 : profile.login) === "string" ? profile === null || profile === void 0 ? void 0 : profile.login : null);
        }
      };
      GoogleAdditionalUserInfo = class extends GenericAdditionalUserInfo {
        constructor(isNewUser, profile) {
          super(isNewUser, "google.com", profile);
        }
      };
      TwitterAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
        constructor(isNewUser, profile, screenName) {
          super(isNewUser, "twitter.com", profile, screenName);
        }
      };
      MultiFactorSessionImpl = class {
        constructor(type, credential) {
          this.type = type;
          this.credential = credential;
        }
        static _fromIdtoken(idToken) {
          return new MultiFactorSessionImpl("enroll", idToken);
        }
        static _fromMfaPendingCredential(mfaPendingCredential) {
          return new MultiFactorSessionImpl("signin", mfaPendingCredential);
        }
        toJSON() {
          const key = this.type === "enroll" ? "idToken" : "pendingCredential";
          return {
            multiFactorSession: {
              [key]: this.credential
            }
          };
        }
        static fromJSON(obj) {
          var _a, _b;
          if (obj === null || obj === void 0 ? void 0 : obj.multiFactorSession) {
            if ((_a = obj.multiFactorSession) === null || _a === void 0 ? void 0 : _a.pendingCredential) {
              return MultiFactorSessionImpl._fromMfaPendingCredential(obj.multiFactorSession.pendingCredential);
            } else if ((_b = obj.multiFactorSession) === null || _b === void 0 ? void 0 : _b.idToken) {
              return MultiFactorSessionImpl._fromIdtoken(obj.multiFactorSession.idToken);
            }
          }
          return null;
        }
      };
      MultiFactorResolverImpl = class {
        constructor(session, hints, signInResolver) {
          this.session = session;
          this.hints = hints;
          this.signInResolver = signInResolver;
        }
        static _fromError(authExtern, error) {
          const auth = _castAuth(authExtern);
          const serverResponse = error.customData._serverResponse;
          const hints = (serverResponse.mfaInfo || []).map((enrollment) => MultiFactorInfoImpl._fromServerResponse(auth, enrollment));
          _assert(serverResponse.mfaPendingCredential, auth, "internal-error");
          const session = MultiFactorSessionImpl._fromMfaPendingCredential(serverResponse.mfaPendingCredential);
          return new MultiFactorResolverImpl(session, hints, async (assertion) => {
            const mfaResponse = await assertion._process(auth, session);
            delete serverResponse.mfaInfo;
            delete serverResponse.mfaPendingCredential;
            const idTokenResponse = Object.assign(Object.assign({}, serverResponse), { idToken: mfaResponse.idToken, refreshToken: mfaResponse.refreshToken });
            switch (error.operationType) {
              case "signIn":
                const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, error.operationType, idTokenResponse);
                await auth._updateCurrentUser(userCredential.user);
                return userCredential;
              case "reauthenticate":
                _assert(error.user, auth, "internal-error");
                return UserCredentialImpl._forOperation(error.user, error.operationType, idTokenResponse);
              default:
                _fail(auth, "internal-error");
            }
          });
        }
        async resolveSignIn(assertionExtern) {
          const assertion = assertionExtern;
          return this.signInResolver(assertion);
        }
      };
      MultiFactorUserImpl = class {
        constructor(user) {
          this.user = user;
          this.enrolledFactors = [];
          user._onReload((userInfo) => {
            if (userInfo.mfaInfo) {
              this.enrolledFactors = userInfo.mfaInfo.map((enrollment) => MultiFactorInfoImpl._fromServerResponse(user.auth, enrollment));
            }
          });
        }
        static _fromUser(user) {
          return new MultiFactorUserImpl(user);
        }
        async getSession() {
          return MultiFactorSessionImpl._fromIdtoken(await this.user.getIdToken());
        }
        async enroll(assertionExtern, displayName) {
          const assertion = assertionExtern;
          const session = await this.getSession();
          const finalizeMfaResponse = await _logoutIfInvalidated(this.user, assertion._process(this.user.auth, session, displayName));
          await this.user._updateTokensIfNecessary(finalizeMfaResponse);
          return this.user.reload();
        }
        async unenroll(infoOrUid) {
          const mfaEnrollmentId = typeof infoOrUid === "string" ? infoOrUid : infoOrUid.uid;
          const idToken = await this.user.getIdToken();
          const idTokenResponse = await _logoutIfInvalidated(this.user, withdrawMfa(this.user.auth, {
            idToken,
            mfaEnrollmentId
          }));
          this.enrolledFactors = this.enrolledFactors.filter(({ uid }) => uid !== mfaEnrollmentId);
          await this.user._updateTokensIfNecessary(idTokenResponse);
          try {
            await this.user.reload();
          } catch (e) {
            if (e.code !== `auth/${"user-token-expired"}`) {
              throw e;
            }
          }
        }
      };
      multiFactorUserCache = new WeakMap();
      STORAGE_AVAILABLE_KEY = "__sak";
      BrowserPersistenceClass = class {
        constructor(storageRetriever, type) {
          this.storageRetriever = storageRetriever;
          this.type = type;
        }
        _isAvailable() {
          try {
            if (!this.storage) {
              return Promise.resolve(false);
            }
            this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
            this.storage.removeItem(STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
          } catch (_a) {
            return Promise.resolve(false);
          }
        }
        _set(key, value) {
          this.storage.setItem(key, JSON.stringify(value));
          return Promise.resolve();
        }
        _get(key) {
          const json = this.storage.getItem(key);
          return Promise.resolve(json ? JSON.parse(json) : null);
        }
        _remove(key) {
          this.storage.removeItem(key);
          return Promise.resolve();
        }
        get storage() {
          return this.storageRetriever();
        }
      };
      _POLLING_INTERVAL_MS$1 = 1e3;
      IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
      BrowserLocalPersistence = class extends BrowserPersistenceClass {
        constructor() {
          super(() => window.localStorage, "LOCAL");
          this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
          this.listeners = {};
          this.localCache = {};
          this.pollTimer = null;
          this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
          this.fallbackToPolling = _isMobileBrowser();
          this._shouldAllowMigration = true;
        }
        forAllChangedKeys(cb) {
          for (const key of Object.keys(this.listeners)) {
            const newValue = this.storage.getItem(key);
            const oldValue = this.localCache[key];
            if (newValue !== oldValue) {
              cb(key, oldValue, newValue);
            }
          }
        }
        onStorageEvent(event, poll = false) {
          if (!event.key) {
            this.forAllChangedKeys((key2, _oldValue, newValue) => {
              this.notifyListeners(key2, newValue);
            });
            return;
          }
          const key = event.key;
          if (poll) {
            this.detachListener();
          } else {
            this.stopPolling();
          }
          if (this.safariLocalStorageNotSynced) {
            const storedValue2 = this.storage.getItem(key);
            if (event.newValue !== storedValue2) {
              if (event.newValue !== null) {
                this.storage.setItem(key, event.newValue);
              } else {
                this.storage.removeItem(key);
              }
            } else if (this.localCache[key] === event.newValue && !poll) {
              return;
            }
          }
          const triggerListeners = () => {
            const storedValue2 = this.storage.getItem(key);
            if (!poll && this.localCache[key] === storedValue2) {
              return;
            }
            this.notifyListeners(key, storedValue2);
          };
          const storedValue = this.storage.getItem(key);
          if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
            setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
          } else {
            triggerListeners();
          }
        }
        notifyListeners(key, value) {
          this.localCache[key] = value;
          const listeners = this.listeners[key];
          if (listeners) {
            for (const listener of Array.from(listeners)) {
              listener(value ? JSON.parse(value) : value);
            }
          }
        }
        startPolling() {
          this.stopPolling();
          this.pollTimer = setInterval(() => {
            this.forAllChangedKeys((key, oldValue, newValue) => {
              this.onStorageEvent(new StorageEvent("storage", {
                key,
                oldValue,
                newValue
              }), true);
            });
          }, _POLLING_INTERVAL_MS$1);
        }
        stopPolling() {
          if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
          }
        }
        attachListener() {
          window.addEventListener("storage", this.boundEventHandler);
        }
        detachListener() {
          window.removeEventListener("storage", this.boundEventHandler);
        }
        _addListener(key, listener) {
          if (Object.keys(this.listeners).length === 0) {
            if (this.fallbackToPolling) {
              this.startPolling();
            } else {
              this.attachListener();
            }
          }
          if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            this.localCache[key] = this.storage.getItem(key);
          }
          this.listeners[key].add(listener);
        }
        _removeListener(key, listener) {
          if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
              delete this.listeners[key];
            }
          }
          if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
          }
        }
        async _set(key, value) {
          await super._set(key, value);
          this.localCache[key] = JSON.stringify(value);
        }
        async _get(key) {
          const value = await super._get(key);
          this.localCache[key] = JSON.stringify(value);
          return value;
        }
        async _remove(key) {
          await super._remove(key);
          delete this.localCache[key];
        }
      };
      BrowserLocalPersistence.type = "LOCAL";
      browserLocalPersistence = BrowserLocalPersistence;
      BrowserSessionPersistence = class extends BrowserPersistenceClass {
        constructor() {
          super(() => window.sessionStorage, "SESSION");
        }
        _addListener(_key, _listener) {
          return;
        }
        _removeListener(_key, _listener) {
          return;
        }
      };
      BrowserSessionPersistence.type = "SESSION";
      browserSessionPersistence = BrowserSessionPersistence;
      Receiver = class {
        constructor(eventTarget) {
          this.eventTarget = eventTarget;
          this.handlersMap = {};
          this.boundEventHandler = this.handleEvent.bind(this);
        }
        static _getInstance(eventTarget) {
          const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
          if (existingInstance) {
            return existingInstance;
          }
          const newInstance = new Receiver(eventTarget);
          this.receivers.push(newInstance);
          return newInstance;
        }
        isListeningto(eventTarget) {
          return this.eventTarget === eventTarget;
        }
        async handleEvent(event) {
          const messageEvent = event;
          const { eventId, eventType, data } = messageEvent.data;
          const handlers = this.handlersMap[eventType];
          if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
            return;
          }
          messageEvent.ports[0].postMessage({
            status: "ack",
            eventId,
            eventType
          });
          const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
          const response = await _allSettled(promises);
          messageEvent.ports[0].postMessage({
            status: "done",
            eventId,
            eventType,
            response
          });
        }
        _subscribe(eventType, eventHandler) {
          if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.addEventListener("message", this.boundEventHandler);
          }
          if (!this.handlersMap[eventType]) {
            this.handlersMap[eventType] = new Set();
          }
          this.handlersMap[eventType].add(eventHandler);
        }
        _unsubscribe(eventType, eventHandler) {
          if (this.handlersMap[eventType] && eventHandler) {
            this.handlersMap[eventType].delete(eventHandler);
          }
          if (!eventHandler || this.handlersMap[eventType].size === 0) {
            delete this.handlersMap[eventType];
          }
          if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.removeEventListener("message", this.boundEventHandler);
          }
        }
      };
      Receiver.receivers = [];
      Sender = class {
        constructor(target) {
          this.target = target;
          this.handlers = new Set();
        }
        removeMessageHandler(handler) {
          if (handler.messageChannel) {
            handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
            handler.messageChannel.port1.close();
          }
          this.handlers.delete(handler);
        }
        async _send(eventType, data, timeout = 50) {
          const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
          if (!messageChannel) {
            throw new Error("connection_unavailable");
          }
          let completionTimer;
          let handler;
          return new Promise((resolve, reject) => {
            const eventId = _generateEventId("", 20);
            messageChannel.port1.start();
            const ackTimer = setTimeout(() => {
              reject(new Error("unsupported_event"));
            }, timeout);
            handler = {
              messageChannel,
              onMessage(event) {
                const messageEvent = event;
                if (messageEvent.data.eventId !== eventId) {
                  return;
                }
                switch (messageEvent.data.status) {
                  case "ack":
                    clearTimeout(ackTimer);
                    completionTimer = setTimeout(() => {
                      reject(new Error("timeout"));
                    }, 3e3);
                    break;
                  case "done":
                    clearTimeout(completionTimer);
                    resolve(messageEvent.data.response);
                    break;
                  default:
                    clearTimeout(ackTimer);
                    clearTimeout(completionTimer);
                    reject(new Error("invalid_response"));
                    break;
                }
              }
            };
            this.handlers.add(handler);
            messageChannel.port1.addEventListener("message", handler.onMessage);
            this.target.postMessage({
              eventType,
              eventId,
              data
            }, [messageChannel.port2]);
          }).finally(() => {
            if (handler) {
              this.removeMessageHandler(handler);
            }
          });
        }
      };
      DB_NAME2 = "firebaseLocalStorageDb";
      DB_VERSION2 = 1;
      DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
      DB_DATA_KEYPATH = "fbase_key";
      DBPromise = class {
        constructor(request) {
          this.request = request;
        }
        toPromise() {
          return new Promise((resolve, reject) => {
            this.request.addEventListener("success", () => {
              resolve(this.request.result);
            });
            this.request.addEventListener("error", () => {
              reject(this.request.error);
            });
          });
        }
      };
      _POLLING_INTERVAL_MS = 800;
      _TRANSACTION_RETRY_COUNT = 3;
      IndexedDBLocalPersistence = class {
        constructor() {
          this.type = "LOCAL";
          this._shouldAllowMigration = true;
          this.listeners = {};
          this.localCache = {};
          this.pollTimer = null;
          this.pendingWrites = 0;
          this.receiver = null;
          this.sender = null;
          this.serviceWorkerReceiverAvailable = false;
          this.activeServiceWorker = null;
          this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
          }, () => {
          });
        }
        async _openDb() {
          if (this.db) {
            return this.db;
          }
          this.db = await _openDatabase();
          return this.db;
        }
        async _withRetries(op) {
          let numAttempts = 0;
          while (true) {
            try {
              const db = await this._openDb();
              return await op(db);
            } catch (e) {
              if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
                throw e;
              }
              if (this.db) {
                this.db.close();
                this.db = void 0;
              }
            }
          }
        }
        async initializeServiceWorkerMessaging() {
          return _isWorker() ? this.initializeReceiver() : this.initializeSender();
        }
        async initializeReceiver() {
          this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
          this.receiver._subscribe("keyChanged", async (_origin, data) => {
            const keys = await this._poll();
            return {
              keyProcessed: keys.includes(data.key)
            };
          });
          this.receiver._subscribe("ping", async (_origin, _data) => {
            return ["keyChanged"];
          });
        }
        async initializeSender() {
          var _a, _b;
          this.activeServiceWorker = await _getActiveServiceWorker();
          if (!this.activeServiceWorker) {
            return;
          }
          this.sender = new Sender(this.activeServiceWorker);
          const results = await this.sender._send("ping", {}, 800);
          if (!results) {
            return;
          }
          if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes("keyChanged"))) {
            this.serviceWorkerReceiverAvailable = true;
          }
        }
        async notifyServiceWorker(key) {
          if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
            return;
          }
          try {
            await this.sender._send("keyChanged", { key }, this.serviceWorkerReceiverAvailable ? 800 : 50);
          } catch (_a) {
          }
        }
        async _isAvailable() {
          try {
            if (!indexedDB) {
              return false;
            }
            const db = await _openDatabase();
            await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
            await _deleteObject(db, STORAGE_AVAILABLE_KEY);
            return true;
          } catch (_a) {
          }
          return false;
        }
        async _withPendingWrite(write) {
          this.pendingWrites++;
          try {
            await write();
          } finally {
            this.pendingWrites--;
          }
        }
        async _set(key, value) {
          return this._withPendingWrite(async () => {
            await this._withRetries((db) => _putObject(db, key, value));
            this.localCache[key] = value;
            return this.notifyServiceWorker(key);
          });
        }
        async _get(key) {
          const obj = await this._withRetries((db) => getObject(db, key));
          this.localCache[key] = obj;
          return obj;
        }
        async _remove(key) {
          return this._withPendingWrite(async () => {
            await this._withRetries((db) => _deleteObject(db, key));
            delete this.localCache[key];
            return this.notifyServiceWorker(key);
          });
        }
        async _poll() {
          const result = await this._withRetries((db) => {
            const getAllRequest = getObjectStore(db, false).getAll();
            return new DBPromise(getAllRequest).toPromise();
          });
          if (!result) {
            return [];
          }
          if (this.pendingWrites !== 0) {
            return [];
          }
          const keys = [];
          const keysInResult = new Set();
          for (const { fbase_key: key, value } of result) {
            keysInResult.add(key);
            if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
              this.notifyListeners(key, value);
              keys.push(key);
            }
          }
          for (const localKey of Object.keys(this.localCache)) {
            if (this.localCache[localKey] && !keysInResult.has(localKey)) {
              this.notifyListeners(localKey, null);
              keys.push(localKey);
            }
          }
          return keys;
        }
        notifyListeners(key, newValue) {
          this.localCache[key] = newValue;
          const listeners = this.listeners[key];
          if (listeners) {
            for (const listener of Array.from(listeners)) {
              listener(newValue);
            }
          }
        }
        startPolling() {
          this.stopPolling();
          this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
        }
        stopPolling() {
          if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
          }
        }
        _addListener(key, listener) {
          if (Object.keys(this.listeners).length === 0) {
            this.startPolling();
          }
          if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            void this._get(key);
          }
          this.listeners[key].add(listener);
        }
        _removeListener(key, listener) {
          if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
              delete this.listeners[key];
            }
          }
          if (Object.keys(this.listeners).length === 0) {
            this.stopPolling();
          }
        }
      };
      IndexedDBLocalPersistence.type = "LOCAL";
      indexedDBLocalPersistence = IndexedDBLocalPersistence;
      _SOLVE_TIME_MS = 500;
      _EXPIRATION_TIME_MS = 6e4;
      _WIDGET_ID_START = 1e12;
      MockReCaptcha = class {
        constructor(auth) {
          this.auth = auth;
          this.counter = _WIDGET_ID_START;
          this._widgets = new Map();
        }
        render(container, parameters) {
          const id = this.counter;
          this._widgets.set(id, new MockWidget(container, this.auth.name, parameters || {}));
          this.counter++;
          return id;
        }
        reset(optWidgetId) {
          var _a;
          const id = optWidgetId || _WIDGET_ID_START;
          void ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.delete());
          this._widgets.delete(id);
        }
        getResponse(optWidgetId) {
          var _a;
          const id = optWidgetId || _WIDGET_ID_START;
          return ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.getResponse()) || "";
        }
        async execute(optWidgetId) {
          var _a;
          const id = optWidgetId || _WIDGET_ID_START;
          void ((_a = this._widgets.get(id)) === null || _a === void 0 ? void 0 : _a.execute());
          return "";
        }
      };
      MockWidget = class {
        constructor(containerOrId, appName, params) {
          this.params = params;
          this.timerId = null;
          this.deleted = false;
          this.responseToken = null;
          this.clickHandler = () => {
            this.execute();
          };
          const container = typeof containerOrId === "string" ? document.getElementById(containerOrId) : containerOrId;
          _assert(container, "argument-error", { appName });
          this.container = container;
          this.isVisible = this.params.size !== "invisible";
          if (this.isVisible) {
            this.execute();
          } else {
            this.container.addEventListener("click", this.clickHandler);
          }
        }
        getResponse() {
          this.checkIfDeleted();
          return this.responseToken;
        }
        delete() {
          this.checkIfDeleted();
          this.deleted = true;
          if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
          }
          this.container.removeEventListener("click", this.clickHandler);
        }
        execute() {
          this.checkIfDeleted();
          if (this.timerId) {
            return;
          }
          this.timerId = window.setTimeout(() => {
            this.responseToken = generateRandomAlphaNumericString(50);
            const { callback, "expired-callback": expiredCallback } = this.params;
            if (callback) {
              try {
                callback(this.responseToken);
              } catch (e) {
              }
            }
            this.timerId = window.setTimeout(() => {
              this.timerId = null;
              this.responseToken = null;
              if (expiredCallback) {
                try {
                  expiredCallback();
                } catch (e) {
                }
              }
              if (this.isVisible) {
                this.execute();
              }
            }, _EXPIRATION_TIME_MS);
          }, _SOLVE_TIME_MS);
        }
        checkIfDeleted() {
          if (this.deleted) {
            throw new Error("reCAPTCHA mock was already deleted!");
          }
        }
      };
      _JSLOAD_CALLBACK = _generateCallbackName("rcb");
      NETWORK_TIMEOUT_DELAY = new Delay(3e4, 6e4);
      RECAPTCHA_BASE = "https://www.google.com/recaptcha/api.js?";
      ReCaptchaLoaderImpl = class {
        constructor() {
          this.hostLanguage = "";
          this.counter = 0;
          this.librarySeparatelyLoaded = !!_window().grecaptcha;
        }
        load(auth, hl = "") {
          _assert(isHostLanguageValid(hl), auth, "argument-error");
          if (this.shouldResolveImmediately(hl) && isV2(_window().grecaptcha)) {
            return Promise.resolve(_window().grecaptcha);
          }
          return new Promise((resolve, reject) => {
            const networkTimeout = _window().setTimeout(() => {
              reject(_createError(auth, "network-request-failed"));
            }, NETWORK_TIMEOUT_DELAY.get());
            _window()[_JSLOAD_CALLBACK] = () => {
              _window().clearTimeout(networkTimeout);
              delete _window()[_JSLOAD_CALLBACK];
              const recaptcha = _window().grecaptcha;
              if (!recaptcha || !isV2(recaptcha)) {
                reject(_createError(auth, "internal-error"));
                return;
              }
              const render = recaptcha.render;
              recaptcha.render = (container, params) => {
                const widgetId = render(container, params);
                this.counter++;
                return widgetId;
              };
              this.hostLanguage = hl;
              resolve(recaptcha);
            };
            const url = `${RECAPTCHA_BASE}?${querystring({
              onload: _JSLOAD_CALLBACK,
              render: "explicit",
              hl
            })}`;
            _loadJS(url).catch(() => {
              clearTimeout(networkTimeout);
              reject(_createError(auth, "internal-error"));
            });
          });
        }
        clearedOneInstance() {
          this.counter--;
        }
        shouldResolveImmediately(hl) {
          return !!_window().grecaptcha && (hl === this.hostLanguage || this.counter > 0 || this.librarySeparatelyLoaded);
        }
      };
      MockReCaptchaLoaderImpl = class {
        async load(auth) {
          return new MockReCaptcha(auth);
        }
        clearedOneInstance() {
        }
      };
      RECAPTCHA_VERIFIER_TYPE = "recaptcha";
      DEFAULT_PARAMS = {
        theme: "light",
        type: "image"
      };
      RecaptchaVerifier = class {
        constructor(containerOrId, parameters = Object.assign({}, DEFAULT_PARAMS), authExtern) {
          this.parameters = parameters;
          this.type = RECAPTCHA_VERIFIER_TYPE;
          this.destroyed = false;
          this.widgetId = null;
          this.tokenChangeListeners = new Set();
          this.renderPromise = null;
          this.recaptcha = null;
          this.auth = _castAuth(authExtern);
          this.isInvisible = this.parameters.size === "invisible";
          _assert(typeof document !== "undefined", this.auth, "operation-not-supported-in-this-environment");
          const container = typeof containerOrId === "string" ? document.getElementById(containerOrId) : containerOrId;
          _assert(container, this.auth, "argument-error");
          this.container = container;
          this.parameters.callback = this.makeTokenCallback(this.parameters.callback);
          this._recaptchaLoader = this.auth.settings.appVerificationDisabledForTesting ? new MockReCaptchaLoaderImpl() : new ReCaptchaLoaderImpl();
          this.validateStartingState();
        }
        async verify() {
          this.assertNotDestroyed();
          const id = await this.render();
          const recaptcha = this.getAssertedRecaptcha();
          const response = recaptcha.getResponse(id);
          if (response) {
            return response;
          }
          return new Promise((resolve) => {
            const tokenChange = (token) => {
              if (!token) {
                return;
              }
              this.tokenChangeListeners.delete(tokenChange);
              resolve(token);
            };
            this.tokenChangeListeners.add(tokenChange);
            if (this.isInvisible) {
              recaptcha.execute(id);
            }
          });
        }
        render() {
          try {
            this.assertNotDestroyed();
          } catch (e) {
            return Promise.reject(e);
          }
          if (this.renderPromise) {
            return this.renderPromise;
          }
          this.renderPromise = this.makeRenderPromise().catch((e) => {
            this.renderPromise = null;
            throw e;
          });
          return this.renderPromise;
        }
        _reset() {
          this.assertNotDestroyed();
          if (this.widgetId !== null) {
            this.getAssertedRecaptcha().reset(this.widgetId);
          }
        }
        clear() {
          this.assertNotDestroyed();
          this.destroyed = true;
          this._recaptchaLoader.clearedOneInstance();
          if (!this.isInvisible) {
            this.container.childNodes.forEach((node) => {
              this.container.removeChild(node);
            });
          }
        }
        validateStartingState() {
          _assert(!this.parameters.sitekey, this.auth, "argument-error");
          _assert(this.isInvisible || !this.container.hasChildNodes(), this.auth, "argument-error");
          _assert(typeof document !== "undefined", this.auth, "operation-not-supported-in-this-environment");
        }
        makeTokenCallback(existing) {
          return (token) => {
            this.tokenChangeListeners.forEach((listener) => listener(token));
            if (typeof existing === "function") {
              existing(token);
            } else if (typeof existing === "string") {
              const globalFunc = _window()[existing];
              if (typeof globalFunc === "function") {
                globalFunc(token);
              }
            }
          };
        }
        assertNotDestroyed() {
          _assert(!this.destroyed, this.auth, "internal-error");
        }
        async makeRenderPromise() {
          await this.init();
          if (!this.widgetId) {
            let container = this.container;
            if (!this.isInvisible) {
              const guaranteedEmpty = document.createElement("div");
              container.appendChild(guaranteedEmpty);
              container = guaranteedEmpty;
            }
            this.widgetId = this.getAssertedRecaptcha().render(container, this.parameters);
          }
          return this.widgetId;
        }
        async init() {
          _assert(_isHttpOrHttps() && !_isWorker(), this.auth, "internal-error");
          await domReady();
          this.recaptcha = await this._recaptchaLoader.load(this.auth, this.auth.languageCode || void 0);
          const siteKey = await getRecaptchaParams(this.auth);
          _assert(siteKey, this.auth, "internal-error");
          this.parameters.sitekey = siteKey;
        }
        getAssertedRecaptcha() {
          _assert(this.recaptcha, this.auth, "internal-error");
          return this.recaptcha;
        }
      };
      ConfirmationResultImpl = class {
        constructor(verificationId, onConfirmation) {
          this.verificationId = verificationId;
          this.onConfirmation = onConfirmation;
        }
        confirm(verificationCode) {
          const authCredential = PhoneAuthCredential._fromVerification(this.verificationId, verificationCode);
          return this.onConfirmation(authCredential);
        }
      };
      PhoneAuthProvider = class {
        constructor(auth) {
          this.providerId = PhoneAuthProvider.PROVIDER_ID;
          this.auth = _castAuth(auth);
        }
        verifyPhoneNumber(phoneOptions, applicationVerifier) {
          return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
        }
        static credential(verificationId, verificationCode) {
          return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
        }
        static credentialFromResult(userCredential) {
          const credential = userCredential;
          return PhoneAuthProvider.credentialFromTaggedObject(credential);
        }
        static credentialFromError(error) {
          return PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { phoneNumber, temporaryProof } = tokenResponse;
          if (phoneNumber && temporaryProof) {
            return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
          }
          return null;
        }
      };
      PhoneAuthProvider.PROVIDER_ID = "phone";
      PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
      IdpCredential = class extends AuthCredential {
        constructor(params) {
          super("custom", "custom");
          this.params = params;
        }
        _getIdTokenResponse(auth) {
          return signInWithIdp(auth, this._buildIdpRequest());
        }
        _linkToIdToken(auth, idToken) {
          return signInWithIdp(auth, this._buildIdpRequest(idToken));
        }
        _getReauthenticationResolver(auth) {
          return signInWithIdp(auth, this._buildIdpRequest());
        }
        _buildIdpRequest(idToken) {
          const request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
          };
          if (idToken) {
            request.idToken = idToken;
          }
          return request;
        }
      };
      AbstractPopupRedirectOperation = class {
        constructor(auth, filter, resolver, user, bypassAuthState = false) {
          this.auth = auth;
          this.resolver = resolver;
          this.user = user;
          this.bypassAuthState = bypassAuthState;
          this.pendingPromise = null;
          this.eventManager = null;
          this.filter = Array.isArray(filter) ? filter : [filter];
        }
        execute() {
          return new Promise(async (resolve, reject) => {
            this.pendingPromise = { resolve, reject };
            try {
              this.eventManager = await this.resolver._initialize(this.auth);
              await this.onExecution();
              this.eventManager.registerConsumer(this);
            } catch (e) {
              this.reject(e);
            }
          });
        }
        async onAuthEvent(event) {
          const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
          if (error) {
            this.reject(error);
            return;
          }
          const params = {
            auth: this.auth,
            requestUri: urlResponse,
            sessionId,
            tenantId: tenantId || void 0,
            postBody: postBody || void 0,
            user: this.user,
            bypassAuthState: this.bypassAuthState
          };
          try {
            this.resolve(await this.getIdpTask(type)(params));
          } catch (e) {
            this.reject(e);
          }
        }
        onError(error) {
          this.reject(error);
        }
        getIdpTask(type) {
          switch (type) {
            case "signInViaPopup":
            case "signInViaRedirect":
              return _signIn;
            case "linkViaPopup":
            case "linkViaRedirect":
              return _link;
            case "reauthViaPopup":
            case "reauthViaRedirect":
              return _reauth;
            default:
              _fail(this.auth, "internal-error");
          }
        }
        resolve(cred) {
          debugAssert(this.pendingPromise, "Pending promise was never set");
          this.pendingPromise.resolve(cred);
          this.unregisterAndCleanUp();
        }
        reject(error) {
          debugAssert(this.pendingPromise, "Pending promise was never set");
          this.pendingPromise.reject(error);
          this.unregisterAndCleanUp();
        }
        unregisterAndCleanUp() {
          if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
          }
          this.pendingPromise = null;
          this.cleanUp();
        }
      };
      _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
      PopupOperation = class extends AbstractPopupRedirectOperation {
        constructor(auth, filter, provider, resolver, user) {
          super(auth, filter, resolver, user);
          this.provider = provider;
          this.authWindow = null;
          this.pollId = null;
          if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
          }
          PopupOperation.currentPopupAction = this;
        }
        async executeNotNull() {
          const result = await this.execute();
          _assert(result, this.auth, "internal-error");
          return result;
        }
        async onExecution() {
          debugAssert(this.filter.length === 1, "Popup operations only handle one event");
          const eventId = _generateEventId();
          this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], eventId);
          this.authWindow.associatedEvent = eventId;
          this.resolver._originValidation(this.auth).catch((e) => {
            this.reject(e);
          });
          this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
            if (!isSupported) {
              this.reject(_createError(this.auth, "web-storage-unsupported"));
            }
          });
          this.pollUserCancellation();
        }
        get eventId() {
          var _a;
          return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
        }
        cancel() {
          this.reject(_createError(this.auth, "cancelled-popup-request"));
        }
        cleanUp() {
          if (this.authWindow) {
            this.authWindow.close();
          }
          if (this.pollId) {
            window.clearTimeout(this.pollId);
          }
          this.authWindow = null;
          this.pollId = null;
          PopupOperation.currentPopupAction = null;
        }
        pollUserCancellation() {
          const poll = () => {
            var _a, _b;
            if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
              this.pollId = window.setTimeout(() => {
                this.pollId = null;
                this.reject(_createError(this.auth, "popup-closed-by-user"));
              }, 2e3);
              return;
            }
            this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
          };
          poll();
        }
      };
      PopupOperation.currentPopupAction = null;
      PENDING_REDIRECT_KEY = "pendingRedirect";
      redirectOutcomeMap = new Map();
      RedirectAction = class extends AbstractPopupRedirectOperation {
        constructor(auth, resolver, bypassAuthState = false) {
          super(auth, [
            "signInViaRedirect",
            "linkViaRedirect",
            "reauthViaRedirect",
            "unknown"
          ], resolver, void 0, bypassAuthState);
          this.eventId = null;
        }
        async execute() {
          let readyOutcome = redirectOutcomeMap.get(this.auth._key());
          if (!readyOutcome) {
            try {
              const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
              const result = hasPendingRedirect ? await super.execute() : null;
              readyOutcome = () => Promise.resolve(result);
            } catch (e) {
              readyOutcome = () => Promise.reject(e);
            }
            redirectOutcomeMap.set(this.auth._key(), readyOutcome);
          }
          if (!this.bypassAuthState) {
            redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
          }
          return readyOutcome();
        }
        async onAuthEvent(event) {
          if (event.type === "signInViaRedirect") {
            return super.onAuthEvent(event);
          } else if (event.type === "unknown") {
            this.resolve(null);
            return;
          }
          if (event.eventId) {
            const user = await this.auth._redirectUserForId(event.eventId);
            if (user) {
              this.user = user;
              return super.onAuthEvent(event);
            } else {
              this.resolve(null);
            }
          }
        }
        async onExecution() {
        }
        cleanUp() {
        }
      };
      EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
      AuthEventManager = class {
        constructor(auth) {
          this.auth = auth;
          this.cachedEventUids = new Set();
          this.consumers = new Set();
          this.queuedRedirectEvent = null;
          this.hasHandledPotentialRedirect = false;
          this.lastProcessedEventTime = Date.now();
        }
        registerConsumer(authEventConsumer) {
          this.consumers.add(authEventConsumer);
          if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
          }
        }
        unregisterConsumer(authEventConsumer) {
          this.consumers.delete(authEventConsumer);
        }
        onEvent(event) {
          if (this.hasEventBeenHandled(event)) {
            return false;
          }
          let handled = false;
          this.consumers.forEach((consumer) => {
            if (this.isEventForConsumer(event, consumer)) {
              handled = true;
              this.sendToConsumer(event, consumer);
              this.saveEventToCache(event);
            }
          });
          if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            return handled;
          }
          this.hasHandledPotentialRedirect = true;
          if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
          }
          return handled;
        }
        sendToConsumer(event, consumer) {
          var _a;
          if (event.error && !isNullRedirectEvent(event)) {
            const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
            consumer.onError(_createError(this.auth, code));
          } else {
            consumer.onAuthEvent(event);
          }
        }
        isEventForConsumer(event, consumer) {
          const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
          return consumer.filter.includes(event.type) && eventIdMatches;
        }
        hasEventBeenHandled(event) {
          if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
          }
          return this.cachedEventUids.has(eventUid(event));
        }
        saveEventToCache(event) {
          this.cachedEventUids.add(eventUid(event));
          this.lastProcessedEventTime = Date.now();
        }
      };
      IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      HTTP_REGEX = /^https?/;
      NETWORK_TIMEOUT = new Delay(3e4, 6e4);
      cachedGApiLoader = null;
      PING_TIMEOUT = new Delay(5e3, 15e3);
      IFRAME_PATH = "__/auth/iframe";
      EMULATED_IFRAME_PATH = "emulator/auth/iframe";
      IFRAME_ATTRIBUTES = {
        style: {
          position: "absolute",
          top: "-100px",
          width: "1px",
          height: "1px"
        },
        "aria-hidden": "true",
        tabindex: "-1"
      };
      EID_FROM_APIHOST = new Map([
        ["identitytoolkit.googleapis.com", "p"],
        ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
        ["test-identitytoolkit.sandbox.googleapis.com", "t"]
      ]);
      BASE_POPUP_OPTIONS = {
        location: "yes",
        resizable: "yes",
        statusbar: "yes",
        toolbar: "no"
      };
      DEFAULT_WIDTH = 500;
      DEFAULT_HEIGHT = 600;
      TARGET_BLANK = "_blank";
      FIREFOX_EMPTY_URL = "http://localhost";
      AuthPopup = class {
        constructor(window2) {
          this.window = window2;
          this.associatedEvent = null;
        }
        close() {
          if (this.window) {
            try {
              this.window.close();
            } catch (e) {
            }
          }
        }
      };
      WIDGET_PATH = "__/auth/handler";
      EMULATOR_WIDGET_PATH = "emulator/auth/handler";
      WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
      BrowserPopupRedirectResolver = class {
        constructor() {
          this.eventManagers = {};
          this.iframes = {};
          this.originValidationPromises = {};
          this._redirectPersistence = browserSessionPersistence;
          this._completeRedirectFn = _getRedirectResult;
        }
        async _openPopup(auth, provider, authType, eventId) {
          var _a;
          debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === void 0 ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
          const url = _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
          return _open(auth, url, _generateEventId());
        }
        async _openRedirect(auth, provider, authType, eventId) {
          await this._originValidation(auth);
          _setWindowLocation(_getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId));
          return new Promise(() => {
          });
        }
        _initialize(auth) {
          const key = auth._key();
          if (this.eventManagers[key]) {
            const { manager, promise: promise2 } = this.eventManagers[key];
            if (manager) {
              return Promise.resolve(manager);
            } else {
              debugAssert(promise2, "If manager is not set, promise should be");
              return promise2;
            }
          }
          const promise = this.initAndGetManager(auth);
          this.eventManagers[key] = { promise };
          promise.catch(() => {
            delete this.eventManagers[key];
          });
          return promise;
        }
        async initAndGetManager(auth) {
          const iframe = await _openIframe(auth);
          const manager = new AuthEventManager(auth);
          iframe.register("authEvent", (iframeEvent) => {
            _assert(iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent, auth, "invalid-auth-event");
            const handled = manager.onEvent(iframeEvent.authEvent);
            return { status: handled ? "ACK" : "ERROR" };
          }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
          this.eventManagers[auth._key()] = { manager };
          this.iframes[auth._key()] = iframe;
          return manager;
        }
        _isIframeWebStorageSupported(auth, cb) {
          const iframe = this.iframes[auth._key()];
          iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
            var _a;
            const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== void 0) {
              cb(!!isSupported);
            }
            _fail(auth, "internal-error");
          }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
        }
        _originValidation(auth) {
          const key = auth._key();
          if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
          }
          return this.originValidationPromises[key];
        }
        get _shouldInitProactively() {
          return _isMobileBrowser() || _isSafari() || _isIOS();
        }
      };
      browserPopupRedirectResolver = BrowserPopupRedirectResolver;
      MultiFactorAssertionImpl = class {
        constructor(factorId) {
          this.factorId = factorId;
        }
        _process(auth, session, displayName) {
          switch (session.type) {
            case "enroll":
              return this._finalizeEnroll(auth, session.credential, displayName);
            case "signin":
              return this._finalizeSignIn(auth, session.credential);
            default:
              return debugFail("unexpected MultiFactorSessionType");
          }
        }
      };
      PhoneMultiFactorAssertionImpl = class extends MultiFactorAssertionImpl {
        constructor(credential) {
          super("phone");
          this.credential = credential;
        }
        static _fromCredential(credential) {
          return new PhoneMultiFactorAssertionImpl(credential);
        }
        _finalizeEnroll(auth, idToken, displayName) {
          return finalizeEnrollPhoneMfa(auth, {
            idToken,
            displayName,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
          });
        }
        _finalizeSignIn(auth, mfaPendingCredential) {
          return finalizeSignInPhoneMfa(auth, {
            mfaPendingCredential,
            phoneVerificationInfo: this.credential._makeVerificationRequest()
          });
        }
      };
      PhoneMultiFactorGenerator = class {
        constructor() {
        }
        static assertion(credential) {
          return PhoneMultiFactorAssertionImpl._fromCredential(credential);
        }
      };
      PhoneMultiFactorGenerator.FACTOR_ID = "phone";
      name3 = "@firebase/auth";
      version3 = "0.19.6";
      AuthInterop = class {
        constructor(auth) {
          this.auth = auth;
          this.internalListeners = new Map();
        }
        getUid() {
          var _a;
          this.assertAuthConfigured();
          return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
        }
        async getToken(forceRefresh) {
          this.assertAuthConfigured();
          await this.auth._initializationPromise;
          if (!this.auth.currentUser) {
            return null;
          }
          const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
          return { accessToken };
        }
        addAuthTokenListener(listener) {
          this.assertAuthConfigured();
          if (this.internalListeners.has(listener)) {
            return;
          }
          const unsubscribe = this.auth.onIdTokenChanged((user) => {
            var _a;
            listener(((_a = user) === null || _a === void 0 ? void 0 : _a.stsTokenManager.accessToken) || null);
          });
          this.internalListeners.set(listener, unsubscribe);
          this.updateProactiveRefresh();
        }
        removeAuthTokenListener(listener) {
          this.assertAuthConfigured();
          const unsubscribe = this.internalListeners.get(listener);
          if (!unsubscribe) {
            return;
          }
          this.internalListeners.delete(listener);
          unsubscribe();
          this.updateProactiveRefresh();
        }
        assertAuthConfigured() {
          _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
        }
        updateProactiveRefresh() {
          if (this.internalListeners.size > 0) {
            this.auth._startProactiveRefresh();
          } else {
            this.auth._stopProactiveRefresh();
          }
        }
      };
      registerAuth("Browser");
    }
  });

  // node_modules/@firebase/auth/dist/esm2017/index.js
  var esm2017_exports = {};
  __export(esm2017_exports, {
    ActionCodeOperation: () => ActionCodeOperation,
    ActionCodeURL: () => ActionCodeURL,
    AuthCredential: () => AuthCredential,
    AuthErrorCodes: () => AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY,
    EmailAuthCredential: () => EmailAuthCredential,
    EmailAuthProvider: () => EmailAuthProvider,
    FacebookAuthProvider: () => FacebookAuthProvider,
    FactorId: () => FactorId,
    GithubAuthProvider: () => GithubAuthProvider,
    GoogleAuthProvider: () => GoogleAuthProvider,
    OAuthCredential: () => OAuthCredential,
    OAuthProvider: () => OAuthProvider,
    OperationType: () => OperationType,
    PhoneAuthCredential: () => PhoneAuthCredential,
    PhoneAuthProvider: () => PhoneAuthProvider,
    PhoneMultiFactorGenerator: () => PhoneMultiFactorGenerator,
    ProviderId: () => ProviderId,
    RecaptchaVerifier: () => RecaptchaVerifier,
    SAMLAuthProvider: () => SAMLAuthProvider,
    SignInMethod: () => SignInMethod,
    TwitterAuthProvider: () => TwitterAuthProvider,
    applyActionCode: () => applyActionCode,
    browserLocalPersistence: () => browserLocalPersistence,
    browserPopupRedirectResolver: () => browserPopupRedirectResolver,
    browserSessionPersistence: () => browserSessionPersistence,
    checkActionCode: () => checkActionCode,
    confirmPasswordReset: () => confirmPasswordReset,
    connectAuthEmulator: () => connectAuthEmulator,
    createUserWithEmailAndPassword: () => createUserWithEmailAndPassword,
    debugErrorMap: () => debugErrorMap,
    deleteUser: () => deleteUser,
    fetchSignInMethodsForEmail: () => fetchSignInMethodsForEmail,
    getAdditionalUserInfo: () => getAdditionalUserInfo,
    getAuth: () => getAuth,
    getIdToken: () => getIdToken,
    getIdTokenResult: () => getIdTokenResult,
    getMultiFactorResolver: () => getMultiFactorResolver,
    getRedirectResult: () => getRedirectResult,
    inMemoryPersistence: () => inMemoryPersistence,
    indexedDBLocalPersistence: () => indexedDBLocalPersistence,
    initializeAuth: () => initializeAuth,
    isSignInWithEmailLink: () => isSignInWithEmailLink,
    linkWithCredential: () => linkWithCredential,
    linkWithPhoneNumber: () => linkWithPhoneNumber,
    linkWithPopup: () => linkWithPopup,
    linkWithRedirect: () => linkWithRedirect,
    multiFactor: () => multiFactor,
    onAuthStateChanged: () => onAuthStateChanged,
    onIdTokenChanged: () => onIdTokenChanged,
    parseActionCodeURL: () => parseActionCodeURL,
    prodErrorMap: () => prodErrorMap,
    reauthenticateWithCredential: () => reauthenticateWithCredential,
    reauthenticateWithPhoneNumber: () => reauthenticateWithPhoneNumber,
    reauthenticateWithPopup: () => reauthenticateWithPopup,
    reauthenticateWithRedirect: () => reauthenticateWithRedirect,
    reload: () => reload,
    sendEmailVerification: () => sendEmailVerification,
    sendPasswordResetEmail: () => sendPasswordResetEmail,
    sendSignInLinkToEmail: () => sendSignInLinkToEmail,
    setPersistence: () => setPersistence,
    setRecaptchaConfig: () => setRecaptchaConfig,
    signInAnonymously: () => signInAnonymously,
    signInWithCredential: () => signInWithCredential,
    signInWithCustomToken: () => signInWithCustomToken,
    signInWithEmailAndPassword: () => signInWithEmailAndPassword,
    signInWithEmailLink: () => signInWithEmailLink,
    signInWithPhoneNumber: () => signInWithPhoneNumber,
    signInWithPopup: () => signInWithPopup,
    signInWithRedirect: () => signInWithRedirect,
    signOut: () => signOut,
    unlink: () => unlink,
    updateCurrentUser: () => updateCurrentUser,
    updateEmail: () => updateEmail,
    updatePassword: () => updatePassword,
    updatePhoneNumber: () => updatePhoneNumber,
    updateProfile: () => updateProfile,
    useDeviceLanguage: () => useDeviceLanguage,
    verifyBeforeUpdateEmail: () => verifyBeforeUpdateEmail,
    verifyPasswordResetCode: () => verifyPasswordResetCode
  });
  var init_esm2017 = __esm({
    "node_modules/@firebase/auth/dist/esm2017/index.js"() {
      init_index_139b42ee();
      init_index_esm20175();
      init_index_esm20174();
      init_modules();
      init_index_esm20173();
      init_index_esm20176();
    }
  });

  // node_modules/jwt-decode/build/jwt-decode.cjs.js
  var require_jwt_decode_cjs = __commonJS({
    "node_modules/jwt-decode/build/jwt-decode.cjs.js"(exports, module) {
      "use strict";
      function e(e2) {
        this.message = e2;
      }
      e.prototype = new Error(), e.prototype.name = "InvalidCharacterError";
      var r = typeof window != "undefined" && window.atob && window.atob.bind(window) || function(r2) {
        var t2 = String(r2).replace(/=+$/, "");
        if (t2.length % 4 == 1)
          throw new e("'atob' failed: The string to be decoded is not correctly encoded.");
        for (var n2, o2, a2 = 0, i = 0, c = ""; o2 = t2.charAt(i++); ~o2 && (n2 = a2 % 4 ? 64 * n2 + o2 : o2, a2++ % 4) ? c += String.fromCharCode(255 & n2 >> (-2 * a2 & 6)) : 0)
          o2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o2);
        return c;
      };
      function t(e2) {
        var t2 = e2.replace(/-/g, "+").replace(/_/g, "/");
        switch (t2.length % 4) {
          case 0:
            break;
          case 2:
            t2 += "==";
            break;
          case 3:
            t2 += "=";
            break;
          default:
            throw "Illegal base64url string!";
        }
        try {
          return function(e3) {
            return decodeURIComponent(r(e3).replace(/(.)/g, function(e4, r2) {
              var t3 = r2.charCodeAt(0).toString(16).toUpperCase();
              return t3.length < 2 && (t3 = "0" + t3), "%" + t3;
            }));
          }(t2);
        } catch (e3) {
          return r(t2);
        }
      }
      function n(e2) {
        this.message = e2;
      }
      function o(e2, r2) {
        if (typeof e2 != "string")
          throw new n("Invalid token specified");
        var o2 = (r2 = r2 || {}).header === true ? 0 : 1;
        try {
          return JSON.parse(t(e2.split(".")[o2]));
        } catch (e3) {
          throw new n("Invalid token specified: " + e3.message);
        }
      }
      n.prototype = new Error(), n.prototype.name = "InvalidTokenError";
      var a = o;
      a.default = o, a.InvalidTokenError = n, module.exports = a;
    }
  });

  // index.js
  var require_src = __commonJS({
    "index.js"() {
      var { initializeApp: initializeApp2 } = (init_index_esm(), index_esm_exports);
      var {
        applyActionCode: applyActionCode2,
        AuthErrorCodes,
        browserLocalPersistence: browserLocalPersistence2,
        browserPopupRedirectResolver: browserPopupRedirectResolver2,
        browserSessionPersistence: browserSessionPersistence2,
        checkActionCode: checkActionCode2,
        confirmPasswordReset: confirmPasswordReset2,
        createUserWithEmailAndPassword: createUserWithEmailAndPassword2,
        EmailAuthProvider: EmailAuthProvider2,
        fetchSignInMethodsForEmail: fetchSignInMethodsForEmail2,
        getAuth: getAuth2,
        getMultiFactorResolver: getMultiFactorResolver2,
        getRedirectResult: getRedirectResult2,
        indexedDBLocalPersistence: indexedDBLocalPersistence2,
        initializeAuth: initializeAuth2,
        linkWithCredential: linkWithCredential2,
        linkWithPopup: linkWithPopup2,
        multiFactor: multiFactor2,
        OAuthProvider: OAuthProvider2,
        onAuthStateChanged: onAuthStateChanged2,
        PhoneAuthProvider: PhoneAuthProvider2,
        PhoneMultiFactorGenerator: PhoneMultiFactorGenerator2,
        reauthenticateWithPopup: reauthenticateWithPopup2,
        RecaptchaVerifier: RecaptchaVerifier2,
        SAMLAuthProvider: SAMLAuthProvider2,
        sendEmailVerification: sendEmailVerification2,
        sendPasswordResetEmail: sendPasswordResetEmail2,
        setRecaptchaConfig: setRecaptchaConfig2,
        signInWithCredential: signInWithCredential2,
        signInWithEmailAndPassword: signInWithEmailAndPassword2,
        signInWithEmailLink: signInWithEmailLink2,
        signInWithPhoneNumber: signInWithPhoneNumber2,
        signInWithPopup: signInWithPopup2,
        signInWithRedirect: signInWithRedirect2,
        signOut: signOut2,
        verifyBeforeUpdateEmail: verifyBeforeUpdateEmail2
      } = (init_esm2017(), esm2017_exports);
      var jwt_decode = require_jwt_decode_cjs();
      var firebaseConfig = {
        apiKey: "AIzaSyBYBZpD_pkutXksLGhgBAKO9SN0RJ-QjzI",
        authDomain: "ian-another-test.firebaseapp.com",
        databaseURL: "https://ian-another-test-default-rtdb.firebaseio.com",
        projectId: "ian-another-test",
        storageBucket: "ian-another-test.appspot.com",
        appVerificationDisabledForTesting: true
      };
      var firebaseApp = initializeApp2(firebaseConfig);
      var auth = initializeAuth2(firebaseApp, {
        persistence: [indexedDBLocalPersistence2, browserLocalPersistence2, browserSessionPersistence2],
        popupRedirectResolver: browserPopupRedirectResolver2
      });
      window.recaptchaVerifier = new RecaptchaVerifier2("recaptcha-container", {}, auth);
      var DEFAULT_MSG = "No user signed in.";
      var federatedSigninFunction = signInWithPopup2;
      var credential;
      document.addEventListener("DOMContentLoaded", function() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
        (_a = document.getElementById("signout")) == null ? void 0 : _a.addEventListener("click", userSignOut);
        (_b = document.getElementById("pw")) == null ? void 0 : _b.addEventListener("click", pwSignin);
        (_c = document.getElementById("signup")) == null ? void 0 : _c.addEventListener("click", signUp2);
        (_d = document.getElementById("resetpw")) == null ? void 0 : _d.addEventListener("click", resetPw);
        (_e = document.getElementById("oidc")) == null ? void 0 : _e.addEventListener("click", oidcSignin);
        (_f = document.getElementById("twitch")) == null ? void 0 : _f.addEventListener("click", twitchSignin);
        (_g = document.getElementById("saml")) == null ? void 0 : _g.addEventListener("click", samlSignin);
        (_h = document.getElementById("verifyEmail")) == null ? void 0 : _h.addEventListener("click", verifyEmail);
        (_i = document.getElementById("federatedLinkWithPopup")) == null ? void 0 : _i.addEventListener("click", federatedLinkWithPopup);
        (_j = document.getElementById("popupReauthOidc")) == null ? void 0 : _j.addEventListener("click", popupReauth);
        (_k = document.getElementById("popupReauthSaml")) == null ? void 0 : _k.addEventListener("click", popupReauthSaml);
        (_l = document.getElementById("usePopup")) == null ? void 0 : _l.addEventListener("click", () => {
          federatedSigninFunction = signInWithPopup2;
        });
        (_m = document.getElementById("useRedirect")) == null ? void 0 : _m.addEventListener("click", () => {
          federatedSigninFunction = signInWithRedirect2;
        });
        authStateChangeHandler(auth.currentUser);
        onAuthStateChanged2(auth, authStateChangeHandler);
        setRecaptchaConfig2(auth, { emailPasswordEnabled: true });
      });
      function authStateChangeHandler(user) {
        if (user) {
          document.getElementById("message").innerHTML = "Welcome, " + user.email;
          document.getElementById("additional-info").innerHTML = JSON.stringify(user.toJSON(), null, 2);
          user.getIdToken().then((tokStr) => {
            document.getElementById("id-token").innerHTML = JSON.stringify(jwt_decode(tokStr), null, 2);
          });
        } else {
          document.getElementById("message").innerHTML = DEFAULT_MSG;
          document.getElementById("additional-info").innerHTML = "";
          document.getElementById("id-token").innerHTML = "";
        }
      }
      function userSignOut() {
        signOut2(auth).then(() => {
          credential = null;
          document.getElementById("message").innerHTML = DEFAULT_MSG;
        }).catch((error) => {
          console.log(error);
        });
      }
      function resetPw() {
        return __async(this, null, function* () {
          const actionCodeSettings = {
            url: "https://ian-another-test.firebaseapp.com"
          };
          yield sendPasswordResetEmail2(auth, document.getElementById("input1").value, actionCodeSettings);
          let verificationCode = prompt("code?");
          yield confirmPasswordReset2("user@example.com", verificationCode);
        });
      }
      function signUp2() {
        return __async(this, null, function* () {
          var userCredential = yield createUserWithEmailAndPassword2(auth, document.getElementById("input1").value, document.getElementById("input2").value);
          console.log(JSON.stringify(userCredential));
        });
      }
      function pwSignin() {
        const email = document.getElementById("input1").value;
        const password = document.getElementById("input2").value;
        signInWithEmailAndPassword2(auth, email, password).then((userCredential) => {
          console.log(JSON.stringify(userCredential));
        }).catch((error) => {
          if (error.code == AuthErrorCodes.MFA_REQUIRED) {
            var resolver = getMultiFactorResolver2(auth, error);
            var phoneInfoOptions = {
              multiFactorHint: resolver.hints[0],
              session: resolver.session
            };
            const provider = new PhoneAuthProvider2(auth);
            var appVerifier = window.recaptchaVerifier;
            provider.verifyPhoneNumber(phoneInfoOptions, appVerifier).then((verificationId) => {
              let verificationCode = prompt("code?");
              const cred = PhoneAuthProvider2.credential(verificationId, verificationCode);
              const multiFactorAssertion = PhoneMultiFactorGenerator2.assertion(cred);
              resolver.resolveSignIn(multiFactorAssertion).then((userCredential) => {
                console.log("mfa sign-in success!");
                console.log(JSON.stringify(userCredential));
              });
            }).catch((error2) => {
              console.log("failed verifyPhoneNumber");
              console.log(error2);
            });
          } else {
            console.log(error);
          }
        });
      }
      function samlSignin() {
        const provider = new SAMLAuthProvider2("saml.google");
        federatedSigninFunction(auth, provider).then((result) => {
          console.log(JSON.stringify(result));
          credential = SAMLAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
          result.user.getIdTokenResult().then((tok) => {
            console.log(tok.claims.firebase);
          });
        }).catch((error) => {
          const credential2 = SAMLAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function oidcSignin() {
        const provider = new OAuthProvider2("oidc.gcip-openid-provider");
        provider.addScope("openid");
        provider.addScope("profile");
        provider.addScope("email");
        provider.addScope("https://www.googleapis.com/auth/calendar");
        provider.addScope("https://www.googleapis.com/auth/bigquery");
        provider.addScope("https://www.googleapis.com/auth/admin.datatransfer");
        federatedSigninFunction(auth, provider).then((result) => {
          console.log(JSON.stringify(result));
          credential = OAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
        }).catch((error) => {
          const credential2 = OAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function twitchSignin() {
        const provider = new OAuthProvider2("oidc.twitch");
        provider.addScope("openid");
        provider.addScope("user:read:email");
        provider.setCustomParameters({
          claims: JSON.stringify({ "id_token": { "email": null, "email_verified": null }, "userinfo": { "picture": null } })
        });
        federatedSigninFunction(auth, provider).then((result) => {
          console.log(JSON.stringify(result));
          credential = OAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
        }).catch((error) => {
          const credential2 = OAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function popupReauth() {
        const provider = new OAuthProvider2("oidc.gcip-openid-provider");
        reauthenticateWithPopup2(auth.currentUser, provider).then((result) => {
          credential = OAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
        }).catch((error) => {
          const credential2 = OAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function popupReauthSaml() {
        const provider = new SAMLAuthProvider2("saml.google");
        reauthenticateWithPopup2(auth.currentUser, provider).then((result) => {
          credential = SAMLAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
        }).catch((error) => {
          const credential2 = SAMLAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function federatedLinkWithPopup() {
        const provider = new OAuthProvider2("oidc.gcip-openid-provider");
        linkWithPopup2(auth.currentUser, provider).then((result) => {
          credential = OAuthProvider2.credentialFromResult(result);
          console.log(JSON.stringify(credential));
        }).catch((error) => {
          const credential2 = OAuthProvider2.credentialFromError(error);
          console.log(error);
          console.log(credential2);
        });
      }
      function verifyEmail() {
        const user = auth.currentUser;
        if (user === null) {
          console.log("null user");
          return;
        }
        console.log("verify email");
        sendEmailVerification2(user, {
          url: "https://ian-another-test.firebaseapp.com"
        }).then(() => {
          let code = prompt("action code?");
          console.log("sending action code");
          applyActionCode2(auth, code);
        });
      }
    }
  });
  require_src();
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
