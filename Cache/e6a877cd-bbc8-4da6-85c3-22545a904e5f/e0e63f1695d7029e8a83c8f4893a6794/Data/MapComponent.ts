import Event, { callback, PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";
import { calculateZoomOffset, findScriptComponent, MapParameter } from "./MapUtils";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { AIResponseAnimator } from "../../AIFrameAnimator";

require('LensStudio:ProcessedLocationModule')

interface PlaceItem {
  name: string;
  longitude: number;
  latitude: number;
  pin?: MapPin;
  questMarker?: any;
  isActive: boolean;
  uiObject?: SceneObject;
}

@component
export class MapComponent extends BaseScriptComponent {
  @input
  tileCount: number = 2;

  @input
  mapRenderParent: SceneObject;

  @ui.separator
  @ui.label("Zoom level: 8 far zoom , 21 close zoom")
  @input
  @widget(new SliderWidget(8, 21, 1))
  mapZoomLevel: number;
  
  @ui.separator
  @ui.label("If user pin should be shown in the map")
  @input
  showUserPin: boolean;

  @ui.group_start("User Pin")
  @showIf("showUserPin", true)
  @input
  userPinVisual: ObjectPrefab;
  @input
  userPinScale: vec2;
  @input
  userPinAlignedWithOrientation: boolean;
  @ui.group_end
  
  @ui.separator
  @ui.label("Map Pins")
  @ui.label("Make sure your Pin Prefab has ScreenTransform")
  @input
  mapPinPrefab: ObjectPrefab;
  @input
  @hint("All the map pins will rotate according to map rotation if enabled")
  mapPinsRotated: boolean;
  @input
  @hint("A circle shape detector is used to detect cursor")
  mapPinCursorDetectorSize: number = 0.02;
  
  @ui.separator
  @ui.label("Interactions")
  @input
  enableScrolling: boolean;
  @input
  @hint("Contrôle l'inertie de la carte")
  scrollingFriction: number = 4;
  
  @ui.separator
  @ui.label("For setting map location to custom location")
  @input
  setMapToCustomLocation: boolean;
  @ui.group_start("Custom Location")
  @showIf("setMapToCustomLocation", true)
  @input
  longitude: string;
  @input
  latitude: string;
  @input rotation: number;
  @ui.group_end
  
  @ui.separator
  @ui.label("Rotations")
  @input
  isMinimapAutoRotate: boolean;
  @input
  enableMapSmoothing: boolean;
  @ui.label("How often map should be updated (seconds)")
  @input
  mapUpdateThreshold: number;

  @input
  startedAsMiniMap: boolean;

  @ui.separator
  @ui.label("Auto-Rotation Control")
  @input
  autoRotateToggleButton: PinchButton;

  @ui.separator
  @ui.label("Places Clam Integration")
  @input
  placesClamContainer: SceneObject;
  @input
  placesListParent: SceneObject;
  @input
  placeItemPrefab: ObjectPrefab;
  @input
  @hint("Bouton X pour fermer le Places Clam")
  placesClamCloseButton: PinchButton;
  @input
  @hint("Espacement vertical entre les items")
  placeItemSpacing: number = -5;
  @input
  @hint("Position Y quand l'ovale est visible")
  placesClamVisibleY: number = 15;
  @input
  @hint("Offset Y pour cacher le container")
  placesClamHiddenOffset: number = -30;

  @input
  @hint("Nombre de places placeholder si l'API échoue")
  fallbackPlacesCount: number = 10;

  @input
  aiResponseAnimator: ScriptComponent;

  private componentPrefab: ObjectPrefab = requireAsset("../Prefabs/Map Controller.prefab") as ObjectPrefab;
  
  public mapController: MapController;

  private onMiniMapToggledEvent = new Event<boolean>();
  onMiniMapToggled: PublicApi<boolean> = this.onMiniMapToggledEvent.publicApi();

  private placesData: PlaceItem[] = [];
  private nearbyPlacesCache: any[] = [];
  private placesUIShown: boolean = false;
  
  // Animation du Places Clam
  private placesClamTransform: Transform;
  private placesClamAnimation: CancelFunction | null = null;
  private isPlacesClamAnimating: boolean = false;
  public isPlacesClamVisible: boolean = false;
  private placesClamActualHiddenY: number = 0;
  private placesClamActualVisibleY: number = 0;

  private aiAnimator: AIResponseAnimator;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    this.aiAnimator = this.aiResponseAnimator as unknown as AIResponseAnimator;

    const mapComponentInstance = this.componentPrefab.instantiate(this.getSceneObject());
    this.mapController = findScriptComponent(mapComponentInstance,"isMapComponent") as unknown as MapController;

    let mapLocation: GeoPosition = null;

    if (this.setMapToCustomLocation) {
      mapLocation = GeoPosition.create();
      mapLocation.longitude = parseFloat(this.longitude);
      mapLocation.latitude = parseFloat(this.latitude);
      mapLocation.heading = this.rotation;
    }

    const mapFocusPosition = new vec2(0.5, 0.5);

    const mapParameters: MapParameter = {
      tileCount: this.tileCount,
      renderParent: this.mapRenderParent,
      mapUpdateThreshold: this.mapUpdateThreshold,
      setMapToCustomLocation: this.setMapToCustomLocation,
      mapLocation: mapLocation,
      mapFocusPosition: mapFocusPosition,
      userPinVisual: this.userPinVisual,
      showUserPin: this.showUserPin,
      zoomLevel: this.mapZoomLevel,
      zoomOffet: calculateZoomOffset(this.mapZoomLevel),
      enableScrolling: this.enableScrolling,
      scrollingFriction: this.scrollingFriction,
      userPinScale: this.userPinScale,
      mapPinsRotated: this.mapPinsRotated,
      isMinimapAutoRotate: this.isMinimapAutoRotate,
      userPinAlignedWithOrientation: this.userPinAlignedWithOrientation,
      enableMapSmoothing: this.enableMapSmoothing,
      mapPinPrefab: this.mapPinPrefab,
      mapPinCursorDetectorSize: this.mapPinCursorDetectorSize,
    };

    this.mapController.initialize(mapParameters, this.startedAsMiniMap);

    if (this.autoRotateToggleButton) {
      this.setupAutoRotateToggleButton();
    }

    this.initializePlacesClam();
  }

  private initializePlacesClam(): void {
    if (this.placesClamContainer) {
      this.placesClamTransform = this.placesClamContainer.getTransform();
      const pos = this.placesClamTransform.getLocalPosition();
      
      this.placesClamActualVisibleY = this.placesClamVisibleY;
      this.placesClamActualHiddenY = this.placesClamActualVisibleY + this.placesClamHiddenOffset;
      
      pos.y = this.placesClamActualHiddenY;
      this.placesClamTransform.setLocalPosition(pos);
      this.placesClamContainer.enabled = false;
    }
    
    if (this.placesClamCloseButton) {
      this.placesClamCloseButton.onButtonPinched.add(() => {
        this.closePlacesClam();
      });
    }
  }

  private setupAutoRotateToggleButton(): void {
    if (this.autoRotateToggleButton) {
      this.autoRotateToggleButton.onButtonPinched.add((event: InteractorEvent) => {
        this.isMinimapAutoRotate = !this.isMinimapAutoRotate;
        if (this.mapController) {
          this.mapController.setMinimapAutoRotate(this.isMinimapAutoRotate);
          if (this.isMinimapAutoRotate) {
            this.mapController.centerMap();
          }
        }
      });
    }
  }

  // Places Clam Management
  
  openPlacesClam(categoryName?: string[]): void {
    if (!this.placesClamContainer) return;

    if (this.aiAnimator.getIsVisible()) {
      this.adjustPlacesForAI(true);
    }

    if (this.nearbyPlacesCache.length > 0) {
      this.populatePlacesList();
      this.animatePlacesClamIn();
    } else {
      const categories = categoryName || ["restaurant", "cafe", "bar"];
      this.loadNearbyPlaces(categories);
    }
  }
loadNearbyPlaces(categories: string[]) {
throw new Error("Method not implemented.");
}
populatePlacesList() {
throw new Error("Method not implemented.");
}

  closePlacesClam(): void {
    this.animatePlacesClamOut();
  }
  
  public adjustPlacesForAI(forAI: boolean, callback?: () => void): void {
    if (forAI) {
      this.placesClamActualVisibleY = this.placesClamVisibleY * 2;
      this.placesClamActualHiddenY = this.placesClamActualVisibleY + this.placesClamHiddenOffset;
    } else {
      this.placesClamActualVisibleY = this.placesClamVisibleY;
      this.placesClamActualHiddenY = this.placesClamActualVisibleY + this.placesClamHiddenOffset;
    }

    if (this.isPlacesClamVisible) {
      if (this.isPlacesClamAnimating && this.placesClamAnimation) {
        this.placesClamAnimation();
      }

      this.isPlacesClamAnimating = true;
      const startY = this.placesClamTransform.getLocalPosition().y;

      this.placesClamAnimation = animate({
        duration: 0.5,
        easing: "ease-out-back",
        update: (t: number) => {
          const pos = this.placesClamTransform.getLocalPosition();
          pos.y = MathUtils.lerp(startY, this.placesClamActualVisibleY, t);
          this.placesClamTransform.setLocalPosition(pos);
        },
        ended: () => {
          this.isPlacesClamAnimating = false;
          this.placesClamAnimation = null;
          if (callback) callback();
        }
      });
    } else {
      if (callback) callback();
    }
  }

  private animatePlacesClamIn(): void {
    if (this.isPlacesClamVisible && !this.isPlacesClamAnimating) return;
    if (!this.placesClamContainer || !this.placesClamTransform) return;

    if (this.isPlacesClamAnimating && this.placesClamAnimation) {
      this.placesClamAnimation();
    }

    this.isPlacesClamAnimating = true;
    this.isPlacesClamVisible = true;
    this.placesClamContainer.enabled = true;

    this.placesClamAnimation = animate({
      duration: 0.5,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = this.placesClamTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.placesClamActualHiddenY, this.placesClamActualVisibleY, t);
        this.placesClamTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isPlacesClamAnimating = false;
        this.placesClamAnimation = null;
      }
    });
  }
  
  private animatePlacesClamOut(): void {
    if (!this.isPlacesClamVisible && !this.isPlacesClamAnimating) return;
    if (!this.placesClamContainer || !this.placesClamTransform) return;

    if (this.isPlacesClamAnimating && this.placesClamAnimation) {
      this.placesClamAnimation();
    }

    this.isPlacesClamAnimating = true;
    const startY = this.placesClamTransform.getLocalPosition().y;

    this.placesClamAnimation = animate({
      duration: 0.5,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.placesClamTransform.getLocalPosition();
        pos.y = MathUtils.lerp(startY, this.placesClamActualHiddenY, t);
        this.placesClamTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isPlacesClamAnimating = false;
        this.isPlacesClamVisible = false;
        this.placesClamContainer.enabled = false;
        this.placesClamAnimation = null;

        // Si on ferme Places et que AI est visible, on remet Places à sa position normale
        if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
          this.adjustPlacesForAI(false);
        }
      }
    });
  }

  // ... (le reste du fichier reste identique à la version précédente)
  // Je ne le recopie pas ici pour éviter un message trop long, mais tout ce qui suit 
  // (loadNearbyPlaces, delayedShowPlacesUI, createFallbackPlaces, populatePlacesList, etc.)
  // reste exactement le même que dans la version que je t’ai donnée précédemment.

  // Tu trouveras toutes les fonctions restantes (togglePlace, hidePlacePin, etc.) inchangées.
}