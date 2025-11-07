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

  // Basic map control buttons
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

  // Category buttons
  @input
  private showAllButton: PinchButton;
  @input
  private showRestaurantsButton: PinchButton;
  @input
  private showCafeButton: PinchButton;
  @input
  private showBarsButton: PinchButton;

  // Auto-rotation management
  private isUserInteracting: boolean = false;
  private autoRotationStateBeforeInteraction: boolean = false;
  private rotationReEnableTimer: DelayedCallbackEvent = null;

  onAwake() {
    log.i("MapUIController awaking...");
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  private onStart() {
    log.i("MapUIController starting initialization...");

    // Verify mapComponent is connected
    if (!this.mapComponent) {
      log.e("MapComponent is not assigned! Check Inspector connections.");
      return;
    }
    log.i("MapComponent successfully connected");

    // Setup basic control buttons
    this.setupBasicControlButtons();
    
    // Setup remaining category buttons
    this.setupCategoryButtons();

    log.i("MapUIController initialization complete - all buttons configured");
  }

  private setupBasicControlButtons() {
    log.i("Setting up basic control buttons...");

    if (this.spawnPinButton) {
      this.spawnPinButton.onButtonPinched.add(this.handleSpawnPinButtonPinched.bind(this));
      log.i("Spawn pin button configured");
    } else {
      log.w("Spawn pin button not assigned");
    }
    
    if (this.clearPinsButton) {
      this.clearPinsButton.onButtonPinched.add(this.handleClearPinsButtonPinched.bind(this));
      log.i("Clear pins button configured");
    } else {
      log.w("Clear pins button not assigned");
    }
    
    if (this.zoomInButton) {
      this.zoomInButton.onButtonPinched.add(this.handleZoomInButtonPinched.bind(this));
      log.i("Zoom in button configured");
    } else {
      log.w("Zoom in button not assigned");
    }
    
    if (this.zoomOutButton) {
      this.zoomOutButton.onButtonPinched.add(this.handleZoomOutButtonPinched.bind(this));
      log.i("Zoom out button configured");
    } else {
      log.w("Zoom out button not assigned");
    }
    
    if (this.centerMapButton) {
      this.centerMapButton.onButtonPinched.add(() => {
        log.i("Center map button pressed");
        this.mapComponent.centerMap();
      });
      log.i("Center map button configured");
    } else {
      log.w("Center map button not assigned");
    }
    
    if (this.toggleMiniMapButton) {
      this.toggleMiniMapButton.onStateChanged.add(this.handleToggleMiniMapButtonPinched.bind(this));
      log.i("Toggle minimap button configured");
    } else {
      log.w("Toggle minimap button not assigned");
    }
  }

  private setupCategoryButtons() {
    log.i("Setting up category buttons...");

    if (this.showAllButton) {
      this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
      log.i("Show All button configured");
    } else {
      log.w("Show All button not assigned - check Inspector connections");
    }

    if (this.showRestaurantsButton) {
      this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
      log.i("Show Restaurants button configured");
    } else {
      log.w("Show Restaurants button not assigned");
    }

    if (this.showCafeButton) {
      this.showCafeButton.onButtonPinched.add(this.handleShowCafeButtonPinched.bind(this));
      log.i("Show Cafe button configured");
    } else {
      log.w("Show Cafe button not assigned");
    }

    if (this.showBarsButton) {
      this.showBarsButton.onButtonPinched.add(this.handleShowBarsButtonPinched.bind(this));
      log.i("Show Bars button configured");
    } else {
      log.w("Show Bars button not assigned");
    }
  }

  // ===== AUTO-ROTATION COORDINATE TRANSFORMATION =====

  /**
   * Transform touch coordinates to account for map rotation when auto-rotate is enabled
   * This ensures that user gestures work intuitively even when the map is rotated
   */
  private transformCoordinatesForAutoRotation(localPosition: vec2): vec2 {
    // Only transform if auto-rotation is enabled
    if (!this.mapComponent.getMinimapAutoRotate()) {
      return localPosition;
    }

    try {
      // Get current user heading (rotation angle in radians)
      const userHeading = this.mapComponent.getUserHeading();
      
      // Create rotation matrix to counter the map rotation
      // We need to rotate input in opposite direction of map rotation
      const cosAngle = Math.cos(-userHeading);
      const sinAngle = Math.sin(-userHeading);
      
      // Apply rotation transformation
      const transformedX = localPosition.x * cosAngle - localPosition.y * sinAngle;
      const transformedY = localPosition.x * sinAngle + localPosition.y * cosAngle;
      
      const transformedPosition = new vec2(transformedX, transformedY);
      
      // Debug logging (can be removed in production)
      if (Math.abs(localPosition.x) > 0.1 || Math.abs(localPosition.y) > 0.1) {
        log.d(`Coordinate transform: (${localPosition.x.toFixed(3)}, ${localPosition.y.toFixed(3)}) -> (${transformedX.toFixed(3)}, ${transformedY.toFixed(3)}) | Heading: ${userHeading.toFixed(3)}rad`);
      }
      
      return transformedPosition;
    } catch (error) {
      log.e("Error in coordinate transformation: " + error);
      return localPosition; // Fallback to original position
    }
  }

  /**
   * Manage auto-rotation state during user interactions
   */
  private startUserInteraction(): void {
    if (this.isUserInteracting) {
      return; // Already managing interaction
    }

    this.isUserInteracting = true;
    this.autoRotationStateBeforeInteraction = this.mapComponent.getMinimapAutoRotate();
    
    // Cancel any pending re-enable timer
    if (this.rotationReEnableTimer) {
      this.rotationReEnableTimer.cancel();
      this.rotationReEnableTimer = null;
    }

    log.d("User interaction started - Auto-rotation state preserved: " + this.autoRotationStateBeforeInteraction);
  }

  private endUserInteraction(): void {
    if (!this.isUserInteracting) {
      return;
    }

    this.isUserInteracting = false;

    // If auto-rotation was enabled before interaction, re-enable it after a short delay
    if (this.autoRotationStateBeforeInteraction) {
      log.d("Scheduling auto-rotation re-enable in 0.5 seconds");
      
      this.rotationReEnableTimer = this.createEvent("DelayedCallbackEvent");
      this.rotationReEnableTimer.bind(() => {
        if (this.mapComponent && !this.isUserInteracting) {
          log.d("Re-enabling auto-rotation after user interaction");
          this.mapComponent.setMinimapAutoRotate(true);
        }
        this.rotationReEnableTimer = null;
      });
      this.rotationReEnableTimer.reset(0.5); // 500ms delay to ensure smooth transition
    }
  }

  // ===== ENHANCED TOUCH/INTERACTION METHODS =====

  /**
   * Enhanced touch handling methods that account for rotation and preserve auto-rotation state
   */
  public startTouchWithRotation(localPosition: vec2): void {
    this.startUserInteraction();
    const transformedPosition = this.transformCoordinatesForAutoRotation(localPosition);
    this.mapComponent.startTouch(transformedPosition);
  }

  public updateTouchWithRotation(localPosition: vec2): void {
    const transformedPosition = this.transformCoordinatesForAutoRotation(localPosition);
    this.mapComponent.updateTouch(transformedPosition);
  }

  public endTouchWithRotation(localPosition: vec2): void {
    const transformedPosition = this.transformCoordinatesForAutoRotation(localPosition);
    this.mapComponent.endTouch(transformedPosition);
    this.endUserInteraction();
  }

  public updateHoverWithRotation(localPosition: vec2): void {
    const transformedPosition = this.transformCoordinatesForAutoRotation(localPosition);
    this.mapComponent.updateHover(transformedPosition);
  }

  // ===== PUBLIC INTERFACE FOR EXTERNAL TOUCH CONTROLLERS =====

  /**
   * Public methods to be called by external touch controllers or UI elements
   * These replace the direct calls to mapComponent methods
   */
  public handleMapTouchStart(localPosition: vec2): void {
    log.d("Map touch start at: (" + localPosition.x.toFixed(3) + ", " + localPosition.y.toFixed(3) + ")");
    this.startTouchWithRotation(localPosition);
  }

  public handleMapTouchUpdate(localPosition: vec2): void {
    this.updateTouchWithRotation(localPosition);
  }

  public handleMapTouchEnd(localPosition: vec2): void {
    log.d("Map touch end at: (" + localPosition.x.toFixed(3) + ", " + localPosition.y.toFixed(3) + ")");
    this.endTouchWithRotation(localPosition);
  }

  public handleMapHover(localPosition: vec2): void {
    this.updateHoverWithRotation(localPosition);
  }

  // ===== ORIGINAL BUTTON HANDLERS (Enhanced) =====

  // Basic control button handlers
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
    log.i("Toggle minimap button pressed - state: " + isOn);
    this.mapComponent.toggleMiniMap(isOn);
  }

  // Category button handlers
  private handleShowAllButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW ALL BUTTON PRESSED ===");
    log.i("Testing with null categories to retrieve all places");
    this.searchNearbyPlaces(null, "All Places");
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW RESTAURANTS BUTTON PRESSED ===");
    log.i("Testing with null categories - will filter results programmatically later");
    this.searchNearbyPlaces(null, "Restaurants (All Places)");
  }

  private handleShowCafeButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW CAFE BUTTON PRESSED ===");
    log.i("Testing with null categories - will filter results programmatically later");
    this.searchNearbyPlaces(null, "Cafes (All Places)");
  }

  private handleShowBarsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW BARS BUTTON PRESSED ===");
    log.i("Testing with null categories - will filter results programmatically later");
    this.searchNearbyPlaces(null, "Bars (All Places)");
  }

  // Centralized method for searching nearby places
  private searchNearbyPlaces(categories: string[] | null, searchType: string) {
    try {
      log.i("--- Starting search for: " + searchType + " ---");
      
      // Check if mapComponent is available
      if (!this.mapComponent) {
        log.e("MapComponent is null! Cannot perform search.");
        return;
      }

      // Get and log user location
      const userLocation = this.mapComponent.getUserLocation();
      if (userLocation) {
        log.i("User location - Lat: " + userLocation.latitude.toFixed(6) + 
              ", Lng: " + userLocation.longitude.toFixed(6) + 
              ", Alt: " + userLocation.altitude.toFixed(2));
        log.i("User heading: " + this.mapComponent.getUserHeading().toFixed(2) + " radians");
      } else {
        log.e("User location is null! GPS may not be available.");
        return;
      }

      // Check if map is properly initialized
      if (!this.mapComponent.isMapCentered()) {
        log.w("Map may not be properly centered yet");
      }

      // Log search parameters
      log.i("Search parameters:");
      if (categories === null) {
        log.i("  - Categories: null (will retrieve all available places)");
      } else {
        log.i("  - Categories: " + categories.join(", "));
        log.i("  - Number of categories: " + categories.length);
      }
      
      // Perform the search with null parameter
      log.i("Calling mapComponent.showNeaybyPlaces() with categories: " + 
            (categories === null ? "null" : categories.join(", ")));
      this.mapComponent.showNeaybyPlaces(categories);
      
      log.i("Search request sent successfully for: " + searchType);
      
    } catch (error) {
      log.e("Error during search for " + searchType + ": " + error);
    }
  }

  // ===== DEBUG AND TESTING METHODS =====

  /**
   * Method to test coordinate transformation with current map state
   */
  public testCoordinateTransformation(): void {
    log.i("=== TESTING COORDINATE TRANSFORMATION ===");
    
    const testPositions = [
      new vec2(0, 0.5),   // Up
      new vec2(0, -0.5),  // Down
      new vec2(0.5, 0),   // Right
      new vec2(-0.5, 0),  // Left
      new vec2(0.35, 0.35), // Diagonal up-right
      new vec2(-0.35, -0.35), // Diagonal down-left
    ];
    
    const directions = ["Up", "Down", "Right", "Left", "Up-Right", "Down-Left"];
    
    log.i(`Current user heading: ${this.mapComponent.getUserHeading().toFixed(3)} radians (${(this.mapComponent.getUserHeading() * 180 / Math.PI).toFixed(1)}°)`);
    log.i(`Auto-rotate enabled: ${this.mapComponent.getMinimapAutoRotate()}`);
    log.i("Coordinate transformations:");
    
    testPositions.forEach((pos, index) => {
      const transformed = this.transformCoordinatesForAutoRotation(pos);
      log.i(`  ${directions[index]}: (${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}) -> (${transformed.x.toFixed(3)}, ${transformed.y.toFixed(3)})`);
    });
  }

  /**
   * Debug method to test a single simple search with null
   */
  public testSimpleSearch() {
    log.i("=== TESTING SIMPLE SEARCH WITH NULL ===");
    this.searchNearbyPlaces(null, "Test Null Search - All Places");
  }

  /**
   * Alternative test method with specific category (if needed)
   */
  public testSpecificCategorySearch() {
    log.i("=== TESTING SPECIFIC CATEGORY SEARCH ===");
    this.searchNearbyPlaces(["restaurant"], "Test Restaurant Search");
  }

  /**
   * Debug method to log all button states
   */
  public logButtonStates() {
    log.i("=== BUTTON CONNECTION STATES ===");
    log.i("Basic controls:");
    log.i("  spawnPinButton: " + (this.spawnPinButton ? "Connected" : "NOT CONNECTED"));
    log.i("  clearPinsButton: " + (this.clearPinsButton ? "Connected" : "NOT CONNECTED"));
    log.i("  zoomInButton: " + (this.zoomInButton ? "Connected" : "NOT CONNECTED"));
    log.i("  zoomOutButton: " + (this.zoomOutButton ? "Connected" : "NOT CONNECTED"));
    log.i("  centerMapButton: " + (this.centerMapButton ? "Connected" : "NOT CONNECTED"));
    log.i("  toggleMiniMapButton: " + (this.toggleMiniMapButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("Category buttons:");
    log.i("  showAllButton: " + (this.showAllButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showRestaurantsButton: " + (this.showRestaurantsButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showCafeButton: " + (this.showCafeButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showBarsButton: " + (this.showBarsButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("MapComponent: " + (this.mapComponent ? "Connected" : "NOT CONNECTED"));
  }

  /**
   * Debug method to log current map state
   */
  public logMapState() {
    log.i("=== CURRENT MAP STATE ===");
    if (this.mapComponent) {
      log.i("User location: " + (this.mapComponent.getUserLocation() ? "Available" : "Not available"));
      log.i("User heading: " + this.mapComponent.getUserHeading().toFixed(3) + " rad (" + (this.mapComponent.getUserHeading() * 180 / Math.PI).toFixed(1) + "°)");
      log.i("Auto-rotate enabled: " + this.mapComponent.getMinimapAutoRotate());
      log.i("Map centered: " + this.mapComponent.isMapCentered());
      log.i("User interaction state: " + (this.isUserInteracting ? "Active" : "Inactive"));
      log.i("Auto-rotation before interaction: " + this.autoRotationStateBeforeInteraction);
    } else {
      log.e("MapComponent not available");
    }
  }

  /**
   * Emergency method to force re-enable auto-rotation if it gets stuck
   */
  public forceReEnableAutoRotation() {
    log.i("=== FORCE RE-ENABLING AUTO-ROTATION ===");
    this.isUserInteracting = false;
    this.autoRotationStateBeforeInteraction = true;
    
    if (this.rotationReEnableTimer) {
      this.rotationReEnableTimer.cancel();
      this.rotationReEnableTimer = null;
    }
    
    if (this.mapComponent) {
      this.mapComponent.setMinimapAutoRotate(true);
      log.i("Auto-rotation force re-enabled");
    }
  }
}