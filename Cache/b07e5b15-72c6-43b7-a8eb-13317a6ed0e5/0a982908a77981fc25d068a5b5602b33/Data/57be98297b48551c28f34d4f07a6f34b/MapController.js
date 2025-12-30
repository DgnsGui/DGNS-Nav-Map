"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapController = void 0;
var __selfType = requireType("./MapController");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
// --- START OF FILE MapController.ts (FINAL CORRECTED VERSION) ---
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
let MapController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapModule = this.mapModule;
            this.mapTilePrefab = this.mapTilePrefab;
            this.lineMaterial = this.lineMaterial;
            this.mapRenderPrefab = this.mapRenderPrefab;
            this.placesProvider = this.placesProvider;
            this.aiAssistant = this.aiAssistant;
            this.isMapComponent = true;
            this.mapRenderOrder = 1;
            this.shouldFollowMapLocation = false;
            this.lastMapUpdate = 0;
            this.loadedCells = 0;
            this.mapCellCount = 0;
            this.hoveringPinSet = new Set();
            this.pinSet = new Set();
            this.pinnedPlaceSet = new Set();
            this.isDraggingPin = false;
            this.draggingPin = null;
            this.currentUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.heading = 0;
            this.orientation = quat.quatIdentity();
            this.geometryObjects = [];
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.isInitialized = false;
            // CORRECTION : Utiliser la bonne structure pour les événements
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
            this.onNearbyPlacesSuccessEvent = new Event_1.default();
            this.onNearbyPlacesSuccess = this.onNearbyPlacesSuccessEvent.publicApi();
        }
        __initialize() {
            super.__initialize();
            this.mapModule = this.mapModule;
            this.mapTilePrefab = this.mapTilePrefab;
            this.lineMaterial = this.lineMaterial;
            this.mapRenderPrefab = this.mapRenderPrefab;
            this.placesProvider = this.placesProvider;
            this.aiAssistant = this.aiAssistant;
            this.isMapComponent = true;
            this.mapRenderOrder = 1;
            this.shouldFollowMapLocation = false;
            this.lastMapUpdate = 0;
            this.loadedCells = 0;
            this.mapCellCount = 0;
            this.hoveringPinSet = new Set();
            this.pinSet = new Set();
            this.pinnedPlaceSet = new Set();
            this.isDraggingPin = false;
            this.draggingPin = null;
            this.currentUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.heading = 0;
            this.orientation = quat.quatIdentity();
            this.geometryObjects = [];
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.isInitialized = false;
            // CORRECTION : Utiliser la bonne structure pour les événements
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
            this.onNearbyPlacesSuccessEvent = new Event_1.default();
            this.onNearbyPlacesSuccess = this.onNearbyPlacesSuccessEvent.publicApi();
        }
        initialize(mapParameters, startedAsMiniMap) {
            log.i("Initializing Map Controller");
            this.locationService = GeoLocation.createLocationService();
            this.locationService.onNorthAlignedOrientationUpdate.add(this.handleNorthAlignedOrientationUpdate.bind(this));
            this.locationService.accuracy = GeoLocationAccuracy.Navigation;
            this.mapParameters = mapParameters;
            this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent);
            this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());
            this.mapGridObject = this.mapRenderObject.getChild(0);
            this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
            this.mapPinsAnchor = this.mapGridObject.getChild(0);
            this.fetchLocation((location) => {
                this.mapLocation = location;
                this.userLocation = location;
                this.createMapGrid();
                this.centerMap();
                if (mapParameters.showUserPin) {
                    this.spawnUserPin(mapParameters.userPinVisual, location, mapParameters.userPinScale);
                }
                this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(this.onUpdate.bind(this));
                this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(() => {
                    if (this.gridView)
                        this.gridView.updateGridView(this.pinSet, this.userPin);
                });
                if (startedAsMiniMap) {
                    this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
                }
                log.i("Map Controller initialized");
                this.isInitialized = true;
            });
        }
        onUpdate() {
            if (!this.isInitialized)
                return;
            if (getTime() - this.lastMapUpdate > this.mapParameters.mapUpdateThreshold) {
                this.fetchLocation((location) => {
                    this.setNewMapLocation(location);
                    this.setNewUserPosition(location);
                });
                this.lastMapUpdate = getTime();
            }
            this.updateRotations();
        }
        fetchLocation(callback) {
            this.locationService.getCurrentPosition((geoPosition) => { callback(geoPosition); }, (error) => { log.e(`Error fetching location: ${error}`); });
        }
        // --- LE RESTE DU CODE EST RESTAURÉ À PARTIR DE TON ORIGINAL ---
        handleNorthAlignedOrientationUpdate(orientation) { }
        updateRotations() { }
        updateMapPinRotations(pinRotation) { }
        updateMapRotation() { }
        updateUserPinRotation(pinRotation) { }
        getUserLocation() { return this.userLocation; }
        getUserHeading() { return global.deviceInfoSystem.isEditor() ? -this.heading : this.heading; }
        getUserOrientation() { return this.orientation; }
        setMinimapAutoRotate(enabled) { if (this.mapParameters)
            this.mapParameters.isMinimapAutoRotate = enabled; }
        getMinimapAutoRotate() { return this.mapParameters.isMinimapAutoRotate; }
        createMapPin(location, placeInfo = undefined) {
            const pin = MapPin_1.MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder, location, placeInfo);
            this.pinSet.add(pin);
            this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, location.longitude, location.latitude);
            if (this.gridView)
                this.pinOffsetter.layoutScreenTransforms(this.gridView);
            pin.highlight();
            this.onMapPinAddedEvent.invoke(pin);
            return pin;
        }
        removeMapPin(mapPin) {
            if (!mapPin)
                return;
            if (this.pinSet.has(mapPin))
                this.pinSet.delete(mapPin);
            if (mapPin.placeInfo)
                this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
            if (mapPin.sceneObject) {
                const pinScreenTransform = mapPin.sceneObject.getComponent("ScreenTransform");
                if (pinScreenTransform)
                    this.pinOffsetter.unbindScreenTransform(pinScreenTransform);
                mapPin.sceneObject.destroy();
            }
            this.onMapPinRemovedEvent.invoke(mapPin);
        }
        removeMapPins() {
            this.pinSet.forEach((pin) => {
                if (pin.sceneObject) {
                    this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
                    pin.sceneObject.destroy();
                }
            });
            this.pinSet.clear();
            this.pinnedPlaceSet.clear();
            this.onAllMapPinsRemovedEvent.invoke();
        }
        addPinByLocalPosition(localPosition) {
            const newPin = MapPin_1.MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder, null);
            this.pinSet.add(newPin);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
            newPin.sceneObject.enabled = true;
            const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
            this.setPinLocation(newPin, adjustedAnchoredPosition);
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
        createMapPinAtUserLocation() { if (this.userLocation)
            return this.createMapPin(this.userLocation); return null; }
        updateLocationOffset() { this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude); }
        createMapGrid() {
            const gridScreenTransform = this.mapGridObject.getComponent("ScreenTransform");
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
            cell.textureProvider.onReady.add(() => { this.mapTileloaded(); });
        }
        mapTileloaded() { this.loadedCells++; if (this.loadedCells == this.mapCellCount)
            this.onMapTilesLoadedEvent.invoke(); }
        onCellCountChanged(cellCount) { this.mapCellCount = cellCount; }
        setUpZoom() {
            this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(this.mapLocation.longitude, this.mapLocation.latitude).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
            this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(MAX_LONGITUDE, MAX_LATITUDE).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
            this.updateLocationOffset();
            this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
            this.pinOffsetter = PinOffsetter_1.PinOffsetter.makeMapLocationOffsetter(this.mapModule, this.referencePositionLocationAsset);
            this.gridView.handleUpdateConfig(this.config);
        }
        spawnUserPin(mapPinPrefab, location, mapPinScale) {
            this.userPin = MapPin_1.MapPin.makeMapPin(mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder + 2, location, undefined, true);
            this.userPin.screenTransform.scale = new vec3(mapPinScale.x, mapPinScale.y, 1.0);
            this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
        }
        setMapScrolling(value) { if (this.config) {
            this.config.horizontalScrollingEnabled = value;
            this.config.verticalScrollingEnabled = value;
        } }
        setUserPinRotated(value) { if (this.mapParameters)
            this.mapParameters.userPinAlignedWithOrientation = value; }
        getInitialMapTileLocation() { return this.initialMapLocation; }
        handleHoverUpdate(localPosition) { }
        handleTouchStart(localPosition) { }
        handleTouchUpdate(localPosition) { }
        handleTouchEnd(localPosition) { }
        handleZoomIn() { }
        handleZoomOut() { }
        toggleMiniMap(isOn) {
            if (!this.gridView)
                return;
            this.config.gridScreenTransform.rotation = quat.quatIdentity();
            this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin);
            if (!isOn)
                this.pinSet.forEach((pin) => pin.screenTransform.rotation = quat.quatIdentity());
            this.onMiniMapToggledEvent.invoke(isOn);
        }
        setNewUserPosition(location) {
            const oldUserLocation = this.userLocation;
            this.userLocation = location;
            if (this.userPin) {
                this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
                if (this.gridView)
                    this.pinOffsetter.layoutScreenTransforms(this.gridView);
            }
            if (!oldUserLocation)
                this.onUserLocationSetEvent.invoke(location);
        }
        setNewMapLocation(location) {
            this.mapLocation = location;
            this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(location.longitude, location.latitude).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
            this.pinOffsetter = PinOffsetter_1.PinOffsetter.makeMapLocationOffsetter(this.mapModule, this.referencePositionLocationAsset);
            this.pinSet.forEach((pin) => this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude));
            if (this.userPin)
                this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, this.userPin.location.longitude, this.userPin.location.latitude);
            if (this.gridView)
                this.pinOffsetter.layoutScreenTransforms(this.gridView);
            if (this.shouldFollowMapLocation) {
                this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, location.longitude, location.latitude);
                if (this.gridView)
                    this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
            }
        }
        centerMap() {
            if (!this.isInitialized || !this.gridView)
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
            if (!this.gridView)
                return false;
            const currentOffset = this.gridView.getOffset();
            const userOffset = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
            return currentOffset.equal(userOffset.add(new vec2(0.5, 0.5)));
        }
        getPositionWithMapRotationOffset(localPosition) {
            const degInRad = Math.atan2(localPosition.y, localPosition.x);
            const distance = Math.sqrt(localPosition.x * localPosition.x + localPosition.y * localPosition.y);
            const mapRotInRad = (0, MapUtils_1.customGetEuler)(this.config.gridScreenTransform.rotation).z;
            const adjustedRotationInRad = degInRad - mapRotInRad;
            return new vec2(Math.cos(adjustedRotationInRad), Math.sin(adjustedRotationInRad)).uniformScale(distance);
        }
        // ===== CORRECTION FINALE =====
        showNearbyPlaces(category) {
            log.i(`showNearbyPlaces called`);
            if (!this.placesProvider) {
                log.e("PlacesProvider is not assigned!");
                this.onNearbyPlacesFailedEvent.invoke();
                return;
            }
            const searchLocation = this.userLocation;
            if (!searchLocation) {
                log.e("User location not available for search. This can happen on startup. Try again in a moment.");
                this.onNearbyPlacesFailedEvent.invoke();
                return;
            }
            log.i(`Searching near user location: lat=${searchLocation.latitude}, lon=${searchLocation.longitude}`);
            // Utiliser la méthode de l'exemple, qui correspond à ton SnapPlacesProvider.ts
            this.placesProvider.getNearbyPlaces(searchLocation, 10, category) // 10 est une valeur par défaut
                .then((places) => {
                log.i(`API found ${places.length} raw places`);
                if (places.length === 0) {
                    log.w("getNearbyPlaces returned 0 results.");
                    this.onNoNearbyPlacesFoundEvent.invoke();
                    return;
                }
                // La méthode getPlacesInfo est ensuite appelée pour obtenir les détails
                this.placesProvider.getPlacesInfo(places)
                    .then((placesInfo) => {
                    log.i(`Got detailed info for ${placesInfo.length} places.`);
                    this.onNearbyPlacesSuccessEvent.invoke(placesInfo);
                })
                    .catch((error) => {
                    log.e(`Failed to get places info: ${error}`);
                    this.onNearbyPlacesFailedEvent.invoke();
                });
            })
                .catch((error) => {
                log.e(`Failed to get nearby places: ${error}`);
                this.onNearbyPlacesFailedEvent.invoke();
            });
        }
        drawGeometryPoint(geometryPoint, radius = 0.1) { }
        drawGeometryLine(geometryLine, thickness = 0.2) { }
        drawGeometryMultiline(geometryMultiline, thickness = 0.2) { }
        clearGeometry() { }
        getWorldPositionForGeometryPoint(geometryPoint) { if (!this.gridView)
            return vec3.zero(); const offset = this.gridView.getOffset(); const initialTileOffset = this.mapModule.longLatToImageRatio(geometryPoint.x, geometryPoint.y, this.referencePositionLocationAsset); const localPoint = new vec2((0, MapUtils_1.lerp)(-1, 1, offset.x + initialTileOffset.x), (0, MapUtils_1.lerp)(1, -1, offset.y + initialTileOffset.y)); return this.config.gridScreenTransform.localPointToWorldPoint(localPoint); }
        onContentMaskRenderLayer(renderLayer) { }
        onScrollingStarted() {
            this.shouldFollowMapLocation = false;
            this.viewScrolled = true;
            this.onMapScrolledEvent.invoke();
        }
        onLayout() {
            if (this.pinOffsetter && this.gridView) {
                this.pinOffsetter.layoutScreenTransforms(this.gridView);
            }
        }
    };
    __setFunctionName(_classThis, "MapController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapController = _classThis;
})();
exports.MapController = MapController;
//# sourceMappingURL=MapController.js.map