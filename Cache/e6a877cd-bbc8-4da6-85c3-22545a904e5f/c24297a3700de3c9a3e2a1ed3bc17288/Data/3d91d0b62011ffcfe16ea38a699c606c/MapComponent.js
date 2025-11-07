"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapComponent = void 0;
var __selfType = requireType("./MapComponent");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const MapUtils_1 = require("./MapUtils");
let MapComponent = class MapComponent extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }
    onStart() {
        const mapComponentInstance = this.componentPrefab.instantiate(this.getSceneObject());
        this.mapController = (0, MapUtils_1.findScriptComponent)(mapComponentInstance, "isMapComponent");
        let mapLocation = null;
        if (this.setMapToCustomLocation) {
            mapLocation = GeoPosition.create();
            mapLocation.longitude = parseFloat(this.longitude);
            mapLocation.latitude = parseFloat(this.latitude);
            mapLocation.heading = this.rotation;
        }
        const mapFocusPosition = new vec2(0.5, 0.5);
        const mapParameters = {
            tileCount: this.tileCount,
            renderParent: this.mapRenderParent,
            mapUpdateThreshold: this.mapUpdateThreshold,
            setMapToCustomLocation: this.setMapToCustomLocation,
            mapLocation: mapLocation,
            mapFocusPosition: mapFocusPosition,
            userPinVisual: this.userPinVisual,
            showUserPin: this.showUserPin,
            zoomLevel: this.mapZoomLevel,
            zoomOffet: (0, MapUtils_1.calculateZoomOffset)(this.mapZoomLevel),
            enableScrolling: this.enableScrolling,
            scrollingFriction: this.scrollingFriction,
            userPinScale: this.userPinScale,
            mapPinsRotated: this.mapPinsRotated,
            isMinimapAutoRotate: this.isMinimapAutoRotate,
            userPinAlignedWithOrientation: this.userPinAlignedWithOrientation,
            enableMapSmoothing: this.enableMapSmoothing,
            mapPinPrefab: this.mapPinPrefab,
            mapPinCursorDetectorSize: this.mapPinCursorDetectorSize,
        };
        this.mapController.initialize(mapParameters, this.startedAsMiniMap);
        if (this.autoRotateToggleButton) {
            this.setupAutoRotateToggleButton();
        }
    }
    setupAutoRotateToggleButton() {
        if (this.autoRotateToggleButton) {
            this.autoRotateToggleButton.onButtonPinched.add(this.handleAutoRotateToggle.bind(this));
        }
    }
    handleAutoRotateToggle(event) {
        this.isMinimapAutoRotate = !this.isMinimapAutoRotate;
        if (this.mapController) {
            this.mapController.setMinimapAutoRotate(this.isMinimapAutoRotate);
            if (this.isMinimapAutoRotate) {
                this.mapController.centerMap();
            }
        }
    }
    setMinimapAutoRotate(enabled) {
        this.isMinimapAutoRotate = enabled;
        if (this.mapController) {
            this.mapController.setMinimapAutoRotate(enabled);
        }
    }
    getMinimapAutoRotate() {
        return this.isMinimapAutoRotate;
    }
    // #region Exposed functions
    // =====
    // #region subscribe callbacks
    subscribeOnMaptilesLoaded(fn) {
        this.mapController.onMapTilesLoaded.add(fn);
    }
    subscribeOnInitialLocationSet(fn) {
        this.mapController.onInitialLocationSet.add(fn);
    }
    subscribeOnUserLocationFirstSet(fn) {
        this.mapController.onUserLocationSet.add(fn);
    }
    subscribeOnTileCameIntoView(fn) {
        this.mapController.onTileCameIntoView.add(fn);
    }
    subscribeOnTileWentOutOfView(fn) {
        this.mapController.onTileWentOutOfView.add(fn);
    }
    subscribeOnMapCentered(fn) {
        this.mapController.onMapCentered.add(fn);
    }
    subscribeOnMapAddPin(fn) {
        this.mapController.onMapPinAdded.add(fn);
    }
    subscribeOnMapPinRemoved(fn) {
        this.mapController.onMapPinRemoved.add(fn);
    }
    subscribeOnAllMapPinsRemoved(fn) {
        this.mapController.onAllMapPinsRemoved.add(fn);
    }
    subscribeOnMapScrolled(fn) {
        this.mapController.onMapScrolled.add(fn);
    }
    subscribeOnNoNearbyPlacesFound(fn) {
        this.mapController.onNoNearbyPlacesFound.add(fn);
    }
    subscribeOnNearbyPlacesFailed(fn) {
        this.mapController.onNearbyPlacesFailed.add(fn);
    }
    // #endregion
    getInitialMapTileLocation() {
        return this.mapController.getInitialMapTileLocation();
    }
    setUserPinRotated(value) {
        this.mapController.setUserPinRotated(value);
    }
    setMapScrolling(value) {
        this.mapController.setMapScrolling(value);
    }
    getUserLocation() {
        return this.mapController.getUserLocation();
    }
    getUserHeading() {
        return this.mapController.getUserHeading();
    }
    getUserOrientation() {
        return this.mapController.getUserOrientation();
    }
    createMapPin(longitude, latitude) {
        const location = GeoPosition.create();
        location.longitude = longitude;
        location.latitude = latitude;
        return this.mapController.createMapPin(location);
    }
    createMapPinAtUserLocation() {
        return this.mapController.createMapPinAtUserLocation();
    }
    addPinByLocalPosition(localPosition) {
        return this.mapController.addPinByLocalPosition(localPosition);
    }
    removeMapPin(mapPin) {
        this.mapController.removeMapPin(mapPin);
    }
    removeMapPins() {
        this.mapController.removeMapPins();
    }
    centerMap() {
        if (this.mapController) {
            this.mapController.centerMap();
        }
    }
    showNeaybyPlaces(categoryName) {
        this.mapController.showNearbyPlaces(categoryName);
    }
    isMapCentered() {
        return this.mapController.isMapCentered();
    }
    updateHover(localPosition) {
        this.mapController.handleHoverUpdate(localPosition);
    }
    startTouch(localPosition) {
        this.mapController.handleTouchStart(localPosition);
    }
    updateTouch(localPosition) {
        this.mapController.handleTouchUpdate(localPosition);
    }
    endTouch(localPosition) {
        this.mapController.handleTouchEnd(localPosition);
    }
    zoomIn() {
        this.mapController.handleZoomIn();
    }
    zoomOut() {
        this.mapController.handleZoomOut();
    }
    toggleMiniMap(isOn) {
        this.mapController.toggleMiniMap(isOn);
        this.onMiniMapToggledEvent.invoke(isOn);
    }
    drawGeometryPoint(geometry, radius) {
        this.mapController.drawGeometryPoint(geometry, radius);
    }
    drawGeometryLine(geometry, thickness) {
        this.mapController.drawGeometryLine(geometry, thickness);
    }
    drawGeometryMultiline(geometry, thickness) {
        this.mapController.drawGeometryMultiline(geometry, thickness);
    }
    clearGeometry() {
        this.mapController.clearGeometry();
    }
    __initialize() {
        super.__initialize();
        this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
        this.onMiniMapToggledEvent = new Event_1.default();
        this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
    }
};
exports.MapComponent = MapComponent;
exports.MapComponent = MapComponent = __decorate([
    component
], MapComponent);
//# sourceMappingURL=MapComponent.js.map