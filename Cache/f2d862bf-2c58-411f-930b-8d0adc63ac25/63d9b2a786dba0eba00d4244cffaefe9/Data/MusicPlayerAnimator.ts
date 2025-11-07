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
  @hint("Distance de recul sur Z (ex: -0.5)")
  private recedeDistance: number = -0.5;

  @input
  @hint("Durée animation (secondes)")
  private duration: number = 0.3;

  @input
  @hint("Main à utiliser : 0 = Droite, 1 = Gauche")
  private handIndex: number = 0; // 0 = right, 1 = left

  private isReceded: boolean = false;
  private originalZ: number = 0;

  onAwake() {
    if (!this.targetObject) {
      log.e("targetObject non assigné !");
      return;
    }

    const transform = this.targetObject.getTransform();
    this.originalZ = transform.getLocalPosition().z;

    // Accès au SIK
    const sik = global.spectaclesInteractionKit;
    if (!sik) {
      log.e("SIK non trouvé ! Ajoute le Spectacles Interaction Kit au projet.");
      return;
    }

    const hand = this.handIndex === 0 ? sik.rightHand : sik.leftHand;

    // === PINCH (prioritaire) ===
    if (hand.onPinch) {
      hand.onPinch.add(() => {
        log.i("Pinch détecté → toggle");
        this.toggle();
      });
      log.i("PinchGesture attaché à la main");
    }

    // === TAP (fallback) ===
    if (hand.onTap) {
      hand.onTap.add(() => {
        log.i("Tap détecté → toggle");
        this.toggle();
      });
      log.i("TapGesture attaché à la main");
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
        const pos = new vec3(startPos.x, startPos.y, z);
        transform.setLocalPosition(pos);
      },
      ended: () => {
        log.i(`Animation terminée → Z = ${targetZ}`);
      }
    });
  }
}