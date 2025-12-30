import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { MapComponent } from "./MapComponent";
import { MapPin } from "./MapPin";
import { PlaceInfo } from "./SnapPlacesProvider";

const TAG = "[PlacesListManager]";
const log = new NativeLogger(TAG);

type PlaceItem = {
  info: PlaceInfo;
  listButton: PinchButton;
  mapPin: MapPin | null;
  questMarker: SceneObject | null;
  isActive: boolean;
};

@component
export class PlacesListManager extends BaseScriptComponent {
  @input
  @hint("Le container principal qui contient la liste")
  private listContainer: SceneObject;

  @input
  @hint("Le bouton X pour fermer la liste")
  private closeButton: PinchButton;

  @input
  @hint("Le composant MapComponent")
  private mapComponent: MapComponent;

  @input
  @hint("Prefab du bouton de place (avec toggle)")
  private placeButtonPrefab: ObjectPrefab;

  @input
  @hint("Parent où instancier les boutons de place")
  private buttonsParent: SceneObject;

  @input
  @hint("Position Y quand le container est caché")
  private hiddenPositionY: number = -30;

  @input
  @hint("Position Y quand le container est visible")
  private visiblePositionY: number = 0;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private containerTransform: Transform;
  private isVisible: boolean = false;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;

  private placeItems: PlaceItem[] = [];

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== PlacesListManager INITIALIZATION ===");

    if (!this.listContainer) {
      log.e("List container not assigned!");
      return;
    }

    if (!this.closeButton) {
      log.e("Close button not assigned!");
      return;
    }

    if (!this.mapComponent) {
      log.e("MapComponent not assigned!");
      return;
    }

    this.containerTransform = this.listContainer.getTransform();
    
    // Position initiale cachée
    const pos = this.containerTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.containerTransform.setLocalPosition(pos);
    this.listContainer.enabled = false;

    // Connecter le bouton X
    this.closeButton.onButtonPinched.add(() => {
      this.hidePlacesList();
    });

    if (this.enableDebugLogs) log.i("PlacesListManager initialized successfully");
  }

  /**
   * Affiche la liste des places
   * @param places Les informations des places à afficher
   */
  public showPlacesList(places: PlaceInfo[]): void {
    if (this.enableDebugLogs) log.i(`Showing places list with ${places.length} places`);

    // Nettoyer la liste existante
    this.clearPlacesList();

    // Créer les boutons pour chaque place
    places.forEach((placeInfo, index) => {
      this.createPlaceButton(placeInfo, index);
    });

    // Animer l'apparition du container
    this.animateIn();
  }

  /**
   * Crée un bouton pour une place donnée
   */
  private createPlaceButton(placeInfo: PlaceInfo, index: number): void {
    if (!this.placeButtonPrefab || !this.buttonsParent) {
      log.e("Place button prefab or buttons parent not assigned!");
      return;
    }

    // Instancier le prefab
    const buttonInstance = this.placeButtonPrefab.instantiate(this.buttonsParent);
    
    // Trouver le PinchButton dans l'instance
    const pinchButton = this.findPinchButton(buttonInstance);
    if (!pinchButton) {
      log.e("Could not find PinchButton in place button prefab!");
      return;
    }

    // Trouver le Text component pour afficher le nom
    const textComponent = this.findTextComponent(buttonInstance);
    if (textComponent) {
      textComponent.text = `${placeInfo.name}`;
    }

    // Créer l'objet PlaceItem
    const placeItem: PlaceItem = {
      info: placeInfo,
      listButton: pinchButton,
      mapPin: null,
      questMarker: null,
      isActive: false
    };

    // Connecter le toggle
    pinchButton.onButtonPinched.add(() => {
      this.togglePlace(placeItem);
    });

    this.placeItems.push(placeItem);

    if (this.enableDebugLogs) log.i(`Created button for place: ${placeInfo.name}`);
  }

  /**
   * Active ou désactive une place (pin + quest marker)
   */
  private togglePlace(placeItem: PlaceItem): void {
    placeItem.isActive = !placeItem.isActive;

    if (this.enableDebugLogs) {
      log.i(`Toggle place: ${placeItem.info.name} -> ${placeItem.isActive ? 'ACTIVE' : 'INACTIVE'}`);
    }

    if (placeItem.isActive) {
      // Activer: créer le pin et le quest marker
      this.activatePlace(placeItem);
    } else {
      // Désactiver: supprimer le pin et le quest marker
      this.deactivatePlace(placeItem);
    }

    // Optionnel: mettre à jour le visuel du bouton
    this.updateButtonVisual(placeItem);
  }

  /**
   * Active une place (crée pin et quest marker)
   */
  private activatePlace(placeItem: PlaceItem): void {
    const info = placeItem.info;

    // Créer le map pin
    placeItem.mapPin = this.mapComponent.createMapPin(
      info.centroid.longitude,
      info.centroid.latitude
    );

    // TODO: Créer le quest marker dans le monde réel
    // Vous devrez adapter cette partie selon votre système de quest markers
    // placeItem.questMarker = this.createQuestMarker(info);

    if (this.enableDebugLogs) log.i(`Activated place: ${info.name}`);
  }

  /**
   * Désactive une place (supprime pin et quest marker)
   */
  private deactivatePlace(placeItem: PlaceItem): void {
    // Supprimer le map pin
    if (placeItem.mapPin) {
      this.mapComponent.removeMapPin(placeItem.mapPin);
      placeItem.mapPin = null;
    }

    // Supprimer le quest marker
    if (placeItem.questMarker) {
      placeItem.questMarker.destroy();
      placeItem.questMarker = null;
    }

    if (this.enableDebugLogs) log.i(`Deactivated place: ${placeItem.info.name}`);
  }

  /**
   * Met à jour le visuel du bouton selon son état
   */
  private updateButtonVisual(placeItem: PlaceItem): void {
    // TODO: Adapter selon votre design
    // Par exemple, changer la couleur, l'opacité, etc.
    // Vous pouvez accéder aux composants visuels via placeItem.listButton.getSceneObject()
  }

  /**
   * Cache la liste des places avec animation
   */
  private hidePlacesList(): void {
    if (!this.isVisible && !this.isAnimating) return;

    if (this.enableDebugLogs) log.i("Hiding places list");

    // Désactiver toutes les places actives
    this.placeItems.forEach(item => {
      if (item.isActive) {
        this.deactivatePlace(item);
        item.isActive = false;
      }
    });

    // Animer la sortie
    this.animateOut();
  }

  /**
   * Nettoie la liste des places
   */
  private clearPlacesList(): void {
    // Désactiver et supprimer toutes les places
    this.placeItems.forEach(item => {
      if (item.isActive) {
        this.deactivatePlace(item);
      }
      // Détruire le bouton
      if (item.listButton) {
        item.listButton.getSceneObject().destroy();
      }
    });

    this.placeItems = [];

    if (this.enableDebugLogs) log.i("Cleared places list");
  }

  /**
   * Anime l'apparition du container
   */
  private animateIn(): void {
    if (this.isVisible && !this.isAnimating) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    this.isAnimating = true;
    this.isVisible = true;
    this.listContainer.enabled = true;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = this.containerTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.hiddenPositionY, this.visiblePositionY, t);
        this.containerTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Animate in completed");
      }
    });
  }

  /**
   * Anime la disparition du container
   */
  private animateOut(): void {
    if (!this.isVisible && !this.isAnimating && !this.listContainer.enabled) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    this.isAnimating = true;
    const startY = this.containerTransform.getLocalPosition().y;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.containerTransform.getLocalPosition();
        pos.y = MathUtils.lerp(startY, this.hiddenPositionY, t);
        this.containerTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.isVisible = false;
        this.listContainer.enabled = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Animate out completed");
      }
    });
  }

  // Méthodes utilitaires

  private findPinchButton(sceneObject: SceneObject): PinchButton | null {
    // Chercher dans l'objet et ses enfants
    const button = sceneObject.getComponent("Component.PinchButton");
    if (button) return button as PinchButton;

    for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
      const child = sceneObject.getChild(i);
      const found = this.findPinchButton(child);
      if (found) return found;
    }

    return null;
  }

  private findTextComponent(sceneObject: SceneObject): Text | null {
    // Chercher dans l'objet et ses enfants
    const text = sceneObject.getComponent("Component.Text");
    if (text) return text as Text;

    for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
      const child = sceneObject.getChild(i);
      const found = this.findTextComponent(child);
      if (found) return found;
    }

    return null;
  }

  // Méthodes publiques d'accès

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getIsAnimating(): boo