// ZToggleAnimator.ts
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate";

const log = new NativeLogger("[ZToggleAnimator]");

@component
export class ZToggleAnimator extends BaseScriptComponent {
  @input
  @hint("Objet à animer (ex: MusicPlayer)")
  private targetObject: SceneObject;

  @input
  @hint("Bouton avec Pinch/Tap")
  private triggerButton: SceneObject;

  @input
  @hint("Distance de recul sur Z (ex: -0.5)")
  private recedeDistance: number = -0.5;

  @input
  @hint("Durée animation (secondes)")
  private duration: number = 0.3;

  private isReceded: boolean = false;
  private originalZ: number = 0;

  onAwake() {
    if (!this.targetObject || !this.triggerButton) {
      log.e("targetObject ou triggerButton non assigné !");
      return;
    }

    const transform = this.targetObject.getTransform();
    this.originalZ = transform.getLocalPosition().z;

    // === GESTE DE PINCH (prioritaire) ===
    const pinch = this.triggerButton.getComponent("PinchGesture");
    if (pinch) {
      pinch.onPinch.add(() => this.toggle());
      log.i("PinchGesture détecté et attaché");
    } 
    // === Sinon, TAP GESTURE ===
    else {
      const tap = this.triggerButton.getComponent("TapGesture");
      if (tap) {
        tap.onTap.add(() => this.toggle());
        log.i("TapGesture détecté et attaché");
      } else {
        log.w("Aucun geste trouvé sur le bouton. Ajoute un Pinch ou Tap Gesture.");
      }
    }

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
        const pos = startPos.clone();
        pos.z = z;
        transform.setLocalPosition(pos);
      },
      ended: () => {
        log.i(`Animation terminée → Z = ${targetZ}`);
      }
    });
  }
}