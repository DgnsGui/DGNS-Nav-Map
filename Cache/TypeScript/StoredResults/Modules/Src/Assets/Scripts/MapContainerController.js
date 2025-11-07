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
exports.MapContainerController = void 0;
var __selfType = requireType("./MapContainerController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const ContainerFrame_1 = require("SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
const mathUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/mathUtils");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
// Keep only one set of container sizes/distances since we only have one mode
const CONTAINER_SIZE = new vec2(54.0, 54.0);
const CONTAINER_DISTANCE = 160;
let MapContainerController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapContainerController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
            this.translationXTime = this.translationXTime;
            this.translationYTime = this.translationYTime;
            this.translationZTime = this.translationZTime;
            this.rotationTime = this.rotationTime;
            this.minFollowDistance = this.minFollowDistance;
            this.maxFollowDistance = this.maxFollowDistance;
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.containerYOffset = 0;
            this.fieldOfView = 26;
            this.visibleWidth = 20;
            this.minElevation = -40;
            this.maxElevation = 40;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.translationXTime = this.translationXTime;
            this.translationYTime = this.translationYTime;
            this.translationZTime = this.translationZTime;
            this.rotationTime = this.rotationTime;
            this.minFollowDistance = this.minFollowDistance;
            this.maxFollowDistance = this.maxFollowDistance;
            this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
            this.containerYOffset = 0;
            this.fieldOfView = 26;
            this.visibleWidth = 20;
            this.minElevation = -40;
            this.maxElevation = 40;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
            const updateEvent = this.updateDispatcher.createUpdateEvent("UpdateEvent");
            updateEvent.bind(this.onUpdate.bind(this));
        }
        onStart() {
            this.container = this.sceneObject.getComponent(ContainerFrame_1.ContainerFrame.getTypeName());
            // Always set to not following (full map mode)
            this.container.setIsFollowing(false);
            this.container.followButton.onTrigger.add(this.handleFollowButtonTrigger.bind(this));
            this.mapComponent.onMiniMapToggled.add(this.handleMiniMapToggled.bind(this));
            this.cameraTransform =
                WorldCameraFinderProvider_1.default.getInstance().getTransform();
            this.containerYOffset =
                this.container.getWorldPosition().y -
                    this.cameraTransform.getWorldPosition().y;
            this.containerTransform = this.container.parentTransform;
            this.initializeSmoothFollow();
            // Set container to full size immediately
            this.container.innerSize = CONTAINER_SIZE;
        }
        onUpdate() {
            if (!this.container.isFollowing) {
                return;
            }
            this.updateSmoothFollow();
        }
        initializeSmoothFollow() {
            this.target = vec3.zero();
            this.velocity = vec3.zero();
            this.omega = 0;
            this.heading = 0;
            this.dragging = false;
            this.initialRot = this.containerTransform.getLocalRotation();
            this.heading = this.cameraHeading;
            this.worldRot = quat
                .angleAxis(this.heading, vec3.up())
                .multiply(this.initialRot);
            this.resize(this.container.innerSize.x +
                this.container.border * 2 +
                this.container.constantPadding.x);
            this.container.onTranslationStart.add(this.startDragging.bind(this));
            this.container.onTranslationEnd.add(this.finishDragging.bind(this));
        }
        updateSmoothFollow() {
            if (!this.dragging) {
                const pos = this.cartesianToCylindrical(this.worldToBody(this.worldPos));
                const currentY = this.worldPos.y;
                const targetY = this.cameraTransform.getWorldPosition().y + this.containerYOffset;
                let newY;
                [pos.x, this.velocity.x] = (0, mathUtils_1.smoothDamp)(pos.x, this.target.x, this.velocity.x, this.translationXTime, getDeltaTime());
                [newY, this.velocity.y] = (0, mathUtils_1.smoothDamp)(currentY, targetY, this.velocity.y, this.translationYTime, getDeltaTime());
                [pos.z, this.velocity.z] = (0, mathUtils_1.smoothDamp)(pos.z, this.target.z, this.velocity.z, this.translationZTime, getDeltaTime());
                const worldXZPos = this.bodyToWorld(this.cylindricalToCartesian(pos));
                this.worldPos = new vec3(worldXZPos.x, newY, worldXZPos.z);
                [this.heading, this.omega] = (0, mathUtils_1.smoothDampAngle)(this.heading, this.cameraHeading, this.omega, this.rotationTime, getDeltaTime());
                this.worldRot = quat
                    .lookAt(this.cameraPos.sub(this.worldPos).normalize(), vec3.up())
                    .multiply(this.initialRot);
            }
        }
        handleMiniMapToggled(isMiniMap) {
            // Cancel any existing tween
            if (this.tweenCancelFunction !== undefined) {
                this.tweenCancelFunction();
                this.tweenCancelFunction = undefined;
            }
            // Simply center the map without changing container size or position
            // since we're keeping everything in full-map mode
            this.mapComponent.centerMap();
            // Keep the container in full size mode
            this.container.innerSize = CONTAINER_SIZE;
            this.container.setIsFollowing(false);
            // Set container to proper distance for full map
            const containerWorldPosition = this.containerTransform.getWorldPosition();
            const targetWorldPosition = containerWorldPosition
                .sub(this.cameraPos)
                .normalize()
                .uniformScale(CONTAINER_DISTANCE)
                .add(this.cameraPos);
            this.containerTransform.setWorldPosition(targetWorldPosition);
        }
        handleFollowButtonTrigger() {
            this.clampPosition();
        }
        startDragging() {
            this.dragging = true;
        }
        finishDragging() {
            this.dragging = false;
            this.clampPosition();
        }
        resize(visibleWidth) {
            this.visibleWidth = visibleWidth;
            this.clampPosition();
        }
        clampPosition() {
            if (this.dragging)
                return;
            this.target = this.cartesianToCylindrical(this.worldToBody(this.worldPos));
            this.target.z = (0, mathUtils_1.clamp)(this.target.z, this.minFollowDistance, this.maxFollowDistance);
            this.target.z = Math.max(this.target.z, (1.1 * this.visibleWidth) /
                2 /
                Math.tan((this.fieldOfView / 2) * MathUtils.DegToRad));
            this.target.y = (0, mathUtils_1.clamp)(this.target.y, this.minElevation, this.maxElevation);
            const halfFov = this.halfFov;
            this.target.x = (0, mathUtils_1.clamp)(this.target.x, -halfFov, halfFov);
            this.velocity = vec3.zero();
            this.omega = 0;
        }
        get halfFov() {
            const dist = new vec2(this.target.y, this.target.z).length;
            return Math.atan((Math.tan((this.fieldOfView / 2) * MathUtils.DegToRad) * dist -
                this.visibleWidth / 2) /
                this.target.z);
        }
        cartesianToCylindrical(v) {
            return new vec3(Math.atan2(-v.x, -v.z), v.y, Math.sqrt(v.x * v.x + v.z * v.z));
        }
        cylindricalToCartesian(v) {
            return new vec3(v.z * -Math.sin(v.x), v.y, v.z * -Math.cos(v.x));
        }
        worldToBody(v) {
            return quat
                .angleAxis(-this.cameraHeading, vec3.up())
                .multiplyVec3(v.sub(this.cameraPos));
        }
        bodyToWorld(v) {
            return quat
                .angleAxis(this.cameraHeading, vec3.up())
                .multiplyVec3(v)
                .add(this.cameraPos);
        }
        get cameraHeading() {
            const forward = this.cameraTransform
                .getWorldTransform()
                .multiplyDirection(new vec3(0, 0, -1));
            return Math.atan2(-forward.x, -forward.z);
        }
        get cameraPos() {
            return this.cameraTransform.getWorldPosition();
        }
        get worldRot() {
            (0, validate_1.validate)(this.containerTransform);
            return this.containerTransform.getWorldRotation();
        }
        set worldRot(value) {
            (0, validate_1.validate)(this.containerTransform);
            this.containerTransform.setWorldRotation(value);
        }
        get worldPos() {
            (0, validate_1.validate)(this.containerTransform);
            return this.containerTransform.getWorldPosition();
        }
        set worldPos(value) {
            (0, validate_1.validate)(this.containerTransform);
            this.containerTransform.setWorldPosition(value);
        }
    };
    __setFunctionName(_classThis, "MapContainerController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapContainerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapContainerController = _classThis;
})();
exports.MapContainerController = MapContainerController;
//# sourceMappingURL=MapContainerController.js.map