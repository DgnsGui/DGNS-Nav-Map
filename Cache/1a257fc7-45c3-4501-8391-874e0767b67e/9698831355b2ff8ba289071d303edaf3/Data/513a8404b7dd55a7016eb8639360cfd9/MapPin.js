"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPin = void 0;
const MapUtils_1 = require("./MapUtils");
let pinAvailableID = 0;
const HIGHLIGHT_TWEEN_DURATION = 5;
const LABEL_BOUNDARY_PADDING = 4;
const LABEL_ELLIPSE_BOUNDARY_PADDING_X = 17; // Largeur (axe X)
const LABEL_ELLIPSE_BOUNDARY_PADDING_Y = 10; // Hauteur (axe Y)
class MapPin {
    constructor() {
        this.outlineImageComponent = undefined;
        this.outlineTransform = undefined;
        this.label = undefined;
    }
    static makeMapPin(prefab, parent, layer, renderOrder, location, placeInfo = undefined, isUser = false) {
        const pin = new MapPin();
        pin.sceneObject = prefab.instantiate(parent);
        pin.screenTransform = pin.sceneObject.getComponent("Component.ScreenTransform");
        pin.location = location;
        pin.placeInfo = placeInfo;
        //Sets right render layers to all the objects in the map pin hierarchy
        pin.sceneObject.layer = layer;
        pin.imageComponent = pin.sceneObject.getComponent("Component.Image");
        if (pin.imageComponent) {
            pin.imageComponent.setRenderOrder(renderOrder + 3);
        }
        if (pin.sceneObject.getChildrenCount() > 0) {
            const outlineObject = pin.sceneObject.getChild(0);
            pin.outlineTransform = outlineObject.getTransform();
            pin.outlineImageComponent = outlineObject.getComponent("Component.Image");
        }
        for (let i = 0; i < pin.sceneObject.getChildrenCount(); i++) {
            const child = pin.sceneObject.getChild(i);
            child.layer = layer;
            const imageComponent = child.getComponent("Image");
            if (imageComponent) {
                imageComponent.setRenderOrder(renderOrder + 2);
            }
        }
        if (pin.sceneObject.getChildrenCount() > 1) {
            pin.label = pin.sceneObject.getChild(1).getComponent("Component.Text");
            pin.label.setRenderOrder(renderOrder + 2);
        }
        if (!isUser) {
            pin.setName(placeInfo === undefined ? `Pin ${++pinAvailableID}` : placeInfo.name);
        }
        return pin;
    }
    updateRenderBound(topLeftCorner, topLeftToBottomLeft, topLeftToTopRight) {
        this.imageComponent.mainMaterial.mainPass.cornerPosition = topLeftCorner;
        this.imageComponent.mainMaterial.mainPass.verticalVector =
            topLeftToBottomLeft;
        this.imageComponent.mainMaterial.mainPass.horizontalVector =
            topLeftToTopRight;
        if (this.outlineImageComponent !== undefined) {
            this.outlineImageComponent.mainMaterial.mainPass.cornerPosition =
                topLeftCorner;
            this.outlineImageComponent.mainMaterial.mainPass.verticalVector =
                topLeftToBottomLeft;
            this.outlineImageComponent.mainMaterial.mainPass.horizontalVector =
                topLeftToTopRight;
        }
        if (this.label !== undefined) {
            const worldPosition = this.screenTransform
                .getTransform()
                .getWorldPosition();
            const leftPadding = topLeftToTopRight
                .normalize()
                .uniformScale(LABEL_BOUNDARY_PADDING);
            const topPadding = topLeftToBottomLeft
                .normalize()
                .uniformScale(LABEL_BOUNDARY_PADDING);
            const fromCorner = worldPosition.sub(topLeftCorner.add(leftPadding).add(topPadding));
            const paddedVertical = topLeftToBottomLeft.sub(topPadding);
            const paddedHorizontal = topLeftToTopRight.sub(leftPadding.uniformScale(2));
            const dotVerticalVector = paddedVertical.dot(paddedVertical);
            const dotVerticalFromCorner = fromCorner.dot(paddedVertical);
            const dotHorizontalFromCorner = fromCorner.dot(paddedHorizontal);
            const dotHorizontalVector = paddedHorizontal.dot(paddedHorizontal);
            if (Math.min(dotVerticalVector > dotVerticalFromCorner ? 1 : 0, dotVerticalFromCorner, dotHorizontalVector > dotHorizontalFromCorner ? 1 : 0, dotHorizontalFromCorner) <= 0) {
                this.label.backgroundSettings.enabled = false;
            }
            else {
                this.label.backgroundSettings.enabled = true;
            }
        }
    }
    updateCircularRenderBound(center) {
        this.imageComponent.mainMaterial.mainPass.circleBoundCentre = center;
        if (this.outlineImageComponent !== undefined) {
            this.outlineImageComponent.mainMaterial.mainPass.circleBoundCentre =
                center;
        }
        if (this.label !== undefined) {
            // Test elliptique (remplace le test circulaire)
            const pos = this.screenTransform.position.add(this.label.getTransform().getLocalPosition());
            const ellipseCheck = (pos.x * pos.x) / (LABEL_ELLIPSE_BOUNDARY_PADDING_X * LABEL_ELLIPSE_BOUNDARY_PADDING_X)
                + (pos.y * pos.y) / (LABEL_ELLIPSE_BOUNDARY_PADDING_Y * LABEL_ELLIPSE_BOUNDARY_PADDING_Y);
            if (ellipseCheck > 1) {
                this.label.backgroundSettings.enabled = false;
            }
            else {
                this.label.backgroundSettings.enabled = true;
            }
        }
    }
    setName(name) {
        this.sceneObject.name = name;
        if (this.label !== undefined) {
            this.label.text = name;
        }
    }
    toggleMiniMap(isMiniMap) {
        this.imageComponent.mainMaterial.mainPass.isMini = isMiniMap;
        if (this.outlineImageComponent !== undefined) {
            this.outlineImageComponent.mainMaterial.mainPass.isMini = isMiniMap;
        }
    }
    enableOutline(enabled) {
        if (this.outlineTransform === undefined) {
            return;
        }
        this.outlineTransform.getSceneObject().enabled = enabled;
    }
    highlight() {
        if (this.outlineTransform === undefined) {
            return;
        }
        if (this.tweenCancelFunction !== undefined) {
            this.tweenCancelFunction();
            this.tweenCancelFunction = undefined;
        }
        this.enableOutline(true);
        this.tweenCancelFunction = (0, MapUtils_1.makeTween)((t) => {
            const easeOutNumber = (0, MapUtils_1.easeOutElastic)(t);
            this.outlineTransform.setLocalScale(new vec3(easeOutNumber, easeOutNumber, easeOutNumber));
        }, HIGHLIGHT_TWEEN_DURATION);
    }
}
exports.MapPin = MapPin;
//# sourceMappingURL=MapPin.js.map