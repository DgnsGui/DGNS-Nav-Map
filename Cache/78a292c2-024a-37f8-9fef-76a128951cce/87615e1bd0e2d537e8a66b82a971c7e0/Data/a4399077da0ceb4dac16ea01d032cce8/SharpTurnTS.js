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
exports.SharpTurnTShen = void 0;
var __selfType = requireType("./SharpTurnTS");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Collects a series of positions and detects sharp turns using the dot product.
 */
let SharpTurnTShen = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SharpTurnTShen = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.step = this.step;
            this.frameCount = this.frameCount;
            this.minVertexDistance = this.minVertexDistance;
            this.debug = this.debug;
            // Events
            this._onTurn = [];
            // Internal tracking variables
            this._positions = [];
            this._currentIndex = 0;
            this._newestDirection = new vec3(0, 0, 0);
            this._oldestDirection = new vec3(0, 0, 0);
        }
        __initialize() {
            super.__initialize();
            this.step = this.step;
            this.frameCount = this.frameCount;
            this.minVertexDistance = this.minVertexDistance;
            this.debug = this.debug;
            // Events
            this._onTurn = [];
            // Internal tracking variables
            this._positions = [];
            this._currentIndex = 0;
            this._newestDirection = new vec3(0, 0, 0);
            this._oldestDirection = new vec3(0, 0, 0);
        }
        // Initialize with the proper pattern
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.onStart();
            });
            this.createEvent("UpdateEvent").bind(() => {
                this.onUpdate();
            });
            // Initialize positions array
            this._positions = new Array(this.frameCount).fill(null).map(() => new vec3(0, 0, 0));
        }
        onStart() {
            // Initialize the first position
            this._positions[this._currentIndex] = this.sceneObject.getTransform().getWorldPosition();
        }
        onUpdate() {
            // Get current position
            const currentPos = this.sceneObject.getTransform().getWorldPosition();
            // Only record position if moved enough
            if (this.getDistance(currentPos, this._positions[this._currentIndex]) > this.minVertexDistance) {
                // Move to the next index, looping around if necessary
                this._currentIndex = (this._currentIndex + 1) % this.frameCount;
                this._positions[this._currentIndex] = currentPos;
                // Ensure there are enough points for direction calculations
                if (this._currentIndex >= this.step) {
                    // Calculate directions
                    const prevIndex = (this._currentIndex - 1 + this.frameCount) % this.frameCount;
                    const oldIndex = (this._currentIndex - this.step + this.frameCount) % this.frameCount;
                    this._newestDirection = this.subtractVectors(this._positions[this._currentIndex], this._positions[prevIndex]);
                    this._oldestDirection = this.subtractVectors(this._positions[this._currentIndex], this._positions[oldIndex]);
                    // Detect sharp turn using dot product
                    const dotProduct = this.detectDotProduct(this._newestDirection, this._oldestDirection);
                    if (this.debug) {
                        print("Dot Product: " + dotProduct.toFixed(4));
                    }
                    // Check if a sharp turn has occurred (dot product < -0.1)
                    if (dotProduct < -0.1) {
                        if (this.debug) {
                            print("Transform has sharp turned!");
                        }
                        // Trigger the turn event
                        this.triggerOnTurn();
                    }
                }
            }
        }
        /**
         * Calculate the dot product between two direction vectors.
         * @param newestDirection The newest direction vector
         * @param oldestDirection The oldest direction vector
         * @returns The dot product (negative values indicate sharp turns)
         */
        detectDotProduct(newestDirection, oldestDirection) {
            // Normalize the vectors
            const normalized1 = this.normalizeVector(newestDirection);
            const normalized2 = this.normalizeVector(oldestDirection);
            // Calculate dot product
            return this.dotProduct(normalized1, normalized2);
        }
        /**
         * Calculate the dot product between two vectors.
         */
        dotProduct(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        /**
         * Normalize a vector to unit length.
         */
        normalizeVector(v) {
            const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
            if (length < 0.0001) {
                return new vec3(0, 0, 0);
            }
            return new vec3(v.x / length, v.y / length, v.z / length);
        }
        /**
         * Calculate the distance between two points.
         */
        getDistance(a, b) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dz = b.z - a.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        /**
         * Subtract two vectors.
         */
        subtractVectors(a, b) {
            return new vec3(a.x - b.x, a.y - b.y, a.z - b.z);
        }
        /**
         * Add a listener for the turn event.
         * @param callback The function to call when a sharp turn is detected
         */
        addOnTurnListener(callback) {
            this._onTurn.push(callback);
        }
        /**
         * Remove a listener for the turn event.
         * @param callback The function to remove
         */
        removeOnTurnListener(callback) {
            this._onTurn = this._onTurn.filter(cb => cb !== callback);
        }
        /**
         * Trigger all registered turn callbacks.
         */
        triggerOnTurn() {
            for (const callback of this._onTurn) {
                callback();
            }
        }
    };
    __setFunctionName(_classThis, "SharpTurnTShen");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SharpTurnTShen = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SharpTurnTShen = _classThis;
})();
exports.SharpTurnTShen = SharpTurnTShen;
//# sourceMappingURL=SharpTurnTS.js.map