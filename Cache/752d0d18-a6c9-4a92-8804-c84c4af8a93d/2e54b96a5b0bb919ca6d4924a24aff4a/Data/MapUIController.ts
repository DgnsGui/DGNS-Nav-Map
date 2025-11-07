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

  // Left side buttons (visible in UI)
  @input
  private showAllButton: PinchButton;
  @input
  private showSnacksButton: PinchButton;
  @input
  private showShopsButton: PinchButton;

  // Original category buttons
  @input
  private showRestaurantsButton: PinchButton;
  @input
  private showCafeButton: PinchButton;
  @input
  private showBarsButton: PinchButton;

  // Right side category buttons (7 categories)
  @input
  private showScenicButton: PinchButton;
  @input
  private showBarbersButton: PinchButton;
  @input
  private showSkateparksButton: PinchButton;
  @input
  private showAirportsButton: PinchButton;
  @input
  private showLibrariesButton: PinchButton;
  @input
  private showParksButton: PinchButton;

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
    
    // Setup left side buttons
    this.setupLeftSideButtons();
    
    // Setup original category buttons
    this.setupOriginalCategoryButtons();
    
    // Setup right side category buttons
    this.setupRightSideCategoryButtons();

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

  private setupLeftSideButtons() {
    log.i("Setting up left side buttons...");

    if (this.showAllButton) {
      this.showAllButton.onButtonPinched.add(this.handleShowAllButtonPinched.bind(this));
      log.i("Show All button configured");
    } else {
      log.w("Show All button not assigned - check Inspector connections");
    }

    if (this.showSnacksButton) {
      this.showSnacksButton.onButtonPinched.add(this.handleShowSnacksButtonPinched.bind(this));
      log.i("Show Snacks button configured");
    } else {
      log.w("Show Snacks button not assigned - check Inspector connections");
    }

    if (this.showShopsButton) {
      this.showShopsButton.onButtonPinched.add(this.handleShowShopsButtonPinched.bind(this));
      log.i("Show Shops button configured");
    } else {
      log.w("Show Shops button not assigned - check Inspector connections");
    }
  }

  private setupOriginalCategoryButtons() {
    log.i("Setting up original category buttons...");

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
    
    if (this.showRestaurantsButton) {
      this.showRestaurantsButton.onButtonPinched.add(this.handleShowRestaurantsButtonPinched.bind(this));
      log.i("Show Restaurants button configured");
    } else {
      log.w("Show Restaurants button not assigned");
    }
  }

  private setupRightSideCategoryButtons() {
    log.i("Setting up right side category buttons...");

    if (this.showScenicButton) {
      this.showScenicButton.onButtonPinched.add(this.handleShowScenicButtonPinched.bind(this));
      log.i("Show Scenic button configured");
    } else {
      log.w("Show Scenic button not assigned - check Inspector connections");
    }

    if (this.showBarbersButton) {
      this.showBarbersButton.onButtonPinched.add(this.handleShowBarbersButtonPinched.bind(this));
      log.i("Show Barbers button configured");
    } else {
      log.w("Show Barbers button not assigned - check Inspector connections");
    }

    if (this.showSkateparksButton) {
      this.showSkateparksButton.onButtonPinched.add(this.handleShowSkateparksButtonPinched.bind(this));
      log.i("Show Skateparks button configured");
    } else {
      log.w("Show Skateparks button not assigned - check Inspector connections");
    }

    if (this.showAirportsButton) {
      this.showAirportsButton.onButtonPinched.add(this.handleShowAirportsButtonPinched.bind(this));
      log.i("Show Airports button configured");
    } else {
      log.w("Show Airports button not assigned - check Inspector connections");
    }

    if (this.showLibrariesButton) {
      this.showLibrariesButton.onButtonPinched.add(this.handleShowLibrariesButtonPinched.bind(this));
      log.i("Show Libraries button configured");
    } else {
      log.w("Show Libraries button not assigned - check Inspector connections");
    }

    if (this.showParksButton) {
      this.showParksButton.onButtonPinched.add(this.handleShowParksButtonPinched.bind(this));
      log.i("Show Parks button configured");
    } else {
      log.w("Show Parks button not assigned - check Inspector connections");
    }
  }

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
    this.mapComponent.zoomIn();
  }

  private handleZoomOutButtonPinched(event: InteractorEvent) {
    log.i("Zoom out button pressed");
    this.mapComponent.zoomOut();
  }

  private handleToggleMiniMapButtonPinched(isOn: boolean) {
    log.i("Toggle minimap button pressed - state: " + isOn);
    this.mapComponent.toggleMiniMap(isOn);
  }

  // Left side button handlers - NOW using filtering
  private handleShowAllButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW ALL BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("all");
  }

  private handleShowSnacksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SNACKS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("snacks");
  }

  private handleShowShopsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SHOPS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("shops");
  }

  // Original category button handlers - NOW using filtering
  private handleShowCafeButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW CAFE BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("cafes");
  }

  private handleShowBarsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW BARS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("bars");
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW RESTAURANTS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("restaurants");
  }

  // Right side category button handlers - NOW using filtering
  private handleShowScenicButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SCENIC BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("scenic");
  }

  private handleShowBarbersButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW BARBERS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("barbers");
  }

  private handleShowSkateparksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SKATEPARKS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("recreation");
  }

  private handleShowAirportsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW AIRPORTS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("transportation");
  }

  private handleShowLibrariesButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW LIBRARIES BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("libraries");
  }

  private handleShowParksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW PARKS BUTTON PRESSED ===");
    this.mapComponent.showFilteredPlaces("parks");
  }

  // Centralized method for searching nearby places - MODIFIED: Accepts null parameter
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

  // Debug method to test a single simple search with null
  public testSimpleSearch() {
    log.i("=== TESTING SIMPLE SEARCH WITH NULL ===");
    this.searchNearbyPlaces(null, "Test Null Search - All Places");
  }

  // Alternative test method with specific category (if needed)
  public testSpecificCategorySearch() {
    log.i("=== TESTING SPECIFIC CATEGORY SEARCH ===");
    this.searchNearbyPlaces(["restaurant"], "Test Restaurant Search");
  }

  // Debug method to log all button states
  public logButtonStates() {
    log.i("=== BUTTON CONNECTION STATES ===");
    log.i("Basic controls:");
    log.i("  spawnPinButton: " + (this.spawnPinButton ? "Connected" : "NOT CONNECTED"));
    log.i("  clearPinsButton: " + (this.clearPinsButton ? "Connected" : "NOT CONNECTED"));
    log.i("  zoomInButton: " + (this.zoomInButton ? "Connected" : "NOT CONNECTED"));
    log.i("  zoomOutButton: " + (this.zoomOutButton ? "Connected" : "NOT CONNECTED"));
    log.i("  centerMapButton: " + (this.centerMapButton ? "Connected" : "NOT CONNECTED"));
    log.i("  toggleMiniMapButton: " + (this.toggleMiniMapButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("Left side buttons:");
    log.i("  showAllButton: " + (this.showAllButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showSnacksButton: " + (this.showSnacksButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showShopsButton: " + (this.showShopsButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("Original category buttons:");
    log.i("  showCafeButton: " + (this.showCafeButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showBarsButton: " + (this.showBarsButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showRestaurantsButton: " + (this.showRestaurantsButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("Right side buttons:");
    log.i("  showScenicButton: " + (this.showScenicButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showBarbersButton: " + (this.showBarbersButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showSkateparksButton: " + (this.showSkateparksButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showAirportsButton: " + (this.showAirportsButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showLibrariesButton: " + (this.showLibrariesButton ? "Connected" : "NOT CONNECTED"));
    log.i("  showParksButton: " + (this.showParksButton ? "Connected" : "NOT CONNECTED"));
    
    log.i("MapComponent: " + (this.mapComponent ? "Connected" : "NOT CONNECTED"));
  }
}