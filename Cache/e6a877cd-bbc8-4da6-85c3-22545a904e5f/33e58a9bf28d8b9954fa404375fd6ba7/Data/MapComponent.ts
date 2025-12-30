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
  questMarker?: any; // QuestMarker associé
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
  @input
  @hint("Bouton X pour fermer le Places Clam")
  placesClamCloseButton: PinchButton;
  @input
  @hint("Espacement vertical entre les items (-5 par défaut)")
  placeItemSpacing: number = -5;
  @input
  @hint("Position Y visible du container (position actuelle)")
  placesClamVisibleY: number = 0;
  @input
  @hint("Offset Y pour cacher le container (ex: 30 pour descendre)")
  placesClamHiddenOffset: number = 30;

  private componentPrefab: ObjectPrefab = requireAsset("../Prefabs/Map Controller.prefab") as ObjectPrefab;
  
  public mapController: MapController;

  private onMiniMapToggledEvent = new Event<boolean>();
  onMiniMapToggled: PublicApi<boolean> = this.onMiniMapToggledEvent.publicApi();

  private placesData: PlaceItem[] = [];
  private nearbyPlacesCache: any[] = [];
  private placesUIShown: boolean = false; // Flag pour éviter les duplicatas
  
  // Animation du Places Clam
  private placesClamTransform: Transform;
  private placesClamAnimation: CancelFunction | null = null;
  private isPlacesClamAnimating: boolean = false;
  private isPlacesClamVisible: boolean = false;
  private placesClamActualHiddenY: number = 0; // Calculé dynamiquement
  private placesClamActualVisibleY: number = 0; // Position actuelle

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
      this.placesClamTransform = this.placesClamContainer.getTransform();
      const pos = this.placesClamTransform.getLocalPosition();
      
      // Utiliser les valeurs configurables
      this.placesClamActualVisibleY = this.placesClamVisibleY;
      this.placesClamActualHiddenY = this.placesClamVisibleY + this.placesClamHiddenOffset;
      
      // Démarrer en position cachée
      pos.y = this.placesClamActualHiddenY;
      this.placesClamTransform.setLocalPosition(pos);
      this.placesClamContainer.enabled = false;
      
      print("Places Clam animation setup:");
      print("  Visible Y: " + this.placesClamActualVisibleY);
      print("  Hidden Y: " + this.placesClamActualHiddenY);
    }
    
    // Connecter le bouton de fermeture
    if (this.placesClamCloseButton) {
      this.placesClamCloseButton.onButtonPinched.add(this.handlePlacesClamClose.bind(this));
    }
  }
  
  private handlePlacesClamClose(event: InteractorEvent): void {
    this.animatePlacesClamOut();
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

    // Si on a déjà des données en cache, simplement afficher
    if (this.nearbyPlacesCache.length > 0) {
      print("Using cached places data");
      this.populatePlacesList();
      this.animatePlacesClamIn();
      return;
    }

    // Sinon, charger les places
    print("Loading fresh places data");
    const categories = categoryName || ["restaurant", "cafe", "bar"];
    this.loadNearbyPlaces(categories);
  }

  /**
   * Ferme le Places Clam avec animation
   */
  closePlacesClam(): void {
    this.animatePlacesClamOut();
  }
  
  /**
   * Anime l'apparition du Places Clam
   */
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
  
  /**
   * Anime la disparition du Places Clam
   */
  private animatePlacesClamOut(): void {
    if (!this.isPlacesClamVisible && !this.isPlacesClamAnimating && !this.placesClamContainer.enabled) return;
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

  /**
   * Charge les places à proximité via le MapController
   */
  private loadNearbyPlaces(categoryName: string[]): void {
    print("=== LOADING NEARBY PLACES ===");
    
    // IMPORTANT: Nettoyer toutes les données existantes
    this.placesData = [];
    this.nearbyPlacesCache = [];
    this.placesUIShown = false;
    
    print("Data cleared. Starting fresh load...");
    
    // S'abonner aux événements du MapController pour récupérer les places
    const pinAddedCallback = (pin: MapPin) => {
      // Extraire les infos du pin pour créer un PlaceItem
      const location = pin.location;
      if (!location) return;
      
      // Récupérer le nom depuis placeInfo
      let placeName = "Place " + (this.placesData.length + 1);
      
      if (pin.placeInfo && pin.placeInfo.name) {
        placeName = pin.placeInfo.name;
      } else if (pin.sceneObject && pin.sceneObject.name) {
        placeName = pin.sceneObject.name;
      }
      
      // Vérifier si cette place existe déjà (éviter les duplicatas)
      const alreadyExists = this.placesData.some(p => 
        p.name === placeName && 
        Math.abs(p.longitude - location.longitude) < 0.0001 &&
        Math.abs(p.latitude - location.latitude) < 0.0001
      );
      
      if (alreadyExists) {
        print("SKIPPING duplicate place: " + placeName);
        return;
      }
      
      print("Adding NEW place: " + placeName + " (total: " + (this.placesData.length + 1) + ")");
      
      // Vérifier si le pin/marker est actuellement visible
      const pinIsVisible = pin.sceneObject && pin.sceneObject.enabled;
      
      const placeItem: PlaceItem = {
        name: placeName,
        longitude: location.longitude,
        latitude: location.latitude,
        pin: pin,
        questMarker: undefined,
        isActive: pinIsVisible // Synchroniser avec l'état actuel du pin
      };
      
      this.nearbyPlacesCache.push(placeItem);
      this.placesData.push(placeItem);
      
      // Cacher le pin seulement s'il n'est pas déjà actif
      if (!placeItem.isActive) {
        this.hidePlacePin(pin);
      }
      
      // Afficher l'UI seulement UNE FOIS après avoir au moins 3 places UNIQUES
      if (!this.placesUIShown && this.placesData.length >= 3) {
        this.placesUIShown = true;
        this.delayedShowPlacesUI();
      }
    };
    
    // S'abonner une seule fois
    this.subscribeOnMapAddPin(pinAddedCallback);

    // Appeler la fonction existante qui va créer les pins
    this.mapController.showNearbyPlaces(categoryName);
    
    print("=== LOAD INITIATED ===");
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
        // Animer l'entrée du container
        this.animatePlacesClamIn();
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

    print("=== POPULATING PLACES LIST ===");
    print("Total places to add: " + this.placesData.length);
    print("Parent child count before clear: " + this.placesListParent.getChildrenCount());

    // Nettoyer les items existants
    this.clearPlacesList();
    
    print("Parent child count after clear: " + this.placesListParent.getChildrenCount());

    // Créer un item UI pour chaque place avec espacement vertical
    let currentY = 0;
    
    for (let i = 0; i < this.placesData.length; i++) {
      const place = this.placesData[i];
      
      print("Creating UI item " + i + " for: " + place.name);
      const itemInstance = this.placeItemPrefab.instantiate(this.placesListParent);
      place.uiObject = itemInstance;

      // Positionner l'item avec l'espacement vertical
      const itemTransform = itemInstance.getTransform();
      const pos = itemTransform.getLocalPosition();
      pos.y = currentY;
      itemTransform.setLocalPosition(pos);
      
      print("Item positioned at Y: " + currentY);
      
      // Calculer la position Y pour le prochain item
      currentY += this.placeItemSpacing;

      // Configurer le texte
      this.setPlaceItemText(itemInstance, place.name);

      // Configurer le toggle (désactivé par défaut)
      this.setupPlaceToggle(itemInstance, place, i);
    }
    
    print("Parent child count after population: " + this.placesListParent.getChildrenCount());
    print("=== POPULATION COMPLETE ===");
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
    const components = itemObject.getComponents("Component.ScriptComponent");
    
    for (let i = 0; i < components.length; i++) {
      const component = components[i] as any;
      
      // Vérifier si c'est un SwitchToggleGroup
      if (component.typeName && component.typeName === "SwitchToggleGroup") {
        print("SwitchToggleGroup found for " + place.name);
        
        // Obtenir le Switch (premier toggleable)
        if (component.toggleables && component.toggleables.length > 0) {
          const switchToggle = component.toggleables[0];
          
          // Définir l'état initial basé sur place.isActive
          if (switchToggle.api && switchToggle.api.setState) {
            switchToggle.api.setState(place.isActive);
            print("Toggle initialized to: " + place.isActive + " for " + place.name);
          }
          
          // S'abonner aux changements
          if (switchToggle.api && switchToggle.api.onStateChanged) {
            switchToggle.api.onStateChanged.add((isOn: boolean) => {
              print("Toggle changed for " + place.name + ": " + isOn);
              this.togglePlace(index, isOn);
            });
          }
        }
        
        break;
      }
      
      // Fallback : chercher via l'API générique
      if (component.api && component.api.onSwitchToggled) {
        print("Toggle found (generic) for " + place.name);
        
        // Définir l'état initial
        if (component.api.setToggleState) {
          component.api.setToggleState(place.isActive);
        } else if (component.api.setSwitchState) {
          component.api.setSwitchState(place.isActive);
        }
        
        print("Toggle initialized to: " + place.isActive + " for " + place.name);
        
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
      
      // Afficher le quest marker si présent
      if (place.questMarker) {
        this.showQuestMarker(place.questMarker);
      }
    } else {
      // Cacher le pin
      if (place.pin) {
        this.hidePlacePin(place.pin);
      }
      
      // Cacher le quest marker
      if (place.questMarker) {
        this.hideQuestMarker(place.questMarker);
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
      if (place.questMarker) {
        this.hideQuestMarker(place.questMarker);
      }
    });
  }
  
  /**
   * Cache un quest marker
   */
  private hideQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      questMarker.transform.getSceneObject().enabled = false;
      print("Quest marker hidden");
    }
  }
  
  /**
   * Affiche un quest marker
   */
  private showQuestMarker(questMarker: any): void {
    if (questMarker && questMarker.transform) {
      questMarker.transform.getSceneObject().enabled = true;
      print("Quest marker shown");
    }
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

    print("Clearing places list...");
    // Détruire tous les enfants
    const childCount = this.placesListParent.getChildrenCount();
    print("Children to destroy: " + childCount);
    
    for (let i = childCount - 1; i >= 0; i--) {
      const child = this.placesListParent.getChild(i);
      print("Destroying child " + i + ": " + child.name);
      child.destroy();
    }
    
    print("Clear complete");
  }

  // #endregion

  // #region Exposed functions
  // =====
  
  /**
   * Associe un quest marker à une place basée sur le MapPin
   * À appeler depuis MapController quand un quest marker est créé
   */
  linkQuestMarkerToPlace(pin: MapPin, questMarker: any): void {
    // Trouver la place correspondante
    const place = this.placesData.find(p => p.pin === pin);
    if (place) {
      place.questMarker = questMarker;
      print("Quest marker linked to place: " + place.name);
      
      // Si la place n'est pas active, cacher le quest marker
      if (!place.isActive) {
        this.hideQuestMarker(questMarker);
      }
    }
  }

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