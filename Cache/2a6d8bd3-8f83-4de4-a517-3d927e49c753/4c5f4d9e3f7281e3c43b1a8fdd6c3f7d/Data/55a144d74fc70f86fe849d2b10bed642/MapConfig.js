"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MapUtils_1 = require("./MapUtils");
class MapConfig {
    constructor() {
        this.mapRenderOrder = 1;
        this.isMiniMap = true;
    }
    static makeConfig(mapPinsAnchor, mapComponentScreenTransform, gridScreenTransform, mapTilePrefab, mapController, enableScrolling, scrollingFriction, tileCount) {
        let config = new MapConfig();
        config.mapPinsAnchor = mapPinsAnchor;
        config.mapComponentScreenTransform = mapComponentScreenTransform;
        config.gridScreenTransform = gridScreenTransform;
        config.mapTilePrefab = mapTilePrefab;
        config.mapController = mapController;
        // Set the horizontal properties
        config.horizontalScrollingEnabled = enableScrolling;
        config.horizontalMinIndex = -Infinity;
        config.horizontalMaxIndex = Infinity;
        config.horizontalAllowOutOfIndexRange = true; // When true, `onDataChanged` will be called even when a cell is out of range and the cell will not be disabled when out of range.
        config.tileCount = tileCount;
        // Set the vertical properties
        config.verticalScrollingEnabled = enableScrolling;
        config.verticalMinIndex = -Infinity;
        config.verticalMaxIndex = Infinity;
        config.verticalAllowOutOfIndexRange = false; // When true, `onDataChanged` will be called even when a cell is out of range and the cell will not be disabled when out of range.
        config.scrollingFriction = scrollingFriction;
        return config;
    }
    /**
     * Assign the renderLayer to all the content on the content anchor
     */
    onContentMaskRenderLayer(renderLayer) {
        (0, MapUtils_1.forEachSceneObjectInSubHierarchy)(this.mapPinsAnchor, (sceneObject) => {
            sceneObject.layer = renderLayer;
        });
    }
    onLayout() {
        this.mapController.pinOffsetter.layoutScreenTransforms(this.mapController.gridView);
    }
}
exports.default = MapConfig;
//# sourceMappingURL=MapConfig.js.map