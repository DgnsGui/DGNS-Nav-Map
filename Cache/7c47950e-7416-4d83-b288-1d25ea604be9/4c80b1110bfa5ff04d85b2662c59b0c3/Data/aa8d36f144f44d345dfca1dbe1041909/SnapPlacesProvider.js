"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapPlacesProvider = void 0;
var __selfType = requireType("./SnapPlacesProvider");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
// Import module
const placesModule = require("./Snapchat Places API Module");
const MapUtils_1 = require("./MapUtils");
let SnapPlacesProvider = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SnapPlacesProvider = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.remoteServiceModule = this.remoteServiceModule;
            this.locationToPlaces = new Map();
        }
        __initialize() {
            super.__initialize();
            this.remoteServiceModule = this.remoteServiceModule;
            this.locationToPlaces = new Map();
        }
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
                }
                catch (error) {
                    print("ERROR initializing API Module: " + error);
                }
            });
        }
        getNearbyPlacesInfo(location, numberNearbyPlaces, nearbyDistanceThreshold, filter = null) {
            print("=== getNearbyPlacesInfo CALLED ===");
            print("Location check - lat: " + location.latitude + ", lng: " + location.longitude);
            if (location.latitude === 0 && location.longitude === 0) {
                print("WARNING: Location is 0,0 - returning empty array");
                return new Promise((resolve) => {
                    resolve([]);
                });
            }
            const nearbyPlaces = this.getNearbyPlacesFromCache(location, nearbyDistanceThreshold);
            if (nearbyPlaces !== null) {
                print("Using cached places: " + nearbyPlaces.length + " places");
                return new Promise((resolve) => {
                    resolve(nearbyPlaces);
                });
            }
            else {
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
        getNearbyPlaces(location, numberNearbyPlaces, filter = null) {
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
                            const places = [];
                            results.nearbyPlaces.forEach((place) => {
                                const categoryName = place.categoryName;
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
                        }
                        else {
                            print("✓ No filter applied, returning all " + results.nearbyPlaces.length + " places");
                            resolve(results.nearbyPlaces);
                        }
                    }
                    catch (parseError) {
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
        getPlacesInfo(places) {
            print("=== getPlacesInfo for " + places.length + " places ===");
            return new Promise((resolve, reject) => {
                const promises = [];
                let venueCount = 0;
                let skippedCount = 0;
                places.forEach((place, index) => {
                    print("Place " + index + ": " + place.name + " (type: " + place.placeTypeEnum + ")");
                    if (place.placeTypeEnum && place.placeTypeEnum === "VENUE") {
                        venueCount++;
                        const getPlacePromise = new Promise((resolve, reject) => {
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
                                    const placeInfo = this.parsePlace(bodyString, place.categoryName);
                                    print("  Parsed: " + placeInfo.name + " at " + placeInfo.centroid.latitude + "," + placeInfo.centroid.longitude);
                                    resolve(placeInfo);
                                }
                                catch (error) {
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
                    }
                    else {
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
        parsePlace(jsonString, categoryName) {
            try {
                const placeObject = JSON.parse(jsonString).place;
                if (!placeObject) {
                    throw new Error("No 'place' object in response");
                }
                if (!placeObject.geometry || !placeObject.geometry.centroid) {
                    throw new Error("No geometry/centroid in place object");
                }
                const longlat = GeoPosition.create();
                longlat.latitude = placeObject.geometry.centroid.lat;
                longlat.longitude = placeObject.geometry.centroid.lng;
                const place = {
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
            }
            catch (error) {
                print("❌ ERROR in parsePlace: " + error);
                throw error;
            }
        }
        getNearbyPlacesFromCache(location, nearbyPlacesRefreshMinimumDistanceThreshold) {
            let nearestDistance = Number.MAX_VALUE;
            let cachedNearbyPlaces = null;
            for (let cachedLocation of this.locationToPlaces.keys()) {
                const distance = (0, MapUtils_1.getPhysicalDistanceBetweenLocations)(location, cachedLocation);
                if (distance < nearestDistance) {
                    cachedNearbyPlaces = this.locationToPlaces.get(location);
                    nearestDistance = distance;
                }
            }
            const useCache = nearestDistance <= nearbyPlacesRefreshMinimumDistanceThreshold;
            print("Cache check: nearest distance = " + nearestDistance + "m, threshold = " + nearbyPlacesRefreshMinimumDistanceThreshold + "m, use cache = " + useCache);
            return useCache ? cachedNearbyPlaces : null;
        }
    };
    __setFunctionName(_classThis, "SnapPlacesProvider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SnapPlacesProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SnapPlacesProvider = _classThis;
})();
exports.SnapPlacesProvider = SnapPlacesProvider;
//# sourceMappingURL=SnapPlacesProvider.js.map