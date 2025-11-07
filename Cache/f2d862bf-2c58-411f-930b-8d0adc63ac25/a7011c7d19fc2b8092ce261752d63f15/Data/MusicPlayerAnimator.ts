// ZToggleAnimator.ts
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

// Import TouchGestures
const TouchGestures = require("TouchGestures");

const log = new NativeLogger("[ZToggleAnimator]");

@component
export class ZToggleAnimator extends BaseScriptComponent {
  @input
  @hint("Objet à animer (ex: MusicPlayer)")
  private targetObject: SceneObject;

  @input
  @hint("Distance de recul sur Z (ex: -0.5)")
  private recedeDistance: number = -0.5;

  @input
  @hint("Durée animation (secondes)")
  private duration: number = 0.3;

  private isReceded: boolean = false;
  private originalZ: number = 0;

  onAwake() {
    if (!this.targetObject) {
      log.e("targetObject non assigné !");
      return;
    }

    const transform = this.targetObject.getTransform();
    this.originalZ = transform.getLocalPosition().z;

    // === GESTE DE PINCH (prioritaire) ===
    const pinchSub = TouchGestures.onPinch().subscribe(() => {
      log.i("Pinch détecté → toggle");
      this.toggle();
    });

    // === Sinon, TAP GESTURE ===
    const tapSub = TouchGestures.onTap().subscribe(() => {
      log.i("Tap détecté → toggle");
      this.toggle();
    });

    // Nettoyage à la destruction
    this.createEvent("OnDestroyEvent").bind(() => {
      pinchSub.unsubscribe();
      tapSub.unsubscribe();
    });

    log.i(`Prêt | Z initial: ${this.originalZ} | Recul: ${this.recedeDistance}`);
  }

  private toggle(): void {
    log.i(`TOGGLE → reculé: ${this.isReceded}`);

    const transform = this.targetObject.getTransform();
    const startPos = transform.getLocalPosition();
    const targetZ = this.isReceded ? this.originalZ : this.originalZ + this.recedeDistance;

    this.isReceded = !this.isReceded;

    animate({
      duration: this.duration,
      update: (t: number) => {
        const z = MathUtils.lerp(startPos.z, targetZ, t);
        const pos = new vec3(startPos.x, startPos.y, z); // Pas de .clone()
        transform.setLocalPosition(pos);
      },
      ended: () => {
        log.i(`Animation terminée → Z = ${targetZ}`);
      }
    });
  }
}