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
// Export the constant that other files are importing
exports.TWEEN_DURATION = 0.3;
const TAG = "[MapUIController]";
const log = new NativeLogger_1.default(TAG);
let MapUIController = class MapUIController extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }
    onStart() {
        // Setup button callbacks only - no position manipulation
        this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
        this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
        this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
        this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
        this.centerMapButton.onButtonPinched.add(() => {
            this.mapComponent.centerMap();
        });
        this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
        // Original buttons with proper categories
        this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
        this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
        this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
        // New buttons for your 7 categories
        if (this.showScenicButton) {
            this.showScenicButton.onButtonPinched.add(this.handleShowScenicButtonPinched.bind(this));
        }
        if (this.showBarbersButton) {
            this.showBarbersButton.onButtonPinched.add(this.handleShowBarbersButtonPinched.bind(this));
        }
        if (this.showSkateparksButton) {
            this.showSkateparksButton.onButtonPinched.add(this.handleShowSkateparksButtonPinched.bind(this));
        }
        if (this.showAirportsButton) {
            this.showAirportsButton.onButtonPinched.add(this.handleShowAirportsButtonPinched.bind(this));
        }
        if (this.showLibrariesButton) {
            this.showLibrariesButton.onButtonPinched.add(this.handleShowLibrariesButtonPinched.bind(this));
        }
        if (this.showParksButton) {
            this.showParksButton.onButtonPinched.add(this.handleShowParksButtonPinched.bind(this));
        }
        log.i("MapUIController initialized - buttons ready");
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
        log.i("Toggling minimap " + isOn);
        this.mapComponent.toggleMiniMap(isOn);
    }
    // Fixed original buttons with proper Snap Places API categories
    handleShowCafeButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["cafe", "coffee_shop"]);
    }
    handleShowBarsButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["bar", "night_club", "pub"]);
    }
    handleShowRestaurantsButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["restaurant", "food"]);
    }
    // New handlers for your 7 categories
    handleShowScenicButtonPinched(event) {
        // 1: Lieu scenique
        this.mapComponent.showNeaybyPlaces(["tourist_attraction", "park", "landmark", "point_of_interest"]);
    }
    handleShowBarbersButtonPinched(event) {
        // 3: Barbiers, coiffeurs et esthetique  
        this.mapComponent.showNeaybyPlaces(["hair_care", "beauty_salon", "spa"]);
    }
    handleShowSkateparksButtonPinched(event) {
        // 4: Skatepark, Skateshops, lieux de la culture ride
        this.mapComponent.showNeaybyPlaces(["sporting_goods_store", "park", "recreation"]);
    }
    handleShowAirportsButtonPinched(event) {
        // 5: Aeroports, aerodromes, agences de voyages
        this.mapComponent.showNeaybyPlaces(["airport", "travel_agency"]);
    }
    handleShowLibrariesButtonPinched(event) {
        // 6: Libraire, Librairie, Ludotheque
        this.mapComponent.showNeaybyPlaces(["library", "book_store"]);
    }
    handleShowParksButtonPinched(event) {
        // 7: Parcs, Campings aire de plein air
        this.mapComponent.showNeaybyPlaces(["park", "campground", "rv_park"]);
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map