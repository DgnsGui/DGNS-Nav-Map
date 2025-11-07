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
exports.MapUIController = exports.TWEEN_DURATION = void 0;
var __selfType = requireType("./MapUIController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const MapUtils_1 = require("../MapComponent/Scripts/MapUtils");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
exports.TWEEN_DURATION = 0.3;
const ZOOM_IN_BUTTON_OFFSET_MINI = new vec3(7, -9.5, 2);
const ZOOM_IN_BUTTON_OFFSET_FULL = new vec3(22.8488, -32, 2);
const ZOOM_OUT_BUTTON_OFFSET_MINI = new vec3(-7, -9.5, 2);
const ZOOM_OUT_BUTTON_OFFSET_FULL = new vec3(17.5945, -32, 2);
const CENTER_MAP_BUTTON_OFFSET_MINI = new vec3(0, -10, 2);
const CENTER_MAP_BUTTON_OFFSET_FULL = new vec3(9, -32, 2);
const TOGGLE_BUTTON_OFFSET_MINI = new vec3(-10, 10.5, 2);
const TOGGLE_BUTTON_OFFSET_FULL = new vec3(-31, 32, 2);
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["SPAWN_PIN"] = 0] = "SPAWN_PIN";
    ButtonType[ButtonType["CLEAR_PINS"] = 1] = "CLEAR_PINS";
    ButtonType[ButtonType["ZOOM_IN"] = 2] = "ZOOM_IN";
    ButtonType[ButtonType["ZOOM_OUT"] = 3] = "ZOOM_OUT";
    ButtonType[ButtonType["CENTER_MAP"] = 4] = "CENTER_MAP";
    ButtonType[ButtonType["TOGGLE_MINI_MAP"] = 5] = "TOGGLE_MINI_MAP";
    ButtonType[ButtonType["SHOW_CAFE"] = 6] = "SHOW_CAFE";
    ButtonType[ButtonType["SHOW_BARS"] = 7] = "SHOW_BARS";
    ButtonType[ButtonType["SHOW_RESTAURANTS"] = 8] = "SHOW_RESTAURANTS";
    ButtonType[ButtonType["ASK_AI"] = 9] = "ASK_AI";
})(ButtonType || (ButtonType = {}));
const TAG = "[MapUIController]";
const log = new NativeLogger_1.default(TAG);
let MapUIController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapUIController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
            this.spawnPinButton = this.spawnPinButton;
            this.clearPinsButton = this.clearPinsButton;
            this.zoomInButton = this.zoomInButton;
            this.zoomOutButton = this.zoomOutButton;
            this.centerMapButton = this.centerMapButton;
            this.toggleMiniMapButton = this.toggleMiniMapButton;
            this.showRestaurantsButton = this.showRestaurantsButton;
            this.showCafeButton = this.showCafeButton;
            this.showBarsButton = this.showBarsButton;
            this.showAllButton = this.showAllButton;
            this.askAIButton = this.askAIButton;
            this.aiAssistant = this.aiAssistant;
            // For debugging
            this.logObject = this.logObject;
            this.isMiniMap = false;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.spawnPinButton = this.spawnPinButton;
            this.clearPinsButton = this.clearPinsButton;
            this.zoomInButton = this.zoomInButton;
            this.zoomOutButton = this.zoomOutButton;
            this.centerMapButton = this.centerMapButton;
            this.toggleMiniMapButton = this.toggleMiniMapButton;
            this.showRestaurantsButton = this.showRestaurantsButton;
            this.showCafeButton = this.showCafeButton;
            this.showBarsButton = this.showBarsButton;
            this.showAllButton = this.showAllButton;
            this.askAIButton = this.askAIButton;
            this.aiAssistant = this.aiAssistant;
            // For debugging
            this.logObject = this.logObject;
            this.isMiniMap = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
            this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
            this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
            this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
            this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
            this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
            this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
            this.showBarsButton.onButtonPinched.add(this.handleShowPubsButtonPinched.bind(this));
            this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
            this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
            // Setup Ask AI button if available
            if (this.askAIButton) {
                this.askAIButton.onButtonPinched.add(this.handleAskAIButtonPinched.bind(this));
                log.i("Ask AI button configured");
            }
            else {
                log.w("Ask AI button not assigned");
            }
            // Should have the same order as the ButtonType enum
            this.buttonTransforms = [
                this.spawnPinButton.getTransform(),
                this.clearPinsButton.getTransform(),
                this.zoomInButton.getTransform(),
                this.zoomOutButton.getTransform(),
                this.centerMapButton.getTransform(),
                this.toggleMiniMapButton.getTransform(),
                this.showCafeButton.getTransform(),
                this.showBarsButton.getTransform(),
                this.showRestaurantsButton.getTransform(),
            ];
            if (this.askAIButton) {
                this.buttonTransforms.push(this.askAIButton.getTransform());
            }
            if (this.logObject !== undefined) {
                this.buttonTransforms.push(this.logObject.getTransform());
            }
            if (this.isMiniMap) {
                this.spawnPinButton.sceneObject.enabled = false;
                this.clearPinsButton.sceneObject.enabled = false;
                this.showCafeButton.sceneObject.enabled = false;
                this.showBarsButton.sceneObject.enabled = false;
                this.showRestaurantsButton.sceneObject.enabled = false;
                this.showAllButton.sceneObject.enabled = false;
            }
        }
        handleSpawnPinButtonPinched(event) {
            this.mapComponent.addPinByLocalPosition(vec2.zero());
        }
        handleClearPinsButtonPinched(event) {
            this.mapComponent.removeMapPins();
        }
        handleZoomInButtonPinched(event) {
            this.mapComponent.zoomIn();
        }
        handleZoomOutButtonPinched(event) {
            this.mapComponent.zoomOut();
        }
        handleToggleMiniMapButtonPinched(isOn) {
            if (this.isMiniMap === isOn) {
                return;
            }
            log.i("Toggling minimap " + isOn);
            this.mapComponent.toggleMiniMap(isOn);
            if (this.tweenCancelFunction !== undefined) {
                this.tweenCancelFunction();
                this.tweenCancelFunction = undefined;
            }
            if (isOn) {
                this.spawnPinButton.sceneObject.enabled = false;
                this.clearPinsButton.sceneObject.enabled = false;
                this.showCafeButton.sceneObject.enabled = false;
                this.showBarsButton.sceneObject.enabled = false;
                this.showRestaurantsButton.sceneObject.enabled = false;
                this.showAllButton.sceneObject.enabled = false;
                this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                    this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(vec3.lerp(ZOOM_IN_BUTTON_OFFSET_FULL, ZOOM_IN_BUTTON_OFFSET_MINI, t));
                    this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(vec3.lerp(ZOOM_OUT_BUTTON_OFFSET_FULL, ZOOM_OUT_BUTTON_OFFSET_MINI, t));
                    this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(vec3.lerp(CENTER_MAP_BUTTON_OFFSET_FULL, CENTER_MAP_BUTTON_OFFSET_MINI, t));
                    this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(vec3.lerp(TOGGLE_BUTTON_OFFSET_FULL, TOGGLE_BUTTON_OFFSET_MINI, t));
                }, exports.TWEEN_DURATION);
            }
            else {
                this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                    this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(vec3.lerp(ZOOM_IN_BUTTON_OFFSET_MINI, ZOOM_IN_BUTTON_OFFSET_FULL, t));
                    this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(vec3.lerp(ZOOM_OUT_BUTTON_OFFSET_MINI, ZOOM_OUT_BUTTON_OFFSET_FULL, t));
                    this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(vec3.lerp(CENTER_MAP_BUTTON_OFFSET_MINI, CENTER_MAP_BUTTON_OFFSET_FULL, t));
                    this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(vec3.lerp(TOGGLE_BUTTON_OFFSET_MINI, TOGGLE_BUTTON_OFFSET_FULL, t));
                    if (t > 0.99999) {
                        this.spawnPinButton.sceneObject.enabled = true;
                        this.clearPinsButton.sceneObject.enabled = true;
                        this.showCafeButton.sceneObject.enabled = true;
                        this.showBarsButton.sceneObject.enabled = true;
                        this.showRestaurantsButton.sceneObject.enabled = true;
                        this.showAllButton.sceneObject.enabled = true;
                    }
                }, exports.TWEEN_DURATION);
            }
            this.isMiniMap = isOn;
        }
        handleShowCafeButtonPinched(event) {
            this.mapComponent.showNeaybyPlaces([""]);
        }
        handleShowPubsButtonPinched(event) {
            this.mapComponent.showNeaybyPlaces(["", ""]);
        }
        handleShowRestaurantsButtonPinched(event) {
            this.mapComponent.showNeaybyPlaces([""]);
        }
        handleShowAllButtonPinched(event) {
            this.mapComponent.showNeaybyPlaces(null);
        }
        handleAskAIButtonPinched(event) {
            log.i("====================================");
            log.i("ASK AI BUTTON PRESSED!");
            log.i("====================================");
            if (this.aiAssistant) {
                log.i("AI Assistant found, calling askAboutCurrentView()");
                this.aiAssistant.askAboutCurrentView();
            }
            else {
                log.e("ERROR: AIMapAssistant not assigned in MapUIController!");
            }
        }
    };
    __setFunctionName(_classThis, "MapUIController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapUIController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapUIController = _classThis;
})();
exports.MapUIController = MapUIController;
//# sourceMappingURL=MapUIController.js.map