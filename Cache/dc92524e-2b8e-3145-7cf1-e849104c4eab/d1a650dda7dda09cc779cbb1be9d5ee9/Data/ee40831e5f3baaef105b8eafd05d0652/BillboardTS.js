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
exports.BillboardTS = void 0;
var __selfType = requireType("./BillboardTS");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * The billboard solver allows the content to face a target, rotating only around the Y axis.
 */
let BillboardTS = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var BillboardTS = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.lookAway = this.lookAway;
            this.target = this.target;
            this._targetRotation = new quat(0, 0, 0, 1);
            this._lookDir = new vec3(0, 0, 0);
        }
        __initialize() {
            super.__initialize();
            this.lookAway = this.lookAway;
            this.target = this.target;
            this._targetRotation = new quat(0, 0, 0, 1);
            this._lookDir = new vec3(0, 0, 0);
        }
        // Initialize with the proper pattern
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
            this.createEvent("UpdateEvent").bind(() => {
                this.onUpdate();
            });
        }
        onStart() {
            // Camera handling is simplified as we don't have direct Camera.main access
            if (!this.target) {
                // In a real implementation, we would find the main camera
                // For now, this will be handled by the user setting the target
            }
        }
        onUpdate() {
            this.billboarding();
        }
        /**
         * Update the billboard orientation to face the target.
         */
        billboarding() {
            if (!this.target)
                return;
            const myPosition = this.sceneObject.getTransform().getWorldPosition();
            const targetPosition = this.target.getTransform().getWorldPosition();
            // Get the direction to the target but flatten on the X and Z axes (only Y axis rotation)
            this._lookDir = new vec3(targetPosition.x - myPosition.x, 0, // Keep only Y axis rotation by zeroing out the Y component
            targetPosition.z - myPosition.z);
            // Normalize the direction vector
            const length = Math.sqrt(this._lookDir.x * this._lookDir.x +
                this._lookDir.z * this._lookDir.z);
            if (length < 0.0001)
                return; // Avoid division by zero
            this._lookDir.x /= length;
            this._lookDir.z /= length;
            if (this.lookAway) {
                this._lookDir.x *= -1;
                this._lookDir.z *= -1;
            }
            // Convert the direction to a quaternion (y-axis rotation)
            // For y-axis rotation, we only care about the xz plane angle
            const angle = Math.atan2(this._lookDir.x, this._lookDir.z);
            this._targetRotation = quat.fromEulerAngles(0, angle, 0);
            // Get current rotation
            const currentRotation = this.sceneObject.getTransform().getWorldRotation();
            // Slerp between current and target rotation
            const newRotation = quat.slerp(currentRotation, this._targetRotation, getDeltaTime() * 5 // Adjust speed as needed
            );
            // Apply the new rotation
            this.sceneObject.getTransform().setWorldRotation(newRotation);
        }
    };
    __setFunctionName(_classThis, "BillboardTS");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BillboardTS = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BillboardTS = _classThis;
})();
exports.BillboardTS = BillboardTS;
//# sourceMappingURL=BillboardTS.js.map