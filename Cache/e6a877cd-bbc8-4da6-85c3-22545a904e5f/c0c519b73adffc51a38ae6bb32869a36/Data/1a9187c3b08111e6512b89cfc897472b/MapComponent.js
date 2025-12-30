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
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
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
            this.placesClamVisibleY = this.placesClamVisibleY;
            this.placesClamHiddenOffset = this.placesClamHiddenOffset;
            this.fallbackPlacesCount = this.fallbackPlacesCount;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.placesClamAnimation = null;
            this.isPlacesClamAnimating = false;
            this.isPlacesClamVisible = false;
            this.placesClamActualHiddenY = 0;
            this.placesClamActualVisibleY = 0;
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
            this.placesClamVisibleY = this.placesClamVisibleY;
            this.placesClamHiddenOffset = this.placesClamHiddenOffset;
            this.fallbackPlacesCount = this.fallbackPlacesCount;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.placesClamAnimation = null;
            this.isPlacesClamAnimating = false;
            this.isPlacesClamVisible = false;
            this.placesClamActualHiddenY = 0;
            this.placesClamActualVisibleY = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            this.aiAnimator = this.aiResponseAnimator;
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
            this.initializePlacesClam();
        }
        initializePlacesClam() {
            if (this.placesClamContainer) {
                this.placesClamTransform = this.placesClamContainer.getTransform();
                const pos = this.placesClamTransform.getLocalPosition();
                this.placesClamActualVisibleY = this.placesClamVisibleY;
                this.placesClamActualHiddenY = this.placesClamActualVisibleY + this.placesClamHiddenOffset;
                pos.y = this.placesClamActualHiddenY;
                this.placesClamTransform.setLocalPosition(pos);
                this.placesClamContainer.enabled = false;
            }
            if (this.placesClamCloseButton) {
                this.placesClamCloseButton.onButtonPinched.add(() => {
                    this.closePlacesClam();
                });
            }
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
            if (!this.placesClamContainer)
                return;
            if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
                this.adjustPlacesForAI(true);
            }
            if (this.nearbyPlacesCache.length > 0) {
                this.populatePlacesList();
                this.animatePlacesClamIn();
            }
            else {
                const categories = categoryName || ["restaurant", "cafe", "bar"];
                this.loadNearbyPlaces(categories);
            }
        }
        closePlacesClam() {
            this.animatePlacesClamOut();
        }
        adjustPlacesForAI(forAI, callback) {
            const newVisibleY = forAI ? this.placesClamVisibleY * 2 : this.placesClamVisibleY;
            const newHiddenY = newVisibleY + this.placesClamHiddenOffset;
            if (newVisibleY === this.placesClamActualVisibleY && newHiddenY === this.placesClamActualHiddenY) {
                if (callback)
                    callback();
                return;
            }
            this.placesClamActualVisibleY = newVisibleY;
            this.placesClamActualHiddenY = newHiddenY;
            if (this.isPlacesClamVisible) {
                if (this.isPlacesClamAnimating && this.placesClamAnimation) {
                    this.placesClamAnimation();
                }
                this.isPlacesClamAnimating = true;
                const startY = this.placesClamTransform.getLocalPosition().y;
                this.placesClamAnimation = (0, animate_1.default)({
                    duration: 0.5,
                    easing: "ease-out-back",
                    update: (t) => {
                        const pos = this.placesClamTransform.getLocalPosition();
                        pos.y = MathUtils.lerp(startY, this.placesClamActualVisibleY, t);
                        this.placesClamTransform.setLocalPosition(pos);
                    },
                    ended: () => {
                        this.isPlacesClamAnimating = false;
                        this.placesClamAnimation = null;
                        if (callback)
                            callback();
                    }
                });
            }
            else {
                if (callback)
                    callback();
            }
        }
        animatePlacesClamIn() {
            if (this.isPlacesClamVisible && !this.isPlacesClamAnimating)
                return;
            if (!this.placesClamContainer || !this.placesClamTransform)
                return;
            if (this.isPlacesClamAnimating && this.placesClamAnimation) {
                this.placesClamAnimation();
            }
            this.isPlacesClamAnimating = true;
            this.isPlacesClamVisible = true;
            this.placesClamContainer.enabled = true;
            this.placesClamAnimation = (0, animate_1.default)({
                duration: 0.5,
                easing: "ease-out-back",
                update: (t) => {
                    const pos = this.placesClamTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(this.placesClamActualHiddenY, this.placesClamActualVisibleY, t);
                    this.placesClamTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isPlacesClamAnimating = false;
                    this.placesClamAnimation = null;
                }
            });
        }
        animatePlacesClamOut() {
            if (!this.isPlacesClamVisible && !this.isPlacesClamAnimating)
                return;
            if (!this.placesClamContainer || !this.placesClamTransform)
                return;
            if (this.isPlacesClamAnimating && this.placesClamAnimation) {
                this.placesClamAnimation();
            }
            this.isPlacesClamAnimating = true;
            const startY = this.placesClamTransform.getLocalPosition().y;
            this.placesClamAnimation = (0, animate_1.default)({
                duration: 0.5,
                easing: "ease-in-quad",
                update: (t) => {
                    const pos = this.placesClamTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(startY, this.placesClamActualHiddenY, t);
                    this.placesClamTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isPlacesClamAnimating = false;
                    this.isPlacesClamVisible = false;
                    this.placesClamContainer.enabled = false;
                    this.placesClamAnimation = null;
                    if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
                        this.adjustPlacesForAI(false);
                    }
                }
            });
        }
        loadNearbyPlaces(categoryName) {
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            let timeoutTriggered = false;
            const timeoutEvent = this.createEvent("DelayedCallbackEvent");
            timeoutEvent.bind(() => {
                if (!this.placesUIShown && this.placesData.length === 0) {
                    timeoutTriggered = true;
                    this.placesUIShown = true;
                    this.delayedShowPlacesUI();
                }
            });
            timeoutEvent.reset(3.0);
            const pinAddedCallback = (pin) => {
                if (timeoutTriggered)
                    return;
                const location = pin.location;
                // Le code original pour traiter chaque pin ajouté était tronqué dans le document fourni.
                // Tu peux remettre ici la logique originale si tu l'as encore.
            };
            this.subscribeOnMapAddPin(pinAddedCallback);
            this.mapController.showNearbyPlaces(categoryName);
        }
        delayedShowPlacesUI() {
            if (this.placesClamContainer && !this.placesClamContainer.enabled) {
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    if (this.placesData.length === 0) {
                        this.createFallbackPlaces();
                    }
                    this.populatePlacesList();
                    this.animatePlacesClamIn();
                });
                delayEvent.reset(0.5);
            }
        }
        createFallbackPlaces() {
            for (let i = 0; i < this.fallbackPlacesCount; i++) {
                this.placesData.push({
                    name: "Place " + i,
                    longitude: 0,
                    latitude: 0,
                    pin: null,
                    questMarker: undefined,
                    isActive: false
                });
            }
        }
        populatePlacesList() {
            if (!this.placesListParent || !this.placeItemPrefab)
                return;
            this.clearPlacesList();
            let currentY = 0;
            for (let i = 0; i < this.placesData.length; i++) {
                const place = this.placesData[i];
                const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
                place.uiObject = itemInstance;
                const itemTransform = itemInstance.getTransform();
                const pos = itemTransform.getLocalPosition();
                pos.y = currentY;
                itemTransform.setLocalPosition(pos);
                currentY += this.placeItemSpacing;
                this.setPlaceItemText(itemInstance, place.name);
                this.setupPlaceToggle(itemInstance, place, i);
            }
        }
        setPlaceItemText(itemObject, placeName) {
            const textComponent = this.findTextInChildren(itemObject);
            if (textComponent) {
                textComponent.text = placeName;
            }
        }
        setupPlaceToggle(itemObject, place, index) {
            for (let i = 0; i < itemObject.getChildrenCount(); i++) {
                const child = itemObject.getChild(i);
                if (child.name === "Switch" || child.name.includes("Switch")) {
                    const childComponents = child.getComponents("Component.ScriptComponent");
                    for (let j = 0; j < childComponents.length; j++) {
                        const switchComponent = childComponents[j];
                        const componentName = switchComponent.constructor ? switchComponent.constructor.name : "unknown";
                        if (componentName === "Switch" || (switchComponent.typeName && switchComponent.typeName === "Switch")) {
                            try {
                                switchComponent.isOn = place.isActive;
                            }
                            catch (e) {
                                // Ignore errors
                            }
                            if (switchComponent.onStateChanged && typeof switchComponent.onStateChanged.add === "function") {
                                switchComponent.onStateChanged.add(() => {
                                    const newState = switchComponent.isOn;
                                    this.togglePlace(index, newState);
                                });
                                return;
                            }
                        }
                    }
                }
            }
        }
        togglePlace(index, isActive) {
            if (index < 0 || index >= this.placesData.length)
                return;
            const place = this.placesData[index];
            if (place.isActive === isActive)
                return;
            place.isActive = isActive;
            if (!place.pin)
                return;
            if (isActive) {
                this.showPlacePin(place.pin);
                if (place.questMarker) {
                    this.showQuestMarker(place.questMarker);
                }
            }
            else {
                this.hidePlacePin(place.pin);
                if (place.questMarker) {
                    this.hideQuestMarker(place.questMarker);
                }
            }
        }
        hidePlacePin(pin) {
            const pinObject = pin.sceneObject;
            if (pinObject) {
                pinObject.enabled = false;
            }
        }
        showPlacePin(pin) {
            const pinObject = pin.sceneObject;
            if (pinObject) {
                pinObject.enabled = true;
            }
        }
        hideAllPlacePins() {
            this.placesData.forEach(place => {
                if (place.pin) {
                    this.hidePlacePin(place.pin);
                }
                if (place.questMarker) {
                    this.hideQuestMarker(place.questMarker);
                }
            });
        }
        hideQuestMarker(questMarker) {
            if (questMarker && questMarker.transform) {
                questMarker.transform.getSceneObject().enabled = false;
            }
        }
        showQuestMarker(questMarker) {
            if (questMarker && questMarker.transform) {
                questMarker.transform.getSceneObject().enabled = true;
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
            for (let i = childCount - 1; i >= 0; i--) {
                const child = this.placesListParent.getChild(i);
                child.destroy();
            }
        }
        linkQuestMarkerToPlace(pin, questMarker) {
            const place = this.placesData.find(p => p.pin === pin);
            if (place) {
                place.questMarker = questMarker;
                if (!place.isActive) {
                    this.hideQuestMarker(questMarker);
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