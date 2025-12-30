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
exports.PlacesListController = void 0;
var __selfType = requireType("./Untitled TypeScript");
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
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const TAG = "[PlacesListController]";
const log = new NativeLogger_1.default(TAG);
/**
 * Représente un item dans la liste des places
 */
class PlaceListItem {
    constructor(sceneObject, toggleButton, nameText, addressText, toggleOnVisual, toggleOffVisual) {
        this.isActive = false;
        this.sceneObject = sceneObject;
        this.toggleButton = toggleButton;
        this.nameText = nameText;
        this.addressText = addressText;
        this.toggleOnVisual = toggleOnVisual;
        this.toggleOffVisual = toggleOffVisual;
    }
    setPlaceData(placeInfo, mapPin, questMarker) {
        this.placeInfo = placeInfo;
        this.mapPin = mapPin;
        this.questMarker = questMarker;
        // Met à jour les textes
        if (this.nameText) {
            this.nameText.text = placeInfo.name || "Unknown Place";
        }
        if (this.addressText) {
            const address = placeInfo.address;
            const addressStr = `${address.street_address || ""}, ${address.locality || ""}`.trim();
            this.addressText.text = addressStr || "No address";
        }
        // Désactive par défaut le pin et marker
        this.setActive(false);
    }
    setActive(active) {
        this.isActive = active;
        this.updateVisuals();
        this.updatePinAndMarker();
    }
    toggle() {
        this.setActive(!this.isActive);
    }
    updateVisuals() {
        if (this.toggleOnVisual) {
            this.toggleOnVisual.enabled = this.isActive;
        }
        if (this.toggleOffVisual) {
            this.toggleOffVisual.enabled = !this.isActive;
        }
    }
    updatePinAndMarker() {
        // Met à jour le pin (MapPin object)
        if (this.mapPin && this.mapPin.getSceneObject) {
            const pinObject = this.mapPin.getSceneObject();
            if (pinObject) {
                pinObject.enabled = this.isActive;
            }
        }
        // Met à jour le quest marker
        if (this.questMarker) {
            this.questMarker.enabled = this.isActive;
        }
    }
    cleanup() {
        if (this.sceneObject) {
            this.sceneObject.destroy();
        }
        this.placeInfo = null;
        this.mapPin = null;
        this.questMarker = null;
    }
}
/**
 * Contrôleur principal pour la liste des places avec toggles
 */
let PlacesListController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PlacesListController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.listContainer = this.listContainer;
            this.closeButton = this.closeButton;
            this.listItemPrefab = this.listItemPrefab;
            this.listItemsParent = this.listItemsParent;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            // Noms des composants dans le prefab (à ajuster selon votre prefab)
            this.toggleButtonName = this.toggleButtonName;
            this.nameTextName = this.nameTextName;
            this.addressTextName = this.addressTextName;
            this.toggleOnVisualName = this.toggleOnVisualName;
            this.toggleOffVisualName = this.toggleOffVisualName;
            this.isVisible = false;
            this.isAnimating = false;
            this.currentAnimation = null;
            // Liste des items actuellement affichés
            this.activeItems = [];
        }
        __initialize() {
            super.__initialize();
            this.listContainer = this.listContainer;
            this.closeButton = this.closeButton;
            this.listItemPrefab = this.listItemPrefab;
            this.listItemsParent = this.listItemsParent;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            // Noms des composants dans le prefab (à ajuster selon votre prefab)
            this.toggleButtonName = this.toggleButtonName;
            this.nameTextName = this.nameTextName;
            this.addressTextName = this.addressTextName;
            this.toggleOnVisualName = this.toggleOnVisualName;
            this.toggleOffVisualName = this.toggleOffVisualName;
            this.isVisible = false;
            this.isAnimating = false;
            this.currentAnimation = null;
            // Liste des items actuellement affichés
            this.activeItems = [];
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== PlacesListController INITIALIZATION ===");
            if (!this.listContainer) {
                log.e("List container not assigned!");
                return;
            }
            if (!this.closeButton) {
                log.e("Close button not assigned!");
                return;
            }
            this.listTransform = this.listContainer.getTransform();
            // Position initiale = cachée
            const pos = this.listTransform.getLocalPosition();
            pos.y = this.hiddenPositionY;
            this.listTransform.setLocalPosition(pos);
            this.listContainer.enabled = false;
            // Configure le bouton de fermeture
            this.closeButton.onButtonPinched.add(() => {
                this.hideList();
            });
            if (this.enableDebugLogs)
                log.i("PlacesListController initialized successfully");
        }
        /**
         * Affiche la liste avec des places, pins et quest markers
         */
        showListWithPlaces(places, pins, // MapPin[]
        questMarkers) {
            if (this.enableDebugLogs) {
                log.i(`Showing list with ${places.length} places`);
            }
            // Nettoie les items existants
            this.clearList();
            // Crée un item pour chaque place
            for (let i = 0; i < places.length; i++) {
                const place = places[i];
                const pin = pins[i];
                const marker = questMarkers[i];
                const item = this.createListItem(place, pin, marker);
                if (item) {
                    this.activeItems.push(item);
                }
            }
            // Affiche le container
            this.animateIn();
        }
        /**
         * Crée un item de liste à partir du prefab
         */
        createListItem(placeInfo, mapPin, // MapPin
        questMarker) {
            if (!this.listItemPrefab || !this.listItemsParent) {
                log.e("List item prefab or parent not assigned!");
                return null;
            }
            // Instancie le prefab
            const itemObject = this.listItemPrefab.instantiate(this.listItemsParent);
            // Trouve les composants dans le prefab
            const toggleButton = this.findPinchButton(itemObject, this.toggleButtonName);
            const nameText = this.findText(itemObject, this.nameTextName);
            const addressText = this.findText(itemObject, this.addressTextName);
            const toggleOnVisual = this.findSceneObject(itemObject, this.toggleOnVisualName);
            const toggleOffVisual = this.findSceneObject(itemObject, this.toggleOffVisualName);
            if (!toggleButton) {
                log.e(`Toggle button not found in prefab (looking for: ${this.toggleButtonName})`);
                itemObject.destroy();
                return null;
            }
            // Crée l'item
            const item = new PlaceListItem(itemObject, toggleButton, nameText, addressText, toggleOnVisual, toggleOffVisual);
            // Configure les données
            item.setPlaceData(placeInfo, mapPin, questMarker);
            // Configure le callback du toggle
            toggleButton.onButtonPinched.add(() => {
                item.toggle();
                if (this.enableDebugLogs) {
                    log.i(`Place toggled: ${placeInfo.name} - ${item.isActive ? "ON" : "OFF"}`);
                }
            });
            return item;
        }
        /**
         * Nettoie tous les items de la liste
         */
        clearList() {
            for (const item of this.activeItems) {
                item.cleanup();
            }
            this.activeItems = [];
        }
        /**
         * Anime l'apparition de la liste
         */
        animateIn() {
            if (this.isVisible && !this.isAnimating)
                return;
            if (this.isAnimating && this.currentAnimation) {
                this.currentAnimation();
            }
            this.isAnimating = true;
            this.isVisible = true;
            this.listContainer.enabled = true;
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-out-back",
                update: (t) => {
                    const pos = this.listTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(this.hiddenPositionY, this.visiblePositionY, t);
                    this.listTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isAnimating = false;
                    this.currentAnimation = null;
                    if (this.enableDebugLogs)
                        log.i("List animated in");
                }
            });
        }
        /**
         * Cache la liste avec animation
         */
        hideList() {
            if (!this.isVisible && !this.isAnimating)
                return;
            if (this.isAnimating && this.currentAnimation) {
                this.currentAnimation();
            }
            this.isAnimating = true;
            const startY = this.listTransform.getLocalPosition().y;
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-in-quad",
                update: (t) => {
                    const pos = this.listTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(startY, this.hiddenPositionY, t);
                    this.listTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isAnimating = false;
                    this.isVisible = false;
                    this.listContainer.enabled = false;
                    this.currentAnimation = null;
                    // Nettoie la liste quand elle est cachée
                    this.clearList();
                    if (this.enableDebugLogs)
                        log.i("List hidden and cleared");
                }
            });
        }
        /**
         * Active tous les places
         */
        enableAllPlaces() {
            for (const item of this.activeItems) {
                item.setActive(true);
            }
        }
        /**
         * Désactive tous les places
         */
        disableAllPlaces() {
            for (const item of this.activeItems) {
                item.setActive(false);
            }
        }
        /**
         * Utilitaires pour trouver les composants dans le prefab
         */
        findPinchButton(parent, name) {
            const obj = this.findSceneObject(parent, name);
            if (!obj)
                return null;
            // Recherche le PinchButton dans tous les scripts du SceneObject
            const scriptCount = obj.getComponentCount("Component.ScriptComponent");
            for (let i = 0; i < scriptCount; i++) {
                const script = obj.getComponentByIndex("Component.ScriptComponent", i);
                // Vérifie si c'est un PinchButton
                if (script && script.getTypeName && script.getTypeName() === "PinchButton") {
                    return script;
                }
            }
            return null;
        }
        findText(parent, name) {
            const obj = this.findSceneObject(parent, name);
            if (!obj)
                return null;
            const component = obj.getComponent("Component.Text");
            return component;
        }
        findSceneObject(parent, name) {
            // Recherche récursive dans les enfants
            return this.findChildByName(parent, name);
        }
        findChildByName(parent, name) {
            if (parent.name === name) {
                return parent;
            }
            const childCount = parent.getChildrenCount();
            for (let i = 0; i < childCount; i++) {
                const child = parent.getChild(i);
                const found = this.findChildByName(child, name);
                if (found) {
                    return found;
                }
            }
            return null;
        }
        /**
         * Getters publics
         */
        getIsVisible() {
            return this.isVisible;
        }
        getActiveItemsCount() {
            return this.activeItems.length;
        }
        getEnabledPlacesCount() {
            return this.activeItems.filter(item => item.isActive).length;
        }
    };
    __setFunctionName(_classThis, "PlacesListController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlacesListController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlacesListController = _classThis;
})();
exports.PlacesListController = PlacesListController;
//# sourceMappingURL=Untitled%20TypeScript.js.map