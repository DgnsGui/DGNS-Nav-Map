"use strict";
// --- START OF FILE MapGridView.ts (FINAL, CLEANED) ---
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapGridView = void 0;
const mathUtils_1 = require("SpectaclesInteractionKit.lspkg/Utils/mathUtils");
const Cell_1 = require("./Cell");
const MapUtils_1 = require("./MapUtils");
class MapGridView {
    constructor() {
        this.needsLayout = false;
        this.hasInitialized = false;
        this.cells = [];
        this.isScrolling = false;
        this.isDragging = false;
        this.hasDragged = false;
        this.initialLocalTouchPosition = vec2.zero();
        this.lastTouchPosition = vec2.zero();
        this.velocity = vec2.zero();
        this.maxVelocity = 6;
        this.currentOffset = vec2.zero();
        this.draggingOffset = vec2.zero();
        this.lastOffset = vec2.zero();
        this.lastTouchMoveTime = 0;
        this.screenPositionChangedDidChange = false;
        this.shouldTriggerScrollingStarted = false;
        this.hasTriggeredScrollingStarted = false;
        this.isMiniMapEnabled = false;
    }
    static makeGridView(mapController) {
        const gridView = new MapGridView();
        gridView.mapController = mapController;
        return gridView;
    }
    handleUpdateConfig(newConfig) {
        this.config = newConfig;
        this.needsLayout = true;
        if (!this.hasInitialized) {
            this.hasInitialized = true;
            this.screenPositionChangedDidChange = true;
            global.touchSystem.touchBlocking = true;
        }
        const neededCellsCount = this.config.tileCount * this.config.tileCount;
        if (neededCellsCount !== this.cells.length) {
            this.needsLayout = true;
            const difference = neededCellsCount - this.cells.length;
            if (difference < 0) {
                for (let i = 0; i < Math.abs(difference); i++) {
                    const cellToRemove = this.cells.pop();
                    if ((0, MapUtils_1.isFunction)(cellToRemove.onShouldDestroy))
                        cellToRemove.onShouldDestroy();
                }
            }
            else if (difference > 0) {
                for (let i = 0; i < difference; i++) {
                    const cell = Cell_1.Cell.makeCell(this.mapController.referencePositionLocationAsset);
                    cell.sceneObject = this.config.mapTilePrefab.instantiate(this.config.gridScreenTransform.sceneObject);
                    cell.renderLayer = this.config.gridScreenTransform.getSceneObject().layer;
                    cell.screenTransform = cell.sceneObject.getComponent("Component.ScreenTransform");
                    (0, MapUtils_1.setScreenTransformRect01)(cell.screenTransform, 0, 0, 1, 1);
                    this.mapController.configureCell(cell);
                    this.cells.push(cell);
                }
            }
        }
    }
    updateGridView(mapPins, userPin) {
        if (!this.isScrolling && this.velocity.length > 0.001) {
            this.velocity = this.velocity.sub(this.velocity.uniformScale(this.config.scrollingFriction * getDeltaTime()));
            this.velocity = this.velocity.clampLength(this.maxVelocity);
            this.currentOffset = this.currentOffset.add(this.velocity.uniformScale(getDeltaTime()));
            if (this.currentOffset.sub(this.lastOffset).length > 0.00001) {
                this.screenPositionChangedDidChange = true;
                this.lastOffset = this.currentOffset;
                this.clampCurrentOffset();
                this.needsLayout = true;
            }
            else {
                this.velocity = vec2.zero();
            }
        }
        if (this.needsLayout)
            this.layoutCells();
        const topLeftCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(-2, 2));
        const bottomLeftCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(-2, -2));
        const topRightCorner = this.config.gridScreenTransform.localPointToWorldPoint(new vec2(2, 2));
        const topLeftToBottomLeft = bottomLeftCorner.sub(topLeftCorner);
        const topLeftToTopRight = topRightCorner.sub(topLeftCorner);
        const center = this.config.gridScreenTransform.getTransform().getWorldPosition();
        mapPins.forEach((pin) => {
            if (this.isMiniMapEnabled)
                pin.updateCircularRenderBound(center);
            else
                pin.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight);
        });
        if (userPin) {
            if (this.isMiniMapEnabled)
                userPin.updateCircularRenderBound(center);
            else
                userPin.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight);
        }
        this.cells.forEach((cell) => {
            if (this.isMiniMapEnabled)
                cell.updateCircularRenderBound(center);
            else
                cell.updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight);
            if (this.screenPositionChangedDidChange)
                cell.onScreenPositionChanged();
        });
        if (this.screenPositionChangedDidChange)
            this.screenPositionChangedDidChange = false;
    }
    toggleMiniMap(isOn, mapPins, userPin, isAnimated = true) {
        this.config.isMiniMap = isOn;
        this.cells.forEach((cell) => cell.toggleMiniMap(this.config.isMiniMap, isAnimated));
        mapPins.forEach((pin) => pin.toggleMiniMap(this.config.isMiniMap));
        if (userPin)
            userPin.toggleMiniMap(this.config.isMiniMap);
        this.isMiniMapEnabled = isOn;
    }
    layoutCells(forcedUpdate = false) {
        this.needsLayout = false;
        const offset = this.currentOffset.add(this.draggingOffset);
        let needle = -1;
        for (let x = 0; x < this.config.tileCount; x++) {
            for (let y = 0; y < this.config.tileCount; y++) {
                const cell = this.cells[++needle];
                const targetXOffset = x + offset.x;
                const targetYOffset = y + offset.y;
                const wrappedXOffset = (0, MapUtils_1.mod)(targetXOffset + 1.5, this.config.tileCount) - 1.5;
                const wrappedYOffset = (0, MapUtils_1.mod)(targetYOffset + 1.5, this.config.tileCount) - 1.5;
                (0, MapUtils_1.setScreenTransformRect01)(cell.screenTransform, wrappedXOffset, wrappedYOffset, 1, 1);
                const targetHorizontalIndex = Math.round(wrappedXOffset - offset.x + 0.001);
                const targetVerticalIndex = Math.floor(wrappedYOffset - offset.y + 0.001);
                let indexChanged = false;
                const indexInHorizontalRange = this.config.horizontalAllowOutOfIndexRange || (targetHorizontalIndex >= this.config.horizontalMinIndex && targetHorizontalIndex <= this.config.horizontalMaxIndex);
                const indexInVerticalRange = this.config.verticalAllowOutOfIndexRange || (targetVerticalIndex >= this.config.verticalMinIndex && targetVerticalIndex <= this.config.verticalMaxIndex);
                if (indexInHorizontalRange && indexInVerticalRange) {
                    if (targetHorizontalIndex !== cell.horizontalIndex) {
                        cell.horizontalIndex = targetHorizontalIndex;
                        indexChanged = true;
                    }
                    if (targetVerticalIndex !== cell.verticalIndex) {
                        cell.verticalIndex = targetVerticalIndex;
                        indexChanged = true;
                    }
                }
                if (cell.sceneObject.enabled && (!indexInHorizontalRange || !indexInVerticalRange)) {
                    cell.onDisabled();
                    cell.sceneObject.enabled = false;
                }
                if (!cell.sceneObject.enabled && indexInHorizontalRange && indexInVerticalRange) {
                    cell.onEnabled();
                    cell.sceneObject.enabled = true;
                }
                if (indexChanged || forcedUpdate) {
                    if (forcedUpdate)
                        cell.onZoomChanged(this.mapController.referencePositionLocationAsset);
                    cell.onDataChanged();
                }
            }
        }
        this.mapController.onCellCountChanged(this.config.tileCount * this.config.tileCount);
        this.config.onLayout();
    }
    handleScrollStart(localPosition) {
        if (!this.config.horizontalScrollingEnabled && !this.config.verticalScrollingEnabled)
            return;
        this.isScrolling = true;
        (0, MapUtils_1.setVec2)(this.initialLocalTouchPosition, localPosition);
        (0, MapUtils_1.setVec2)(this.lastTouchPosition, this.initialLocalTouchPosition);
        this.velocity = vec2.zero();
        this.draggingOffset = vec2.zero();
        this.isDragging = false;
        this.lastTouchMoveTime = getTime();
        this.shouldTriggerScrollingStarted = true;
    }
    handleScrollUpdate(localPosition) {
        if (!this.isScrolling)
            return;
        if (!this.hasTriggeredScrollingStarted && this.shouldTriggerScrollingStarted) {
            this.mapController.onScrollingStarted();
            this.hasTriggeredScrollingStarted = true;
        }
        this.needsLayout = true;
        this.screenPositionChangedDidChange = true;
        this.isDragging = true;
        this.hasDragged = true;
        const delta = getTime() - this.lastTouchMoveTime;
        if (delta <= 0)
            return;
        const touchOffsetFromInitialTouch = localPosition.sub(this.initialLocalTouchPosition);
        const constrainAxis = new vec2(this.config.horizontalScrollingEnabled ? 1 : 0, this.config.verticalScrollingEnabled ? 1 : 0);
        this.draggingOffset = touchOffsetFromInitialTouch.mult(new vec2(1, -1)).mult(constrainAxis);
        this.lastTouchMoveTime = getTime();
        const scale = delta * 600;
        const touchOffsetFromLastTouch = localPosition.sub(this.lastTouchPosition);
        const acceleration = touchOffsetFromLastTouch.mult(new vec2(scale, -scale)).mult(constrainAxis);
        this.velocity = this.velocity.add(acceleration.sub(this.velocity));
        (0, MapUtils_1.setVec2)(this.lastTouchPosition, localPosition);
    }
    handleScrollEnd() {
        if (!this.isScrolling)
            return;
        this.isScrolling = false;
        if (this.hasDragged) {
            this.hasDragged = false;
            this.currentOffset = this.currentOffset.add(this.draggingOffset);
            this.clampCurrentOffset();
            this.draggingOffset = vec2.zero();
        }
        this.shouldTriggerScrollingStarted = false;
        this.hasTriggeredScrollingStarted = false;
    }
    getCells() { return this.cells; }
    getOffset() { return this.currentOffset.add(this.draggingOffset); }
    setOffset(offset) {
        const targetOffset = offset.sub(this.draggingOffset);
        if (targetOffset.x !== this.currentOffset.x || targetOffset.y !== this.currentOffset.y) {
            this.screenPositionChangedDidChange = true;
            this.needsLayout = true;
            this.currentOffset.x = targetOffset.x;
            this.currentOffset.y = targetOffset.y;
        }
    }
    getConfig() { return this.config; }
    handleReloadData() { this.cells.forEach(cell => cell.onDataChanged()); }
    resetVelocity() { this.velocity = vec2.zero(); }
    clampCurrentOffset() {
        this.currentOffset.x = (0, mathUtils_1.clamp)(-this.config.horizontalMaxIndex, -this.config.horizontalMinIndex, this.currentOffset.x);
        this.currentOffset.y = (0, mathUtils_1.clamp)(-this.config.verticalMaxIndex, -this.config.verticalMinIndex, this.currentOffset.y);
    }
}
exports.MapGridView = MapGridView;
//# sourceMappingURL=MapGridView.js.map