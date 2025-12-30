import { MapComponent } from "./MapComponent/MapComponent";
import { MapController } from "./MapComponent/MapController";
import { MapPin } from "./MapComponent/Scripts/MapPin";

/**
 * Script helper pour lier automatiquement les quest markers créés
 * aux places dans le Places Clam
 */
@component
export class PlacesQuestMarkerLinker extends BaseScriptComponent {
  @input
  mapComponent: MapComponent;

  private mapController: MapController;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    if (!this.mapComponent) {
      print("ERROR: MapComponent not assigned to PlacesQuestMarkerLinker!");
      return;
    }

    this.mapController = this.mapComponent.mapController;

    if (!this.mapController) {
      print("ERROR: MapController not found in MapComponent!");
      return;
    }

    // S'abonner à la création des pins pour lier les quest markers
    this.setupQuestMarkerLinking();
  }

  private setupQuestMarkerLinking(): void {
    // Cette méthode doit être appelée après que les pins soient créés
    // et que les quest markers soient générés par le MapController
    
    // Option 1: Si MapController expose une liste de quest markers
    // On peut itérer dessus et les lier
    
    // Option 2: Hook dans le processus de création
    // Pour l'instant, on va utiliser une approche par polling
    
    const delayEvent = this.createEvent("DelayedCallbackEvent");
    delayEvent.bind(() => {
      this.linkExistingQuestMarkers();
    });
    delayEvent.reset(1.0); // Attendre 1 seconde après le chargement
  }

  private linkExistingQuestMarkers(): void {
    // Accéder aux quest markers depuis MapController
    // Note: Cette partie dépend de l'implémentation de MapController
    // Vous devrez peut-être exposer une méthode publique dans MapController
    // pour obtenir la liste des quest markers
    
    const mapControllerAny = this.mapController as any;
    
    if (mapControllerAny.questMarkers) {
      print("Found quest markers array, linking...");
      
      // Parcourir tous les quest markers
      const questMarkers = mapControllerAny.questMarkers;
      for (let i = 0; i < questMarkers.length; i++) {
        const questMarker = questMarkers[i];
        if (questMarker && questMarker.mapPin) {
          this.mapComponent.linkQuestMarkerToPlace(
            questMarker.mapPin,
            questMarker
          );
        }
      }
      
      print("Quest markers linked to places!");
    } else {
      print("WARNING: Could not find quest markers in MapController");
      print("You may need to expose questMarkers publicly in MapController");
    }
  }

  /**
   * Appeler cette méthode manuellement si vous créez un quest marker
   * dynamiquement après le chargement initial
   */
  public linkQuestMarker(pin: MapPin, questMarker: any): void {
    this.mapComponent.linkQuestMarkerToPlace(pin, questMarker);
  }
}