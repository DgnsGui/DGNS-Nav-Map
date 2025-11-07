import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

export const TWEEN_DURATION = 0.3;
const TAG = "[MapUIController]";
const log = new NativeLogger(TAG);

@component
export class MapUIController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent;
  @input
  private spawnPinButton: PinchButton;
  @input
  private clearPinsButton: PinchButton;
  @input
  private zoomInButton: PinchButton;
  @input
  private zoomOutButton: PinchButton;
  @input
  private centerMapButton: PinchButton;
  @input
  private toggleMiniMapButton: ToggleButton;
  @input
  private showAllButton: PinchButton;
  @input
  private showRestaurantsButton: PinchButton;
  @input
  private showCafeButton: PinchButton;
  @input
  private showBarsButton: PinchButton;

  private isUserInteracting: boolean = false;
  private autoRotationStateBeforeInteraction: boolean = false;
  private rotationReEnableTimer: DelayedCallbackEvent = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    if (!this.mapComponent) {
      log.e("MapComponent is not assigned!");
      return;
    }
    this.setupBasicControlButtons();
    this.setupCategoryButtons();
  }

  private setupBasicControlButtons() {
    if (this.spawnPinButton) this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
    if (this.clearPinsButton) this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
    if (this.zoomInButton) this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
    if (this.zoomOutButton) this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
    if (this.centerMapButton) this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
    if (this.toggleMiniMapButton) this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
  }

  private setupCategoryButtons() {
    if (this.showAllButton) {
      this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
      log.i("Show All button setup complete");
    }
    if (this.showRestaurantsButton) {
      this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
      log.i("Show Restaurants button setup complete");
    }
    if (this.showCafeButton) {
      this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
      log.i("Show Cafe button setup complete");
    }
    if (this.showBarsButton) {
      this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
      log.i("Show Bars button setup complete");
    }
  }
  
  public handleMapTouchStart(localPosition: vec2): void {
    this.startUserInteraction();
    this.mapComponent.startTouch(localPosition);
  }

  public handleMapTouchUpdate(localPosition: vec2): void {
    this.mapComponent.updateTouch(localPosition);
  }

  public handleMapTouchEnd(localPosition: vec2): void {
    this.mapComponent.endTouch(localPosition);
    this.endUserInteraction();
  }
  
  public handleMapHover(localPosition: vec2): void {
    this.mapComponent.updateHover(localPosition);
  }

  private startUserInteraction(): void {
    if (this.isUserInteracting) return;
    this.isUserInteracting = true;
    this.autoRotationStateBeforeInteraction = this.mapComponent.getMinimapAutoRotate();
    if (this.rotationReEnableTimer) {
      this.rotationReEnableTimer.cancel();
      this.rotationReEnableTimer = null;
    }
  }

  private endUserInteraction(): void {
    if (!this.isUserInteracting) return;
    this.isUserInteracting = false;
    if (this.autoRotationStateBeforeInteraction) {
      this.rotationReEnableTimer = this.createEvent("DelayedCallbackEvent");
      this.rotationReEnableTimer.bind(() => {
        if (this.mapComponent && !this.isUserInteracting) {
          this.mapComponent.setMinimapAutoRotate(true);
        }
        this.rotationReEnableTimer = null;
      });
      this.rotationReEnableTimer.reset(0.5);
    }
  }

  private handleSpawnPinButtonPinched(event: InteractorEvent) { 
    log.i("Spawn pin button pinched");
    this.mapComponent.addPinByLocalPosition(vec2.zero()); 
  }
  
  private handleClearPinsButtonPinched(event: InteractorEvent) { 
    log.i("Clear pins button pinched");
    this.mapComponent.removeMapPins(); 
  }
  
  private handleZoomInButtonPinched(event: InteractorEvent) { 
    log.i("Zoom in button pinched");
    this.startUserInteraction(); 
    this.mapComponent.zoomIn(); 
    this.endUserInteraction(); 
  }
  
  private handleZoomOutButtonPinched(event: InteractorEvent) { 
    log.i("Zoom out button pinched");
    this.startUserInteraction(); 
    this.mapComponent.zoomOut(); 
    this.endUserInteraction(); 
  }
  
  private handleToggleMiniMapButtonPinched(isOn: boolean) { 
    log.i("Toggle mini map: " + isOn);
    this.mapComponent.toggleMiniMap(isOn); 
  }
  
  private handleShowAllButtonPinched(event: InteractorEvent) { 
    log.i("Show All button pinched - calling searchNearbyPlaces with null");
    this.searchNearbyPlaces(null, "All Places"); 
  }
  
  private handleShowRestaurantsButtonPinched(event: InteractorEvent) { 
    log.i("Show Restaurants button pinched - calling searchNearbyPlaces with ['restaurant']");
    this.searchNearbyPlaces(["restaurant"], "Restaurants"); 
  }
  
  private handleShowCafeButtonPinched(event: InteractorEvent) { 
    log.i("Show Cafe button pinched - calling searchNearbyPlaces with ['cafe']");
    this.searchNearbyPlaces(["cafe"], "Cafes"); 
  }
  
  private handleShowBarsButtonPinched(event: InteractorEvent) { 
    log.i("Show Bars button pinched - calling searchNearbyPlaces with ['bar']");
    this.searchNearbyPlaces(["bar"], "Bars"); 
  }

  private searchNearbyPlaces(categories: string[] | null, searchType: string) {
    if (!this.mapComponent) {
      log.e("MapComponent is not available!");
      return;
    }
    
    log.i(`Searching for nearby places: ${searchType}`);
    log.i(`Categories: ${categories ? categories.join(", ") : "null (all)"}`);
    
    try {
      this.mapComponent.showNeaybyPlaces(categories);
      log.i("showNearbyPlaces called successfully");
    } catch (error) {
      log.e(`Error calling showNearbyPlaces: ${error}`);
    }
  }
}