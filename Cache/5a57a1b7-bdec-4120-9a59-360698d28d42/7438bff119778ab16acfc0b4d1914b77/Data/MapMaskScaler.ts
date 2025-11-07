// --- START OF FILE MapMaskScaler_FinalDebug.ts ---

import { UpdateDispatcher } from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";
import { MapComponent } from "./MapComponent";
import { Cell } from "./Cell";

@component
export class MapMaskScaler_FinalDebug extends BaseScriptComponent {
    
    @input
    containerFrame: SceneObject;
    
    @input
    mapComponent: MapComponent;
    
    @input
    parameterScriptName: string = "Mask_Radius";
    
    @input
    baseMaskRadius: number = 1.0;
    
    @input
    baseScale: number = 1.0;
    
    @input
    debugMode: boolean = true;
    
    private containerTransform: Transform;
    private lastScaleX: number = -1;
    private isInitialized: boolean = false;
    
    onAwake() {
        // Log le plus tôt possible pour voir si le script est vivant
        print("--- MapMaskScaler_FinalDebug onAwake() CALLED ---");
        
        this.isInitialized = false;
        
        // On attache l'update immédiatement
        const updateEvent = LensConfig.getInstance().updateDispatcher.createUpdateEvent("UpdateEvent");
        updateEvent.bind(this.onUpdate.bind(this));
    }
    
    private onUpdate() {
        // Si le script n'est pas initialisé, on essaie de le faire
        if (!this.isInitialized) {
            this.tryInitialize();
            return; // On arrête ici pour cette frame
        }
        
        // --- Comportement normal après initialisation ---
        if (!this.containerTransform) return;
        
        const currentScaleX = this.containerTransform.getLocalScale().x;
        const threshold = 0.001;
        
        if (Math.abs(currentScaleX - this.lastScaleX) > threshold) {
            this.updateMaskRadius(currentScaleX);
            this.lastScaleX = currentScaleX;
        }
    }
    
    private tryInitialize() {
        if (this.debugMode) {
            print("Attempting to initialize MapMaskScaler...");
        }

        if (!this.containerFrame) {
            if (this.debugMode) print("...Waiting for ContainerFrame to be assigned.");
            return;
        }
        
        if (!this.mapComponent) {
            if (this.debugMode) print("...Waiting for MapComponent to be assigned.");
            return;
        }

        if (!this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            if (this.debugMode) print("...Waiting for mapController and gridView to be ready.");
            return;
        }

        const cells = this.mapComponent.mapController.gridView.getCells();
        if (cells.length === 0) {
            if (this.debugMode) print("...Waiting for map cells to be created.");
            return;
        }

        // Si toutes les conditions sont remplies :
        this.containerTransform = this.containerFrame.getTransform();
        this.lastScaleX = this.containerTransform.getLocalScale().x;
        
        // On fait une première mise à jour immédiate
        this.updateMaskRadius(this.lastScaleX);
        
        this.isInitialized = true; // On arrête de tenter l'initialisation
        
        print("--- MapMaskScaler_FinalDebug INITIALIZATION SUCCESSFUL! ---");
    }
    
    private updateMaskRadius(currentScaleX: number) {
        const scaleFactor = currentScaleX / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        
        if (this.debugMode) {
            print(`Scale updated: ${currentScaleX.toFixed(3)}. New radius: ${newRadius.toFixed(3)}`);
        }
        
        this.setMaterialParameterOnAllTiles(newRadius);
    }
    
    private setMaterialParameterOnAllTiles(value: number) {
        const cells: Cell[] = this.mapComponent.mapController.gridView.getCells();
        
        for (const cell of cells) {
            if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                try {
                    cell.imageComponent.mainMaterial.mainPass.setParameter(this.parameterScriptName, value);
                } catch (e) {
                    if (this.debugMode) {
                        print("Error setting parameter on a tile material: " + e);
                    }
                }
            }
        }
    }
}