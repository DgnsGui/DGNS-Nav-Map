import { MapComponent } from "./MapComponent";
import { MapController } from "./MapController";
import { MapPin } from "./MapPin";

@component
export class PlacesQuestMarkerLinker extends BaseScriptComponent {
  @input
  mapComponent: MapComponent;

  private mapController: MapController;
  private linkingAttempts: number = 0;
  private maxAttempts: number = 5;

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    print("=== PlacesQuestMarkerLinker START ===");
    
    if (!this.mapComponent) {
      print("ERROR: MapComponent not assigned!");
      return;
    }

    this.mapController = this.mapComponent.mapController;

    if (!this.mapController) {
      print("ERROR: MapController not found!");
      return;
    }

    print("MapController found, setting up...");
    this.setupQuestMarkerLinking();
  }

  private setupQuestMarkerLinking(): void {
    this.attemptLinking();
  }
  
  private attemptLinking(): void {
    this.linkingAttempts++;
    print(`Attempt ${this.linkingAttempts}/${this.maxAttempts}...`);
    
    const linked = this.linkExistingQuestMarkers();
    
    if (!linked && this.linkingAttempts < this.maxAttempts) {
      const delayEvent = this.createEvent("DelayedCallbackEvent");
      delayEvent.bind(() => {
        this.attemptLinking();
      });
      delayEvent.reset(1.0);
    } else if (linked) {
      print("Quest markers linked!");
    } else {
      print("Failed after " + this.maxAttempts + " attempts");
    }
  }

  private linkExistingQuestMarkers(): boolean {
    const mapControllerAny = this.mapController as any;
    
    print("Checking for quest markers...");
    
    if (mapControllerAny.questMarkers && mapControllerAny.questMarkers.length > 0) {
      print("Found " + mapControllerAny.questMarkers.length + " quest markers!");
      
      const questMarkers = mapControllerAny.questMarkers;
      let linkedCount = 0;
      
      for (let i = 0; i < questMarkers.length; i++) {
        const questMarker = questMarkers[i];
        
        if (questMarker && questMarker.mapPin) {
          print("Linking marker " + i);
          this.mapComponent.linkQuestMarkerToPlace(
            questMarker.mapPin,
            questMarker
          );
          linkedCount++;
        }
      }
      
      print("Linked " + linkedCount + " quest markers");
      return linkedCount > 0;
      
    } else {
      print("No quest markers found yet");
      return false;
    }
  }

  public linkQuestMarker(pin: MapPin, questMarker: any): void {
    this.mapComponent.linkQuestMarkerToPlace(pin, questMarker);
  }
}