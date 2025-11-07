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
// --- START OF FILE MapController.ts (FINAL, COMPLETE, AND CORRECTED) ---
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
const DOUBLE_CLICK_THRESHOLD_MS = 0.3;
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
        if (this.mapParameters.showUserPin && this.userPin)
            this.updateUserPinRotation(pinRotation);
        if (this.mapParameters.setMapToCustomLocation)
            return;
        if (this.mapParameters.isMinimapAutoRotate && !this.viewScrolled && this.config.isMiniMap) {
            this.updateMapRotation();
            this.updateMapPinRotations(pinRotation);
        }
    }
    updateMapPinRotations(pinRotation) {
        if (this.mapParameters.mapPinsRotated) {
            const targetRot = quat.fromEulerAngles(0, 0, pinRotation);
            this.pinSet.forEach((pin) => { pin.screenTransform.rotation = this.mapParameters.enableMapSmoothing ? quat.slerp(pin.screenTransform.rotation, targetRot, 4 * getDeltaTime()) : targetRot; });
        }
    }
    updateMapRotation() {
        const targetRot = quat.fromEulerAngles(0, 0, this.getUserHeading());
        this.config.gridScreenTransform.rotation = this.mapParameters.enableMapSmoothing ? quat.slerp(this.config.gridScreenTransform.rotation, targetRot, 4 * getDeltaTime()) : targetRot;
    }
    updateUserPinRotation(pinRotation) {
        if (this.userPin && this.userPin.screenTransform && this.mapParameters.userPinAlignedWithOrientation) {
            const targetRot = quat.fromEulerAngles(0, 0, pinRotation);
            this.userPin.screenTransform.rotation = this.mapParameters.enableMapSmoothing ? quat.slerp(this.userPin.screenTransform.rotation, targetRot, 4 * getDeltaTime()) : targetRot;
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
        if (this.pinSet.has(mapPin)) {
            this.pinSet.delete(mapPin);
            if (mapPin.placeInfo)
                this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
            this.pinOffsetter.unbindScreenTransform(mapPin.screenTransform);
            mapPin.sceneObject.destroy();
            this.onMapPinRemovedEvent.invoke(mapPin);
        }
    }
    removeMapPins() {
        this.pinSet.forEach((pin) => { this.pinOffsetter.unbindScreenTransform(pin.screenTransform); pin.sceneObject.destroy(); });
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
        const px = localPosition.x * TEXTURE_SIZE;
        const py = -localPosition.y * TEXTURE_SIZE;
        const mapOffset = this.mapModule.longLatToImageRatio(this.mapLocation.longitude, this.mapLocation.latitude, this.northwestLocationAsset);
        const pixelX = mapOffset.x * TEXTURE_SIZE + px;
        const pixelY = mapOffset.y * TEXTURE_SIZE + py;
        const mapSize = TEXTURE_SIZE << zoomLevel;
        const x = (0, MapUtils_1.clip)(pixelX, 0, mapSize - 1) / mapSize - 0.5;
        const y = 0.5 - (0, MapUtils_1.clip)(pixelY, 0, mapSize - 1) / mapSize;
        const lat = 90 - (360 * Math.atan(Math.exp(-y * 2 * Math.PI))) / Math.PI;
        const lon = 360 * x;
        const loc = GeoPosition.create();
        loc.longitude = lon;
        loc.latitude = lat;
        return loc;
    }
    createMapPinAtUserLocation() {
        return this.createMapPin(this.userLocation);
    }
    updateLocationOffset() {
        this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
    }
    createMapGrid() {
        const gridST = this.mapGridObject.getComponent("ScreenTransform");
        this.gridView = MapGridView_1.MapGridView.makeGridView(this);
        this.config = MapConfig_1.default.makeConfig(this.mapPinsAnchor, this.mapScreenTransform, gridST, this.mapTilePrefab, this, this.mapParameters.enableScrolling, this.mapParameters.scrollingFriction, this.mapParameters.tileCount);
        this.initialMapLocation = GeoPosition.create();
        this.initialMapLocation.latitude = this.mapLocation.latitude;
        this.initialMapLocation.longitude = this.mapLocation.longitude;
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
        cell.onTileCameIntoView.add((e) => this.onTileCameIntoViewEvent.invoke(e));
        cell.onTileWentOutOfView.add((e) => this.onTileWentOutOfViewEvent.invoke(e));
        cell.textureProvider.onFailed.add(() => cell.retryTextureLoading());
        cell.textureProvider.onReady.add(() => this.mapTileloaded());
    }
    mapTileloaded() {
        this.loadedCells++;
        if (this.loadedCells >= this.mapCellCount)
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
    spawnUserPin(prefab, location, scale) {
        this.userPin = MapPin_1.MapPin.makeMapPin(prefab, this.mapGridObject, this.mapPinsAnchor.layer, 3, location, undefined, true);
        this.userPin.screenTransform.scale = new vec3(scale.x, scale.y, 1.0);
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
        if (this.hoveringPinSet.size > 0) {
            const hoveredPin = this.hoveringPinSet.values().next().value;
            const currentTime = getTime();
            if (this.lastClickedPin === hoveredPin && (currentTime - this.lastPinClickTime) < DOUBLE_CLICK_THRESHOLD_MS) {
                this.isDraggingPin = true;
                this.draggingPin = hoveredPin;
                this.dragStartPosition = localPosition;
                this.dragStartPinPosition = this.draggingPin.screenTransform.anchors.getCenter();
                this.hoveringPinSet.clear();
                this.draggingPin.enableOutline(false);
                this.lastClickedPin = null;
            }
            else {
                this.lastClickedPin = hoveredPin;
                this.lastPinClickTime = currentTime;
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
            const delta = localPosition.sub(this.dragStartPosition);
            const newPinPosition = this.dragStartPinPosition.add(delta.uniformScale(this.pinDragSensitivity));
            this.draggingPin.screenTransform.anchors.setCenter(newPinPosition);
        }
        else {
            this.gridView.handleScrollUpdate(localPosition);
        }
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
        const old = this.userLocation;
        this.userLocation = location;
        if (this.userPin) {
            this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
        }
        if (!old && location)
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
    drawGeometryPoint(p, r) { }
    drawGeometryLine(l, t) { }
    drawGeometryMultiline(m, t) { }
    clearGeometry() { this.geometryObjects.forEach(o => o.destroy()); this.geometryObjects = []; }
    getWorldPositionForGeometryPoint(p) { const o = this.gridView.getOffset(); const i = this.mapModule.longLatToImageRatio(p.x, p.y, this.referencePositionLocationAsset); const l = new vec2((0, MapUtils_1.lerp)(-1, 1, o.x + i.x), (0, MapUtils_1.lerp)(1, -1, o.y + i.y)); return this.config.gridScreenTransform.localPointToWorldPoint(l); }
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
        const current = this.gridView.getOffset();
        const target = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude).add(new vec2(0.5, 0.5));
        this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
            this.gridView.resetVelocity();
            this.gridView.setOffset(vec2.lerp(current, target, t));
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
        return this.gridView.getOffset().equal((0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude).add(new vec2(0.5, 0.5)));
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
                .then((infos) => {
                infos.forEach(info => {
                    if (!this.pinnedPlaceSet.has(info.placeId)) {
                        this.createMapPin(info.centroid, info);
                        this.pinnedPlaceSet.add(info.placeId);
                    }
                });
            })
                .catch((error) => log.e(error.message));
        })
            .catch(e => { log.e(e.message); this.onNearbyPlacesFailedEvent.invoke(); });
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
        this.dragStartPosition = vec2.zero();
        this.dragStartPinPosition = vec2.zero();
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