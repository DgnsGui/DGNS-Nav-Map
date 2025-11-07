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
exports.AIResponseAnimator = void 0;
var __selfType = requireType("./AIFrameAnimator");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const animate_1 = require("SpectaclesInteractionKit.lspkg/Utils/animate");
const TAG = "[AIResponseAnimator]";
const log = new NativeLogger_1.default(TAG);
let AIResponseAnimator = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var AIResponseAnimator = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.responseContainer = this.responseContainer;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isAnimating = false;
            this.currentAnimation = null;
            this.isVisible = false;
            this.frameComponent = null;
        }
        __initialize() {
            super.__initialize();
            this.responseContainer = this.responseContainer;
            this.hiddenPositionY = this.hiddenPositionY;
            this.visiblePositionY = this.visiblePositionY;
            this.animationDuration = this.animationDuration;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isAnimating = false;
            this.currentAnimation = null;
            this.isVisible = false;
            this.frameComponent = null;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== AIResponseAnimator INITIALIZATION ===");
            if (!this.responseContainer) {
                log.e("Response container not assigned!");
                return;
            }
            this.responseTransform = this.responseContainer.getTransform();
            // Set initial position (hidden)
            const initialPos = this.responseTransform.getLocalPosition();
            initialPos.y = this.hiddenPositionY;
            this.responseTransform.setLocalPosition(initialPos);
            // Hide the container initially
            this.responseContainer.enabled = false;
            this.isVisible = false;
            if (this.enableDebugLogs)
                log.i("Initial position set to hidden, container disabled.");
            // Chercher le composant Frame sur le responseContainer
            this.frameComponent = this.findFrameComponent(this.responseContainer);
            if (this.frameComponent) {
                if (this.enableDebugLogs)
                    log.i("✅ Frame component found on AI Clam!");
                // Vérifier si le close button est activé
                if (this.frameComponent.showCloseButton) {
                    if (this.enableDebugLogs)
                        log.i("Close button is enabled, connecting event...");
                    // Connecter l'événement du close button
                    const closeButton = this.frameComponent.closeButton;
                    if (closeButton) {
                        closeButton.onButtonPinched.add(() => {
                            if (this.enableDebugLogs)
                                log.i("🔴 CLOSE BUTTON PINCHED!");
                            this.handleCloseButton();
                        });
                        closeButton.onTriggerEnd.add(() => {
                            if (this.enableDebugLogs)
                                log.i("🔴 CLOSE BUTTON TRIGGER END!");
                            this.handleCloseButton();
                        });
                        if (this.enableDebugLogs)
                            log.i("✅ Close button events connected!");
                    }
                    else {
                        log.w("closeButton property exists but is null");
                    }
                }
                else {
                    log.w("Show Close Button is not enabled on Frame! Enable it in the Inspector.");
                }
            }
            else {
                log.w("Frame component not found on responseContainer");
            }
            if (this.enableDebugLogs)
                log.i("=== AIResponseAnimator initialized successfully ===");
        }
        /**
         * Cherche le composant Frame sur un SceneObject
         */
        findFrameComponent(sceneObject) {
            if (!sceneObject)
                return null;
            const componentCount = sceneObject.getComponentCount("Component.ScriptComponent");
            if (this.enableDebugLogs)
                log.i(`Searching through ${componentCount} script components...`);
            for (let i = 0; i < componentCount; i++) {
                const component = sceneObject.getComponentByIndex("Component.ScriptComponent", i);
                if (component) {
                    const typeName = component.getTypeName();
                    if (this.enableDebugLogs)
                        log.i(`Found component: ${typeName}`);
                    // Vérifier si c'est un Frame en testant plusieurs propriétés
                    if ("closeButton" in component && "showCloseButton" in component) {
                        if (this.enableDebugLogs)
                            log.i("✅ This is a Frame component!");
                        return component;
                    }
                }
            }
            if (this.enableDebugLogs)
                log.w("Frame component not found");
            return null;
        }
        /**
         * Méthode appelée quand le bouton close est cliqué
         */
        handleCloseButton() {
            if (this.enableDebugLogs)
                log.i("========================================");
            if (this.enableDebugLogs)
                log.i("handleCloseButton() called - CLOSING AI RESPONSE");
            if (this.enableDebugLogs)
                log.i("========================================");
            // Déclencher l'animation de fermeture
            this.animateOut();
        }
        /**
         * Animate the response container sliding in (upward)
         */
        animateIn() {
            if (this.isVisible && !this.isAnimating) {
                if (this.enableDebugLogs)
                    log.i("Container already visible and not animating, skipping animateIn.");
                return;
            }
            if (this.isAnimating) {
                if (this.enableDebugLogs)
                    log.w("Already animating, cancelling previous animation for animateIn...");
                if (this.currentAnimation) {
                    this.currentAnimation();
                }
            }
            if (this.enableDebugLogs)
                log.i("🎬 Starting slide IN animation");
            this.isAnimating = true;
            this.isVisible = true;
            this.responseContainer.enabled = true;
            const targetY = this.visiblePositionY;
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-out-back",
                update: (t) => {
                    const currentPos = this.responseTransform.getLocalPosition();
                    currentPos.y = MathUtils.lerp(this.hiddenPositionY, targetY, t);
                    this.responseTransform.setLocalPosition(currentPos);
                },
                ended: () => {
                    if (this.enableDebugLogs)
                        log.i("✅ Slide IN animation complete");
                    this.isAnimating = false;
                    this.currentAnimation = null;
                }
            });
        }
        /**
         * Animate the response container sliding out (downward)
         */
        animateOut() {
            if (this.enableDebugLogs)
                log.i("========================================");
            if (this.enableDebugLogs)
                log.i("🎬 animateOut() called");
            if (this.enableDebugLogs)
                log.i(`Current state - isVisible: ${this.isVisible}, isAnimating: ${this.isAnimating}, container.enabled: ${this.responseContainer.enabled}`);
            // Si déjà complètement caché, ne rien faire
            if (!this.isVisible && !this.isAnimating && !this.responseContainer.enabled) {
                if (this.enableDebugLogs)
                    log.i("Container already fully hidden, skipping animation.");
                if (this.enableDebugLogs)
                    log.i("========================================");
                return;
            }
            // Annuler toute animation en cours
            if (this.isAnimating) {
                if (this.enableDebugLogs)
                    log.w("Cancelling previous animation...");
                if (this.currentAnimation) {
                    this.currentAnimation();
                }
            }
            if (this.enableDebugLogs)
                log.i("🎬 Starting slide OUT animation");
            this.isAnimating = true;
            const startPos = this.responseTransform.getLocalPosition();
            const targetY = this.hiddenPositionY;
            if (this.enableDebugLogs)
                log.i(`Animating from Y=${startPos.y.toFixed(2)} to Y=${targetY.toFixed(2)}`);
            this.currentAnimation = (0, animate_1.default)({
                duration: this.animationDuration,
                easing: "ease-in-quad",
                update: (t) => {
                    const currentPos = this.responseTransform.getLocalPosition();
                    currentPos.y = MathUtils.lerp(startPos.y, targetY, t);
                    this.responseTransform.setLocalPosition(currentPos);
                },
                ended: () => {
                    if (this.enableDebugLogs)
                        log.i("✅ Slide OUT animation complete");
                    this.isAnimating = false;
                    this.isVisible = false;
                    this.responseContainer.enabled = false;
                    this.currentAnimation = null;
                    if (this.enableDebugLogs)
                        log.i("Container disabled and hidden");
                    if (this.enableDebugLogs)
                        log.i("========================================");
                }
            });
        }
        /**
         * Force show the response (instant, no animation)
         */
        showImmediate() {
            if (this.currentAnimation) {
                this.currentAnimation();
                this.currentAnimation = null;
            }
            const pos = this.responseTransform.getLocalPosition();
            pos.y = this.visiblePositionY;
            this.responseTransform.setLocalPosition(pos);
            this.isVisible = true;
            this.isAnimating = false;
            this.responseContainer.enabled = true;
            if (this.enableDebugLogs)
                log.i("Response shown immediately");
        }
        /**
         * Force hide the response (instant, no animation)
         */
        hideImmediate() {
            if (this.currentAnimation) {
                this.currentAnimation();
                this.currentAnimation = null;
            }
            const pos = this.responseTransform.getLocalPosition();
            pos.y = this.hiddenPositionY;
            this.responseTransform.setLocalPosition(pos);
            this.isVisible = false;
            this.isAnimating = false;
            this.responseContainer.enabled = false;
            if (this.enableDebugLogs)
                log.i("Response hidden immediately");
        }
        /**
         * Check if currently animating
         */
        getIsAnimating() {
            return this.isAnimating;
        }
        /**
         * Check if currently visible
         */
        getIsVisible() {
            return this.isVisible;
        }
    };
    __setFunctionName(_classThis, "AIResponseAnimator");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AIResponseAnimator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AIResponseAnimator = _classThis;
})();
exports.AIResponseAnimator = AIResponseAnimator;
//# sourceMappingURL=AIFrameAnimator.js.map