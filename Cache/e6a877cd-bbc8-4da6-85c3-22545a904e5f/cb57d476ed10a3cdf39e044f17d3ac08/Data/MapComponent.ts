import Event, { callback, PublicApi } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";
import { calculateZoomOffset, findScriptComponent, MapParameter } from "./MapUtils";

require('LensStudio:ProcessedLocationModule')

interface PlaceItem {
  name: string;
  longitude: number;
  latitude: number;
  pin?: MapPin;
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
  @hint("Contrôle l'inertie de la carte. Plus la valeur est élevée, plus la carte s'arrête vite. 0 = pas de friction.")
  scrollingFriction: number = 4;
  @ui.separator
  @ui.label("For setting map location to custom location (not following user location)")
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
  @ui.label("PinchButton to toggle minimap auto-rotation")
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

  private componentPrefab: ObjectPrefab = requireAsset("../Prefabs/Map Controller.prefab") as ObjectPrefab;
  
  public mapController: MapController;

  private onMiniMapToggledEvent = new Event<boolean>();
  onMiniMapToggled: PublicApi<boolean> = this.onMiniMapToggledEvent.publicApi();

  private placesData: PlaceItem[] = [];
  private nearbyPlacesCache: any[] = [];

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

    // S'assurer que le container Places Clam est caché au démarrage
    if (this.placesClamContainer) {
      this.placesClamContainer.enabled = false;
    }
  }

  private setupAutoRotateToggleButton(): void {
    if (this.autoRotateToggleButton) {
      this.autoRotateToggleButton.onButtonPinched.add(this.handleAutoRotateToggle.bind(this));
    }
  }

  private handleAutoRotateToggle(event: InteractorEvent): void {
    this.isMinimapAutoRotate = !this.isMinimapAutoRotate;
    if (this.mapController) {
      this.mapController.setMinimapAutoRotate(this.isMinimapAutoRotate);
      if (this.isMinimapAutoRotate) {
        this.mapController.centerMap();
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

  // #region Places Clam Management

  /**
   * Ouvre le Places Clam et charge les places disponibles
   */
  openPlacesClam(categoryName?: string[]): void {
    if (!this.placesClamContainer) {
      print("Places Clam container not assigned!");
      return;
    }

    // Si on n'a pas encore de données, charger les places nearby
    if (this.nearbyPlacesCache.length === 0) {
      // Utiliser la fonction existante pour récupérer les places
      const categories = categoryName || ["restaurant", "cafe", "bar"];
      this.loadNearbyPlaces(categories);
    } else {
      // Afficher le container après avoir les données
      this.placesClamContainer.enabled = true;
      // Populer la liste avec les données en cache
      this.populatePlacesList();
    }
  }

  /**
   * Ferme le Places Clam
   */
  closePlacesClam(): void {
    if (this.placesClamContainer) {
      this.placesClamContainer.enabled = false;
    }
  }

  /**
   * Charge les places à proximité via le MapController
   */
  private loadNearbyPlaces(categoryName: string[]): void {
    print("Loading nearby places...");
    
    // Compteur pour suivre quand tous les pins sont créés
    let pinsLoaded = 0;
    const expectedPins = 10; // Ajustez selon vos besoins
    
    // S'abonner aux événements du MapController pour récupérer les places
    const pinAddedCallback = (pin: MapPin) => {
      print("Pin added, extracting info...");
      
      // Extraire les infos du pin pour créer un PlaceItem
      const location = pin.location;
      if (location) {
        // Récupérer le nom depuis les métadonnées du pin si disponible
        let placeName = "Place " + (this.placesData.length + 1);
        
        // Essayer de récupérer depuis le pin
        if ((pin as any).name) {
          placeName = (pin as any).name;
        } else if ((pin as any).title) {
          placeName = (pin as any).title;
        } else if ((pin as any).metadata && (pin as any).metadata.name) {
          placeName = (pin as any).metadata.name;
        }
        
        print("Place found: " + placeName);
        
        const placeItem: PlaceItem = {
          name: placeName,
          longitude: location.longitude,
          latitude: location.latitude,
          pin: pin,
          isActive: false
        };
        
        this.nearbyPlacesCache.push(placeItem);
        this.placesData.push(placeItem);
        
        // Cacher immédiatement le pin
        this.hidePlacePin(pin);
        
        pinsLoaded++;
        
        // Quand assez de pins sont chargés, afficher l'UI
        if (pinsLoaded >= 3) { // Afficher après au moins 3 places
          this.delayedShowPlacesUI();
        }
      }
    };
    
    this.subscribeOnMapAddPin(pinAddedCallback);

    // Appeler la fonction existante qui va créer les pins
    this.mapController.showNearbyPlaces(categoryName);
  }
  
  /**
   * Affiche l'UI des places après un court délai
   */
  private delayedShowPlacesUI(): void {
    // N'afficher qu'une seule fois
    if (this.placesClamContainer && !this.placesClamContainer.enabled) {
      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        print("Populating places list with " + this.placesData.length + " places");
        this.populatePlacesList();
        this.placesClamContainer.enabled = true;
      });
      delayEvent.reset(0.5); // Délai de 0.5 seconde
    }
  }

  /**
   * Extrait le nom d'un place depuis un MapPin
   */
  private extractPlaceName(pin: MapPin): string {
    // Essayer de récupérer le nom depuis le pin
    // Cette fonction dépend de comment MapPin stocke les informations
    // Adapter selon votre implémentation
    const pinObject = pin.sceneObject;
    if (pinObject) {
      // Chercher un composant Text ou similaire
      const textComponents = pinObject.getComponents("Component.Text");
      if (textComponents && textComponents.length > 0) {
        return (textComponents[0] as Text).text;
      }
    }
    return "Place " + (this.placesData.length + 1);
  }

  /**
   * Peuple la liste des places dans le UI
   */
  private populatePlacesList(): void {
    if (!this.placesListParent || !this.placeItemPrefab) {
      print("Places list parent or prefab not assigned!");
      return;
    }

    print("Populating list with " + this.placesData.length + " items");

    // Nettoyer les items existants
    this.clearPlacesList();

    // Créer un item UI pour chaque place
    this.placesData.forEach((place, index) => {
      print("Creating item for: " + place.name);
      const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
      place.uiObject = itemInstance;

      // Configurer le texte
      this.setPlaceItemText(itemInstance, place.name);

      // Configurer le toggle (désactivé par défaut)
      this.setupPlaceToggle(itemInstance, place, index);
    });
  }

  /**
   * Configure le texte d'un item de place
   */
  private setPlaceItemText(itemObject: SceneObject, placeName: string): void {
    print("Setting text to: " + placeName);
    // Chercher le CapsuleButton et son texte
    const textComponent = this.findTextInChildren(itemObject);
    if (textComponent) {
      textComponent.text = placeName;
      print("Text set successfully");
    } else {
      print("WARNING: Text component not found in item!");
    }
  }

  /**
   * Configure le toggle d'un item de place
   */
  private setupPlaceToggle(itemObject: SceneObject, place: PlaceItem, index: number): void {
    // Chercher le SwitchToggleGroup
    const toggleComponents = itemObject.getComponents("Component.ScriptComponent");
    
    for (let i = 0; i < toggleComponents.length; i++) {
      const component = toggleComponents[i] as any;
      
      // Vérifier si c'est un SwitchToggleGroup ou similaire
      if (component.api && component.api.onSwitchToggled) {
        print("Toggle found for " + place.name);
        
        // Définir l'état initial à OFF
        if (component.api.setToggleState) {
          component.api.setToggleState(false);
        } else if (component.api.setSwitchState) {
          component.api.setSwitchState(false);
        }
        
        // S'abonner à l'événement de toggle
        component.api.onSwitchToggled.add((isOn: boolean) => {
          print("Toggle changed for " + place.name + ": " + isOn);
          this.togglePlace(index, isOn);
        });
        
        break;
      }
    }
  }

  /**
   * Active/Désactive une place spécifique
   */
  togglePlace(index: number, isActive: boolean): void {
    if (index < 0 || index >= this.placesData.length) {
      return;
    }

    const place = this.placesData[index];
    place.isActive = isActive;

    print("Toggling place " + place.name + " to " + (isActive ? "ON" : "OFF"));

    if (isActive) {
      // Afficher le pin existant
      if (place.pin) {
        this.showPlacePin(place.pin);
      } else {
        print("WARNING: No pin found for " + place.name);
      }
    } else {
      // Cacher le pin
      if (place.pin) {
        this.hidePlacePin(place.pin);
      }
    }
  }

  /**
   * Cache un pin de place
   */
  private hidePlacePin(pin: MapPin): void {
    const pinObject = pin.sceneObject;
    if (pinObject) {
      pinObject.enabled = false;
      print("Pin hidden");
    }
  }

  /**
   * Affiche un pin de place
   */
  private showPlacePin(pin: MapPin): void {
    const pinObject = pin.sceneObject;
    if (pinObject) {
      pinObject.enabled = true;
      print("Pin shown");
    }
  }

  /**
   * Cache tous les pins de places
   */
  private hideAllPlacePins(): void {
    this.placesData.forEach(place => {
      if (place.pin) {
        this.hidePlacePin(place.pin);
      }
    });
  }

  /**
   * Cherche un composant Text dans les enfants d'un objet
   */
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

  /**
   * Nettoie la liste des places UI
   */
  private clearPlacesList(): void {
    if (!this.placesListParent) return;

    // Détruire tous les enfants
    const childCount = this.placesListParent.getChildrenCount();
    for (let i = childCount - 1; i >= 0; i--) {
      const child = this.placesListParent.getChild(i);
      child.destroy();
    }
  }

  // #endregion

  // #region Exposed functions
  // =====

  // #region subscribe callbacks

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

  // #endregion

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

  /**
   * MODIFIÉ: Affiche le Places Clam au lieu d'afficher directement les places
   */
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

  // #endregion
}