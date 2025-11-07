"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestMarker = void 0;
class QuestMarker {
    constructor(mapPin, transform, scale) {
        this.mapPin = mapPin;
        this.transform = transform;
        this.transform.setLocalScale(new vec3(scale, scale, scale));
        this.markerLabel = transform
            .getSceneObject()
            .getChild(0)
            .getComponent("Text");
        if (mapPin.placeInfo !== undefined) {
            this.markerLabel.text = mapPin.placeInfo.name;
        }
        else {
            this.markerLabel.text = mapPin.sceneObject.name;
        }
        this.distanceText = transform
            .getSceneObject()
            .getChild(1)
            .getComponent("Text");
        this.imageComponent = transform
            .getSceneObject()
            .getChild(2)
            .getComponent("Image");
    }
    setIsInView(isInView, inViewMaterial, outOfViewMaterial) {
        if (isInView) {
            this.imageComponent.mainMaterial = inViewMaterial;
            this.markerLabel.textFill.color = new vec4(1, 1, 1, 1);
            this.distanceText.textFill.color = new vec4(1, 1, 1, 1);
        }
        else {
            this.imageComponent.mainMaterial = outOfViewMaterial;
            this.markerLabel.textFill.color = new vec4(1, 1, 1, 1);
            this.distanceText.textFill.color = new vec4(1, 1, 1, 1);
        }
    }
    setDistance(distance) {
        this.distanceText.text = `${distance.toFixed(0)}m`;
    }
    setOrientation(orientation) {
        this.imageComponent
            .getTransform()
            .setLocalRotation(quat.fromEulerAngles(0, 0, orientation));
    }
}
exports.QuestMarker = QuestMarker;
//# sourceMappingURL=QuestMarker.js.map