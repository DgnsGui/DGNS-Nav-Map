import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[MusicPlayerAnimator]";
const log = new NativeLogger(TAG);

@component
export class MusicPlayerAnimator extends BaseScriptComponent {
  @input
  @hint("SceneObject du MusicPlayer")
  private musicObject: SceneObject;

  @input
  @hint("Z local visible (ex: 0.0)")
  private visibleZ: number = 0.0;

  @input
  @hint("Z local reculé (ex: -0.5)")
  private hiddenZ: number = -0.5;

  @input
  @hint("Durée animation (s)")
  private animationDuration: number = 0.3;

  @input
  @hint("Logs détaillés")
  private enableDebugLogs: boolean = true;

  private musicTransform: Transform;
  private isReceded: boolean = false;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      global.behaviorSystem.addCustomTrigger("FORCE_INIT_MUSIC_ANIMATOR");
      this.initialize();
    });
  }

  private initialize(): void {
    print("[MusicPlayerAnimator] INITIALIZATION STARTED");

    if (!this.musicObject) {
      print("[ERROR] Music Object NOT ASSIGNED!");
      return;
    }

    this.musicTransform = this.musicObject.getTransform();

    // FORCER TOUT À ÊTRE VISIBLE
    this.musicObject.enabled = true;
    let parent = this.musicObject.getParent();
    while (parent) {
      parent.enabled = true;
      parent = parent.getParent();
    }

    // Position locale Z = visibleZ
    const localPos = this.musicTransform.getLocalPosition();
    localPos.z = this.visibleZ;
    this.musicTransform.setLocalPosition(localPos);

    this.isReceded = false;

    print(`[MusicPlayerAnimator] FORCED VISIBLE at local Z = ${this.visibleZ}`);
    print(`[MusicPlayerAnimator] Target hidden Z = ${this.hiddenZ}`);
    print("[MusicPlayerAnimator] INITIALIZATION DONE");
  }

  public toggle(): void {
    print(`[MusicPlayerAnimator] TOGGLE CALLED → isReceded: ${this.isReceded}`);

    if (this.isAnimating) {
      print("[MusicPlayerAnimator] Animating, ignoring toggle");
      return;
    }

    if (this.isReceded) {
      this.restore();
    } else {
      this.recede();
    }
  }

  private recede(): void {
    if (this.isReceded || this.isAnimating) return;

    print("[MusicPlayerAnimator] RECEDING...");
    this.isAnimating = true;
    this.isReceded = true;

    const startPos = this.musicTransform.getLocalPosition();

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const pos = startPos.clone();
        pos.z = MathUtils.lerp(startPos.z, this.hiddenZ, t);
        this.musicTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        print("[MusicPlayerAnimator] RECEDING DONE");
      }
    });
  }

  private restore(): void {
    if (!this.isReceded || this.isAnimating) return;

    print("[MusicPlayerAnimator] RESTORING...");
    this.isAnimating = true;
    this.isReceded = false;

    const startPos = this.musicTransform.getLocalPosition();

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const pos = startPos.clone();
        pos.z = MathUtils.lerp(startPos.z, this.visibleZ, t);
        this.musicTransform.setLocalPosition(pos);
      },
      ended: () => {
        this.isAnimating = false;
        this.currentAnimation = null;
        print("[MusicPlayerAnimator] RESTORING DONE");
      }
    });
  }

  public getIsReceded(): boolean { return this.isReceded; }
}