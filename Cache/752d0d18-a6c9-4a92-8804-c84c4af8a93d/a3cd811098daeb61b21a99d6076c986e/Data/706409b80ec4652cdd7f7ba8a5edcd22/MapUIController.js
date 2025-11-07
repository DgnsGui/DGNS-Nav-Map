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
})(ButtonType || (ButtonType = {}));
const TAG = "[MapUIController]";
const log = new NativeLogger_1.default(TAG);
let MapUIController = class MapUIController extends BaseScriptComponent {
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
        if (this.isMiniMap) {
            this.spawnPinButton.sceneObject.enabled = false;
            this.clearPinsButton.sceneObject.enabled = false;
            this.showCafeButton.sceneObject.enabled = false;
            this.showBarsButton.sceneObject.enabled = false;
            this.showRestaurantsButton.sceneObject.enabled = false;
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
                }
            }, exports.TWEEN_DURATION);
        }
        this.isMiniMap = isOn;
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
        this.isMiniMap = true;
    }
};
exports.MapUIController = MapUIController;
exports.MapUIController = MapUIController = __decorate([
    component
], MapUIController);
//# sourceMappingURL=MapUIController.js.map