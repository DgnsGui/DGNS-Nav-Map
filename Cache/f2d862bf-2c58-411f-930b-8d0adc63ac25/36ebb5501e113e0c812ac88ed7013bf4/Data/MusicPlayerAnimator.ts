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
  @hint("Main : 0 = Droite, 1 = Gauche")
  private handIndex: number = 0;

  @input
  @hint("Spectacles Interaction Kit (glisse ici)")
  private sikScript: ScriptComponent;

  private isReceded: boolean = false;
  private originalZ: number = 0;

  onAwake() {
    if (!this.targetObject) {
      log.e("targetObject non assigné !");
      return;
    }
    if (!this.sikScript) {
      log.e("SIK Script non assigné ! Glisse le SIK dans l'input.");
      return;
    }

    const transform = this.targetObject.getTransform();
    this.originalZ = transform.getLocalPosition().z;

    // === RÉCUPÉRER LE SIK ===
    const sik = this.sikScript.api;
    if (!sik) {
      log.e("SIK API non disponible. Vérifie le SIK.");
      return;
    }

    const hand = this.handIndex === 0 ? sik.rightHand : sik.leftHand;
    if (!hand) {
      log.e("Main non trouvée. Vérifie handIndex.");
      return;
    }

    // === PINCH ===
    if (hand.onPinch) {
      hand.onPinch.add(() => {
        log.i("Pinch → toggle");
        this.toggle();
      });
    }

    // === TAP ===
    if (hand.onTap) {
      hand.onTap.add(() => {
        log.i("Tap → toggle");
        this.toggle();
      });
    }

    log.i(`Prêt | Z: ${this.originalZ} | Recul: ${this.recedeDistance}`);
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
        log.i(`Animation finie → Z = ${targetZ}`);
      }
    });
  }
}