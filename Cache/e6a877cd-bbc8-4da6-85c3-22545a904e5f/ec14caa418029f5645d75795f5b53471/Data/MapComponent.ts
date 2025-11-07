// Ajoutez ces modifications à votre MapComponent.ts

// Ajoutez ces propriétés privées dans la classe MapComponent
private autoRotationLocked: boolean = false;
private lastInteractionTime: number = 0;

// Modifiez ou ajoutez ces méthodes dans MapComponent

/**
 * Enhanced setMinimapAutoRotate with better state management
 */
setMinimapAutoRotate(enabled: boolean): void {
  console.log(`[MapComponent] Setting auto-rotate to: ${enabled}, currently locked: ${this.autoRotationLocked}`);
  
  // Don't allow changing auto-rotation if it's currently locked during interaction
  if (this.autoRotationLocked && enabled === false) {
    console.log("[MapComponent] Auto-rotation change blocked - currently locked during interaction");
    return;
  }
  
  this.isMinimapAutoRotate = enabled;
  if (this.mapController) {
    this.mapController.setMinimapAutoRotate(enabled);
  }
  
  console.log(`[MapComponent] Auto-rotate successfully set to: ${enabled}`);
}

/**
 * Lock auto-rotation during user interactions to prevent conflicts
 */
private lockAutoRotationDuringInteraction(): void {
  this.autoRotationLocked = true;
  this.lastInteractionTime = getTime();
  console.log("[MapComponent] Auto-rotation locked during interaction");
}

/**
 * Unlock auto-rotation after user interactions
 */
private unlockAutoRotation(): void {
  this.autoRotationLocked = false;
  console.log("[MapComponent] Auto-rotation unlocked");
}

/**
 * Check if enough time has passed since last interaction to safely unlock
 */
private checkAndUnlockAutoRotation(): void {
  const timeSinceLastInteraction = getTime() - this.lastInteractionTime;
  if (timeSinceLastInteraction > 0.5) { // 500ms buffer
    this.unlockAutoRotation();
  }
}

// Modifiez les méthodes de touch existantes pour gérer le verrouillage

/**
 * Enhanced startTouch with auto-rotation management
 */
startTouch(localPosition: vec2): void {
  console.log(`[MapComponent] Touch start at: (${localPosition.x.toFixed(3)}, ${localPosition.y.toFixed(3)})`);
  
  // Lock auto-rotation during touch
  this.lockAutoRotationDuringInteraction();
  
  // Call original touch handling
  if (this.mapController) {
    this.mapController.handleTouchStart(localPosition);
  }
}

/**
 * Enhanced updateTouch
 */
updateTouch(localPosition: vec2): void {
  // Update last interaction time
  this.lastInteractionTime = getTime();
  
  // Call original touch handling
  if (this.mapController) {
    this.mapController.handleTouchUpdate(localPosition);
  }
}

/**
 * Enhanced endTouch with auto-rotation management
 */
endTouch(localPosition: vec2): void {
  console.log(`[MapComponent] Touch end at: (${localPosition.x.toFixed(3)}, ${localPosition.y.toFixed(3)})`);
  
  // Call original touch handling
  if (this.mapController) {
    this.mapController.handleTouchEnd(localPosition);
  }
  
  // Schedule unlock of auto-rotation after a brief delay
  this.createEvent("DelayedCallbackEvent").bind(() => {
    this.checkAndUnlockAutoRotation();
  }).reset(0.2); // 200ms delay
}

/**
 * Enhanced zoom methods with interaction management
 */
zoomIn(): void {
  console.log("[MapComponent] Zoom in requested");
  this.lockAutoRotationDuringInteraction();
  
  if (this.mapController) {
    this.mapController.handleZoomIn();
  }
  
  this.createEvent("DelayedCallbackEvent").bind(() => {
    this.checkAndUnlockAutoRotation();
  }).reset(0.3);
}

zoomOut(): void {
  console.log("[MapComponent] Zoom out requested");
  this.lockAutoRotationDuringInteraction();
  
  if (this.mapController) {
    this.mapController.handleZoomOut();
  }
  
  this.createEvent("DelayedCallbackEvent").bind(() => {
    this.checkAndUnlockAutoRotation();
  }).reset(0.3);
}

/**
 * Get current auto-rotation lock state (for debugging)
 */
isAutoRotationLocked(): boolean {
  return this.autoRotationLocked;
}

/**
 * Force unlock auto-rotation (emergency method)
 */
forceUnlockAutoRotation(): void {
  console.log("[MapComponent] Force unlocking auto-rotation");
  this.autoRotationLocked = false;
}

// Ajoutez cette méthode pour améliorer le toggle auto-rotation
private handleAutoRotateToggle(event: InteractorEvent): void {
  // Toggle the auto-rotation state
  const newState = !this.isMinimapAutoRotate;
  console.log(`[MapComponent] Auto-rotate toggle: ${this.isMinimapAutoRotate} -> ${newState}`);
  
  // Force unlock if we're enabling auto-rotation
  if (newState && this.autoRotationLocked) {
    this.forceUnlockAutoRotation();
  }
  
  this.isMinimapAutoRotate = newState;
  
  // Update the map controller with the new auto-rotation setting
  if (this.mapController) {
    this.mapController.setMinimapAutoRotate(this.isMinimapAutoRotate);
  }
  
  console.log(`[MapComponent] Minimap auto-rotate toggled: ${this.isMinimapAutoRotate}`);
}