import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[MusicPlayerAnimator]";
const log = new NativeLogger(TAG);

@component
export class MusicPlayerAnimator extends BaseScriptComponent {
  @input
  @hint("Le SceneObject du lecteur musique (ex: MusicPlayer)")
  private musicObject: SceneObject;

  @input
  @hint("Position Z visible (ex: 0.0)")
  private visibleZ: number = 0.0;

  @input
  @hint("Position Z reculé (ex: -0.5)")
  private hiddenZ: number = -0.5;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.3;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private musicTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isReceded: boolean = false;

  // Position Z de départ (sauvegardée)
  private initialZ: number = 0.0;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.initialize());
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== MusicPlayerAnimator INITIALIZATION ===");

    if (!this.musicObject) {
      log.e("Music Object not assigned!");
      return;
    }

    this.musicTransform = this.musicObject.getTransform();

    // Forcer l'objet à être visible
    this.musicObject.enabled = true;

    // Récupérer la position Z actuelle (monde)
    const worldPos = this.musicTransform.getWorldPosition();
    this.initialZ = worldPos.z;

    // Appliquer la position visible
    this.setZPosition(this.visibleZ);
    this.isReceded = false;

    if (this.enableDebugLogs) {
      log.i(`MusicPlayer forced enabled`);
      log.i(`Initial Z: ${this.initialZ} → Using visibleZ: ${this.visibleZ}`);
      log.i(`Target hidden Z: ${this.hiddenZ}`);
      log.i("=== MusicPlayerAnimator initialized successfully ===");
    }
  }

  public recede(): void {
    if (this.isReceded || this.isAnimating) return;

    if (this.currentAnimation) this.currentAnimation();

    if (this.enableDebugLogs) log.i("Receding MusicPlayer...");
    this.isAnimating = true;
    this.isReceded = true;

    const startZ = this.getCurrentZ();

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        this.setZPosition(MathUtils.lerp(startZ, this.hiddenZ, t));
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("MusicPlayer receded");
      }
    });
  }

  public restore(): void {
    if (!this.isReceded || this.isAnimating) return;

    if (this.currentAnimation) this.currentAnimation();

    if (this.enableDebugLogs) log.i("Restoring MusicPlayer...");
    this.isAnimating = true;
    this.isReceded = false;

    const startZ = this.getCurrentZ();

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        this.setZPosition(MathUtils.lerp(startZ, this.visibleZ, t));
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("MusicPlayer restored");
      }
    });
  }

  public toggle(): void {
    if (this.enableDebugLogs) log.i("TOGGLE CALLED");
    if (this.isReceded) {
      this.restore();
    } else {
      this.recede();
    }
  }

  private getCurrentZ(): number {
    return this.musicTransform.getWorldPosition().z;
  }

  private setZPosition(z: number): void {
    const pos = this.musicTransform.getWorldPosition();
    pos.z = z;
    this.musicTransform.setWorldPosition(pos);
  }

  public getIsReceded(): boolean { return this.isReceded; }
}