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
        if (this.debugMode) {
            print("=== MapMaskScaler Debug Start ===");
        }
        this.initializeScript();
    }
    onStart() {
        // Test initial avec un délai
        const delayedEvent = this.sceneObject.createComponent("Component.ScriptComponent").createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.testExposedParameter();
            this.startMonitoring();
        });
        delayedEvent.reset(0.1);
    }
    initializeScript() {
        if (!this.containerFrame) {
            print("ERREUR: ContainerFrame non assigné!");
            return false;
        }
        if (!this.mapTileMaterial) {
            print("ERREUR: MapTile Material non assigné!");
            return false;
        }
        this.transform = this.containerFrame.getTransform();
        this.lastScale = this.transform.getLocalScale();
        if (this.debugMode) {
            print("Container Frame: " + this.containerFrame.name);
            print("Material: " + this.mapTileMaterial.name);
            print("Script Name Parameter: " + this.parameterScriptName);
            print("Scale initiale: " + this.lastScale.x + ", " + this.lastScale.y + ", " + this.lastScale.z);
        }
        this.isInitialized = true;
        return true;
    }
    testExposedParameter() {
        if (!this.isInitialized)
            return;
        if (this.debugMode) {
            print("=== Test du paramètre exposé ===");
            print("Tentative avec paramètre: " + this.parameterScriptName);
            print("Valeur de test: " + this.testRadius);
        }
        try {
            // Method 1: Via mainPass (le plus commun)
            this.mapTileMaterial.mainPass.setParameter(this.parameterScriptName, this.testRadius);
            if (this.debugMode) {
                print("✓ Succès avec mainPass.setParameter");
            }
            return;
        }
        catch (error) {
            if (this.debugMode) {
                print("✗ Échec mainPass.setParameter: " + error);
            }
        }
        try {
            // Method 2: Via setParameter direct sur le material
            this.mapTileMaterial.setParameter(this.parameterScriptName, this.testRadius);
            if (this.debugMode) {
                print("✓ Succès avec material.setParameter");
            }
            return;
        }
        catch (error) {
            if (this.debugMode) {
                print("✗ Échec material.setParameter: " + error);
            }
        }
        // Method 3: Lister tous les paramètres disponibles
        if (this.debugMode) {
            print("=== Paramètres disponibles ===");
            try {
                const passCount = this.mapTileMaterial.getPassCount();
                print("Nombre de passes: " + passCount);
                for (let i = 0; i < passCount; i++) {
                    const pass = this.mapTileMaterial.getPass(i);
                    print("Pass " + i + ": " + pass.name);
                }
            }
            catch (e) {
                print("Impossible de lister les paramètres: " + e);
            }
        }
    }
    startMonitoring() {
        if (!this.isInitialized)
            return;
        // Monitoring avec DelayedCallbackEvent récursif
        this.scheduleNextCheck();
        if (this.debugMode) {
            print("Monitoring des changements de scale démarré");
        }
    }
    scheduleNextCheck() {
        const checkEvent = this.sceneObject.createComponent("Component.ScriptComponent").createEvent("DelayedCallbackEvent");
        checkEvent.bind(() => {
            this.checkForScaleChange();
            this.scheduleNextCheck(); // Programmer le prochain check
        });
        checkEvent.reset(0.1); // Check toutes les 100ms
    }
    checkForScaleChange() {
        if (!this.transform || !this.isInitialized)
            return;
        const currentScale = this.transform.getLocalScale();
        const threshold = 0.001;
        const scaleChanged = Math.abs(currentScale.x - this.lastScale.x) > threshold ||
            Math.abs(currentScale.y - this.lastScale.y) > threshold ||
            Math.abs(currentScale.z - this.lastScale.z) > threshold;
        if (scaleChanged) {
            if (this.debugMode) {
                print("Scale changée vers: " + currentScale.x.toFixed(3));
            }
            this.updateMaskRadius(currentScale);
            this.lastScale = currentScale;
        }
    }
    updateMaskRadius(currentScale) {
        const scaleFactor = currentScale.x / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        if (this.debugMode) {
            print("Nouveau radius calculé: " + newRadius.toFixed(3) + " (facteur: " + scaleFactor.toFixed(3) + ")");
        }
        this.setMaterialParameter(newRadius);
    }
    setMaterialParameter(value) {
        try {
            this.mapTileMaterial.mainPass.setParameter(this.parameterScriptName, value);
        }
        catch (error) {
            try {
                this.mapTileMaterial.setParameter(this.parameterScriptName, value);
            }
            catch (error2) {
                if (this.debugMode) {
                    print("Impossible de définir le paramètre: " + error2);
                }
            }
        }
    }
    // Méthodes publiques pour test manuel
    testParameter() {
        if (this.debugMode) {
            print("=== Test manuel du paramètre ===");
        }
        this.testExposedParameter();
    }
    setTestValue(value) {
        this.testRadius = value;
        this.setMaterialParameter(value);
        if (this.debugMode) {
            print("Paramètre défini manuellement à: " + value);
        }
    }
    __initialize() {
        super.__initialize();
        this.isInitialized = false;
    }
};
exports.MapMaskScaler = MapMaskScaler;
exports.MapMaskScaler = MapMaskScaler = __decorate([
    component
], MapMaskScaler);
//# sourceMappingURL=MapMaskScaler.js.map