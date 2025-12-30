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
exports.MapComponent = void 0;
var __selfType = requireType("./MapComponent");
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
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const MapUtils_1 = require("./MapUtils");
require('LensStudio:ProcessedLocationModule');
let MapComponent = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapComponent = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.tileCount = this.tileCount;
            this.mapRenderParent = this.mapRenderParent;
            this.mapZoomLevel = this.mapZoomLevel;
            this.showUserPin = this.showUserPin;
            this.userPinVisual = this.userPinVisual;
            this.userPinScale = this.userPinScale;
            this.userPinAlignedWithOrientation = this.userPinAlignedWithOrientation;
            this.mapPinPrefab = this.mapPinPrefab;
            this.mapPinsRotated = this.mapPinsRotated;
            this.mapPinCursorDetectorSize = this.mapPinCursorDetectorSize;
            this.enableScrolling = this.enableScrolling;
            this.scrollingFriction = this.scrollingFriction;
            this.setMapToCustomLocation = this.setMapToCustomLocation;
            this.longitude = this.longitude;
            this.latitude = this.latitude;
            this.rotation = this.rotation;
            this.isMinimapAutoRotate = this.isMinimapAutoRotate;
            this.enableMapSmoothing = this.enableMapSmoothing;
            this.mapUpdateThreshold = this.mapUpdateThreshold;
            this.startedAsMiniMap = this.startedAsMiniMap;
            this.autoRotateToggleButton = this.autoRotateToggleButton;
            this.placesClamContainer = this.placesClamContainer;
            this.placesListParent = this.placesListParent;
            this.placeItemPrefab = this.placeItemPrefab;
            this.placesClamCloseButton = this.placesClamCloseButton;
            this.placeItemSpacing = this.placeItemSpacing;
            this.fallbackPlacesCount = this.fallbackPlacesCount;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.placesResponseAnimator = this.placesResponseAnimator;
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.isCollectingPins = false;
        }
        __initialize() {
            super.__initialize();
            this.tileCount = this.tileCount;
            this.mapRenderParent = this.mapRenderParent;
            this.mapZoomLevel = this.mapZoomLevel;
            this.showUserPin = this.showUserPin;
            this.userPinVisual = this.userPinVisual;
            this.userPinScale = this.userPinScale;
            this.userPinAlignedWithOrientation = this.userPinAlignedWithOrientation;
            this.mapPinPrefab = this.mapPinPrefab;
            this.mapPinsRotated = this.mapPinsRotated;
            this.mapPinCursorDetectorSize = this.mapPinCursorDetectorSize;
            this.enableScrolling = this.enableScrolling;
            this.scrollingFriction = this.scrollingFriction;
            this.setMapToCustomLocation = this.setMapToCustomLocation;
            this.longitude = this.longitude;
            this.latitude = this.latitude;
            this.rotation = this.rotation;
            this.isMinimapAutoRotate = this.isMinimapAutoRotate;
            this.enableMapSmoothing = this.enableMapSmoothing;
            this.mapUpdateThreshold = this.mapUpdateThreshold;
            this.startedAsMiniMap = this.startedAsMiniMap;
            this.autoRotateToggleButton = this.autoRotateToggleButton;
            this.placesClamContainer = this.placesClamContainer;
            this.placesListParent = this.placesListParent;
            this.placeItemPrefab = this.placeItemPrefab;
            this.placesClamCloseButton = this.placesClamCloseButton;
            this.placeItemSpacing = this.placeItemSpacing;
            this.fallbackPlacesCount = this.fallbackPlacesCount;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.placesResponseAnimator = this.placesResponseAnimator;
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.isCollectingPins = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            this.aiAnimator = this.aiResponseAnimator;
            this.placesAnimator = this.placesResponseAnimator;
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
            this.setupPinCollection();
            if (this.autoRotateToggleButton) {
                this.setupAutoRotateToggleButton();
            }
            if (this.placesClamCloseButton) {
                this.placesClamCloseButton.onButtonPinched.add(() => {
                    this.closePlacesClam();
                });
            }
            // Subscribe to failure events for fallback
            this.subscribeOnNoNearbyPlacesFound(() => {
                print("No nearby places found, loading fallback");
                this.isCollectingPins = false;
                this.loadFallbackPlaces();
                this.populatePlacesList();
                this.placesAnimator.animateIn();
            });
            this.subscribeOnNearbyPlacesFailed(() => {
                print("Nearby places failed, loading fallback");
                this.isCollectingPins = false;
                this.loadFallbackPlaces();
                this.populatePlacesList();
                this.placesAnimator.animateIn();
            });
        }
        setupPinCollection() {
            this.subscribeOnMapAddPin((pin) => {
                if (!this.isCollectingPins)
                    return;
                const pinIndex = this.placesData.length;
                const isActive = pinIndex < 3;
                print("Pin collected: " + (pin.placeInfo ? pin.placeInfo.name : pin.sceneObject.name) + " (index: " + pinIndex + ", active: " + isActive + ")");
                const placeItem = {
                    name: pin.placeInfo ? pin.placeInfo.name : pin.sceneObject.name,
                    longitude: pin.location ? pin.location.longitude : 0,
                    latitude: pin.location ? pin.location.latitude : 0,
                    pin: pin,
                    questMarker: undefined,
                    isActive: isActive
                };
                this.placesData.push(placeItem);
                print("Total pins collected: " + this.placesData.length);
                if (isActive) {
                    print("Showing pin " + pinIndex);
                    this.showPlacePin(pin);
                }
                else {
                    print("Hiding pin " + pinIndex);
                    this.hidePlacePin(pin);
                }
            });
        }
        setupAutoRotateToggleButton() {
            if (this.autoRotateToggleButton) {
                this.autoRotateToggleButton.onButtonPinched.add((event) => {
                    this.isMinimapAutoRotate = !this.isMinimapAutoRotate;
                    if (this.mapController) {
                        this.mapController.setMinimapAutoRotate(this.isMinimapAutoRotate);
                        if (this.isMinimapAutoRotate) {
                            this.mapController.centerMap();
                        }
                    }
                });
            }
        }
        openPlacesClam(categoryName) {
            if (!this.placesClamContainer || !this.placesAnimator)
                return;
            if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
                this.placesAnimator.adjustForAI(true);
            }
            // Force refresh à chaque ouverture
            this.placesData = []; // Clear explicitement pour éviter reuse
            const categories = categoryName || ["restaurant", "cafe", "bar"];
            this.loadNearbyPlaces(categories);
        }
        closePlacesClam() {
            if (this.placesAnimator) {
                print("Closing Places Clam (keeping data)");
                this.placesAnimator.animateOut();
            }
        }
        loadNearbyPlaces(categoryName) {
            print("=== loadNearbyPlaces START ===");
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.isCollectingPins = true;
            try {
                this.mapController.showNearbyPlaces(categoryName);
                // Delay for success case to allow pins to be collected
                const successDelay = this.createEvent("DelayedCallbackEvent");
                successDelay.bind(() => {
                    this.isCollectingPins = false;
                    if (this.placesData.length === 0) {
                        this.loadFallbackPlaces();
                    }
                    this.populatePlacesList();
                    this.placesAnimator.animateIn();
                });
                successDelay.reset(5); // Increased to 5 seconds to allow API response
            }
            catch (error) {
                print("Error showing nearby places: " + error);
                this.isCollectingPins = false;
                // Fallback handled by events or delay
            }
            print("=== loadNearbyPlaces END ===");
        }
        loadFallbackPlaces() {
            print("Loading fallback places");
            const userLocation = this.mapController.getUserLocation();
            if (!userLocation) {
                print("No user location for fallback");
                return;
            }
            const radius = 0.005; // ~500m
            for (let i = 0; i < this.fallbackPlacesCount; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const dist = Math.random() * radius;
                const lat = userLocation.latitude + dist * Math.cos(angle);
                const lon = userLocation.longitude + dist * Math.sin(angle);
                const location = GeoPosition.create();
                location.longitude = lon;
                location.latitude = lat;
                const pin = this.mapController.createMapPin(location);
                const placeItem = {
                    name: `Place ${i + 1}`,
                    longitude: lon,
                    latitude: lat,
                    pin: pin,
                    questMarker: undefined,
                    isActive: i < 3
                };
                this.placesData.push(placeItem);
                if (placeItem.isActive) {
                    this.showPlacePin(pin);
                }
                else {
                    this.hidePlacePin(pin);
                }
            }
            print(`Created ${this.placesData.length} fallback places`);
        }
        populatePlacesList() {
            print("=== populatePlacesList START ===");
            this.clearPlacesList();
            if (!this.placesListParent || !this.placeItemPrefab) {
                print("Missing places list components");
                return;
            }
            print(`Populating with ${this.placesData.length} places`);
            const height = 0.1; // Assumed item height in anchor space
            const gap = Math.abs(this.placeItemSpacing) / 100; // Convert to anchor units, use abs for positive gap
            let currentTop = 1.0; // Start from top of parent
            for (let i = 0; i < this.placesData.length; i++) {
                const place = this.placesData[i];
                const uiObject = this.placeItemPrefab.instantiate(this.placesListParent);
                const textComponent = this.findTextInChildren(uiObject);
                if (textComponent) {
                    textComponent.text = place.name;
                }
                const screenTransform = uiObject.getComponent("Component.ScreenTransform");
                if (screenTransform) {
                    screenTransform.anchors.top = currentTop;
                    screenTransform.anchors.bottom = currentTop - height;
                    currentTop = screenTransform.anchors.bottom - gap;
                }
                const pinchButton = uiObject.getComponent("Component.ScriptComponent");
                if (pinchButton) {
                    pinchButton.onButtonPinched.add(() => {
                        this.togglePlaceActive(i);
                    });
                }
                place.uiObject = uiObject;
                print(`Created UI for place ${i}: ${place.name}`);
            }
            this.placesUIShown = true;
            this.applyQuestMarkersState();
            print("=== populatePlacesList END ===");
        }
        togglePlaceActive(index) {
            if (index < 0 || index >= this.placesData.length)
                return;
            const place = this.placesData[index];
            place.isActive = !place.isActive;
            if (place.pin) {
                if (place.isActive) {
                    this.showPlacePin(place.pin);
                }
                else {
                    this.hidePlacePin(place.pin);
                }
            }
            if (place.questMarker) {
                if (place.isActive) {
                    this.showQuestMarker(place.questMarker);
                }
                else {
                    this.hideQuestMarker(place.questMarker);
                }
            }
            // Optionnel: Mettre à jour l'UI du bouton
            if (place.uiObject) {
                const text = this.findTextInChildren(place.uiObject);
                if (text) {
                    text.textFill.color = place.isActive ? new vec4(0, 1, 0, 1) : new vec4(1, 0, 0, 1);
                }
            }
        }
        showPlacePin(pin) {
            if (pin && pin.sceneObject) {
                pin.sceneObject.enabled = true;
            }
        }
        hidePlacePin(pin) {
            if (pin && pin.sceneObject) {
                pin.sceneObject.enabled = false;
            }
        }
        showQuestMarker(questMarker) {
            if (questMarker && questMarker.transform) {
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = true;
                }
            }
        }
        hideQuestMarker(questMarker) {
            if (questMarker && questMarker.transform) {
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = false;
                }
            }
        }
        findTextInChildren(parent) {
            const queue = [parent];
            while (queue.length > 0) {
                const current = queue.shift();
                const textComponents = current.getComponents("Component.Text");
                if (textComponents && textComponents.length > 0) {
                    return textComponents[0];
                }
                for (let i = 0; i < current.getChildrenCount(); i++) {
                    queue.push(current.getChild(i));
                }
            }
            return null;
        }
        clearPlacesList() {
            if (!this.placesListParent)
                return;
            const childCount = this.placesListParent.getChildrenCount();
            print("Clearing " + childCount + " children from places list");
            for (let i = childCount - 1; i >= 0; i--) {
                const child = this.placesListParent.getChild(i);
                child.destroy();
            }
        }
        linkQuestMarkerToPlace(pin, questMarker) {
            print("=== linkQuestMarkerToPlace ===");
            if (questMarker && questMarker.transform) {
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = false;
                    print("Quest marker FORCE HIDDEN initially: " + sceneObject.name);
                }
            }
            const place = this.placesData.find(p => p.pin === pin);
            if (place) {
                print("Found matching place: " + place.name + " (active: " + place.isActive + ")");
                place.questMarker = questMarker;
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    if (place.isActive) {
                        print("Place is ACTIVE, showing quest marker for: " + place.name);
                        this.showQuestMarker(questMarker);
                    }
                    else {
                        print("Place is INACTIVE, quest marker stays hidden for: " + place.name);
                        this.hideQuestMarker(questMarker);
                    }
                });
                delayEvent.reset(0.2);
            }
            else {
                print("WARNING: Could not find place for pin - quest marker stays hidden");
                if (questMarker && questMarker.transform) {
                    const sceneObject = questMarker.transform.getSceneObject();
                    if (sceneObject) {
                        sceneObject.enabled = false;
                    }
                }
            }
        }
        applyQuestMarkersState() {
            print("=== Applying quest markers state to " + this.placesData.length + " places ===");
            let appliedCount = 0;
            let shownCount = 0;
            let hiddenCount = 0;
            for (let i = 0; i < this.placesData.length; i++) {
                const place = this.placesData[i];
                if (place.questMarker) {
                    print("Place " + i + ": " + place.name + " isActive=" + place.isActive);
                    if (place.isActive) {
                        this.showQuestMarker(place.questMarker);
                        shownCount++;
                    }
                    else {
                        this.hideQuestMarker(place.questMarker);
                        hiddenCount++;
                    }
                    appliedCount++;
                }
                else {
                    print("Place " + i + ": " + place.name + " has NO quest marker yet");
                }
            }
            print("Applied state to " + appliedCount + " quest markers (shown: " + shownCount + ", hidden: " + hiddenCount + ")");
        }
        forceHideAllQuestMarkersThenShow() {
            print("=== FORCE HIDING ALL QUEST MARKERS ===");
            const mapControllerAny = this.mapController;
            if (mapControllerAny.questMarkers) {
                const allMarkers = mapControllerAny.questMarkers;
                print("Found " + allMarkers.length + " quest markers in controller");
                for (let i = 0; i < allMarkers.length; i++) {
                    const marker = allMarkers[i];
                    if (marker && marker.transform) {
                        const sceneObject = marker.transform.getSceneObject();
                        if (sceneObject) {
                            sceneObject.enabled = false;
                        }
                    }
                }
                print("All quest markers forcibly hidden");
            }
            let shownCount = 0;
            for (let i = 0; i < this.placesData.length; i++) {
                const place = this.placesData[i];
                if (place.questMarker && place.isActive) {
                    this.showQuestMarker(place.questMarker);
                    shownCount++;
                }
            }
            print("Shown " + shownCount + " active quest markers");
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
            this.openPlacesClam(categoryName);
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
    };
    __setFunctionName(_classThis, "MapComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapComponent = _classThis;
})();
exports.MapComponent = MapComponent;
//# sourceMappingURL=MapComponent.js.map