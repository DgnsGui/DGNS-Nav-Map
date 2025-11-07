// --- START OF FILE MapMaskScaler.ts (Final Event-Based Version) ---

import { MapComponent } from "./MapComponent";
import { Cell } from "./Cell";
import { ContainerFrame } from "./ContainerFrame"; // Important: Importer ContainerFrame

@component
export class MapMaskScaler extends BaseScriptComponent {
    
    @input
    @hint("Faites glisser ici le composant SCRIPT ContainerFrame, pas l'objet de la scène.")
    containerFrameScript: ContainerFrame; 
    
    @input
    mapComponent: MapComponent;
    
    @input
    parameterScriptName: string = "Mask_Radius";
    
    @input
    @hint("La taille de base (largeur) de l'innerSize du ContainerFrame au démarrage.")
    baseInnerWidth: number = 32.0;
    
    @input
    debugMode: boolean = false;
    
    private isInitialized: boolean = false;
    
    onStart() {
        // On attend un court instant pour être sûr que tous les autres scripts sont prêts
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.tryInitialize();
        });
        delayedEvent.reset(0.2); 
    }
    
    private tryInitialize() {
        if (this.isInitialized) return;

        if (!this.containerFrameScript) {
            if (this.debugMode) print("MapMaskScaler: En attente de l'assignation du script ContainerFrame.");
            return;
        }

        if (!this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            if (this.debugMode) print("MapMaskScaler: En attente que le MapComponent soit prêt.");
            return;
        }

        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            if (this.debugMode) print("MapMaskScaler: En attente de la création des tuiles de la carte.");
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
    private handleContainerResize() {
        if (!this.isInitialized) return;

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
    
    private setMaterialParameterOnAllTiles(value: number) {
        const cells: Cell[] = this.mapComponent.mapController.gridView.getCells();
        
        for (const cell of cells) {
            if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                try {
                    (cell.imageComponent.mainMaterial.mainPass as any)[this.parameterScriptName] = value;
                } catch (e) {
                    if (this.debugMode) {
                        print("Erreur en appliquant le paramètre au matériau de la tuile: " + e);
                    }
                }
            }
        }
    }
}