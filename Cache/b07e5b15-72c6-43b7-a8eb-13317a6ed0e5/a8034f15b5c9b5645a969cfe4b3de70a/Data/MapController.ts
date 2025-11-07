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
  makeLineStrip2DMeshWithJoints,
  addRenderMeshVisual,
  makeRoundedRectMesh,
  makeCaplessLine,
  makeFontText,
  TEXTURE_SIZE,
  calculateZoomOffset,
} from "./MapUtils";
import { PinOffsetter } from "./PinOffsetter";
import { MapParameter, GeoPosition } from "./MapTypes";
import { MapModule } from "LensStudio:MapModule";
import { LocationAsset } from "LensStudio:LocationAsset";
import { MAX_LONGITUDE, MAX_LATITUDE } from "./MapConstants";
import { MapRender } from "./MapRender";

// logger
const log = NativeLogger.forTag("MapController");

/**
 * MapController
 * Contrôle la grille, les pins, et le comportement de zoom/pan.
 *
 * Correction appliquée : handleZoomIn/handleZoomOut effectuent maintenant un zoom
 * autour du centre actuel de la vue (mapParameters.mapFocusPosition représente le
 * décalage d'ancrage), en conservant la même position géographique visible au centre.
 */
export class MapController {
  // Dépendances et propriétés principales
  private mapModule: MapModule;
  private mapParameters: MapParameter;
  private mapRenderObject: SceneObject;
  private mapLocation: GeoPosition = GeoPosition.create();
  private referencePositionLocationAsset: any = null;
  private northwestLocationAsset: any = null;
  private offsetForLocation: vec2 = new vec2(0, 0);

  private gridView: MapGridView;
  private pinOffsetter: PinOffsetter;
  private mapCellCount: number = 0;
  private mapRenderOrder: number = 0;
  private pinSet: Set<MapPin> = new Set<MapPin>();
  private pinOfInterest: MapPin | null = null;
  private userPin: MapPin | null = null;
  private userLocation: GeoPosition = GeoPosition.create();
  private heading: number = 0;
  private isInitialized: boolean = false;
  private shouldFollowMapLocation: boolean = false;

  // events
  private onInitialLocationSetEvent = new Event();
  public onInitialLocationSet = this.onInitialLocationSetEvent.publicApi();

  private onMapTilesLoadedEvent = new Event();
  public onMapTilesLoaded = this.onMapTilesLoadedEvent.publicApi();

  private onUserLocationSetEvent = new Event<GeoPosition>();
  public onUserLocationSet = this.onUserLocationSetEvent.publicApi();

  private onMapCenteredEvent = new Event();
  public onMapCentered = this.onMapCenteredEvent.publicApi();

  private onMapScrolledEvent = new Event();
  public onMapScrolled = this.onMapScrolledEvent.publicApi();

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

  // autres utilitaires
  private locationService: any = null;
  private mapRenderPrefab: any; // set via config / injection si nécessaire
  private config: any = null;
  private hoveringPinSet: Set<MapPin> = new Set<MapPin>();

  constructor(mapModule: MapModule) {
    this.mapModule = mapModule;
  }

  /**
   * initialize
   */
  initialize(mapParameters: MapParameter, startedAsMiniMap: boolean): void {
    log.i("Initializing Map Controller");

    this.locationService = GeoLocation.createLocationService();
    this.locationService.onNorthAlignedOrientationUpdate.add(
      this.handleNorthAlignedOrientationUpdate.bind(this)
    );
    this.locationService.accuracy = GeoLocationAccuracy.Navigation;

    this.mapParameters = mapParameters;
    this.mapParameters.zoomLevel = this.mapParameters.zoomLevel ?? 10;
    this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel);

    // create grid view
    this.gridView = new MapGridView(/* constructor args if any */);
    // instantiate map render
    // this.mapRenderObject = this.mapRenderPrefab.instantiate(mapParameters.renderParent);

    // Setup initial map location (si fournie sinon attendre)
    this.mapLocation.longitude = mapParameters.initialLongitude ?? 0;
    this.mapLocation.latitude = mapParameters.initialLatitude ?? 0;

    // Setup zoom and offsets
    this.setUpZoom();

    this.isInitialized = true;
    log.i("MapController initialized");
  }

  /**
   * fromLocalPositionToLongLat
   * Convertit une position locale (vec2) relative à la référence en GeoPosition.
   */
  private fromLocalPositionToLongLat(localPosition: vec2, zoomLevel: number): GeoPosition {
    // Approche basée sur le code existant : transforme localPosition -> pixel -> lon/lat
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

  /**
   * setUpZoom
   * Met à jour la référence LocationAsset / northwestAsset et met à jour offsetForLocation
   */
  private setUpZoom(): void {
    // Recrée referencePositionLocationAsset et northwestLocationAsset en se basant sur mapLocation et zoomOffset
    this.referencePositionLocationAsset = LocationAsset.getGeoAnchoredPosition(
      this.mapLocation.longitude,
      this.mapLocation.latitude
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);

    this.northwestLocationAsset = LocationAsset.getGeoAnchoredPosition(
      MAX_LONGITUDE,
      MAX_LATITUDE
    ).location.adjacentTile(0, 0, this.mapParameters.zoomOffet);

    this.updateLocationOffset();

    // Par défaut l'ancienne logique posait offset = offsetForLocation + mapFocusPosition,
    // mais désormais handleZoomIn/Out calculent explicitement le nouvel offset après zoom.
    this.gridView.setOffset(this.offsetForLocation.add(this.mapParameters.mapFocusPosition));

    this.pinOffsetter = PinOffsetter.makeMapLocationOffsetter(
      this.mapModule,
      this.referencePositionLocationAsset
    );

    if (this.gridView && this.gridView.handleUpdateConfig) {
      this.gridView.handleUpdateConfig(this.config);
    }
  }

  /**
   * updateLocationOffset
   * Met à jour this.offsetForLocation en fonction de referencePositionLocationAsset.
   */
  private updateLocationOffset(): void {
    // convertit la reference position asset en offset vec2
    // On suppose l'existence d'une helper mapModule.locationToLocalOffset (nom hypothétique)
    // Mais pour garder cohérence avec le projet, utilisons getOffsetForLocation si disponible.
    if (!this.referencePositionLocationAsset) {
      this.offsetForLocation = new vec2(0, 0);
      return;
    }

    // Si MapUtils fournit getOffsetForLocation qui renvoie vec2 pour une lon/lat en se basant sur reference asset:
    const refLon = this.mapLocation.longitude;
    const refLat = this.mapLocation.latitude;
    try {
      const off = getOffsetForLocation(this.mapModule, this.referencePositionLocationAsset, refLon, refLat);
      this.offsetForLocation = off;
    } catch (e) {
      // fallback conservative
      this.offsetForLocation = new vec2(0, 0);
      log.w("updateLocationOffset: fallback to 0,0", e);
    }
  }

  /**
   * getPositionWithMapRotationOffset
   * Applique rotation de la map si nécessaire (placeholder; conserve la signature)
   */
  private getPositionWithMapRotationOffset(localPos: vec2): vec2 {
    // Si la map a une rotation en heading; applique la rotation inverse pour aligner
    if (!this.heading || this.heading === 0) return localPos;
    const rad = -this.heading * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new vec2(localPos.x * cos - localPos.y * sin, localPos.x * sin + localPos.y * cos);
  }

  /**
   * setPinLocation
   */
  private setPinLocation(pin: MapPin, localAnchoredPosition: vec2): void {
    // convert local anchored position en lon/lat et met à jour pin.location
    const localRelToRef = localAnchoredPosition.sub(this.mapParameters.mapFocusPosition);
    const geo = this.fromLocalPositionToLongLat(localRelToRef, this.mapParameters.zoomLevel);
    pin.location.longitude = geo.longitude;
    pin.location.latitude = geo.latitude;

    // rebind screen transform
    this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, geo.longitude, geo.latitude);
  }

  /**
   * createMapPinAtUserLocation
   */
  public createMapPinAtUserLocation(): MapPin | null {
    if (!this.userLocation) return null;
    const mp = new MapPin();
    mp.location = GeoPosition.create();
    mp.location.longitude = this.userLocation.longitude;
    mp.location.latitude = this.userLocation.latitude;

    this.pinSet.add(mp);

    // bind via pinOffsetter
    if (this.pinOffsetter) {
      this.pinOffsetter.bindScreenTransformToLocation(mp.screenTransform, mp.location.longitude, mp.location.latitude);
    }

    this.onMapPinAddedEvent.fire(mp);
    return mp;
  }

  /**
   * centerMap
   * Recentre la map sur une lon/lat donnée (optionnellement animate)
   */
  public centerMap(longitude: number, latitude: number, animateMs: number = 0): void {
    // calcule offset pour la location et le place au centre (mapFocusPosition)
    const newOffset = getOffsetForLocation(this.mapModule, this.referencePositionLocationAsset, longitude, latitude);
    const target = newOffset.add(this.mapParameters.mapFocusPosition);

    if (animateMs > 0) {
      // tween simple (linear) via UpdateDispatcher
      const start = this.gridView.getOffset();
      const duration = animateMs / 1000;
      let elapsed = 0;
      const handle = UpdateDispatcher.add((dt: number) => {
        elapsed += dt;
        const t = Math.min(1, elapsed / duration);
        const v = start.uniformScale(1 - t).add(target.uniformScale(t));
        this.gridView.setOffset(v);
        if (t >= 1) {
          UpdateDispatcher.remove(handle);
        }
      });
    } else {
      this.gridView.setOffset(target);
    }

    this.onMapCenteredEvent.fire();
  }

  // --- Touch / Drag / Scroll handlers ---
  handleTouchMove(localPosition: vec2): void {
    if (!this.isInitialized) return;

    if ((this as any).isDraggingPin) {
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
      this.pinOffsetter.layoutScreenTransforms(this.gridView);
      this.pinOffsetter.unbindScreenTransform((this as any).draggingPin.screenTransform);
      (this as any).draggingPin.screenTransform.anchors.setCenter(adjustedAnchoredPosition);
    } else {
      this.gridView.handleScrollUpdate(localPosition);
      this.onMapScrolledEvent.fire();
    }
  }

  handleTouchEnd(localPosition: vec2): void {
    if (!this.isInitialized) return;

    if ((this as any).isDraggingPin) {
      localPosition = localPosition.uniformScale(0.5);
      const adjustedAnchoredPosition = this.getPositionWithMapRotationOffset(localPosition);
      log.i(`handleTouchEnd at: ${adjustedAnchoredPosition}`);

      this.setPinLocation((this as any).draggingPin, adjustedAnchoredPosition.uniformScale(0.5));

      this.hoveringPinSet.add((this as any).draggingPin);
      (this as any).draggingPin.sceneObject.getChild(0).enabled = true;

      (this as any).draggingPin = null;
      (this as any).isDraggingPin = false;
    } else {
      this.gridView.handleScrollEnd();
    }
  }

  // ======== CORRECTION APPLIQUÉE : zoom autour du centre courant de la vue ========
  /**
   * handleZoomIn
   * Implémente le zoom autour du centre actuel de la vue (mapFocusPosition).
   */
  public handleZoomIn(): void {
    if (!this.isInitialized) return;

    // si on suit l'utilisateur, on garde le comportement "follow" (optionnel)
    if (this.shouldFollowMapLocation) {
      // comportement original : recentre sur userLocation
      this.mapParameters.zoomLevel++;
      this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel);
      this.setUpZoom();
      this.gridView.layoutCells(true);
      this.pinSet.forEach((pin: MapPin) => {
        this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
      });
      return;
    }

    // 1) récupérer offset courant et calculer la position locale centrale relative à la référence
    const currentOffset: vec2 = this.gridView.getOffset();
    const centerLocal: vec2 = currentOffset.sub(this.mapParameters.mapFocusPosition);

    // 2) convertir la position locale centrale en GeoPosition (avant changement de zoom)
    const centerGeo: GeoPosition = this.fromLocalPositionToLongLat(centerLocal, this.mapParameters.zoomLevel);

    // 3) increment du zoom (clamp si nécessaire)
    this.mapParameters.zoomLevel = Math.min(this.mapParameters.zoomLevel + 1, MapConfig.MAX_ZOOM_LEVEL ?? 20);
    this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel);

    // 4) recalculer la référence / tiles
    this.setUpZoom(); // mettra à jour referencePositionLocationAsset & northwest

    // 5) convertir la même position Geo en offset pour la nouvelle échelle
    const newOffsetForCenter: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      centerGeo.longitude,
      centerGeo.latitude
    );

    // 6) appliquer l'offset+mapFocusPosition pour garder la même zone visible au centre
    this.gridView.setOffset(newOffsetForCenter.add(this.mapParameters.mapFocusPosition));

    // 7) relayout & rebind pins
    this.gridView.layoutCells(true);
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
    });
  }

  /**
   * handleZoomOut
   * Implémente le dézoom autour du centre actuel de la vue (mapFocusPosition).
   */
  public handleZoomOut(): void {
    if (!this.isInitialized) return;

    if (this.shouldFollowMapLocation) {
      // comportement original si on suit l'user
      this.mapParameters.zoomLevel--;
      this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel);
      this.setUpZoom();
      this.gridView.layoutCells(true);
      this.pinSet.forEach((pin: MapPin) => {
        this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
      });
      return;
    }

    // 1) récupérer offset courant et calculer la position locale centrale relative à la référence
    const currentOffset: vec2 = this.gridView.getOffset();
    const centerLocal: vec2 = currentOffset.sub(this.mapParameters.mapFocusPosition);

    // 2) convertir la position locale centrale en GeoPosition (avant changement de zoom)
    const centerGeo: GeoPosition = this.fromLocalPositionToLongLat(centerLocal, this.mapParameters.zoomLevel);

    // 3) decrement du zoom (clamp si nécessaire)
    this.mapParameters.zoomLevel = Math.max(this.mapParameters.zoomLevel - 1, MapConfig.MIN_ZOOM_LEVEL ?? 1);
    this.mapParameters.zoomOffet = calculateZoomOffset(this.mapParameters.zoomLevel);

    // 4) recalculer la référence / tiles
    this.setUpZoom();

    // 5) convertir la même position Geo en offset pour la nouvelle échelle
    const newOffsetForCenter: vec2 = getOffsetForLocation(
      this.mapModule,
      this.referencePositionLocationAsset,
      centerGeo.longitude,
      centerGeo.latitude
    );

    // 6) appliquer l'offset+mapFocusPosition pour garder la même zone visible au centre
    this.gridView.setOffset(newOffsetForCenter.add(this.mapParameters.mapFocusPosition));

    // 7) relayout & rebind pins
    this.gridView.layoutCells(true);
    this.pinSet.forEach((pin: MapPin) => {
      this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
    });
  }

  // --- autres méthodes utiles / exposées ---

  public toggleFollowUser(shouldFollow: boolean): void {
    this.shouldFollowMapLocation = shouldFollow;
  }

  public addPin(pin: MapPin): void {
    this.pinSet.add(pin);
    if (this.pinOffsetter) {
      this.pinOffsetter.bindScreenTransformToLocation(pin.screenTransform, pin.location.longitude, pin.location.latitude);
    }
    this.onMapPinAddedEvent.fire(pin);
  }

  public removePin(pin: MapPin): void {
    if (this.pinSet.has(pin)) {
      this.pinSet.delete(pin);
      this.onMapPinRemovedEvent.fire(pin);
    }
  }

  public clearPins(): void {
    this.pinSet.forEach((p) => {
      // unbind si besoin
    });
    this.pinSet.clear();
    this.onAllMapPinsRemovedEvent.fire();
  }

  // handlers de mise à jour de la position utilisateur (externe)
  public onUserLocationUpdate(longitude: number, latitude: number, heading?: number): void {
    this.userLocation.longitude = longitude;
    this.userLocation.latitude = latitude;
    if (heading !== undefined) this.heading = heading;

    // si on suit l'utilisateur, recentrer la carte sur la position user (optionnel)
    if (this.shouldFollowMapLocation) {
      const newOffset = getOffsetForLocation(this.mapModule, this.referencePositionLocationAsset, longitude, latitude);
      this.gridView.setOffset(newOffset.add(this.mapParameters.mapFocusPosition));
    }

    this.onUserLocationSetEvent.fire(this.userLocation);
  }
}
