// --- START OF FILE MapMaskScaler.ts (Final Version with Inverted Logic) ---

import { MapComponent } from "./MapComponent";
import { Cell } from "./Cell";
import { ContainerFrame } from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame";

@component
export class MapMaskScaler extends BaseScriptComponent {
    
    @input
    containerFrameScript: ContainerFrame; 
    
    @input
    mapComponent: MapComponent;
    
    @input
    parameterScriptName: string = "Mask_Radius";
    
    @input
    baseInnerWidth: number = 32.0;
    
    @input
    debugMode: boolean = false;
    
    private isInitialized: boolean = false;
    private updateEvent: UpdateEvent;

    onAwake() {
        if (this.debugMode) print("MapMaskScaler: onAwake() appelé.");
        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.bind(this.onUpdate.bind(this));
    }

    private onUpdate() {
        if (this.isInitialized) {
            this.updateEvent.enabled = false;
            return;
        }
        
        if (this.debugMode) print("MapMaskScaler: Tentative d'initialisation...");

        if (!this.containerFrameScript) {
            if (this.debugMode) print("MapMaskScaler: -> ÉCHEC: containerFrameScript n'est pas encore assigné.");
            return;
        }

        if (!this.mapComponent || !this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            if (this.debugMode) print("MapMaskScaler: -> ÉCHEC: mapComponent ou son controller/gridView ne sont pas encore prêts.");
            return;
        }

        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            if (this.debugMode) print("MapMaskScaler: -> ÉCHEC: La carte a 0 cellules créées pour le moment.");
            return;
        }

        this.isInitialized = true;
        
        this.containerFrameScript.onScalingUpdateEvent.add(this.handleContainerResize.bind(this));
        
        this.handleContainerResize();

        if (this.debugMode) {
            print("--- MapMaskScaler INITIALISATION RÉUSSIE! En écoute des événements de redimensionnement. ---");
        }
    }
    
    private handleContainerResize() {
        if (!this.isInitialized) return;

        const currentInnerSize = this.containerFrameScript.innerSize;
        const scaleFactor = currentInnerSize.x / this.baseInnerWidth;
        
        // *** LA CORRECTION EST ICI ***
        const newRadius = 1.0 / scaleFactor;

        if (this.debugMode) {
            print(`MapMaskScaler: handleContainerResize déclenché! Nouveau radius: ${newRadius.toFixed(3)}`);
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
                        print("MapMaskScaler: Erreur en appliquant le paramètre au matériau: " + e);
                    }
                }
            }
        }
    }
}