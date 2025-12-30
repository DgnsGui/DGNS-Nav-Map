// Import module
const placesModule = require("./Snapchat Places API Module");

import { getPhysicalDistanceBetweenLocations } from "./MapUtils";

export type Address = {
  street_address: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
  country_code: string;
};

export type time = {
  hour: number;
  minute: number;
};

export type timeInterval = {
  start_hour: time;
  end_hour: time;
};

export type dayHours = {
  day: string;
  hours: timeInterval[];
};

export type openingHours = {
  dayHours: dayHours[];
  time_zone: string;
};

export type PlaceInfo = {
  placeId: string;
  category: string;
  name: string;
  phone_number: string;
  address: Address;
  opening_hours: openingHours;
  centroid: GeoPosition;
};

@component
export class SnapPlacesProvider extends BaseScriptComponent {
  @input
  private remoteServiceModule: RemoteServiceModule
  private apiModule: any;

  private locationToPlaces: Map<GeoPosition, PlaceInfo[]> = new Map<
    GeoPosition,
    PlaceInfo[]
  >();

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      print("=== SnapPlacesProvider INITIALIZING ===");
      
      if (!this.remoteServiceModule) {
        print("ERROR: RemoteServiceModule is NOT assigned!");
        return;
      }
      
      try {
        this.apiModule = new placesModule.ApiModule(this.remoteServiceModule);
        print("API Module initialized successfully");
      } catch (error) {
        print("ERROR initializing API Module: " + error);
      }
    });
  }

  getNearbyPlacesInfo(
    location: GeoPosition,
    numberNearbyPlaces: number,
    nearbyDistanceThreshold: number,
    filter: string[] = null
  ): Promise<PlaceInfo[]> {
    print("=== getNearbyPlacesInfo CALLED ===");
    print("Location check - lat: " + location.latitude + ", lng: " + location.longitude);
    
    if (location.latitude === 0 && location.longitude === 0) {
      print("WARNING: Location is 0,0 - returning empty array");
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    
    const nearbyPlaces = this.getNearbyPlacesFromCache(
      location,
      nearbyDistanceThreshold
    );
    
    if (nearbyPlaces !== null) {
      print("Using cached places: " + nearbyPlaces.length + " places");
      return new Promise((resolve) => {
        resolve(nearbyPlaces);
      });
    } else {
      print("No cache found, fetching from API...");
      return new Promise((resolve, reject) => {
        this.getNearbyPlaces(location, numberNearbyPlaces, filter)
          .then((places) => {
            print("Got " + places.length + " nearby places, fetching detailed info...");
            this.getPlacesInfo(places)
              .then((places) => {
                print("Successfully fetched info for " + places.length + " places");
                this.locationToPlaces.set(location, places);
                resolve(places);
              })
              .catch((error) => {
                print("ERROR in getPlacesInfo: " + error);
                reject(`Error getting places info: ${error}`);
              });
          })
          .catch((error) => {
            print("ERROR in getNearbyPlaces: " + error);
            reject(`Error getting nearby places: ${error}`);
          });
      });
    }
  }

  getNearbyPlaces(
    location: GeoPosition,
    numberNearbyPlaces: number,
    filter: string[] = null
  ): Promise<any[]> {
    print("=== getNearbyPlaces API CALL ===");
    print("📍 Location: lat=" + location.latitude + ", lng=" + location.longitude);
    print("📊 Number requested: " + numberNearbyPlaces);
    print("🔍 Filter: " + (filter ? filter.join(", ") : "null"));
    
    if (!this.apiModule) {
      print("❌ ERROR: API Module not initialized!");
      return new Promise((resolve, reject) => {
        reject("API Module not initialized");
      });
    }
    
    return new Promise((resolve, reject) => {
      print("Calling get_nearby_places API...");
      
      this.apiModule
        .get_nearby_places({
          parameters: {
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
            gps_accuracy_m: "100",
            places_limit: numberNearbyPlaces.toString(),
          },
        })
        .then((response) => {
          print("=== ✅ API RESPONSE RECEIVED ===");
          
          try {
            const bodyString = response.bodyAsString();
            print("Response body length: " + bodyString.length + " characters");
            print("Response preview: " + bodyString.substring(0, 200));
            
            const results = response.bodyAsJson();
            
            if (!results) {
              print("❌ ERROR: Could not parse JSON response");
              reject("Invalid JSON response");
              return;
            }
            
            if (!results.nearbyPlaces) {
              print("❌ ERROR: No 'nearbyPlaces' field in response");
              print("Available fields: " + Object.keys(results).join(", "));
              reject("No nearbyPlaces in response");
              return;
            }
            
            print("📌 Total nearby places found: " + results.nearbyPlaces.length);
            
            // Log first place for debugging
            if (results.nearbyPlaces.length > 0) {
              const firstPlace = results.nearbyPlaces[0];
              print("First place example:");
              print("  - placeId: " + firstPlace.placeId);
              print("  - name: " + firstPlace.name);
              print("  - categoryName: " + firstPlace.categoryName);
              print("  - placeTypeEnum: " + firstPlace.placeTypeEnum);
            }
            
            if (filter !== null) {
              print("Applying filter: " + filter.join(", "));
              const places: any[] = [];
              
              (results.nearbyPlaces as any[]).forEach((place) => {
                const categoryName = place.categoryName as string;
                print("Checking place: " + place.name + " (category: " + categoryName + ")");
                
                for (let i = 0; i < filter.length; i++) {
                  const filterTerm = filter[i].toLowerCase();
                  const categoryLower = categoryName.toLowerCase();
                  
                  if (categoryLower.includes(filterTerm)) {
                    print("  ✓ Matched filter '" + filter[i] + "'");
                    places.push(place);
                    break;
                  }
                }
              });
              
              print("🎯 Filtered results: " + places.length + " places match filter");
              resolve(places);
            } else {
              print("✓ No filter applied, returning all " + results.nearbyPlaces.length + " places");
              resolve(results.nearbyPlaces);
            }
          } catch (parseError) {
            print("❌ ERROR parsing response: " + parseError);
            reject("Error parsing API response: " + parseError);
          }
        })
        .catch((error) => {
          print("=== ❌ API ERROR ===");
          print("Error type: " + typeof error);
          print("Error message: " + error);
          print("Error details: " + JSON.stringify(error));
          reject(`Error retrieving nearby places: ${error}`);
        });
    });
  }

  getPlacesInfo(places: any[]): Promise<PlaceInfo[]> {
    print("=== getPlacesInfo for " + places.length + " places ===");
    
    return new Promise((resolve, reject) => {
      const promises: Promise<PlaceInfo>[] = [];
      let venueCount = 0;
      let skippedCount = 0;
      
      places.forEach((place, index) => {
        print("Place " + index + ": " + place.name + " (type: " + place.placeTypeEnum + ")");
        
        if (place.placeTypeEnum && place.placeTypeEnum === "VENUE") {
          venueCount++;
          const getPlacePromise = new Promise<PlaceInfo>((resolve, reject) => {
            print("Fetching detailed info for: " + place.name + " (ID: " + place.placeId + ")");
            
            this.apiModule
              .get_place({
                parameters: {
                  place_id: place.placeId,
                },
              })
              .then((response) => {
                try {
                  const bodyString = response.bodyAsString();
                  print("✓ Got place details for " + place.name);
                  
                  const placeInfo = this.parsePlace(
                    bodyString,
                    place.categoryName
                  );
                  
                  print("  Parsed: " + placeInfo.name + " at " + placeInfo.centroid.latitude + "," + placeInfo.centroid.longitude);
                  resolve(placeInfo);
                } catch (error) {
                  print("❌ Error parsing place " + place.name + ": " + error);
                  reject(error);
                }
              })
              .catch((error) => {
                print("❌ Error fetching place " + place.name + ": " + error);
                reject(error);
              });
          });
          promises.push(getPlacePromise);
        } else {
          skippedCount++;
          print("  ⏭ Skipped (not a VENUE)");
        }
      });
      
      print("Processing " + venueCount + " venues, skipped " + skippedCount + " non-venues");
      
      if (promises.length === 0) {
        print("⚠ WARNING: No venues to process!");
        resolve([]);
        return;
      }
      
      Promise.all(promises)
        .then((places) => {
          print("✅ Successfully processed " + places.length + " places");
          resolve(places);
        })
        .catch((error) => {
          print("❌ Error in Promise.all: " + error);
          reject(error);
        });
    });
  }

  private parsePlace(jsonString: string, categoryName: string): PlaceInfo {
    try {
      const placeObject: any = JSON.parse(jsonString).place;
      
      if (!placeObject) {
        throw new Error("No 'place' object in response");
      }
      
      if (!placeObject.geometry || !placeObject.geometry.centroid) {
        throw new Error("No geometry/centroid in place object");
      }
      
      const longlat = GeoPosition.create();
      longlat.latitude = placeObject.geometry.centroid.lat;
      longlat.longitude = placeObject.geometry.centroid.lng;
      
      const place: PlaceInfo = {
        placeId: placeObject.id,
        category: categoryName,
        name: placeObject.name,
        phone_number: placeObject.contactInfo?.phoneNumber?.phoneNumber ?? "",
        address: {
          street_address: placeObject.address?.address1 ?? "",
          locality: placeObject.address?.locality ?? "",
          region: placeObject.address?.region ?? "",
          postal_code: placeObject.address?.postalCode ?? "",
          country: placeObject.address?.country ?? "",
          country_code: placeObject.countryCode ?? "",
        },
        opening_hours: placeObject.openingHours
          ? {
              dayHours: placeObject.openingHours.dayHours
                ? placeObject.openingHours.dayHours.map((dayHour) => {
                    return {
                      day: dayHour.day,
                      hours: dayHour.hours.map((hour) => {
                        return {
                          start_hour: {
                            hour: hour.start?.hour ?? 0,
                            minute: hour.start?.minute ?? 0,
                          },
                          end_hour: {
                            hour: hour.end?.hour ?? 0,
                            minute: hour.end?.minute ?? 0,
                          },
                        };
                      }),
                    };
                  })
                : [],
              time_zone: placeObject.openingHours.timeZone ?? "",
            }
          : {
              dayHours: [],
              time_zone: "",
            },
        centroid: longlat,
      };
      
      return place;
    } catch (error) {
      print("❌ ERROR in parsePlace: " + error);
      throw error;
    }
  }

  private getNearbyPlacesFromCache(
    location: GeoPosition,
    nearbyPlacesRefreshMinimumDistanceThreshold: number
  ): PlaceInfo[] | null {
    let nearestDistance = Number.MAX_VALUE;
    let cachedNearbyPlaces: PlaceInfo[] | null = null;
    
    for (let cachedLocation of this.locationToPlaces.keys()) {
      const distance = getPhysicalDistanceBetweenLocations(
        location,
        cachedLocation
      );
      if (distance < nearestDistance) {
        cachedNearbyPlaces = this.locationToPlaces.get(location);
        nearestDistance = distance;
      }
    }
    
    const useCache = nearestDistance <= nearbyPlacesRefreshMinimumDistanceThreshold;
    print("Cache check: nearest distance = " + nearestDistance + "m, threshold = " + nearbyPlacesRefreshMinimumDistanceThreshold + "m, use cache = " + useCache);
    
    return useCache ? cachedNearbyPlaces : null;
  }
}