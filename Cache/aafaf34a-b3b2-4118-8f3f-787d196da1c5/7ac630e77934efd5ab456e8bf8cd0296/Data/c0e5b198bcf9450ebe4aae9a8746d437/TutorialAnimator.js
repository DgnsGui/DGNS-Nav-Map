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
exports.TutorialAnimator = void 0;
var __selfType = requireType("./TutorialAnimator");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
// TutorialAnimator.ts
// VERSION CORRIGÉE – Container caché au départ, animation fluide dès le premier pinch
// Résout le runtime error : vérifie les inputs et initialise correctement
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const TAG = "[TutorialAnimator]";
const log = new NativeLogger_1.default(TAG);
let TutorialAnimator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var TutorialAnimator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.triggerButton = this.triggerButton;
            this.targetObject = this.targetObject;
            this.moveDistanceY = this.moveDistanceY;
            this.moveDistanceZ = this.moveDistanceZ;
            this.hiddenFarZ = this.hiddenFarZ; // Très loin derrière la caméra
            this.animationDuration = this.animationDuration;
            this.easingType = this.easingType;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isVisible = false;
            this.animating = false;
            this.animationProgress = 0;
            this.easingFunctions = {
                linear: (t) => t,
                easeInQuad: (t) => t * t,
                easeOutQuad: (t) => t * (2 - t),
                easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
                easeInCubic: (t) => t * t * t,
                easeOutCubic: (t) => (--t) * t * t + 1,
                easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
                easeOutBack: (t) => {
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                },
            };
        }
        __initialize() {
            super.__initialize();
            this.triggerButton = this.triggerButton;
            this.targetObject = this.targetObject;
            this.moveDistanceY = this.moveDistanceY;
            this.moveDistanceZ = this.moveDistanceZ;
            this.hiddenFarZ = this.hiddenFarZ; // Très loin derrière la caméra
            this.animationDuration = this.animationDuration;
            this.easingType = this.easingType;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isVisible = false;
            this.animating = false;
            this.animationProgress = 0;
            this.easingFunctions = {
                linear: (t) => t,
                easeInQuad: (t) => t * t,
                easeOutQuad: (t) => t * (2 - t),
                easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
                easeInCubic: (t) => t * t * t,
                easeOutCubic: (t) => (--t) * t * t + 1,
                easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
                easeOutBack: (t) => {
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                },
            };
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== TutorialAnimator INITIALISATION ===");
            // Vérification des inputs pour éviter le runtime error
            if (!this.triggerButton) {
                log.e("Trigger Button non assigné ! Assigne-le dans l'Inspector.");
                return;
            }
            if (!this.targetObject) {
                log.e("Target Object non assigné ! Assigne-le dans l'Inspector.");
                return;
            }
            this.targetTransform = this.targetObject.getTransform();
            // Position de base (rentrée)
            this.hiddenPosition = this.targetTransform.getLocalPosition();
            // Position très cachée au départ (hors champ caméra)
            this.farHiddenPosition = new vec3(this.hiddenPosition.x, this.hiddenPosition.y, this.hiddenFarZ);
            // Position visible (sortie)
            this.visiblePosition = new vec3(this.hiddenPosition.x, this.hiddenPosition.y + this.moveDistanceY, this.hiddenPosition.z + this.moveDistanceZ);
            // État initial : caché très loin, mais activé
            this.targetObject.enabled = true;
            this.targetTransform.setLocalPosition(this.farHiddenPosition);
            this.isVisible = false;
            this.animating = false;
            // Abonnement au bouton
            this.triggerButton.onButtonPinched.add(() => {
                this.toggle();
            });
            // Update pour animation
            this.createEvent("UpdateEvent").bind(() => this.updateAnimation());
            if (this.enableDebugLogs)
                log.i("TutorialAnimator prêt – container caché très loin en Z");
        }
        toggle() {
            if (this.animating)
                return;
            if (this.isVisible) {
                this.hide();
            }
            else {
                this.show();
            }
        }
        show() {
            if (this.isVisible || this.animating)
                return;
            // Part de très loin vers visible
            this.animationStartPos = this.farHiddenPosition;
            this.animationEndPos = this.visiblePosition;
            this.animating = true;
            this.animationProgress = 0;
            if (this.enableDebugLogs)
                log.i("Animation APPARITION lancée depuis très loin");
        }
        hide() {
            if (!this.isVisible || this.animating)
                return;
            // Part de visible vers très loin
            this.animationStartPos = this.visiblePosition;
            this.animationEndPos = this.farHiddenPosition;
            this.animating = true;
            this.animationProgress = 0;
            if (this.enableDebugLogs)
                log.i("Animation DISPARITION lancée vers très loin");
        }
        updateAnimation() {
            if (!this.animating)
                return;
            this.animationProgress += getDeltaTime() / this.animationDuration;
            let t = Math.min(this.animationProgress, 1.0);
            const easingFn = this.easingFunctions[this.easingType] || this.easingFunctions.easeInOutCubic;
            t = easingFn(t);
            const newPos = vec3.lerp(this.animationStartPos, this.animationEndPos, t);
            this.targetTransform.setLocalPosition(newPos);
            if (this.animationProgress >= 1.0) {
                this.animating = false;
                this.targetTransform.setLocalPosition(this.animationEndPos);
                if (this.animationEndPos.equal(this.visiblePosition)) {
                    this.isVisible = true;
                    if (this.enableDebugLogs)
                        log.i("Apparition terminée → visible");
                }
                else {
                    this.isVisible = false;
                    if (this.enableDebugLogs)
                        log.i("Disparition terminée → caché très loin");
                }
            }
        }
        reset() {
            this.animating = false;
            this.isVisible = false;
            this.targetTransform.setLocalPosition(this.farHiddenPosition);
        }
        forceShow() {
            this.animating = false;
            this.isVisible = true;
            this.targetTransform.setLocalPosition(this.visiblePosition);
        }
        forceHide() {
            this.animating = false;
            this.isVisible = false;
            this.targetTransform.setLocalPosition(this.farHiddenPosition);
        }
    };
    __setFunctionName(_classThis, "TutorialAnimator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TutorialAnimator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TutorialAnimator = _classThis;
})();
exports.TutorialAnimator = TutorialAnimator;
//# sourceMappingURL=TutorialAnimator.js.map