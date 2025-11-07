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
// --- START OF FILE MapManipulation.ts (FINAL, COMPILES, AND WORKS - V3) ---
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const Interactor_1 = require("SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor");
const OneEuroFilter_1 = require("SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter");
const Interactable_1 = require("SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable");
const InteractionManager_1 = require("SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const MapUtils_1 = require("../MapComponent/Scripts/MapUtils");
const TAG = "[MapManipulation]";
const log = new NativeLogger_1.default(TAG);
const STRETCH_SMOOTH_SPEED = 15;
const MOBILE_DRAG_MULTIPLIER = 0.5;
const CachedTransform = { transform: mat4.identity(), position: vec3.zero(), rotation: quat.quatIdentity(), scale: vec3.one() };
let InteractableManipulation = class InteractableManipulation extends BaseScriptComponent {
    onAwake() {
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (!this.interactable)
            throw new Error("MapManipulation requires an Interactable.");
        this.parentMapTransform = this.mapSceneObject.getTransform();
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        this.createEvent("OnDestroyEvent").bind(() => this.unsubscribeBag.forEach(u => u()));
        this.cacheTransform();
        this.setupCallbacks();
        this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3({ frequency: 60, minCutoff: this.minCutoff, beta: this.beta, dcutoff: this.dcutoff });
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
    getLocalPosition(worldPosition) {
        const transformToUse = this.rotatingGridTransform || this.parentMapTransform;
        const localPosition = transformToUse.getInvertedWorldTransform().multiplyPoint(worldPosition);
        return new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY);
    }
    setupCallbacks() {
        (0, validate_1.validate)(this.interactable);
        // *** LA CORRECTION EST ICI ***
        const stopProp = (e) => {
            if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp") {
                e.stopPropagation();
            }
        };
        this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((e) => { stopProp(e); this.onHoverToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((e) => { stopProp(e); this.onHoverToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((e) => { stopProp(e); this.onHoverUpdate(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((e) => { stopProp(e); this.onTriggerUpdate(e); }));
        this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    }
    // --- LE RESTE DU SCRIPT EST RESTAURÉ À L'ORIGINAL FONCTIONNEL ---
    onTriggerUpdate(eventData) {
        if (!this.enabled)
            return;
        if (this.triggeringInteractor) {
            this.singleInteractorTransform(this.triggeringInteractor);
        }
        this.onTranslationUpdateEvent.invoke({
            interactable: this.interactable,
            startPosition: this.startTransform.position,
            currentPosition: this.parentMapTransform.getWorldPosition(),
        });
    }
    singleInteractorTransform(interactor) {
        var _a, _b, _c;
        if (!this.isInteractorValid(interactor)) {
            this.log.e("Interactor must be valid");
            return;
        }
        (0, validate_1.validate)(this.parentMapTransform);
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const orientation = (_b = interactor.orientation) !== null && _b !== void 0 ? _b : quat.quatIdentity();
        const direction = (_c = interactor.direction) !== null && _c !== void 0 ? _c : vec3.zero();
        const limitRotation = quat.fromEulerVec((0, MapUtils_1.customGetEuler)(orientation)).multiply(this.offsetRotation);
        let newPosition;
        if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
            newPosition = startPoint.add(limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.offsetPosition));
            this.updatePosition(newPosition, this.useFilter);
        }
        else {
            if (!this.triggeringInteractor.planecastPoint)
                return;
            this.smoothedStretch = MathUtils.lerp(this.smoothedStretch, this.calculateStretchFactor(interactor), getDeltaTime() * STRETCH_SMOOTH_SPEED);
            newPosition = this.triggeringInteractor.planecastPoint.add(direction.uniformScale(this.smoothedStretch));
            this.updatePosition(newPosition, this.useFilter);
        }
    }
    updatePosition(newPosition, useFilter = true) {
        if (newPosition === null)
            return;
        (0, validate_1.validate)(this.parentMapTransform);
        newPosition.x = this.parentMapTransform.getWorldPosition().x;
        newPosition.y = this.parentMapTransform.getWorldPosition().y;
        if (useFilter)
            newPosition = this.translateFilter.filter(newPosition, getTime());
        this.mapComponent.updateTouch(this.getLocalPosition(newPosition));
    }
    setupColliders(isMiniMap) {
        this.miniMapCollider.enabled = isMiniMap;
        this.fullMapCollider.enabled = !isMiniMap;
        let shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
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
    updateStartValues() {
        (0, validate_1.validate)(this.parentMapTransform);
        const interactor = this.getTriggeringInteractor();
        if (!interactor)
            return;
        this.translateFilter.reset();
        this.startTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
    }
    cacheTransform() {
        (0, validate_1.validate)(this.parentMapTransform);
        this.originalWorldTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
    }
    onHoverToggle(e) { this.hoveringInteractor = this.getHoveringInteractor(); }
    onHoverUpdate(e) { if (this.hoveringInteractor && e.interactor.planecastPoint)
        this.mapComponent.updateHover(this.getLocalPosition(e.interactor.planecastPoint)); }
    onTriggerToggle(eventData) {
        this.triggeringInteractor = this.getTriggeringInteractor();
        if (this.triggeringInteractor) {
            this.updateStartValues();
            if (this.triggeringInteractor.planecastPoint)
                this.mapComponent.startTouch(this.getLocalPosition(this.triggeringInteractor.planecastPoint));
            this.onTranslationStartEvent.invoke({ interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition() });
        }
        else {
            if (eventData.interactor.planecastPoint)
                this.mapComponent.endTouch(this.getLocalPosition(eventData.interactor.planecastPoint));
            this.onTranslationEndEvent.invoke({ interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition() });
        }
    }
    getHoveringInteractor() { return this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor)[0] || null; }
    getTriggeringInteractor() { return this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor)[0] || null; }
    isInteractorValid(i) { return !!(i && i.startPoint && i.orientation && i.direction && i.distanceToTarget !== null && i.isActive()); }
    calculateStretchFactor(interactor) {
        var _a, _b, _c;
        if (!this.enableStretchZ)
            return 1;
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const iDist = -this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z;
        if (this.startStretchInteractorDistance === 0)
            this.startStretchInteractorDistance = iDist;
        const dragAmount = iDist - this.startStretchInteractorDistance;
        const currDist = (_b = interactor.distanceToTarget) !== null && _b !== void 0 ? _b : 0;
        const distFactor = (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDist + this.zStretchFactorMin;
        const minStretch = -this.offsetPosition.length + 1;
        const maxStretch = -this.offsetPosition.length + interactor.maxRaycastDistance - 1;
        let finalAmount = MathUtils.clamp(dragAmount * distFactor, minStretch, maxStretch);
        if (interactor.inputType === Interactor_1.InteractorInputType.Mobile) {
            const mobi = interactor;
            const dragVec = (_c = mobi.touchpadDragVector) !== null && _c !== void 0 ? _c : vec3.zero();
            const moveAmount = dragVec.z === 0 ? dragVec.y * MOBILE_DRAG_MULTIPLIER : 0;
            this.mobileStretch += moveAmount * distFactor;
            this.mobileStretch = Math.min(maxStretch - finalAmount, Math.max(minStretch - finalAmount, this.mobileStretch));
            finalAmount += this.mobileStretch;
        }
        return finalAmount;
    }
    __initialize() {
        super.__initialize();
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this.unsubscribeBag = [];
        this.interactable = null;
        this.log = new NativeLogger_1.default(TAG);
        this.originalWorldTransform = CachedTransform;
        this.startTransform = CachedTransform;
        this.offsetPosition = vec3.zero();
        this.offsetRotation = quat.quatIdentity();
        this.startStretchInteractorDistance = 0;
        this.mobileStretch = 0;
        this.smoothedStretch = 0;
        this.cachedTargetingMode = Interactor_1.TargetingMode.None;
        this.onTranslationStartEvent = new Event_1.default();
        this.onTranslationStart = this.onTranslationStartEvent.publicApi();
        this.onTranslationUpdateEvent = new Event_1.default();
        this.onTranslationUpdate = this.onTranslationUpdateEvent.publicApi();
        this.onTranslationEndEvent = new Event_1.default();
        this.onTranslationEnd = this.onTranslationEndEvent.publicApi();
    }
};
exports.InteractableManipulation = InteractableManipulation;
exports.InteractableManipulation = InteractableManipulation = __decorate([
    component
], InteractableManipulation);
//# sourceMappingURL=MapManipulation.js.map