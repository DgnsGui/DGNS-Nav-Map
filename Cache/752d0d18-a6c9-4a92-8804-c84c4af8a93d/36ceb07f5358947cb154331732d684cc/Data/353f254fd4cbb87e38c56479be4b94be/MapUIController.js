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
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
exports.TWEEN_DURATION = 0.3;
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
            this.showAllButton = this.showAllButton;
            this.showRestaurantsButton = this.showRestaurantsButton;
            this.showCafeButton = this.showCafeButton;
            this.showBarsButton = this.showBarsButton;
            this.isUserInteracting = false;
            this.autoRotationStateBeforeInteraction = false;
            this.rotationReEnableTimer = null;
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
            this.showAllButton = this.showAllButton;
            this.showRestaurantsButton = this.showRestaurantsButton;
            this.showCafeButton = this.showCafeButton;
            this.showBarsButton = this.showBarsButton;
            this.isUserInteracting = false;
            this.autoRotationStateBeforeInteraction = false;
            this.rotationReEnableTimer = null;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            if (!this.mapComponent) {
                log.e("MapComponent is not assigned!");
                return;
            }
            this.setupBasicControlButtons();
            this.setupCategoryButtons();
        }
        setupBasicControlButtons() {
            if (this.spawnPinButton)
                this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
            if (this.clearPinsButton)
                this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
            if (this.zoomInButton)
                this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
            if (this.zoomOutButton)
                this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
            if (this.centerMapButton)
                this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
            if (this.toggleMiniMapButton)
                this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
        }
        setupCategoryButtons() {
            if (this.showAllButton)
                this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
            if (this.showRestaurantsButton)
                this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
            if (this.showCafeButton)
                this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
            if (this.showBarsButton)
                this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
        }
        // *** MODIFICATION : ON NE FAIT PLUS DE TRANSFORMATION DE COORDONNÉES ICI ***
        // On passe directement les coordonnées brutes aux fonctions du MapComponent.
        // C'est MapManipulation qui se chargera de la bonne transformation.
        handleMapTouchStart(localPosition) {
            this.startUserInteraction();
            this.mapComponent.startTouch(localPosition);
        }
        handleMapTouchUpdate(localPosition) {
            this.mapComponent.updateTouch(localPosition);
        }
        handleMapTouchEnd(localPosition) {
            this.mapComponent.endTouch(localPosition);
            this.endUserInteraction();
        }
        handleMapHover(localPosition) {
            this.mapComponent.updateHover(localPosition);
        }
        startUserInteraction() {
            if (this.isUserInteracting)
                return;
            this.isUserInteracting = true;
            this.autoRotationStateBeforeInteraction = this.mapComponent.getMinimapAutoRotate();
            if (this.rotationReEnableTimer) {
                this.rotationReEnableTimer.cancel();
                this.rotationReEnableTimer = null;
            }
        }
        endUserInteraction() {
            if (!this.isUserInteracting)
                return;
            this.isUserInteracting = false;
            if (this.autoRotationStateBeforeInteraction) {
                this.rotationReEnableTimer = this.createEvent("DelayedCallbackEvent");
                this.rotationReEnableTimer.bind(() => {
                    if (this.mapComponent && !this.isUserInteracting) {
                        this.mapComponent.setMinimapAutoRotate(true);
                    }
                    this.rotationReEnableTimer = null;
                });
                this.rotationReEnableTimer.reset(0.5);
            }
        }
        handleSpawnPinButtonPinched(event) { this.mapComponent.addPinByLocalPosition(vec2.zero()); }
        handleClearPinsButtonPinched(event) { this.mapComponent.removeMapPins(); }
        handleZoomInButtonPinched(event) { this.startUserInteraction(); this.mapComponent.zoomIn(); this.endUserInteraction(); }
        handleZoomOutButtonPinched(event) { this.startUserInteraction(); this.mapComponent.zoomOut(); this.endUserInteraction(); }
        handleToggleMiniMapButtonPinched(isOn) { this.mapComponent.toggleMiniMap(isOn); }
        handleShowAllButtonPinched(event) { this.searchNearbyPlaces(null, "All Places"); }
        handleShowRestaurantsButtonPinched(event) { this.searchNearbyPlaces(null, "Restaurants"); }
        handleShowCafeButtonPinched(event) { this.searchNearbyPlaces(null, "Cafes"); }
        handleShowBarsButtonPinched(event) { this.searchNearbyPlaces(null, "Bars"); }
        searchNearbyPlaces(categories, searchType) {
            if (!this.mapComponent)
                return;
            this.mapComponent.showNeaybyPlaces(categories);
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