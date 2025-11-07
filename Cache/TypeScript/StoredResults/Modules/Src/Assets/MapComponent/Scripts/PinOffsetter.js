"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinOffsetter = void 0;
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const MapUtils_1 = require("./MapUtils");
const TAG = "[PinOffsetter]";
const log = new NativeLogger_1.default(TAG);
class PinOffsetter {
    constructor() {
        this.locationBoundScreenTransforms = {};
    }
    static makeMapLocationOffsetter(mapModule, initialLocationAsset) {
        const pinOffsetter = new PinOffsetter();
        pinOffsetter.mapModule = mapModule;
        pinOffsetter.initialLocationAsset = initialLocationAsset;
        return pinOffsetter;
    }
    bindScreenTransformToLocation(screenTransform, longitude, latitude) {
        if (longitude === undefined ||
            longitude === null ||
            latitude === undefined ||
            latitude === null) {
            log.e("longitude and latitude has to be defined " + Error().stack);
            return;
        }
        this.locationBoundScreenTransforms[screenTransform.uniqueIdentifier] = {
            screenTransform: screenTransform,
            longitude: longitude,
            latitude: latitude,
        };
    }
    unbindScreenTransform(screenTransform) {
        delete this.locationBoundScreenTransforms[screenTransform.uniqueIdentifier];
    }
    layoutScreenTransforms(gridView) {
        Object.keys(this.locationBoundScreenTransforms).forEach((locationKey) => {
            const offset = gridView.getOffset();
            const boundLocation = this.locationBoundScreenTransforms[locationKey];
            const initialTileOffset = this.mapModule.longLatToImageRatio(boundLocation.longitude, boundLocation.latitude, this.initialLocationAsset);
            (0, MapUtils_1.setScreenTransformRect01)(boundLocation.screenTransform, offset.x + initialTileOffset.x, offset.y + initialTileOffset.y, 0, 0);
        });
    }
}
exports.PinOffsetter = PinOffsetter;
//# sourceMappingURL=PinOffsetter.js.map