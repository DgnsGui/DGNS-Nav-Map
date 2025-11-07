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
    
    @input
    @hint("Test - Changer cette valeur pour tester la connection au shader")
    testRadius: number = 1.0;
    
    private transform: Transform;
    private lastScale: vec3;
    
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
    private applyMaskRadius(radius: number) {
        try {
            print("Tentative d'application du radius: " + radius);
            this.mapTileMaterial.mainPass.setParameter("Mask_Radius", radius);
            print("Radius appliqué avec succès: " + radius);
        } catch (error) {
            print("ERREUR lors de l'application du radius: " + error);
            
            // Essayons d'autres noms possibles pour le paramètre
            try {
                this.mapTileMaterial.mainPass.setParameter("maskRadius", radius);
                print("Radius appliqué avec 'maskRadius': " + radius);
            } catch (e2) {
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
    public testMaskChange() {
        print("=== TEST MASK CHANGE ===");
        this.applyMaskRadius(this.testRadius);
    }
    
    // Version simplifiée de l'update qui se concentre sur la détection de changement
    public checkScaleChange() {
        if (!this.transform) return;
        
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
    public logCurrentScale() {
        if (this.transform) {
            const scale = this.transform.getLocalScale();
            print("Scale actuelle: " + scale.toString());
        }
    }
    
    public setTestRadius(radius: number) {
        this.testRadius = radius;
        this.applyMaskRadius(radius);
    }
}