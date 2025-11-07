// --- START OF FILE MapPin.ts (FINAL, CORRECTED API) ---

import { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { easeOutElastic, makeTween } from "./MapUtils";
import { PlaceInfo } from "./SnapPlacesProvider";

let pinAvailableID = 0;
const HIGHLIGHT_TWEEN_DURATION = 1;

export class MapPin {
  sceneObject: SceneObject;
  screenTransform: ScreenTransform;
  location: GeoPosition;
  imageComponent: Image;
  outlineImageComponent: Image = undefined;
  outlineTransform: Transform = undefined;
  label: Text = undefined;
  labelMaterial: Material = undefined;
  placeInfo: PlaceInfo;
  tweenCancelFunction: CancelFunction;

  static makeMapPin(
    prefab: ObjectPrefab,
    parent: SceneObject,
    layer: LayerSet,
    renderOrder: number,
    location: GeoPosition | null,
    placeInfo: PlaceInfo = undefined,
    isUser = false
  ): MapPin {
    const pin = new MapPin();
    pin.sceneObject = prefab.instantiate(parent);
    pin.screenTransform = pin.sceneObject.getComponent("Component.ScreenTransform");
    pin.location = location;
    pin.placeInfo = placeInfo;

    pin.sceneObject.layer = layer;
    pin.imageComponent = pin.sceneObject.getComponent("Component.Image");
    if (pin.imageComponent) {
      pin.imageComponent.setRenderOrder(renderOrder + 3);
      pin.imageComponent.mainMaterial = pin.imageComponent.mainMaterial.clone();
    }

    if (pin.sceneObject.getChildrenCount() > 0) {
      const outlineObject = pin.sceneObject.getChild(0);
      pin.outlineTransform = outlineObject.getTransform();
      pin.outlineImageComponent = outlineObject.getComponent("Component.Image");
      if (pin.outlineImageComponent) {
          pin.outlineImageComponent.mainMaterial = pin.outlineImageComponent.mainMaterial.clone();
      }
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
      const labelObject = pin.sceneObject.getChild(1);
      pin.label = labelObject.getComponent("Component.Text");
      if (pin.label) {
          pin.label.setRenderOrder(renderOrder + 4);
          // CORRECTION FINALE : On accède au matériau via la propriété .textMaterial
          if (pin.label.textMaterial) {
              pin.labelMaterial = pin.label.textMaterial.clone();
              pin.label.textMaterial = pin.labelMaterial;
          }
      }
    }

    if (!isUser) {
      pin.setName(
        placeInfo === undefined ? `Map Pin ${++pinAvailableID}` : placeInfo.name
      );
    }

    return pin;
  }

  updateRenderBound(
    topLeftCorner: vec3,
    topLeftToBottomLeft: vec3,
    topLeftToTopRight: vec3
  ): void {
    if (this.imageComponent && this.imageComponent.mainMaterial) {
        this.imageComponent.mainMaterial.mainPass.cornerPosition = topLeftCorner;
        this.imageComponent.mainMaterial.mainPass.verticalVector = topLeftToBottomLeft;
        this.imageComponent.mainMaterial.mainPass.horizontalVector = topLeftToTopRight;
    }

    if (this.outlineImageComponent && this.outlineImageComponent.mainMaterial) {
      this.outlineImageComponent.mainMaterial.mainPass.cornerPosition = topLeftCorner;
      this.outlineImageComponent.mainMaterial.mainPass.verticalVector = topLeftToBottomLeft;
      this.outlineImageComponent.mainMaterial.mainPass.horizontalVector = topLeftToTopRight;
    }
    
    if (this.labelMaterial) {
        this.labelMaterial.mainPass.cornerPosition = topLeftCorner;
        this.labelMaterial.mainPass.verticalVector = topLeftToBottomLeft;
        this.labelMaterial.mainPass.horizontalVector = topLeftToTopRight;
    }
  }

  updateCircularRenderBound(center: vec3): void {
    if (this.imageComponent && this.imageComponent.mainMaterial) {
        this.imageComponent.mainMaterial.mainPass.circleBoundCentre = center;
    }
    
    if (this.outlineImageComponent && this.outlineImageComponent.mainMaterial) {
      this.outlineImageComponent.mainMaterial.mainPass.circleBoundCentre = center;
    }

    if (this.labelMaterial) {
      this.labelMaterial.mainPass.circleBoundCentre = center;
    }
  }

  setName(name: string): void {
    this.sceneObject.name = name;
    if (this.label) {
      this.label.text = name;
    }
  }

  toggleMiniMap(isMiniMap: boolean): void {
    if (this.imageComponent && this.imageComponent.mainMaterial) {
        this.imageComponent.mainMaterial.mainPass.isMini = isMiniMap;
    }
    if (this.outlineImageComponent && this.outlineImageComponent.mainMaterial) {
      this.outlineImageComponent.mainMaterial.mainPass.isMini = isMiniMap;
    }
    if (this.labelMaterial) {
        this.labelMaterial.mainPass.isMini = isMiniMap;
    }
  }

  enableOutline(enabled: boolean): void {
    if (this.outlineTransform === undefined) return;
    this.outlineTransform.getSceneObject().enabled = enabled;
  }

  highlight(): void {
    if (this.outlineTransform === undefined) return;
    if (this.tweenCancelFunction) {
      this.tweenCancelFunction();
      this.tweenCancelFunction = undefined;
    }
    this.enableOutline(true);
    this.tweenCancelFunction = makeTween((t) => {
      const easeOutNumber = easeOutElastic(t);
      this.outlineTransform.setLocalScale(
        new vec3(easeOutNumber, easeOutNumber, easeOutNumber)
      );
    }, HIGHLIGHT_TWEEN_DURATION);
  }
}