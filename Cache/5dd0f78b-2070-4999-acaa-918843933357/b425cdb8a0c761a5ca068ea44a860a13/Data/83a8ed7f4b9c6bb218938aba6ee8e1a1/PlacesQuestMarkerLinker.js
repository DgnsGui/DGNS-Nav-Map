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
exports.PlacesQuestMarkerLinker = void 0;
var __selfType = requireType("./PlacesQuestMarkerLinker");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
let PlacesQuestMarkerLinker = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PlacesQuestMarkerLinker = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
            this.linkingAttempts = 0;
            this.maxAttempts = 5;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.linkingAttempts = 0;
            this.maxAttempts = 5;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            print("=== PlacesQuestMarkerLinker START ===");
            if (!this.mapComponent) {
                print("ERROR: MapComponent not assigned!");
                return;
            }
            this.mapController = this.mapComponent.mapController;
            if (!this.mapController) {
                print("ERROR: MapController not found!");
                return;
            }
            print("MapController found, setting up...");
            this.setupQuestMarkerLinking();
        }
        setupQuestMarkerLinking() {
            this.attemptLinking();
        }
        attemptLinking() {
            this.linkingAttempts++;
            print(`Attempt ${this.linkingAttempts}/${this.maxAttempts}...`);
            const linked = this.linkExistingQuestMarkers();
            if (!linked && this.linkingAttempts < this.maxAttempts) {
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    this.attemptLinking();
                });
                delayEvent.reset(1.0);
            }
            else if (linked) {
                print("Quest markers linked!");
            }
            else {
                print("Failed after " + this.maxAttempts + " attempts");
            }
        }
        linkExistingQuestMarkers() {
            const mapControllerAny = this.mapController;
            print("Checking for quest markers...");
            if (mapControllerAny.questMarkers && mapControllerAny.questMarkers.length > 0) {
                print("Found " + mapControllerAny.questMarkers.length + " quest markers!");
                const questMarkers = mapControllerAny.questMarkers;
                let linkedCount = 0;
                for (let i = 0; i < questMarkers.length; i++) {
                    const questMarker = questMarkers[i];
                    if (questMarker && questMarker.mapPin) {
                        print("Linking marker " + i);
                        this.mapComponent.linkQuestMarkerToPlace(questMarker.mapPin, questMarker);
                        linkedCount++;
                    }
                }
                print("Linked " + linkedCount + " quest markers");
                return linkedCount > 0;
            }
            else {
                print("No quest markers found yet");
                return false;
            }
        }
        linkQuestMarker(pin, questMarker) {
            this.mapComponent.linkQuestMarkerToPlace(pin, questMarker);
        }
    };
    __setFunctionName(_classThis, "PlacesQuestMarkerLinker");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlacesQuestMarkerLinker = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlacesQuestMarkerLinker = _classThis;
})();
exports.PlacesQuestMarkerLinker = PlacesQuestMarkerLinker;
//# sourceMappingURL=PlacesQuestMarkerLinker.js.map