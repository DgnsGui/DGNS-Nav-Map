// MapMaskScaler.ts
// Script pour synchroniser le scaling du mask de la map avec le ContainerFrame

@component
export class MapMaskScaler extends BaseScriptComponent {
    
    @input
    @hint("Le ContainerFrame qui contient la map et l'interface")
    containerFrame: SceneObject;
    
    @input
    @hint("Le material MapTile qui contient le shader avec le Mask_Radius parameter")
    mapTileMaterial: Material;
    
    @input
    @hint("Valeur de base du mask radius (celle définie dans le shader)")
    baseMaskRadius: number = 1.0;
    
    @input
    @hint("Scale de base du ContainerFrame (pour référence)")
    baseScale: number = 1.0;
    
    private transform: Transform;
    private updateEvent: SceneEvent;
    
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
    
    private onUpdate() {
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
            
        } catch (error) {
            print("MapMaskScaler Error: " + error);
        }
    }
    
    // Méthode utilitaire pour définir manuellement le mask radius
    public setMaskRadius(radius: number) {
        try {
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", radius);
        } catch (error) {
            print("Erreur lors de la définition du mask radius: " + error);
        }
    }
    
    // Méthode pour réinitialiser le mask à sa valeur de base
    public resetMaskRadius() {
        this.setMaskRadius(this.baseMaskRadius);
    }
}