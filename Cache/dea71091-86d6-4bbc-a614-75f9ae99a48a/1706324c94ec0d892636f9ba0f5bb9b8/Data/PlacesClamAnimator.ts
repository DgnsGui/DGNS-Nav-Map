import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { AIResponseAnimator } from "./AIFrameAnimator";

const TAG = "[PlacesResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class PlacesResponseAnimator extends BaseScriptComponent {
  @input
  @hint("Le container du Places Clam (l'ovale avec la liste)")
  private placesClamContainer: SceneObject;

  @input
  @hint("Position Y quand le container est visible (valeur de base, sans AI)")
  private baseVisibleY: number = 15;

  @input
  @hint("Offset Y pour cacher le container")
  private hiddenOffset: number = -30;

  @input
  @hint("Durée de toutes les animations (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = false;

  @input
  @hint("Référence vers l'AIResponseAnimator pour synchronisation")
  aiResponseAnimator: ScriptComponent;

  private placesTransform: Transform;
  private currentAnimation: CancelFunction | null = null;
  private isAnimating: boolean = false;
  private isVisible: boolean = false;

  private baseHiddenY: number = 0;
  private currentVisibleY: number = 0;
  private currentHiddenY: number = 0;

  private aiAnimator: AIResponseAnimator;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== PlacesResponseAnimator INITIALIZATION ===");

    if (!this.placesClamContainer) {
      log.e("Places Clam container not assigned!");
      return;
    }

    this.aiAnimator = this.aiResponseAnimator as unknown as AIResponseAnimator;

    this.placesTransform = this.placesClamContainer.getTransform();

    this.currentVisibleY = this.baseVisibleY;
    this.baseHiddenY = this.baseVisibleY + this.hiddenOffset;
    this.currentHiddenY = this.baseHiddenY;

    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.currentHiddenY;
    this.placesTransform.setLocalPosition(pos);

    this.placesClamContainer.enabled = false;
    this.isVisible = false;

    if (this.enableDebugLogs) log.i("Places container initialized in hidden state.");
  }

  public animateIn(): void {
    if (this.isVisible && !this.isAnimating) return;

    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.isAnimating = true;
    this.isVisible = true;
    this.placesClamContainer.enabled = true;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = this.placesTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.currentHiddenY, this.currentVisibleY, t);
        this.placesTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
      }
    });
  }

  public animateOut(): void {
    if (!this.isVisible && !this.isAnimating) return;

    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.isAnimating = true;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = this.placesTransform.getLocalPosition();
        pos.y = MathUtils.lerp(this.currentVisibleY, this.currentHiddenY, t);
        this.placesTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.isVisible = false;
        this.placesClamContainer.enabled = false;
        this.currentAnimation = null;
      }
    });
  }

  // Appelé par AIResponseAnimator quand AI s'ouvre ou se ferme
  public adjustForAI(isAIVisible: boolean): void {
    const targetVisibleY = isAIVisible ? this.baseVisibleY * 2 : this.baseVisibleY;
    const targetHiddenY = targetVisibleY + this.hiddenOffset;

    if (targetVisibleY === this.currentVisibleY) {
      return;
    }

    this.currentVisibleY = targetVisibleY;
    this.currentHiddenY = targetHiddenY;

    if (this.isVisible) {
      if (this.currentAnimation) {
        this.currentAnimation();
        this.currentAnimation = null;
      }

      this.isAnimating = true;
      const startY = this.placesTransform.getLocalPosition().y;

      const easing = isAIVisible ? "ease-out-back" : "ease-in-quad";

      this.currentAnimation = animate({
        duration: this.animationDuration,
        easing: easing,
        update: (t: number) => {
          const pos = this.placesTransform.getLocalPosition();
          pos.y = MathUtils.lerp(startY, this.currentVisibleY, t);
          this.placesTransform.setLocalPosition(pos);
        },
        ended: () => {
          this.isAnimating = false;
          this.currentAnimation = null;
        }
      });
    }
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  public showImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
    }

    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.currentVisibleY;
    this.placesTransform.setLocalPosition(pos);

    this.isVisible = true;
    this.isAnimating = false;
    this.placesClamContainer.enabled = true;
  }

  public hideImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
    }

    const pos = this.placesTransform.getLocalPosition();
    pos.y = this.currentHiddenY;
    this.placesTransform.setLocalPosition(pos);

    this.isVisible = false;
    this.isAnimating = false;
    this.placesClamContainer.enabled = false;
  }
}