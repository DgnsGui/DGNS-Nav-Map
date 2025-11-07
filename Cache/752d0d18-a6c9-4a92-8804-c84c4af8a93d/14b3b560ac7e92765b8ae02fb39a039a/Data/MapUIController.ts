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

  // Add new buttons for the 7 categories you mentioned
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

    // Original buttons with proper categories
    this.showCafeButton.onButtonPinched.add(
      this.handleShowCafeButtonPinched.bind(this)
    );
    
    this.showBarsButton.onButtonPinched.add(
      this.handleShowBarsButtonPinched.bind(this)
    );
    
    this.showRestaurantsButton.onButtonPinched.add(
      this.handleShowRestaurantsButtonPinched.bind(this)
    );

    // New buttons for your 7 categories
    if (this.showScenicButton) {
      this.showScenicButton.onButtonPinched.add(
        this.handleShowScenicButtonPinched.bind(this)
      );
    }

    if (this.showBarbersButton) {
      this.showBarbersButton.onButtonPinched.add(
        this.handleShowBarbersButtonPinched.bind(this)
      );
    }

    if (this.showSkateparksButton) {
      this.showSkateparksButton.onButtonPinched.add(
        this.handleShowSkateparksButtonPinched.bind(this)
      );
    }

    if (this.showAirportsButton) {
      this.showAirportsButton.onButtonPinched.add(
        this.handleShowAirportsButtonPinched.bind(this)
      );
    }

    if (this.showLibrariesButton) {
      this.showLibrariesButton.onButtonPinched.add(
        this.handleShowLibrariesButtonPinched.bind(this)
      );
    }

    if (this.showParksButton) {
      this.showParksButton.onButtonPinched.add(
        this.handleShowParksButtonPinched.bind(this)
      );
    }

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

  // Fixed original buttons with proper Snap Places API categories
  private handleShowCafeButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["cafe", "coffee_shop"]);
  }

  private handleShowBarsButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["bar", "night_club", "pub"]);
  }

  private handleShowRestaurantsButtonPinched(event: InteractorEvent) {
    this.mapComponent.showNeaybyPlaces(["restaurant", "food"]);
  }

  // New handlers for your 7 categories
  private handleShowScenicButtonPinched(event: InteractorEvent) {
    // 1: Lieu scenique
    this.mapComponent.showNeaybyPlaces(["tourist_attraction", "park", "landmark", "point_of_interest"]);
  }

  private handleShowBarbersButtonPinched(event: InteractorEvent) {
    // 3: Barbiers, coiffeurs et esthetique  
    this.mapComponent.showNeaybyPlaces(["hair_care", "beauty_salon", "spa"]);
  }

  private handleShowSkateparksButtonPinched(event: InteractorEvent) {
    // 4: Skatepark, Skateshops, lieux de la culture ride
    this.mapComponent.showNeaybyPlaces(["sporting_goods_store", "park", "recreation"]);
  }

  private handleShowAirportsButtonPinched(event: InteractorEvent) {
    // 5: Aeroports, aerodromes, agences de voyages
    this.mapComponent.showNeaybyPlaces(["airport", "travel_agency"]);
  }

  private handleShowLibrariesButtonPinched(event: InteractorEvent) {
    // 6: Libraire, Librairie, Ludotheque
    this.mapComponent.showNeaybyPlaces(["library", "book_store"]);
  }

  private handleShowParksButtonPinched(event: InteractorEvent) {
    // 7: Parcs, Campings aire de plein air
    this.mapComponent.showNeaybyPlaces(["park", "campground", "rv_park"]);
  }
}