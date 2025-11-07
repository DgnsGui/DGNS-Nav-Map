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
exports.DistanceRange = exports.DistanceEventsTS = void 0;
var __selfType = requireType("./DistanceEventsTS");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Exposes distance-based events.
 */
let DistanceEventsTS = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var DistanceEventsTS = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.target = this.target;
            this.distances = this.distances;
            this.events = this.events;
            this.eventFunctions = this.eventFunctions;
            this.triggerOnGreaterThan = this.triggerOnGreaterThan;
            this._ranges = [];
            this._distanceToTarget = 0;
            this._triggeredDistances = new Set();
        }
        __initialize() {
            super.__initialize();
            this.target = this.target;
            this.distances = this.distances;
            this.events = this.events;
            this.eventFunctions = this.eventFunctions;
            this.triggerOnGreaterThan = this.triggerOnGreaterThan;
            this._ranges = [];
            this._distanceToTarget = 0;
            this._triggeredDistances = new Set();
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
                print("No target set for DistanceEvents - please set a target object");
                return;
            }
            // Setup the distance/event pairs from inspector values
            this.setupDistanceEvents();
        }
        /**
         * Sets up distance events based on inspector values
         *
         * How to use:
         * 1. Add distances to the "distances" array (e.g., 1, 2, 3 for 1m, 2m, 3m thresholds)
         * 2. For each distance, add a corresponding script component (like DistanceEventsCallbacks) to the "events" array
         * 3. For each script component, add the function name you want to call (e.g., "onDistanceThresholdCrossed") to the "eventFunctions" array
         */
        setupDistanceEvents() {
            // Clear any existing ranges
            this.clearRanges();
            // Validate that we have matching arrays
            if (this.distances.length === 0) {
                print("No distances defined for DistanceEvents");
                return;
            }
            if (this.distances.length !== this.events.length || this.events.length !== this.eventFunctions.length) {
                print("Error in DistanceEvents: Distances, events, and eventFunctions arrays must have the same length");
                return;
            }
            // Create a range for each distance/event pair
            for (let i = 0; i < this.distances.length; i++) {
                const distance = this.distances[i];
                const eventScript = this.events[i];
                const functionName = this.eventFunctions[i];
                if (!eventScript || !functionName) {
                    print(`Warning: Missing event script or function name for distance ${distance}`);
                    continue;
                }
                // Create a threshold check range
                // If triggerOnGreaterThan is true, trigger when distance > threshold
                // Otherwise, trigger when distance < threshold
                const minDistance = this.triggerOnGreaterThan ? distance : 0;
                const maxDistance = this.triggerOnGreaterThan ? Number.MAX_VALUE : distance;
                const range = this.addRange(minDistance, maxDistance);
                // Add event listener
                range.addOnEnterRangeListener(() => {
                    // Only trigger if we haven't triggered for this distance yet
                    if (!this._triggeredDistances.has(distance)) {
                        this._triggeredDistances.add(distance);
                        // Call the event function
                        if (eventScript && eventScript[functionName]) {
                            eventScript[functionName]();
                        }
                    }
                });
                // Add exit listener to reset trigger state when leaving the range
                range.addOnExitRangeListener(() => {
                    this._triggeredDistances.delete(distance);
                });
            }
        }
        onUpdate() {
            if (!this.target)
                return;
            const myPosition = this.sceneObject.getTransform().getWorldPosition();
            const targetPosition = this.target.getTransform().getWorldPosition();
            // Calculate distance manually 
            const dx = targetPosition.x - myPosition.x;
            const dy = targetPosition.y - myPosition.y;
            const dz = targetPosition.z - myPosition.z;
            this._distanceToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);
            // Update all ranges
            for (const range of this._ranges) {
                range.update(this._distanceToTarget);
            }
        }
        /**
         * Reset all triggered distances, allowing them to trigger again
         */
        resetTriggeredDistances() {
            this._triggeredDistances.clear();
        }
        /**
         * Add a distance range with associated events.
         * @param minDistance The minimum distance for the range
         * @param maxDistance The maximum distance for the range
         * @returns The created DistanceRange object for event binding
         */
        addRange(minDistance, maxDistance) {
            const range = new DistanceRange(minDistance, maxDistance);
            this._ranges.push(range);
            return range;
        }
        /**
         * Clear all registered distance ranges.
         */
        clearRanges() {
            this._ranges = [];
        }
        /**
         * Get the current distance to the target.
         */
        getDistanceToTarget() {
            return this._distanceToTarget;
        }
    };
    __setFunctionName(_classThis, "DistanceEventsTS");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DistanceEventsTS = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DistanceEventsTS = _classThis;
})();
exports.DistanceEventsTS = DistanceEventsTS;
/**
 * Represents a range of distances with associated events.
 */
class DistanceRange {
    constructor(minDistance, maxDistance) {
        this._insideRange = false;
        this._wasInsideRange = false;
        // Events
        this._onEnterRange = [];
        this._onPercentInsideRange = [];
        this._onExitRange = [];
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
    }
    /**
     * Update the range status based on a new distance.
     * @param distance The current distance to check against the range
     */
    update(distance) {
        this._insideRange = (distance >= this.minDistance && distance <= this.maxDistance);
        // Trigger enter range event
        if (this._insideRange && !this._wasInsideRange) {
            this.triggerOnEnterRange();
        }
        // Trigger percent inside range event if inside the range
        if (this._insideRange) {
            // Calculate the percentage (0-1) of how far into the range we are
            // 0 = at max distance (edge of range), 1 = at min distance (deepest in range)
            const percent = Math.max(0, Math.min(1, (this.maxDistance - distance) / (this.maxDistance - this.minDistance)));
            this.triggerOnPercentInsideRange(percent);
        }
        // Trigger exit range event
        if (!this._insideRange && this._wasInsideRange) {
            this.triggerOnExitRange();
        }
        this._wasInsideRange = this._insideRange;
    }
    /**
     * Add a listener for when entering the distance range.
     * @param callback The function to call when entering the range
     */
    addOnEnterRangeListener(callback) {
        this._onEnterRange.push(callback);
    }
    /**
     * Add a listener for the percentage inside the distance range.
     * @param callback The function to call with the percentage (0-1)
     */
    addOnPercentInsideRangeListener(callback) {
        this._onPercentInsideRange.push(callback);
    }
    /**
     * Add a listener for when exiting the distance range.
     * @param callback The function to call when exiting the range
     */
    addOnExitRangeListener(callback) {
        this._onExitRange.push(callback);
    }
    /**
     * Remove a listener for when entering the distance range.
     * @param callback The function to remove
     */
    removeOnEnterRangeListener(callback) {
        this._onEnterRange = this._onEnterRange.filter(cb => cb !== callback);
    }
    /**
     * Remove a listener for the percentage inside the distance range.
     * @param callback The function to remove
     */
    removeOnPercentInsideRangeListener(callback) {
        this._onPercentInsideRange = this._onPercentInsideRange.filter(cb => cb !== callback);
    }
    /**
     * Remove a listener for when exiting the distance range.
     * @param callback The function to remove
     */
    removeOnExitRangeListener(callback) {
        this._onExitRange = this._onExitRange.filter(cb => cb !== callback);
    }
    /**
     * Trigger all registered enter range callbacks.
     */
    triggerOnEnterRange() {
        for (const callback of this._onEnterRange) {
            callback();
        }
    }
    /**
     * Trigger all registered percent inside range callbacks.
     * @param percent The percentage (0-1) inside the range
     */
    triggerOnPercentInsideRange(percent) {
        for (const callback of this._onPercentInsideRange) {
            callback(percent);
        }
    }
    /**
     * Trigger all registered exit range callbacks.
     */
    triggerOnExitRange() {
        for (const callback of this._onExitRange) {
            callback();
        }
    }
}
exports.DistanceRange = DistanceRange;
//# sourceMappingURL=DistanceEventsTS.js.map