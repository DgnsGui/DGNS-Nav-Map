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
// --- START OF FILE MapManipulation.ts (CORRECTED - FINAL V2) ---
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const Interactor_1 = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor");
const OneEuroFilter_1 = require("SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter");
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const InteractionManager_1 = require("SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const TAG = "[MapManipulation]";
const log = new NativeLogger_1.default(TAG);
const CachedTransform = { transform: mat4.identity(), position: vec3.zero(), rotation: quat.quatIdentity(), scale: vec3.one() };
let InteractableManipulation = class InteractableManipulation extends BaseScriptComponent {
    onAwake() {
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (!this.interactable)
            throw new Error("MapManipulation requires an Interactable.");
        this.parentMapTransform = this.mapSceneObject.getTransform();
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        this.createEvent("OnDestroyEvent").bind(() => this.unsubscribeBag.forEach(u => u()));
        this.setupCallbacks();
        this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3({ frequency: 60, minCutoff: this.minCutoff, beta: this.beta, dcutoff: this.dcutoff });
        this.mapComponent.onMiniMapToggled.add((isMiniMap) => this.setupColliders(isMiniMap));
    }
    onStart() {
        this.setupColliders(this.mapComponent.startedAsMiniMap);
        if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
            // *** CORRECTION #1 ICI ***
            this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
        }
        else {
            log.e("MapController not ready on Start, retrying...");
            // *** CORRECTION #2 ICI ***
            const delayedEvent = this.createEvent("DelayedCallbackEvent");
            delayedEvent.bind(() => this.onStart());
            delayedEvent.reset(0.1);
        }
    }
    setupColliders(isMiniMap) {
        this.miniMapCollider.enabled = isMiniMap;
        this.fullMapCollider.enabled = !isMiniMap;
        const shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
        if (shape.isOfType("BoxShape")) {
            const boxShape = shape;
            this.colliderSizeX = boxShape.size.x / 8;
            this.colliderSizeY = boxShape.size.y / 8;
        }
    }
    getLocalPosition(worldPosition) {
        if (!this.rotatingGridTransform) {
            log.w("rotatingGridTransform not yet available.");
            return vec2.zero();
        }
        const localPosition = this.rotatingGridTransform
            .getInvertedWorldTransform()
            .multiplyPoint(worldPosition);
        return new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY);
    }
    setupCallbacks() {
        (0, validate_1.validate)(this.interactable);
        const stopProp = (e) => { if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp")
            e.stopPropagation(); };
        this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((e) => { stopProp(e); this.onHoverToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((e) => { stopProp(e); this.onHoverToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((e) => { stopProp(e); this.onHoverUpdate(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((e) => { stopProp(e); this.onTriggerUpdate(e); }));
        this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    }
    onHoverToggle(eventData) { if (this.enabled)
        this.hoveringInteractor = this.getHoveringInteractor(); }
    onHoverUpdate(eventData) {
        if (!this.enabled || !this.hoveringInteractor || !this.hoveringInteractor.planecastPoint)
            return;
        this.mapComponent.updateHover(this.getLocalPosition(this.hoveringInteractor.planecastPoint));
    }
    onTriggerToggle(eventData) {
        if (!this.enabled)
            return;
        this.triggeringInteractor = this.getTriggeringInteractor();
        if (this.triggeringInteractor && this.triggeringInteractor.planecastPoint) {
            this.mapComponent.startTouch(this.getLocalPosition(this.triggeringInteractor.planecastPoint));
        }
        else if (eventData.interactor.planecastPoint) {
            this.mapComponent.endTouch(this.getLocalPosition(eventData.interactor.planecastPoint));
        }
    }
    onTriggerUpdate(eventData) {
        if (!this.enabled || !this.triggeringInteractor || !this.triggeringInteractor.planecastPoint)
            return;
        this.updatePosition(this.triggeringInteractor.planecastPoint);
    }
    updatePosition(newPosition, useFilter = true) {
        if (!newPosition)
            return;
        if (useFilter)
            newPosition = this.translateFilter.filter(newPosition, getTime());
        this.mapComponent.updateTouch(this.getLocalPosition(newPosition));
    }
    getHoveringInteractor() { return this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor)[0] || null; }
    getTriggeringInteractor() { return this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor)[0] || null; }
    __initialize() {
        super.__initialize();
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.unsubscribeBag = [];
        this.interactable = null;
        this.originalWorldTransform = CachedTransform;
        this.originalLocalTransform = CachedTransform;
        this.startTransform = CachedTransform;
        this.offsetPosition = vec3.zero();
        this.offsetRotation = quat.quatIdentity();
        this.cachedTargetingMode = Interactor_1.TargetingMode.None;
        this.onTranslationStart = new Event_1.default().publicApi();
        this.onTranslationUpdate = new Event_1.default().publicApi();
        this.onTranslationEnd = new Event_1.default().publicApi();
    }
};
exports.InteractableManipulation = InteractableManipulation;
exports.InteractableManipulation = InteractableManipulation = __decorate([
    component
], InteractableManipulation);
//# sourceMappingURL=MapManipulation.js.map