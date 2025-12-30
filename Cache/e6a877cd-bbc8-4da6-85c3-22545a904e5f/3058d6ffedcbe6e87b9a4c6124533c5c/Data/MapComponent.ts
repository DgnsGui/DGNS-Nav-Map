import Event, { callback, PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";
import { calculateZoomOffset, findScriptComponent, MapParameter } from "./MapUtils";
import { AIResponseAnimator } from "../../AIFrameAnimator";
import { PlacesClamAnimator } from "../../PlacesClamAnimator";

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
  @ui.label("Rotations")
  @input
  isMinimapAutoRotate: boolean;
  @input
  enableMapSmoothing: boolean;
  @ui.label("How often map should be updated (seconds)")
  @input
  mapUpdateThreshold: number;

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
  @hint("Nombre de places placeholder si l'API échoue")
  fallbackPlacesCount: number = 10;

  @input
  @hint("Script qui anime le container de réponse AI")
  aiResponseAnimator: ScriptComponent;

  @input
  @hint("Script qui anime le Places Clam")
  placesResponseAnimator: ScriptComponent;

  private componentPrefab: ObjectPrefab = requireAsset("../Prefabs/Map Controller.prefab") as ObjectPrefab;

  public mapController: MapController;

  private onMiniMapToggledEvent = new Event<boolean>();
  onMiniMapToggled: PublicApi<boolean> = this.onMiniMapToggledEvent.publicApi();

  private placesData: PlaceItem[] = [];
  private nearbyPlacesCache: any[] = [];
  private placesUIShown: boolean = false;
  private isCollectingPins: boolean = false;

  private aiAnimator: AIResponseAnimator;
  private placesAnimator: PlacesClamAnimator;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    this.aiAnimator = this.aiResponseAnimator as unknown as AIResponseAnimator;
    this.placesAnimator = this.placesResponseAnimator as unknown as PlacesClamAnimator;

    const mapComponentInstance = this.componentPrefab.instantiate(this.getSceneObject());
    this.mapController = findScriptComponent(mapComponentInstance, "isMapComponent") as unknown as MapController;

    const mapFocusPosition = new vec2(0.5, 0.5);

    const mapParameters: MapParameter = {
      tileCount: this.tileCount,
      renderParent: this.mapRenderParent,
      mapUpdateThreshold: this.mapUpdateThreshold,
      setMapToCustomLocation: false,
      mapLocation: null,
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

    // Démarre toujours en mode plein écran (plus de startedAsMiniMap)
    this.mapController.initialize(mapParameters, false);
    this.setupPinCollection();

    if (this.autoRotateToggleButton) {
      this.setupAutoRotateToggleButton();
    }

    if (this.placesClamCloseButton) {
      this.placesClamCloseButton.onButtonPinched.add(() => {
        this.closePlacesClam();
      });
    }
  }

  private setupPinCollection(): void {
    this.subscribeOnMapAddPin((pin: MapPin) => {
      if (!this.isCollectingPins) return;

      const pinIndex = this.placesData.length;
      const isActive = pinIndex < 3;

      print("Pin collected: " + (pin.placeInfo ? pin.placeInfo.name : pin.sceneObject.name) + " (index: " + pinIndex + ", active: " + isActive + ")");

      const placeItem: PlaceItem = {
        name: pin.placeInfo ? pin.placeInfo.name : pin.sceneObject.name,
        longitude: pin.location ? pin.location.longitude : 0,
        latitude: pin.location ? pin.location.latitude : 0,
        pin: pin,
        questMarker: undefined,
        isActive: isActive
      };

      this.placesData.push(placeItem);
      print("Total pins collected: " + this.placesData.length);

      if (isActive) {
        this.showPlacePin(pin);
      } else {
        this.hidePlacePin(pin);
      }
    });
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

  openPlacesClam(categoryName?: string[]): void {
    if (!this.placesClamContainer || !this.placesAnimator) return;

    if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(true);
    }

    if (this.placesData.length > 0) {
      print("Reopening with existing " + this.placesData.length + " places");
      this.populatePlacesList();
      this.placesAnimator.animateIn();
    } else {
      const categories = categoryName || ["restaurant", "cafe", "bar"];
      this.loadNearbyPlaces(categories);
    }
  }

  closePlacesClam(): void {
    if (this.placesAnimator) {
      print("Closing Places Clam (keeping data)");
      this.placesAnimator.animateOut();
    }
  }

  private loadNearbyPlaces(categoryName: string[]): void {
    print("=== loadNearbyPlaces START ===");
    this.placesData = [];
    this.nearbyPlacesCache = [];
    this.placesUIShown = false;
    this.isCollectingPins = true;

    let timeoutTriggered = false;
    const timeoutEvent = this.createEvent("DelayedCallbackEvent");
    timeoutEvent.bind(() => {
      if (!this.placesUIShown) {
        print("Timeout reached, checking collected pins...");
        timeoutTriggered = true;
        this.isCollectingPins = false;

        this.placesUIShown = true;
        this.delayedShowPlacesUI();
      }
    });
    timeoutEvent.reset(3.0);

    print("Calling showNearbyPlaces with categories: " + categoryName.join(", "));
    this.mapController.showNearbyPlaces(categoryName);
  }

  private delayedShowPlacesUI(): void {
    print("=== delayedShowPlacesUI ===");
    if (this.placesClamContainer) {
      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        print("Showing UI with " + this.placesData.length + " places");

        if (this.placesData.length === 0) {
          print("No places found, creating fallback");
          this.createFallbackPlaces();
        }

        this.populatePlacesList();

        const syncDelays = [1.0, 2.0, 3.0];
        syncDelays.forEach(delay => {
          const syncDelayEvent = this.createEvent("DelayedCallbackEvent");
          syncDelayEvent.bind(() => {
            print("Syncing quest markers at " + delay + "s...");
            this.applyQuestMarkersState();
          });
          syncDelayEvent.reset(delay);
        });

        this.placesAnimator.animateIn();
      });
      delayEvent.reset(0.5);
    }
  }

  private createFallbackPlaces(): void {
    for (let i = 0; i < this.fallbackPlacesCount; i++) {
      this.placesData.push({
        name: "Place " + i,
        longitude: 0,
        latitude: 0,
        pin: null,
        questMarker: undefined,
        isActive: i < 3
      });
    }
  }

  // === Le reste du code reste inchangé (populatePlacesList, toggle, etc.) ===

  private populatePlacesList(): void {
    print("=== populatePlacesList with " + this.placesData.length + " items ===");
    if (!this.placesListParent || !this.placeItemPrefab) {
      print("ERROR: placesListParent or placeItemPrefab not set!");
      return;
    }

    this.clearPlacesList();

    let currentY = 0;
    for (let i = 0; i < this.placesData.length; i++) {
      const place = this.placesData[i];
      print("Creating UI for place " + i + ": " + place.name);

      const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
      place.uiObject = itemInstance;

      const itemTransform = itemInstance.getTransform();
      const pos = itemTransform.getLocalPosition();
      pos.y = currentY;
      itemTransform.setLocalPosition(pos);
      currentY += this.placeItemSpacing;

      this.setPlaceItemText(itemInstance, place.name);
      this.setupPlaceToggle(itemInstance, place, i);

      if (place.pin) {
        if (place.isActive) {
          this.showPlacePin(place.pin);
        } else {
          this.hidePlacePin(place.pin);
        }
      }

      if (place.questMarker) {
        if (place.isActive) {
          this.showQuestMarker(place.questMarker);
        } else {
          this.hideQuestMarker(place.questMarker);
        }
      }
    }
    print("=== populatePlacesList DONE ===");
  }

  private setPlaceItemText(itemObject: SceneObject, placeName: string): void {
    const textComponent = this.findTextInChildren(itemObject);
    if (textComponent) {
      textComponent.text = placeName;
    }
  }

  private setupPlaceToggle(itemObject: SceneObject, place: PlaceItem, index: number): void {
    for (let i = 0; i < itemObject.getChildrenCount(); i++) {
      const child = itemObject.getChild(i);

      if (child.name === "Switch" || child.name.includes("Switch")) {
        const childComponents = child.getComponents("Component.ScriptComponent");

        for (let j = 0; j < childComponents.length; j++) {
          const switchComponent = childComponents[j] as any;

          if (switchComponent.constructor.name === "Switch" || (switchComponent.typeName && switchComponent.typeName === "Switch")) {
            try {
              switchComponent.isOn = place.isActive;
            } catch (e) { }

            if (switchComponent.onStateChanged && typeof switchComponent.onStateChanged.add === "function") {
              switchComponent.onStateChanged.add(() => {
                const newState = switchComponent.isOn;
                this.togglePlace(index, newState);
              });
              return;
            }
          }
        }
      }
    }
  }

  togglePlace(index: number, isActive: boolean): void {
    if (index < 0 || index >= this.placesData.length) return;

    const place = this.placesData[index];
    if (place.isActive === isActive) return;

    place.isActive = isActive;

    if (place.pin) {
      if (isActive) {
        this.showPlacePin(place.pin);
        if (place.questMarker) this.showQuestMarker(place.questMarker);
      } else {
        this.hidePlacePin(place.pin);
        if (place.questMarker) this.hideQuestMarker(place.questMarker);
      }
    }
  }

  private hidePlacePin(pin: MapPin): void {
    if (pin.sceneObject) pin.sceneObject.enabled = false;
  }

  private showPlacePin(pin: MapPin): void {
    if (pin.sceneObject) pin.sceneObject.enabled = true;
  }

  private hideQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      const sceneObject = questMarker.transform.getSceneObject();
      if (sceneObject) sceneObject.enabled = false;
    }
  }

  private showQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      const sceneObject = questMarker.transform.getSceneObject();
      if (sceneObject) sceneObject.enabled = true;
    }
  }

  private findTextInChildren(parent: SceneObject): Text | null {
    const queue: SceneObject[] = [parent];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const textComponents = current.getComponents("Component.Text");

      if (textComponents && textComponents.length > 0) {
        return textComponents[0] as Text;
      }

      for (let i = 0; i < current.getChildrenCount(); i++) {
        queue.push(current.getChild(i));
      }
    }

    return null;
  }

  private clearPlacesList(): void {
    if (!this.placesListParent) return;

    const childCount = this.placesListParent.getChildrenCount();
    for (let i = childCount - 1; i >= 0; i--) {
      this.placesListParent.getChild(i).destroy();
    }
  }

  linkQuestMarkerToPlace(pin: MapPin, questMarker: any): void {
    const place = this.placesData.find(p => p.pin === pin);
    if (place) {
      place.questMarker = questMarker;
      if (questMarker && questMarker.transform) {
        const sceneObject = questMarker.transform.getSceneObject();
        if (sceneObject) sceneObject.enabled = false;
      }

      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        if (place.isActive) {
          this.showQuestMarker(questMarker);
        }
      });
      delayEvent.reset(0.2);
    }
  }

  public applyQuestMarkersState(): void {
    for (const place of this.placesData) {
      if (place.questMarker) {
        if (place.isActive) {
          this.showQuestMarker(place.questMarker);
        } else {
          this.hideQuestMarker(place.questMarker);
        }
      }
    }
  }

  public forceHideAllQuestMarkersThenShow(): void {
    const mapControllerAny = this.mapController as any;
    if (mapControllerAny.questMarkers) {
      for (const marker of mapControllerAny.questMarkers) {
        if (marker && marker.transform) {
          const sceneObject = marker.transform.getSceneObject();
          if (sceneObject) sceneObject.enabled = false;
        }
      }
    }

    for (const place of this.placesData) {
      if (place.questMarker && place.isActive) {
        this.showQuestMarker(place.questMarker);
      }
    }
  }

  // === Méthodes publiques déléguées vers MapController (inchangées) ===
  setMinimapAutoRotate(enabled: boolean): void {
    this.isMinimapAutoRotate = enabled;
    this.mapController?.setMinimapAutoRotate(enabled);
  }

  getMinimapAutoRotate(): boolean {
    return this.isMinimapAutoRotate;
  }

  subscribeOnMaptilesLoaded(fn: () => void): void { this.mapController.onMapTilesLoaded.add(fn); }
  subscribeOnInitialLocationSet(fn: () => void): void { this.mapController.onInitialLocationSet.add(fn); }
  subscribeOnUserLocationFirstSet(fn: () => void): void { this.mapController.onUserLocationSet.add(fn); }
  subscribeOnTileCameIntoView(fn: () => void): void { this.mapController.onTileCameIntoView.add(fn); }
  subscribeOnTileWentOutOfView(fn: () => void): void { this.mapController.onTileWentOutOfView.add(fn); }
  subscribeOnMapCentered(fn: callback<void>): void { this.mapController.onMapCentered.add(fn); }
  subscribeOnMapAddPin(fn: callback<MapPin>): void { this.mapController.onMapPinAdded.add(fn); }
  subscribeOnMapPinRemoved(fn: callback<MapPin>): void { this.mapController.onMapPinRemoved.add(fn); }
  subscribeOnAllMapPinsRemoved(fn: callback<void>): void { this.mapController.onAllMapPinsRemoved.add(fn); }
  subscribeOnMapScrolled(fn: callback<void>): void { this.mapController.onMapScrolled.add(fn); }
  subscribeOnNoNearbyPlacesFound(fn: callback<void>): void { this.mapController.onNoNearbyPlacesFound.add(fn); }
  subscribeOnNearbyPlacesFailed(fn: callback<void>): void { this.mapController.onNearbyPlacesFailed.add(fn); }

  getInitialMapTileLocation(): GeoPosition { return this.mapController.getInitialMapTileLocation(); }
  setUserPinRotated(value: boolean): void { this.mapController.setUserPinRotated(value); }
  setMapScrolling(value: boolean): void { this.mapController.setMapScrolling(value); }
  getUserLocation(): GeoPosition { return this.mapController.getUserLocation(); }
  getUserHeading(): number { return this.mapController.getUserHeading(); }
  getUserOrientation(): quat { return this.mapController.getUserOrientation(); }

  createMapPin(longitude: number, latitude: number): MapPin {
    const location = GeoPosition.create();
    location.longitude = longitude;
    location.latitude = latitude;
    return this.mapController.createMapPin(location);
  }

  createMapPinAtUserLocation(): MapPin { return this.mapController.createMapPinAtUserLocation(); }
  addPinByLocalPosition(localPosition: vec2): MapPin { return this.mapController.addPinByLocalPosition(localPosition); }
  removeMapPin(mapPin: MapPin): void { this.mapController.removeMapPin(mapPin); }
  removeMapPins(): void { this.mapController.removeMapPins(); }
  centerMap(): void { this.mapController?.centerMap(); }
  showNeaybyPlaces(categoryName: string[]): void { this.openPlacesClam(categoryName); }
  isMapCentered(): boolean { return this.mapController.isMapCentered(); }

  updateHover(localPosition: vec2): void { this.mapController.handleHoverUpdate(localPosition); }
  startTouch(localPosition: vec2): void { this.mapController.handleTouchStart(localPosition); }
  updateTouch(localPosition: vec2): void { this.mapController.handleTouchUpdate(localPosition); }
  endTouch(localPosition: vec2): void { this.mapController.handleTouchEnd(localPosition); }
  zoomIn(): void { this.mapController.handleZoomIn(); }
  zoomOut(): void { this.mapController.handleZoomOut(); }

  toggleMiniMap(isOn: boolean): void {
    this.mapController.toggleMiniMap(isOn);
    this.onMiniMapToggledEvent.invoke(isOn);
  }

  drawGeometryPoint(geometry: any, radius: any): void { this.mapController.drawGeometryPoint(geometry, radius); }
  drawGeometryLine(geometry: any, thickness: any): void { this.mapController.drawGeometryLine(geometry, thickness); }
  drawGeometryMultiline(geometry: any, thickness: any): void { this.mapController.drawGeometryMultiline(geometry, thickness); }
  clearGeometry(): void { this.mapController.clearGeometry(); }
}