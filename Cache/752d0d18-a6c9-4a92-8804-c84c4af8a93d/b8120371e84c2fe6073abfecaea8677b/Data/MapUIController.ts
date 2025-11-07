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
  
  // Store original positions to prevent drift
  private originalPositions: vec3[] = [];

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    
    // Create update event to continuously enforce positions
    this.createEvent("UpdateEvent").bind(this.onUpdate.bind(this));
  }

  private onStart() {
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
    this.toggleMiniMapButton.onStateChanged.add(
      this.handleToggleMiniMapButtonPinched.bind(this)
    );

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

    // Store original positions
    this.storeOriginalPositions();
    
    // Set all buttons to their final positions and enable them
    this.initializeButtonPositions();
    this.enableAllButtons();
    
    // Force position update with multiple delayed callbacks to ensure other scripts don't override
    this.createEvent("DelayedCallbackEvent").bind(() => {
      this.initializeButtonPositions();
    });
    
    // Add additional delayed callback for extra safety
    const delayedEvent = this.createEvent("DelayedCallbackEvent");
    delayedEvent.reset(0.1); // 0.1 second delay
    delayedEvent.bind(() => {
      this.initializeButtonPositions();
    });
  }
  
  private storeOriginalPositions() {
    // Store the desired positions
    this.originalPositions[ButtonType.ZOOM_IN] = ZOOM_IN_BUTTON_OFFSET;
    this.originalPositions[ButtonType.ZOOM_OUT] = ZOOM_OUT_BUTTON_OFFSET;
    this.originalPositions[ButtonType.CENTER_MAP] = CENTER_MAP_BUTTON_OFFSET;
    this.originalPositions[ButtonType.TOGGLE_MINI_MAP] = TOGGLE_BUTTON_OFFSET;
  }
  
  private onUpdate() {
    // Continuously enforce button positions to prevent other scripts from moving them
    this.enforceButtonPositions();
  }
  
  private enforceButtonPositions() {
    // Check if positions have drifted and correct them
    if (this.originalPositions.length > 0) {
      const zoomInCurrentPos = this.buttonTransforms[ButtonType.ZOOM_IN].getLocalPosition();
      const zoomOutCurrentPos = this.buttonTransforms[ButtonType.ZOOM_OUT].getLocalPosition();
      const centerMapCurrentPos = this.buttonTransforms[ButtonType.CENTER_MAP].getLocalPosition();
      const toggleCurrentPos = this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].getLocalPosition();
      
      // Check if positions have drifted significantly (tolerance of 0.1 units)
      const tolerance = 0.1;
      
      if (zoomInCurrentPos.distance(ZOOM_IN_BUTTON_OFFSET) > tolerance) {
        this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
      }
      
      if (zoomOutCurrentPos.distance(ZOOM_OUT_BUTTON_OFFSET) > tolerance) {
        this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
      }
      
      if (centerMapCurrentPos.distance(CENTER_MAP_BUTTON_OFFSET) > tolerance) {
        this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
      }
      
      if (toggleCurrentPos.distance(TOGGLE_BUTTON_OFFSET) > tolerance) {
        this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
      }
    }
  }

  private initializeButtonPositions() {
    // Set buttons to their full-map positions
    this.buttonTransforms[ButtonType.ZOOM_IN].setLocalPosition(ZOOM_IN_BUTTON_OFFSET);
    this.buttonTransforms[ButtonType.ZOOM_OUT].setLocalPosition(ZOOM_OUT_BUTTON_OFFSET);
    this.buttonTransforms[ButtonType.CENTER_MAP].setLocalPosition(CENTER_MAP_BUTTON_OFFSET);
    this.buttonTransforms[ButtonType.TOGGLE_MINI_MAP].setLocalPosition(TOGGLE_BUTTON_OFFSET);
    
    log.d("Button positions initialized - Zoom In: " + ZOOM_IN_BUTTON_OFFSET.toString() + 
          ", Zoom Out: " + ZOOM_OUT_BUTTON_OFFSET.toString() + 
          ", Center: " + CENTER_MAP_BUTTON_OFFSET.toString());
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
    
    // Force button positions to stay in place after toggle
    this.initializeButtonPositions();
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