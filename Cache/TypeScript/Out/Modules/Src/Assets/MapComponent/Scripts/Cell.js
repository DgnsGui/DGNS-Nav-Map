"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const MapUIController_1 = require("../../Scripts/MapUIController");
const Event_1 = require("SpectaclesInteractionKit.lspkg/Utils/Event");
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const MapUtils_1 = require("./MapUtils");
const FULL_CIRCLE_BOUND_RADIUS = 15;
const HALF_CIRCLE_BOUND_RADIUS = 7.5;
const TAG = "[Cell]";
const log = new NativeLogger_1.default(TAG);
class Cell {
    constructor() {
        this.renderLayer = null;
        this.horizontalIndex = -Infinity;
        this.verticalIndex = -Infinity;
        this.screenTransform = null;
        this.imageComponent = null;
        this.sceneObject = null;
        this.onTileWentOutOfViewEvent = new Event_1.default();
        this.onTileWentOutOfView = this.onTileWentOutOfViewEvent.publicApi();
        this.onTileCameIntoViewEvent = new Event_1.default();
        this.onTileCameIntoView = this.onTileCameIntoViewEvent.publicApi();
    }
    static makeCell(initialPositionLocationAsset) {
        const cell = new Cell();
        cell.initialPositionLocationAsset = initialPositionLocationAsset;
        return cell;
    }
    onScreenPositionChanged() {
        // Fired when scrolled or the bounds change size
        // Update any materials used for masking
    }
    onZoomChanged(initialPositionLocationAsset) {
        this.initialPositionLocationAsset = initialPositionLocationAsset;
    }
    onDataChanged() {
        //Checking if new map tiles came into the view / left the view
        if (this.lastHorizontalIndex !== undefined &&
            this.lastVerticalIndex !== undefined) {
            if (this.horizontalIndex != this.lastHorizontalIndex ||
                this.verticalIndex != this.lastVerticalIndex) {
                this.onTileWentOutOfViewEvent.invoke({
                    horizontalIndex: this.lastHorizontalIndex,
                    verticalIndex: this.lastVerticalIndex,
                });
                this.onTileCameIntoViewEvent.invoke({
                    horizontalIndex: this.horizontalIndex,
                    verticalIndex: this.verticalIndex,
                });
                this.lastHorizontalIndex = this.horizontalIndex;
                this.lastVerticalIndex = this.verticalIndex;
            }
        }
        else {
            this.onTileCameIntoViewEvent.invoke({
                horizontalIndex: this.horizontalIndex,
                verticalIndex: this.verticalIndex,
            });
            this.lastHorizontalIndex = this.horizontalIndex;
            this.lastVerticalIndex = this.verticalIndex;
        }
        // Fired when the index (or other properties change))
        this.textureProvider.location =
            this.initialPositionLocationAsset.adjacentTile(this.horizontalIndex, this.verticalIndex, 0.0);
    }
    toggleMiniMap(isMiniMap, isAnimated = true) {
        if (this.tweenCancelFunction !== undefined) {
            this.tweenCancelFunction();
            this.tweenCancelFunction = undefined;
        }
        if (isMiniMap) {
            this.imageComponent.mainMaterial.mainPass.isMini = true;
            if (isAnimated) {
                this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                    this.imageComponent.mainMaterial.mainPass.circleBoundRadius =
                        MathUtils.lerp(FULL_CIRCLE_BOUND_RADIUS, HALF_CIRCLE_BOUND_RADIUS, t);
                }, MapUIController_1.TWEEN_DURATION);
            }
            else {
                this.imageComponent.mainMaterial.mainPass.circleBoundRadius =
                    HALF_CIRCLE_BOUND_RADIUS;
            }
        }
        else {
            if (isAnimated) {
                this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
                    this.imageComponent.mainMaterial.mainPass.circleBoundRadius =
                        MathUtils.lerp(HALF_CIRCLE_BOUND_RADIUS, FULL_CIRCLE_BOUND_RADIUS, t);
                    if (t > 0.99999) {
                        this.imageComponent.mainMaterial.mainPass.isMini = false;
                    }
                }, MapUIController_1.TWEEN_DURATION);
            }
            else {
                this.imageComponent.mainMaterial.mainPass.circleBoundRadius =
                    FULL_CIRCLE_BOUND_RADIUS;
            }
        }
    }
    updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight) {
        this.imageComponent.mainMaterial.mainPass.cornerPosition = topLeftCorner;
        this.imageComponent.mainMaterial.mainPass.verticalVector =
            topLeftToBottomLeft;
        this.imageComponent.mainMaterial.mainPass.horizontalVector =
            topLeftToTopRight;
    }
    updateCircularRenderBound(center) {
        this.imageComponent.mainMaterial.mainPass.circleBoundCentre = center;
    }
    onTapped() { }
    onShouldDestroy() {
        // Fired when a cell is no longer needed (i.e. the bounds became smaller)
        this.screenTransform.getSceneObject().destroy();
    }
    onEnabled() {
        // Fired when a cell is in range
    }
    onDisabled() {
        // Fired when a cell is out of range
    }
    retryTextureLoading() {
        const locationAsset = this.textureProvider.location;
        log.e(`Cell ${locationAsset.name} retrying texture loading`);
        this.textureProvider.location = null;
        this.textureProvider.location = locationAsset;
    }
}
exports.Cell = Cell;
//# sourceMappingURL=Cell.js.map