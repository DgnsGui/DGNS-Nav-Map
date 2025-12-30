import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[PlacesListController]";
const log = new NativeLogger(TAG);

// Types pour PlaceInfo
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

/**
 * Représente un slot de place dans la liste
 */
class PlaceSlot {
  public placeObject: SceneObject;
  public switchToggle: any; // SwitchToggleGroup component
  public capsuleButton: SceneObject;
  public nameText: Text;
  public placeInfo: PlaceInfo | null = null;
  public mapPin: any | null = null;
  public questMarker: SceneObject | null = null;
  public isActive: boolean = false;

  constructor(
    placeObject: SceneObject,
    switchToggle: any,
    capsuleButton: SceneObject,
    nameText: Text
  ) {
    this.placeObject = placeObject;
    this.switchToggle = switchToggle;
    this.capsuleButton = capsuleButton;
    this.nameText = nameText;
  }

  public setPlaceData(placeInfo: PlaceInfo, mapPin: any, questMarker: SceneObject): void {
    this.placeInfo = placeInfo;
    this.mapPin = mapPin;
    this.questMarker = questMarker;

    // Met à jour le texte du nom
    if (this.nameText) {
      this.nameText.text = placeInfo.name || "Unknown Place";
    }

    // Active le slot
    this.placeObject.enabled = true;

    // État initial = désactivé
    this.setActive(false);
  }

  public setActive(active: boolean): void {
    this.isActive = active;
    
    // Met à jour le toggle visuel
    if (this.switchToggle) {
      this.switchToggle.isOn = active;
    }

    // Active/désactive le pin et le marker
    this.updatePinAndMarker();
  }

  public toggle(): void {
    this.setActive(!this.isActive);
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

  public clear(): void {
    this.placeInfo = null;
    this.mapPin = null;
    this.questMarker = null;
    this.isActive = false;
    this.placeObject.enabled = false;
    
    if (this.nameText) {
      this.nameText.text = "";
    }
  }
}

/**
 * Contrôleur pour la liste des places avec les 10 slots existants
 */
@component
export class PlacesListController extends BaseScriptComponent {
  // === Container et animation ===
  @input
  @hint("Container principal de la liste (ScrollWindowAnchor ou parent)")
  private listContainer: SceneObject;

  @input
  @hint("Bouton X pour fermer la liste")
  private closeButton: PinchButton;

  @input
  @hint("Position Y quand caché")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand visible")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  // === Les 10 slots de places ===
  @ui.separator
  @ui.label("=== PLACE SLOTS (10 slots) ===")
  
  @ui.group_start("Place 0")
  @input private place0Object: SceneObject;
  @input private place0Toggle: SceneObject;
  @input private place0Capsule: SceneObject;
  @input private place0Text: Text;
  @ui.group_end

  @ui.group_start("Place 1")
  @input private place1Object: SceneObject;
  @input private place1Toggle: SceneObject;
  @input private place1Capsule: SceneObject;
  @input private place1Text: Text;
  @ui.group_end

  @ui.group_start("Place 2")
  @input private place2Object: SceneObject;
  @input private place2Toggle: SceneObject;
  @input private place2Capsule: SceneObject;
  @input private place2Text: Text;
  @ui.group_end

  @ui.group_start("Place 3")
  @input private place3Object: SceneObject;
  @input private place3Toggle: SceneObject;
  @input private place3Capsule: SceneObject;
  @input private place3Text: Text;
  @ui.group_end

  @ui.group_start("Place 4")
  @input private place4Object: SceneObject;
  @input private place4Toggle: SceneObject;
  @input private place4Capsule: SceneObject;
  @input private place4Text: Text;
  @ui.group_end

  @ui.group_start("Place 5")
  @input private place5Object: SceneObject;
  @input private place5Toggle: SceneObject;
  @input private place5Capsule: SceneObject;
  @input private place5Text: Text;
  @ui.group_end

  @ui.group_start("Place 6")
  @input private place6Object: SceneObject;
  @input private place6Toggle: SceneObject;
  @input private place6Capsule: SceneObject;
  @input private place6Text: Text;
  @ui.group_end

  @ui.group_start("Place 7")
  @input private place7Object: SceneObject;
  @input private place7Toggle: SceneObject;
  @input private place7Capsule: SceneObject;
  @input private place7Text: Text;
  @ui.group_end

  @ui.group_start("Place 8")
  @input private place8Object: SceneObject;
  @input private place8Toggle: SceneObject;
  @input private place8Capsule: SceneObject;
  @input private place8Text: Text;
  @ui.group_end

  @ui.group_start("Place 9")
  @input private place9Object: SceneObject;
  @input private place9Toggle: SceneObject;
  @input private place9Capsule: SceneObject;
  @input private place9Text: Text;
  @ui.group_end

  @ui.separator
  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private listTransform: Transform;
  private isVisible: boolean = false;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;

  // Tableau des slots
  private slots: PlaceSlot[] = [];

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

    // Initialise les 10 slots
    this.initializeSlots();

    // Configure le bouton de fermeture
    this.closeButton.onButtonPinched.add(() => {
      this.hideList();
    });

    if (this.enableDebugLogs) log.i("PlacesListController initialized successfully");
  }

  private initializeSlots(): void {
    // Crée les slots et configure les callbacks
    this.slots = [
      this.createSlot(0, this.place0Object, this.place0Toggle, this.place0Capsule, this.place0Text),
      this.createSlot(1, this.place1Object, this.place1Toggle, this.place1Capsule, this.place1Text),
      this.createSlot(2, this.place2Object, this.place2Toggle, this.place2Capsule, this.place2Text),
      this.createSlot(3, this.place3Object, this.place3Toggle, this.place3Capsule, this.place3Text),
      this.createSlot(4, this.place4Object, this.place4Toggle, this.place4Capsule, this.place4Text),
      this.createSlot(5, this.place5Object, this.place5Toggle, this.place5Capsule, this.place5Text),
      this.createSlot(6, this.place6Object, this.place6Toggle, this.place6Capsule, this.place6Text),
      this.createSlot(7, this.place7Object, this.place7Toggle, this.place7Capsule, this.place7Text),
      this.createSlot(8, this.place8Object, this.place8Toggle, this.place8Capsule, this.place8Text),
      this.createSlot(9, this.place9Object, this.place9Toggle, this.place9Capsule, this.place9Text),
    ];

    // Désactive tous les slots au départ
    this.slots.forEach(slot => {
      if (slot && slot.placeObject) {
        slot.placeObject.enabled = false;
      }
    });
  }

  private createSlot(
    index: number,
    placeObject: SceneObject,
    switchToggleObject: SceneObject,
    capsuleButton: SceneObject,
    nameText: Text
  ): PlaceSlot | null {
    if (!placeObject || !switchToggleObject) {
      log.w(`Place ${index} not properly configured`);
      return null;
    }

    // Trouve le component SwitchToggleGroup sur le SceneObject
    const switchToggle = this.findSwitchToggleGroup(switchToggleObject);
    if (!switchToggle) {
      log.w(`SwitchToggleGroup not found on Place ${index} toggle object`);
      return null;
    }

    const slot = new PlaceSlot(placeObject, switchToggle, capsuleButton, nameText);

    // Configure le callback du toggle
    if (switchToggle.onToggleChanged) {
      switchToggle.onToggleChanged.add((isOn: boolean) => {
        slot.setActive(isOn);
        if (this.enableDebugLogs) {
          log.i(`Place ${index} toggled: ${isOn ? "ON" : "OFF"} - ${slot.placeInfo?.name || "empty"}`);
        }
      });
    }

    return slot;
  }

  /**
   * Trouve le component SwitchToggleGroup sur un SceneObject
   */
  private findSwitchToggleGroup(sceneObject: SceneObject): any | null {
    if (!sceneObject) return null;
    
    const scriptCount = sceneObject.getComponentCount("Component.ScriptComponent");
    for (let i = 0; i < scriptCount; i++) {
      const script = sceneObject.getComponentByIndex("Component.ScriptComponent", i);
      if (script && script.getTypeName && script.getTypeName() === "SwitchToggleGroup") {
        return script;
      }
    }
    
    return null;
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

    // Nettoie tous les slots d'abord
    this.clearAllSlots();

    // Remplit les slots avec les places (max 10)
    const maxPlaces = Math.min(places.length, 10);
    for (let i = 0; i < maxPlaces; i++) {
      const slot = this.slots[i];
      if (slot) {
        slot.setPlaceData(places[i], pins[i], questMarkers[i]);
      }
    }

    // Affiche le container
    this.animateIn();
  }

  /**
   * Nettoie tous les slots
   */
  private clearAllSlots(): void {
    this.slots.forEach(slot => {
      if (slot) {
        slot.clear();
      }
    });
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
        
        // Nettoie les slots quand la liste est cachée
        this.clearAllSlots();
        
        if (this.enableDebugLogs) log.i("List hidden and cleared");
      }
    });
  }

  /**
   * Active tous les places visibles
   */
  public enableAllPlaces(): void {
    this.slots.forEach(slot => {
      if (slot && slot.placeInfo) {
        slot.setActive(true);
      }
    });
  }

  /**
   * Désactive tous les places
   */
  public disableAllPlaces(): void {
    this.slots.forEach(slot => {
      if (slot && slot.placeInfo) {
        slot.setActive(false);
      }
    });
  }

  /**
   * Getters publics
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getActivePlacesCount(): number {
    return this.slots.filter(slot => slot && slot.placeInfo !== null).length;
  }

  public getEnabledPlacesCount(): number {
    return this.slots.filter(slot => slot && slot.placeInfo !== null && slot.isActive).length;
  }
}