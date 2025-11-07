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
exports.DistanceEventsCallbacks = void 0;
var __selfType = requireType("./DistanceEventsCallbacks");
function component(target) { target.getTypeName = function () { return __selfType; }; }
/**
 * Provides callback functions for DistanceEventsTS.
 * Attach this to objects and set the event functions in DistanceEventsTS to call the functions in this script.
 */
let DistanceEventsCallbacks = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var DistanceEventsCallbacks = _classThis = class extends _classSuper {
        constructor() {
            super();
        }
        __initialize() {
            super.__initialize();
        }
        /**
         * Called when crossing the distance threshold (moving away from target).
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        onDistanceThresholdCrossed() {
            print(`${this.sceneObject.name}: Distance threshold crossed!`);
            // Add your custom logic here
        }
        /**
         * Called when returning back within the distance threshold.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        onReturnWithinThreshold() {
            print(`${this.sceneObject.name}: Returned within distance threshold`);
            // Add your custom logic here
        }
        /**
         * Example of a custom event that can show a UI element.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        showElement() {
            print(`${this.sceneObject.name}: Showing element at distance threshold`);
            // Add your logic to show a UI element or other object
        }
        /**
         * Example of a custom event that can hide a UI element.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        hideElement() {
            print(`${this.sceneObject.name}: Hiding element at distance threshold`);
            // Add your logic to hide a UI element or other object
        }
        /**
         * Example of a custom event that can trigger an animation.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        triggerAnimation() {
            print(`${this.sceneObject.name}: Triggering animation at distance threshold`);
            // Add your logic to trigger an animation
        }
        /**
         * Example of a custom event that can play a sound.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        playSound() {
            print(`${this.sceneObject.name}: Playing sound at distance threshold`);
            // Add your logic to play a sound
        }
        /**
         * Generic callback that can be customized in your scripts.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        onCallback1() {
            print(`${this.sceneObject.name}: Custom callback 1 triggered`);
            // Add your custom logic here
        }
        /**
         * Generic callback that can be customized in your scripts.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        onCallback2() {
            print(`${this.sceneObject.name}: Custom callback 2 triggered`);
            // Add your custom logic here
        }
        /**
         * Generic callback that can be customized in your scripts.
         * Set this function name in the eventFunctions array of DistanceEventsTS.
         */
        onCallback3() {
            print(`${this.sceneObject.name}: Custom callback 3 triggered`);
            // Add your custom logic here
        }
    };
    __setFunctionName(_classThis, "DistanceEventsCallbacks");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DistanceEventsCallbacks = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DistanceEventsCallbacks = _classThis;
})();
exports.DistanceEventsCallbacks = DistanceEventsCallbacks;
//# sourceMappingURL=DistanceEventsCallbacks.js.map