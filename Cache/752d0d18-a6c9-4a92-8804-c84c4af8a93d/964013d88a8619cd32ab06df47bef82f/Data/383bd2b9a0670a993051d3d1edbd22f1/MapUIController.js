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
        // Setup remaining category buttons
        this.setupCategoryButtons();
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
    setupCategoryButtons() {
        log.i("Setting up category buttons...");
        if (this.showAllButton) {
            this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
            log.i("Show All button configured");
        }
        else {
            log.w("Show All button not assigned - check Inspector connections");
        }
        if (this.showCafeButton) {
            this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
            log.i("Show Cafe button configured");
        }
        else {
            log.w("Show Cafe button not assigned");
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
    // Category button handlers
    handleShowAllButtonPinched(event) {
        log.i("=== SHOW ALL BUTTON PRESSED ===");
        log.i("Testing with null categories to retrieve all places");
        this.searchNearbyPlaces(null, "All Places");
    }
    handleShowCafeButtonPinched(event) {
        log.i("=== SHOW CAFE BUTTON PRESSED ===");
        log.i("Testing with null categories - will filter results programmatically later");
        this.searchNearbyPlaces(null, "Cafes (All Places)");
    }
    // Centralized method for searching nearby places
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
            if (categories === null) {
                log.i("  - Categories: null (will retrieve all available places)");
            }
            else {
                log.i("  - Categories: " + categories.join(", "));
                log.i("  - Number of categories: " + categories.length);
            }
            // Perform the search with null parameter
            log.i("Calling mapComponent.showNeaybyPlaces() with categories: " +
                (categories === null ? "null" : categories.join(", ")));
            this.mapComponent.showNeaybyPlaces(categories);
            log.i("Search request sent successfully for: " + searchType);
        }
        catch (error) {
            log.e("Error during search for " + searchType + ": " + error);
        }
    }
    // Debug method to test a single simple search with null
    testSimpleSearch() {
        log.i("=== TESTING SIMPLE SEARCH WITH NULL ===");
        this.searchNearbyPlaces(null, "Test Null Search - All Places");
    }
    // Alternative test method with specific category (if needed)
    testSpecificCategorySearch() {
        log.i("=== TESTING SPECIFIC CATEGORY SEARCH ===");
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
        log.i("Category buttons:");
        log.i("  showAllButton: " + (this.showAllButton ? "Connected" : "NOT CONNECTED"));
        log.i("  showCafeButton: " + (this.showCafeButton ? "Connected" : "NOT CONNECTED"));
        log.i("MapComponent: " + (this.mapComponent ? "Connected" : "NOT CONNECTED"));
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map