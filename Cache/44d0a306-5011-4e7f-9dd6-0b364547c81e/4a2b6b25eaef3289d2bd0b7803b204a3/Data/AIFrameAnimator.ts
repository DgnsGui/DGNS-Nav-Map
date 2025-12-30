import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";
import { MapComponent } from "./MapComponent/Scripts/MapComponent";

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
  @hint("Référence vers le MapComponent pour gérer le décalage du Places Clam")
  mapComponent: ScriptComponent;

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;

  private mapComp: MapComponent;

  // Garde pour éviter un double appel à animateIn pendant le décalage de Places
  private pendingAnimateIn: boolean = false;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    this.mapComp = this.mapComponent as unknown as MapComponent;

    if (this.enableDebugLogs) log.i("=== AIResponseAnimator INITIALIZATION ===");

    if (!this.responseContainer) {
      log.e("Response container not assigned!");
      return;
    }

    if (!this.mapComp) {
      log.e("MapComponent not assigned in inspector!");
      return;
    }

    this.responseTransform = this.responseContainer.getTransform();
    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);

    this.responseContainer.enabled = false;
    this.isVisible = false;
    this.pendingAnimateIn = false;

    if (this.enableDebugLogs) log.i("Container initialized in hidden state.");
  }

  private performAnimateIn(): void {
    // Sécurité : si une animation est en cours, on l'annule proprement
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
        this.pendingAnimateIn = false;
      }
    });
  }

  public animateIn(): void {
    // Si déjà visible et pas en animation → rien à faire
    if (this.isVisible && !this.isAnimating) {
      return;
    }

    // Si on est déjà en train d'animer ou en attente → on évite le double appel
    if (this.isAnimating || this.pendingAnimateIn) {
      return;
    }

    if (this.mapComp.isPlacesClamVisible) {
      // Places est ouvert → on décale Places d'abord
      this.pendingAnimateIn = true;
      this.mapComp.adjustPlacesForAI(true, () => {
        if (this.pendingAnimateIn) {
          this.performAnimateIn();
        }
      });
    } else {
      // Places fermé → on anime AI directement
      this.performAnimateIn();
    }
  }

  public animateOut(): void {
    if (!this.isVisible && !this.isAnimating) return;

    // Annulation propre de toute animation en cours
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.pendingAnimateIn = false;

    // On remet Places à sa position normale si besoin
    if (this.mapComp.isPlacesClamVisible) {
      this.mapComp.adjustPlacesForAI(false);
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
  }

  public showImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.pendingAnimateIn = false;

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.visiblePositionY;
    this.responseTransform.setLocalPosition(pos);

    this.isVisible = true;
    this.isAnimating = false;
    this.responseContainer.enabled = true;

    if (this.mapComp.isPlacesClamVisible) {
      this.mapComp.adjustPlacesForAI(true);
    }
  }

  public hideImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    this.pendingAnimateIn = false;

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);

    this.isVisible = false;
    this.isAnimating = false;
    this.responseContainer.enabled = false;

    if (this.mapComp.isPlacesClamVisible) {
      this.mapComp.adjustPlacesForAI(false);
    }
  }

  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }
}