"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMaskScaler = void 0;
var __selfType = requireType("./MapMaskScaler");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const LensConfig_1 = require("SpectaclesInteractionKit.lspkg/Utils/LensConfig");
let MapMaskScaler = class MapMaskScaler extends BaseScriptComponent {
    onAwake() {
        if (!this.initializeScript()) {
            print("ERREUR: MapMaskScaler n'a pas pu s'initialiser. Vérifiez les connexions dans l'Inspector.");
            return;
        }
        // Utiliser l'UpdateEvent pour monitorer les changements
        const updateEvent = this.updateDispatcher.createUpdateEvent("UpdateEvent");
        updateEvent.bind(this.onUpdate.bind(this));
        if (this.debugMode) {
            print("MapMaskScaler initialisé et prêt.");
        }
    }
    initializeScript() {
        if (!this.containerFrame) {
            print("ERREUR: ContainerFrame non assigné sur MapMaskScaler!");
            return false;
        }
        if (!this.mapComponent || !this.mapComponent.mapController) {
            print("ERREUR: MapComponent non assigné ou non initialisé sur MapMaskScaler!");
            return false;
        }
        this.containerTransform = this.containerFrame.getTransform();
        this.lastScaleX = this.containerTransform.getLocalScale().x;
        this.isInitialized = true;
        return true;
    }
    onUpdate() {
        if (!this.isInitialized || !this.containerTransform)
            return;
        const currentScaleX = this.containerTransform.getLocalScale().x;
        const threshold = 0.001;
        // Vérifier si le scale a changé de manière significative
        if (Math.abs(currentScaleX - this.lastScaleX) > threshold) {
            this.updateMaskRadius(currentScaleX);
            this.lastScaleX = currentScaleX;
        }
    }
    updateMaskRadius(currentScaleX) {
        // Calcule le nouveau radius basé sur le ratio du scale actuel par rapport au scale de base
        const scaleFactor = currentScaleX / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        if (this.debugMode) {
            print(`Scale changé: ${currentScaleX.toFixed(3)}. Nouveau radius: ${newRadius.toFixed(3)}`);
        }
        this.setMaterialParameterOnAllTiles(newRadius);
    }
    setMaterialParameterOnAllTiles(value) {
        // S'assurer que le mapController et le gridView sont prêts
        if (!this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            return;
        }
        // Récupérer toutes les cellules (tuiles) actives
        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0 && this.debugMode) {
            print("Attention: Aucune cellule de carte trouvée à mettre à jour.");
        }
        // Appliquer le nouveau radius à chaque tuile
        for (const cell of cells) {
            if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                try {
                    cell.imageComponent.mainMaterial.mainPass.setParameter(this.parameterScriptName, value);
                }
                catch (e) {
                    if (this.debugMode) {
                        print("Erreur en mettant à jour le paramètre sur une tuile: " + e);
                    }
                }
            }
        }
    }
    __initialize() {
        super.__initialize();
        this.lastScaleX = -1;
        this.isInitialized = false;
        this.updateDispatcher = LensConfig_1.LensConfig.getInstance().updateDispatcher;
    }
};
exports.MapMaskScaler = MapMaskScaler;
exports.MapMaskScaler = MapMaskScaler = __decorate([
    component
], MapMaskScaler);
//# sourceMappingURL=MapMaskScaler.js.map