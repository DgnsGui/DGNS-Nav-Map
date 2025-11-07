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
exports.Example = void 0;
var __selfType = requireType("./ExampleTS");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const InteractionHintController_1 = require("./InteractionHintController");
let Example = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var Example = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.interactionHintController = this.interactionHintController;
            this.demoOption = this.demoOption;
        }
        __initialize() {
            super.__initialize();
            this.interactionHintController = this.interactionHintController;
            this.demoOption = this.demoOption;
        }
        onAwake() {
            switch (this.demoOption) {
                case 0:
                    //play a single animation
                    this.interactionHintController.playHintAnimation(InteractionHintController_1.HandMode.Both, InteractionHintController_1.HandAnimationsLibrary.Both.SystemTapExit, 2, 0.8);
                    this.interactionHintController.animationEndEvent.bind(() => {
                        this.interactionHintController.playHintAnimation(InteractionHintController_1.HandMode.Left, InteractionHintController_1.HandAnimationsLibrary.Left.PinchMoveY, 3);
                    });
                    break;
                case 1:
                    //play sequence
                    var sequence = [];
                    var itemA = new InteractionHintController_1.HandAnimationClipInfo(InteractionHintController_1.HandMode.Left, InteractionHintController_1.HandAnimationsLibrary.Left.PalmGrabY, new vec3(10, 0, 0));
                    var itemB = new InteractionHintController_1.HandAnimationClipInfo(InteractionHintController_1.HandMode.Right, InteractionHintController_1.HandAnimationsLibrary.Right.PalmGrabX);
                    sequence.push(itemA);
                    sequence.push(itemB);
                    this.interactionHintController.playHintAnimationSequence(sequence, 2);
                    this.interactionHintController.animationEndEvent.bind(() => {
                        print("Sequence looping completed");
                    });
                    break;
            }
        }
    };
    __setFunctionName(_classThis, "Example");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Example = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Example = _classThis;
})();
exports.Example = Example;
//# sourceMappingURL=ExampleTS.js.map