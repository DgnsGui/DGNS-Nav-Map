import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";

@component
export class MapMessageController extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent;
  
  @input
  private frame: Frame;
  
  @input
  private textComponent: Text;
  
  @input
  private renderOrder: number;

  private unsubscribes: (() => void)[] = [];

  onAwake() {
    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
  }

  onStart() {
    // Configure frame render order
    this.frame.renderOrder = this.renderOrder;
    
    // Subscribe to close button events
    if (this.frame.closeButton) {
      this.unsubscribes.push(
        this.frame.closeButton.onTriggerUp.add(() => this.handleCloseButtonTriggered())
      );
    }
    
    // Subscribe to map component events
    this.mapComponent.subscribeOnNoNearbyPlacesFound(() =>
      this.showMessage("No nearby places found")
    );

    this.mapComponent.subscribeOnNearbyPlacesFailed(() =>
      this.showMessage(
        "Failed to received nearby places. Please check your internet connection."
      )
    );

    // Initially hide the frame
    this.handleCloseButtonTriggered();
  }

  /**
   * Display a message in the frame
   * @param message - The message text to display
   */
  showMessage(message: string) {
    // Enable the frame's scene object
    this.frame.sceneObject.enabled = true;
    
    // Show the frame visuals
    this.frame.showVisual();
    
    // Set the message text
    this.textComponent.text = message;
  }

  /**
   * Handle close button triggered event
   */
  private handleCloseButtonTriggered() {
    // Hide the frame visuals
    this.frame.hideVisual();
    
    // Clear the text
    this.textComponent.text = "";
    
    // Optionally disable the scene object after hide animation completes
    // Use onHideVisual event to ensure animation finishes first
    const hideComplete = this.frame.onHideVisual.add(() => {
      this.frame.sceneObject.enabled = false;
      hideComplete(); // Unsubscribe after first call
    });
  }

  /**
   * Cleanup subscriptions on destroy
   */
  onDestroy() {
    this.unsubscribes.forEach(unsubscribe => unsubscribe());
    this.unsubscribes = [];
  }
}