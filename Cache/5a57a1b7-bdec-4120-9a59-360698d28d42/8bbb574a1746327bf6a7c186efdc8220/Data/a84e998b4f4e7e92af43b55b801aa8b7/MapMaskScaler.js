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
        const testEvent = this.sceneObject.createComponent("Component.ScriptComponent");
        const delayEvent = testEvent.createEvent("DelayedCallbackEvent");
        delayEvent.bind(() => {
            this.testConnection();
            this.startMonitoring();
        });
        delayEvent.reset(0.1); // Délai de 100ms
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
            print("Scale initiale: x=" + this.lastScale.x + ", y=" + this.lastScale.y + ", z=" + this.lastScale.z);
        }
        this.isInitialized = true;
        return true;
    }
    testConnection() {
        if (!this.isInitialized)
            return;
        if (this.debugMode) {
            print("=== Test de connexion au shader ===");
        }
        // Essayer différents noms de paramètres possibles
        const parameterNames = ["Mask_Radius", "maskRadius", "mask_radius", "MaskRadius"];
        for (let paramName of parameterNames) {
            try {
                this.mapTileMaterial.mainPass.setParameter(paramName, this.testRadius);
                if (this.debugMode) {
                    print("✓ Succès avec paramètre: " + paramName + " = " + this.testRadius);
                }
                return; // Sortir dès qu'un nom fonctionne
            }
            catch (error) {
                if (this.debugMode) {
                    print("✗ Échec avec paramètre: " + paramName + " - " + error);
                }
            }
        }
        if (this.debugMode) {
            print("Aucun paramètre trouvé. Vérifiez le nom dans le Material Graph.");
        }
    }
    startMonitoring() {
        if (!this.isInitialized)
            return;
        // Créer un monitoring continu avec DelayedCallbackEvent
        const monitoringComponent = this.sceneObject.createComponent("Component.ScriptComponent");
        const monitorEvent = monitoringComponent.createEvent("DelayedCallbackEvent");
        const checkScale = () => {
            this.checkForScaleChange();
            monitorEvent.reset(0.1); // Vérifier toutes les 100ms
        };
        monitorEvent.bind(checkScale);
        monitorEvent.reset(0.1);
        if (this.debugMode) {
            print("Monitoring démarré");
        }
    }
    checkForScaleChange() {
        if (!this.transform || !this.isInitialized)
            return;
        const currentScale = this.transform.getLocalScale();
        // Vérifier si la scale a significativement changé
        const threshold = 0.001;
        const scaleChanged = Math.abs(currentScale.x - this.lastScale.x) > threshold ||
            Math.abs(currentScale.y - this.lastScale.y) > threshold ||
            Math.abs(currentScale.z - this.lastScale.z) > threshold;
        if (scaleChanged) {
            if (this.debugMode) {
                print("Scale changée: " + currentScale.x.toFixed(3) + ", " + currentScale.y.toFixed(3) + ", " + currentScale.z.toFixed(3));
            }
            this.updateMaskRadius(currentScale);
            this.lastScale = currentScale;
        }
    }
    updateMaskRadius(currentScale) {
        // Calculer le facteur de scale
        const scaleFactor = currentScale.x / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        if (this.debugMode) {
            print("Nouveau radius: " + newRadius.toFixed(3) + " (facteur: " + scaleFactor.toFixed(3) + ")");
        }
        // Appliquer le nouveau radius
        this.applyRadius(newRadius);
    }
    applyRadius(radius) {
        try {
            // Utiliser le nom de paramètre qui a fonctionné lors du test
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", radius);
        }
        catch (error) {
            // Essayer les autres noms en cas d'échec
            try {
                this.mapTileMaterial.mainPass.setParameter("maskRadius", radius);
            }
            catch (error2) {
                if (this.debugMode) {
                    print("Erreur application radius: " + error2);
                }
            }
        }
    }
    // Méthodes publiques pour debug manuel
    forceUpdate() {
        if (this.debugMode) {
            print("=== Force Update ===");
        }
        this.testConnection();
        if (this.transform) {
            this.updateMaskRadius(this.transform.getLocalScale());
        }
    }
    logCurrentState() {
        if (this.transform) {
            const scale = this.transform.getLocalScale();
            print("État actuel - Scale: " + scale.x.toFixed(3) + ", Test Radius: " + this.testRadius);
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