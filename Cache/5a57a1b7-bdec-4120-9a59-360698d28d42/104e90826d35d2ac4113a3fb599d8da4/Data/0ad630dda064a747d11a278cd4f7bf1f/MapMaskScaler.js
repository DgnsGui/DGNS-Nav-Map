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
exports.MapMaskScaler = void 0;
var __selfType = requireType("./MapMaskScaler");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let MapMaskScaler = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var MapMaskScaler = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.containerFrameScript = this.containerFrameScript;
            this.mapComponent = this.mapComponent;
            this.parameterScriptName = this.parameterScriptName;
            this.baseInnerWidth = this.baseInnerWidth;
            this.debugMode = this.debugMode;
            this.isInitialized = false;
        }
        __initialize() {
            super.__initialize();
            this.containerFrameScript = this.containerFrameScript;
            this.mapComponent = this.mapComponent;
            this.parameterScriptName = this.parameterScriptName;
            this.baseInnerWidth = this.baseInnerWidth;
            this.debugMode = this.debugMode;
            this.isInitialized = false;
        }
        onAwake() {
            if (this.debugMode)
                print("MapMaskScaler: onAwake() appelé.");
            this.updateEvent = this.createEvent("UpdateEvent");
            this.updateEvent.bind(this.onUpdate.bind(this));
        }
        onUpdate() {
            if (this.isInitialized) {
                this.updateEvent.enabled = false;
                return;
            }
            if (this.debugMode)
                print("MapMaskScaler: Tentative d'initialisation...");
            if (!this.containerFrameScript) {
                if (this.debugMode)
                    print("MapMaskScaler: -> ÉCHEC: containerFrameScript n'est pas encore assigné.");
                return;
            }
            if (!this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
                if (this.debugMode)
                    print("MapMaskScaler: -> ÉCHEC: mapComponent ou son controller/gridView ne sont pas encore prêts.");
                return;
            }
            const cells = this.mapComponent.mapController.gridView.getCells();
            if (cells.length === 0) {
                if (this.debugMode)
                    print("MapMaskScaler: -> ÉCHEC: La carte a 0 cellules créées pour le moment.");
                return;
            }
            this.isInitialized = true;
            this.containerFrameScript.onScalingUpdateEvent.add(this.handleContainerResize.bind(this));
            this.handleContainerResize();
            if (this.debugMode) {
                print("--- MapMaskScaler INITIALISATION RÉUSSIE! En écoute des événements de redimensionnement. ---");
            }
        }
        handleContainerResize() {
            if (!this.isInitialized)
                return;
            const currentInnerSize = this.containerFrameScript.innerSize;
            const scaleFactor = currentInnerSize.x / this.baseInnerWidth;
            const newRadius = 1.0 / scaleFactor;
            if (this.debugMode) {
                print(`MapMaskScaler: handleContainerResize déclenché! Nouveau radius: ${newRadius.toFixed(3)}`);
            }
            this.setMaterialParameterOnAllTiles(newRadius);
        }
        setMaterialParameterOnAllTiles(value) {
            const cells = this.mapComponent.mapController.gridView.getCells();
            for (const cell of cells) {
                if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                    try {
                        cell.imageComponent.mainMaterial.mainPass[this.parameterScriptName] = value;
                    }
                    catch (e) {
                        if (this.debugMode) {
                            print("MapMaskScaler: Erreur en appliquant le paramètre au matériau: " + e);
                        }
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "MapMaskScaler");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MapMaskScaler = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MapMaskScaler = _classThis;
})();
exports.MapMaskScaler = MapMaskScaler;
//# sourceMappingURL=MapMaskScaler.js.map