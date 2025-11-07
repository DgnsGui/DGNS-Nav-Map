"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerVisualization = exports.Logger = void 0;
var __selfType = requireType("./Logging");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Queue_1 = require("./Queue");
class Logger {
    log(message) {
        this.bus.write(this.topic, message);
    }
}
exports.Logger = Logger;
// place to write things out exists ahead of component instantiation
class LoggerBus {
    constructor() {
        this.buffered = [];
    }
    write(topic, message) {
        this.buffered.push([topic, message]);
        this.flush();
    }
    flush() {
        if (!this.listener) {
            return;
        }
        this.buffered.forEach(([topic, message]) => {
            this.listener(topic, message);
        });
        this.buffered = [];
    }
}
let LoggerVisualization = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var LoggerVisualization = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.logLimit = this.logLimit;
            this.loggerOutput = this.loggerOutput;
        }
        __initialize() {
            super.__initialize();
            this.logLimit = this.logLimit;
            this.loggerOutput = this.loggerOutput;
        }
        static get busInstance() {
            if (!LoggerVisualization.theLoggerBus) {
                LoggerVisualization.theLoggerBus = new LoggerBus();
            }
            return LoggerVisualization.theLoggerBus;
        }
        static createLogger(topic) {
            let logger = new Logger();
            logger.bus = LoggerVisualization.busInstance;
            logger.topic = topic;
            return logger;
        }
        write(topic, message) {
            const localText = `${topic}: ${message}`;
            if (this.loggerOutput != null && this.loggerOutput != undefined) {
                this.logQueue.enqueue(localText);
                let formatedLog = this.logQueue.peek(0);
                for (let index = 0; index < this.logQueue.size(); index++) {
                    formatedLog += "\n" + this.logQueue.peek(index);
                }
                this.loggerOutput.text = formatedLog;
            }
            else {
                print("no textLogger: " + localText);
            }
            print(localText);
        }
        onAwake() {
            this.logQueue = new Queue_1.Queue(this.logLimit);
            this.write = this.write.bind(this);
            LoggerVisualization.busInstance.listener = this.write;
        }
    };
    __setFunctionName(_classThis, "LoggerVisualization");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoggerVisualization = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoggerVisualization = _classThis;
})();
exports.LoggerVisualization = LoggerVisualization;
//# sourceMappingURL=Logging.js.map