"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapContainerController = void 0;
var __selfType = requireType("./MapContainerController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const MapUtils_1 = require("../MapComponent/Scripts/MapUtils");
const ContainerFrame_1 = require("SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame");
const WorldCameraFinderProvider_1 = require("SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider");
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
const mathUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/mathUtils");
const validate_1 = require("SpectaclesInteractionKit.lspkg/Utils/validate");
const MapUIController_1 = require("./MapUIController");
const CONTAINER_SIZE_MINI = new vec2(10, 10);
const CONTAINER_SIZE_FULL = new vec2(54.0, 54.0);
const CONTAINER_DISTANCE_MINI = 130;
const CONTAINER_DISTANCE_FULL = 160;
let MapContainerController = class MapContainerController extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        const updateEvent = this.updateDispatcher.createUpdateEvent("UpdateEvent");
        updateEvent.bind(this.onUpdate.bind(this));
    }
    onStart() {
        this.container = this.sceneObject.getComponent(ContainerFrame_1.ContainerFrame.getTypeName());
        this.container.setIsFollowing(this.mapComponent.startedAsMiniMap);
        this.container.followButton.onTrigger.add(this.handleFollowButtonTrigger.bind(this));
        this.mapComponent.onMiniMapToggled.add(this.handleMiniMapToggled.bind(this));
        this.cameraTransform =
            WorldCameraFinderProvider_1.default.getInstance().getTransform();
        this.containerYOffset =
            this.container.getWorldPosition().y -
                this.cameraTransform.getWorldPosition().y;
        this.containerTransform = this.container.parentTransform;
        this.initializeSmoothFollow();
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
            // Setting the y to follow the camera so that it can handle elevation changes
            const currentY = this.worldPos.y;
            const targetY = this.cameraTransform.getWorldPosition().y + this.containerYOffset;
            let newY;
            [pos.x, this.velocity.x] = (0, mathUtils_1.smoothDamp)(pos.x, this.target.x, this.velocity.x, this.translationXTime, getDeltaTime());
            [newY, this.velocity.y] = (0, mathUtils_1.smoothDamp)(currentY, targetY, this.velocity.y, this.translationYTime, getDeltaTime());
            [pos.z, this.velocity.z] = (0, mathUtils_1.smoothDamp)(pos.z, this.target.z, this.velocity.z, this.translationZTime, getDeltaTime());
            const worldXZPos = this.bodyToWorld(this.cylindricalToCartesian(pos));
            this.worldPos = new vec3(worldXZPos.x, newY, worldXZPos.z);
            [this.heading, this.omega] = (0, mathUtils_1.smoothDampAngle)(this.heading, this.cameraHeading, this.omega, this.rotationTime, getDeltaTime());
            // force billboard
            this.worldRot = quat
                .lookAt(this.cameraPos.sub(this.worldPos).normalize(), vec3.up())
                .multiply(this.initialRot);
        }
    }
    handleMiniMapToggled(isMiniMap) {
        if (this.tweenCancelFunction !== undefined) {
            this.tweenCancelFunction();
            this.tweenCancelFunction = undefined;
        }
        const containerWorldPosition = this.containerTransform.getWorldPosition();
        if (isMiniMap) {
            this.mapComponent.centerMap();
            const targetWorldPosition = containerWorldPosition
                .sub(this.cameraPos)
                .normalize()
                .uniformScale(CONTAINER_DISTANCE_MINI)
                .add(this.cameraPos);
            this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                this.container.innerSize = vec2.lerp(CONTAINER_SIZE_FULL, CONTAINER_SIZE_MINI, t);
                this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t));
                if (t > 0.9999) {
                    this.container.setIsFollowing(true);
                    this.clampPosition();
                }
            }, MapUIController_1.TWEEN_DURATION);
        }
        else {
            this.container.setIsFollowing(false);
            const targetWorldPosition = containerWorldPosition
                .sub(this.cameraPos)
                .normalize()
                .uniformScale(CONTAINER_DISTANCE_FULL)
                .add(this.cameraPos);
            this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                this.container.innerSize = vec2.lerp(CONTAINER_SIZE_MINI, CONTAINER_SIZE_FULL, t);
                this.containerTransform.setWorldPosition(vec3.lerp(containerWorldPosition, targetWorldPosition, t));
            }, MapUIController_1.TWEEN_DURATION);
        }
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
        // the initial goal of the follower is whereever it is relative to the
        // camera when the component gets enabled. the grab bar works by disabling
        // this component when grabbed, and reenables it when let go.
        if (this.dragging)
            return; // skip while actively scaling
        this.target = this.cartesianToCylindrical(this.worldToBody(this.worldPos));
        this.target.z = (0, mathUtils_1.clamp)(this.target.z, this.minFollowDistance, this.maxFollowDistance);
        this.target.z = Math.max(this.target.z, (1.1 * this.visibleWidth) /
            2 /
            Math.tan((this.fieldOfView / 2) * MathUtils.DegToRad)); // handle very wide panels
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
    __initialize() {
        super.__initialize();
        this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
        this.containerYOffset = 0;
        this.fieldOfView = 26;
        this.visibleWidth = 20;
        this.minElevation = -40;
        this.maxElevation = 40;
    }
};
exports.MapContainerController = MapContainerController;
exports.MapContainerController = MapContainerController = __decorate([
    component
], MapContainerController);
//# sourceMappingURL=MapContainerController.js.map