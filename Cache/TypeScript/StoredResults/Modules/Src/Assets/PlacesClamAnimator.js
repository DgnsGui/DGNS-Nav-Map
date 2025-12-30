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
exports.PlacesClamAnimator = void 0;
var __selfType = requireType("./PlacesClamAnimator");
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
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const TAG = "[PlacesClamAnimator]";
const log = new NativeLogger_1.default(TAG);
let PlacesClamAnimator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PlacesClamAnimator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.placesClamContainer = this.placesClamContainer;
            this.baseVisibleY = this.baseVisibleY;
            this.hiddenOffset = this.hiddenOffset;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.currentAnimation = null;
            this.isAnimating = false;
            this.isVisible = false;
            this.baseHiddenY = 0;
            this.currentVisibleY = 0;
            this.currentHiddenY = 0;
        }
        __initialize() {
            super.__initialize();
            this.placesClamContainer = this.placesClamContainer;
            this.baseVisibleY = this.baseVisibleY;
            this.hiddenOffset = this.hiddenOffset;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.currentAnimation = null;
            this.isAnimating = false;
            this.isVisible = false;
            this.baseHiddenY = 0;
            this.currentVisibleY = 0;
            this.currentHiddenY = 0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== PlacesClamAnimator INITIALIZATION ===");
            if (!this.placesClamContainer) {
                log.e("Places Clam container not assigned!");
                return;
            }
            this.placesTransform = this.placesClamContainer.getTransform();
            this.currentVisibleY = this.baseVisibleY;
            this.baseHiddenY = this.baseVisibleY + this.hiddenOffset;
            this.currentHiddenY = this.baseHiddenY;
            const pos = this.placesTransform.getLocalPosition();
            pos.y = this.currentHiddenY;
            this.placesTransform.setLocalPosition(pos);
            this.placesClamContainer.enabled = false;
            this.isVisible = false;
            if (this.enableDebugLogs)
                log.i("Places container initialized in hidden state.");
        }
        animateIn() {
            if (this.isVisible && !this.isAnimating)
                return;
            if (this.currentAnimation) {
                this.currentAnimation();
                this.currentAnimation = null;
            }
            this.isAnimating = true;
            this.isVisible = true;
            this.placesClamContainer.enabled = true;
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-out-back",
                update: (t) => {
                    const pos = this.placesTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(this.currentHiddenY, this.currentVisibleY, t);
                    this.placesTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isAnimating = false;
                    this.currentAnimation = null;
                }
            });
        }
        animateOut() {
            if (!this.isVisible && !this.isAnimating)
                return;
            if (this.currentAnimation) {
                this.currentAnimation();
                this.currentAnimation = null;
            }
            this.isAnimating = true;
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-in-quad",
                update: (t) => {
                    const pos = this.placesTransform.getLocalPosition();
                    pos.y = MathUtils.lerp(this.currentVisibleY, this.currentHiddenY, t);
                    this.placesTransform.setLocalPosition(pos);
                },
                ended: () => {
                    this.isAnimating = false;
                    this.isVisible = false;
                    this.placesClamContainer.enabled = false;
                    this.currentAnimation = null;
                }
            });
        }
        // Appelé par AIResponseAnimator quand AI s'ouvre ou se ferme
        adjustForAI(isAIVisible) {
            const targetVisibleY = isAIVisible ? this.baseVisibleY * 2 : this.baseVisibleY;
            const targetHiddenY = targetVisibleY + this.hiddenOffset;
            if (targetVisibleY === this.currentVisibleY) {
                return;
            }
            this.currentVisibleY = targetVisibleY;
            this.currentHiddenY = targetHiddenY;
            if (this.isVisible) {
                if (this.currentAnimation) {
                    this.currentAnimation();
                    this.currentAnimation = null;
                }
                this.isAnimating = true;
                const startY = this.placesTransform.getLocalPosition().y;
                const easing = isAIVisible ? "ease-out-back" : "ease-in-quad";
                this.currentAnimation = (0, animate_1.default)({
                    duration: this.animationDuration,
                    easing: easing,
                    update: (t) => {
                        const pos = this.placesTransform.getLocalPosition();
                        pos.y = MathUtils.lerp(startY, this.currentVisibleY, t);
                        this.placesTransform.setLocalPosition(pos);
                    },
                    ended: () => {
                        this.isAnimating = false;
                        this.currentAnimation = null;
                    }
                });
            }
        }
        getIsVisible() {
            return this.isVisible;
        }
        getIsAnimating() {
            return this.isAnimating;
        }
        showImmediate() {
            if (this.currentAnimation) {
                this.currentAnimation();
            }
            const pos = this.placesTransform.getLocalPosition();
            pos.y = this.currentVisibleY;
            this.placesTransform.setLocalPosition(pos);
            this.isVisible = true;
            this.isAnimating = false;
            this.placesClamContainer.enabled = true;
        }
        hideImmediate() {
            if (this.currentAnimation) {
                this.currentAnimation();
            }
            const pos = this.placesTransform.getLocalPosition();
            pos.y = this.currentHiddenY;
            this.placesTransform.setLocalPosition(pos);
            this.isVisible = false;
            this.isAnimating = false;
            this.placesClamContainer.enabled = false;
        }
    };
    __setFunctionName(_classThis, "PlacesClamAnimator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlacesClamAnimator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlacesClamAnimator = _classThis;
})();
exports.PlacesClamAnimator = PlacesClamAnimator;
//# sourceMappingURL=PlacesClamAnimator.js.map