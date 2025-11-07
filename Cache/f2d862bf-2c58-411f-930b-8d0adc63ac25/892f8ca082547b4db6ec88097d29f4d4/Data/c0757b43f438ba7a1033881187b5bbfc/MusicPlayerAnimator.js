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
exports.ZToggleMover = void 0;
var __selfType = requireType("./MusicPlayerAnimator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const TAG = "[ZToggleMover]";
const log = new NativeLogger_1.default(TAG);
let ZToggleMover = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ZToggleMover = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.pinchButton = this.pinchButton;
            this.targetObject = this.targetObject;
            this.basePosition = this.basePosition;
            this.endPosition = this.endPosition;
            this.animationDurationZ = this.animationDurationZ;
            this.animationDurationY = this.animationDurationY;
            this.oscillationAmplitudeZ = this.oscillationAmplitudeZ;
            this.oscillationAmplitudeY = this.oscillationAmplitudeY;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isForward = false;
            // Animation state
            this.animating = false;
            this.animationElapsedZ = 0;
            this.animationElapsedY = 0;
            this.oscillateForward = true;
        }
        __initialize() {
            super.__initialize();
            this.pinchButton = this.pinchButton;
            this.targetObject = this.targetObject;
            this.basePosition = this.basePosition;
            this.endPosition = this.endPosition;
            this.animationDurationZ = this.animationDurationZ;
            this.animationDurationY = this.animationDurationY;
            this.oscillationAmplitudeZ = this.oscillationAmplitudeZ;
            this.oscillationAmplitudeY = this.oscillationAmplitudeY;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isForward = false;
            // Animation state
            this.animating = false;
            this.animationElapsedZ = 0;
            this.animationElapsedY = 0;
            this.oscillateForward = true;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== ZToggleMover INITIALIZATION ===");
            if (!this.pinchButton) {
                log.e("PinchButton non assigné !");
                return;
            }
            if (!this.targetObject) {
                log.e("Target Object non assigné !");
                return;
            }
            this.targetTransform = this.targetObject.getTransform();
            // Place à la position de base au départ
            this.moveToBase(true);
            // Abonne au pinch
            this.pinchButton.onButtonPinched.add(() => {
                this.togglePosition();
            });
            // Ajoute l'update event pour l'animation
            this.createEvent("UpdateEvent").bind((eventData) => this.updateAnimation(eventData));
            if (this.enableDebugLogs)
                log.i("ZToggleMover initialisé avec succès.");
        }
        togglePosition() {
            if (this.animating)
                return; // Ignore si déjà en animation
            this.animationElapsedZ = 0;
            this.animationElapsedY = 0;
            this.animating = true;
            // Alterne le sens de l'oscillation à chaque animation
            this.oscillateForward = !this.oscillateForward;
            if (this.enableDebugLogs)
                log.i(`Animation lancée vers ${this.isForward ? "base" : "fin"}, oscillateForward = ${this.oscillateForward}`);
            this.isForward = !this.isForward;
        }
        updateAnimation(eventData) {
            if (!this.animating)
                return;
            // Animation Z
            this.animationElapsedZ += getDeltaTime();
            let tZ = Math.min(this.animationElapsedZ / this.animationDurationZ, 1.0);
            tZ = tZ * tZ * (3 - 2 * tZ); // ease-in-out
            // Animation Y
            this.animationElapsedY += getDeltaTime();
            let tY = Math.min(this.animationElapsedY / this.animationDurationY, 1.0);
            tY = tY * tY * (3 - 2 * tY); // ease-in-out
            // Interpolation position
            let start = this.isForward ? this.endPosition : this.basePosition;
            let end = this.isForward ? this.basePosition : this.endPosition;
            // Position Z
            let newZ = start.z + (end.z - start.z) * tZ;
            // Oscillation Z
            let oscZStart = this.oscillateForward ? this.oscillationAmplitudeZ : -this.oscillationAmplitudeZ;
            let oscZEnd = -oscZStart;
            let oscZ = oscZStart + (oscZEnd - oscZStart) * tZ;
            // Position Y
            let newY = start.y + (end.y - start.y) * tY;
            // Oscillation Y
            let oscYStart = this.oscillateForward ? this.oscillationAmplitudeY : -this.oscillationAmplitudeY;
            let oscYEnd = -oscYStart;
            let oscY = oscYStart + (oscYEnd - oscYStart) * tY;
            // Position X (toujours interpolée)
            let newX = start.x + (end.x - start.x) * tZ;
            // Applique la position avec oscillations
            this.targetTransform.setLocalPosition(new vec3(newX, newY + oscY, newZ + oscZ));
            if (tZ >= 1.0 && tY >= 1.0) {
                this.animating = false;
                if (this.enableDebugLogs)
                    log.i(`Animation terminée à X = ${newX}, Y = ${newY + oscY}, Z = ${newZ + oscZ}`);
            }
        }
        // Méthodes publiques utiles (optionnelles)
        moveToBase(logIt = false) {
            this.targetTransform.setLocalPosition(this.basePosition);
            if (logIt && this.enableDebugLogs)
                log.i(`Retour à la position de base : ${this.basePosition}`);
        }
        moveToEnd(logIt = false) {
            this.targetTransform.setLocalPosition(this.endPosition);
            if (logIt && this.enableDebugLogs)
                log.i(`Déplacé à la position de fin : ${this.endPosition}`);
        }
    };
    __setFunctionName(_classThis, "ZToggleMover");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZToggleMover = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZToggleMover = _classThis;
})();
exports.ZToggleMover = ZToggleMover;
//# sourceMappingURL=MusicPlayerAnimator.js.map