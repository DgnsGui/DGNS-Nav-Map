"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMaskScaler_FinalDebug = void 0;
var __selfType = requireType("./MapMaskScaler");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
let MapMaskScaler_FinalDebug = class MapMaskScaler_FinalDebug extends BaseScriptComponent {
    onAwake() {
        print("--- MapMaskScaler_FinalDebug onAwake() CALLED ---");
        this.isInitialized = false;
        const updateEvent = LensConfig_1.LensConfig.getInstance().updateDispatcher.createUpdateEvent("UpdateEvent");
        updateEvent.bind(this.onUpdate.bind(this));
    }
    onUpdate() {
        if (!this.isInitialized) {
            this.tryInitialize();
            return;
        }
        if (!this.containerTransform)
            return;
        const currentScaleX = this.containerTransform.getLocalScale().x;
        const threshold = 0.001;
        if (Math.abs(currentScaleX - this.lastScaleX) > threshold) {
            this.updateMaskRadius(currentScaleX);
            this.lastScaleX = currentScaleX;
        }
    }
    tryInitialize() {
        if (!this.containerFrame || !this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            return;
        }
        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            return;
        }
        this.containerTransform = this.containerFrame.getTransform();
        this.lastScaleX = this.containerTransform.getLocalScale().x;
        this.updateMaskRadius(this.lastScaleX);
        this.isInitialized = true;
        print("--- MapMaskScaler_FinalDebug INITIALIZATION SUCCESSFUL! ---");
    }
    updateMaskRadius(currentScaleX) {
        const scaleFactor = currentScaleX / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        if (this.debugMode) {
            print(`Scale updated: ${currentScaleX.toFixed(3)}. New radius: ${newRadius.toFixed(3)}`);
        }
        this.setMaterialParameterOnAllTiles(newRadius);
    }
    setMaterialParameterOnAllTiles(value) {
        const cells = this.mapComponent.mapController.gridView.getCells();
        for (const cell of cells) {
            if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                try {
                    // *** LA CORRECTION FINALE EST ICI ***
                    cell.imageComponent.mainMaterial.mainPass[this.parameterScriptName] = new vec2(value, value);
                }
                catch (e) {
                    if (this.debugMode) {
                        print("Error setting parameter on a tile material: " + e);
                    }
                }
            }
        }
    }
    __initialize() {
        super.__initialize();
        this.lastScaleX = -1;
        this.isInitialized = false;
    }
};
exports.MapMaskScaler_FinalDebug = MapMaskScaler_FinalDebug;
exports.MapMaskScaler_FinalDebug = MapMaskScaler_FinalDebug = __decorate([
    component
], MapMaskScaler_FinalDebug);
//# sourceMappingURL=MapMaskScaler.js.map