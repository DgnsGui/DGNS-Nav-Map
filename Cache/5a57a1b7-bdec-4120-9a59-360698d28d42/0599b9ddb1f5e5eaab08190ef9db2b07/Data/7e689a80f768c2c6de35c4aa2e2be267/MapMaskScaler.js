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
// MapMaskScaler.ts
// Script pour synchroniser le scaling du mask de la map avec le ContainerFrame
let MapMaskScaler = class MapMaskScaler extends BaseScriptComponent {
    onAwake() {
        if (!this.containerFrame) {
            print("MapMaskScaler: ContainerFrame non assigné!");
            return;
        }
        if (!this.mapTileMaterial) {
            print("MapMaskScaler: MapTile Material non assigné!");
            return;
        }
        // Récupérer le transform du ContainerFrame
        this.transform = this.containerFrame.getTransform();
        // Créer l'event d'update
        this.updateEvent = this.sceneObject.createComponent("ScriptComponent").createEvent("UpdateEvent");
        this.updateEvent.bind(() => this.onUpdate());
        print("MapMaskScaler initialisé avec succès");
    }
    onUpdate() {
        if (!this.containerFrame || !this.mapTileMaterial || !this.transform) {
            return;
        }
        try {
            // Récupérer la scale actuelle du ContainerFrame
            const currentScale = this.transform.getLocalScale();
            // Calculer le facteur de scale (on utilise la composante X comme référence)
            const scaleFactor = currentScale.x / this.baseScale;
            // Calculer la nouvelle valeur du mask radius
            // Plus le ContainerFrame est petit, plus le mask doit être petit aussi
            const newMaskRadius = this.baseMaskRadius * scaleFactor;
            // Appliquer la nouvelle valeur au parameter du shader
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", newMaskRadius);
        }
        catch (error) {
            print("MapMaskScaler Error: " + error);
        }
    }
    // Méthode utilitaire pour définir manuellement le mask radius
    setMaskRadius(radius) {
        try {
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", radius);
        }
        catch (error) {
            print("Erreur lors de la définition du mask radius: " + error);
        }
    }
    // Méthode pour réinitialiser le mask à sa valeur de base
    resetMaskRadius() {
        this.setMaskRadius(this.baseMaskRadius);
    }
};
exports.MapMaskScaler = MapMaskScaler;
exports.MapMaskScaler = MapMaskScaler = __decorate([
    component
], MapMaskScaler);
//# sourceMappingURL=MapMaskScaler.js.map