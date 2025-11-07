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
        // Désactiver l'événement d'update pour le moment
        // this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
        log.i("MapUIController awakened");
    }
    onStart() {
        log.i("MapUIController starting...");
        this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
        this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
        this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
        this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
        this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
        // Temporairement désactiver le toggle pour isoler le problème
        // this.toggleMiniMapButton.onStateChanged.add(
        //   this.handleToggleMiniMapButtonPinched.bind(this)
        // );
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
        // Log current positions before any changes
        this.logCurrentPositions("BEFORE initialization");
        // Set positions immediately
        this.forceButtonPositions();
        // Log positions after changes
        this.logCurrentPositions("AFTER initialization");
        this.enableAllButtons();
        // Multiple delayed attempts to ensure positions stick
        this.schedulePositionEnforcement();
    }
    logCurrentPositions(context) {
        log.i(`=== ${context} ===`);
        log.i(`Zoom In actual position: ${this.buttonTransforms[ButtonType.ZOOM_IN].getLocalPosition().toString()}`);
        log.i(`Zoom Out actual position: ${this.buttonTransforms[ButtonType.ZOOM_OUT].getLocalPosition().toString()}`);
        log.i(`Center Map actual position: ${this.buttonTransforms[ButtonType.CENTER_MAP].getLocalPosition().toString()}`);
        log.i(`Toggle actual position: ${this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].getLocalPosition().toString()}`);
        log.i(`=================`);
    }
    schedulePositionEnforcement() {
        // Schedule multiple position enforcements at different intervals
        const intervals = [0.1, 0.2, 0.5, 1.0, 2.0];
        intervals.forEach((delay, index) => {
            const delayedEvent = this.createEvent("DelayedCallbackEvent");
            delayedEvent.reset(delay);
            delayedEvent.bind(() => {
                log.i(`Enforcing positions at ${delay}s delay`);
                this.forceButtonPositions();
                this.logCurrentPositions(`After ${delay}s enforcement`);
            });
        });
    }
    forceButtonPositions() {
        this.isInitializing = true;
        try {
            // Force positions using both local and world transforms
            log.i("Setting Zoom In position to: " + ZOOM_IN_BUTTON_OFFSET.toString());
            this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
            log.i("Setting Zoom Out position to: " + ZOOM_OUT_BUTTON_OFFSET.toString());
            this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
            log.i("Setting Center Map position to: " + CENTER_MAP_BUTTON_OFFSET.toString());
            this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
            log.i("Setting Toggle position to: " + TOGGLE_BUTTON_OFFSET.toString());
            this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
            // Alternative: Try setting world positions if local positions don't work
            // const parentTransform = this.buttonTransforms[ButtonType.ZOOM_IN].getParent();
            // if (parentTransform) {
            //   const worldPos = parentTransform.getWorldTransform().multiplyPoint(ZOOM_IN_BUTTON_OFFSET);
            //   this.buttonTransforms[ButtonType.ZOOM_IN].setWorldPosition(worldPos);
            // }
        }
        catch (error) {
            log.e("Error setting button positions: " + error.toString());
        }
        this.isInitializing = false;
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
        log.i("All buttons enabled");
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
        // Don't move buttons - they should stay in place
        log.i("Toggle completed, buttons should remain in place");
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
        this.isInitializing = false;
        this.frameCount = 0;
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map