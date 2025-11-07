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
exports.ScaleOverDistanceLinearTS = void 0;
var __selfType = requireType("./ScaleOverDistanceLinear");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Linear Scale of content over distance from target
 */
let ScaleOverDistanceLinearTS = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ScaleOverDistanceLinearTS = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.target = this.target;
            this.minDistance = this.minDistance;
            this.maxDistance = this.maxDistance;
            this.minScale = this.minScale;
            this.maxScale = this.maxScale;
            this._distance = 0;
        }
        __initialize() {
            super.__initialize();
            this.target = this.target;
            this.minDistance = this.minDistance;
            this.maxDistance = this.maxDistance;
            this.minScale = this.minScale;
            this.maxScale = this.maxScale;
            this._distance = 0;
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
            if (!this.target) {
                print("No target set for ScaleOverDistanceLinear - please set a target object");
            }
        }
        onUpdate() {
            if (!this.target)
                return;
            this.updateScale();
        }
        /**
         * Update the scale based on distance to target.
         */
        updateScale() {
            // Get positions
            const myPosition = this.sceneObject.getTransform().getWorldPosition();
            const targetPosition = this.target.getTransform().getWorldPosition();
            // Calculate distance
            this._distance = this.calculateDistance(myPosition, targetPosition);
            // Calculate scale value based on distance
            const scale = this.remap(this._distance, this.minDistance, this.maxDistance, this.minScale, this.maxScale);
            // Apply uniform scale
            this.sceneObject.getTransform().setLocalScale(new vec3(scale, scale, scale));
        }
        /**
         * Calculate the distance between two points.
         */
        calculateDistance(pointA, pointB) {
            // Calculate absolute distance
            const dx = pointB.x - pointA.x;
            const dy = pointB.y - pointA.y;
            const dz = pointB.z - pointA.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        /**
         * Remap a value from one range to another.
         * @param value The value to remap
         * @param from1 Minimum of the input range
         * @param to1 Maximum of the input range
         * @param from2 Minimum of the output range
         * @param to2 Maximum of the output range
         * @returns Remapped value
         */
        remap(value, from1, to1, from2, to2) {
            // Ensure value is within the input range
            const clampedValue = Math.max(from1, Math.min(to1, value));
            // Calculate how far along the input range the value is (0 to 1)
            const percentage = (clampedValue - from1) / (to1 - from1);
            // Map that percentage to the output range
            return from2 + percentage * (to2 - from2);
        }
    };
    __setFunctionName(_classThis, "ScaleOverDistanceLinearTS");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScaleOverDistanceLinearTS = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScaleOverDistanceLinearTS = _classThis;
})();
exports.ScaleOverDistanceLinearTS = ScaleOverDistanceLinearTS;
//# sourceMappingURL=ScaleOverDistanceLinear.js.map