import { MapGridView } from "./MapGridView";
import { MapPin } from "./MapPin";
import { PinOffsetter } from "./PinOffsetter";
import { PlaceInfo } from "./SnapPlacesProvider";

export class PinFactory {
  constructor(
    private prefab: ObjectPrefab,
    private parent: SceneObject,
    private layer: LayerSet,
    private renderOrder: number,
    private pinOffsetter: PinOffsetter,
    private gridView: MapGridView
  ) {}

  create(location: GeoPosition, placeInfo: PlaceInfo = undefined): MapPin {
    const pin = MapPin.makeMapPin(
      this.prefab,
      this.parent,
      this.layer,
      this.renderOrder,
      location,
      placeInfo
    );

    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    pin.highlight();

    return pin;
  }

  createUserPin(
    userPinPrefab: ObjectPrefab,
    location: GeoPosition,
    scale: vec2,
    renderOrder: number
  ): MapPin {
    const pin = MapPin.makeMapPin(
      userPinPrefab,
      this.parent,
      this.layer,
      renderOrder,
      location,
      undefined,
      true
    );

    pin.screenTransform.scale = new vec3(scale.x, scale.y, 1.0);

    this.pinOffsetter.bindScreenTransformToLocation(
      pin.screenTransform,
      location.longitude,
      location.latitude
    );

    this.pinOffsetter.layoutScreenTransforms(this.gridView);
    return pin;
  }
}
