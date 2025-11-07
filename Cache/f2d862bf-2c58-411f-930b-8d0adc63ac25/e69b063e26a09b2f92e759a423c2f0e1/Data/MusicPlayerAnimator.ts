@component
export class ZToggleAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet à animer (ex: MusicPlayer)")
  private targetObject: SceneObject;

  @input
  @hint("Bouton avec Pinch Gesture (ou Tap Gesture)")
  private triggerButton: SceneObject;

  @input
  @hint("Distance de recul sur Z (ex: -0.5)")
  private recedeDistance: number = -0.5;

  @input
  @hint("Durée de l'animation (secondes)")
  private duration: number = 0.3;

  private isReceded: boolean = false;
  private originalZ: number = 0;

  onAwake() {
    if (!this.targetObject) {
      print("[ZToggleAnimator] ERREUR: targetObject non assigné");
      return;
    }
    if (!this.triggerButton) {
      print("[ZToggleAnimator] ERREUR: triggerButton non assigné");
      return;
    }

    // Sauvegarder la position Z locale initiale
    this.originalZ = this.targetObject.getTransform().getLocalPosition().z;

    // Créer le geste (Pinch ou Tap)
    const pinch = this.triggerButton.createComponent("Component.PinchGesture");
    if (pinch) {
      pinch.onPinch.add(() => this.toggle());
      print("[ZToggleAnimator] PinchGesture attaché");
    } else {
      const tap = this.triggerButton.createComponent("Component.TapGesture");
      tap.onTap.add(() => this.toggle());
      print("[ZToggleAnimator] TapGesture attaché (Pinch non supporté)");
    }

    print(`[ZToggleAnimator] Prêt | Z initial: ${this.originalZ} | Recul: ${this.recedeDistance}`);
  }

  private toggle(): void {
    print(`[ZToggleAnimator] TOGGLE → isReceded: ${this.isReceded}`);

    const transform = this.targetObject.getTransform();
    const startZ = transform.getLocalPosition().z;
    const targetZ = this.isReceded ? this.originalZ : this.originalZ + this.recedeDistance;

    this.isReceded = !this.isReceded;

    animate({
      duration: this.duration,
      update: (t) => {
        const z = MathUtils.lerp(startZ, targetZ, t);
        const pos = transform.getLocalPosition();
        pos.z = z;
        transform.setLocalPosition(pos);
      },
      ended: () => {
        print(`[ZToggleAnimator] Animation terminée → Z = ${targetZ}`);
      }
    });
  }
}