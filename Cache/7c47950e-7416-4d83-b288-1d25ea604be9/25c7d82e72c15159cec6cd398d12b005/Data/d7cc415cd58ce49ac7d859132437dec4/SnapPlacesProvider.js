"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapPlacesProvider = void 0;
var __selfType = requireType("./SnapPlacesProvider");
function component(target) { target.getTypeName = function () { return __selfType; }; }
// Import module
const placesModule = require("./Snapchat Places API Module");
const MapUtils_1 = require("./MapUtils");
let SnapPlacesProvider = class SnapPlacesProvider extends BaseScriptComponent {
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
        var _a, _b;
        const placeObject = JSON.parse(jsonString).place;
        const longlat = GeoPosition.create();
        longlat.latitude = placeObject.geometry.centroid.lat;
        longlat.longitude = placeObject.geometry.centroid.lng;
        const place = {
            placeId: placeObject.id,
            category: categoryName,
            name: placeObject.name,
            phone_number: (_b = (_a = placeObject.contactInfo.phoneNumber) === null || _a === void 0 ? void 0 : _a.phoneNumber) !== null && _b !== void 0 ? _b : "",
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
                                    var _a, _b, _c, _d, _e, _f, _g, _h;
                                    return {
                                        start_hour: {
                                            hour: (_b = (_a = hour.start) === null || _a === void 0 ? void 0 : _a.hour) !== null && _b !== void 0 ? _b : 0,
                                            minute: (_d = (_c = hour.start) === null || _c === void 0 ? void 0 : _c.minute) !== null && _d !== void 0 ? _d : 0,
                                        },
                                        end_hour: {
                                            hour: (_f = (_e = hour.end) === null || _e === void 0 ? void 0 : _e.hour) !== null && _f !== void 0 ? _f : 0,
                                            minute: (_h = (_g = hour.end) === null || _g === void 0 ? void 0 : _g.minute) !== null && _h !== void 0 ? _h : 0,
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
    __initialize() {
        super.__initialize();
        this.locationToPlaces = new Map();
    }
};
exports.SnapPlacesProvider = SnapPlacesProvider;
exports.SnapPlacesProvider = SnapPlacesProvider = __decorate([
    component
], SnapPlacesProvider);
//# sourceMappingURL=SnapPlacesProvider.js.map