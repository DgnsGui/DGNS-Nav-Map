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
        print("=== MapMaskScaler Debug ===");
        if (!this.containerFrame) {
            print("ERREUR: ContainerFrame non assigné!");
            return;
        }
        if (!this.mapTileMaterial) {
            print("ERREUR: MapTile Material non assigné!");
            return;
        }
        // Récupérer le transform du ContainerFrame
        this.transform = this.containerFrame.getTransform();
        this.lastScale = this.transform.getLocalScale();
        print("Container Frame: " + this.containerFrame.name);
        print("Material: " + this.mapTileMaterial.name);
        print("Scale initiale: " + this.lastScale.toString());
        // Test initial - appliquer le testRadius
        this.applyMaskRadius(this.testRadius);
        print("MapMaskScaler initialisé");
    }
    onStart() {
        // Créer l'update event de façon plus simple
        const updateEvent = this.sceneObject.createComponent("Component.ScriptComponent");
        print("Update event créé");
    }
    // Méthode appelée manuellement pour tester
    applyMaskRadius(radius) {
        try {
            print("Tentative d'application du radius: " + radius);
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", radius);
            print("Radius appliqué avec succès: " + radius);
        }
        catch (error) {
            print("ERREUR lors de l'application du radius: " + error);
            // Essayons d'autres noms possibles pour le paramètre
            try {
                this.mapTileMaterial.mainPass.setParameter("maskRadius", radius);
                print("Radius appliqué avec 'maskRadius': " + radius);
            }
            catch (e2) {
                print("Échec avec 'maskRadius': " + e2);
                // Listons tous les paramètres disponibles
                print("Paramètres disponibles dans le material:");
                const passCount = this.mapTileMaterial.getPassCount();
                for (let i = 0; i < passCount; i++) {
                    const pass = this.mapTileMaterial.getPass(i);
                    print("Pass " + i + ": " + pass.name);
                }
            }
        }
    }
    // Méthode publique pour tester manuellement
    testMaskChange() {
        print("=== TEST MASK CHANGE ===");
        this.applyMaskRadius(this.testRadius);
    }
    // Version simplifiée de l'update qui se concentre sur la détection de changement
    checkScaleChange() {
        if (!this.transform)
            return;
        const currentScale = this.transform.getLocalScale();
        // Vérifier si la scale a changé
        if (!currentScale.equal(this.lastScale)) {
            print("Scale changée de " + this.lastScale.toString() + " à " + currentScale.toString());
            // Calculer le nouveau radius
            const scaleFactor = currentScale.x / this.baseScale;
            const newRadius = this.baseMaskRadius * scaleFactor;
            print("Nouveau radius calculé: " + newRadius);
            this.applyMaskRadius(newRadius);
            this.lastScale = currentScale;
        }
    }
    // Méthodes utilitaires pour debug
    logCurrentScale() {
        if (this.transform) {
            const scale = this.transform.getLocalScale();
            print("Scale actuelle: " + scale.toString());
        }
    }
    setTestRadius(radius) {
        this.testRadius = radius;
        this.applyMaskRadius(radius);
    }
};
exports.MapMaskScaler = MapMaskScaler;
exports.MapMaskScaler = MapMaskScaler = __decorate([
    component
], MapMaskScaler);
//# sourceMappingURL=MapMaskScaler.js.map