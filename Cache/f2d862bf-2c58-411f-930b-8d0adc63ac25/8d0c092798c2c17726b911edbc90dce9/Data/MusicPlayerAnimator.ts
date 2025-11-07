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
  @hint("PinchButton (avec Interactable)")
  private pinchButton: SceneObject;

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
    if (!this.pinchButton) {
      log.e("pinchButton non assigné !");
      return;
    }

    const transform = this.targetObject.getTransform();
    this.originalZ = transform.getLocalPosition().z;

    // === RÉCUPÉRER LE PinchButton SCRIPT ===
    const pinchScript = this.pinchButton.getComponent("PinchButton");
    if (!pinchScript) {
      log.e("PinchButton script non trouvé sur le bouton !");
      return;
    }

    // === ÉCOUTER L'ÉVÉNEMENT onButtonPinched ===
    pinchScript.onButtonPinched.add(() => {
      log.i("PinchButton pressé → toggle");
      this.toggle();
    });

    log.i(`Prêt | Z initial: ${this.originalZ} | Recul: ${this.recedeDistance}`);
  }

  private toggle(): void {
    log.i(`TOGGLE → ${this.isReceded ? "restaure" : "recule"}`);

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