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
const ZOOM_TWEEN_DURATION = 0.4;
const ROTATION_TWEEN_DURATION = 0.5;
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

  // Zoom animation state
  private isZooming: boolean = false;
  private zoomTweenCancel: CancelFunction | null = null;

  // Rotation animation state
  private isRotating: boolean = false;
  private rotationTweenCancel: CancelFunction | null = null;

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
      this.config.isMiniMap &&
      !this.isRotating
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
    if (enabled && !this.mapParameters.isMinimapAutoRotate) {
      // Activation de la rotation auto - animer vers la rotation actuelle
      this.animateMapRotationToHeading();
    }
    this.mapParameters.isMinimapAutoRotate = enabled;
  }

  getMinimapAutoRotate(): boolean {
    return this.mapParameters.isMinimapAutoRotate;
  }

  /**
   * Anime la rotation de la carte vers le heading actuel de l'utilisateur
   */
  private animateMapRotationToHeading(): void {
    if (!this.config.isMiniMap || this.viewScrolled) {
      return;
    }

    // Annuler toute animation de rotation en cours
    if (this.rotationTweenCancel) {
      this.rotationTweenCancel();
      this.rotationTweenCancel = null;
    }

    this.isRotating = true;
    
    const startRotation = this.config.gridScreenTransform.rotation;
    const targetRotation = quat.fromEulerAngles(0, 0, this.getUserHeading());
    const pinRotation = -this.getUserHeading();
    const targetPinRotation = quat.fromEulerAngles(0, 0, pinRotation);

    log.i(`Starting rotation animation from ${customGetEuler(startRotation).z} to ${this.getUserHeading()}`);

    this.rotationTweenCancel = makeTween((t) => {
      // Interpolation de la rotation de la carte
      const currentRotation = quat.slerp(startRotation, targetRotation, t);
      this.config.gridScreenTransform.rotation = currentRotation;
      this.currentMapRotation = currentRotation;

      // Rotation des pins si activée
      if (this.mapParameters.mapPinsRotated) {
        this.pinSet.forEach((pin: MapPin) => {
          pin.screenTransform.rotation = quat.slerp(
            quat.fromEulerAngles(0, 0, 0),
            targetPinRotation,
            t
          );
        });
        this.currentPinRotation = quat.slerp(
          quat.fromEulerAngles(0, 0, 0),
          targetPinRotation,
          t
        );
      }

      if (t === 1) {
        this.isRotating = false;
        this.rotationTweenCancel = null;
        log.i("Rotation animation complete");
      }
    }, ROTATION_TWEEN_DURATION);
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

    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(
      this.mapModule,
      this.referencePositionLocationAsset
    );

    this.gridView.handleUpdateConfig(this.config);
  }

  spawnUserPin(mapPinPrefab: ObjectPrefab, location: GeoPosition, mapPinScale: vec2) {
    this.userPin = MapPin.makeMapPin(
      mapPinPrefab,
      this.mapGridObject,
      this.mapPinsAnchor.layer,
      this.mapRenderOrder + 2,
      location,
      undefined,
      true
    );

    this.userPin.screenTransform.scale = new vec3(mapPinScale.x, mapPinScale.y, 1.0);

    this.pinOffsetter.bindScreenTransformToLocation(
      this.userPin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
  }

  setMapScrolling(value: boolean): void {
    this.config.horizontalScrollingEnabled = value;
    this.config.verticalScrollingEnabled = value;
  }

  setUserPinRotated(value: boolean): void {
    this.mapParameters.userPinAlignedWithOrientation = value;
  }

  getInitialMapTileLocation(): GeoPosition {
    return this.initialMapLocation;
  }

  // ===== INTERACTION HANDLERS =====

  handleHoverUpdate(localPosition: vec2): void {
    if (!this.isInitialized || this.isDraggingPin) {
      return;
    }
    
    localPosition = localPosition.uniformScale(0.5);
    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);

    this.pinSet.forEach((pin: MapPin) => {
      const isHoveringPin =
        adjustedAnchoredPosition.distance(pin.screenTransform.anchors.getCenter()) < 
        this.mapParameters.mapPinCursorDetectorSize;
        
      if (isHoveringPin) {
        log.i("Pin hovered");
        if (!this.hoveringPinSet.has(pin)) {
          this.hoveringPinSet.add(pin);
          pin.enableOutline(true);
        }
      } else if (this.hoveringPinSet.has(pin)) {
        log.i("Pin exit hover");
        this.hoveringPinSet.delete(pin);
        pin.enableOutline(false);
      }
    });
  }

  handleTouchStart(localPosition: vec2): void {
    if (!this.isInitialized) return;
    
    if (this.hoveringPinSet.size > 0) {
      log.i(`handleTouchStart`);
      for (let value of this.hoveringPinSet.values()) {
        this.draggingPin = value;
        break;
      }
      this.isDraggingPin = true;
    } else {
      this.gridView.handleScrollStart(localPosition);
    }
  }

  handleTouchUpdate(localPosition: vec2): void {
    if (!this.isInitialized) return;
    
    if (this.isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5);
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
      this.pinOffsetter.layoutScreenTransforms(this.gridView);
      this.pinOffsetter.unbindScreenTransform(this.draggingPin.screenTransform);
      this.draggingPin.screenTransform.anchors.setCenter(adjustedAnchoredPosition);
    } else {
      this.gridView.handleScrollUpdate(localPosition);
    }
  }

  handleTouchEnd(localPosition: vec2): void {
    if (!this.isInitialized) return;
    
    if (this.isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5);
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
      log.i(`handleTouchEnd at: ${adjustedAnchoredPosition}`);

      this.setPinLocation(this.draggingPin, adjustedAnchoredPosition.uniformScale(0.5));

      this.hoveringPinSet.add(this.draggingPin);
      this.draggingPin.sceneObject.getChild(0).enabled = true;

      this.draggingPin = null;
      this.isDraggingPin = false;
    } else {
      this.gridView.handleScrollEnd();
    }
  }

  /**
   * Zoom In avec transition fluide
   */
  handleZoomIn(): void {
    if (!this.isInitialized) {
      log.w("Cannot zoom: map not initialized");
      return;
    }

    if (this.isZooming) {
      log.w("Zoom already in progress");
      return;
    }

    log.i(`=== ZOOM IN from level ${this.mapParameters.zoomLevel} ===`);
    
    // Sauvegarder l'état actuel
    const oldOffset = new vec2(this.gridView.getOffset().x, this.gridView.getOffset().y);
    const oldZoomLevel = this.mapParameters.zoomLevel;
    const oldOffsetForLocation = new vec2(this.offsetForLocation.x, this.offsetForLocation.y);
    
    // Préparer le nouveau niveau de zoom
    const newZoomLevel = oldZoomLevel + 1;
    const zoomScale = 2;
    
    // Calculer les valeurs cibles
    this.mapParameters.zoomLevel = newZoomLevel;
    this.mapParameters.zoomOffet = calculateZoomOffset(newZoomLevel);
    
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    
    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    
    this.updateLocationOffset();
    
    const relativeOffset = oldOffset.sub(oldOffsetForLocation).sub(this.mapParameters.mapFocusPosition);
    const scaledRelativeOffset = relativeOffset.uniformScale(zoomScale);
    const targetOffset = this.offsetForLocation.add(scaledRelativeOffset).add(this.mapParameters.mapFocusPosition);
    
    // Recréer le PinOffsetter
    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(
      this.mapModule,
      this.referencePositionLocationAsset
    );
    
    // Animer la transition
    this.isZooming = true;
    
    if (this.zoomTweenCancel) {
      this.zoomTweenCancel();
    }
    
    this.zoomTweenCancel = makeTween((t) => {
      const currentOffset = vec2.lerp(oldOffset, targetOffset, t);
      this.gridView.setOffset(currentOffset);
      
      if (t === 1) {
        // Finaliser le zoom
        this.gridView.handleUpdateConfig(this.config);
        this.gridView.layoutCells(true);
        
        // Repositionner tous les pins
        this.pinSet.forEach((pin: MapPin) => {
          this.pinOffsetter.bindScreenTransformToLocation(
            pin.screenTransform,
            pin.location.longitude,
            pin.location.latitude
          );
        });
        
        if (this.userPin) {
          this.pinOffsetter.bindScreenTransformToLocation(
            this.userPin.screenTransform,
            this.userPin.location.longitude,
            this.userPin.location.latitude
          );
        }
        
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
        
        this.isZooming = false;
        this.zoomTweenCancel = null;
        log.i("=== ZOOM IN COMPLETE ===");
      }
    }, ZOOM_TWEEN_DURATION);
  }

  /**
   * Zoom Out avec transition fluide
   */
  handleZoomOut(): void {
    if (!this.isInitialized) {
      log.w("Cannot zoom: map not initialized");
      return;
    }

    if (this.mapParameters.zoomLevel <= 0) {
      log.w("Already at minimum zoom level");
      return;
    }

    if (this.isZooming) {
      log.w("Zoom already in progress");
      return;
    }

    log.i(`=== ZOOM OUT from level ${this.mapParameters.zoomLevel} ===`);
    
    // Sauvegarder l'état actuel
    const oldOffset = new vec2(this.gridView.getOffset().x, this.gridView.getOffset().y);
    const oldZoomLevel = this.mapParameters.zoomLevel;
    const oldOffsetForLocation = new vec2(this.offsetForLocation.x, this.offsetForLocation.y);
    
    // Préparer le nouveau niveau de zoom
    const newZoomLevel = oldZoomLevel - 1;
    const zoomScale = 0.5;
    
    // Calculer les valeurs cibles
    this.mapParameters.zoomLevel = newZoomLevel;
    this.mapParameters.zoomOffet = calculateZoomOffset(newZoomLevel);
    
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    
    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);
    
    this.updateLocationOffset();
    
    const relativeOffset = oldOffset.sub(oldOffsetForLocation).sub(this.mapParameters.mapFocusPosition);
    const scaledRelativeOffset = relativeOffset.uniformScale(zoomScale);
    const targetOffset = this.offsetForLocation.add(scaledRelativeOffset).add(this.mapParameters.mapFocusPosition);
    
    // Recréer le PinOffsetter
    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(
      this.mapModule,
      this.referencePositionLocationAsset
    );
    
    // Animer la transition
    this.isZooming = true;
    
    if (this.zoomTweenCancel) {
      this.zoomTweenCancel();
    }
    
    this.zoomTweenCancel = makeTween((t) => {
      const currentOffset = vec2.lerp(oldOffset, targetOffset, t);
      this.gridView.setOffset(currentOffset);
      
      if (t === 1) {
        // Finaliser le zoom
        this.gridView.handleUpdateConfig(this.config);
        this.gridView.layoutCells(true);
        
        // Repositionner tous les pins
        this.pinSet.forEach((pin: MapPin) => {
          this.pinOffsetter.bindScreenTransformToLocation(
            pin.screenTransform,
            pin.location.longitude,
            pin.location.latitude
          );
        });
        
        if (this.userPin) {
          this.pinOffsetter.bindScreenTransformToLocation(
            this.userPin.screenTransform,
            this.userPin.location.longitude,
            this.userPin.location.latitude
          );
        }
        
        this.pinOffsetter.layoutScreenTransforms(this.gridView);
        
        this.isZooming = false;
        this.zoomTweenCancel = null;
        log.i("=== ZOOM OUT COMPLETE ===");
      }
    }, ZOOM_TWEEN_DURATION);
  }

  toggleMiniMap(isOn: boolean): void {
    if (this.gridView === undefined) return;
    
    this.config.gridScreenTransform.rotation = quat.quatIdentity();
    this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin);

    if (!isOn) {
      this.pinSet.forEach((pin: MapPin) => {
        pin.screenTransform.rotation = quat.quatIdentity();
      });
    }

    this.onMiniMapToggledEvent.invoke(isOn);
  }

  // ===== MAP LOCATION MANAGEMENT =====

  private setNewUserPosition(location: GeoPosition): void {
    const oldUserLocation = this.userLocation;

    this.userLocation = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      this.userPin.screenTransform,
      location.longitude,
      location.latitude
    );
    this.pinOffsetter.layoutScreenTransforms(this.gridView);

    if (oldUserLocation === undefined && location !== undefined) {
      this.onUserLocationSetEvent.invoke(location);
    }
  }

  private setNewMapLocation(location: GeoPosition): void {
    this.mapLocation = location;
    this.pinOffsetter.bindScreenTransformToLocation(
      this.mapPinsAnchor.getComponent("ScreenTransform"),
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);

    if (this.shouldFollowMapLocation) {
      this.offsetForLocation = getOffsetForLocation(
        this.mapModule,
        this.referencePositionLocationAsset,
        location.longitude,
        location.latitude
      );
      this.gridView.setOffset(
        this.offsetForLocation.add(this.mapParameters.mapFocusPosition)
      );
    }
  }

  centerMap(): void {
    if (!this.isInitialized) return;

    if (this.tweenCancelFunction) {
      this.tweenCancelFunction();
    }

    const currentOffset = this.gridView.getOffset();
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    const targetOffset = userOffset.add(new vec2(0.5, 0.5));
    
    this.tweenCancelFunction = makeTween((t) => {
      this.gridView.resetVelocity();
      this.gridView.setOffset(vec2.lerp(currentOffset, targetOffset, t));
      if (t === 1) {
        this.shouldFollowMapLocation = true;
        this.viewScrolled = false;
        this.onMapCenteredEvent.invoke();
      }
    }, CENTER_MAP_TWEEN_DURATION);
  }

  isMapCentered(): boolean {
    const currentOffset: vec2 = this.gridView.getOffset();
    const userOffset: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    return currentOffset === userOffset.add(new vec2(0.5, 0.5));
  }

  getPositionWithMapRotationOffset(localPosition: vec2): vec2 {
    const degInRad = Math.atan2(localPosition.y, localPosition.x);
    const distance = Math.sqrt(
      localPosition.x * localPosition.x + localPosition.y * localPosition.y
    );
    const mapRotInRad = customGetEuler(this.config.gridScreenTransform.rotation).z;
    const adjustedRotationInRad = degInRad - mapRotInRad;
    const adjustedLocalPosition = new vec2(
      Math.cos(adjustedRotationInRad),
      Math.sin(adjustedRotationInRad)
    ).uniformScale(distance);
    return adjustedLocalPosition;
  }

  // ===== PLACES FUNCTIONALITY =====

  showNearbyPlaces(category: string[]): void {
    log.i(`showNearbyPlaces called with categories: ${category}`);
    
    if (!this.placesProvider) {
      log.e("PlacesProvider is not assigned! Please assign it in the inspector.");
      this.onNearbyPlacesFailedEvent.invoke();
      return;
    }
    
    if (!this.mapLocation) {
      log.e("Map location is not available");
      this.onNearbyPlacesFailedEvent.invoke();
      return;
    }
    
    if (!this.userLocation) {
      log.w("User location is not available, using map location instead");
    }
    
    const searchLocation = this.userLocation || this.mapLocation;
    log.i(`Searching near: lat=${searchLocation.latitude}, lon=${searchLocation.longitude}, range=${NEARBY_PLACES_RANGE}m`);

    this.placesProvider
      .getNearbyPlaces(searchLocation, NEARBY_PLACES_RANGE, category)
      .then((places) => {
        log.i(`Found ${places.length} places`);
        
        if (places.length === 0) {
          log.w("No nearby places found");
          this.onNoNearbyPlacesFoundEvent.invoke();
          return;
        }

        const placeString: string = places
          .map((place) => `${place.name}`)
          .join(", ");
        log.i("Places found: " + placeString);

        this.placesProvider
          .getPlacesInfo(places)
          .then((placesInfo: PlaceInfo[]) => {
            log.i(`Got detailed info for ${placesInfo.length} places`);
            
            let addedCount = 0;
            for (let i = 0; i < placesInfo.length; i++) {
              if (!this.pinnedPlaceSet.has(placesInfo[i].placeId)) {
                log.i(`Adding pin for: ${placesInfo[i].name}`);
                this.createMapPin(placesInfo[i].centroid, placesInfo[i]);
                this.pinnedPlaceSet.add(placesInfo[i].placeId);
                addedCount++;
              } else {
                log.i(`Place already pinned: ${placesInfo[i].name}`);
              }
            }
            
            log.i(`Successfully added ${addedCount} new place pins`);
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
  }

  // ===== GEOMETRY DRAWING =====

  drawGeometryPoint(geometryPoint: vec2, radius: number = 0.1) {
    const position: vec3 = this.getWorldPositionForGeometryPoint(geometryPoint);

    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
    screenTransform.rotation = this.currentMapRotation.invert();

    const renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeCircle2DMesh(position, radius),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  drawGeometryLine(geometryLine: vec2[], thickness: number = 0.2) {
    const start = this.getWorldPositionForGeometryPoint(geometryLine[0]);
    const end = this.getWorldPositionForGeometryPoint(geometryLine[1]);

    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
    screenTransform.rotation = this.currentMapRotation.invert();

    const renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints([start, end], thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  drawGeometryMultiline(geometryMultiline, thickness: number = 0.2) {
    const sceneObject = global.scene.createSceneObject("");
    sceneObject.setParent(this.getSceneObject());
    const screenTransform = sceneObject.createComponent("Component.ScreenTransform");
    screenTransform.rotation = this.currentMapRotation.invert();

    const renderMeshSceneObject = global.scene.createSceneObject("");
    renderMeshSceneObject.setParent(sceneObject);
    renderMeshSceneObject.layer = this.getSceneObject().layer;

    const positions: vec3[] = geometryMultiline.map((point) =>
      this.getWorldPositionForGeometryPoint(point)
    );

    addRenderMeshVisual(
      renderMeshSceneObject,
      makeLineStrip2DMeshWithJoints(positions, thickness),
      this.lineMaterial,
      this.mapRenderOrder + 1
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      screenTransform,
      this.mapLocation.longitude,
      this.mapLocation.latitude
    );
    this.geometryObjects.push(sceneObject);
  }

  clearGeometry(): void {
    this.geometryObjects.forEach((sceneObject: SceneObject) => {
      this.pinOffsetter.unbindScreenTransform(
        sceneObject.getComponent("Component.ScreenTransform")
      );
      sceneObject.destroy();
    });
    this.geometryObjects = [];
  }

  getWorldPositionForGeometryPoint(geometryPoint: vec2) {
    const offset = this.gridView.getOffset();

    const initialTileOffset = this.mapModule.longLatToImageRatio(
      geometryPoint.x,
      geometryPoint.y,
      this.referencePositionLocationAsset
    );
    const localPoint = new vec2(
      lerp(-1, 1, offset.x + initialTileOffset.x),
      lerp(1, -1, offset.y + initialTileOffset.y)
    );
    return this.config.gridScreenTransform.localPointToWorldPoint(localPoint);
  }

  // ===== CONFIG BINDINGS =====

  onContentMaskRenderLayer(renderLayer) {
    forEachSceneObjectInSubHierarchy(this.mapPinsAnchor, (sceneObject) => {
      sceneObject.layer = renderLayer;
    });
  }

  onScrollingStarted() {
    log.i("onScrollingStarted");
    this.shouldFollowMapLocation = false;
    this.viewScrolled = true;
    this.onMapScrolledEvent.invoke();
  }

  onLayout() {
    this.pinOffsetter.layoutScreenTransforms(this.gridView);
  }
}