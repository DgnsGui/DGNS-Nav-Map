import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
// import { AIMapAssistant } from "./MapComponent/Scripts/AIMapAssistant"; // Plus besoin d'importer AIMapAssistant ici pour l'écoute
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (le deuxième ovale)")
  private responseContainer: SceneObject;

  // @input
  // @hint("Le script AIMapAssistant pour écouter les événements")
  // private aiAssistant: AIMapAssistant; // <-- CET INPUT N'EST PLUS NÉCESSAIRE POUR L'ÉCOUTE DANS CE SENS

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
  }

  // Supprimez la méthode startMonitoring car nous n'écoutons plus via UpdateEvent

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