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
exports.InteractableManipulation = void 0;
var __selfType = requireType("./MapManipulation");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "[MapManipulation]";
const log = new NativeLogger_1.default(TAG);
let InteractableManipulation = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var InteractableManipulation = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapSceneObject = this.mapSceneObject;
            this.mapComponent = this.mapComponent;
            this.fullMapCollider = this.fullMapCollider;
            this.miniMapCollider = this.miniMapCollider;
            this.scrollSensitivity = this.scrollSensitivity;
            this.enableDebugLogs = this.enableDebugLogs;
            this.interactable = null;
            this.colliderSizeX = 1.0;
            this.colliderSizeY = 1.0;
            // État du tracking d'interaction
            this.isCurrentlyInteracting = false;
            this.lastInteractionPosition = null;
        }
        __initialize() {
            super.__initialize();
            this.mapSceneObject = this.mapSceneObject;
            this.mapComponent = this.mapComponent;
            this.fullMapCollider = this.fullMapCollider;
            this.miniMapCollider = this.miniMapCollider;
            this.scrollSensitivity = this.scrollSensitivity;
            this.enableDebugLogs = this.enableDebugLogs;
            this.interactable = null;
            this.colliderSizeX = 1.0;
            this.colliderSizeY = 1.0;
            // État du tracking d'interaction
            this.isCurrentlyInteracting = false;
            this.lastInteractionPosition = null;
        }
        onAwake() {
            this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
            if (!this.interactable)
                throw new Error("MapManipulation requires an Interactable.");
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
            this.setupCallbacks();
            this.mapComponent.onMiniMapToggled.add((isMiniMap) => this.setupColliders(isMiniMap));
        }
        debugLog(message) {
            if (this.enableDebugLogs) {
                log.i(`[DEBUG] ${message}`);
            }
        }
        onStart() {
            this.setupColliders(this.mapComponent.startedAsMiniMap);
            if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
                this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
                this.debugLog("MapController initialized successfully");
            }
            else {
                log.e("MapController not ready on Start, retrying...");
                const delayedEvent = this.createEvent("DelayedCallbackEvent");
                delayedEvent.bind(() => this.onStart());
                delayedEvent.reset(0.1);
            }
        }
        setupCallbacks() {
            (0, validate_1.validate)(this.interactable);
            const stopProp = (e) => {
                if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp")
                    e.stopPropagation();
            };
            // Début d'interaction
            this.interactable.onInteractorTriggerStart.add((e) => {
                stopProp(e);
                if (e.interactor.planecastPoint) {
                    const localPos = this.getLocalPosition(e.interactor.planecastPoint);
                    this.debugLog(`TriggerStart at ${localPos}`);
                    this.isCurrentlyInteracting = true;
                    this.lastInteractionPosition = localPos;
                    this.mapComponent.startTouch(localPos);
                }
            });
            // Mise à jour d'interaction
            this.interactable.onTriggerUpdate.add((e) => {
                stopProp(e);
                if (e.interactor.planecastPoint) {
                    const localPos = this.getLocalPosition(e.interactor.planecastPoint);
                    this.lastInteractionPosition = localPos;
                    this.mapComponent.updateTouch(localPos);
                }
            });
            // Fin d'interaction normale
            this.interactable.onInteractorTriggerEnd.add((e) => {
                stopProp(e);
                this.debugLog(`TriggerEnd - isInteracting: ${this.isCurrentlyInteracting}`);
                if (this.isCurrentlyInteracting) {
                    const localPos = e.interactor.planecastPoint
                        ? this.getLocalPosition(e.interactor.planecastPoint)
                        : this.lastInteractionPosition || vec2.zero();
                    this.debugLog(`TriggerEnd at ${localPos}`);
                    this.endInteraction(localPos);
                }
            });
            // Annulation d'interaction (sortie de zone)
            this.interactable.onTriggerCanceled.add((e) => {
                stopProp(e);
                this.debugLog(`TriggerCanceled - isInteracting: ${this.isCurrentlyInteracting}`);
                if (this.isCurrentlyInteracting) {
                    // Utiliser la dernière position connue car on est sorti de la zone
                    const localPos = this.lastInteractionPosition || vec2.zero();
                    this.debugLog(`TriggerCanceled at last known position: ${localPos}`);
                    this.endInteraction(localPos);
                }
            });
            // Hover pour la détection des pins
            this.interactable.onHoverUpdate.add((e) => {
                stopProp(e);
                if (e.interactor.planecastPoint && !this.isCurrentlyInteracting) {
                    this.mapComponent.updateHover(this.getLocalPosition(e.interactor.planecastPoint));
                }
            });
            // Hover exit - important pour nettoyer l'état si on sort pendant l'interaction
            this.interactable.onHoverExit.add((e) => {
                stopProp(e);
                this.debugLog(`HoverExit - isInteracting: ${this.isCurrentlyInteracting}`);
                // Si on sort de la zone pendant une interaction, on la termine
                if (this.isCurrentlyInteracting) {
                    const localPos = this.lastInteractionPosition || vec2.zero();
                    this.debugLog(`HoverExit during interaction at: ${localPos}`);
                    this.endInteraction(localPos);
                }
            });
        }
        endInteraction(localPosition) {
            this.debugLog(`endInteraction called at ${localPosition}`);
            this.mapComponent.endTouch(localPosition);
            this.isCurrentlyInteracting = false;
            this.lastInteractionPosition = null;
        }
        getLocalPosition(worldPosition) {
            if (!this.rotatingGridTransform)
                return vec2.zero();
            const localPosition = this.rotatingGridTransform.getInvertedWorldTransform().multiplyPoint(worldPosition);
            const normalizedPosition = new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY);
            return normalizedPosition.uniformScale(this.scrollSensitivity);
        }
        setupColliders(isMiniMap) {
            this.miniMapCollider.enabled = isMiniMap;
            this.fullMapCollider.enabled = !isMiniMap;
            const shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
            if (shape.isOfType("BoxShape")) {
                const box = shape;
                this.colliderSizeX = box.size.x / 8;
                this.colliderSizeY = box.size.y / 8;
            }
            else if (shape.isOfType("SphereShape")) {
                const sphere = shape;
                this.colliderSizeX = sphere.radius;
                this.colliderSizeY = sphere.radius;
            }
            else if (shape.isOfType("MeshShape")) {
                const meshShape = shape;
                const renderMesh = meshShape.mesh;
                if (renderMesh) {
                    const min = renderMesh.aabbMin;
                    const max = renderMesh.aabbMax;
                    const size = max.sub(min);
                    this.colliderSizeX = size.x / 2.0;
                    this.colliderSizeY = size.y / 2.0;
                    log.i(`Mesh collider detected. Using calculated size: X=${this.colliderSizeX}, Y=${this.colliderSizeY}`);
                }
                else {
                    log.e("MeshShape collider is missing its mesh resource!");
                }
            }
            else {
                log.e("Unsupported collider shape for map interaction.");
            }
        }
    };
    __setFunctionName(_classThis, "InteractableManipulation");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InteractableManipulation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InteractableManipulation = _classThis;
})();
exports.InteractableManipulation = InteractableManipulation;
//# sourceMappingURL=MapManipulation.js.map