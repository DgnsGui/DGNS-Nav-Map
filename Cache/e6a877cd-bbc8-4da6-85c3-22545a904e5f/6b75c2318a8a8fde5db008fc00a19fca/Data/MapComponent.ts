// Add these debug methods to your MapComponent.ts

// Enhanced showNeaybyPlaces method with debugging
showNeaybyPlaces(categoryName: string[]): void {
  console.log("=== MapComponent.showNeaybyPlaces called ===");
  console.log("Categories requested: " + categoryName.join(", "));
  console.log("Number of categories: " + categoryName.length);
  
  // Check if mapController exists
  if (!this.mapController) {
    console.error("MapController is null! Map may not be initialized.");
    return;
  }
  
  console.log("MapController exists, delegating to showNearbyPlaces...");
  
  try {
    this.mapController.showNearbyPlaces(categoryName);
    console.log("Successfully called mapController.showNearbyPlaces");
  } catch (error) {
    console.error("Error calling mapController.showNearbyPlaces: " + error);
  }
}

// Debug method to check user location
public debugUserLocation(): void {
  console.log("=== USER LOCATION DEBUG ===");
  const userLocation = this.getUserLocation();
  
  if (userLocation) {
    console.log("User Location Found:");
    console.log("  Latitude: " + userLocation.latitude.toFixed(8));
    console.log("  Longitude: " + userLocation.longitude.toFixed(8));
    console.log("  Altitude: " + userLocation.altitude.toFixed(2));
    console.log("  Heading: " + this.getUserHeading().toFixed(4) + " radians");
    console.log("  Heading (degrees): " + (this.getUserHeading() * 180 / Math.PI).toFixed(2));
  } else {
    console.error("User location is NULL!");
    console.log("Possible causes:");
    console.log("  - GPS permissions not granted");
    console.log("  - Location services disabled");
    console.log("  - Poor GPS signal");
    console.log("  - Map not properly initialized");
  }
  
  console.log("Map centered status: " + this.isMapCentered());
  console.log("Map controller exists: " + (this.mapController ? "Yes" : "No"));
  
  if (this.mapController) {
    const initialLocation = this.getInitialMapTileLocation();
    if (initialLocation) {
      console.log("Initial map tile location:");
      console.log("  Latitude: " + initialLocation.latitude.toFixed(8));
      console.log("  Longitude: " + initialLocation.longitude.toFixed(8));
    } else {
      console.log("Initial map tile location is null");
    }
  }
}

// Debug method to test nearby places with different parameters
public testNearbyPlacesDebug(): void {
  console.log("=== TESTING NEARBY PLACES DEBUG ===");
  
  // Test 1: Simple restaurant search
  console.log("Test 1: Simple restaurant search");
  this.showNeaybyPlaces(["restaurant"]);
  
  // Wait 2 seconds then test 2
  setTimeout(() => {
    console.log("Test 2: Cafe search");
    this.showNeaybyPlaces(["cafe"]);
  }, 2000);
  
  // Wait 4 seconds then test 3
  setTimeout(() => {
    console.log("Test 3: Store search");
    this.showNeaybyPlaces(["store"]);
  }, 4000);
  
  // Wait 6 seconds then test 4
  setTimeout(() => {
    console.log("Test 4: Multiple category search");
    this.showNeaybyPlaces(["restaurant", "cafe", "store"]);
  }, 6000);
}