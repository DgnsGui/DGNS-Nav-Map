// --- START OF FILE AIFrameAnimator.ts ---

import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
// Import the Frame component from its path within SpectaclesUIKit
import { Frame } from "SpectaclesUIKit.lspkg/Components/Frame/Frame"; // Adjust this path if SpectaclesUIKit is elsewhere

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (le deuxième ovale)")
  private responseContainer: SceneObject;

  @input
  @allowUndefined
  @hint("Le composant Frame du container de réponse AI pour gérer le bouton de fermeture.")
  private responseFrameComponent: Frame; // NEW INPUT: Reference to the Frame component

  @input
  @hint("Position Y quand l'ovale est caché (à l'intérieur)")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible (au-dessus)")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false; // Suivi de l'état de visibilité de l'animateur

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    log.i("AIResponseAnimator initialized");

    if (!this.responseContainer) {
      log.e("Response container not assigned!");
      return;
    }

    this.responseTransform = this.responseContainer.getTransform();

    // Set initial position (hidden)
    const initialPos = this.responseTransform.getLocalPosition();
    initialPos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(initialPos);

    // Hide the container initially
    this.responseContainer.enabled = false; // S'assurer qu'il est désactivé au début
    this.isVisible = false; // Confirmer l'état initial

    log.i("Initial position set to hidden, container disabled.");

    // NEW LOGIC: Bind the close button event from the Frame component
    if (this.responseFrameComponent) {
      // Ensure the Frame component is ready and has its buttons initialized
      // We might need to wait for Frame to initialize if it's not ready immediately
      // For now, we'll try to bind directly. If it fails, we might need a small delay or a different event.
      if (this.responseFrameComponent.closeButton) {
        this.responseFrameComponent.closeButton.onTriggerUp.add(() => {
          log.i("AI Response Frame X button tapped via AIResponseAnimator!");
          this.animateOut(); // Call animateOut directly or through AIMapAssistant's hideResponse
        });
        log.i("Close button event bound successfully on responseFrameComponent.");
      } else {
        log.w("responseFrameComponent found, but its closeButton is not yet available. Retrying or assuming late init.");
        // A more robust solution might involve waiting for Frame's internal initialization event
        // or checking in Update if the button becomes available. For this context, we'll proceed.
      }
    } else {
      log.w("responseFrameComponent is not assigned. Close button functionality will not be available through Frame component.");
    }
  }

  // ... rest of your AIResponseAnimator code ...

  /**
   * Animate the response container sliding in (upward)
   * Cette méthode est appelée par AIMapAssistant
   */
  public animateIn(): void {
    if (this.isVisible && !this.isAnimating) {
        log.i("Container already visible and not animating, skipping animateIn.");
        return;
    }

    if (this.isAnimating) {
      log.w("Already animating, cancelling previous animation for animateIn...");
      if (this.currentAnimation) {
        this.currentAnimation(); // Arrête l'animation précédente
      }
    }

    log.i("🎬 Starting slide IN animation");
    this.isAnimating = true;
    this.isVisible = true;
    this.responseContainer.enabled = true; // Active le container avant l'animation

    const startPos = this.responseTransform.getLocalPosition();
    const targetY = this.visiblePositionY;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const currentPos = this.responseTransform.getLocalPosition();
        currentPos.y = MathUtils.lerp(this.hiddenPositionY, targetY, t);
        this.responseTransform.setLocalPosition(currentPos);
      },
      ended: () => {
        log.i("✅ Slide IN animation complete");
        this.isAnimating = false;
        this.currentAnimation = null;
      }
    });
  }

  /**
   * Animate the response container sliding out (downward)
   * Cette méthode est appelée par AIMapAssistant
   */
  public animateOut(): void {
    if (!this.isVisible && !this.isAnimating) {
        log.i("Container already hidden and not animating, skipping animateOut.");
        return;
    }

    if (this.isAnimating) {
      log.w("Already animating, cancelling previous animation for animateOut...");
      if (this.currentAnimation) {
        this.currentAnimation(); // Arrête l'animation précédente
      }
    }

    log.i("🎬 Starting slide OUT animation");
    this.isAnimating = true;

    const startPos = this.responseTransform.getLocalPosition();
    const targetY = this.hiddenPositionY;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const currentPos = this.responseTransform.getLocalPosition();
        currentPos.y = MathUtils.lerp(startPos.y, targetY, t);
        this.responseTransform.setLocalPosition(currentPos);
      },
      ended: () => {
        log.i("✅ Slide OUT animation complete");
        this.isAnimating = false;
        this.isVisible = false;
        this.responseContainer.enabled = false; // Désactive le container après l'animation
        this.currentAnimation = null;
      }
    });
  }

  /**
   * Force show the response (instant, no animation)
   */
  public showImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.visiblePositionY;
    this.responseTransform.setLocalPosition(pos);
    this.isVisible = true;
    this.isAnimating = false;
    this.responseContainer.enabled = true; // Assurez-vous qu'il est activé

    log.i("Response shown immediately");
  }

  /**
   * Force hide the response (instant, no animation)
   */
  public hideImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);
    this.isVisible = false;
    this.isAnimating = false;
    this.responseContainer.enabled = false; // Assurez-vous qu'il est désactivé

    log.i("Response hidden immediately");
  }

  /**
   * Check if currently animating
   */
  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  /**
   * Check if currently visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }
}