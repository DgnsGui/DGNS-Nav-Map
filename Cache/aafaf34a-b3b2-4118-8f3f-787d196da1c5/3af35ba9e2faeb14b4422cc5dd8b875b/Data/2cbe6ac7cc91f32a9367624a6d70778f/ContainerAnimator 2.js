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
exports.YZToggleMover = void 0;
var __selfType = requireType("./ContainerAnimator 2");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const TAG = "[YZToggleMover]";
const log = new NativeLogger_1.default(TAG);
let YZToggleMover = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var YZToggleMover = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.pinchButton = this.pinchButton;
            this.targetObject = this.targetObject;
            this.moveDistanceY = this.moveDistanceY;
            this.moveDistanceZ = this.moveDistanceZ;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.initialY = 0;
            this.initialZ = 0;
            this.isOut = false; // false = rentré, true = sorti
            // Animation state
            this.animating = false;
            this.animationStartY = 0;
            this.animationStartZ = 0;
            this.animationEndY = 0;
            this.animationEndZ = 0;
            this.animationElapsed = 0;
        }
        __initialize() {
            super.__initialize();
            this.pinchButton = this.pinchButton;
            this.targetObject = this.targetObject;
            this.moveDistanceY = this.moveDistanceY;
            this.moveDistanceZ = this.moveDistanceZ;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.initialY = 0;
            this.initialZ = 0;
            this.isOut = false; // false = rentré, true = sorti
            // Animation state
            this.animating = false;
            this.animationStartY = 0;
            this.animationStartZ = 0;
            this.animationEndY = 0;
            this.animationEndZ = 0;
            this.animationElapsed = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== YZToggleMover INITIALIZATION ===");
            if (!this.pinchButton) {
                log.e("PinchButton non assigné !");
                return;
            }
            if (!this.targetObject) {
                log.e("Target Object non assigné !");
                return;
            }
            this.targetTransform = this.targetObject.getTransform();
            const initialPos = this.targetTransform.getLocalPosition();
            this.initialY = initialPos.y;
            this.initialZ = initialPos.z;
            // Position de base = rentrée (position initiale)
            this.moveToInitial(true);
            // Abonne au pinch
            this.pinchButton.onButtonPinched.add(() => {
                this.togglePosition();
            });
            // Ajoute l'update event pour l'animation
            this.createEvent("UpdateEvent").bind((eventData) => this.updateAnimation(eventData));
            if (this.enableDebugLogs)
                log.i("YZToggleMover initialisé avec succès.");
        }
        togglePosition() {
            if (this.animating)
                return; // Ignore si déjà en animation
            const currentPos = this.targetTransform.getLocalPosition();
            this.animationStartY = currentPos.y;
            this.animationStartZ = currentPos.z;
            if (this.isOut) {
                // Rentrer : retour à la position initiale
                this.animationEndY = this.initialY;
                this.animationEndZ = this.initialZ;
            }
            else {
                // Sortir : déplacement vers Y- et Z+
                this.animationEndY = this.initialY + this.moveDistanceY;
                this.animationEndZ = this.initialZ + this.moveDistanceZ;
            }
            this.animationElapsed = 0;
            this.animating = true;
            if (this.enableDebugLogs) {
                log.i(`Animation ${this.isOut ? 'rentrée' : 'sortie'} vers Y = ${this.animationEndY}, Z = ${this.animationEndZ}`);
            }
            this.isOut = !this.isOut;
        }
        updateAnimation(eventData) {
            if (!this.animating)
                return;
            this.animationElapsed += getDeltaTime();
            let t = Math.min(this.animationElapsed / this.animationDuration, 1.0);
            // Ease-in-out
            t = t * t * (3 - 2 * t);
            const newY = this.animationStartY + (this.animationEndY - this.animationStartY) * t;
            const newZ = this.animationStartZ + (this.animationEndZ - this.animationStartZ) * t;
            const pos = this.targetTransform.getLocalPosition();
            pos.y = newY;
            pos.z = newZ;
            this.targetTransform.setLocalPosition(pos);
            if (t >= 1.0) {
                this.animating = false;
                if (this.enableDebugLogs) {
                    log.i(`Animation terminée à Y = ${newY}, Z = ${newZ}`);
                }
            }
        }
        // Méthodes publiques utiles (optionnelles)
        resetToInitial() {
            this.moveToInitial(false);
            this.isOut = false;
        }
        forceOut() {
            this.moveToTarget(false);
            this.isOut = true;
        }
        // Déplacement instantané (pour reset/force)
        moveToInitial(logIt = false) {
            const pos = this.targetTransform.getLocalPosition();
            pos.y = this.initialY;
            pos.z = this.initialZ;
            this.targetTransform.setLocalPosition(pos);
            if (logIt && this.enableDebugLogs) {
                log.i(`Position rentrée : Y = ${this.initialY}, Z = ${this.initialZ}`);
            }
        }
        moveToTarget(logIt = false) {
            const pos = this.targetTransform.getLocalPosition();
            pos.y = this.initialY + this.moveDistanceY;
            pos.z = this.initialZ + this.moveDistanceZ;
            this.targetTransform.setLocalPosition(pos);
            if (logIt && this.enableDebugLogs) {
                log.i(`Position sortie : Y = ${pos.y}, Z = ${pos.z}`);
            }
        }
    };
    __setFunctionName(_classThis, "YZToggleMover");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YZToggleMover = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YZToggleMover = _classThis;
})();
exports.YZToggleMover = YZToggleMover;
//# sourceMappingURL=ContainerAnimator%202.js.map