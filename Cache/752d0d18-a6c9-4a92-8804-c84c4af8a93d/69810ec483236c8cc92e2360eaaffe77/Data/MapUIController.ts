import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { ContainerFrame } from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

// Export the constant that other files are importing
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
  private showRestaurantsButton: PinchButton;
  @input
  private showCafeButton: PinchButton;
  @input
  private showBarsButton: PinchButton;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    // Setup button callbacks only - no position manipulation
    this.spawnPinButton.onButtonPinched.add(
      this.handleSpawnPinButtonPinched.bind(this)
    );
    
    this.clearPinsButton.onButtonPinched.add(
      this.handleClearPinsButtonPinched.bind(this)
    );
    
    this.zoomInButton.onButtonPinched.add(
      this.handleZoomInButtonPinched.bind(this)
    );
    
    this.zoomOutButton.onButtonPinched.add(
      this.handleZoomOutButtonPinched.bind(this)
    );
    
    this.centerMapButton.onButtonPinched.add(() => {
      this.mapComponent.centerMap();
    });
    
    this.toggleMiniMapButton.onStateChanged.add(
      this.handleToggleMiniMapButtonPinched.bind(this)
    );

    this.showCafeButton.onButtonPinched.add(
      this.handleShowCafeButtonPinched.bind(this)
    );
    
    this.showBarsButton.onButtonPinched.add(
      this.handleShowBarsButtonPinched.bind(this)
    );
    
    this.showRestaurantsButton.onButtonPinched.add(
      this.handleShowRestaurantsButtonPinched.bind(this)
    );

    log.i("MapUIController initialized - buttons ready");
  }

  private handleSpawnPinButtonPinched(event: InteractorEvent) {
    this.mapComponent.addPinByLocalPosition(vec2.zero());
  }

  private handleClearPinsButtonPinched(event: InteractorEvent) {
    this.mapComponent.removeMapPins();
  }

  private handleZoomInButtonPinched(event: InteractorEvent) {
    this.mapComponent.zoomIn();
  }

  private handleZoomOutButtonPinched(event: InteractorEvent) {
    this.mapComponent.zoomOut();
  }

  private handleToggleMiniMapButtonPinched(isOn: boolean) {
    log.i("Toggling minimap " + isOn);
    this.mapComponent.toggleMiniMap(isOn);
  }

  private handleShowCafeButtonPinched(event: InteractorEvent) {
    log.i("Searching for cafes");
    // Identifiants pour l'API Snap Places - ajustez selon la documentation
    this.mapComponent.showNeaybyPlaces(["cafe", "coffee"]);
  }

  private handleShowBarsButtonPinched(event: InteractorEvent) {
    log.i("Searching for bars/pubs");
    // Identifiants pour l'API Snap Places - ajustez selon la documentation
    this.mapComponent.showNeaybyPlaces(["bar", "pub"]);
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    log.i("Searching for restaurants");
    // Identifiants pour l'API Snap Places - ajustez selon la documentation
    this.mapComponent.showNeaybyPlaces(["restaurant", "food"]);
  }
}