"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapController = void 0;
var __selfType = requireType("./MapController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// --- START OF FILE MapController.ts (Final Cleaned Version) ---
require("LensStudio:RawLocationModule");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const MapConfig_1 = require("./MapConfig");
const MapGridView_1 = require("./MapGridView");
const MapPin_1 = require("./MapPin");
const MapUtils_1 = require("./MapUtils");
const PinOffsetter_1 = require("./PinOffsetter");
const TEXTURE_SIZE = 512;
const MAX_LATITUDE = 85.05112878;
const MAX_LONGITUDE = -180;
const NEARBY_PLACES_RANGE = 100;
const CENTER_MAP_TWEEN_DURATION = 0.5;
const TAG = "[Map Controller]";
const log = new NativeLogger_1.default(TAG);
const DOUBLE_CLICK_THRESHOLD_MS = 0.3; // (0.3 secondes)
let MapController = class MapController extends BaseScriptComponent {
    initialize(mapParameters, startedAsMiniMap) {
        this.locationService = GeoLocation.createLocationService();
        this.locationService.onNorthAlignedOrientationUpdate.add(this.handleNorthAlignedOrientationUpdate.bind(this));
        this.locationService.accuracy = GeoLocationAccuracy.Navigation;
        this.mapParameters = mapParameters;
        this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent);
        this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());
        this.mapGridObject = this.mapRenderObject.getChild(0);
        this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
        this.mapPinsAnchor = this.mapGridObject.getChild(0);
        if (this.mapParameters.setMapToCustomLocation) {
            this.mapLocation = this.mapParameters.mapLocation;
        }
        this.fetchLocation((location) => {
            if (!this.mapParameters.setMapToCustomLocation)
                this.mapLocation = location;
            this.createMapGrid();
            this.centerMap();
            if (mapParameters.showUserPin)
                this.spawnUserPin(mapParameters.userPinVisual, location, mapParameters.userPinScale);
            this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(this.onUpdate.bind(this));
            this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(() => this.gridView.updateGridView(this.pinSet, this.userPin));
            if (startedAsMiniMap)
                this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
            this.isInitialized = true;
        });
    }
    onUpdate() {
        if (!this.isInitialized)
            return;
        if (getTime() - this.lastMapUpdate > this.mapParameters.mapUpdateThreshold) {
            this.fetchLocation((location) => {
                if (!this.mapParameters.setMapToCustomLocation)
                    this.setNewMapLocation(location);
                if (this.mapParameters.showUserPin)
                    this.setNewUserPosition(location);
            });
            this.lastMapUpdate = getTime();
        }
        this.updateRotations();
    }
    fetchLocation(callback) {
        this.locationService.getCurrentPosition(callback, (error) => log.e(`Error fetching location: ${error}`));
    }
    handleNorthAlignedOrientationUpdate(orientation) {
        this.orientation = orientation;
        this.heading = (0, MapUtils_1.normalizeAngle)((0, MapUtils_1.customGetEuler)(orientation).y);
    }
    updateRotations() {
        const pinRotation = -this.getUserHeading();
        if (this.mapParameters.showUserPin && this.userPin) {
            this.updateUserPinRotation(pinRotation);
        }
        if (this.mapParameters.setMapToCustomLocation) {
            return;
        }
        if (this.mapParameters.isMinimapAutoRotate && !this.viewScrolled && this.config.isMiniMap) {
            this.updateMapRotation();
            this.updateMapPinRotations(pinRotation);
        }
    }
    updateMapPinRotations(pinRotation) {
        if (this.mapParameters.mapPinsRotated) {
            if (this.mapParameters.enableMapSmoothing) {
                this.targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation);
                this.currentPinRotation = (0, MapUtils_1.interpolate)(this.currentPinRotation, this.targetPinRotation, 4);
                this.pinSet.forEach((pin) => pin.screenTransform.rotation = this.currentPinRotation);
            }
            else {
                this.pinSet.forEach((pin) => pin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation));
            }
        }
    }
    updateMapRotation() {
        if (this.mapParameters.enableMapSmoothing) {
            this.targetMapRotation = quat.fromEulerAngles(0, 0, this.getUserHeading());
            this.currentMapRotation = (0, MapUtils_1.interpolate)(this.currentMapRotation, this.targetMapRotation, 4);
            this.config.gridScreenTransform.rotation = this.currentMapRotation;
        }
        else {
            this.config.gridScreenTransform.rotation = quat.fromEulerAngles(0, 0, this.getUserHeading());
        }
    }
    updateUserPinRotation(pinRotation) {
        if (this.userPin.screenTransform && this.mapParameters.userPinAlignedWithOrientation) {
            if (this.mapParameters.enableMapSmoothing) {
                this.targetUserRotation = quat.fromEulerAngles(0, 0, pinRotation);
                this.currentUserRotation = (0, MapUtils_1.interpolate)(this.currentUserRotation, this.targetUserRotation, 4);
                this.userPin.screenTransform.rotation = this.currentUserRotation;
            }
            else {
                this.userPin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation);
            }
        }
    }
    getUserLocation() { return this.userLocation; }
    getUserHeading() { return global.deviceInfoSystem.isEditor() ? -this.heading : this.heading; }
    getUserOrientation() { return this.orientation; }
    setMinimapAutoRotate(enabled) { this.mapParameters.isMinimapAutoRotate = enabled; }
    getMinimapAutoRotate() { return this.mapParameters.isMinimapAutoRotate; }
    createMapPin(location, placeInfo = undefined) {
        const pin = MapPin_1.MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, 1, location, placeInfo);
        this.pinSet.add(pin);
        const mapRotation = this.config.gridScreenTransform.rotation;
        pin.screenTransform.rotation = mapRotation.invert();
        this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, location.longitude, location.latitude);
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
        pin.highlight();
        this.onMapPinAddedEvent.invoke(pin);
        return pin;
    }
    removeMapPin(mapPin) {
        if (this.pinSet.has(mapPin))
            this.pinSet.delete(mapPin);
        if (mapPin.placeInfo)
            this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
        this.pinOffsetter.unbindScreenTransform(mapPin.screenTransform);
        mapPin.sceneObject.destroy();
        this.onMapPinRemovedEvent.invoke(mapPin);
    }
    removeMapPins() {
        this.pinSet.forEach((pin) => {
            this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
            pin.sceneObject.destroy();
        });
        this.pinSet.clear();
        this.pinnedPlaceSet.clear();
        this.onAllMapPinsRemovedEvent.invoke();
    }
    addPinByLocalPosition(localPosition) {
        const newPin = MapPin_1.MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, 1, null);
        this.pinSet.add(newPin);
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
        newPin.sceneObject.enabled = true;
        const mapRotation = this.config.gridScreenTransform.rotation;
        newPin.screenTransform.rotation = mapRotation.invert();
        this.setPinLocation(newPin, localPosition);
        return newPin;
    }
    setPinLocation(pin, adjustedAnchoredPosition) {
        const offset = this.gridView.getOffset().sub(this.offsetForLocation).sub(new vec2(0.5, 0.5));
        const location = this.fromLocalPositionToLongLat(new vec2(adjustedAnchoredPosition.x - offset.x, adjustedAnchoredPosition.y + offset.y), this.mapParameters.zoomLevel);
        pin.location = location;
        this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
        if (this.userLocation)
            pin.location.altitude = this.userLocation.altitude;
        this.onMapPinAddedEvent.invoke(pin);
    }
    fromLocalPositionToLongLat(localPosition, zoomLevel) {
        const pixelOffsetFromMapLocationX = localPosition.x * TEXTURE_SIZE;
        const pixelOffsetFromMapLocationY = -localPosition.y * TEXTURE_SIZE;
        const mapImageOffset = this.mapModule.longLatToImageRatio(this.mapLocation.longitude, this.mapLocation.latitude, this.northwestLocationAsset);
        const pixelX = mapImageOffset.x * TEXTURE_SIZE + pixelOffsetFromMapLocationX;
        const pixelY = mapImageOffset.y * TEXTURE_SIZE + pixelOffsetFromMapLocationY;
        const mapSize = TEXTURE_SIZE << zoomLevel;
        const x = (0, MapUtils_1.clip)(pixelX, 0, mapSize - 1) / mapSize - 0.5;
        const y = 0.5 - (0, MapUtils_1.clip)(pixelY, 0, mapSize - 1) / mapSize;
        const latitude = 90 - (360 * Math.atan(Math.exp(-y * 2 * Math.PI))) / Math.PI;
        const longitude = 360 * x;
        const location = GeoPosition.create();
        location.longitude = longitude;
        location.latitude = latitude;
        return location;
    }
    createMapPinAtUserLocation() {
        return this.createMapPin(this.userLocation);
    }
    updateLocationOffset() {
        this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
    }
    createMapGrid() {
        const gridScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
        this.gridView = MapGridView_1.MapGridView.makeGridView(this);
        this.config = MapConfig_1.default.makeConfig(this.mapPinsAnchor, this.mapScreenTransform, gridScreenTransform, this.mapTilePrefab, this, this.mapParameters.enableScrolling, this.mapParameters.scrollingFriction, this.mapParameters.tileCount);
        this.initialMapLocation = GeoPosition.create();
        this.initialMapLocation.longitude = this.mapLocation.longitude;
        this.initialMapLocation.latitude = this.mapLocation.latitude;
        this.onInitialLocationSetEvent.invoke(this.initialMapLocation);
        this.shouldFollowMapLocation = true;
        this.setUpZoom();
    }
    configureCell(cell) {
        cell.imageComponent = cell.sceneObject.getComponent("Component.Image");
        cell.imageComponent.mainMaterial = cell.imageComponent.mainMaterial.clone();
        const mapTexture = this.mapModule.createMapTextureProvider();
        cell.textureProvider = mapTexture.control;
        cell.imageComponent.mainPass.baseTex = mapTexture;
        cell.onTileCameIntoView.add((event) => this.onTileCameIntoViewEvent.invoke(event));
        cell.onTileWentOutOfView.add((event) => this.onTileWentOutOfViewEvent.invoke(event));
        cell.textureProvider.onFailed.add(() => { log.e("Location data failed to download"); cell.retryTextureLoading(); });
        cell.textureProvider.onReady.add(() => this.mapTileloaded());
    }
    mapTileloaded() {
        this.loadedCells++;
        if (this.loadedCells == this.mapCellCount)
            this.onMapTilesLoadedEvent.invoke();
    }
    onCellCountChanged(cellCount) {
        this.mapCellCount = cellCount;
    }
    setUpZoom() {
        this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(this.mapLocation.longitude, this.mapLocation.latitude).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
        this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(MAX_LONGITUDE, MAX_LATITUDE).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
        this.updateLocationOffset();
        this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
        this.pinOffsetter = PinOffsetter_1.PinOffsetter.makeMapLocationOffsetter(this.mapModule, this.referencePositionLocationAsset);
        this.gridView.handleUpdateConfig(this.config);
    }
    spawnUserPin(mapPinPrefab, location, mapPinScale) {
        this.userPin = MapPin_1.MapPin.makeMapPin(mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, 3, location, undefined, true);
        this.userPin.screenTransform.scale = new vec3(mapPinScale.x, mapPinScale.y, 1.0);
        this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
    }
    setMapScrolling(value) { this.config.horizontalScrollingEnabled = value; this.config.verticalScrollingEnabled = value; }
    setUserPinRotated(value) { this.mapParameters.userPinAlignedWithOrientation = value; }
    getInitialMapTileLocation() { return this.initialMapLocation; }
    handleHoverUpdate(localPosition) {
        if (!this.isInitialized || this.isDraggingPin)
            return;
        const adjustedPos = this.getPositionWithMapRotationOffset(localPosition.uniformScale(0.5));
        this.pinSet.forEach((pin) => {
            const isHovering = adjustedPos.distance(pin.screenTransform.anchors.getCenter()) < this.mapParameters.mapPinCursorDetectorSize;
            if (isHovering && !this.hoveringPinSet.has(pin)) {
                this.hoveringPinSet.add(pin);
                pin.enableOutline(true);
            }
            else if (!isHovering && this.hoveringPinSet.has(pin)) {
                this.hoveringPinSet.delete(pin);
                pin.enableOutline(false);
            }
        });
    }
    handleTouchStart(localPosition) {
        if (!this.isInitialized)
            return;
        this.lastTouchPosition = localPosition;
        if (this.hoveringPinSet.size > 0) {
            const hoveredPin = this.hoveringPinSet.values().next().value;
            const currentTime = getTime();
            if (this.lastClickedPin === hoveredPin && (currentTime - this.lastPinClickTime) < DOUBLE_CLICK_THRESHOLD_MS) {
                this.isDraggingPin = true;
                this.draggingPin = hoveredPin;
                this.hoveringPinSet.clear();
                this.draggingPin.enableOutline(false);
                this.lastClickedPin = null;
            }
            else {
                this.lastClickedPin = hoveredPin;
                this.lastPinClickTime = currentTime;
                this.gridView.handleScrollStart(localPosition);
            }
        }
        else {
            this.gridView.handleScrollStart(localPosition);
        }
    }
    handleTouchUpdate(localPosition) {
        if (!this.isInitialized)
            return;
        if (this.isDraggingPin && this.draggingPin) {
            const delta = localPosition.sub(this.lastTouchPosition);
            const currentCenter = this.draggingPin.screenTransform.anchors.getCenter();
            const newCenter = currentCenter.add(delta.mult(new vec2(1, 1)).uniformScale(this.pinDragSensitivity));
            this.draggingPin.screenTransform.anchors.setCenter(newCenter);
        }
        else {
            this.gridView.handleScrollUpdate(localPosition);
        }
        this.lastTouchPosition = localPosition;
    }
    handleTouchEnd(localPosition) {
        if (!this.isInitialized)
            return;
        if (this.isDraggingPin && this.draggingPin) {
            this.setPinLocation(this.draggingPin, this.draggingPin.screenTransform.anchors.getCenter());
            this.isDraggingPin = false;
            this.draggingPin = null;
        }
        else {
            this.gridView.handleScrollEnd();
        }
    }
    handleZoomIn() {
        this.mapParameters.zoomLevel++;
        this.mapParameters.zoomOffet = (0, MapUtils_1.calculateZoomOffset)(this.mapParameters.zoomLevel);
        this.setUpZoom();
        this.gridView.layoutCells(true);
        this.pinSet.forEach((pin) => this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude));
    }
    handleZoomOut() {
        this.mapParameters.zoomLevel--;
        this.mapParameters.zoomOffet = (0, MapUtils_1.calculateZoomOffset)(this.mapParameters.zoomLevel);
        this.setUpZoom();
        this.gridView.layoutCells(true);
        this.pinSet.forEach((pin) => this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude));
    }
    toggleMiniMap(isOn) {
        if (!this.gridView)
            return;
        this.config.gridScreenTransform.rotation = quat.quatIdentity();
        this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin);
        if (!isOn)
            this.pinSet.forEach(pin => pin.screenTransform.rotation = quat.quatIdentity());
        this.onMiniMapToggledEvent.invoke(isOn);
    }
    setNewUserPosition(location) {
        const oldUserLocation = this.userLocation;
        this.userLocation = location;
        if (this.userPin) {
            this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
        }
        if (oldUserLocation === undefined && location !== undefined)
            this.onUserLocationSetEvent.invoke(location);
    }
    setNewMapLocation(location) {
        this.mapLocation = location;
        this.pinOffsetter.bindScreenTransformToLocation(this.mapPinsAnchor.getComponent("ScreenTransform"), location.longitude, location.latitude);
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
        if (this.shouldFollowMapLocation) {
            this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, location.longitude, location.latitude);
            this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
        }
    }
    drawGeometryPoint(geometryPoint, radius = 0.1) { }
    drawGeometryLine(geometryLine, thickness = 0.2) { }
    drawGeometryMultiline(geometryMultiline, thickness = 0.2) { }
    clearGeometry() { }
    getWorldPositionForGeometryPoint(geometryPoint) { /* ... */ return vec3.zero(); }
    onScrollingStarted() {
        this.shouldFollowMapLocation = false;
        this.viewScrolled = true;
        this.onMapScrolledEvent.invoke();
    }
    onLayout() {
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
    }
    centerMap() {
        if (!this.isInitialized)
            return;
        if (this.tweenCancelFunction)
            this.tweenCancelFunction();
        const currentOffset = this.gridView.getOffset();
        const userOffset = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
        const targetOffset = userOffset.add(new vec2(0.5, 0.5));
        this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
            this.gridView.resetVelocity();
            this.gridView.setOffset(vec2.lerp(currentOffset, targetOffset, t));
            if (t === 1) {
                this.shouldFollowMapLocation = true;
                this.viewScrolled = false;
                this.onMapCenteredEvent.invoke();
            }
        }, CENTER_MAP_TWEEN_DURATION);
    }
    isMapCentered() {
        if (!this.isInitialized)
            return true;
        const currentOffset = this.gridView.getOffset();
        const userOffset = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
        return currentOffset.equal(userOffset.add(new vec2(0.5, 0.5)));
    }
    getPositionWithMapRotationOffset(localPosition) {
        const rot = (0, MapUtils_1.customGetEuler)(this.config.gridScreenTransform.rotation).z;
        const dist = localPosition.length;
        const ang = Math.atan2(localPosition.y, localPosition.x);
        return new vec2(Math.cos(ang - rot) * dist, Math.sin(ang - rot) * dist);
    }
    showNearbyPlaces(category) {
        this.placesProvider
            .getNearbyPlaces(this.mapLocation, NEARBY_PLACES_RANGE, category)
            .then((places) => {
            if (places.length === 0) {
                this.onNoNearbyPlacesFoundEvent.invoke();
                return;
            }
            this.placesProvider
                .getPlacesInfo(places)
                .then((placesInfo) => {
                for (let i = 0; i < placesInfo.length; i++) {
                    if (!this.pinnedPlaceSet.has(placesInfo[i].placeId)) {
                        this.createMapPin(placesInfo[i].centroid, placesInfo[i]);
                        this.pinnedPlaceSet.add(placesInfo[i].placeId);
                    }
                }
            })
                .catch((error) => log.e(error));
        })
            .catch((error) => { log.e(error); this.onNearbyPlacesFailedEvent.invoke(); });
    }
    __initialize() {
        super.__initialize();
        this.isMapComponent = true;
        this.shouldFollowMapLocation = false;
        this.lastMapUpdate = 0;
        this.loadedCells = 0;
        this.mapCellCount = 0;
        this.hoveringPinSet = new Set();
        this.pinSet = new Set();
        this.pinnedPlaceSet = new Set();
        this.isDraggingPin = false;
        this.draggingPin = null;
        this.currentUserRotation = quat.quatIdentity();
        this.targetUserRotation = quat.quatIdentity();
        this.currentMapRotation = quat.quatIdentity();
        this.targetMapRotation = quat.quatIdentity();
        this.currentPinRotation = quat.quatIdentity();
        this.targetPinRotation = quat.quatIdentity();
        this.heading = 0;
        this.orientation = quat.quatIdentity();
        this.geometryObjects = [];
        this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
        this.isInitialized = false;
        this.lastPinClickTime = 0;
        this.lastClickedPin = null;
        this.lastTouchPosition = vec2.zero();
        this.onInitialLocationSetEvent = new Event_1.default();
        this.onInitialLocationSet = this.onInitialLocationSetEvent.publicApi();
        this.onMapTilesLoadedEvent = new Event_1.default();
        this.onMapTilesLoaded = this.onMapTilesLoadedEvent.publicApi();
        this.onUserLocationSetEvent = new Event_1.default();
        this.onUserLocationSet = this.onUserLocationSetEvent.publicApi();
        this.onMapCenteredEvent = new Event_1.default();
        this.onMapCentered = this.onMapCenteredEvent.publicApi();
        this.onMapScrolledEvent = new Event_1.default();
        this.onMapScrolled = this.onMapScrolledEvent.publicApi();
        this.onTileWentOutOfViewEvent = new Event_1.default();
        this.onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi();
        this.onTileCameIntoViewEvent = new Event_1.default();
        this.onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi();
        this.onMapPinAddedEvent = new Event_1.default();
        this.onMapPinAdded = this.onMapPinAddedEvent.publicApi();
        this.onMapPinRemovedEvent = new Event_1.default();
        this.onMapPinRemoved = this.onMapPinRemovedEvent.publicApi();
        this.onAllMapPinsRemovedEvent = new Event_1.default();
        this.onAllMapPinsRemoved = this.onAllMapPinsRemovedEvent.publicApi();
        this.onMiniMapToggledEvent = new Event_1.default();
        this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
        this.onNoNearbyPlacesFoundEvent = new Event_1.default();
        this.onNoNearbyPlacesFound = this.onNoNearbyPlacesFoundEvent.publicApi();
        this.onNearbyPlacesFailedEvent = new Event_1.default();
        this.onNearbyPlacesFailed = this.onNearbyPlacesFailedEvent.publicApi();
    }
};
exports.MapController = MapController;
exports.MapController = MapController = __decorate([
    component
], MapController);
//# sourceMappingURL=MapController.js.map