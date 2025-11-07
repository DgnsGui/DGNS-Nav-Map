// --- START OF FILE MapMaskScaler.ts (Corrected Paths) ---

import { UpdateDispatcher } from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";
import { MapComponent } from "./MapComponent"; // CHEMIN CORRIGÉ
import { Cell } from "./Cell";                 // CHEMIN CORRIGÉ

@component
export class MapMaskScaler extends BaseScriptComponent {
    
    @input
    @hint("Le ContainerFrame qui contient la map et l'interface")
    containerFrame: SceneObject;
    
    @input
    @hint("Le MapComponent principal qui gère la carte")
    mapComponent: MapComponent;
    
    @input
    @hint("Script Name du paramètre dans le Material Graph")
    parameterScriptName: string = "Mask_Radius";
    
    @input
    @hint("Valeur de base du mask radius (doit correspondre au défaut dans le shader)")
    baseMaskRadius: number = 1.0;
    
    @input
    @hint("Scale de base du ContainerFrame")
    baseScale: number = 1.0;
    
    @input
    @hint("Activer le mode debug pour voir les logs")
    debugMode: boolean = false;
    
    private containerTransform: Transform;
    private lastScaleX: number = -1;
    private isInitialized: boolean = false;
    private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher;
    
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
    
    private initializeScript(): boolean {
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
    
    private onUpdate() {
        if (!this.isInitialized || !this.containerTransform) return;
        
        const currentScaleX = this.containerTransform.getLocalScale().x;
        const threshold = 0.001;
        
        // Vérifier si le scale a changé de manière significative
        if (Math.abs(currentScaleX - this.lastScaleX) > threshold) {
            this.updateMaskRadius(currentScaleX);
            this.lastScaleX = currentScaleX;
        }
    }
    
    private updateMaskRadius(currentScaleX: number) {
        // Calcule le nouveau radius basé sur le ratio du scale actuel par rapport au scale de base
        const scaleFactor = currentScaleX / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        
        if (this.debugMode) {
            print(`Scale changé: ${currentScaleX.toFixed(3)}. Nouveau radius: ${newRadius.toFixed(3)}`);
        }
        
        this.setMaterialParameterOnAllTiles(newRadius);
    }
    
    private setMaterialParameterOnAllTiles(value: number) {
        // S'assurer que le mapController et le gridView sont prêts
        if (!this.mapComponent.mapController || !this.mapComponent.mapController.gridView) {
            return;
        }
        
        // Récupérer toutes les cellules (tuiles) actives
        const cells: Cell[] = this.mapComponent.mapController.gridView.getCells();
        
        if (cells.length === 0 && this.debugMode) {
            print("Attention: Aucune cellule de carte trouvée à mettre à jour.");
        }
        
        // Appliquer le nouveau radius à chaque tuile
        for (const cell of cells) {
            if (cell && cell.imageComponent && cell.imageComponent.mainMaterial) {
                try {
                    cell.imageComponent.mainMaterial.mainPass.setParameter(this.parameterScriptName, value);
                } catch (e) {
                    if (this.debugMode) {
                        print("Erreur en mettant à jour le paramètre sur une tuile: " + e);
                    }
                }
            }
        }
    }
}