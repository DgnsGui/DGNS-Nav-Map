"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapComponent = void 0;
var __selfType = requireType("./MapComponentBackup");
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
    }
    // #region Exposed functions
    // =====
    // #region subscribe callbacks
    /**
     * Setting function to call when all the initial map tiles are loaded
     */
    subscribeOnMaptilesLoaded(fn) {
        this.mapController.onMapTilesLoaded.add(fn);
    }
    /**
     * Setting function to call when the initial location of the map is set
     */
    subscribeOnInitialLocationSet(fn) {
        this.mapController.onInitialLocationSet.add(fn);
    }
    /**
     * Setting function to call when the user location is set in the first time
     */
    subscribeOnUserLocationFirstSet(fn) {
        this.mapController.onUserLocationSet.add(fn);
    }
    /**
     * Setting function to call when new tile comes into the view
     */
    subscribeOnTileCameIntoView(fn) {
        this.mapController.onTileCameIntoView.add(fn);
    }
    /**
     * Setting function to call when tile goes out of the view
     */
    subscribeOnTileWentOutOfView(fn) {
        this.mapController.onTileWentOutOfView.add(fn);
    }
    /**
     * Setting function to call when the map is centered
     */
    subscribeOnMapCentered(fn) {
        this.mapController.onMapCentered.add(fn);
    }
    /**
     * Setting function to call when a new map pin is added
     */
    subscribeOnMapAddPin(fn) {
        this.mapController.onMapPinAdded.add(fn);
    }
    /**
     * Setting function to call when a map pin is removed
     */
    subscribeOnMapPinRemoved(fn) {
        this.mapController.onMapPinRemoved.add(fn);
    }
    /**
     * Setting function to call when all map pins are
     * removed from the map
     */
    subscribeOnAllMapPinsRemoved(fn) {
        this.mapController.onAllMapPinsRemoved.add(fn);
    }
    /**
     * Setting function to call when the map is scrolled
     */
    subscribeOnMapScrolled(fn) {
        this.mapController.onMapScrolled.add(fn);
    }
    /**
     * Setting function to call when no nearby places are found
     */
    subscribeOnNoNearbyPlacesFound(fn) {
        this.mapController.onNoNearbyPlacesFound.add(fn);
    }
    /**
     * Setting function to call when nearby places call fails
     */
    subscribeOnNearbyPlacesFailed(fn) {
        this.mapController.onNearbyPlacesFailed.add(fn);
    }
    // #endregion
    /**
     * Return the initial map location (middle tile)
     */
    getInitialMapTileLocation() {
        return this.mapController.getInitialMapTileLocation();
    }
    /**
     * Setting if the user pin should be rotated with user orientation
     */
    setUserPinRotated(value) {
        this.mapController.setUserPinRotated(value);
    }
    /**
     * For enabling/disabling scrolling of the map from script
     */
    setMapScrolling(value) {
        this.mapController.setMapScrolling(value);
    }
    /**
     * Return the user location
     */
    getUserLocation() {
        return this.mapController.getUserLocation();
    }
    /**
     * Return the user heading angle in radians
     */
    getUserHeading() {
        return this.mapController.getUserHeading();
    }
    /**
     * Return the user orientation in quaternion.
     * Gradually becomes north-aligned when GNSS signal is available
     */
    getUserOrientation() {
        return this.mapController.getUserOrientation();
    }
    /**
     * Create a new map pin with the given longitude and latitude
     */
    createMapPin(longitude, latitude) {
        const location = GeoPosition.create();
        location.longitude = longitude;
        location.latitude = latitude;
        return this.mapController.createMapPin(location);
    }
    /**
     * Create a new map pin at the user location
     */
    createMapPinAtUserLocation() {
        return this.mapController.createMapPinAtUserLocation();
    }
    /**
     * Add a map pin to the map by local position.
     * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
     */
    addPinByLocalPosition(localPosition) {
        return this.mapController.addPinByLocalPosition(localPosition);
    }
    /**
     * For removing a map pin from the map
     */
    removeMapPin(mapPin) {
        this.mapController.removeMapPin(mapPin);
    }
    /**
     * For removing all map pins from map
     */
    removeMapPins() {
        this.mapController.removeMapPins();
    }
    /**
     * Centering map to intial location
     */
    centerMap() {
        if (this.mapController != undefined) {
            this.mapController.centerMap();
        }
    }
    /**
     * Create map pins for nearby places with the given category name
     * Currently the range is 100m from the user location
     */
    showNeaybyPlaces(categoryName) {
        this.mapController.showNearbyPlaces(categoryName);
    }
    /**
     * Return true if the map is centered
     */
    isMapCentered() {
        return this.mapController.isMapCentered();
    }
    /**
     * Update the hover position on the map to detect the hovered map pin
     * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
     */
    updateHover(localPosition) {
        this.mapController.handleHoverUpdate(localPosition);
    }
    /**
     * Start touch on the map for map scrolling
     * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
     */
    startTouch(localPosition) {
        this.mapController.handleTouchStart(localPosition);
    }
    /**
     * Update touch on the map for map scrolling
     * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
     */
    updateTouch(localPosition) {
        this.mapController.handleTouchUpdate(localPosition);
    }
    /**
     * End touch on the map for map scrolling
     * @param localPosition (0, 0) is the center of the map while (1, 1) is the top right corner and (-1, -1) is the bottom left corner
     */
    endTouch(localPosition) {
        this.mapController.handleTouchEnd(localPosition);
    }
    /**
     * Zooming in the map
     */
    zoomIn() {
        this.mapController.handleZoomIn();
    }
    /**
     * Zooming out the map
     */
    zoomOut() {
        this.mapController.handleZoomOut();
    }
    /**
     * Toggling between mini map and full map
     */
    toggleMiniMap(isOn) {
        this.mapController.toggleMiniMap(isOn);
        this.onMiniMapToggledEvent.invoke(isOn);
    }
    /**
     * Drawing geometry point to map
     */
    drawGeometryPoint(geometry, radius) {
        this.mapController.drawGeometryPoint(geometry, radius);
    }
    /**
     * Drawing geometry line to map
     */
    drawGeometryLine(geometry, thickness) {
        this.mapController.drawGeometryLine(geometry, thickness);
    }
    /**
     * Drawing geometry multiline to map
     */
    drawGeometryMultiline(geometry, thickness) {
        this.mapController.drawGeometryMultiline(geometry, thickness);
    }
    /**
     * Clearing all drawn geometry
     */
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
//# sourceMappingURL=MapComponentBackup.js.map