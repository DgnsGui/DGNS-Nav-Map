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
exports.MapMessageController = void 0;
var __selfType = requireType("./MapMessageController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let MapMessageController = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapMessageController = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
            this.frame = this.frame;
            this.textComponent = this.textComponent;
            this.renderOrder = this.renderOrder;
            this.unsubscribes = [];
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.frame = this.frame;
            this.textComponent = this.textComponent;
            this.renderOrder = this.renderOrder;
            this.unsubscribes = [];
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            // Configure frame render order
            this.frame.renderOrder = this.renderOrder;
            // Subscribe to close button events
            if (this.frame.closeButton) {
                this.unsubscribes.push(this.frame.closeButton.onTriggerUp.add(() => this.handleCloseButtonTriggered()));
            }
            // Subscribe to map component events
            this.mapComponent.subscribeOnNoNearbyPlacesFound(() => this.showMessage("No nearby places found"));
            this.mapComponent.subscribeOnNearbyPlacesFailed(() => this.showMessage("Failed to received nearby places. Please check your internet connection."));
            // Initially hide the frame
            this.handleCloseButtonTriggered();
        }
        /**
         * Display a message in the frame
         * @param message - The message text to display
         */
        showMessage(message) {
            // Enable the frame's scene object
            this.frame.sceneObject.enabled = true;
            // Show the frame visuals
            this.frame.showVisual();
            // Set the message text
            this.textComponent.text = message;
        }
        /**
         * Handle close button triggered event
         */
        handleCloseButtonTriggered() {
            // Hide the frame visuals
            this.frame.hideVisual();
            // Clear the text
            this.textComponent.text = "";
            // Optionally disable the scene object after hide animation completes
            // Use onHideVisual event to ensure animation finishes first
            const hideComplete = this.frame.onHideVisual.add(() => {
                this.frame.sceneObject.enabled = false;
                hideComplete(); // Unsubscribe after first call
            });
        }
        /**
         * Cleanup subscriptions on destroy
         */
        onDestroy() {
            this.unsubscribes.forEach(unsubscribe => unsubscribe());
            this.unsubscribes = [];
        }
    };
    __setFunctionName(_classThis, "MapMessageController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapMessageController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapMessageController = _classThis;
})();
exports.MapMessageController = MapMessageController;
//# sourceMappingURL=MapMessageController.js.map