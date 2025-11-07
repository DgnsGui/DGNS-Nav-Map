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
    log.i("MapUIController starting...");
    
    if (!this.mapComponent) {
      log.e("MapComponent is not assigned!");
      return;
    }
    
    log.i("Setting up buttons...");
    this.setupBasicControlButtons();
    this.setupCategoryButtons();
    log.i("MapUIController initialized successfully");
  }

  private setupBasicControlButtons() {
    if (this.spawnPinButton) {
      this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
      log.i("Spawn pin button configured");
    }
    
    if (this.clearPinsButton) {
      this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
      log.i("Clear pins button configured");
    }
    
    if (this.zoomInButton) {
      this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
      log.i("Zoom in button configured");
    }
    
    if (this.zoomOutButton) {
      this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
      log.i("Zoom out button configured");
    }
    
    if (this.centerMapButton) {
      this.centerMapButton.onButtonPinched.add(() => this.mapComponent.centerMap());
      log.i("Center map button configured");
    }
    
    if (this.toggleMiniMapButton) {
      this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
      log.i("Toggle minimap button configured");
    }
  }

  private setupCategoryButtons() {
    if (this.showAllButton) {
      this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
      log.i("Show all button configured");
    }
    
    if (this.showRestaurantsButton) {
      this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
      log.i("Show restaurants button configured");
    }
    
    if (this.showCafeButton) {
      this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
      log.i("Show cafe button configured");
    }
    
    if (this.showBarsButton) {
      this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
      log.i("Show bars button configured");
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
    log.i("Spawn pin button pressed");
    this.mapComponent.addPinByLocalPosition(vec2.zero()); 
  }
  
  private handleClearPinsButtonPinched(event: InteractorEvent) { 
    log.i("Clear pins button pressed");
    this.mapComponent.removeMapPins(); 
  }
  
  private handleZoomInButtonPinched(event: InteractorEvent) { 
    log.i("Zoom in button pressed");
    this.startUserInteraction(); 
    this.mapComponent.zoomIn(); 
    this.endUserInteraction(); 
  }
  
  private handleZoomOutButtonPinched(event: InteractorEvent) { 
    log.i("Zoom out button pressed");
    this.startUserInteraction(); 
    this.mapComponent.zoomOut(); 
    this.endUserInteraction(); 
  }
  
  private handleToggleMiniMapButtonPinched(isOn: boolean) { 
    log.i(`Toggle minimap: ${isOn}`);
    this.mapComponent.toggleMiniMap(isOn); 
  }
  
  private handleShowAllButtonPinched(event: InteractorEvent) { 
    log.i("Show all places button pressed");
    this.searchNearbyPlaces([], "All Places"); 
  }
  
  private handleShowRestaurantsButtonPinched(event: InteractorEvent) { 
    log.i("Show restaurants button pressed");
    this.searchNearbyPlaces(["restaurant"], "Restaurants"); 
  }
  
  private handleShowCafeButtonPinched(event: InteractorEvent) { 
    log.i("Show cafe button pressed");
    this.searchNearbyPlaces(["cafe"], "Cafes"); 
  }
  
  private handleShowBarsButtonPinched(event: InteractorEvent) { 
    log.i("Show bars button pressed");
    this.searchNearbyPlaces(["bar"], "Bars"); 
  }

  private searchNearbyPlaces(categories: string[] | null, searchType: string) {
    log.i(`Searching for nearby places: ${searchType}, categories: ${categories}`);
    
    if (!this.mapComponent) {
      log.e("MapComponent is null - cannot search places");
      return;
    }
    
    // Vérifier que l'utilisateur a une position
    const userLocation = this.mapComponent.getUserLocation();
    if (!userLocation) {
      log.w("User location not available - cannot search places");
      return;
    }
    
    log.i(`User location: lat=${userLocation.latitude}, lon=${userLocation.longitude}`);
    
    try {
      this.mapComponent.showNeaybyPlaces(categories);
      log.i("Place search initiated successfully");
    } catch (error) {
      log.e(`Error searching places: ${error}`);
    }
  }

  // Méthode pour tester manuellement la fonctionnalité
  public testPlacesSearch(): void {
    log.i("Testing places search manually...");
    this.searchNearbyPlaces(["restaurant"], "Test Restaurants");
  }
}