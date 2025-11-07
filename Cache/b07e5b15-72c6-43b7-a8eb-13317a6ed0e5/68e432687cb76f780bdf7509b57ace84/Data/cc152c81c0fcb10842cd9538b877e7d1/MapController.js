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
function component(target) { target.getTypeName = function () { return __selfType; }; }
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
            this.isMapComponent = true; // this is used by the MapComponent to find this component on one of the child
            this.mapRenderOrder = 1;
            this.shouldFollowMapLocation = false;
            this.lastMapUpdate = 0;
            this.loadedCells = 0;
            this.mapCellCount = 0;
            // Pin
            this.hoveringPinSet = new Set();
            this.pinSet = new Set();
            this.pinnedPlaceSet = new Set();
            this.isDraggingPin = false;
            this.draggingPin = null;
            // Rotations
            this.currentUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.heading = 0; // in radians
            this.orientation = quat.quatIdentity();
            this.geometryObjects = [];
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.isInitialized = false;
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
        __initialize() {
            super.__initialize();
            this.mapModule = this.mapModule;
            this.mapTilePrefab = this.mapTilePrefab;
            this.lineMaterial = this.lineMaterial;
            this.mapRenderPrefab = this.mapRenderPrefab;
            this.placesProvider = this.placesProvider;
            this.isMapComponent = true; // this is used by the MapComponent to find this component on one of the child
            this.mapRenderOrder = 1;
            this.shouldFollowMapLocation = false;
            this.lastMapUpdate = 0;
            this.loadedCells = 0;
            this.mapCellCount = 0;
            // Pin
            this.hoveringPinSet = new Set();
            this.pinSet = new Set();
            this.pinnedPlaceSet = new Set();
            this.isDraggingPin = false;
            this.draggingPin = null;
            // Rotations
            this.currentUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetUserRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetMapRotation = quat.fromEulerAngles(0, 0, 0);
            this.currentPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.targetPinRotation = quat.fromEulerAngles(0, 0, 0);
            this.heading = 0; // in radians
            this.orientation = quat.quatIdentity();
            this.geometryObjects = [];
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.isInitialized = false;
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
        /**
         * Called from Map component script to initialize the script
         */
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
            if (this.mapParameters.setMapToCustomLocation) {
                this.mapLocation = this.mapParameters.mapLocation;
            }
            this.fetchLocation((location) => {
                if (!this.mapParameters.setMapToCustomLocation) {
                    this.mapLocation = location;
                }
                this.createMapGrid();
                this.centerMap();
                if (mapParameters.showUserPin) {
                    this.spawnUserPin(mapParameters.userPinVisual, location, mapParameters.userPinScale);
                }
                this.updateDispatcher
                    .createUpdateEvent("UpdateEvent")
                    .bind(this.onUpdate.bind(this));
                this.updateDispatcher
                    .createLateUpdateEvent("LateUpdateEvent")
                    .bind(() => this.gridView.updateGridView(this.pinSet, this.userPin));
                if (startedAsMiniMap) {
                    this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
                }
                log.i("Map Controller initialized");
                this.isInitialized = true;
            });
        }
        onUpdate() {
            if (!this.isInitialized) {
                return;
            }
            //User / Map location update
            if (getTime() - this.lastMapUpdate >
                this.mapParameters.mapUpdateThreshold) {
                this.fetchLocation((location) => {
                    if (!this.mapParameters.setMapToCustomLocation) {
                        this.setNewMapLocation(location);
                    }
                    if (this.mapParameters.showUserPin) {
                        this.setNewUserPosition(location);
                    }
                });
                this.lastMapUpdate = getTime();
            }
            this.updateRotations();
        }
        fetchLocation(callback) {
            this.locationService.getCurrentPosition((geoPosition) => {
                callback(geoPosition);
            }, (error) => {
                log.e(`Error fetching location: ${error} \n ${Error().stack}`);
            });
        }
        handleNorthAlignedOrientationUpdate(orientation) {
            this.orientation = orientation;
            // GeoLocation.getNorthAlignedHeading() currently returns a offsetted heading when the user tilts their head in multiple axis.
            // (e.g. tilting upward in x-axis and then to the left along the z-axis. The heading calculated from GeoLocation.getNorthAlignedHeading() will then start shifting to the left)
            // This is a temporary fix to minimize the shifting. This will be replaced by GeoLocation.getNorthAlignedHeading when the issue is fixed.
            this.heading = (0, MapUtils_1.normalizeAngle)((0, MapUtils_1.customGetEuler)(orientation).y);
        }
        updateRotations() {
            const pinRotation = -this.getUserHeading();
            if (this.mapParameters.showUserPin) {
                //setting user pin rotation
                this.updateUserPinRotation(pinRotation);
            }
            if (this.mapParameters.setMapToCustomLocation) {
                return;
            }
            // Rotate the map only when the map is centered at the user location (not scrolled) and minimap mode is activated
            if (this.mapParameters.isMinimapAutoRotate &&
                !this.viewScrolled &&
                this.config.isMiniMap) {
                this.updateMapRotation();
                this.updateMapPinRotations(pinRotation);
            }
        }
        updateMapPinRotations(pinRotation) {
            if (this.mapParameters.mapPinsRotated) {
                if (this.mapParameters.enableMapSmoothing) {
                    this.targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation);
                    this.currentPinRotation = (0, MapUtils_1.interpolate)(this.currentPinRotation, this.targetPinRotation, 4);
                    this.pinSet.forEach((pin) => {
                        pin.screenTransform.rotation = this.currentPinRotation;
                    });
                }
                else {
                    this.pinSet.forEach((pin) => {
                        pin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation);
                    });
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
            if (this.userPin.screenTransform &&
                this.mapParameters.userPinAlignedWithOrientation) {
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
        //  Exposed functions
        // =====
        getUserLocation() {
            return this.userLocation;
        }
        getUserHeading() {
            // TODO: Remove the negative sign when the heading is fixed in the Lens Studio
            if (global.deviceInfoSystem.isEditor()) {
                return -this.heading;
            }
            return this.heading;
        }
        getUserOrientation() {
            return this.orientation;
        }
        /**
         * Set the minimap auto-rotation state
         */
        setMinimapAutoRotate(enabled) {
            this.mapParameters.isMinimapAutoRotate = enabled;
        }
        /**
         * Get the current state of minimap auto-rotation
         */
        getMinimapAutoRotate() {
            return this.mapParameters.isMinimapAutoRotate;
        }
        /**
         * For creating a new map pin for the map
         */
        createMapPin(location, placeInfo = undefined) {
            const pin = MapPin_1.MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder, location, placeInfo);
            this.pinSet.add(pin);
            // Bind a location pin
            this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
            pin.highlight();
            this.onMapPinAddedEvent.invoke(pin);
            return pin;
        }
        /**
         * Removing map pin
         */
        removeMapPin(mapPin) {
            if (this.pinSet.has(mapPin)) {
                this.pinSet.delete(mapPin);
            }
            if (mapPin.placeInfo !== undefined) {
                this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
            }
            const pinScreenTransform = mapPin.sceneObject.getComponent("ScreenTransform");
            this.pinOffsetter.unbindScreenTransform(pinScreenTransform);
            mapPin.sceneObject.destroy();
            this.onMapPinRemovedEvent.invoke(mapPin);
        }
        /**
         * Removes all the map pins from the map
         */
        removeMapPins() {
            this.pinSet.forEach((pin) => {
                this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
                this.pinSet.delete(pin);
                pin.sceneObject.destroy();
            });
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
            const offset = this.gridView
                .getOffset()
                .sub(this.offsetForLocation)
                .sub(new vec2(0.5, 0.5));
            const location = this.fromLocalPositionToLongLat(new vec2(adjustedAnchoredPosition.x - offset.x, adjustedAnchoredPosition.y + offset.y), this.mapParameters.zoomLevel);
            pin.location = location;
            this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
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
        /**
         * Provide the cells to be configures / built. Cells are reused as data is scrolled.
         */
        configureCell(cell) {
            cell.imageComponent = cell.sceneObject.getComponent("Component.Image");
            cell.imageComponent.mainMaterial = cell.imageComponent.mainMaterial.clone();
            // Creating Map Texture Provider
            const mapTexture = this.mapModule.createMapTextureProvider();
            cell.textureProvider = mapTexture.control;
            cell.imageComponent.mainPass.baseTex = mapTexture;
            cell.onTileCameIntoView.add((event) => this.onTileCameIntoViewEvent.invoke(event));
            cell.onTileWentOutOfView.add((event) => this.onTileWentOutOfViewEvent.invoke(event));
            //A function that gets called when location data fails to download.
            cell.textureProvider.onFailed.add(() => {
                log.e("Location data failed to download");
                cell.retryTextureLoading();
            });
            //A function that gets called when location data is downloaded.
            cell.textureProvider.onReady.add(() => {
                this.mapTileloaded();
            });
        }
        //Called when individual map tile is loaded
        mapTileloaded() {
            this.loadedCells++;
            if (this.loadedCells == this.mapCellCount) {
                this.onMapTilesLoadedEvent.invoke();
            }
        }
        onCellCountChanged(cellCount) {
            this.mapCellCount = cellCount;
        }
        setUpZoom() {
            this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(this.mapLocation.longitude, this.mapLocation.latitude).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
            this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(MAX_LONGITUDE, MAX_LATITUDE).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
            // Calculate how much the map needs to be scrolled to match the geo position of the tile
            this.updateLocationOffset();
            // Offset the map so that it include the map focus position and the offset for the initial location for the provided tile
            this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
            // Create a binder that can offset a screen transfor for a given location
            this.pinOffsetter = PinOffsetter_1.PinOffsetter.makeMapLocationOffsetter(this.mapModule, this.referencePositionLocationAsset);
            // Apply the config (will build the grid view if not already, then will apply the settings)
            this.gridView.handleUpdateConfig(this.config);
        }
        /**
         * Spawning a user pin
         */
        spawnUserPin(mapPinPrefab, location, mapPinScale) {
            this.userPin = MapPin_1.MapPin.makeMapPin(mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder + 2, location, undefined, true);
            this.userPin.screenTransform.scale = new vec3(mapPinScale.x, mapPinScale.y, 1.0);
            // Bind a location pin
            this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
        }
        /**
         * For enabling/disabling scrolling of the map
         */
        setMapScrolling(value) {
            this.config.horizontalScrollingEnabled = value;
            this.config.verticalScrollingEnabled = value;
        }
        /**
         * Setting if user pin should be rotated
         */
        setUserPinRotated(value) {
            this.mapParameters.userPinAlignedWithOrientation = value;
        }
        /**
         * Getting initial map location (middle tile)
         */
        getInitialMapTileLocation() {
            return this.initialMapLocation;
        }
        handleHoverUpdate(localPosition) {
            if (!this.isInitialized) {
                return;
            }
            if (this.isDraggingPin) {
                return;
            }
            localPosition = localPosition.uniformScale(0.5);
            const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
            this.pinSet.forEach((pin) => {
                const isHoveringPin = adjustedAnchoredPosition.distance(pin.screenTransform.anchors.getCenter()) < this.mapParameters.mapPinCursorDetectorSize;
                if (isHoveringPin) {
                    log.i("Pin hovered");
                    if (!this.hoveringPinSet.has(pin)) {
                        this.hoveringPinSet.add(pin);
                        // Enable outline object
                        pin.enableOutline(true);
                    }
                }
                else if (this.hoveringPinSet.has(pin)) {
                    log.i("Pin exit hover");
                    this.hoveringPinSet.delete(pin);
                    // Disable outline object
                    pin.enableOutline(false);
                }
            });
        }
        handleTouchStart(localPosition) {
            if (!this.isInitialized) {
                return;
            }
            if (this.hoveringPinSet.size > 0) {
                log.i(`handleTouchStart`);
                for (let value of this.hoveringPinSet.values()) {
                    this.draggingPin = value;
                    break;
                }
                this.isDraggingPin = true;
            }
            else {
                this.gridView.handleScrollStart(localPosition);
            }
        }
        handleTouchUpdate(localPosition) {
            if (!this.isInitialized) {
                return;
            }
            if (this.isDraggingPin) {
                localPosition = localPosition.uniformScale(0.5);
                const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
                this.pinOffsetter.layoutScreenTransforms(this.gridView);
                this.pinOffsetter.unbindScreenTransform(this.draggingPin.screenTransform);
                this.draggingPin.screenTransform.anchors.setCenter(adjustedAnchoredPosition);
            }
            else {
                this.gridView.handleScrollUpdate(localPosition);
            }
        }
        handleTouchEnd(localPosition) {
            if (!this.isInitialized) {
                return;
            }
            if (this.isDraggingPin) {
                localPosition = localPosition.uniformScale(0.5);
                const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
                log.i(`handleTouchEnd at: ${adjustedAnchoredPosition}`);
                this.setPinLocation(this.draggingPin, adjustedAnchoredPosition.uniformScale(0.5));
                this.hoveringPinSet.add(this.draggingPin);
                this.draggingPin.sceneObject.getChild(0).enabled = true;
                this.draggingPin = null;
                this.isDraggingPin = false;
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
            this.pinSet.forEach((pin) => {
                this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
            });
        }
        handleZoomOut() {
            this.mapParameters.zoomLevel--;
            this.mapParameters.zoomOffet = (0, MapUtils_1.calculateZoomOffset)(this.mapParameters.zoomLevel);
            this.setUpZoom();
            this.gridView.layoutCells(true);
            this.pinSet.forEach((pin) => {
                this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
            });
        }
        toggleMiniMap(isOn) {
            if (this.gridView === undefined) {
                return;
            }
            this.config.gridScreenTransform.rotation = quat.quatIdentity();
            this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin);
            if (!isOn) {
                this.pinSet.forEach((pin) => {
                    pin.screenTransform.rotation = quat.quatIdentity();
                });
            }
            this.onMiniMapToggledEvent.invoke(isOn);
        }
        //  Map functionality
        // =====
        /**
         * Setting new position for user pin
         */
        setNewUserPosition(location) {
            const oldUserLocation = this.userLocation;
            this.userLocation = location;
            this.pinOffsetter.bindScreenTransformToLocation(this.userPin.screenTransform, location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
            if (oldUserLocation === undefined && location !== undefined) {
                this.onUserLocationSetEvent.invoke(location);
            }
        }
        /**
         * Setting a new location for the map
         */
        setNewMapLocation(location) {
            this.mapLocation = location;
            this.pinOffsetter.bindScreenTransformToLocation(this.mapPinsAnchor.getComponent("ScreenTransform"), location.longitude, location.latitude);
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
            if (this.shouldFollowMapLocation) {
                this.offsetForLocation = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, location.longitude, location.latitude);
                this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));
            }
        }
        //  Drawing geometry to map
        // =====
        /**
         * Drawing geometry point to map
         */
        drawGeometryPoint(geometryPoint, radius = 0.1) {
            const position = this.getWorldPositionForGeometryPoint(geometryPoint);
            const sceneObject = global.scene.createSceneObject("");
            sceneObject.setParent(this.getSceneObject());
            const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
            screenTransform.rotation = this.currentMapRotation.invert();
            const renderMeshSceneObject = global.scene.createSceneObject("");
            renderMeshSceneObject.setParent(sceneObject);
            renderMeshSceneObject.layer = this.getSceneObject().layer;
            (0, MapUtils_1.addRenderMeshVisual)(renderMeshSceneObject, (0, MapUtils_1.makeCircle2DMesh)(position, radius), this.lineMaterial, this.mapRenderOrder + 1);
            this.pinOffsetter.bindScreenTransformToLocation(screenTransform, this.mapLocation.longitude, this.mapLocation.latitude);
            this.geometryObjects.push(sceneObject);
        }
        /**
         * Drawing geometry line to map
         */
        drawGeometryLine(geometryLine, thickness = 0.2) {
            const start = this.getWorldPositionForGeometryPoint(geometryLine[0]);
            const end = this.getWorldPositionForGeometryPoint(geometryLine[1]);
            const sceneObject = global.scene.createSceneObject("");
            sceneObject.setParent(this.getSceneObject());
            const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
            screenTransform.rotation = this.currentMapRotation.invert();
            var renderMeshSceneObject = global.scene.createSceneObject("");
            renderMeshSceneObject.setParent(sceneObject);
            renderMeshSceneObject.layer = this.getSceneObject().layer;
            (0, MapUtils_1.addRenderMeshVisual)(renderMeshSceneObject, (0, MapUtils_1.makeLineStrip2DMeshWithJoints)([start, end], thickness), this.lineMaterial, this.mapRenderOrder + 1);
            this.pinOffsetter.bindScreenTransformToLocation(screenTransform, this.mapLocation.longitude, this.mapLocation.latitude);
            this.geometryObjects.push(sceneObject);
        }
        /**
         * Drawing geometry multiline to map
         */
        drawGeometryMultiline(geometryMultiline, thickness = 0.2) {
            const sceneObject = global.scene.createSceneObject("");
            sceneObject.setParent(this.getSceneObject());
            const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
            screenTransform.rotation = this.currentMapRotation.invert();
            const renderMeshSceneObject = global.scene.createSceneObject("");
            renderMeshSceneObject.setParent(sceneObject);
            renderMeshSceneObject.layer = this.getSceneObject().layer;
            const positions = geometryMultiline.map((point) => this.getWorldPositionForGeometryPoint(point));
            (0, MapUtils_1.addRenderMeshVisual)(renderMeshSceneObject, (0, MapUtils_1.makeLineStrip2DMeshWithJoints)(positions, thickness), this.lineMaterial, this.mapRenderOrder + 1);
            this.pinOffsetter.bindScreenTransformToLocation(screenTransform, this.mapLocation.longitude, this.mapLocation.latitude);
            this.geometryObjects.push(sceneObject);
        }
        /**
         * Clearing all drawn geometry
         */
        clearGeometry() {
            this.geometryObjects.forEach((sceneObject) => {
                this.pinOffsetter.unbindScreenTransform(sceneObject.getComponent("Component.ScreenTransform"));
                sceneObject.destroy();
            });
        }
        /**
         * Getting world position for geometry
         */
        getWorldPositionForGeometryPoint(geometryPoint) {
            var offset = this.gridView.getOffset();
            var initialTileOffset = this.mapModule.longLatToImageRatio(geometryPoint.x, geometryPoint.y, this.referencePositionLocationAsset);
            var localPoint = new vec2((0, MapUtils_1.lerp)(-1, 1, offset.x + initialTileOffset.x), (0, MapUtils_1.lerp)(1, -1, offset.y + initialTileOffset.y));
            return this.config.gridScreenTransform.localPointToWorldPoint(localPoint);
        }
        // Config bindings
        // =====
        /**
         * Assign the renderLayer to all the content on the content anchor
         */
        onContentMaskRenderLayer(renderLayer) {
            (0, MapUtils_1.forEachSceneObjectInSubHierarchy)(this.mapPinsAnchor, (sceneObject) => {
                sceneObject.layer = renderLayer;
            });
        }
        /**
         * If the grid view scrolls, stop moving the view
         */
        onScrollingStarted() {
            log.i("onScrollingStarted");
            this.shouldFollowMapLocation = false;
            this.viewScrolled = true;
            this.onMapScrolledEvent.invoke();
        }
        /**
         *  Every tile the map updates it layout
         */
        onLayout() {
            this.pinOffsetter.layoutScreenTransforms(this.gridView);
        }
        /**
         * On the recenter call, scroll back to centre of the map
         */
        centerMap() {
            if (!this.isInitialized) {
                return;
            }
            if (this.tweenCancelFunction) {
                this.tweenCancelFunction();
            }
            const currentOffset = this.gridView.getOffset();
            const userOffset = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
            const targetOffset = userOffset.add(new vec2(0.5, 0.5));
            this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                // Stop the scroll view from scrolling
                this.gridView.resetVelocity();
                // Move it towards it's target position
                this.gridView.setOffset(vec2.lerp(currentOffset, targetOffset, t));
                if (t === 1) {
                    this.shouldFollowMapLocation = true;
                    this.viewScrolled = false;
                    this.onMapCenteredEvent.invoke();
                }
            }, CENTER_MAP_TWEEN_DURATION);
        }
        isMapCentered() {
            const currentOffset = this.gridView.getOffset();
            const userOffset = (0, MapUtils_1.getOffsetForLocation)(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude);
            return currentOffset === userOffset.add(new vec2(0.5, 0.5));
        }
        getPositionWithMapRotationOffset(localPosition) {
            const degInRad = Math.atan2(localPosition.y, localPosition.x);
            const distance = Math.sqrt(localPosition.x * localPosition.x + localPosition.y * localPosition.y);
            const mapRotInRad = (0, MapUtils_1.customGetEuler)(this.config.gridScreenTransform.rotation).z;
            const adjustedRotationInRad = degInRad - mapRotInRad;
            const adjustedLocalPosition = new vec2(Math.cos(adjustedRotationInRad), Math.sin(adjustedRotationInRad)).uniformScale(distance);
            return adjustedLocalPosition;
        }
        showNearbyPlaces(category) {
            this.placesProvider
                .getNearbyPlaces(this.mapLocation, NEARBY_PLACES_RANGE, category)
                .then((places) => {
                if (places.length === 0) {
                    this.onNoNearbyPlacesFoundEvent.invoke();
                    return;
                }
                const placeString = places
                    .map((place) => {
                    return `${place.name}`;
                })
                    .join("\n");
                log.i("get nearby places: " + placeString);
                this.placesProvider
                    .getPlacesInfo(places)
                    .then((placesInfo) => {
                    for (let i = 0; i < placesInfo.length; i++) {
                        // Check if the place is already pinned
                        if (!this.pinnedPlaceSet.has(placesInfo[i].placeId)) {
                            this.createMapPin(placesInfo[i].centroid, placesInfo[i]);
                            this.pinnedPlaceSet.add(placesInfo[i].placeId);
                        }
                    }
                })
                    .catch((error) => {
                    log.e(error);
                });
            })
                .catch((error) => {
                log.e(error);
                this.onNearbyPlacesFailedEvent.invoke();
            });
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