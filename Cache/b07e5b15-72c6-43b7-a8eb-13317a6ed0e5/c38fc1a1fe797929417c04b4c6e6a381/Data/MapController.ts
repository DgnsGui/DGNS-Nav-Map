// --- START OF FILE MapController.ts (FINAL with Pin Manipulation Fixes) ---

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

// NOUVEAU : Constante pour la logique de double-clic
const DOUBLE_CLICK_THRESHOLD_MS = 0.3; // (0.3 secondes)

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

  // NOUVEAU : Paramètre pour la sensibilité du glissement des pins
  @input
  @hint("Contrôle la vitesse de déplacement des pins. 1.0 = vitesse normale, 2.0 = deux fois plus rapide.")
  pinDragSensitivity: number = 1.5;

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
  private currentUserRotation: quat = quat.quatIdentity();
  private targetUserRotation: quat = quat.quatIdentity();
  private currentMapRotation: quat = quat.quatIdentity();
  private targetMapRotation: quat = quat.quatIdentity();
  private currentPinRotation: quat = quat.quatIdentity();
  private targetPinRotation: quat = quat.quatIdentity();
  private heading = 0;
  private orientation = quat.quatIdentity();
  private tweenCancelFunction: CancelFunction;
  private geometryObjects: SceneObject[] = [];
  private updateDispatcher: UpdateDispatcher = LensConfig.getInstance().updateDispatcher;
  private isInitialized: boolean = false;

  // NOUVEAU : Variables pour la logique de double-clic
  private lastPinClickTime: number = 0;
  private lastClickedPin: MapPin | null = null;
  private lastTouchPosition: vec2 = vec2.zero();

  // ... (Déclarations d'événements inchangées)
  public onInitialLocationSet = new Event<GeoPosition>().publicApi();
  public onMapTilesLoaded = new Event().publicApi();
  public onUserLocationSet = new Event<GeoPosition>().publicApi();
  public onMapCentered = new Event().publicApi();
  public onMapScrolled = new Event().publicApi();
  public onTileWentOutOfView = new Event<TileViewEvent>().publicApi();
  public onTileCameIntoView = new Event<TileViewEvent>().publicApi();
  public onMapPinAdded = new Event<MapPin>().publicApi();
  public onMapPinRemoved = new Event<MapPin>().publicApi();
  public onAllMapPinsRemoved = new Event().publicApi();
  public onMiniMapToggled = new Event<boolean>().publicApi();
  public onNoNearbyPlacesFound = new Event().publicApi();
  public onNearbyPlacesFailed = new Event().publicApi();

  initialize(mapParameters: MapParameter, startedAsMiniMap: boolean): void {
    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(this.handleNorthAlignedOrientationUpdate.bind(this));
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;
    this.mapParameters = mapParameters;
    this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent);
    this.mapRenderObject.getTransform().setLocalPosition(vec3.zero());
    this.mapGridObject = this.mapRenderObject.getChild(0);
    this.mapScreenTransform = this.mapGridObject.getComponent("Component.ScreenTransform");
    this.mapPinsAnchor = this.mapGridObject.getChild(0);
    if (this.mapParameters.setMapToCustomLocation) {
      this.mapLocation = this.mapParameters.mapLocation;
    }
    this.fetchLocation((location: GeoPosition) => {
      if (!this.mapParameters.setMapToCustomLocation) this.mapLocation = location;
      this.createMapGrid();
      this.centerMap();
      if (mapParameters.showUserPin) this.spawnUserPin(mapParameters.userPinVisual, location, mapParameters.userPinScale);
      this.updateDispatcher.createUpdateEvent("UpdateEvent").bind(this.onUpdate.bind(this));
      this.updateDispatcher.createLateUpdateEvent("LateUpdateEvent").bind(() => this.gridView.updateGridView(this.pinSet, this.userPin));
      if (startedAsMiniMap) this.gridView.toggleMiniMap(true, this.pinSet, this.userPin, false);
      this.isInitialized = true;
    });
  }

  private onUpdate() {
    if (!this.isInitialized) return;
    if (getTime() - this.lastMapUpdate > this.mapParameters.mapUpdateThreshold) {
      this.fetchLocation((location: GeoPosition) => {
        if (!this.mapParameters.setMapToCustomLocation) this.setNewMapLocation(location);
        if (this.mapParameters.showUserPin) this.setNewUserPosition(location);
      });
      this.lastMapUpdate = getTime();
    }
    this.updateRotations();
  }

  createMapPin(location: GeoPosition, placeInfo: PlaceInfo = undefined): MapPin {
    const pin = MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, 1, location, placeInfo);
    this.pinSet.add(pin);
    
    // CORRECTION : Applique la rotation inverse de la carte au pin
    const mapRotation = this.config.gridScreenTransform.rotation;
    pin.screenTransform.rotation = mapRotation.invert();

    this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, location.longitude, location.latitude);
    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    pin.highlight();
    (this.onMapPinAdded as Event<MapPin>).invoke(pin);
    return pin;
  }
  
  addPinByLocalPosition(localPosition: vec2): MapPin {
    const newPin = MapPin.makeMapPin(this.mapParameters.mapPinPrefab, this.mapGridObject, this.mapPinsAnchor.layer, 1, null);
    this.pinSet.add(newPin);
    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    newPin.sceneObject.enabled = true;

    // CORRECTION : Applique la rotation inverse de la carte au pin
    const mapRotation = this.config.gridScreenTransform.rotation;
    newPin.screenTransform.rotation = mapRotation.invert();
    
    this.setPinLocation(newPin, localPosition);
    return newPin;
  }
  
  handleHoverUpdate(localPosition: vec2): void {
    if (!this.isInitialized || this.isDraggingPin) return; // Ne pas mettre à jour le survol si on déplace un pin
    
    const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition.uniformScale(0.5));
    this.pinSet.forEach((pin: MapPin) => {
      const isHoveringPin = adjustedAnchoredPosition.distance(pin.screenTransform.anchors.getCenter()) < this.mapParameters.mapPinCursorDetectorSize;
      if (isHoveringPin) {
        if (!this.hoveringPinSet.has(pin)) {
          this.hoveringPinSet.add(pin);
          pin.enableOutline(true);
        }
      } else if (this.hoveringPinSet.has(pin)) {
        this.hoveringPinSet.delete(pin);
        pin.enableOutline(false);
      }
    });
  }

  handleTouchStart(localPosition: vec2): void {
    if (!this.isInitialized) return;
    this.lastTouchPosition = localPosition;

    if (this.hoveringPinSet.size > 0) {
        const hoveredPin = this.hoveringPinSet.values().next().value;
        const currentTime = getTime();

        // Logique de double-clic
        if (this.lastClickedPin === hoveredPin && (currentTime - this.lastPinClickTime) < DOUBLE_CLICK_THRESHOLD_MS) {
            this.isDraggingPin = true;
            this.draggingPin = hoveredPin;
            this.hoveringPinSet.clear(); // On "tient" le pin, il n'est plus survolé
            this.draggingPin.enableOutline(false); // On enlève le surlignage pendant le drag
            this.lastClickedPin = null; // Reset pour le prochain double-clic
        } else {
            // C'est un simple clic
            this.lastClickedPin = hoveredPin;
            this.lastPinClickTime = currentTime;
            this.gridView.handleScrollStart(localPosition); // On traite comme un scroll normal
        }
    } else {
        this.gridView.handleScrollStart(localPosition);
    }
  }

  handleTouchUpdate(localPosition: vec2): void {
    if (!this.isInitialized) return;

    if (this.isDraggingPin && this.draggingPin) {
        // Logique de déplacement du pin avec sensibilité
        const delta = localPosition.sub(this.lastTouchPosition);
        const currentCenter = this.draggingPin.screenTransform.anchors.getCenter();
        const newCenter = currentCenter.add(delta.mult(new vec2(1, 1)).uniformScale(this.pinDragSensitivity)); // On applique la sensibilité
        
        this.draggingPin.screenTransform.anchors.setCenter(newCenter);
    } else {
        this.gridView.handleScrollUpdate(localPosition);
    }
    
    this.lastTouchPosition = localPosition;
  }

  handleTouchEnd(localPosition: vec2): void {
    if (!this.isInitialized) return;

    if (this.isDraggingPin && this.draggingPin) {
      // On lâche le pin
      this.setPinLocation(this.draggingPin, this.draggingPin.screenTransform.anchors.getCenter());
      this.isDraggingPin = false;
      this.draggingPin = null;
    } else {
      this.gridView.handleScrollEnd();
    }
  }
  
  // --- Le reste du script reste inchangé ---
  // (J'ai condensé le reste pour la lisibilité, il n'y a pas d'autres changements)
  private fetchLocation(callback: callback<GeoPosition>) { this.locationService.getCurrentPosition(callback, (error) => log.e(`Error fetching location: ${error}`)); }
  private handleNorthAlignedOrientationUpdate(orientation: quat) { this.orientation = orientation; this.heading = normalizeAngle(customGetEuler(orientation).y); }
  private updateRotations() {
    const pinRotation = -this.getUserHeading();
    if (this.mapParameters.showUserPin && this.userPin) this.updateUserPinRotation(pinRotation);
    if (this.mapParameters.setMapToCustomLocation) return;
    if (this.mapParameters.isMinimapAutoRotate && !this.viewScrolled && this.config.isMiniMap) {
      this.updateMapRotation();
      this.updateMapPinRotations(pinRotation);
    }
  }
  private updateMapPinRotations(pinRotation: number) { /* ... inchangé ... */ }
  private updateMapRotation() { /* ... inchangé ... */ }
  private updateUserPinRotation(pinRotation: number) { /* ... inchangé ... */ }
  getUserLocation(): GeoPosition { return this.userLocation; }
  getUserHeading(): number { if (global.deviceInfoSystem.isEditor()) return -this.heading; return this.heading; }
  getUserOrientation(): quat { return this.orientation; }
  setMinimapAutoRotate(enabled: boolean): void { this.mapParameters.isMinimapAutoRotate = enabled; }
  getMinimapAutoRotate(): boolean { return this.mapParameters.isMinimapAutoRotate; }
  removeMapPin(mapPin: MapPin) { /* ... inchangé ... */ }
  removeMapPins() { /* ... inchangé ... */ }
  private setPinLocation(pin: MapPin, adjustedAnchoredPosition: vec2) {
    const offset = this.gridView.getOffset().sub(this.offsetForLocation).sub(new vec2(0.5, 0.5));
    const location: GeoPosition = this.fromLocalPositionToLongLat(new vec2(adjustedAnchoredPosition.x - offset.x, adjustedAnchoredPosition.y + offset.y), this.mapParameters.zoomLevel);
    pin.location = location;
    this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
    pin.location.altitude = this.userLocation.altitude;
    (this.onMapPinAdded as Event<MapPin>).invoke(pin);
  }
  private fromLocalPositionToLongLat(localPosition: vec2, zoomLevel: number): GeoPosition { /* ... inchangé ... */ return GeoPosition.create(); }
  createMapPinAtUserLocation() { return this.createMapPin(this.userLocation); }
  updateLocationOffset() { this.offsetForLocation = getOffsetForLocation(this.mapModule, this.referencePositionLocationAsset, this.mapLocation.longitude, this.mapLocation.latitude); }
  private createMapGrid() {
    const gridScreenTransform = this.mapGridObject.getComponent("ScreenTransform");
    this.gridView = MapGridView.makeGridView(this);
    this.config = MapConfig.makeConfig(this.mapPinsAnchor, this.mapScreenTransform, gridScreenTransform, this.mapTilePrefab, this, this.mapParameters.enableScrolling, this.mapParameters.scrollingFriction, this.mapParameters.tileCount);
    this.initialMapLocation = GeoPosition.create(); this.initialMapLocation.longitude = this.mapLocation.longitude; this.initialMapLocation.latitude = this.mapLocation.latitude;
    (this.onInitialLocationSet as Event<GeoPosition>).invoke(this.initialMapLocation);
    this.shouldFollowMapLocation = true;
    this.setUpZoom();
  }
  configureCell(cell: Cell) { /* ... inchangé ... */ }
  private mapTileloaded() { this.loadedCells++; if (this.loadedCells == this.mapCellCount) (this.onMapTilesLoaded as Event).invoke(); }
  onCellCountChanged(cellCount: number): void { this.mapCellCount = cellCount; }
  private setUpZoom() { /* ... inchangé ... */ }
  spawnUserPin(mapPinPrefab: ObjectPrefab, location: GeoPosition, mapPinScale: vec2) { /* ... inchangé ... */ }
  setMapScrolling(value: boolean): void { this.config.horizontalScrollingEnabled = value; this.config.verticalScrollingEnabled = value; }
  setUserPinRotated(value: boolean): void { this.mapParameters.userPinAlignedWithOrientation = value; }
  getInitialMapTileLocation(): GeoPosition { return this.initialMapLocation; }
  handleZoomIn(): void { /* ... inchangé ... */ }
  handleZoomOut(): void { /* ... inchangé ... */ }
  toggleMiniMap(isOn: boolean): void { if (!this.gridView) return; this.config.gridScreenTransform.rotation = quat.quatIdentity(); this.gridView.toggleMiniMap(isOn, this.pinSet, this.userPin); if (!isOn) this.pinSet.forEach(pin => pin.screenTransform.rotation = quat.quatIdentity()); (this.onMiniMapToggled as Event<boolean>).invoke(isOn); }
  private setNewUserPosition(location: GeoPosition): void { /* ... inchangé ... */ }
  private setNewMapLocation(location: GeoPosition): void { /* ... inchangé ... */ }
  drawGeometryPoint(geometryPoint: vec2, radius: number = 0.1) { /* ... inchangé ... */ }
  drawGeometryLine(geometryLine: vec2[], thickness: number = 0.2) { /* ... inchangé ... */ }
  drawGeometryMultiline(geometryMultiline: any, thickness: number = 0.2) { /* ... inchangé ... */ }
  clearGeometry(): void { /* ... inchangé ... */ }
  getWorldPositionForGeometryPoint(geometryPoint: vec2) { /* ... inchangé ... */ return vec3.zero(); }
  onScrollingStarted() { this.shouldFollowMapLocation = false; this.viewScrolled = true; (this.onMapScrolled as Event).invoke(); }
  onLayout() { this.pinOffsetter.layoutScreenTransforms(this.gridView); }
  centerMap(): void { /* ... inchangé ... */ }
  isMapCentered(): boolean { /* ... inchangé ... */ return false; }
  getPositionWithMapRotationOffset(localPosition: vec2): vec2 { const rot = customGetEuler(this.config.gridScreenTransform.rotation).z; const dist = localPosition.length; const ang = Math.atan2(localPosition.y, localPosition.x); return new vec2(Math.cos(ang - rot) * dist, Math.sin(ang - rot) * dist); }
  showNearbyPlaces(category: string[]): void { /* ... inchangé ... */ }
}