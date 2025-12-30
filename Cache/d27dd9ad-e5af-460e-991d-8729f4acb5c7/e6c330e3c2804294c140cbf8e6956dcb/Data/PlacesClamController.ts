// PlacesClamController.ts
import { MapPin } from "./MapPin";
import { QuestMarker } from "./QuestMarker";
import { Switch } from "SpectaclesInteractionKit.lspkg/Components/UI/Switch/Switch"; // Vérifie le chemin exact dans ton projet
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";

const TAG = "[PlacesClamController]";
const log = new NativeLogger(TAG);

@component
export class PlacesClamController extends BaseScriptComponent {
  @input
  placesListParent: SceneObject; // L'objet "Top" dans ton ScrollWindow (où tu instanties les items)

  @input
  placeItemPrefab: ObjectPrefab; // Ton prefab "Place 0" (avec Text + Switch + CapsuleButton)

  @input
  closeButton: SceneObject; // Le bouton X en haut à droite du clam

  // Tableau pour stocker les associations pin ↔ switch ↔ item
  private items: Array<{
    pin: MapPin;
    questMarker?: QuestMarker;
    switch: Switch;
    itemObject: SceneObject;
  }> = [];

  onAwake() {
    // Binder le bouton de fermeture
    if (this.closeButton) {
      const pinchBtn = this.closeButton.getComponent("Component.PinchButton");
      if (pinchBtn) {
        pinchBtn.onButtonPinched.add(() => {
          this.closeClam();
        });
      }
    }
  }

  /**
   * Ouvre le clam et remplit la liste avec les lieux
   * @param places Liste de lieux à afficher
   */
  public openClam(places: Array<{
    name: string;
    pin: MapPin;
    questMarker?: QuestMarker;
  }>) {
    this.closeClam(); // Nettoyage au cas où

    places.forEach((place) => {
      // Instancier l'item
      const itemObj = this.placeItemPrefab.instantiate(this.placesListParent);
      itemObj.name = "Item_" + place.name;

      // Trouver le Text pour le nom (adapte le nom de l'enfant si nécessaire)
      const nameText = itemObj.getChild(0)?.getComponent("Component.Text")
                    ?? itemObj.getComponent("Component.Text");
      if (nameText) {
        nameText.text = place.name;
      }

      // Récupérer le Switch
      const switchComp = itemObj.getComponent("Switch") as Switch;
      if (!switchComp) {
        log.e("Switch component not found on place item: " + place.name);
        return;
      }

      // Démarrer en ON
      switchComp.isOn = true;

      // Écouter les changements d'état
      // Switch étend Slider → on utilise l'événement interne onValueUpdate (exposé dans SIK)
      const sliderAny = switchComp as any;
      if (sliderAny.onValueUpdate) {
        sliderAny.onValueUpdate.add((value: number) => {
          const enabled = value === 1;
          this.setPlaceVisibility(place.pin, place.questMarker, enabled);
        });
      } else {
        // Fallback très rare : polling léger
        this.createEvent("UpdateEvent").bind(() => {
          // On ne fait rien ici, mais on garde la référence pour annuler si besoin
        });
        log.w("onValueUpdate not available on Switch – using fallback might be needed");
      }

      // Stocker pour nettoyage futur
      this.items.push({
        pin: place.pin,
        questMarker: place.questMarker,
        switch: switchComp,
        itemObject: itemObj
      });
    });

    // Afficher le clam
    this.sceneObject.enabled = true;
  }

  private setPlaceVisibility(pin: MapPin, questMarker: QuestMarker | undefined, enabled: boolean) {
    if (pin?.sceneObject) {
      pin.sceneObject.enabled = enabled;
    }
    if (questMarker?.transform?.getSceneObject()) {
      questMarker.transform.getSceneObject().enabled = enabled;
    }
  }

  public closeClam() {
    // Désactiver tous les items
    this.items.forEach((item) => {
      item.itemObject.destroy();
    });
    this.items = [];

    // Cacher le clam
    this.sceneObject.enabled = false;
  }
}