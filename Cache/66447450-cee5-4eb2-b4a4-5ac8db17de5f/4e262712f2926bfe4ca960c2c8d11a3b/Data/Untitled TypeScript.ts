import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

// Types pour PlaceInfo (depuis SnapPlacesProvider)
export type Address = {
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  country_code: string;
};

export type time = {
  hour: number;
  minute: number;
};

export type timeInterval = {
  start_hour: time;
  end_hour: time;
};

export type dayHours = {
  day: string;
  hours: timeInterval[];
};

export type openingHours = {
  dayHours: dayHours[];
  time_zone: string;
};

export type PlaceInfo = {
  placeId: string;
  category: string;
  name: string;
  phone_number: string;
  address: Address;
  opening_hours: openingHours;
  centroid: GeoPosition;
};

const TAG = "[PlacesListController]";
const log = new NativeLogger(TAG);

/**
 * Représente un item dans la liste des places
 */
class PlaceListItem {
  public sceneObject: SceneObject;
  public toggleButton: PinchButton;
  public nameText: Text;
  public addressText: Text;
  public toggleOnVisual: SceneObject;
  public toggleOffVisual: SceneObject;
  public placeInfo: PlaceInfo;
  public mapPin: any; // MapPin type
  public questMarker: SceneObject;
  public isActive: boolean = false;

  constructor(
    sceneObject: SceneObject,
    toggleButton: PinchButton,
    nameText: Text,
    addressText: Text,
    toggleOnVisual: SceneObject,
    toggleOffVisual: SceneObject
  ) {
    this.sceneObject = sceneObject;
    this.toggleButton = toggleButton;
    this.nameText = nameText;
    this.addressText = addressText;
    this.toggleOnVisual = toggleOnVisual;
    this.toggleOffVisual = toggleOffVisual;
  }

  public setPlaceData(placeInfo: PlaceInfo, mapPin: any, questMarker: SceneObject): void {
    this.placeInfo = placeInfo;
    this.mapPin = mapPin;
    this.questMarker = questMarker;

    // Met à jour les textes
    if (this.nameText) {
      this.nameText.text = placeInfo.name || "Unknown Place";
    }

    if (this.addressText) {
      const address = placeInfo.address;
      const addressStr = `${address.street_address || ""}, ${address.locality || ""}`.trim();
      this.addressText.text = addressStr || "No address";
    }

    // Désactive par défaut le pin et marker
    this.setActive(false);
  }

  public setActive(active: boolean): void {
    this.isActive = active;
    this.updateVisuals();
    this.updatePinAndMarker();
  }

  public toggle(): void {
    this.setActive(!this.isActive);
  }

  private updateVisuals(): void {
    if (this.toggleOnVisual) {
      this.toggleOnVisual.enabled = this.isActive;
    }
    if (this.toggleOffVisual) {
      this.toggleOffVisual.enabled = !this.isActive;
    }
  }

  private updatePinAndMarker(): void {
    // Met à jour le pin (MapPin object)
    if (this.mapPin && this.mapPin.getSceneObject) {
      const pinObject = this.mapPin.getSceneObject();
      if (pinObject) {
        pinObject.enabled = this.isActive;
      }
    }
    
    // Met à jour le quest marker
    if (this.questMarker) {
      this.questMarker.enabled = this.isActive;
    }
  }

  public cleanup(): void {
    if (this.sceneObject) {
      this.sceneObject.destroy();
    }
    this.placeInfo = null;
    this.mapPin = null;
    this.questMarker = null;
  }
}

/**
 * Contrôleur principal pour la liste des places avec toggles
 */
@component
export class PlacesListController extends BaseScriptComponent {
  @input
  @hint("Container principal de la liste (l'ovale)")
  private listContainer: SceneObject;

  @input
  @hint("Bouton X pour fermer la liste")
  private closeButton: PinchButton;

  @input
  @hint("Prefab pour un item de liste (doit contenir: PinchButton, 2x Text, 2x Visual Indicators)")
  private listItemPrefab: ObjectPrefab;

  @input
  @hint("Parent où instancier les items (ScrollView content)")
  private listItemsParent: SceneObject;

  @input
  @hint("Position Y quand caché")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand visible")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  // Noms des composants dans le prefab (à ajuster selon votre prefab)
  @input
  @hint("Nom du SceneObject contenant le PinchButton toggle")
  private toggleButtonName: string = "ToggleButton";

  @input
  @hint("Nom du SceneObject contenant le Text du nom")
  private nameTextName: string = "NameText";

  @input
  @hint("Nom du SceneObject contenant le Text de l'adresse")
  private addressTextName: string = "AddressText";

  @input
  @hint("Nom du SceneObject visual ON")
  private toggleOnVisualName: string = "ToggleOn";

  @input
  @hint("Nom du SceneObject visual OFF")
  private toggleOffVisualName: string = "ToggleOff";

  private listTransform: Transform;
  private isVisible: boolean = false;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;

  // Liste des items actuellement affichés
  private activeItems: PlaceListItem[] = [];

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== PlacesListController INITIALIZATION ===");

    if (!this.listContainer) {
      log.e("List container not assigned!");
      return;
    }

    if (!this.closeButton) {
      log.e("Close button not assigned!");
      return;
    }

    this.listTransform = this.listContainer.getTransform();
    
    // Position initiale = cachée
    const pos = this.listTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.listTransform.setLocalPosition(pos);
    this.listContainer.enabled = false;

    // Configure le bouton de fermeture
    this.closeButton.onButtonPinched.add(() => {
      this.hideList();
    });

    if (this.enableDebugLogs) log.i("PlacesListController initialized successfully");
  }

  /**
   * Affiche la liste avec des places, pins et quest markers
   */
  public showListWithPlaces(
    places: PlaceInfo[],
    pins: any[], // MapPin[]
    questMarkers: SceneObject[]
  ): void {
    if (this.enableDebugLogs) {
      log.i(`Showing list with ${places.length} places`);
    }

    // Nettoie les items existants
    this.clearList();

    // Crée un item pour chaque place
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const pin = pins[i];
      const marker = questMarkers[i];

      const item = this.createListItem(place, pin, marker);
      if (item) {
        this.activeItems.push(item);
      }
    }

    // Affiche le container
    this.animateIn();
  }

  /**
   * Crée un item de liste à partir du prefab
   */
  private createListItem(
    placeInfo: PlaceInfo,
    mapPin: any, // MapPin
    questMarker: SceneObject
  ): PlaceListItem | null {
    if (!this.listItemPrefab || !this.listItemsParent) {
      log.e("List item prefab or parent not assigned!");
      return null;
    }

    // Instancie le prefab
    const itemObject = this.listItemPrefab.instantiate(this.listItemsParent);

    // Trouve les composants dans le prefab
    const toggleButton = this.findPinchButton(itemObject, this.toggleButtonName);
    const nameText = this.findText(itemObject, this.nameTextName);
    const addressText = this.findText(itemObject, this.addressTextName);
    const toggleOnVisual = this.findSceneObject(itemObject, this.toggleOnVisualName);
    const toggleOffVisual = this.findSceneObject(itemObject, this.toggleOffVisualName);

    if (!toggleButton) {
      log.e(`Toggle button not found in prefab (looking for: ${this.toggleButtonName})`);
      itemObject.destroy();
      return null;
    }

    // Crée l'item
    const item = new PlaceListItem(
      itemObject,
      toggleButton,
      nameText,
      addressText,
      toggleOnVisual,
      toggleOffVisual
    );

    // Configure les données
    item.setPlaceData(placeInfo, mapPin, questMarker);

    // Configure le callback du toggle
    toggleButton.onButtonPinched.add(() => {
      item.toggle();
      if (this.enableDebugLogs) {
        log.i(`Place toggled: ${placeInfo.name} - ${item.isActive ? "ON" : "OFF"}`);
      }
    });

    return item;
  }

  /**
   * Nettoie tous les items de la liste
   */
  private clearList(): void {
    for (const item of this.activeItems) {
      item.cleanup();
    }
    this.activeItems = [];
  }

  /**
   * Anime l'apparition de la liste
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
        const pos = this.listTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.hiddenPositionY, this.visiblePositionY, t);
        this.listTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("List animated in");
      }
    });
  }

  /**
   * Cache la liste avec animation
   */
  public hideList(): void {
    if (!this.isVisible && !this.isAnimating) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    this.isAnimating = true;
    const startY = this.listTransform.getLocalPosition().y;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.listTransform.getLocalPosition();
        pos.y = MathUtils.lerp(startY, this.hiddenPositionY, t);
        this.listTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.isVisible = false;
        this.listContainer.enabled = false;
        this.currentAnimation = null;
        
        // Nettoie la liste quand elle est cachée
        this.clearList();
        
        if (this.enableDebugLogs) log.i("List hidden and cleared");
      }
    });
  }

  /**
   * Active tous les places
   */
  public enableAllPlaces(): void {
    for (const item of this.activeItems) {
      item.setActive(true);
    }
  }

  /**
   * Désactive tous les places
   */
  public disableAllPlaces(): void {
    for (const item of this.activeItems) {
      item.setActive(false);
    }
  }

  /**
   * Utilitaires pour trouver les composants dans le prefab
   */
  private findPinchButton(parent: SceneObject, name: string): PinchButton | null {
    const obj = this.findSceneObject(parent, name);
    if (!obj) return null;
    
    // Recherche le PinchButton dans tous les scripts du SceneObject
    const scriptCount = obj.getComponentCount("Component.ScriptComponent");
    for (let i = 0; i < scriptCount; i++) {
      const script = obj.getComponentByIndex("Component.ScriptComponent", i);
      // Vérifie si c'est un PinchButton
      if (script && script.getTypeName && script.getTypeName() === "PinchButton") {
        return script as any as PinchButton;
      }
    }
    
    return null;
  }

  private findText(parent: SceneObject, name: string): Text | null {
    const obj = this.findSceneObject(parent, name);
    if (!obj) return null;
    
    const component = obj.getComponent("Component.Text");
    return component as Text;
  }

  private findSceneObject(parent: SceneObject, name: string): SceneObject | null {
    // Recherche récursive dans les enfants
    return this.findChildByName(parent, name);
  }

  private findChildByName(parent: SceneObject, name: string): SceneObject | null {
    if (parent.name === name) {
      return parent;
    }

    const childCount = parent.getChildrenCount();
    for (let i = 0; i < childCount; i++) {
      const child = parent.getChild(i);
      const found = this.findChildByName(child, name);
      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Getters publics
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getActiveItemsCount(): number {
    return this.activeItems.length;
  }

  public getEnabledPlacesCount(): number {
    return this.activeItems.filter(item => item.isActive).length;
  }
}