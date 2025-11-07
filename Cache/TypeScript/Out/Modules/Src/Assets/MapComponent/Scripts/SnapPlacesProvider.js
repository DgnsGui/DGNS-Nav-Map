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
function component(target) { target.getTypeName = function () { return __selfType; }; }
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
                this.apiModule = new placesModule.ApiModule(this.remoteServiceModule);
            });
        }
        getNearbyPlacesInfo(location, numberNearbyPlaces, nearbyDistanceThreshold, filter = null) {
            if (location.latitude === 0 && location.longitude === 0) {
                return new Promise((resolve) => {
                    resolve([]);
                });
            }
            const nearbyPlaces = this.getNearbyPlacesFromCache(location, nearbyDistanceThreshold);
            if (nearbyPlaces !== null) {
                return new Promise((resolve) => {
                    resolve(nearbyPlaces);
                });
            }
            else {
                return new Promise((resolve, reject) => {
                    this.getNearbyPlaces(location, numberNearbyPlaces, filter)
                        .then((places) => {
                        this.getPlacesInfo(places)
                            .then((places) => {
                            this.locationToPlaces.set(location, places);
                            resolve(places);
                        })
                            .catch((error) => {
                            reject(`Error getting places info: ${error}`);
                        });
                    })
                        .catch((error) => {
                        reject(`Error getting nearby places: ${error}`);
                    });
                });
            }
        }
        getNearbyPlaces(location, numberNearbyPlaces, filter = null) {
            return new Promise((resolve, reject) => {
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
                    const results = response.bodyAsJson();
                    if (filter !== null) {
                        const places = [];
                        results.nearbyPlaces.forEach((place) => {
                            const categoryName = place.categoryName;
                            for (let i = 0; i < filter.length; i++) {
                                if (categoryName.includes(filter[i])) {
                                    places.push(place);
                                    break;
                                }
                            }
                        });
                        resolve(places);
                    }
                    else {
                        resolve(results.nearbyPlaces);
                    }
                })
                    .catch((error) => {
                    reject(`Error retrieving nearby places: ${error}`);
                });
            });
        }
        getPlacesInfo(places) {
            return new Promise((resolve, reject) => {
                const promises = [];
                places.forEach((place) => {
                    if (place.placeTypeEnum && place.placeTypeEnum === "VENUE") {
                        const getPlacePromise = new Promise((resolve, reject) => {
                            this.apiModule
                                .get_place({
                                parameters: {
                                    place_id: place.placeId,
                                },
                            })
                                .then((response) => {
                                try {
                                    const placeInfo = this.parsePlace(response.bodyAsString(), place.categoryName);
                                    resolve(placeInfo);
                                }
                                catch (error) {
                                    reject(error);
                                }
                            })
                                .catch((error) => {
                                reject(error);
                            });
                        });
                        promises.push(getPlacePromise);
                    }
                });
                Promise.all(promises).then((places) => {
                    resolve(places);
                });
            });
        }
        parsePlace(jsonString, categoryName) {
            const placeObject = JSON.parse(jsonString).place;
            const longlat = GeoPosition.create();
            longlat.latitude = placeObject.geometry.centroid.lat;
            longlat.longitude = placeObject.geometry.centroid.lng;
            const place = {
                placeId: placeObject.id,
                category: categoryName,
                name: placeObject.name,
                phone_number: placeObject.contactInfo.phoneNumber?.phoneNumber ?? "",
                address: {
                    street_address: placeObject.address.address1,
                    locality: placeObject.address.locality,
                    region: placeObject.address.region,
                    postal_code: placeObject.address.postalCode,
                    country: placeObject.address.country,
                    country_code: placeObject.countryCode,
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
                            : {},
                        time_zone: placeObject.openingHours.timeZone
                            ? placeObject.openingHours.timeZone
                            : "",
                    }
                    : {
                        dayHours: [],
                        time_zone: "",
                    },
                centroid: longlat,
            };
            return place;
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
            return nearestDistance <= nearbyPlacesRefreshMinimumDistanceThreshold
                ? cachedNearbyPlaces
                : null;
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