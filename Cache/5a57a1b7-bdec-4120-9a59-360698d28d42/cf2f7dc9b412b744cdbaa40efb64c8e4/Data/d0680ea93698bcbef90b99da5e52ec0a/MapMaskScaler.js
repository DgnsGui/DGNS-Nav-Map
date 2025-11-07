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
let MapMaskScaler = class MapMaskScaler extends BaseScriptComponent {
    onStart() {
        // On attend un court instant pour être sûr que tous les autres scripts sont prêts
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.tryInitialize();
        });
        delayedEvent.reset(0.2);
    }
    tryInitialize() {
        if (this.isInitialized)
            return;
        if (!this.containerFrameScript) {
            if (this.debugMode)
                print("MapMaskScaler: En attente de l'assignation du script ContainerFrame.");
            // On retente plus tard
            const retryEvent = this.createEvent("DelayedCallbackEvent");
            retryEvent.bind(() => this.tryInitialize());
            retryEvent.reset(0.1);
            return;
        }
        if (!this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            if (this.debugMode)
                print("MapMaskScaler: En attente que le MapComponent soit prêt.");
            // On retente plus tard
            const retryEvent = this.createEvent("DelayedCallbackEvent");
            retryEvent.bind(() => this.tryInitialize());
            retryEvent.reset(0.1);
            return;
        }
        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            if (this.debugMode)
                print("MapMaskScaler: En attente de la création des tuiles de la carte.");
            // On retente plus tard
            const retryEvent = this.createEvent("DelayedCallbackEvent");
            retryEvent.bind(() => this.tryInitialize());
            retryEvent.reset(0.1);
            return;
        }
        // --- Initialisation réussie ---
        this.isInitialized = true;
        // On s'abonne à l'événement de redimensionnement du ContainerFrame
        this.containerFrameScript.onScalingUpdateEvent.add(this.handleContainerResize.bind(this));
        // On fait une mise à jour initiale au cas où la taille a déjà changé
        this.handleContainerResize();
        if (this.debugMode) {
            print("--- MapMaskScaler INITIALIZATION SUCCESSFUL! Abonnée à l'événement onScalingUpdateEvent. ---");
        }
    }
    // Cette fonction sera appelée AUTOMATIQUEMENT par ContainerFrame à chaque redimensionnement
    handleContainerResize() {
        if (!this.isInitialized)
            return;
        // On récupère la taille actuelle directement depuis le script
        const currentInnerSize = this.containerFrameScript.innerSize;
        // On calcule le facteur de scale basé sur la largeur (X)
        const scaleFactor = currentInnerSize.x / this.baseInnerWidth;
        // On assume que le radius de base est 1.0, donc le nouveau radius est juste le scaleFactor
        const newRadius = scaleFactor;
        if (this.debugMode) {
            print(`Container a été redimensionné! innerSize.x: ${currentInnerSize.x.toFixed(2)}. Nouveau radius calculé: ${newRadius.toFixed(3)}`);
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
                        print("Erreur en appliquant le paramètre au matériau de la tuile: " + e);
                    }
                }
            }
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