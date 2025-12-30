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
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesClamAnimation = null;
            this.isPlacesClamAnimating = false;
            this.isPlacesClamVisible = false;
            this.placesClamHiddenY = -30;
            this.placesClamVisibleY = 0;
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
            this.componentPrefab = requireAsset("../Prefabs/Map Controller.prefab");
            this.onMiniMapToggledEvent = new Event_1.default();
            this.onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
            this.placesData = [];
            this.nearbyPlacesCache = [];
            this.placesClamAnimation = null;
            this.isPlacesClamAnimating = false;
            this.isPlacesClamVisible = false;
            this.placesClamHiddenY = -30;
            this.placesClamVisibleY = 0;
        }
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
            // S'assurer que le container Places Clam est caché au démarrage
            if (this.placesClamContainer) {
                this.placesClamTransform = this.placesClamContainer.getTransform();
                const pos = this.placesClamTransform.getLocalPosition();
                this.placesClamHiddenY = pos.y - 30; // Position cachée en dessous
                this.placesClamVisibleY = pos.y; // Position visible actuelle
                pos.y = this.placesClamHiddenY;
                this.placesClamTransform.setLocalPosition(pos);
                this.placesClamContainer.enabled = false;
            }
            // Connecter le bouton de fermeture
            if (this.placesClamCloseButton) {
                this.placesClamCloseButton.onButtonPinched.add(this.handlePlacesClamClose.bind(this));
            }
        }
        handlePlacesClamClose(event) {
            this.animatePlacesClamOut();
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
        // #region Places Clam Management
        /**
         * Ouvre le Places Clam et charge les places disponibles
         */
        openPlacesClam(categoryName) {
            if (!this.placesClamContainer) {
                print("Places Clam container not assigned!");
                return;
            }
            // Si on n'a pas encore de données, charger les places nearby
            if (this.nearbyPlacesCache.length === 0) {
                // Utiliser la fonction existante pour récupérer les places
                const categories = categoryName || ["restaurant", "cafe", "bar"];
                this.loadNearbyPlaces(categories);
            }
            else {
                // Populer la liste avec les données en cache
                this.populatePlacesList();
                // Animer l'entrée du container
                this.animatePlacesClamIn();
            }
        }
        /**
         * Ferme le Places Clam avec animation
         */
        closePlacesClam() {
            this.animatePlacesClamOut();
        }
        /**
         * Anime l'apparition du Places Clam
         */
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
                    pos.y = MathUtils.lerp(this.placesClamHiddenY, this.placesClamVisibleY, t);
                    this.placesClamTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isPlacesClamAnimating = false;
                    this.placesClamAnimation = null;
                }
            });
        }
        /**
         * Anime la disparition du Places Clam
         */
        animatePlacesClamOut() {
            if (!this.isPlacesClamVisible && !this.isPlacesClamAnimating && !this.placesClamContainer.enabled)
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
                    pos.y = MathUtils.lerp(startY, this.placesClamHiddenY, t);
                    this.placesClamTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isPlacesClamAnimating = false;
                    this.isPlacesClamVisible = false;
                    this.placesClamContainer.enabled = false;
                    this.placesClamAnimation = null;
                }
            });
        }
        /**
         * Charge les places à proximité via le MapController
         */
        loadNearbyPlaces(categoryName) {
            print("Loading nearby places...");
            // Compteur pour suivre quand tous les pins sont créés
            let pinsLoaded = 0;
            const expectedPins = 10; // Ajustez selon vos besoins
            // S'abonner aux événements du MapController pour récupérer les places
            const pinAddedCallback = (pin) => {
                print("Pin added, extracting info...");
                // Extraire les infos du pin pour créer un PlaceItem
                const location = pin.location;
                if (location) {
                    // Récupérer le nom depuis les métadonnées du pin si disponible
                    let placeName = "Place " + (this.placesData.length + 1);
                    // Essayer de récupérer depuis le pin
                    if (pin.name) {
                        placeName = pin.name;
                    }
                    else if (pin.title) {
                        placeName = pin.title;
                    }
                    else if (pin.metadata && pin.metadata.name) {
                        placeName = pin.metadata.name;
                    }
                    print("Place found: " + placeName);
                    const placeItem = {
                        name: placeName,
                        longitude: location.longitude,
                        latitude: location.latitude,
                        pin: pin,
                        isActive: false
                    };
                    this.nearbyPlacesCache.push(placeItem);
                    this.placesData.push(placeItem);
                    // Cacher immédiatement le pin
                    this.hidePlacePin(pin);
                    pinsLoaded++;
                    // Quand assez de pins sont chargés, afficher l'UI
                    if (pinsLoaded >= 3) { // Afficher après au moins 3 places
                        this.delayedShowPlacesUI();
                    }
                }
            };
            this.subscribeOnMapAddPin(pinAddedCallback);
            // Appeler la fonction existante qui va créer les pins
            this.mapController.showNearbyPlaces(categoryName);
        }
        /**
         * Affiche l'UI des places après un court délai
         */
        delayedShowPlacesUI() {
            // N'afficher qu'une seule fois
            if (this.placesClamContainer && !this.placesClamContainer.enabled) {
                const delayEvent = this.createEvent("DelayedCallbackEvent");
                delayEvent.bind(() => {
                    print("Populating places list with " + this.placesData.length + " places");
                    this.populatePlacesList();
                    // Animer l'entrée du container
                    this.animatePlacesClamIn();
                });
                delayEvent.reset(0.5); // Délai de 0.5 seconde
            }
        }
        /**
         * Extrait le nom d'un place depuis un MapPin
         */
        extractPlaceName(pin) {
            // Essayer de récupérer le nom depuis le pin
            // Cette fonction dépend de comment MapPin stocke les informations
            // Adapter selon votre implémentation
            const pinObject = pin.sceneObject;
            if (pinObject) {
                // Chercher un composant Text ou similaire
                const textComponents = pinObject.getComponents("Component.Text");
                if (textComponents && textComponents.length > 0) {
                    return textComponents[0].text;
                }
            }
            return "Place " + (this.placesData.length + 1);
        }
        /**
         * Peuple la liste des places dans le UI
         */
        populatePlacesList() {
            if (!this.placesListParent || !this.placeItemPrefab) {
                print("Places list parent or prefab not assigned!");
                return;
            }
            print("Populating list with " + this.placesData.length + " items");
            // Nettoyer les items existants
            this.clearPlacesList();
            // Créer un item UI pour chaque place avec espacement vertical
            let currentY = 0;
            this.placesData.forEach((place, index) => {
                print("Creating item for: " + place.name);
                const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
                place.uiObject = itemInstance;
                // Positionner l'item avec l'espacement vertical
                const itemTransform = itemInstance.getTransform();
                const pos = itemTransform.getLocalPosition();
                pos.y = currentY;
                itemTransform.setLocalPosition(pos);
                // Calculer la position Y pour le prochain item
                currentY += this.placeItemSpacing;
                // Configurer le texte
                this.setPlaceItemText(itemInstance, place.name);
                // Configurer le toggle (désactivé par défaut)
                this.setupPlaceToggle(itemInstance, place, index);
            });
        }
        /**
         * Configure le texte d'un item de place
         */
        setPlaceItemText(itemObject, placeName) {
            print("Setting text to: " + placeName);
            // Chercher le CapsuleButton et son texte
            const textComponent = this.findTextInChildren(itemObject);
            if (textComponent) {
                textComponent.text = placeName;
                print("Text set successfully");
            }
            else {
                print("WARNING: Text component not found in item!");
            }
        }
        /**
         * Configure le toggle d'un item de place
         */
        setupPlaceToggle(itemObject, place, index) {
            // Chercher le SwitchToggleGroup
            const toggleComponents = itemObject.getComponents("Component.ScriptComponent");
            for (let i = 0; i < toggleComponents.length; i++) {
                const component = toggleComponents[i];
                // Vérifier si c'est un SwitchToggleGroup ou similaire
                if (component.api && component.api.onSwitchToggled) {
                    print("Toggle found for " + place.name);
                    // Définir l'état initial à OFF
                    if (component.api.setToggleState) {
                        component.api.setToggleState(false);
                    }
                    else if (component.api.setSwitchState) {
                        component.api.setSwitchState(false);
                    }
                    // S'abonner à l'événement de toggle
                    component.api.onSwitchToggled.add((isOn) => {
                        print("Toggle changed for " + place.name + ": " + isOn);
                        this.togglePlace(index, isOn);
                    });
                    break;
                }
            }
        }
        /**
         * Active/Désactive une place spécifique
         */
        togglePlace(index, isActive) {
            if (index < 0 || index >= this.placesData.length) {
                return;
            }
            const place = this.placesData[index];
            place.isActive = isActive;
            print("Toggling place " + place.name + " to " + (isActive ? "ON" : "OFF"));
            if (isActive) {
                // Afficher le pin existant
                if (place.pin) {
                    this.showPlacePin(place.pin);
                }
                else {
                    print("WARNING: No pin found for " + place.name);
                }
            }
            else {
                // Cacher le pin
                if (place.pin) {
                    this.hidePlacePin(place.pin);
                }
            }
        }
        /**
         * Cache un pin de place
         */
        hidePlacePin(pin) {
            const pinObject = pin.sceneObject;
            if (pinObject) {
                pinObject.enabled = false;
                print("Pin hidden");
            }
        }
        /**
         * Affiche un pin de place
         */
        showPlacePin(pin) {
            const pinObject = pin.sceneObject;
            if (pinObject) {
                pinObject.enabled = true;
                print("Pin shown");
            }
        }
        /**
         * Cache tous les pins de places
         */
        hideAllPlacePins() {
            this.placesData.forEach(place => {
                if (place.pin) {
                    this.hidePlacePin(place.pin);
                }
            });
        }
        /**
         * Cherche un composant Text dans les enfants d'un objet
         */
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
        /**
         * Nettoie la liste des places UI
         */
        clearPlacesList() {
            if (!this.placesListParent)
                return;
            // Détruire tous les enfants
            const childCount = this.placesListParent.getChildrenCount();
            for (let i = childCount - 1; i >= 0; i--) {
                const child = this.placesListParent.getChild(i);
                child.destroy();
            }
        }
        // #endregion
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
        /**
         * MODIFIÉ: Affiche le Places Clam au lieu d'afficher directement les places
         */
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