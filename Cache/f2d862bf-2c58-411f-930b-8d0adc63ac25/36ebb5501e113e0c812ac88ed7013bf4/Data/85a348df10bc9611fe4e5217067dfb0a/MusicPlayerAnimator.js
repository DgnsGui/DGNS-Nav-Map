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
exports.ZToggleAnimator = void 0;
var __selfType = requireType("./MusicPlayerAnimator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// ZToggleAnimator.ts
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const log = new NativeLogger_1.default("[ZToggleAnimator]");
let ZToggleAnimator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var ZToggleAnimator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.targetObject = this.targetObject;
            this.recedeDistance = this.recedeDistance;
            this.duration = this.duration;
            this.handIndex = this.handIndex;
            this.sikScript = this.sikScript;
            this.isReceded = false;
            this.originalZ = 0;
        }
        __initialize() {
            super.__initialize();
            this.targetObject = this.targetObject;
            this.recedeDistance = this.recedeDistance;
            this.duration = this.duration;
            this.handIndex = this.handIndex;
            this.sikScript = this.sikScript;
            this.isReceded = false;
            this.originalZ = 0;
        }
        onAwake() {
            if (!this.targetObject) {
                log.e("targetObject non assigné !");
                return;
            }
            if (!this.sikScript) {
                log.e("SIK Script non assigné ! Glisse le SIK dans l'input.");
                return;
            }
            const transform = this.targetObject.getTransform();
            this.originalZ = transform.getLocalPosition().z;
            // === RÉCUPÉRER LE SIK ===
            const sik = this.sikScript.api;
            if (!sik) {
                log.e("SIK API non disponible. Vérifie le SIK.");
                return;
            }
            const hand = this.handIndex === 0 ? sik.rightHand : sik.leftHand;
            if (!hand) {
                log.e("Main non trouvée. Vérifie handIndex.");
                return;
            }
            // === PINCH ===
            if (hand.onPinch) {
                hand.onPinch.add(() => {
                    log.i("Pinch → toggle");
                    this.toggle();
                });
            }
            // === TAP ===
            if (hand.onTap) {
                hand.onTap.add(() => {
                    log.i("Tap → toggle");
                    this.toggle();
                });
            }
            log.i(`Prêt | Z: ${this.originalZ} | Recul: ${this.recedeDistance}`);
        }
        toggle() {
            log.i(`TOGGLE → ${this.isReceded ? "restaure" : "recule"}`);
            const transform = this.targetObject.getTransform();
            const startPos = transform.getLocalPosition();
            const targetZ = this.isReceded ? this.originalZ : this.originalZ + this.recedeDistance;
            this.isReceded = !this.isReceded;
            (0, animate_1.default)({
                duration: this.duration,
                update: (t) => {
                    const z = MathUtils.lerp(startPos.z, targetZ, t);
                    const pos = new vec3(startPos.x, startPos.y, z);
                    transform.setLocalPosition(pos);
                },
                ended: () => {
                    log.i(`Animation finie → Z = ${targetZ}`);
                }
            });
        }
    };
    __setFunctionName(_classThis, "ZToggleAnimator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZToggleAnimator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZToggleAnimator = _classThis;
})();
exports.ZToggleAnimator = ZToggleAnimator;
//# sourceMappingURL=MusicPlayerAnimator.js.map