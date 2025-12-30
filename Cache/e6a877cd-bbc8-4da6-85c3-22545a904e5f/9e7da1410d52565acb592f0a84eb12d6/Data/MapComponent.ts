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
        print("Showing pin " + pinIndex);
        this.showPlacePin(pin);
      } else {
        print("Hiding pin " + pinIndex);
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

    // Force refresh à chaque ouverture
    this.placesData = [];  // Clear explicitement pour éviter reuse
    const categories = categoryName || ["restaurant", "cafe", "bar"];
    this.loadNearbyPlaces(categories);
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
    
    let timeoutEvent = this.createEvent("DelayedCallbackEvent");
    timeoutEvent.bind(() => {
      this.isCollectingPins = false;
      if (this.placesData.length === 0) {
        this.loadFallbackPlaces();
      }
      this.populatePlacesList();
      this.placesAnimator.animateIn();
    });
    timeoutEvent.reset(2);
    
    try {
      this.mapController.showNearbyPlaces(categoryName);
    } catch (error) {
      print("Error showing nearby places: " + error);
      this.isCollectingPins = false;
      this.loadFallbackPlaces();
      this.populatePlacesList();
      this.placesAnimator.animateIn();
    }
    print("=== loadNearbyPlaces END ===");
  }

  private loadFallbackPlaces(): void {
    print("Loading fallback places");
    
    const userLocation = this.mapController.getUserLocation();
    if (!userLocation) {
      print("No user location for fallback");
      return;
    }
    
    const radius = 0.005; // ~500m
    
    for (let i = 0; i < this.fallbackPlacesCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.random() * radius;
      
      const lat = userLocation.latitude + dist * Math.cos(angle);
      const lon = userLocation.longitude + dist * Math.sin(angle);
      
      const location = GeoPosition.create();
      location.longitude = lon;
      location.latitude = lat;
      const pin = this.mapController.createMapPin(location);
      
      const placeItem: PlaceItem = {
        name: `Place ${i + 1}`,
        longitude: lon,
        latitude: lat,
        pin: pin,
        questMarker: undefined,
        isActive: i < 3
      };
      
      this.placesData.push(placeItem);
      
      if (placeItem.isActive) {
        this.showPlacePin(pin);
      } else {
        this.hidePlacePin(pin);
      }
    }
    
    print(`Created ${this.placesData.length} fallback places`);
  }

  private populatePlacesList(): void {
    print("=== populatePlacesList START ===");
    this.clearPlacesList();
    
    if (!this.placesListParent || !this.placeItemPrefab) {
      print("Missing places list components");
      return;
    }
    
    print(`Populating with ${this.placesData.length} places`);
    
    for (let i = 0; i < this.placesData.length; i++) {
      const place = this.placesData[i];
      const uiObject = this.placeItemPrefab.instantiate(this.placesListParent);
      
      const textComponent = this.findTextInChildren(uiObject);
      if (textComponent) {
        textComponent.text = place.name;
      }
      
      const screenTransform = uiObject.getComponent("Component.ScreenTransform");
      if (screenTransform) {
        screenTransform.anchors.bottom = (i * this.placeItemSpacing) / 100;
        screenTransform.anchors.top = screenTransform.anchors.bottom + 0.1;
      }
      
      const pinchButton = uiObject.getComponent(PinchButton);
      if (pinchButton) {
        pinchButton.onButtonPinched.add(() => {
          this.togglePlaceActive(i);
        });
      }
      
      place.uiObject = uiObject;
      print(`Created UI for place ${i}: ${place.name}`);
    }
    
    this.placesUIShown = true;
    this.applyQuestMarkersState();
    print("=== populatePlacesList END ===");
  }

  private togglePlaceActive(index: number): void {
    if (index < 0 || index >= this.placesData.length) return;
    
    const place = this.placesData[index];
    place.isActive = !place.isActive;
    
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
    
    // Optionnel: Mettre à jour l'UI du bouton
    if (place.uiObject) {
      const text = this.findTextInChildren(place.uiObject);
      if (text) {
        text.textFill.color = place.isActive ? new vec4(0,1,0,1) : new vec4(1,0,0,1);
      }
    }
  }

  private showPlacePin(pin: MapPin): void {
    if (pin && pin.sceneObject) {
      pin.sceneObject.enabled = true;
    }
  }

  private hidePlacePin(pin: MapPin): void {
    if (pin && pin.sceneObject) {
      pin.sceneObject.enabled = false;
    }
  }

  private showQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      const sceneObject = questMarker.transform.getSceneObject();
      if (sceneObject) {
        sceneObject.enabled = true;
      }
    }
  }

  private hideQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      const sceneObject = questMarker.transform.getSceneObject();
      if (sceneObject) {
        sceneObject.enabled = false;
      }
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
    print("Clearing " + childCount + " children from places list");
    for (let i = childCount - 1; i >= 0; i--) {
      const child = this.placesListParent.getChild(i);
      child.destroy();
    }
  }

  linkQuestMarkerToPlace(pin: MapPin, questMarker: any): void {
    print("=== linkQuestMarkerToPlace ===");
    
    if (questMarker && questMarker.transform) {
      const sceneObject = questMarker.transform.getSceneObject();
      if (sceneObject) {
        sceneObject.enabled = false;
        print("Quest marker FORCE HIDDEN initially: " + sceneObject.name);
      }
    }
    
    const place = this.placesData.find(p => p.pin === pin);
    if (place) {
      print("Found matching place: " + place.name + " (active: " + place.isActive + ")");
      place.questMarker = questMarker;
      
      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        if (place.isActive) {
          print("Place is ACTIVE, showing quest marker for: " + place.name);
          this.showQuestMarker(questMarker);
        } else {
          print("Place is INACTIVE, quest marker stays hidden for: " + place.name);
          this.hideQuestMarker(questMarker);
        }
      });
      delayEvent.reset(0.2);
    } else {
      print("WARNING: Could not find place for pin - quest marker stays hidden");
      if (questMarker && questMarker.transform) {
        const sceneObject = questMarker.transform.getSceneObject();
        if (sceneObject) {
          sceneObject.enabled = false;
        }
      }
    }
  }

  public applyQuestMarkersState(): void {
    print("=== Applying quest markers state to " + this.placesData.length + " places ===");
    let appliedCount = 0;
    let shownCount = 0;
    let hiddenCount = 0;
    
    for (let i = 0; i < this.placesData.length; i++) {
      const place = this.placesData[i];
      
      if (place.questMarker) {
        print("Place " + i + ": " + place.name + " isActive=" + place.isActive);
        
        if (place.isActive) {
          this.showQuestMarker(place.questMarker);
          shownCount++;
        } else {
          this.hideQuestMarker(place.questMarker);
          hiddenCount++;
        }
        appliedCount++;
      } else {
        print("Place " + i + ": " + place.name + " has NO quest marker yet");
      }
    }
    
    print("Applied state to " + appliedCount + " quest markers (shown: " + shownCount + ", hidden: " + hiddenCount + ")");
  }

  public forceHideAllQuestMarkersThenShow(): void {
    print("=== FORCE HIDING ALL QUEST MARKERS ===");
    
    const mapControllerAny = this.mapController as any;
    if (mapControllerAny.questMarkers) {
      const allMarkers = mapControllerAny.questMarkers;
      print("Found " + allMarkers.length + " quest markers in controller");
      
      for (let i = 0; i < allMarkers.length; i++) {
        const marker = allMarkers[i];
        if (marker && marker.transform) {
          const sceneObject = marker.transform.getSceneObject();
          if (sceneObject) {
            sceneObject.enabled = false;
          }
        }
      }
      print("All quest markers forcibly hidden");
    }
    
    let shownCount = 0;
    for (let i = 0; i < this.placesData.length; i++) {
      const place = this.placesData[i];
      if (place.questMarker && place.isActive) {
        this.showQuestMarker(place.questMarker);
        shownCount++;
      }
    }
    print("Shown " + shownCount + " active quest markers");
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