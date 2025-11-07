"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractableManipulation = void 0;
var __selfType = requireType("./MapManipulation");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// --- START OF FILE MapManipulation.ts (Final) ---
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "[MapManipulation]";
const log = new NativeLogger_1.default(TAG);
let InteractableManipulation = class InteractableManipulation extends BaseScriptComponent {
    onAwake() {
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (!this.interactable)
            throw new Error("MapManipulation requires an Interactable.");
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        this.setupCallbacks();
        this.mapComponent.onMiniMapToggled.add((isMiniMap) => this.setupColliders(isMiniMap));
    }
    onStart() {
        this.setupColliders(this.mapComponent.startedAsMiniMap);
        if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
            this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
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
        const stopProp = (e) => { if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp")
            e.stopPropagation(); };
        this.interactable.onInteractorTriggerStart.add((e) => {
            stopProp(e);
            if (e.interactor.planecastPoint) {
                this.mapComponent.startTouch(this.getLocalPosition(e.interactor.planecastPoint));
            }
        });
        this.interactable.onTriggerUpdate.add((e) => {
            stopProp(e);
            if (e.interactor.planecastPoint) {
                this.mapComponent.updateTouch(this.getLocalPosition(e.interactor.planecastPoint));
            }
        });
        this.interactable.onInteractorTriggerEnd.add((e) => {
            stopProp(e);
            if (e.interactor.planecastPoint) {
                this.mapComponent.endTouch(this.getLocalPosition(e.interactor.planecastPoint));
            }
        });
        this.interactable.onTriggerCanceled.add((e) => {
            stopProp(e);
            if (e.interactor.planecastPoint) {
                this.mapComponent.endTouch(this.getLocalPosition(e.interactor.planecastPoint));
            }
        });
        this.interactable.onHoverUpdate.add((e) => {
            stopProp(e);
            if (e.interactor.planecastPoint) {
                this.mapComponent.updateHover(this.getLocalPosition(e.interactor.planecastPoint));
            }
        });
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
    }
    __initialize() {
        super.__initialize();
        this.interactable = null;
    }
};
exports.InteractableManipulation = InteractableManipulation;
exports.InteractableManipulation = InteractableManipulation = __decorate([
    component
], InteractableManipulation);
//# sourceMappingURL=MapManipulation.js.map