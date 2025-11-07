import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { AIMapAssistant } from "MapComponent/Scripts/AIMapAssistant";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (le deuxième ovale)")
  private responseContainer: SceneObject;

  @input
  @hint("Le script AIMapAssistant pour écouter les événements")
  private aiAssistant: AIMapAssistant;

  @input
  @hint("Position Y quand l'ovale est caché (à l'intérieur)")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible (au-dessus)")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Type d'easing pour l'animation")
  private easingType:
    | "ease-out-back"
    | "linear"
    | "ease-in-sine"
    | "ease-out-sine"
    | "ease-in-out-sine"
    | "ease-in-quad"
    | "ease-out-quad"
    | "ease-in-out-quad"
    | "ease-in-cubic"
    | "ease-out-cubic"
    | "ease-in-out-cubic"
    | "ease-in-quart"
    | "ease-out-quart"
    | "ease-in-out-quart"
    | "ease-in-quint"
    | "ease-out-quint"
    | "ease-in-out-quint"
    | "ease-in-expo"
    | "ease-out-expo"
    | "ease-in-out-expo"
    | "ease-in-circ"
    | "ease-out-circ"
    | "ease-in-out-circ"
    | "ease-in-back"
    | "ease-out-back"
    | "ease-in-out-back"
    | "ease-in-back-cubic"
    | "ease-out-back-cubic"
    | "ease-in-out-back-cubic"
    = "ease-out-back";

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;

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
    this.responseContainer.enabled = false;

    // Listen to when AI starts processing
    if (this.aiAssistant) {
      this.startMonitoring();
    } else {
      log.w("AI Assistant not assigned, animations won't trigger automatically");
    }

    log.i("Initial position set to hidden");
  }

  private startMonitoring(): void {
    // Check periodically if the response container should be shown or hidden
    const updateEvent = this.createEvent("UpdateEvent");
    updateEvent.bind(() => {
      const shouldBeVisible = this.responseContainer.enabled;

      if (shouldBeVisible && !this.isVisible && !this.isAnimating) {
        log.i("Response container enabled - animating IN");
        this.animateIn();
      } else if (!shouldBeVisible && this.isVisible && !this.isAnimating) {
        log.i("Response container disabled - animating OUT");
        this.animateOut();
      }
    });
  }

  /**
   * Animate the response container sliding in (upward)
   */
  public animateIn(): void {
    if (this.isAnimating) {
      log.w("Already animating, cancelling...");
      if (this.currentAnimation) {
        this.currentAnimation();
      }
    }

    log.i("🎬 Starting slide IN animation");
    this.isAnimating = true;
    this.isVisible = true;

    const startPos = this.responseTransform.getLocalPosition();
    const targetY = this.visiblePositionY;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: this.easingType,
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
   */
  public animateOut(): void {
    if (this.isAnimating) {
      log.w("Already animating, cancelling...");
      if (this.currentAnimation) {
        this.currentAnimation();
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