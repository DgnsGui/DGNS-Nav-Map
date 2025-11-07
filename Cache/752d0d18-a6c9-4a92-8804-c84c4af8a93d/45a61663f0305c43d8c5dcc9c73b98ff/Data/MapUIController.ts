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

  // Left side button handlers - CORRIGÉ pour Snapchat Places API
  private handleShowAllButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW ALL BUTTON PRESSED ===");
    log.i("Attempting to show all types of places");
    this.searchNearbyPlaces([], "All Places");
  }

  private handleShowSnacksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SNACKS BUTTON PRESSED ===");
    log.i("Attempting to show snack places");
    
    const filterKeywords = [
      "food", "snack", "convenience", "bakery", "takeaway", "grocery", 
      "supermarket", "store", "market", "deli", "cafe", "coffee"
    ];
    
    this.searchNearbyPlaces(filterKeywords, "Snacks");
  }

  private handleShowShopsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SHOPS BUTTON PRESSED ===");
    log.i("Attempting to show shops");
    
    const filterKeywords = [
      "store", "shop", "shopping", "mall", "clothing", "electronics", 
      "retail", "boutique", "market", "department", "hardware"
    ];
    
    this.searchNearbyPlaces(filterKeywords, "Shops");
  }

  // Original category button handlers - CORRIGÉ pour Snapchat Places API
  private handleShowCafeButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW CAFE BUTTON PRESSED ===");
    const filterKeywords = ["cafe", "coffee", "espresso", "latte", "cappuccino", "bakery", "pastry"];
    this.searchNearbyPlaces(filterKeywords, "Cafes");
  }

  private handleShowBarsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW BARS BUTTON PRESSED ===");
    const filterKeywords = ["bar", "pub", "tavern", "brewery", "cocktail", "nightclub", "club", "lounge", "wine", "liquor"];
    this.searchNearbyPlaces(filterKeywords, "Bars");
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW RESTAURANTS BUTTON PRESSED ===");
    const filterKeywords = ["restaurant", "dining", "food", "cuisine", "meal", "bistro", "grill", "pizzeria"];
    this.searchNearbyPlaces(filterKeywords, "Restaurants");
  }

  // Right side category button handlers - CORRIGÉ pour Snapchat Places API
  private handleShowScenicButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SCENIC BUTTON PRESSED ===");
    const filterKeywords = [
      "tourist", "attraction", "museum", "park", "monument", "landmark", 
      "scenic", "viewpoint", "gallery", "art", "culture", "heritage", "zoo", "aquarium"
    ];
    this.searchNearbyPlaces(filterKeywords, "Scenic Places");
  }

  private handleShowBarbersButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW BARBERS BUTTON PRESSED ===");
    const filterKeywords = ["barber", "hair", "salon", "beauty", "spa", "hairdresser", "styling"];
    this.searchNearbyPlaces(filterKeywords, "Barbers & Beauty");
  }

  private handleShowSkateparksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW SKATEPARKS BUTTON PRESSED ===");
    const filterKeywords = [
      "skate", "park", "recreation", "sports", "gym", "fitness", "stadium", 
      "playground", "activity", "leisure", "bowling"
    ];
    this.searchNearbyPlaces(filterKeywords, "Recreation");
  }

  private handleShowAirportsButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW AIRPORTS BUTTON PRESSED ===");
    const filterKeywords = [
      "airport", "terminal", "flight", "travel", "transport", "bus", "station", 
      "subway", "train", "metro", "transit"
    ];
    this.searchNearbyPlaces(filterKeywords, "Transportation");
  }

  private handleShowLibrariesButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW LIBRARIES BUTTON PRESSED ===");
    const filterKeywords = ["library", "book", "reading", "study", "university", "school", "education", "academic"];
    this.searchNearbyPlaces(filterKeywords, "Libraries & Books");
  }

  private handleShowParksButtonPinched(event: InteractorEvent) {
    log.i("=== SHOW PARKS BUTTON PRESSED ===");
    const filterKeywords = [
      "park", "garden", "nature", "outdoor", "recreation", "playground", 
      "green", "forest", "trail", "camping"
    ];
    this.searchNearbyPlaces(filterKeywords, "Parks & Outdoors");
  }

  // NOUVELLE méthode corrigée pour l'API Snapchat Places
  private searchNearbyPlaces(filterKeywords: string[], searchType: string) {
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
      log.i("  - Filter keywords: " + filterKeywords.join(", "));
      log.i("  - Number of keywords: " + filterKeywords.length);
      
      // Pour l'API Snapchat Places, on passe un tableau vide car elle ne supporte pas le filtrage direct
      // Le filtrage se fait côté client après réception des résultats
      log.i("Calling mapComponent.showNeaybyPlaces() with client-side filtering...");
      
      // Stocker les mots-clés pour le filtrage côté client
      this.currentFilterKeywords = filterKeywords;
      this.currentSearchType = searchType;
      
      // Appel à l'API sans paramètres de catégorie (Snapchat Places API ne les supporte pas)
      this.mapComponent.showNeaybyPlaces([]);
      
      log.i("Search request sent successfully for: " + searchType);
      
    } catch (error) {
      log.e("Error during search for " + searchType + ": " + error);
    }
  }

  // Méthode pour filtrer les résultats côté client (appelée par MapComponent)
  public filterPlacesResults(places: any[], filterKeywords: string[], searchType: string): any[] {
    if (filterKeywords.length === 0) {
      // Pas de filtrage, retourner tous les résultats
      log.i("No filtering - returning all " + places.length + " places");
      return places;
    }

    log.i("Filtering " + places.length + " places for: " + searchType);
    log.i("Filter keywords: " + filterKeywords.join(", "));

    const filteredPlaces = places.filter(place => {
      // Vérifier le nom du lieu
      const placeName = (place.name || "").toLowerCase();
      
      // Vérifier la catégorie
      const categoryName = (place.categoryName || "").toLowerCase();
      
      // Vérifier le sous-titre (description)
      const subtitle = (place.subtitle || "").toLowerCase();

      // Chercher les mots-clés dans le nom, la catégorie et le sous-titre
      for (const keyword of filterKeywords) {
        const lowerKeyword = keyword.toLowerCase();
        
        if (placeName.includes(lowerKeyword) || 
            categoryName.includes(lowerKeyword) || 
            subtitle.includes(lowerKeyword)) {
          log.i("Match found for '" + place.name + "' with keyword '" + keyword + "'");
          log.i("  - Category: " + categoryName);
          log.i("  - Subtitle: " + subtitle);
          return true;
        }
      }
      
      return false;
    });

    log.i("Filtered results: " + filteredPlaces.length + " places match criteria");
    return filteredPlaces;
  }

  // Méthode pour filtrer les résultats côté client (appelée par MapComponent)
  public filterPlacesResults(places: any[], filterKeywords: string[], searchType: string): any[] {
    if (filterKeywords.length === 0) {
      // Pas de filtrage, retourner tous les résultats
      log.i("No filtering - returning all " + places.length + " places");
      return places;
    }

    log.i("Filtering " + places.length + " places for: " + searchType);
    log.i("Filter keywords: " + filterKeywords.join(", "));

    const filteredPlaces = places.filter(place => {
      // Vérifier le nom du lieu
      const placeName = (place.name || "").toLowerCase();
      
      // Vérifier la catégorie
      const categoryName = (place.categoryName || "").toLowerCase();
      
      // Vérifier le sous-titre (description)
      const subtitle = (place.subtitle || "").toLowerCase();

      // Chercher les mots-clés dans le nom, la catégorie et le sous-titre
      for (const keyword of filterKeywords) {
        const lowerKeyword = keyword.toLowerCase();
        
        if (placeName.includes(lowerKeyword) || 
            categoryName.includes(lowerKeyword) || 
            subtitle.includes(lowerKeyword)) {
          log.i("Match found for '" + place.name + "' with keyword '" + keyword + "'");
          log.i("  - Category: " + categoryName);
          log.i("  - Subtitle: " + subtitle);
          return true;
        }
      }
      
      return false;
    });

    log.i("Filtered results: " + filteredPlaces.length + " places match criteria");
    return filteredPlaces;
  }

  // Debug method to test a simple search
  public testSimpleSearch() {
    log.i("=== TESTING SIMPLE SEARCH ===");
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