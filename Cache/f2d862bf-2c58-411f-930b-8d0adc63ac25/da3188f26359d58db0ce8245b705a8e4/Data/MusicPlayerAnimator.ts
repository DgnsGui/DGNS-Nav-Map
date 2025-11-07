import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[MusicPlayerAnimator]";
const log = new NativeLogger(TAG);

@component
export class MusicPlayerAnimator extends BaseScriptComponent {
  @input
  @hint("Le container du panneau musique (ex: ovale avec boutons play/pause)")
  private musicContainer: SceneObject;

  @input
  @hint("Position Y cachée (en bas)")
  private hiddenPositionY: number = -15;

  @input
  @hint("Position Y visible (au-dessus)")
  private visiblePositionY: number = 0;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.4;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.initialize());
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== MusicPlayerAnimator INITIALIZATION ===");

    if (!this.musicContainer) {
      log.e("Music container not assigned!");
      return;
    }

    this.responseTransform = this.musicContainer.getTransform();

    // Position initiale cachée
    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);

    this.musicContainer.enabled = false;
    this.isVisible = false;

    if (this.enableDebugLogs) log.i("Music container initialized in hidden state.");
    if (this.enableDebugLogs) log.i("=== MusicPlayerAnimator initialized successfully ===");
  }

  /**
   * Affiche le panneau musique
   */
  public show(): void {
    if (this.isVisible && !this.isAnimating) {
      if (this.enableDebugLogs) log.i("Music panel already visible, skipping show.");
      return;
    }

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    if (this.enableDebugLogs) log.i("Showing music panel");
    this.isAnimating = true;
    this.isVisible = true;
    this.musicContainer.enabled = true;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = this.responseTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.hiddenPositionY, this.visiblePositionY, t);
        this.responseTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Music panel shown");
      }
    });
  }

  /**
   * Cache le panneau musique
   */
  public hide(): void {
    if (!this.isVisible && !this.isAnimating && !this.musicContainer.enabled) {
      if (this.enableDebugLogs) log.i("Music panel already hidden, skipping hide.");
      return;
    }

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    if (this.enableDebugLogs) log.i("Hiding music panel");
    this.isAnimating = true;

    const startY = this.responseTransform.getLocalPosition().y;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.responseTransform.getLocalPosition();
        pos.y = MathUtils.lerp(startY, this.hiddenPositionY, t);
        this.responseTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.isVisible = false;
        this.musicContainer.enabled = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Music panel hidden");
      }
    });
  }

  /**
   * Bascule entre show/hide
   */
  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * État visible ?
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Animation en cours ?
   */
  public getIsAnimating(): boolean {
    return this.isAnimating;
  }
}