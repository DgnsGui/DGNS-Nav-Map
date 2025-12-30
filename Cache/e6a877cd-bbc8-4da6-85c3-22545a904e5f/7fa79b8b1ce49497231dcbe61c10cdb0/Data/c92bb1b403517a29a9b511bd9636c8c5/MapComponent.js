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
            // Setup permanent pin collection
            this.setupPinCollection();
            if (this.autoRotateToggleButton) {
                this.setupAutoRotateToggleButton();
            }
            if (this.placesClamCloseButton) {
                this.placesClamCloseButton.onButtonPinched.add(() => {
                    this.closePlacesClam();
                });
            }
        }
        setupPinCollection() {
            // Subscribe permanently to collect pins whenever they're added
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
                // Appliquer l'état initial du pin immédiatement
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
            // Si on a déjà des données de places, on les réaffiche directement
            if (this.placesData.length > 0) {
                print("Reopening with existing " + this.placesData.length + " places");
                this.populatePlacesList();
                this.placesAnimator.animateIn();
            }
            else {
                // Sinon on charge de nouvelles places
                const categories = categoryName || ["restaurant", "cafe", "bar"];
                this.loadNearbyPlaces(categories);
            }
        }
        closePlacesClam() {
            if (this.placesAnimator) {
                print("Closing Places Clam (keeping data)");
                this.placesAnimator.animateOut();
                // On ne vide PAS placesData pour pouvoir rouvrir avec les mêmes données
            }
        }
        loadNearbyPlaces(categoryName) {
            print("=== loadNearbyPlaces START ===");
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesUIShown = false;
            this.isCollectingPins = true; // Start collecting pins
            let timeoutTriggered = false;
            const timeoutEvent = this.createEvent("DelayedCallbackEvent");
            timeoutEvent.bind(() => {
                if (!this.placesUIShown) {
                    print("Timeout reached, checking collected pins...");
                    timeoutTriggered = true;
                    this.isCollectingPins = false;
                    if (this.placesData.length === 0) {
                        print("No pins collected, using fallback");
                    }
                    else {
                        print("Using " + this.placesData.length + " collected pins");
                    }
                    this.placesUIShown = true;
                    this.delayedShowPlacesUI();
                }
            });
            timeoutEvent.reset(3.0);
            print("Calling showNearbyPlaces with categories: " + categoryName.join(", "));
            this.mapController.showNearbyPlaces(categoryName);
        }
        delayedShowPlacesUI() {
            print("=== delayedShowPlacesUI ===");
            if (this.placesClamContainer) {
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    print("Showing UI with " + this.placesData.length + " places");
                    if (this.placesData.length === 0) {
                        print("No places found, creating fallback");
                        this.createFallbackPlaces();
                    }
                    this.populatePlacesList();
                    this.placesAnimator.animateIn();
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
                    isActive: i < 3
                });
            }
        }
        populatePlacesList() {
            print("=== populatePlacesList with " + this.placesData.length + " items ===");
            if (!this.placesListParent || !this.placeItemPrefab) {
                print("ERROR: placesListParent or placeItemPrefab not set!");
                return;
            }
            this.clearPlacesList();
            let currentY = 0;
            for (let i = 0; i < this.placesData.length; i++) {
                const place = this.placesData[i];
                print("Creating UI for place " + i + ": " + place.name);
                const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
                place.uiObject = itemInstance;
                const itemTransform = itemInstance.getTransform();
                const pos = itemTransform.getLocalPosition();
                pos.y = currentY;
                itemTransform.setLocalPosition(pos);
                currentY += this.placeItemSpacing;
                this.setPlaceItemText(itemInstance, place.name);
                this.setupPlaceToggle(itemInstance, place, i);
                // Apply initial state
                if (place.pin) {
                    if (place.isActive) {
                        this.showPlacePin(place.pin);
                    }
                    else {
                        this.hidePlacePin(place.pin);
                    }
                }
            }
            print("=== populatePlacesList DONE ===");
        }
        setPlaceItemText(itemObject, placeName) {
            const textComponent = this.findTextInChildren(itemObject);
            if (textComponent) {
                textComponent.text = placeName;
                print("Set text to: " + placeName);
            }
            else {
                print("WARNING: Could not find text component in " + itemObject.name);
            }
        }
        setupPlaceToggle(itemObject, place, index) {
            print("Setting up toggle for " + place.name + " (index " + index + ")");
            for (let i = 0; i < itemObject.getChildrenCount(); i++) {
                const child = itemObject.getChild(i);
                if (child.name === "Switch" || child.name.includes("Switch")) {
                    print("Found Switch child: " + child.name);
                    const childComponents = child.getComponents("Component.ScriptComponent");
                    for (let j = 0; j < childComponents.length; j++) {
                        const switchComponent = childComponents[j];
                        const componentName = switchComponent.constructor ? switchComponent.constructor.name : "unknown";
                        print("Checking component: " + componentName);
                        if (componentName === "Switch" || (switchComponent.typeName && switchComponent.typeName === "Switch")) {
                            print("Found Switch component, setting initial state to: " + place.isActive);
                            try {
                                switchComponent.isOn = place.isActive;
                            }
                            catch (e) {
                                print("Error setting switch state: " + e);
                            }
                            if (switchComponent.onStateChanged && typeof switchComponent.onStateChanged.add === "function") {
                                switchComponent.onStateChanged.add(() => {
                                    const newState = switchComponent.isOn;
                                    print("Switch toggled for " + place.name + " to: " + newState);
                                    this.togglePlace(index, newState);
                                });
                                print("Switch event handler added");
                                return;
                            }
                            else {
                                print("WARNING: onStateChanged not available on switch");
                            }
                        }
                    }
                }
            }
            print("WARNING: Could not find Switch component for " + place.name);
        }
        togglePlace(index, isActive) {
            print("=== togglePlace " + index + " to " + isActive + " ===");
            if (index < 0 || index >= this.placesData.length) {
                print("ERROR: Invalid index " + index);
                return;
            }
            const place = this.placesData[index];
            if (place.isActive === isActive) {
                print("State unchanged, skipping");
                return;
            }
            place.isActive = isActive;
            print("Updated place state for: " + place.name);
            if (!place.pin) {
                print("WARNING: No pin associated with this place");
                return;
            }
            if (isActive) {
                print("Showing pin and marker");
                this.showPlacePin(place.pin);
                if (place.questMarker) {
                    this.showQuestMarker(place.questMarker);
                }
            }
            else {
                print("Hiding pin and marker");
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
                print("Pin hidden: " + pinObject.name);
            }
        }
        showPlacePin(pin) {
            const pinObject = pin.sceneObject;
            if (pinObject) {
                pinObject.enabled = true;
                print("Pin shown: " + pinObject.name);
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
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = false;
                    print("Quest marker HIDDEN: " + sceneObject.name + " enabled=" + sceneObject.enabled);
                }
                else {
                    print("ERROR: Quest marker has no scene object");
                }
            }
            else {
                print("ERROR: Quest marker invalid or no transform");
            }
        }
        showQuestMarker(questMarker) {
            if (questMarker && questMarker.transform) {
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = true;
                    print("Quest marker SHOWN: " + sceneObject.name + " enabled=" + sceneObject.enabled);
                }
                else {
                    print("ERROR: Quest marker has no scene object");
                }
            }
            else {
                print("ERROR: Quest marker invalid or no transform");
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
            // D'abord s'assurer que le quest marker est caché par défaut
            if (questMarker && questMarker.transform) {
                const sceneObject = questMarker.transform.getSceneObject();
                if (sceneObject) {
                    sceneObject.enabled = false;
                }
            }
            const place = this.placesData.find(p => p.pin === pin);
            if (place) {
                print("Found matching place: " + place.name + " (active: " + place.isActive + ")");
                place.questMarker = questMarker;
                // Appliquer immédiatement l'état de visibilité selon isActive
                if (place.isActive) {
                    print("Place is active, showing quest marker");
                    this.showQuestMarker(questMarker);
                }
                else {
                    print("Place is inactive, keeping quest marker hidden");
                    // Déjà caché plus haut, mais on le confirme
                    this.hideQuestMarker(questMarker);
                }
            }
            else {
                print("WARNING: Could not find place for pin - keeping quest marker hidden");
                // Déjà caché par défaut
            }
        }
        // Méthode publique pour forcer la synchronisation de tous les quest markers
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
        // Méthode nucléaire : cache TOUT puis affiche uniquement selon isActive
        forceHideAllQuestMarkersThenShow() {
            print("=== FORCE HIDING ALL QUEST MARKERS ===");
            const mapControllerAny = this.mapController;
            if (mapControllerAny.questMarkers) {
                const allMarkers = mapControllerAny.questMarkers;
                print("Found " + allMarkers.length + " quest markers in controller");
                // Cache TOUT d'abord
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
            // Puis affiche uniquement ceux qui sont actifs
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