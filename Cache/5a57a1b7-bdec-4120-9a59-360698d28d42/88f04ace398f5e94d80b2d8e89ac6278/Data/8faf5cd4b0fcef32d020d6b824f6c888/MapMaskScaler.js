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
    onAwake() {
        if (this.debugMode)
            print("MapMaskScaler: onAwake() appelé.");
        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(this.onUpdate.bind(this));
    }
    onUpdate() {
        // Cette fonction s'exécutera à chaque frame jusqu'à ce que l'initialisation réussisse.
        if (this.isInitialized) {
            // L'initialisation est terminée, on peut arrêter la boucle de mise à jour.
            this.updateEvent.enabled = false;
            return;
        }
        if (this.debugMode)
            print("MapMaskScaler: Tentative d'initialisation...");
        // Condition 1: Vérifier si le script ContainerFrame est assigné.
        if (!this.containerFrameScript) {
            if (this.debugMode)
                print("MapMaskScaler: -> ÉCHEC: containerFrameScript n'est pas encore assigné.");
            return;
        }
        // Condition 2: Vérifier si MapComponent et ses composants internes sont prêts.
        if (!this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            if (this.debugMode)
                print("MapMaskScaler: -> ÉCHEC: mapComponent ou son controller/gridView ne sont pas encore prêts.");
            return;
        }
        // Condition 3: Vérifier si la carte a réellement créé ses cellules visuelles.
        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            if (this.debugMode)
                print("MapMaskScaler: -> ÉCHEC: La carte a 0 cellules créées pour le moment.");
            return;
        }
        // --- Si toutes les vérifications passent, on initialise ---
        this.isInitialized = true; // Ceci empêche la boucle de refaire les vérifications.
        // On s'abonne à l'événement qui nous prévient quand le container est redimensionné.
        this.containerFrameScript.onScalingUpdateEvent.add(this.handleContainerResize.bind(this));
        // On effectue un premier redimensionnement pour définir la taille de masque de départ correcte.
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
        const newRadius = scaleFactor;
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