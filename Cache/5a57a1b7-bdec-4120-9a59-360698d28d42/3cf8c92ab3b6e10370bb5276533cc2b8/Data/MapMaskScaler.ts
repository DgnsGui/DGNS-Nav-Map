// MapMaskScaler.ts
// Script pour synchroniser le scaling du mask de la map avec le ContainerFrame

@component
export class MapMaskScaler extends BaseScriptComponent {
    
    @input
    @hint("Le ContainerFrame qui contient la map et l'interface")
    containerFrame: SceneObject;
    
    @input
    @hint("Le material MapTile qui contient le shader avec le paramètre exposé")
    mapTileMaterial: Material;
    
    @input
    @hint("Script Name du paramètre dans le Material Graph")
    parameterScriptName: string = "Mask_Radius";
    
    @input
    @hint("Valeur de base du mask radius")
    baseMaskRadius: number = 1.0;
    
    @input
    @hint("Scale de base du ContainerFrame")
    baseScale: number = 1.0;
    
    @input
    @hint("Test - Changer pour tester la connection")
    testRadius: number = 0.5;
    
    @input
    @hint("Activer le mode debug")
    debugMode: boolean = true;
    
    private transform: Transform;
    private lastScale: vec3;
    private isInitialized: boolean = false;
    
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
    
    private initializeScript(): boolean {
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
    
    private testExposedParameter() {
        if (!this.isInitialized) return;
        
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
        } catch (error) {
            if (this.debugMode) {
                print("✗ Échec mainPass.setParameter: " + error);
            }
        }
        
        try {
            // Method 2: Via setParameter direct sur le material
            (this.mapTileMaterial as any).setParameter(this.parameterScriptName, this.testRadius);
            if (this.debugMode) {
                print("✓ Succès avec material.setParameter");
            }
            return;
        } catch (error) {
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
            } catch (e) {
                print("Impossible de lister les paramètres: " + e);
            }
        }
    }
    
    private startMonitoring() {
        if (!this.isInitialized) return;
        
        // Monitoring avec DelayedCallbackEvent récursif
        this.scheduleNextCheck();
        
        if (this.debugMode) {
            print("Monitoring des changements de scale démarré");
        }
    }
    
    private scheduleNextCheck() {
        const checkEvent = this.sceneObject.createComponent("Component.ScriptComponent").createEvent("DelayedCallbackEvent");
        checkEvent.bind(() => {
            this.checkForScaleChange();
            this.scheduleNextCheck(); // Programmer le prochain check
        });
        checkEvent.reset(0.1); // Check toutes les 100ms
    }
    
    private checkForScaleChange() {
        if (!this.transform || !this.isInitialized) return;
        
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
    
    private updateMaskRadius(currentScale: vec3) {
        const scaleFactor = currentScale.x / this.baseScale;
        const newRadius = this.baseMaskRadius * scaleFactor;
        
        if (this.debugMode) {
            print("Nouveau radius calculé: " + newRadius.toFixed(3) + " (facteur: " + scaleFactor.toFixed(3) + ")");
        }
        
        this.setMaterialParameter(newRadius);
    }
    
    private setMaterialParameter(value: number) {
        try {
            this.mapTileMaterial.mainPass.setParameter(this.parameterScriptName, value);
        } catch (error) {
            try {
                (this.mapTileMaterial as any).setParameter(this.parameterScriptName, value);
            } catch (error2) {
                if (this.debugMode) {
                    print("Impossible de définir le paramètre: " + error2);
                }
            }
        }
    }
    
    // Méthodes publiques pour test manuel
    public testParameter() {
        if (this.debugMode) {
            print("=== Test manuel du paramètre ===");
        }
        this.testExposedParameter();
    }
    
    public setTestValue(value: number) {
        this.testRadius = value;
        this.setMaterialParameter(value);
        if (this.debugMode) {
            print("Paramètre défini manuellement à: " + value);
        }
    }
}