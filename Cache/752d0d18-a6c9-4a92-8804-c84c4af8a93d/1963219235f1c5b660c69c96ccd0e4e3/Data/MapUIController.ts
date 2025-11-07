import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { makeTween } from "../MapComponent/Scripts/MapUtils";
import { ContainerFrame } from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame";
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton";
import { ToggleButton } from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

export const TWEEN_DURATION = 0.3;
// Use only one set of button positions (full map positions)
const ZOOM_IN_BUTTON_OFFSET = new vec3(22.8488, -32, 2);
const ZOOM_OUT_BUTTON_OFFSET = new vec3(17.5945, -32, 2);
const CENTER_MAP_BUTTON_OFFSET = new vec3(9, -32, 2);
const TOGGLE_BUTTON_OFFSET = new vec3(-31, 32, 2);

enum ButtonType {
  SPAWN_PIN,
  CLEAR_PINS,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_MAP,
  TOGGLE_MINI_MAP,
  SHOW_CAFE,
  SHOW_BARS,
  SHOW_RESTAURANTS,
}

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

  // For debugging
  @input
  @allowUndefined
  private logObject: SceneObject;

  private buttonTransforms: Transform[];
  private tweenCancelFunction: CancelFunction;
  
  // Flag to prevent infinite loops
  private isInitializing: boolean = false;
  private frameCount: number = 0;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    
    // Désactiver l'événement d'update pour le moment
    // this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
    
    log.i("MapUIController awakened");
  }

  private onStart() {
    log.i("MapUIController starting...");
    
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
    this.centerMapButton.onButtonPinched.add(() =>
      this.mapComponent.centerMap()
    );
    
    // Temporairement désactiver le toggle pour isoler le problème
    // this.toggleMiniMapButton.onStateChanged.add(
    //   this.handleToggleMiniMapButtonPinched.bind(this)
    // );

    this.showCafeButton.onButtonPinched.add(
      this.handleShowCafeButtonPinched.bind(this)
    );
    this.showBarsButton.onButtonPinched.add(
      this.handleShowPubsButtonPinched.bind(this)
    );
    this.showRestaurantsButton.onButtonPinched.add(
      this.handleShowRestaurantsButtonPinched.bind(this)
    );

    // Should have the same order as the ButtonType enum
    this.buttonTransforms = [
      this.spawnPinButton.getTransform(),
      this.clearPinsButton.getTransform(),
      this.zoomInButton.getTransform(),
      this.zoomOutButton.getTransform(),
      this.centerMapButton.getTransform(),
      this.toggleMiniMapButton.getTransform(),
      this.showCafeButton.getTransform(),
      this.showBarsButton.getTransform(),
      this.showRestaurantsButton.getTransform(),
    ];

    if (this.logObject !== undefined) {
      this.buttonTransforms.push(this.logObject.getTransform());
    }

    // Log current positions before any changes
    this.logCurrentPositions("BEFORE initialization");
    
    // Set positions immediately
    this.forceButtonPositions();
    
    // Log positions after changes
    this.logCurrentPositions("AFTER initialization");
    
    this.enableAllButtons();
    
    // Multiple delayed attempts to ensure positions stick
    this.schedulePositionEnforcement();
  }
  
  private logCurrentPositions(context: string) {
    log.i(`=== ${context} ===`);
    log.i(`Zoom In actual position: ${this.buttonTransforms[ButtonType.ZOOM_IN].getLocalPosition().toString()}`);
    log.i(`Zoom Out actual position: ${this.buttonTransforms[ButtonType.ZOOM_OUT].getLocalPosition().toString()}`);
    log.i(`Center Map actual position: ${this.buttonTransforms[ButtonType.CENTER_MAP].getLocalPosition().toString()}`);
    log.i(`Toggle actual position: ${this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].getLocalPosition().toString()}`);
    log.i(`=================`);
  }
  
  private schedulePositionEnforcement() {
    // Schedule multiple position enforcements at different intervals
    const intervals = [0.1, 0.2, 0.5, 1.0, 2.0];
    
    intervals.forEach((delay, index) => {
      const delayedEvent = this.createEvent("DelayedCallbackEvent");
      delayedEvent.reset(delay);
      delayedEvent.bind(() => {
        log.i(`Enforcing positions at ${delay}s delay`);
        this.forceButtonPositions();
        this.logCurrentPositions(`After ${delay}s enforcement`);
      });
    });
  }
  
  private forceButtonPositions() {
    this.isInitializing = true;
    
    try {
      // Force positions using both local and world transforms
      log.i("Setting Zoom In position to: " + ZOOM_IN_BUTTON_OFFSET.toString());
      this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
      
      log.i("Setting Zoom Out position to: " + ZOOM_OUT_BUTTON_OFFSET.toString());
      this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
      
      log.i("Setting Center Map position to: " + CENTER_MAP_BUTTON_OFFSET.toString());
      this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
      
      log.i("Setting Toggle position to: " + TOGGLE_BUTTON_OFFSET.toString());
      this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
      
      // Alternative: Try setting world positions if local positions don't work
      // const parentTransform = this.buttonTransforms[ButtonType.ZOOM_IN].getParent();
      // if (parentTransform) {
      //   const worldPos = parentTransform.getWorldTransform().multiplyPoint(ZOOM_IN_BUTTON_OFFSET);
      //   this.buttonTransforms[ButtonType.ZOOM_IN].setWorldPosition(worldPos);
      // }
      
    } catch (error) {
      log.e("Error setting button positions: " + error.toString());
    }
    
    this.isInitializing = false;
  }

  private enableAllButtons() {
    // Enable all buttons by default
    this.spawnPinButton.sceneObject.enabled = true;
    this.clearPinsButton.sceneObject.enabled = true;
    this.showCafeButton.sceneObject.enabled = true;
    this.showBarsButton.sceneObject.enabled = true;
    this.showRestaurantsButton.sceneObject.enabled = true;
    
    // Ensure navigation buttons are enabled
    this.zoomInButton.sceneObject.enabled = true;
    this.zoomOutButton.sceneObject.enabled = true;
    this.centerMapButton.sceneObject.enabled = true;
    this.toggleMiniMapButton.sceneObject.enabled = true;
    
    log.i("All buttons enabled");
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
    
    // Call the map component toggle for functionality
    this.mapComponent.toggleMiniMap(isOn);
    
    // Don't move buttons - they should stay in place
    log.i("Toggle completed, buttons should remain in place");
  }

  private handleShowCafeButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["Coffee"]);
  }

  private handleShowPubsButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["Bar", "Pub"]);
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["Restaurant"]);
  }
}