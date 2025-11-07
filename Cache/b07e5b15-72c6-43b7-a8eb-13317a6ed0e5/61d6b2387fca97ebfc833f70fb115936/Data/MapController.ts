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

  private locationService: LocationService;
  private isMapComponent: boolean = true;
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

  // Map state
  private userPin: MapPin;
  private mapLocation: GeoPosition;
  private shouldFollowMapLocation = false;
  private viewScrolled: boolean;
  private lastMapUpdate = 0;
  private userLocation: GeoPosition;
  private loadedCells = 0;
  private mapCellCount = 0;

  // Pin management
  private hoveringPinSet: Set<MapPin> = new Set();
  private pinSet: Set<MapPin> = new Set();
  private pinnedPlaceSet: Set<string> = new Set();
  private isDraggingPin: boolean = false;
  private draggingPin: MapPin | null = null;

  // Render objects
  private mapRenderObject: SceneObject;
  private mapScreenTransform: ScreenTransform;

  // Rotation management
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

  // Events
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

  initialize(mapParameters: MapParameter, startedAsMiniMap: boolean): void {
    log.i("Initializing Map Controller");
    
    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(
      this.handleNorthAlignedOrientationUpdate.bind(this)
    );
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;

    this.mapParameters = mapParameters;

    this.mapRenderObject = this.mapRenderPrefab.instantiate(
      mapParameters.renderParent
    );
    this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());

    this.mapGridObject = this.mapRenderObject.getChild(0);
    this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
    this.mapPinsAnchor = this.mapGridObject.getChild(0);

    if (this.mapParameters.setMapToCustomLocation) {
      this.mapLocation = this.mapParameters.mapLocation;
    }

    this.fetchLocation((location: GeoPosition) => {
      if (!this.mapParameters.setMapToCustomLocation) {
        this.mapLocation = location;
      }

      this.createMapGrid();
      this.centerMap();

      if (mapParameters.showUserPin) {
        this.spawnUserPin(
          mapParameters.userPinVisual,
          location,
          mapParameters.userPinScale
        );
      }

      this.updateDispatcher
        .createUpdateEvent("UpdateEvent")
        .bind(this.onUpdate.bind(this));
      this.updateDispatcher
        .createLateUpdateEvent("LateUpdateEvent")
        .bind(() => this.gridView.updateGridView(this.pinSet, this.userPin));

      if (startedAsMiniMap) {
        this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
      }

      log.i("Map Controller initialized");
      this.isInitialized = true;
    });
  }

  private onUpdate() {
    if (!this.isInitialized) {
      return;
    }

    if (getTime() - this.lastMapUpdate > this.mapParameters.mapUpdateThreshold) {
      this.fetchLocation((location: GeoPosition) => {
        if (!this.mapParameters.setMapToCustomLocation) {
          this.setNewMapLocation(location);
        }

        if (this.mapParameters.showUserPin) {
          this.setNewUserPosition(location);
        }
      });

      this.lastMapUpdate = getTime();
    }
    this.updateRotations();
  }

  private fetchLocation(callback: callback<GeoPosition>) {
    this.locationService.getCurrentPosition(
      (geoPosition) => {
        callback(geoPosition);
      },
      (error) => {
        log.e(`Error fetching location: ${error}`);
      }
    );
  }

  private handleNorthAlignedOrientationUpdate(orientation: quat) {
    this.orientation = orientation;
    this.heading = normalizeAngle(customGetEuler(orientation).y);
  }

  private updateRotations() {
    const pinRotation = -this.getUserHeading();

    if (this.mapParameters.showUserPin) {
      this.updateUserPinRotation(pinRotation);
    }

    if (this.mapParameters.setMapToCustomLocation) {
      return;
    }

    if (
      this.mapParameters.isMinimapAutoRotate &&
      !this.viewScrolled &&
      this.config.isMiniMap
    ) {
      this.updateMapRotation();
      this.updateMapPinRotations(pinRotation);
    }
  }

  private updateMapPinRotations(pinRotation: number) {
    if (this.mapParameters.mapPinsRotated) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation);
        this.currentPinRotation = interpolate(
          this.currentPinRotation,
          this.targetPinRotation,
          4
        );
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = this.currentPinRotation;
        });
      } else {
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation);
        });
      }
    }
  }

  private updateMapRotation() {
    if (this.mapParameters.enableMapSmoothing) {
      this.targetMapRotation = quat.fromEulerAngles(0, 0, this.getUserHeading());
      this.currentMapRotation = interpolate(
        this.currentMapRotation,
        this.targetMapRotation,
        4
      );
      this.config.gridScreenTransform.rotation = this.currentMapRotation;
    } else {
      this.config.gridScreenTransform.rotation = quat.fromEulerAngles(
        0,
        0,
        this.getUserHeading()
      );
    }
  }

  private updateUserPinRotation(pinRotation: number) {
    if (
      this.userPin.screenTransform &&
      this.mapParameters.userPinAlignedWithOrientation
    ) {
      if (this.mapParameters.enableMapSmoothing) {
        this.targetUserRotation = quat.fromEulerAngles(0, 0, pinRotation);
        this.currentUserRotation = interpolate(
          this.currentUserRotation,
          this.targetUserRotation,
          4
        );
        this.userPin.screenTransform.rotation = this.currentUserRotation;
      } else {
        this.userPin.screenTransform.rotation = quat.fromEulerAngles(0, 0, pinRotation);
      }
    }
  }

  // ===== PUBLIC API =====

  getUserLocation(): GeoPosition {
    return this.userLocation;
  }

  getUserHeading(): number {
    if (global.deviceInfoSystem.isEditor()) {
      return -this.heading;
    }
    return this.heading;
  }

  getUserOrientation(): quat {
    return this.orientation;
  }

  setMinimapAutoRotate(enabled: boolean): void {
    this.mapParameters.isMinimapAutoRotate = enabled;
  }

  getMinimapAutoRotate(): boolean {
    return this.mapParameters.isMinimapAutoRotate;
  }

  createMapPin(location: GeoPosition, placeInfo: PlaceInfo = undefined): MapPin {
    const pin = MapPin.makeMapPin(
      this.mapParameters.mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder,
      location,
      placeInfo
    );

    this.pinSet.add(pin);

    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    pin.highlight();

    this.onMapPinAddedEvent.invoke(pin);
    return pin;
  }

  removeMapPin(mapPin: MapPin) {
    if (this.pinSet.has(mapPin)) {
      this.pinSet.delete(mapPin);
    }

    if (mapPin.placeInfo !== undefined) {
      this.pinnedPlaceSet.delete(mapPin.placeInfo.placeId);
    }

    const pinScreenTransform = mapPin.sceneObject.getComponent("ScreenTransform");
    this.pinOffsetter.unbindScreenTransform(pinScreenTransform);
    mapPin.sceneObject.destroy();

    this.onMapPinRemovedEvent.invoke(mapPin);
  }

  removeMapPins() {
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.unbindScreenTransform(pin.screenTransform);
      this.pinSet.delete(pin);
      pin.sceneObject.destroy();
    });

    this.pinnedPlaceSet.clear();
    this.onAllMapPinsRemovedEvent.invoke();
  }

  addPinByLocalPosition(localPosition: vec2): MapPin {
    const newPin = MapPin.makeMapPin(
      this.mapParameters.mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder,
      null
    );
    this.pinSet.add(newPin);

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    newPin.sceneObject.enabled = true;

    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
    this.setPinLocation(newPin, adjustedAnchoredPosition);

    return newPin;
  }

  private setPinLocation(pin: MapPin, adjustedAnchoredPosition: vec2) {
    const offset = this.gridView.getOffset().sub(this.offsetForLocation).sub(new vec2(0.5, 0.5));
    const location: GeoPosition = this.fromLocalPositionToLongLat(
      new vec2(
        adjustedAnchoredPosition.x - offset.x,
        adjustedAnchoredPosition.y + offset.y
      ),
      this.mapParameters.zoomLevel
    );
    pin.location = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      pin.location.longitude,
      pin.location.latitude
    );
    pin.location.altitude = this.userLocation.altitude;

    this.onMapPinAddedEvent.invoke(pin);
  }

  private fromLocalPositionToLongLat(localPosition: vec2, zoomLevel: number): GeoPosition {
    const pixelOffsetFromMapLocationX = localPosition.x * TEXTURE_SIZE;
    const pixelOffsetFromMapLocationY = -localPosition.y * TEXTURE_SIZE;

    const mapImageOffset = this.mapModule.longLatToImageRatio(
      this.mapLocation.longitude,
      this.mapLocation.latitude,
      this.northwestLocationAsset
    );

    const pixelX = mapImageOffset.x * TEXTURE_SIZE + pixelOffsetFromMapLocationX;
    const pixelY = mapImageOffset.y * TEXTURE_SIZE + pixelOffsetFromMapLocationY;

    const mapSize = TEXTURE_SIZE << zoomLevel;

    const x = clip(pixelX, 0, mapSize - 1) / mapSize - 0.5;
    const y = 0.5 - clip(pixelY, 0, mapSize - 1) / mapSize;

    const latitude = 90 - (360 * Math.atan(Math.exp(-y * 2 * Math.PI))) / Math.PI;
    const longitude = 360 * x;

    const location = GeoPosition.create();
    location.longitude = longitude;
    location.latitude = latitude;

    return location;
  }

  createMapPinAtUserLocation() {
    return this.createMapPin(this.userLocation);
  }

  updateLocationOffset() {
    this.offsetForLocation = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
  }

  private createMapGrid() {
    const gridScreenTransform = this.mapGridObject.getComponent("ScreenTransform");

    this.gridView = MapGridView.makeGridView(this);

    this.config = MapConfig.makeConfig(
      this.mapPinsAnchor,
      this.mapScreenTransform,
      gridScreenTransform,
      this.mapTilePrefab,
      this,
      this.mapParameters.enableScrolling,
      this.mapParameters.scrollingFriction,
      this.mapParameters.tileCount
    );

    this.initialMapLocation = GeoPosition.create();
    this.initialMapLocation.longitude = this.mapLocation.longitude;
    this.initialMapLocation.latitude = this.mapLocation.latitude;
    this.onInitialLocationSetEvent.invoke(this.initialMapLocation);

    this.shouldFollowMapLocation = true;
    this.setUpZoom();
  }

  configureCell(cell: Cell) {
    cell.imageComponent = cell.sceneObject.getComponent("Component.Image");
    cell.imageComponent.mainMaterial = cell.imageComponent.mainMaterial.clone();

    const mapTexture = this.mapModule.createMapTextureProvider();
    cell.textureProvider = mapTexture.control as MapTextureProvider;
    cell.imageComponent.mainPass.baseTex = mapTexture;

    cell.onTileCameIntoView.add((event) =>
      this.onTileCameIntoViewEvent.invoke(event)
    );

    cell.onTileWentOutOfView.add((event) =>
      this.onTileWentOutOfViewEvent.invoke(event)
    );

    cell.textureProvider.onFailed.add(() => {
      log.e("Location data failed to download");
      cell.retryTextureLoading();
    });

    cell.textureProvider.onReady.add(() => {
      this.mapTileloaded();
    });
  }

  private mapTileloaded() {
    this.loadedCells++;

    if (this.loadedCells == this.mapCellCount) {
      this.onMapTilesLoadedEvent.invoke();
    }
  }

  onCellCountChanged(cellCount: number): void {
    this.mapCellCount = cellCount;
  }

  private setUpZoom() {
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);

    this.updateLocationOffset();

    this.gridView.setOffset(
      this.offsetForLocation.add(this.mapParameters.mapFocusPosition)
    );

    this.pinOffsetter = PinOffs