// --- START OF FILE MapComponent.ts (Final Corrected Version) ---

import Event, { callback, PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";
import { calculateZoomOffset, findScriptComponent, MapParameter } from "./MapUtils";
import { AIResponseAnimator } from "../../AIFrameAnimator";
import { PlacesClamAnimator } from "../../PlacesClamAnimator";
import { PlaceInfo } from "./SnapPlacesProvider"; // Assure-toi que cette importation existe

require('LensStudio:ProcessedLocationModule')

interface PlaceItem {
  name: string;
  longitude: number;
  latitude: number;
  pin?: MapPin;
  questMarker?: any;
  isActive: boolean;
  uiObject?: SceneObject;
  placeInfo: PlaceInfo; // Garde une référence aux données brutes
}

@component
export class MapComponent extends BaseScriptComponent {
  // --- TES PROPRIÉTÉS @input RESTENT INCHANGÉES ---
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
  @input
  rotation: number;
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
    
    // S'abonner aux événements du contrôleur pour gérer les résultats de la recherche
    this.mapController.onNearbyPlacesSuccess.add(this.handlePlacesSuccess.bind(this));
    this.mapController.onNoNearbyPlacesFound.add(this.handlePlacesFallback.bind(this));
    this.mapController.onNearbyPlacesFailed.add(this.handlePlacesFallback.bind(this));

    if (this.autoRotateToggleButton) {
      this.setupAutoRotateToggleButton();
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

  openPlacesClam(categoryName?: string[]): void {
    if (!this.placesClamContainer || !this.placesAnimator) return;

    if (this.aiAnimator && this.aiAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(true);
    }
    
    print("Opening Places Clam - requesting nearby places...");
    this.cleanupOldPlacesData();
    
    const categories = categoryName || ["restaurant", "cafe", "bar"];
    this.mapController.showNearbyPlaces(categories);
  }

  closePlacesClam(): void {
    if (this.placesAnimator) {
      print("Closing Places Clam");
      this.placesAnimator.animateOut();
    }
  }

  private handlePlacesSuccess(placesInfo: PlaceInfo[]): void {
    print(`=== handlePlacesSuccess: Received ${placesInfo.length} places ===`);
    
    this.placesData = [];

    for(let i=0; i < placesInfo.length; i++) {
        const info = placesInfo[i];
        const pin = this.mapController.createMapPin(info.centroid, info);
        const isActive = i < 3;

        const placeItem: PlaceItem = {
            name: info.name,
            longitude: info.centroid.longitude,
            latitude: info.centroid.latitude,
            pin: pin,
            questMarker: undefined,
            isActive: isActive,
            placeInfo: info
        };
        this.placesData.push(placeItem);

        if (isActive) this.showPlacePin(pin);
        else this.hidePlacePin(pin);
    }
    
    this.populatePlacesList();
    this.placesAnimator.animateIn();
  }

  private handlePlacesFallback(): void {
    print("=== handlePlacesFallback: No places found or API failed, creating fallback UI ===");
    this.placesData = [];
    this.createFallbackPlaces();
    this.populatePlacesList();
    this.placesAnimator.animateIn();
  }

  private cleanupOldPlacesData(): void {
    print("Cleaning up old places data...");
    if (this.mapController) {
        this.mapController.removeMapPins();
    }
    this.clearPlacesList();
    this.placesData = [];
    print("Cleanup complete");
  }

  private createFallbackPlaces(): void {
    for (let i = 0; i < this.fallbackPlacesCount; i++) {
      this.placesData.push({
        name: `Place ${i + 1}`,
        longitude: 0, latitude: 0,
        pin: null, questMarker: undefined,
        isActive: i < 3,
        placeInfo: null
      });
    }
  }

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
      const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
      place.uiObject = itemInstance;

      const itemTransform = itemInstance.getTransform();
      const pos = itemTransform.getLocalPosition();
      pos.y = currentY;
      itemTransform.setLocalPosition(pos);
      currentY += this.placeItemSpacing;

      this.setPlaceItemText(itemInstance, place.name);
      this.setupPlaceToggle(itemInstance, place, i);
      
      // La visibilité du pin est déjà gérée dans handlePlacesSuccess, pas besoin de le refaire ici.
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
          if (switchComponent.typeName === "Switch") {
            switchComponent.isOn = place.isActive;
            switchComponent.onStateChanged.add(() => {
              this.togglePlace(index, switchComponent.isOn);
            });
            return;
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
        if (isActive) this.showPlacePin(place.pin);
        else this.hidePlacePin(place.pin);
    }
    if (place.questMarker) {
        if (isActive) this.showQuestMarker(place.questMarker);
        else this.hideQuestMarker(place.questMarker);
    }
  }

  private hidePlacePin(pin: MapPin): void {
    if (pin && pin.sceneObject) pin.sceneObject.enabled = false;
  }

  private showPlacePin(pin: MapPin): void {
    if (pin && pin.sceneObject) pin.sceneObject.enabled = true;
  }

  private hideQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) questMarker.transform.getSceneObject().enabled = false;
  }
  
  private showQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) questMarker.transform.getSceneObject().enabled = true;
  }

  private findTextInChildren(parent: SceneObject): Text | null {
    const queue: SceneObject[] = [parent];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const textComponents = current.getComponents("Component.Text");
      if (textComponents && textComponents.length > 0) return textComponents[0] as Text;
      for (let i = 0; i < current.getChildrenCount(); i++) queue.push(current.getChild(i));
    }
    return null;
  }

  private clearPlacesList(): void {
    if (!this.placesListParent) return;
    for (let i = this.placesListParent.getChildrenCount() - 1; i >= 0; i--) {
      this.placesListParent.getChild(i).destroy();
    }
  }

  linkQuestMarkerToPlace(pin: MapPin, questMarker: any): void {
    const place = this.placesData.find(p => p.pin === pin);
    if (place) {
      place.questMarker = questMarker;
      if (place.isActive) this.showQuestMarker(questMarker);
      else this.hideQuestMarker(questMarker);
    } else {
      this.hideQuestMarker(questMarker);
    }
  }
  
  public applyQuestMarkersState(): void {
    this.placesData.forEach(place => {
      if (place.questMarker) {
        if (place.isActive) this.showQuestMarker(place.questMarker);
        else this.hideQuestMarker(place.questMarker);
      }
    });
  }

  // --- Wrapper Functions (inchangées) ---

  setMinimapAutoRotate(enabled: boolean): void {
    this.isMinimapAutoRotate = enabled;
    if (this.mapController) this.mapController.setMinimapAutoRotate(enabled);
  }

  getMinimapAutoRotate(): boolean {
    return this.isMinimapAutoRotate;
  }

  subscribeOnMaptilesLoaded(fn: () => void): void {
    this.mapController.onMapTilesLoaded.add(fn);
  }

  subscribeOnInitialLocationSet(fn: () => void): void {
    this.mapController.onInitialLocationSet.add(fn);
  }

  subscribeOnUserLocationFirstSet(fn: () => void): void {
    this.mapController.onUserLocationSet.add(fn);
  }

  subscribeOnTileCameIntoView(fn: () => void): void {
    this.mapController.onTileCameIntoView.add(fn);
  }

  subscribeOnTileWentOutOfView(fn: () => void): void {
    this.mapController.onTileWentOutOfView.add(fn);
  }

  subscribeOnMapCentered(fn: callback<void>): void {
    this.mapController.onMapCentered.add(fn);
  }

  subscribeOnMapAddPin(fn: callback<MapPin>): void {
    this.mapController.onMapPinAdded.add(fn);
  }

  subscribeOnMapPinRemoved(fn: callback<MapPin>): void {
    this.mapController.onMapPinRemoved.add(fn);
  }

  subscribeOnAllMapPinsRemoved(fn: callback<void>): void {
    this.mapController.onAllMapPinsRemoved.add(fn);
  }

  subscribeOnMapScrolled(fn: callback<void>): void {
    this.mapController.onMapScrolled.add(fn);
  }

  getInitialMapTileLocation(): GeoPosition {
    return this.mapController.getInitialMapTileLocation();
  }

  setUserPinRotated(value: boolean): void {
    this.mapController.setUserPinRotated(value);
  }

  setMapScrolling(value: boolean): void {
    this.mapController.setMapScrolling(value);
  }

  getUserLocation(): GeoPosition {
    return this.mapController.getUserLocation();
  }

  getUserHeading(): number {
    return this.mapController.getUserHeading();
  }

  getUserOrientation(): quat {
    return this.mapController.getUserOrientation();
  }

  createMapPin(longitude: number, latitude: number): MapPin {
    const location = GeoPosition.create();
    location.longitude = longitude;
    location.latitude = latitude;
    return this.mapController.createMapPin(location);
  }

  createMapPinAtUserLocation(): MapPin {
    return this.mapController.createMapPinAtUserLocation();
  }

  addPinByLocalPosition(localPosition: vec2): MapPin {
    return this.mapController.addPinByLocalPosition(localPosition);
  }

  removeMapPin(mapPin: MapPin): void {
    this.mapController.removeMapPin(mapPin);
  }

  removeMapPins(): void {
    this.mapController.removeMapPins();
  }

  centerMap(): void {
    if (this.mapController) this.mapController.centerMap();
  }

  showNeaybyPlaces(categoryName: string[]): void {
    this.openPlacesClam(categoryName);
  }

  isMapCentered(): boolean {
    return this.mapController.isMapCentered();
  }

  updateHover(localPosition: vec2): void {
    this.mapController.handleHoverUpdate(localPosition);
  }

  startTouch(localPosition: vec2): void {
    this.mapController.handleTouchStart(localPosition);
  }

  updateTouch(localPosition: vec2): void {
    this.mapController.handleTouchUpdate(localPosition);
  }

  endTouch(localPosition: vec2): void {
    this.mapController.handleTouchEnd(localPosition);
  }

  zoomIn(): void {
    this.mapController.handleZoomIn();
  }

  zoomOut(): void {
    this.mapController.handleZoomOut();
  }

  toggleMiniMap(isOn: boolean): void {
    this.mapController.toggleMiniMap(isOn);
    this.onMiniMapToggledEvent.invoke(isOn);
  }

  drawGeometryPoint(geometry: any, radius: any): void {
    this.mapController.drawGeometryPoint(geometry, radius);
  }
  drawGeometryLine(geometry: any, thickness: any): void {
    this.mapController.drawGeometryLine(geometry, thickness);
  }
  drawGeometryMultiline(geometry: any, thickness: any): void {
    this.mapController.drawGeometryMultiline(geometry, thickness);
  }
  clearGeometry(): void {
    this.mapController.clearGeometry();
  }
}