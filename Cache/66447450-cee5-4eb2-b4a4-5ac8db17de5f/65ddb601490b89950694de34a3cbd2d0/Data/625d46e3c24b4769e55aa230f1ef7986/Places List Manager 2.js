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
var __selfType = requireType("./Places List Manager 2");
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
 * Représente un slot de place dans la liste
 */
class PlaceSlot {
    constructor(placeObject, switchToggle, capsuleButton, nameText) {
        this.placeInfo = null;
        this.mapPin = null;
        this.questMarker = null;
        this.isActive = false;
        this.placeObject = placeObject;
        this.switchToggle = switchToggle;
        this.capsuleButton = capsuleButton;
        this.nameText = nameText;
    }
    setPlaceData(placeInfo, mapPin, questMarker) {
        this.placeInfo = placeInfo;
        this.mapPin = mapPin;
        this.questMarker = questMarker;
        // Met à jour le texte du nom
        if (this.nameText) {
            this.nameText.text = placeInfo.name || "Unknown Place";
        }
        // Active le slot
        this.placeObject.enabled = true;
        // État initial = désactivé
        this.setActive(false);
    }
    setActive(active) {
        this.isActive = active;
        // Met à jour le toggle visuel
        if (this.switchToggle) {
            this.switchToggle.isOn = active;
        }
        // Active/désactive le pin et le marker
        this.updatePinAndMarker();
    }
    toggle() {
        this.setActive(!this.isActive);
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
    clear() {
        this.placeInfo = null;
        this.mapPin = null;
        this.questMarker = null;
        this.isActive = false;
        this.placeObject.enabled = false;
        if (this.nameText) {
            this.nameText.text = "";
        }
    }
}
/**
 * Contrôleur pour la liste des places avec les 10 slots existants
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
            // === Container et animation ===
            this.listContainer = this.listContainer;
            this.closeButton = this.closeButton;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            // === Les 10 slots de places ===
            this.place0Object = this.place0Object;
            this.place0Toggle = this.place0Toggle;
            this.place0Capsule = this.place0Capsule;
            this.place0Text = this.place0Text;
            this.place1Object = this.place1Object;
            this.place1Toggle = this.place1Toggle;
            this.place1Capsule = this.place1Capsule;
            this.place1Text = this.place1Text;
            this.place2Object = this.place2Object;
            this.place2Toggle = this.place2Toggle;
            this.place2Capsule = this.place2Capsule;
            this.place2Text = this.place2Text;
            this.place3Object = this.place3Object;
            this.place3Toggle = this.place3Toggle;
            this.place3Capsule = this.place3Capsule;
            this.place3Text = this.place3Text;
            this.place4Object = this.place4Object;
            this.place4Toggle = this.place4Toggle;
            this.place4Capsule = this.place4Capsule;
            this.place4Text = this.place4Text;
            this.place5Object = this.place5Object;
            this.place5Toggle = this.place5Toggle;
            this.place5Capsule = this.place5Capsule;
            this.place5Text = this.place5Text;
            this.place6Object = this.place6Object;
            this.place6Toggle = this.place6Toggle;
            this.place6Capsule = this.place6Capsule;
            this.place6Text = this.place6Text;
            this.place7Object = this.place7Object;
            this.place7Toggle = this.place7Toggle;
            this.place7Capsule = this.place7Capsule;
            this.place7Text = this.place7Text;
            this.place8Object = this.place8Object;
            this.place8Toggle = this.place8Toggle;
            this.place8Capsule = this.place8Capsule;
            this.place8Text = this.place8Text;
            this.place9Object = this.place9Object;
            this.place9Toggle = this.place9Toggle;
            this.place9Capsule = this.place9Capsule;
            this.place9Text = this.place9Text;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isVisible = false;
            this.isAnimating = false;
            this.currentAnimation = null;
            // Tableau des slots
            this.slots = [];
        }
        __initialize() {
            super.__initialize();
            // === Container et animation ===
            this.listContainer = this.listContainer;
            this.closeButton = this.closeButton;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            // === Les 10 slots de places ===
            this.place0Object = this.place0Object;
            this.place0Toggle = this.place0Toggle;
            this.place0Capsule = this.place0Capsule;
            this.place0Text = this.place0Text;
            this.place1Object = this.place1Object;
            this.place1Toggle = this.place1Toggle;
            this.place1Capsule = this.place1Capsule;
            this.place1Text = this.place1Text;
            this.place2Object = this.place2Object;
            this.place2Toggle = this.place2Toggle;
            this.place2Capsule = this.place2Capsule;
            this.place2Text = this.place2Text;
            this.place3Object = this.place3Object;
            this.place3Toggle = this.place3Toggle;
            this.place3Capsule = this.place3Capsule;
            this.place3Text = this.place3Text;
            this.place4Object = this.place4Object;
            this.place4Toggle = this.place4Toggle;
            this.place4Capsule = this.place4Capsule;
            this.place4Text = this.place4Text;
            this.place5Object = this.place5Object;
            this.place5Toggle = this.place5Toggle;
            this.place5Capsule = this.place5Capsule;
            this.place5Text = this.place5Text;
            this.place6Object = this.place6Object;
            this.place6Toggle = this.place6Toggle;
            this.place6Capsule = this.place6Capsule;
            this.place6Text = this.place6Text;
            this.place7Object = this.place7Object;
            this.place7Toggle = this.place7Toggle;
            this.place7Capsule = this.place7Capsule;
            this.place7Text = this.place7Text;
            this.place8Object = this.place8Object;
            this.place8Toggle = this.place8Toggle;
            this.place8Capsule = this.place8Capsule;
            this.place8Text = this.place8Text;
            this.place9Object = this.place9Object;
            this.place9Toggle = this.place9Toggle;
            this.place9Capsule = this.place9Capsule;
            this.place9Text = this.place9Text;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isVisible = false;
            this.isAnimating = false;
            this.currentAnimation = null;
            // Tableau des slots
            this.slots = [];
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
            // Initialise les 10 slots
            this.initializeSlots();
            // Configure le bouton de fermeture
            this.closeButton.onButtonPinched.add(() => {
                this.hideList();
            });
            if (this.enableDebugLogs)
                log.i("PlacesListController initialized successfully");
        }
        initializeSlots() {
            // Crée les slots et configure les callbacks
            this.slots = [
                this.createSlot(0, this.place0Object, this.place0Toggle, this.place0Capsule, this.place0Text),
                this.createSlot(1, this.place1Object, this.place1Toggle, this.place1Capsule, this.place1Text),
                this.createSlot(2, this.place2Object, this.place2Toggle, this.place2Capsule, this.place2Text),
                this.createSlot(3, this.place3Object, this.place3Toggle, this.place3Capsule, this.place3Text),
                this.createSlot(4, this.place4Object, this.place4Toggle, this.place4Capsule, this.place4Text),
                this.createSlot(5, this.place5Object, this.place5Toggle, this.place5Capsule, this.place5Text),
                this.createSlot(6, this.place6Object, this.place6Toggle, this.place6Capsule, this.place6Text),
                this.createSlot(7, this.place7Object, this.place7Toggle, this.place7Capsule, this.place7Text),
                this.createSlot(8, this.place8Object, this.place8Toggle, this.place8Capsule, this.place8Text),
                this.createSlot(9, this.place9Object, this.place9Toggle, this.place9Capsule, this.place9Text),
            ];
            // Désactive tous les slots au départ
            this.slots.forEach(slot => {
                if (slot && slot.placeObject) {
                    slot.placeObject.enabled = false;
                }
            });
        }
        createSlot(index, placeObject, switchToggleObject, capsuleButton, nameText) {
            if (!placeObject || !switchToggleObject) {
                log.w(`Place ${index} not properly configured`);
                return null;
            }
            // Trouve le component SwitchToggleGroup sur le SceneObject
            const switchToggle = this.findSwitchToggleGroup(switchToggleObject);
            if (!switchToggle) {
                log.w(`SwitchToggleGroup not found on Place ${index} toggle object`);
                return null;
            }
            const slot = new PlaceSlot(placeObject, switchToggle, capsuleButton, nameText);
            // Configure le callback du toggle
            if (switchToggle.onToggleChanged) {
                switchToggle.onToggleChanged.add((isOn) => {
                    slot.setActive(isOn);
                    if (this.enableDebugLogs) {
                        log.i(`Place ${index} toggled: ${isOn ? "ON" : "OFF"} - ${slot.placeInfo?.name || "empty"}`);
                    }
                });
            }
            return slot;
        }
        /**
         * Trouve le component SwitchToggleGroup sur un SceneObject
         */
        findSwitchToggleGroup(sceneObject) {
            if (!sceneObject)
                return null;
            const scriptCount = sceneObject.getComponentCount("Component.ScriptComponent");
            for (let i = 0; i < scriptCount; i++) {
                const script = sceneObject.getComponentByIndex("Component.ScriptComponent", i);
                if (script && script.getTypeName && script.getTypeName() === "SwitchToggleGroup") {
                    return script;
                }
            }
            return null;
        }
        /**
         * Affiche la liste avec des places, pins et quest markers
         */
        showListWithPlaces(places, pins, // MapPin[]
        questMarkers) {
            if (this.enableDebugLogs) {
                log.i(`Showing list with ${places.length} places`);
            }
            // Nettoie tous les slots d'abord
            this.clearAllSlots();
            // Remplit les slots avec les places (max 10)
            const maxPlaces = Math.min(places.length, 10);
            for (let i = 0; i < maxPlaces; i++) {
                const slot = this.slots[i];
                if (slot) {
                    slot.setPlaceData(places[i], pins[i], questMarkers[i]);
                }
            }
            // Affiche le container
            this.animateIn();
        }
        /**
         * Nettoie tous les slots
         */
        clearAllSlots() {
            this.slots.forEach(slot => {
                if (slot) {
                    slot.clear();
                }
            });
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
                    // Nettoie les slots quand la liste est cachée
                    this.clearAllSlots();
                    if (this.enableDebugLogs)
                        log.i("List hidden and cleared");
                }
            });
        }
        /**
         * Active tous les places visibles
         */
        enableAllPlaces() {
            this.slots.forEach(slot => {
                if (slot && slot.placeInfo) {
                    slot.setActive(true);
                }
            });
        }
        /**
         * Désactive tous les places
         */
        disableAllPlaces() {
            this.slots.forEach(slot => {
                if (slot && slot.placeInfo) {
                    slot.setActive(false);
                }
            });
        }
        /**
         * Getters publics
         */
        getIsVisible() {
            return this.isVisible;
        }
        getActivePlacesCount() {
            return this.slots.filter(slot => slot && slot.placeInfo !== null).length;
        }
        getEnabledPlacesCount() {
            return this.slots.filter(slot => slot && slot.placeInfo !== null && slot.isActive).length;
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
//# sourceMappingURL=Places%20List%20Manager%202.js.map