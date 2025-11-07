import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { validate } from "SpectaclesInteractionKit.lspkg/Utils/validate";
import { MapComponent } from "../MapComponent/Scripts/MapComponent";

const TAG = "[MapManipulation]";
const log = new NativeLogger(TAG);

@component
export class InteractableManipulation extends BaseScriptComponent {
  @input("SceneObject") private mapSceneObject: SceneObject | null = null;
  @input() private mapComponent: MapComponent;
  @input() private fullMapCollider: ColliderComponent;
  @input() private miniMapCollider: ColliderComponent;

  @input
  @hint("Contrôle la vitesse de défilement de la carte. Plus la valeur est petite, plus le défilement est lent. 1.0 = vitesse par défaut.")
  private scrollSensitivity: number = 100000.0;

  @input
  @hint("Active les logs de debug pour tracer les événements")
  private enableDebugLogs: boolean = false;

  private interactable: Interactable | null = null;
  private rotatingGridTransform: Transform;
  private colliderSizeX: number = 1.0;
  private colliderSizeY: number = 1.0;
  
  // État du tracking d'interaction
  private isCurrentlyInteracting: boolean = false;
  private lastInteractionPosition: vec2 | null = null;

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName());
    if (!this.interactable) throw new Error("MapManipulation requires an Interactable.");
    
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.setupCallbacks();
    this.mapComponent.onMiniMapToggled.add((isMiniMap: boolean) => this.setupColliders(isMiniMap));
  }

  private debugLog(message: string): void {
    if (this.enableDebugLogs) {
      log.i(`[DEBUG] ${message}`);
    }
  }

  private onStart(): void {
    this.setupColliders(this.mapComponent.startedAsMiniMap);
    if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
        this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
        this.debugLog("MapController initialized successfully");
    } else {
        log.e("MapController not ready on Start, retrying...");
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => this.onStart());
        delayedEvent.reset(0.1);
    }
  }
  
  private setupCallbacks(): void {
    validate(this.interactable);
    const stopProp = (e: InteractorEvent) => { 
      if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp") 
        e.stopPropagation(); 
    };
    
    // Début d'interaction
    this.interactable.onInteractorTriggerStart.add((e) => {
        stopProp(e);
        if (e.interactor.planecastPoint) {
            const localPos = this.getLocalPosition(e.interactor.planecastPoint);
            this.debugLog(`TriggerStart at ${localPos}`);
            this.isCurrentlyInteracting = true;
            this.lastInteractionPosition = localPos;
            this.mapComponent.startTouch(localPos);
        }
    });

    // Mise à jour d'interaction
    this.interactable.onTriggerUpdate.add((e) => {
        stopProp(e);
        if (e.interactor.planecastPoint) {
            const localPos = this.getLocalPosition(e.interactor.planecastPoint);
            this.lastInteractionPosition = localPos;
            this.mapComponent.updateTouch(localPos);
        }
    });

    // Fin d'interaction normale
    this.interactable.onInteractorTriggerEnd.add((e) => {
        stopProp(e);
        this.debugLog(`TriggerEnd - isInteracting: ${this.isCurrentlyInteracting}`);
        if (this.isCurrentlyInteracting) {
            const localPos = e.interactor.planecastPoint 
                ? this.getLocalPosition(e.interactor.planecastPoint)
                : this.lastInteractionPosition || vec2.zero();
            this.debugLog(`TriggerEnd at ${localPos}`);
            this.endInteraction(localPos);
        }
    });
    
    // Annulation d'interaction (sortie de zone)
    this.interactable.onTriggerCanceled.add((e) => {
        stopProp(e);
        this.debugLog(`TriggerCanceled - isInteracting: ${this.isCurrentlyInteracting}`);
        if (this.isCurrentlyInteracting) {
            // Utiliser la dernière position connue car on est sorti de la zone
            const localPos = this.lastInteractionPosition || vec2.zero();
            this.debugLog(`TriggerCanceled at last known position: ${localPos}`);
            this.endInteraction(localPos);
        }
    });
    
    // Hover pour la détection des pins
    this.interactable.onHoverUpdate.add((e) => {
        stopProp(e);
        if (e.interactor.planecastPoint && !this.isCurrentlyInteracting) {
            this.mapComponent.updateHover(this.getLocalPosition(e.interactor.planecastPoint));
        }
    });

    // Hover exit - important pour nettoyer l'état si on sort pendant l'interaction
    this.interactable.onHoverExit.add((e) => {
        stopProp(e);
        this.debugLog(`HoverExit - isInteracting: ${this.isCurrentlyInteracting}`);
        // Si on sort de la zone pendant une interaction, on la termine
        if (this.isCurrentlyInteracting) {
            const localPos = this.lastInteractionPosition || vec2.zero();
            this.debugLog(`HoverExit during interaction at: ${localPos}`);
            this.endInteraction(localPos);
        }
    });
  }

  private endInteraction(localPosition: vec2): void {
    this.debugLog(`endInteraction called at ${localPosition}`);
    this.mapComponent.endTouch(localPosition);
    this.isCurrentlyInteracting = false;
    this.lastInteractionPosition = null;
  }

  private getLocalPosition(worldPosition: vec3): vec2 {
    if (!this.rotatingGridTransform) return vec2.zero();
    
    const localPosition = this.rotatingGridTransform.getInvertedWorldTransform().multiplyPoint(worldPosition);
    
    const normalizedPosition = new vec2(
      localPosition.x / this.colliderSizeX,
      localPosition.y / this.colliderSizeY
    );
    
    return normalizedPosition.uniformScale(this.scrollSensitivity);
  }

  private setupColliders(isMiniMap: boolean): void {
    this.miniMapCollider.enabled = isMiniMap;
    this.fullMapCollider.enabled = !isMiniMap;
    const shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;

    if (shape.isOfType("BoxShape")) {
        const box = shape as BoxShape;
        this.colliderSizeX = box.size.x / 8;
        this.colliderSizeY = box.size.y / 8;
    } else if (shape.isOfType("SphereShape")) {
        const sphere = shape as SphereShape;
        this.colliderSizeX = sphere.radius;
        this.colliderSizeY = sphere.radius;
    } 
    else if (shape.isOfType("MeshShape")) {
        const meshShape = shape as MeshShape;
        const renderMesh = meshShape.mesh;
        if (renderMesh) {
            const min = renderMesh.aabbMin;
            const max = renderMesh.aabbMax;
            const size = max.sub(min);

            this.colliderSizeX = size.x / 2.0;
            this.colliderSizeY = size.y / 2.0;
            log.i(`Mesh collider detected. Using calculated size: X=${this.colliderSizeX}, Y=${this.colliderSizeY}`);
        } else {
            log.e("MeshShape collider is missing its mesh resource!");
        }
    }
    else {
        log.e("Unsupported collider shape for map interaction.");
    }
  }
}