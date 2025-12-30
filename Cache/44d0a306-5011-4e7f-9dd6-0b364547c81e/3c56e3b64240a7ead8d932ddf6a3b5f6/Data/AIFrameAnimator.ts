import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { PlacesResponseAnimator } from "./PlacesClamAnimator";

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (le deuxième ovale)")
  private responseContainer: SceneObject;

  @input
  @hint("Position Y quand l'ovale est caché")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = false;

  @input
  @hint("Référence directe vers le PlacesResponseAnimator (nouveau script dédié)")
  placesResponseAnimator: ScriptComponent;

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;

  private placesAnimator: PlacesResponseAnimator;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== AIResponseAnimator INITIALIZATION ===");

    if (!this.responseContainer) {
      log.e("Response container not assigned!");
      return;
    }

    if (!this.placesResponseAnimator) {
      log.e("PlacesResponseAnimator not assigned in inspector!");
      return;
    }

    this.placesAnimator = this.placesResponseAnimator as unknown as PlacesResponseAnimator;

    this.responseTransform = this.responseContainer.getTransform();
    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);

    this.responseContainer.enabled = false;
    this.isVisible = false;

    if (this.enableDebugLogs) log.i("Container initialized in hidden state.");
  }

  private performAnimateIn(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.isAnimating = true;
    this.isVisible = true;
    this.responseContainer.enabled = true;

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
      }
    });
  }

  public animateIn(): void {
    if (this.isVisible && !this.isAnimating) return;

    if (this.isAnimating && this.currentAnimation) {
      this.currentAnimation();
    }

    // Si Places est visible, on demande au PlacesAnimator de se décaler vers le haut
    if (this.placesAnimator && this.placesAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(true);
    }

    this.performAnimateIn();
  }

  public animateOut(): void {
    if (!this.isVisible && !this.isAnimating) return;

    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

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
        this.responseContainer.enabled = false;
        this.currentAnimation = null;
      }
    });

    // Places redescend en même temps que AI descend
    if (this.placesAnimator && this.placesAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(false);
    }
  }

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
    this.responseContainer.enabled = true;

    if (this.placesAnimator && this.placesAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(true);
    }
  }

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
    this.responseContainer.enabled = false;

    if (this.placesAnimator && this.placesAnimator.getIsVisible()) {
      this.placesAnimator.adjustForAI(false);
    }
  }

  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }
}