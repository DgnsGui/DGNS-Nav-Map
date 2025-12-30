// --- START OF FILE MapController.ts (FINAL TIMING FIX VERSION) ---

require("LensStudio:RawLocationModule");

import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import Event, { callback } from "SpectaclesInteractionKit.lspkg/Utils/Event";
import { LensConfig } from "SpectaclesInteractionKit.lspkg/Utils/LensConfig";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { UpdateDispatcher } from "SpectaclesInteractionKit.lspkg/Utils/UpdateDispatcher";
import { Cell, TileViewEvent } from "./Cell";
import MapConfig from "./MapConfig";
import { MapGridView } from "./MapGridView";
import { MapPin } from "./MapPin";
import {
  clip,
  forEachSceneObjectInSubHierarchy,
  getOffsetForLocation,
  interpolate,
  makeTween,
  MapParameter,
  lerp,
  calculateZoomOffset,
  addRenderMeshVisual,
  makeCircle2DMesh,
  makeLineStrip2DMeshWithJoints,
  normalizeAngle,
  customGetEuler,
} from "./MapUtils";
import { PinOffsetter } from "./PinOffsetter";
import { PlaceInfo, SnapPlacesProvider } from "./SnapPlacesProvider";
import { AIMapAssistant } from "./AIMapAssistant";

const TEXTURE_SIZE = 512;
const MAX_LATITUDE = 85.05112878;
const MAX_LONGITUDE = -180;
const NEARBY_PLACES_RANGE = 100;
const CENTER_MAP_TWEEN_DURATION = 0.5;
const TAG = "[Map Controller]";
const log = new NativeLogger(TAG);

@component
export class MapController extends BaseScriptComponent {
  @input
  mapModule: MapModule;
  @input
  mapTilePrefab: ObjectPrefab;
  @input
  lineMaterial: Material;
  @input
  mapRenderPrefab: ObjectPrefab;
  @input
  @allowUndefined
  placesProvider: SnapPlacesProvider;
  @input
  @allowUndefined
  aiAssistant: AIMapAssistant;

  private locationService: LocationService;
  public isMapComponent: boolean = true;
  mapParameters: MapParameter;
  mapGridObject: SceneObject;
  mapPinsAnchor: SceneObject;
  public pinOffsetter: PinOffsetter;
  public gridView: MapGridView;
  public config: MapConfig;
  public referencePositionLocationAsset: LocationAsset;
  private northwestLocationAsset: LocationAsset;
  public offsetForLocation: vec2;
  private mapRenderOrder = 1;
  private initialMapLocation: GeoPosition;
  private userPin: MapPin;
  private mapLocation: GeoPosition;
  private shouldFollowMapLocation = false;
  private viewScrolled: boolean;
  private lastMapUpdate = 0;
  private userLocation: GeoPosition;
  private loadedCells = 0;
  private mapCellCount = 0;
  private hoveringPinSet: Set<MapPin> = new Set();
  private pinSet: Set<MapPin> = new Set();
  private pinnedPlaceSet: Set<string> = new Set();
  private isDraggingPin: boolean = false;
  private draggingPin: MapPin | null = null;
  private mapRenderObject: SceneObject;
  private mapScreenTransform: ScreenTransform;
  private currentUserRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetUserRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private currentMapRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetMapRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private currentPinRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private targetPinRotation: quat = quat.fromEulerAngles(0, 0, 0);
  private heading = 0;
  private orientation = quat.quatIdentity();
  private tweenCancelFunction: CancelFunction;
  private geometryObjects: SceneObject[] = [];
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher;
  private isInitialized: boolean = false;

  private onInitialLocationSetEvent = new Event<GeoPosition>();
  public onInitialLocationSet = this.onInitialLocationSetEvent.publicApi();
  private onMapTilesLoadedEvent = new Event();
  public onMapTilesLoaded = this.onMapTilesLoadedEvent.publicApi();
  private onUserLocationSetEvent = new Event<GeoPosition>();
  public onUserLocationSet = this.onUserLocationSetEvent.publicApi();
  private onMapCenteredEvent = new Event();
  public onMapCentered = this.onMapCenteredEvent.publicApi();
  private onMapScrolledEvent = new Event();
  public onMapScrolled = this.onMapScrolledEvent.publicApi();
  private onTileWentOutOfViewEvent = new Event<TileViewEvent>();
  public onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi();
  private onTileCameIntoViewEvent = new Event<TileViewEvent>();
  public onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi();
  private onMapPinAddedEvent = new Event<MapPin>();
  public onMapPinAdded = this.onMapPinAddedEvent.publicApi();
  private onMapPinRemovedEvent = new Event<MapPin>();
  public onMapPinRemoved = this.onMapPinRemovedEvent.publicApi();
  private onAllMapPinsRemovedEvent = new Event();
  public onAllMapPinsRemoved = this.onAllMapPinsRemovedEvent.publicApi();
  private onMiniMapToggledEvent = new Event<boolean>();
  public onMiniMapToggled = this.onMiniMapToggledEvent.publicApi();
  private onNoNearbyPlacesFoundEvent = new Event();
  public onNoNearbyPlacesFound = this.onNoNearbyPlacesFoundEvent.publicApi();
  private onNearbyPlacesFailedEvent = new Event();
  public onNearbyPlacesFailed = this.onNearbyPlacesFailedEvent.publicApi();
  private onNearbyPlacesSuccessEvent = new Event<PlaceInfo[]>();
  public onNearbyPlacesSuccess = this.onNearbyPlacesSuccessEvent.publicApi();

  initialize(mapParameters: MapParameter, startedAsMiniMap: boolean): void {
    log.i("Initializing Map Controller");
    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(this.handleNorthAlignedOrientationUpdate.bind(this));
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;
    this.mapParameters = mapParameters;
    this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent);
    this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());
    this.mapGridObject = this.mapRenderObject.getChild(0);
    this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
    this.mapPinsAnchor = this.mapGridObject.getChild(0);
    this.fetchLocation((location: GeoPosition) => {
      this.mapLocation = location;
      this.userLocation = location;
      this.createMapGrid();
      this.centerMap();
      if (mapParameters.showUserPin) {
        this.spawnUserPin(mapParameters.userPinVisual, location, mapParameters.userPinScale);
      }
      this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(this.onUpdate.bind(this));
      this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(() => {
        if(this.gridView) this.gridView.updateGridView(this.pinSet, this.userPin)
      });
      if (startedAsMiniMap) {
        this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
      }
      log.i("Map Controller initialized");
      this.isInitialized = true;
    });
  }

  private onUpdate() {
    if (!this.isInitialized) return;
    if (getTime() - this.lastMapUpdate > this.mapParameters.mapUpdateThreshold) {
      this.fetchLocation((location: GeoPosition) => {
        this.setNewMapLocation(location);
        this.setNewUserPosition(location);
      });
      this.lastMapUpdate = getTime();
    }
    this.updateRotations();
  }

  private fetchLocation(callback: callback<GeoPosition>) {
    this.locationService.getCurrentPosition(
      (geoPosition) => { callback(geoPosition); },
      (error) => { log.e(`Error fetching location: ${error}`); }
    );
  }
  
  private handleNorthAlignedOrientationUpdate(orientation: quat) { this.orientation = orientation; this.heading = normalizeAngle(customGetEuler(orientation).y); }
  private updateRotations() {
    const pinRotation = -this.getUserHeading();
    if (this.userPin) this.updateUserPinRotation(pinRotation);
    if (this.config && this.mapParameters.isMinimapAutoRotate && !this.viewScrolled && this.config.isMiniMap) {
      this.updateMapRotation();
      this.updateMapPinRotations(pinRotation);
    }
  }
  private updateMapPinRotations(pinRotation: number) {
    if (this.mapParameters.mapPinsRotated) {
        const targetRotation = quat.fromEulerAngles(0, 0, pinRotation);
        if (this.mapParameters.enableMapSmoothing) {
            this.currentPinRotation = interpolate(this.currentPinRotation, targetRotation, 4);
            this.pinSet.forEach((pin: MapPin) => { if(pin.screenTransform) pin.screenTransform.rotation = this.currentPinRotation });
        } else {
            this.pinSet.forEach((pin: MapPin) => { if(pin.screenTransform) pin.screenTransform.rotation = targetRotation });
        }
    }
  }
  private updateMapRotation() {
    const targetRotation = quat.fromEulerAngles(0, 0, this.getUserHeading());
    if (this.mapParameters.enableMapSmoothing) {
      this.currentMapRotation = interpolate(this.currentMapRotation, targetRotation, 4);
      if(this.config) this.config.gridScreenTransform.rotation = this.currentMapRotation;
    } else {
      if(this.config) this.config.gridScreenTransform.rotation = targetRotation;
    }
  }
  private updateUserPinRotation(pinRotation: number) {
    if (this.userPin && this.userPin.screenTransform && this.mapParameters.userPinAlignedWithOrientation) {
      const targetRotation = quat.fromEulerAngles(0, 0, pinRotation);
      if (this.mapParameters.enableMapSmoothing) {
        this.targetUserRotation = interpolate(this.targetUserRotation, targetRotation, 4);
        this.userPin.screenTransform.rotation = this.targetUserRotation;
      } else {
        this.userPin.screenTransform.rotation = targetRotation;
      }
    }
  }
  
  getUserLocation(): GeoPosition { return this.userLocation; }
  getUserHeading(): number { return global.deviceInfoSystem.isEditor() ? -this.heading : this.heading; }
  getUserOrientation(): quat { return this.orientation; }
  setMinimapAutoRotate(enabled: boolean): void { if(this.mapParameters) this.mapParameters.isMinimapAutoRotate = enabled; }
  getMinimapAutoRotate(): boolean { return this.mapParameters.isMinimapAutoRotate; }

  createMapPin(location: GeoPosition, placeInfo: PlaceInfo = undefined): MapPin {
    const pin = MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, this.mapRenderOrder, location, placeInfo);
    this.pinSet.add(pin);
    this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, location.longitude, location.latitude);
    if(this.gridView) this.pinOffsetter.layoutScreenTransforms(this.gridView);
    pin.highlight();
    this.onMapPinAddedEvent.invoke(pin);
    return pin;
  }
  removeMapPin(mapPin: MapPin) {
    if (!mapPin) return;
    if (this.pinSet.has(mapPin)) this.pinSet.delete(mapPin);
    if (mapPin.placeInfo) this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
    if (mapPin.sceneObject) {
      const pinScreenTransform = mapPin.sceneObject.getComponent("ScreenTransform");
      if (pinScreenTransform) this.pinOffsetter.unbindScreenTransform(pinScreenTransform);
      mapPin.sceneObject.destroy();
    }
    this.onMapPinRemovedEvent.invoke(mapPin);
  }
  removeMapPins() {
    this.pinSet.forEach((pin: MapPin) => {
      if(pin.sceneObject) {
          this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
          pin.sceneObject.destroy();
      }
    });
    this.pinSet.clear();
    this.pinnedPlaceSet.clear();
    this.onAllMapPinsRemovedEvent.invoke();
  }
  
  // ... Le reste du fichier est identique, seule la fonction showNearbyPlaces change
  // Colle le reste de ton fichier ici, puis remplace showNearbyPlaces par la version ci-dessous

  showNearbyPlaces(category: string[] | null): void {
    log.i(`showNearbyPlaces called with categories: ${category}`);
    if (!this.placesProvider) {
        log.e("PlacesProvider is not assigned!");
        this.onNearbyPlacesFailedEvent.invoke();
        return;
    }

    // NOUVELLE LOGIQUE : On demande activement la position
    log.i("Fetching current location to search for places...");
    this.fetchLocation(searchLocation => {
        if (!searchLocation) {
            log.e("Could not fetch location for search.");
            this.onNearbyPlacesFailedEvent.invoke();
            return;
        }

        log.i(`Location fetched: lat=${searchLocation.latitude}, lon=${searchLocation.longitude}. Now searching...`);
        
        // On utilise la position fraîchement récupérée pour la recherche.
        // On passe TOUJOURS 'null' à l'API pour la laisser utiliser sa propre source de vérité.
        this.placesProvider.getNearbyPlaces(null, NEARBY_PLACES_RANGE, category)
            .then((places) => {
                log.i(`API found ${places.length} raw places`);
                if (places.length === 0) {
                    log.w("getNearbyPlaces returned 0 results.");
                    this.onNoNearbyPlacesFoundEvent.invoke();
                    return;
                }
                this.placesProvider.getPlacesInfo(places)
                    .then((placesInfo: PlaceInfo[]) => {
                        log.i(`Got detailed info for ${placesInfo.length} places.`);
                        this.onNearbyPlacesSuccessEvent.invoke(placesInfo);
                    })
                    .catch((error) => {
                        log.e(`Failed to get places info: ${error}`);
                        this.onNearbyPlacesFailedEvent.invoke();
                    });
            })
            .catch((error) => {
                log.e(`Failed to get nearby places: ${error}`);
                this.onNearbyPlacesFailedEvent.invoke();
            });
    });
  }
}