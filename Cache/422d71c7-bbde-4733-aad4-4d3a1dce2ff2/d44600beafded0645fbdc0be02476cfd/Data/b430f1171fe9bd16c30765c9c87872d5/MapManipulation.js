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
const MOBILE_DRAG_MULTIPLIER = 0.5;
const STRETCH_SMOOTH_SPEED = 15;
const YAW_NEGATIVE_90 = quat.fromEulerAngles(0, -90, 0);
const CachedTransform = {
    transform: mat4.identity(),
    position: vec3.zero(),
    rotation: quat.quatIdentity(),
    scale: vec3.one(),
};
/**
 * This class provides manipulation capabilities for interactable objects, including translation, rotation, and scaling. It allows configuration of the manipulation root, scale limits, and rotation axes.
 */
let InteractableManipulation = class InteractableManipulation extends BaseScriptComponent {
    /**
     * Gets the transform of the root of the manipulated object(s).
     */
    getMapTransform() {
        return this.mapTransform;
    }
    /**
     * Sets the transform of the passed SceneObject as the root of the manipulated object(s).
     */
    setMapTransform(transform) {
        this.mapTransform = transform;
    }
    /**
     * Set if translation along world X-axis is enabled.
     */
    set enableXTranslation(enabled) {
        this._enableXTranslation = enabled;
    }
    /**
     * Returns if translation along world X-axis is enabled.
     */
    get enableXTranslation() {
        return this._enableXTranslation;
    }
    /**
     * Set if translation along world Y-axis is enabled.
     */
    set enableYTranslation(enabled) {
        this._enableYTranslation = enabled;
    }
    /**
     * Returns if translation along world Y-axis is enabled.
     */
    get enableYTranslation() {
        return this._enableYTranslation;
    }
    onAwake() {
        this.interactable = this.getSceneObject().getComponent(Interactable_1.Interactable.getTypeName());
        if (this.interactable === null) {
            throw new Error("MapManipulation requires an interactable to function.");
        }
        this.setMapTransform(this.mapSceneObject.getTransform());
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
        this.createEvent("OnDestroyEvent").bind(() => this.onDestroy());
        this.cacheTransform();
        this.setupCallbacks();
        this.defaultFilterConfig = {
            frequency: 60, //fps
            minCutoff: this.minCutoff,
            beta: this.beta,
            dcutoff: this.dcutoff,
        };
        this.translateFilter = new OneEuroFilter_1.OneEuroFilterVec3(this.defaultFilterConfig);
        this.mapComponent.onMiniMapToggled.add((isMiniMap) => {
            this.setupColliders(isMiniMap);
        });
    }
    onStart() {
        this.setupColliders(this.mapComponent.startedAsMiniMap);
    }
    onDestroy() {
        // If we don't unsubscribe, component will keep working after destroy() due to event callbacks added to Interactable Events
        this.unsubscribeBag.forEach((unsubscribeCallback) => {
            unsubscribeCallback();
        });
        this.unsubscribeBag = [];
    }
    setupColliders(isMiniMap) {
        this.miniMapCollider.enabled = isMiniMap;
        this.fullMapCollider.enabled = !isMiniMap;
        let shape;
        if (isMiniMap) {
            shape = this.miniMapCollider.shape;
        }
        else {
            shape = this.fullMapCollider.shape;
        }
        if (shape.isOfType("BoxShape")) {
            const boxShape = shape;
            // Divided by 8 because:
            // Div 2 for half length of the box
            // Div 4 to account for the bigger size of the full map interaction zone
            this.colliderSizeX = boxShape.size.x / 8;
            this.colliderSizeY = boxShape.size.y / 8;
        }
        else if (shape.isOfType("SphereShape")) {
            const sphereShape = shape;
            this.colliderSizeX = sphereShape.radius;
            this.colliderSizeY = sphereShape.radius;
        }
        else {
            this.log.e("Other shapes of collider is not currently supported for map interaction");
        }
    }
    setupCallbacks() {
        (0, validate_1.validate)(this.interactable);
        this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onHoverToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onHoverToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onHoverUpdate(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerUpdate(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
        this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((event) => {
            if (event.propagationPhase === "Target" ||
                event.propagationPhase === "BubbleUp") {
                event.stopPropagation();
                this.onTriggerToggle(event);
            }
        }));
    }
    updateStartValues() {
        var _a, _b;
        (0, validate_1.validate)(this.mapTransform);
        (0, validate_1.validate)(this.interactable);
        const interactor = this.getTriggeringInteractor();
        this.mobileStretch = 0;
        this.smoothedStretch = 0;
        this.startStretchInteractorDistance = 0;
        // Reset filters
        this.translateFilter.reset();
        // Set the starting transform values to be used for callbacks
        this.startTransform = {
            transform: this.mapTransform.getWorldTransform(),
            position: this.mapTransform.getWorldPosition(),
            rotation: this.mapTransform.getWorldRotation(),
            scale: this.mapTransform.getWorldScale(),
        };
        const cameraRotation = this.camera.getTransform().getWorldRotation();
        if (interactor !== null) {
            if (this.isInteractorValid(interactor) === false) {
                this.log.e("Interactor must not be valid for setting initial values");
                return;
            }
            const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
            const orientation = (_b = interactor.orientation) !== null && _b !== void 0 ? _b : quat.quatIdentity();
            this.cachedTargetingMode = interactor.activeTargetingMode;
            if (interactor.activeTargetingMode === Interactor_1.TargetingMode.Direct) {
                this.offsetPosition = this.startTransform.position.sub(startPoint);
                this.offsetRotation = orientation
                    .invert()
                    .multiply(this.startTransform.rotation);
            }
            else {
                const rayPosition = this.getRayPosition(interactor);
                this.offsetPosition = rayPosition.sub(startPoint);
                this.offsetRotation = cameraRotation
                    .invert()
                    .multiply(this.startTransform.rotation);
            }
        }
    }
    /**
     * Hit position from interactor does not necessarily mean the actual
     * ray position. We need to maintain offset so that there's isn't a pop
     * on pickup.
     */
    getRayPosition(interactor) {
        var _a, _b, _c;
        if (this.isInteractorValid(interactor) === false) {
            return vec3.zero();
        }
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const direction = (_b = interactor.direction) !== null && _b !== void 0 ? _b : vec3.zero();
        const distanceToTarget = (_c = interactor.distanceToTarget) !== null && _c !== void 0 ? _c : 0;
        return startPoint.add(direction.uniformScale(distanceToTarget));
    }
    cacheTransform() {
        (0, validate_1.validate)(this.mapTransform);
        this.originalWorldTransform = {
            transform: this.mapTransform.getWorldTransform(),
            position: this.mapTransform.getWorldPosition(),
            rotation: this.mapTransform.getWorldRotation(),
            scale: this.mapTransform.getWorldScale(),
        };
        this.originalLocalTransform = {
            transform: mat4.compose(this.mapTransform.getLocalPosition(), this.mapTransform.getLocalRotation(), this.mapTransform.getLocalScale()),
            position: this.mapTransform.getLocalPosition(),
            rotation: this.mapTransform.getLocalRotation(),
            scale: this.mapTransform.getLocalScale(),
        };
    }
    onHoverToggle(eventData) {
        if (!this.enabled) {
            return;
        }
        // Cache the interactors on hover start/end
        this.hoveringInteractor = this.getHoveringInteractor();
        if (this.hoveringInteractor !== null) {
            log.i("On hover Start Event");
        }
        else {
            log.i(`On hover End Event`);
        }
    }
    onHoverUpdate(eventData) {
        if (!this.enabled) {
            return;
        }
        if (this.hoveringInteractor !== null) {
            const hitPoint = this.hoveringInteractor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined) {
                return;
            }
            const localPos = this.getLocalPosition(hitPoint);
            this.mapComponent.updateHover(localPos);
        }
    }
    onTriggerToggle(eventData) {
        if (!this.enabled) {
            return;
        }
        // Cache the interactors on trigger start/end
        this.triggeringInteractor = this.getTriggeringInteractor();
        if (this.triggeringInteractor !== null) {
            this.updateStartValues();
            const hitPoint = this.triggeringInteractor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined) {
                return;
            }
            const localPos = this.getLocalPosition(hitPoint);
            this.mapComponent.startTouch(localPos);
            // Scale only happens with two handed manipulation so start event firing deferred to updateStartValues()
            this.invokeEvents(this.onTranslationStartEvent);
            this.log.v("InteractionEvent : " + "On Manipulation Start Event");
        }
        else {
            const hitPoint = eventData.interactor.planecastPoint;
            if (hitPoint === null || hitPoint === undefined) {
                return;
            }
            const localPos = this.getLocalPosition(hitPoint);
            this.mapComponent.endTouch(localPos);
            this.invokeEvents(this.onTranslationEndEvent);
            this.log.v("InteractionEvent : " + "On Manipulation End Event");
        }
    }
    onTriggerUpdate(eventData) {
        if (!this.enabled) {
            return;
        }
        if (this.triggeringInteractor !== null) {
            this.singleInteractorTransform(this.triggeringInteractor);
        }
        // Scale only happens with two handed manipulation, so its event firing is deferred to this.dualInteractorsTransform()
        this.invokeEvents(this.onTranslationUpdateEvent);
    }
    getHoveringInteractor() {
        (0, validate_1.validate)(this.interactable);
        const interactors = this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor);
        if (interactors.length === 0) {
            this.log.w(`Failed to retrieve interactors on ${this.getSceneObject().name}: ${this.interactable.hoveringInteractor} (InteractorInputType)`);
            return null;
        }
        return interactors[0];
    }
    getTriggeringInteractor() {
        (0, validate_1.validate)(this.interactable);
        const interactors = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor);
        if (interactors.length === 0) {
            this.log.w(`Failed to retrieve interactors on ${this.getSceneObject().name}: ${this.interactable.triggeringInteractor} (InteractorInputType)`);
            return null;
        }
        return interactors[0];
    }
    invokeEvents(translateEvent) {
        (0, validate_1.validate)(this.interactable);
        (0, validate_1.validate)(this.mapTransform);
        if (translateEvent) {
            translateEvent.invoke({
                interactable: this.interactable,
                startPosition: this.startTransform.position,
                currentPosition: this.mapTransform.getWorldPosition(),
            });
        }
    }
    limitQuatRotation(rotation) {
        let euler = (0, MapUtils_1.customGetEuler)(rotation);
        return quat.fromEulerVec(euler);
    }
    isInteractorValid(interactor) {
        return (interactor !== null &&
            interactor.startPoint !== null &&
            interactor.orientation !== null &&
            interactor.direction !== null &&
            interactor.distanceToTarget !== null &&
            interactor.isActive());
    }
    singleInteractorTransform(interactor) {
        var _a, _b, _c;
        if (this.isInteractorValid(interactor) === false) {
            this.log.e("Interactor must be valid");
            return;
        }
        (0, validate_1.validate)(this.mapTransform);
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const orientation = (_b = interactor.orientation) !== null && _b !== void 0 ? _b : quat.quatIdentity();
        const direction = (_c = interactor.direction) !== null && _c !== void 0 ? _c : vec3.zero();
        const limitRotation = this.limitQuatRotation(orientation).multiply(this.offsetRotation);
        // Single Interactor Direct
        let newPosition;
        if (this.cachedTargetingMode === Interactor_1.TargetingMode.Direct) {
            newPosition = startPoint.add(limitRotation
                .multiply(this.startTransform.rotation.invert())
                .multiplyVec3(this.offsetPosition));
            this.updatePosition(newPosition, this.useFilter);
        }
        else {
            if (this.triggeringInteractor.planecastPoint === null ||
                this.triggeringInteractor.planecastPoint === undefined) {
                return;
            }
            // Single Interactor Indirect
            this.smoothedStretch = MathUtils.lerp(this.smoothedStretch, this.calculateStretchFactor(interactor), getDeltaTime() * STRETCH_SMOOTH_SPEED);
            newPosition = this.triggeringInteractor.planecastPoint.add(direction.uniformScale(this.smoothedStretch));
            this.updatePosition(newPosition, this.useFilter);
        }
    }
    updatePosition(newPosition, useFilter = true) {
        if (newPosition === null) {
            return;
        }
        (0, validate_1.validate)(this.mapTransform);
        if (!this.enableXTranslation) {
            newPosition.x = this.mapTransform.getWorldPosition().x;
        }
        if (!this.enableYTranslation) {
            newPosition.y = this.mapTransform.getWorldPosition().y;
        }
        if (useFilter) {
            newPosition = this.translateFilter.filter(newPosition, getTime());
        }
        const localPos = this.getLocalPosition(newPosition);
        this.mapComponent.updateTouch(localPos);
    }
    getLocalPosition(worldPosition) {
        const localPosition = this.mapTransform
            .getInvertedWorldTransform()
            .multiplyPoint(worldPosition);
        return new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY);
    }
    calculateStretchFactor(interactor) {
        var _a, _b;
        if (this.enableStretchZ === false) {
            return 1;
        }
        //get distance from hand to camera along z axis only
        const startPoint = (_a = interactor.startPoint) !== null && _a !== void 0 ? _a : vec3.zero();
        const interactorDistance = this.camera
            .getTransform()
            .getInvertedWorldTransform()
            .multiplyPoint(startPoint).z * -1;
        if (this.startStretchInteractorDistance === 0) {
            this.startStretchInteractorDistance = interactorDistance;
        }
        const dragAmount = interactorDistance - this.startStretchInteractorDistance;
        //scale movement based on distance from ray start to object
        const currDistance = (_b = interactor.distanceToTarget) !== null && _b !== void 0 ? _b : 0;
        const distanceFactor = (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDistance +
            this.zStretchFactorMin;
        const minStretch = -this.offsetPosition.length + 1;
        const maxStretch = -this.offsetPosition.length + interactor.maxRaycastDistance - 1;
        let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch);
        if (interactor.inputType === Interactor_1.InteractorInputType.Mobile) {
            const mobileInteractor = interactor;
            let mobileDragVector = vec3.zero();
            if (mobileInteractor.touchpadDragVector !== null) {
                mobileDragVector = mobileInteractor.touchpadDragVector;
            }
            const mobileMoveAmount = mobileDragVector.z === 0
                ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER
                : 0;
            this.mobileStretch += mobileMoveAmount * distanceFactor;
            //dont let value accumulate out of bounds
            this.mobileStretch = Math.min(maxStretch - finalStretchAmount, Math.max(minStretch - finalStretchAmount, this.mobileStretch));
            finalStretchAmount += this.mobileStretch;
        }
        return finalStretchAmount;
    }
    /**
     * Resets the interactable's position
     */
    resetPosition(local = false) {
        (0, validate_1.validate)(this.mapTransform);
        if (local) {
            this.mapTransform.setLocalPosition(this.originalLocalTransform.position);
        }
        else {
            this.mapTransform.setWorldPosition(this.originalWorldTransform.position);
        }
    }
    /**
     * Resets the interactable's rotation
     */
    resetRotation(local = false) {
        (0, validate_1.validate)(this.mapTransform);
        if (local) {
            this.mapTransform.setLocalRotation(this.originalLocalTransform.rotation);
        }
        else {
            this.mapTransform.setWorldRotation(this.originalWorldTransform.rotation);
        }
    }
    /**
     * Resets the interactable's transform
     */
    resetTransform(local = false) {
        (0, validate_1.validate)(this.mapTransform);
        if (local) {
            this.mapTransform.setLocalTransform(this.originalLocalTransform.transform);
        }
        else {
            this.mapTransform.setWorldTransform(this.originalWorldTransform.transform);
        }
    }
    __initialize() {
        super.__initialize();
        this.camera = WorldCameraFinderProvider_1.default.getInstance();
        this.interactionManager = InteractionManager_1.InteractionManager.getInstance();
        this._enableXTranslation = true;
        this._enableYTranslation = true;
        this.unsubscribeBag = [];
        this.interactable = null;
        this.log = new NativeLogger_1.default(TAG);
        this.originalWorldTransform = CachedTransform;
        this.originalLocalTransform = CachedTransform;
        this.startTransform = CachedTransform;
        this.offsetPosition = vec3.zero();
        this.offsetRotation = quat.quatIdentity();
        this.startStretchInteractorDistance = 0;
        this.mobileStretch = 0;
        this.smoothedStretch = 0;
        this.cachedTargetingMode = Interactor_1.TargetingMode.None;
        this.onTranslationStartEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation begins
         */
        onTranslationStart = this.onTranslationStartEvent.publicApi();
        this.onTranslationUpdateEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation updates each frame
         */
        onTranslationUpdate = this.onTranslationUpdateEvent.publicApi();
        this.onTranslationEndEvent = new Event_1.default();
        this.
        /**
         * Callback for when translation has ended
         */
        onTranslationEnd = this.onTranslationEndEvent.publicApi();
    }
};
exports.InteractableManipulation = InteractableManipulation;
exports.InteractableManipulation = InteractableManipulation = __decorate([
    component
], InteractableManipulation);
//# sourceMappingURL=MapManipulation.js.map