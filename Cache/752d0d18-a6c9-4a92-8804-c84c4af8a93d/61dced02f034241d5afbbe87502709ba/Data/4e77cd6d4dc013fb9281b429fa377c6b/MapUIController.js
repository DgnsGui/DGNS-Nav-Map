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
        log.i("MapUIController starting...");
        if (!this.mapComponent) {
            log.e("MapComponent is not assigned!");
            return;
        }
        log.i("Setting up buttons...");
        this.setupBasicControlButtons();
        this.setupCategoryButtons();
        log.i("MapUIController initialized successfully");
    }
    setupBasicControlButtons() {
        if (this.spawnPinButton) {
            this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
            log.i("Spawn pin button configured");
        }
        if (this.clearPinsButton) {
            this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
            log.i("Clear pins button configured");
        }
        if (this.zoomInButton) {
            this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
            log.i("Zoom in button configured");
        }
        if (this.zoomOutButton) {
            this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
            log.i("Zoom out button configured");
        }
        if (this.centerMapButton) {
            this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
            log.i("Center map button configured");
        }
        if (this.toggleMiniMapButton) {
            this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
            log.i("Toggle minimap button configured");
        }
    }
    setupCategoryButtons() {
        if (this.showAllButton) {
            this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
            log.i("Show all button configured");
        }
        if (this.showRestaurantsButton) {
            this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
            log.i("Show restaurants button configured");
        }
        if (this.showCafeButton) {
            this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
            log.i("Show cafe button configured");
        }
        if (this.showBarsButton) {
            this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
            log.i("Show bars button configured");
        }
    }
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
    handleSpawnPinButtonPinched(event) {
        log.i("Spawn pin button pressed");
        this.mapComponent.addPinByLocalPosition(vec2.zero());
    }
    handleClearPinsButtonPinched(event) {
        log.i("Clear pins button pressed");
        this.mapComponent.removeMapPins();
    }
    handleZoomInButtonPinched(event) {
        log.i("Zoom in button pressed");
        this.startUserInteraction();
        this.mapComponent.zoomIn();
        this.endUserInteraction();
    }
    handleZoomOutButtonPinched(event) {
        log.i("Zoom out button pressed");
        this.startUserInteraction();
        this.mapComponent.zoomOut();
        this.endUserInteraction();
    }
    handleToggleMiniMapButtonPinched(isOn) {
        log.i(`Toggle minimap: ${isOn}`);
        this.mapComponent.toggleMiniMap(isOn);
    }
    handleShowAllButtonPinched(event) {
        log.i("Show all places button pressed");
        this.searchNearbyPlaces([], "All Places");
    }
    handleShowRestaurantsButtonPinched(event) {
        log.i("Show restaurants button pressed");
        this.searchNearbyPlaces(["restaurant"], "Restaurants");
    }
    handleShowCafeButtonPinched(event) {
        log.i("Show cafe button pressed");
        this.searchNearbyPlaces(["cafe"], "Cafes");
    }
    handleShowBarsButtonPinched(event) {
        log.i("Show bars button pressed");
        this.searchNearbyPlaces(["bar"], "Bars");
    }
    searchNearbyPlaces(categories, searchType) {
        log.i(`Searching for nearby places: ${searchType}, categories: ${categories}`);
        if (!this.mapComponent) {
            log.e("MapComponent is null - cannot search places");
            return;
        }
        // Vérifier que l'utilisateur a une position
        const userLocation = this.mapComponent.getUserLocation();
        if (!userLocation) {
            log.w("User location not available - cannot search places");
            return;
        }
        log.i(`User location: lat=${userLocation.latitude}, lon=${userLocation.longitude}`);
        try {
            this.mapComponent.showNeaybyPlaces(categories);
            log.i("Place search initiated successfully");
        }
        catch (error) {
            log.e(`Error searching places: ${error}`);
        }
    }
    // Méthode pour tester manuellement la fonctionnalité
    testPlacesSearch() {
        log.i("Testing places search manually...");
        this.searchNearbyPlaces(["restaurant"], "Test Restaurants");
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