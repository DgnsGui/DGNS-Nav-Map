import Event, { callback, PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";
import { calculateZoomOffset, findScriptComponent, MapParameter } from "./MapUtils";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

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
  @hint("Position Y visible du container")
  placesClamVisibleY: number = 15;
  @input
  @hint("Offset Y pour cacher le container")
  placesClamHiddenOffset: number = -30;
  @input
  @hint("Nombre de places placeholder si l'API échoue")
  fallbackPlacesCount: number = 10;

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
  private isPlacesClamVisible: boolean = false;
  private placesClamActualHiddenY: number = 0;
  private placesClamActualVisibleY: number = 0;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
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
      this.placesClamActualHiddenY = this.placesClamVisibleY + this.placesClamHiddenOffset;
      
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

    if (this.nearbyPlacesCache.length > 0) {
      this.populatePlacesList();
      this.animatePlacesClamIn();
    } else {
      const categories = categoryName || ["restaurant", "cafe", "bar"];
      this.loadNearbyPlaces(categories);
    }
  }

  closePlacesClam(): void {
    this.animatePlacesClamOut();
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
      }
    });
  }

  private loadNearbyPlaces(categoryName: string[]): void {
    this.placesData = [];
    this.nearbyPlacesCache = [];
    this.placesUIShown = false;
    
    let timeoutTriggered = false;
    const timeoutEvent = this.createEvent("DelayedCallbackEvent");
    timeoutEvent.bind(() => {
      if (!this.placesUIShown && this.placesData.length === 0) {
        timeoutTriggered = true;
        this.placesUIShown = true;
        this.delayedShowPlacesUI();
      }
    });
    timeoutEvent.reset(3.0);
    
    const pinAddedCallback = (pin: MapPin) => {
      if (timeoutTriggered) return;
      
      const location = pin.location;
      if (!location) return;
      
      let placeName = "Place " + this.placesData.length;
      if (pin.placeInfo && pin.placeInfo.name) {
        placeName = pin.placeInfo.name;
      } else if (pin.sceneObject && pin.sceneObject.name) {
        placeName = pin.sceneObject.name;
      }
      
      const alreadyExists = this.placesData.some(p => 
        p.name === placeName && 
        Math.abs(p.longitude - location.longitude) < 0.0001 &&
        Math.abs(p.latitude - location.latitude) < 0.0001
      );
      
      if (alreadyExists) return;
      
      const pinIsVisible = pin.sceneObject && pin.sceneObject.enabled;
      
      const placeItem: PlaceItem = {
        name: placeName,
        longitude: location.longitude,
        latitude: location.latitude,
        pin: pin,
        questMarker: undefined,
        isActive: pinIsVisible
      };
      
      this.nearbyPlacesCache.push(placeItem);
      this.placesData.push(placeItem);
      
      if (!placeItem.isActive) {
        this.hidePlacePin(pin);
      }
      
      if (!this.placesUIShown && this.placesData.length >= 3) {
        this.placesUIShown = true;
        this.delayedShowPlacesUI();
      }
    };
    
    this.subscribeOnMapAddPin(pinAddedCallback);
    this.mapController.showNearbyPlaces(categoryName);
  }

  private delayedShowPlacesUI(): void {
    if (this.placesClamContainer && !this.placesClamContainer.enabled) {
      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        if (this.placesData.length === 0) {
          this.createFallbackPlaces();
        }
        this.populatePlacesList();
        this.animatePlacesClamIn();
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
        isActive: false
      });
    }
  }

  private populatePlacesList(): void {
    if (!this.placesListParent || !this.placeItemPrefab) return;

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
    }
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
          const componentName = switchComponent.constructor ? switchComponent.constructor.name : "unknown";
          
          if (componentName === "Switch" || (switchComponent.typeName && switchComponent.typeName === "Switch")) {
            try {
              switchComponent.isOn = place.isActive;
            } catch (e) {
              // Ignore errors
            }
            
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

    if (!place.pin) return;

    if (isActive) {
      this.showPlacePin(place.pin);
      if (place.questMarker) {
        this.showQuestMarker(place.questMarker);
      }
    } else {
      this.hidePlacePin(place.pin);
      if (place.questMarker) {
        this.hideQuestMarker(place.questMarker);
      }
    }
  }

  private hidePlacePin(pin: MapPin): void {
    const pinObject = pin.sceneObject;
    if (pinObject) {
      pinObject.enabled = false;
    }
  }

  private showPlacePin(pin: MapPin): void {
    const pinObject = pin.sceneObject;
    if (pinObject) {
      pinObject.enabled = true;
    }
  }

  private hideAllPlacePins(): void {
    this.placesData.forEach(place => {
      if (place.pin) {
        this.hidePlacePin(place.pin);
      }
      if (place.questMarker) {
        this.hideQuestMarker(place.questMarker);
      }
    });
  }
  
  private hideQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      questMarker.transform.getSceneObject().enabled = false;
    }
  }
  
  private showQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      questMarker.transform.getSceneObject().enabled = true;
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
      const child = this.placesListParent.getChild(i);
      child.destroy();
    }
  }

  // Public API

  linkQuestMarkerToPlace(pin: MapPin, questMarker: any): void {
    const place = this.placesData.find(p => p.pin === pin);
    if (place) {
      place.questMarker = questMarker;
      if (!place.isActive) {
        this.hideQuestMarker(questMarker);
      }
    }
  }

  setMinimapAutoRotate(enabled: boolean): void {
    this.isMinimapAutoRotate = enabled;
    if (this.mapController) {
      this.mapController.setMinimapAutoRotate(enabled);
    }
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

  subscribeOnNoNearbyPlacesFound(fn: callback<void>): void {
    this.mapController.onNoNearbyPlacesFound.add(fn);
  }

  subscribeOnNearbyPlacesFailed(fn: callback<void>): void {
    this.mapController.onNearbyPlacesFailed.add(fn);
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
    if (this.mapController) {
      this.mapController.centerMap();
    }
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