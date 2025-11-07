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
// Use only one set of button positions (full map positions)
const ZOOM_IN_BUTTON_OFFSET = new vec3(22.8488, -32, 2);
const ZOOM_OUT_BUTTON_OFFSET = new vec3(17.5945, -32, 2);
const CENTER_MAP_BUTTON_OFFSET = new vec3(9, -32, 2);
const TOGGLE_BUTTON_OFFSET = new vec3(-31, 32, 2);
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
})(ButtonType || (ButtonType = {}));
const TAG = "[MapUIController]";
const log = new NativeLogger_1.default(TAG);
let MapUIController = class MapUIController extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        // Create update event to continuously enforce positions
        this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
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
        if (this.logObject !== undefined) {
            this.buttonTransforms.push(this.logObject.getTransform());
        }
        // Store original positions
        this.storeOriginalPositions();
        // Set all buttons to their final positions and enable them
        this.initializeButtonPositions();
        this.enableAllButtons();
        // Force position update with multiple delayed callbacks to ensure other scripts don't override
        this.createEvent("DelayedCallbackEvent").bind(() => {
            this.initializeButtonPositions();
        });
        // Add additional delayed callback for extra safety
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.reset(0.1); // 0.1 second delay
        delayedEvent.bind(() => {
            this.initializeButtonPositions();
        });
    }
    storeOriginalPositions() {
        // Store the desired positions
        this.originalPositions[ButtonType.ZOOM_IN] = ZOOM_IN_BUTTON_OFFSET;
        this.originalPositions[ButtonType.ZOOM_OUT] = ZOOM_OUT_BUTTON_OFFSET;
        this.originalPositions[ButtonType.CENTER_MAP] = CENTER_MAP_BUTTON_OFFSET;
        this.originalPositions[ButtonType.TOGGLE_MINI_MAP] = TOGGLE_BUTTON_OFFSET;
    }
    onUpdate() {
        // Continuously enforce button positions to prevent other scripts from moving them
        this.enforceButtonPositions();
    }
    enforceButtonPositions() {
        // Check if positions have drifted and correct them
        if (this.originalPositions.length > 0) {
            const zoomInCurrentPos = this.buttonTransforms[ButtonType.ZOOM_IN].getLocalPosition();
            const zoomOutCurrentPos = this.buttonTransforms[ButtonType.ZOOM_OUT].getLocalPosition();
            const centerMapCurrentPos = this.buttonTransforms[ButtonType.CENTER_MAP].getLocalPosition();
            const toggleCurrentPos = this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].getLocalPosition();
            // Check if positions have drifted significantly (tolerance of 0.1 units)
            const tolerance = 0.1;
            if (zoomInCurrentPos.distance(ZOOM_IN_BUTTON_OFFSET) > tolerance) {
                this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
            }
            if (zoomOutCurrentPos.distance(ZOOM_OUT_BUTTON_OFFSET) > tolerance) {
                this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
            }
            if (centerMapCurrentPos.distance(CENTER_MAP_BUTTON_OFFSET) > tolerance) {
                this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
            }
            if (toggleCurrentPos.distance(TOGGLE_BUTTON_OFFSET) > tolerance) {
                this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
            }
        }
    }
    initializeButtonPositions() {
        // Set buttons to their full-map positions
        this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
        this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
        this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
        this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
        log.d("Button positions initialized - Zoom In: " + ZOOM_IN_BUTTON_OFFSET.toString() +
            ", Zoom Out: " + ZOOM_OUT_BUTTON_OFFSET.toString() +
            ", Center: " + CENTER_MAP_BUTTON_OFFSET.toString());
    }
    enableAllButtons() {
        // Enable all buttons by default
        this.spawnPinButton.sceneObject.enabled = true;
        this.clearPinsButton.sceneObject.enabled = true;
        this.showCafeButton.sceneObject.enabled = true;
        this.showBarsButton.sceneObject.enabled = true;
        this.showRestaurantsButton.sceneObject.enabled = true;
        // Ensure navigation buttons are enabled
        this.zoomInButton.sceneObject.enabled = true;
        this.zoomOutButton.sceneObject.enabled = true;
        this.centerMapButton.sceneObject.enabled = true;
        this.toggleMiniMapButton.sceneObject.enabled = true;
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
        // Call the map component toggle for functionality
        this.mapComponent.toggleMiniMap(isOn);
        // Force button positions to stay in place after toggle
        this.initializeButtonPositions();
    }
    handleShowCafeButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["Coffee"]);
    }
    handleShowPubsButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["Bar", "Pub"]);
    }
    handleShowRestaurantsButtonPinched(event) {
        this.mapComponent.showNeaybyPlaces(["Restaurant"]);
    }
    __initialize() {
        super.__initialize();
        this.originalPositions = [];
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map