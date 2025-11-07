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
        log.i("MapUIController awaking...");
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }
    onStart() {
        log.i("MapUIController starting initialization...");
        // Verify mapComponent is connected
        if (!this.mapComponent) {
            log.e("MapComponent is not assigned! Check Inspector connections.");
            return;
        }
        log.i("MapComponent successfully connected");
        // Setup basic control buttons
        this.setupBasicControlButtons();
        // Setup left side buttons
        this.setupLeftSideButtons();
        // Setup original category buttons
        this.setupOriginalCategoryButtons();
        // Setup right side category buttons
        this.setupRightSideCategoryButtons();
        log.i("MapUIController initialization complete - all buttons configured");
    }
    setupBasicControlButtons() {
        log.i("Setting up basic control buttons...");
        if (this.spawnPinButton) {
            this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
            log.i("Spawn pin button configured");
        }
        else {
            log.w("Spawn pin button not assigned");
        }
        if (this.clearPinsButton) {
            this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
            log.i("Clear pins button configured");
        }
        else {
            log.w("Clear pins button not assigned");
        }
        if (this.zoomInButton) {
            this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
            log.i("Zoom in button configured");
        }
        else {
            log.w("Zoom in button not assigned");
        }
        if (this.zoomOutButton) {
            this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
            log.i("Zoom out button configured");
        }
        else {
            log.w("Zoom out button not assigned");
        }
        if (this.centerMapButton) {
            this.centerMapButton.onButtonPinched.add(() => {
                log.i("Center map button pressed");
                this.mapComponent.centerMap();
            });
            log.i("Center map button configured");
        }
        else {
            log.w("Center map button not assigned");
        }
        if (this.toggleMiniMapButton) {
            this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
            log.i("Toggle minimap button configured");
        }
        else {
            log.w("Toggle minimap button not assigned");
        }
    }
    setupLeftSideButtons() {
        log.i("Setting up left side buttons...");
        if (this.showAllButton) {
            this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
            log.i("Show All button configured");
        }
        else {
            log.w("Show All button not assigned - check Inspector connections");
        }
        if (this.showSnacksButton) {
            this.showSnacksButton.onButtonPinched.add(this.handleShowSnacksButtonPinched.bind(this));
            log.i("Show Snacks button configured");
        }
        else {
            log.w("Show Snacks button not assigned - check Inspector connections");
        }
        if (this.showShopsButton) {
            this.showShopsButton.onButtonPinched.add(this.handleShowShopsButtonPinched.bind(this));
            log.i("Show Shops button configured");
        }
        else {
            log.w("Show Shops button not assigned - check Inspector connections");
        }
    }
    setupOriginalCategoryButtons() {
        log.i("Setting up original category buttons...");
        if (this.showCafeButton) {
            this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
            log.i("Show Cafe button configured");
        }
        else {
            log.w("Show Cafe button not assigned");
        }
        if (this.showBarsButton) {
            this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
            log.i("Show Bars button configured");
        }
        else {
            log.w("Show Bars button not assigned");
        }
        if (this.showRestaurantsButton) {
            this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
            log.i("Show Restaurants button configured");
        }
        else {
            log.w("Show Restaurants button not assigned");
        }
    }
    setupRightSideCategoryButtons() {
        log.i("Setting up right side category buttons...");
        if (this.showScenicButton) {
            this.showScenicButton.onButtonPinched.add(this.handleShowScenicButtonPinched.bind(this));
            log.i("Show Scenic button configured");
        }
        else {
            log.w("Show Scenic button not assigned - check Inspector connections");
        }
        if (this.showBarbersButton) {
            this.showBarbersButton.onButtonPinched.add(this.handleShowBarbersButtonPinched.bind(this));
            log.i("Show Barbers button configured");
        }
        else {
            log.w("Show Barbers button not assigned - check Inspector connections");
        }
        if (this.showSkateparksButton) {
            this.showSkateparksButton.onButtonPinched.add(this.handleShowSkateparksButtonPinched.bind(this));
            log.i("Show Skateparks button configured");
        }
        else {
            log.w("Show Skateparks button not assigned - check Inspector connections");
        }
        if (this.showAirportsButton) {
            this.showAirportsButton.onButtonPinched.add(this.handleShowAirportsButtonPinched.bind(this));
            log.i("Show Airports button configured");
        }
        else {
            log.w("Show Airports button not assigned - check Inspector connections");
        }
        if (this.showLibrariesButton) {
            this.showLibrariesButton.onButtonPinched.add(this.handleShowLibrariesButtonPinched.bind(this));
            log.i("Show Libraries button configured");
        }
        else {
            log.w("Show Libraries button not assigned - check Inspector connections");
        }
        if (this.showParksButton) {
            this.showParksButton.onButtonPinched.add(this.handleShowParksButtonPinched.bind(this));
            log.i("Show Parks button configured");
        }
        else {
            log.w("Show Parks button not assigned - check Inspector connections");
        }
    }
    // Basic control button handlers
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
        this.mapComponent.zoomIn();
    }
    handleZoomOutButtonPinched(event) {
        log.i("Zoom out button pressed");
        this.mapComponent.zoomOut();
    }
    handleToggleMiniMapButtonPinched(isOn) {
        log.i("Toggle minimap button pressed - state: " + isOn);
        this.mapComponent.toggleMiniMap(isOn);
    }
    // Left side button handlers with comprehensive logging
    handleShowAllButtonPinched(event) {
        log.i("=== SHOW ALL BUTTON PRESSED ===");
        log.i("Attempting to show all types of places");
        const categories = [
            "restaurant", "cafe", "bar", "store", "shopping_mall",
            "gas_station", "bank", "hospital", "pharmacy", "park",
            "food", "point_of_interest"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "All Places");
    }
    handleShowSnacksButtonPinched(event) {
        log.i("=== SHOW SNACKS BUTTON PRESSED ===");
        log.i("Attempting to show snack places");
        const categories = [
            "convenience_store", "bakery", "meal_takeaway", "food",
            "grocery_or_supermarket", "store"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Snacks");
    }
    handleShowShopsButtonPinched(event) {
        log.i("=== SHOW SHOPS BUTTON PRESSED ===");
        log.i("Attempting to show shops");
        const categories = [
            "store", "shopping_mall", "clothing_store", "electronics_store",
            "grocery_or_supermarket", "hardware_store", "department_store"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Shops");
    }
    // Original category button handlers with improved categories and logging
    handleShowCafeButtonPinched(event) {
        log.i("=== SHOW CAFE BUTTON PRESSED ===");
        const categories = ["cafe", "meal_takeaway", "bakery"];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Cafes");
    }
    handleShowBarsButtonPinched(event) {
        log.i("=== SHOW BARS BUTTON PRESSED ===");
        const categories = ["bar", "night_club", "liquor_store"];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Bars");
    }
    handleShowRestaurantsButtonPinched(event) {
        log.i("=== SHOW RESTAURANTS BUTTON PRESSED ===");
        const categories = ["restaurant", "meal_delivery", "food"];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Restaurants");
    }
    // Right side category button handlers with comprehensive logging
    handleShowScenicButtonPinched(event) {
        log.i("=== SHOW SCENIC BUTTON PRESSED ===");
        const categories = [
            "tourist_attraction", "museum", "amusement_park", "zoo",
            "aquarium", "art_gallery", "park", "natural_feature"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Scenic Places");
    }
    handleShowBarbersButtonPinched(event) {
        log.i("=== SHOW BARBERS BUTTON PRESSED ===");
        const categories = ["hair_care", "beauty_salon", "spa"];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Barbers & Beauty");
    }
    handleShowSkateparksButtonPinched(event) {
        log.i("=== SHOW SKATEPARKS BUTTON PRESSED ===");
        const categories = [
            "gym", "stadium", "bowling_alley", "amusement_park", "park"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Recreation");
    }
    handleShowAirportsButtonPinched(event) {
        log.i("=== SHOW AIRPORTS BUTTON PRESSED ===");
        const categories = [
            "airport", "travel_agency", "bus_station", "subway_station", "train_station"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Transportation");
    }
    handleShowLibrariesButtonPinched(event) {
        log.i("=== SHOW LIBRARIES BUTTON PRESSED ===");
        const categories = ["library", "book_store", "university", "school"];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Libraries & Books");
    }
    handleShowParksButtonPinched(event) {
        log.i("=== SHOW PARKS BUTTON PRESSED ===");
        const categories = [
            "park", "campground", "rv_park", "natural_feature", "zoo"
        ];
        log.i("Categories to search: " + categories.join(", "));
        this.searchNearbyPlaces(categories, "Parks & Outdoors");
    }
    // Centralized method for searching nearby places with comprehensive logging
    searchNearbyPlaces(categories, searchType) {
        try {
            log.i("--- Starting search for: " + searchType + " ---");
            // Check if mapComponent is available
            if (!this.mapComponent) {
                log.e("MapComponent is null! Cannot perform search.");
                return;
            }
            // Get and log user location
            const userLocation = this.mapComponent.getUserLocation();
            if (userLocation) {
                log.i("User location - Lat: " + userLocation.latitude.toFixed(6) +
                    ", Lng: " + userLocation.longitude.toFixed(6) +
                    ", Alt: " + userLocation.altitude.toFixed(2));
                log.i("User heading: " + this.mapComponent.getUserHeading().toFixed(2) + " radians");
            }
            else {
                log.e("User location is null! GPS may not be available.");
                return;
            }
            // Check if map is properly initialized
            if (!this.mapComponent.isMapCentered()) {
                log.w("Map may not be properly centered yet");
            }
            // Log search parameters
            log.i("Search parameters:");
            log.i("  - Categories: " + categories.join(", "));
            log.i("  - Number of categories: " + categories.length);
            // Perform the search
            log.i("Calling mapComponent.showNeaybyPlaces()...");
            this.mapComponent.showNeaybyPlaces(categories);
            log.i("Search request sent successfully for: " + searchType);
        }
        catch (error) {
            log.e("Error during search for " + searchType + ": " + error);
        }
    }
    // Debug method to test a single simple category
    testSimpleSearch() {
        log.i("=== TESTING SIMPLE SEARCH ===");
        this.searchNearbyPlaces(["restaurant"], "Test Restaurant Search");
    }
    // Debug method to log all button states
    logButtonStates() {
        log.i("=== BUTTON CONNECTION STATES ===");
        log.i("Basic controls:");
        log.i("  spawnPinButton: " + (this.spawnPinButton ? "Connected" : "NOT CONNECTED"));
        log.i("  clearPinsButton: " + (this.clearPinsButton ? "Connected" : "NOT CONNECTED"));
        log.i("  zoomInButton: " + (this.zoomInButton ? "Connected" : "NOT CONNECTED"));
        log.i("  zoomOutButton: " + (this.zoomOutButton ? "Connected" : "NOT CONNECTED"));
        log.i("  centerMapButton: " + (this.centerMapButton ? "Connected" : "NOT CONNECTED"));
        log.i("  toggleMiniMapButton: " + (this.toggleMiniMapButton ? "Connected" : "NOT CONNECTED"));
        log.i("Left side buttons:");
        log.i("  showAllButton: " + (this.showAllButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showSnacksButton: " + (this.showSnacksButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showShopsButton: " + (this.showShopsButton ? "Connected" : "NOT CONNECTED"));
        log.i("Original category buttons:");
        log.i("  showCafeButton: " + (this.showCafeButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showBarsButton: " + (this.showBarsButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showRestaurantsButton: " + (this.showRestaurantsButton ? "Connected" : "NOT CONNECTED"));
        log.i("Right side buttons:");
        log.i("  showScenicButton: " + (this.showScenicButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showBarbersButton: " + (this.showBarbersButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showSkateparksButton: " + (this.showSkateparksButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showAirportsButton: " + (this.showAirportsButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showLibrariesButton: " + (this.showLibrariesButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showParksButton: " + (this.showParksButton ? "Connected" : "NOT CONNECTED"));
        log.i("MapComponent: " + (this.mapComponent ? "Connected" : "NOT CONNECTED"));
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map