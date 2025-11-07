import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { MapPin } from "../MapComponent/Scripts/MapPin";
import { PlaceInfo } from "../MapComponent/Scripts/SnapPlacesProvider";

const TAG = "[PlacesClamManager]";
const log = new NativeLogger(TAG);

/**
 * Gestionnaire du Container "Places Clam" qui affiche et filtre les places nearby
 */
@component
export class PlacesClamManager extends BaseScriptComponent {
  @input
  @hint("Le Container Frame 'Places Clam' (l'ovale)")
  private placesContainer: SceneObject;

  @input
  @hint("Bouton pour ouvrir/fermer le container Places")
  private placesButton: PinchButton;

  @input
  @hint("Bouton de fermeture à l'intérieur du container")
  private closeButton: PinchButton;

  @input
  @hint("Position Y quand l'ovale est caché")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Référence au MapComponent")
  private mapComponent: MapComponent;

  @input
  @hint("Liste des Switch Toggle Buttons (Place 0-9)")
  private placeToggles: ToggleButton[];

  @input
  @hint("Liste des Text objects pour les noms de places (Object 0-9)")
  private placeTextObjects: Text[];

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private placesTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;

  // Mapping entre les toggles et les pins
  private placePinMap: Map<number, MapPin> = new Map();
  private placeInfoMap: Map<number, PlaceInfo> = new Map();

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== PlacesClamManager INITIALIZATION ===");

    // Vérifications
    if (!this.placesContainer) {
      log.e("Places container not assigned!");
      return;
    }

    if (!this.placesButton) {
      log.e("Places button not assigned!");
      return;
    }

    if (!this.mapComponent) {
      log.e("MapComponent not assigned!");
      return;
    }

    // Initialiser la position cachée
    this.placesTransform = this.placesContainer.getTransform();
    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.placesTransform.setLocalPosition(pos);

    this.placesContainer.enabled = false;
    this.isVisible = false;

    // Setup des boutons
    this.placesButton.onButtonPinched.add(this.handlePlacesButtonPressed.bind(this));
    
    if (this.closeButton) {
      this.closeButton.onButtonPinched.add(this.handleCloseButtonPressed.bind(this));
    }

    // Setup des toggles
    if (this.placeToggles && this.placeToggles.length > 0) {
      for (let i = 0; i < this.placeToggles.length; i++) {
        const toggle = this.placeToggles[i];
        if (toggle) {
          // Désactiver initialement
          toggle.sceneObject.enabled = false;
          
          // Créer un closure pour capturer l'index
          const index = i;
          toggle.onStateChanged.add((isOn: boolean) => {
            this.handleToggleChanged(index, isOn);
          });
        }
      }
    }

    // S'abonner aux événements de pins
    this.mapComponent.subscribeOnMapAddPin((pin: MapPin) => {
      if (this.enableDebugLogs) log.i(`Pin added: ${pin.placeInfo?.name || "Unknown"}`);
    });

    this.mapComponent.subscribeOnAllMapPinsRemoved(() => {
      this.clearAllPlaces();
    });

    // S'abonner à l'événement de recherche de places
    this.setupPlacesListener();

    if (this.enableDebugLogs) log.i("=== PlacesClamManager initialized successfully ===");
  }

  private setupPlacesListener(): void {
    // Créer un délai pour laisser le MapController s'initialiser
    const delayedEvent = this.createEvent("DelayedCallbackEvent");
    delayedEvent.bind(() => {
      const mapController = this.mapComponent.mapController;
      
      if (mapController) {
        // S'abonner aux événements de pins pour capturer les places
        mapController.onMapPinAdded.add((pin: MapPin) => {
          if (pin.placeInfo) {
            this.addPlaceToList(pin);
          }
        });

        mapController.onMapPinRemoved.add((pin: MapPin) => {
          this.removePlaceFromList(pin);
        });

        mapController.onAllMapPinsRemoved.add(() => {
          this.clearAllPlaces();
        });

        if (this.enableDebugLogs) log.i("Places listener setup complete");
      }
    });
    
    // Délai de 0.5s pour s'assurer que tout est initialisé
    const delayEvent = this.createEvent("DelayedCallbackEvent");
    delayEvent.bind(() => {
      delayedEvent.enabled = true;
    });
    script.createEvent("UpdateEvent").bind(() => {
      delayEvent.enabled = true;
      script.removeEvent("UpdateEvent");
    });
  }

  private addPlaceToList(pin: MapPin): void {
    if (!pin.placeInfo) return;

    // Trouver le prochain slot disponible
    let slotIndex = -1;
    for (let i = 0; i < this.placeToggles.length; i++) {
      if (!this.placePinMap.has(i)) {
        slotIndex = i;
        break;
      }
    }

    if (slotIndex === -1) {
      log.w("No available slots for new place");
      return;
    }

    // Stocker le mapping
    this.placePinMap.set(slotIndex, pin);
    this.placeInfoMap.set(slotIndex, pin.placeInfo);

    // Mettre à jour le texte
    if (this.placeTextObjects && this.placeTextObjects[slotIndex]) {
      const placeText = this.placeTextObjects[slotIndex];
      const displayName = this.formatPlaceName(pin.placeInfo.name);
      placeText.text = displayName;
      
      if (this.enableDebugLogs) {
        log.i(`Place ${slotIndex}: ${displayName}`);
      }
    }

    // Activer le toggle
    if (this.placeToggles[slotIndex]) {
      this.placeToggles[slotIndex].sceneObject.enabled = true;
      this.placeToggles[slotIndex].isToggledOn = true; // Activé par défaut
    }
  }

  private removePlaceFromList(pin: MapPin): void {
    // Trouver l'index du pin
    let slotIndex = -1;
    for (const [index, mappedPin] of this.placePinMap.entries()) {
      if (mappedPin === pin) {
        slotIndex = index;
        break;
      }
    }

    if (slotIndex !== -1) {
      this.clearSlot(slotIndex);
    }
  }

  private clearSlot(slotIndex: number): void {
    // Supprimer les mappings
    this.placePinMap.delete(slotIndex);
    this.placeInfoMap.delete(slotIndex);

    // Réinitialiser le texte
    if (this.placeTextObjects && this.placeTextObjects[slotIndex]) {
      this.placeTextObjects[slotIndex].text = `Place ${slotIndex}`;
    }

    // Désactiver le toggle
    if (this.placeToggles[slotIndex]) {
      this.placeToggles[slotIndex].sceneObject.enabled = false;
      this.placeToggles[slotIndex].isToggledOn = false;
    }
  }

  private clearAllPlaces(): void {
    if (this.enableDebugLogs) log.i("Clearing all places from list");

    for (let i = 0; i < this.placeToggles.length; i++) {
      this.clearSlot(i);
    }
  }

  private formatPlaceName(name: string): string {
    // Limiter la longueur du nom pour l'affichage
    const maxLength = 30;
    if (name.length > maxLength) {
      return name.substring(0, maxLength - 3) + "...";
    }
    return name;
  }

  private handleToggleChanged(slotIndex: number, isOn: boolean): void {
    if (this.enableDebugLogs) {
      log.i(`Toggle ${slotIndex} changed to: ${isOn}`);
    }

    const pin = this.placePinMap.get(slotIndex);
    if (pin) {
      // Activer/désactiver la visibilité du pin
      pin.sceneObject.enabled = isOn;
      
      if (this.enableDebugLogs) {
        const placeInfo = this.placeInfoMap.get(slotIndex);
        log.i(`Pin visibility for "${placeInfo?.name}" set to: ${isOn}`);
      }
    }
  }

  private handlePlacesButtonPressed(event: InteractorEvent): void {
    if (this.enableDebugLogs) {
      log.i("Places button pressed!");
    }

    if (this.isVisible) {
      this.animateOut();
    } else {
      this.animateIn();
    }
  }

  private handleCloseButtonPressed(event: InteractorEvent): void {
    if (this.enableDebugLogs) {
      log.i("Close button pressed!");
    }

    this.animateOut();
  }

  public animateIn(): void {
    if (this.isVisible && !this.isAnimating) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    if (this.enableDebugLogs) log.i("Animating Places Clam IN");

    this.isAnimating = true;
    this.isVisible = true;
    this.placesContainer.enabled = true;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = this.placesTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.hiddenPositionY, this.visiblePositionY, t);
        this.placesTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Places Clam animation IN complete");
      }
    });
  }

  public animateOut(): void {
    if (!this.isVisible && !this.isAnimating && !this.placesContainer.enabled) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    if (this.enableDebugLogs) log.i("Animating Places Clam OUT");

    this.isAnimating = true;
    const startY = this.placesTransform.getLocalPosition().y;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.placesTransform.getLocalPosition();
        pos.y = MathUtils.lerp(startY, this.hiddenPositionY, t);
        this.placesTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.isVisible = false;
        this.placesContainer.enabled = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Places Clam animation OUT complete");
      }
    });
  }

  public showImmediate(): void {
    if (this.currentAnimation) this.currentAnimation();
    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.visiblePositionY;
    this.placesTransform.setLocalPosition(pos);
    this.isVisible = true;
    this.isAnimating = false;
    this.placesContainer.enabled = true;
  }

  public hideImmediate(): void {
    if (this.currentAnimation) this.currentAnimation();
    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.placesTransform.setLocalPosition(pos);
    this.isVisible = false;
    this.isAnimating = false;
    this.placesContainer.enabled = false;
  }

  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  // Méthode utilitaire pour forcer le rafraîchissement de la liste
  public refreshPlacesList(): void {
    if (this.enableDebugLogs) log.i("Refreshing places list");
    
    // Réinitialiser tous les slots
    this.clearAllPlaces();

    // Récupérer tous les pins actuels depuis le MapController
    const mapController = this.mapComponent.mapController;
    if (mapController) {
      // Cette méthode nécessiterait un accès au pinSet du MapController
      // Pour l'instant, les places seront ajoutées automatiquement via les événements
      if (this.enableDebugLogs) log.i("Places will be added via pin events");
    }
  }
}