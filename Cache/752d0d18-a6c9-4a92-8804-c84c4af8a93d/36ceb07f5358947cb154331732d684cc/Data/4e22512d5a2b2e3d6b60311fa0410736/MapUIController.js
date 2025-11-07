"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapUIController = exports.TWEEN_DURATION = void 0;
var __selfType = requireType("./MapUIController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
exports.TWEEN_DURATION = 0.3;
const TAG = "[MapUIController]";
const log = new NativeLogger_1.default(TAG);
let MapUIController = class MapUIController extends BaseScriptComponent {
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
    __initialize() {
        super.__initialize();
        this.isUserInteracting = false;
        this.autoRotationStateBeforeInteraction = false;
        this.rotationReEnableTimer = null;
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map