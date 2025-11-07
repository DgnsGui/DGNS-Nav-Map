import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import LSTween from "LensStudio:LSTween"

const TAG = "[ZTweenToggleMover]"
const log = new NativeLogger(TAG)

@component
export class ZTweenToggleMover extends BaseScriptComponent {
  @input
  @hint("Le PinchButton qui déclenche l'animation")
  private pinchButton: PinchButton

  @input
  @hint("Objet à déplacer sur l'axe Z")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement sur l'axe Z (positive = vers l'avant)")
  private moveDistance: number = 10.0

  @input
  @hint("Durée de l'animation (en secondes)")
  private animationDuration: number = 0.4

  @input
  @hint("Easing de l'animation")
  @widget("combobox", [
    "linear", "quadraticIn", "quadraticOut", "quadraticInOut",
    "cubicIn", "cubicOut", "cubicInOut",
    "quarticIn", "quarticOut", "quarticInOut",
    "quinticIn", "quinticOut", "quinticInOut",
    "sineIn", "sineOut", "sineInOut",
    "circularIn", "circularOut", "circularInOut",
    "exponentialIn", "exponentialOut", "exponentialInOut",
    "elasticIn", "elasticOut", "elasticInOut",
    "backIn", "backOut", "backInOut",
    "bounceIn", "bounceOut", "bounceInOut"
  ])
  private easing: string = "backOut"

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialZ: number = 0
  private targetZ: number = 0
  private isForward: boolean = false
  private currentTween: LSTween | null = null

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== ZTweenToggleMover INITIALIZATION ===")

    // Vérifications de sécurité
    if (!this.pinchButton) {
      log.e("PinchButton non assigné dans l'Inspector !")
      return
    }

    if (!this.targetObject) {
      log.e("Target Object non assigné dans l'Inspector !")
      return
    }

    // Initialisation de la position
    this.targetTransform = this.targetObject.getTransform()
    this.initialZ = this.targetTransform.getLocalPosition().z
    this.targetZ = this.initialZ + this.moveDistance

    this.moveToInitialImmediate()

    // Abonnement au pinch
    this.pinchButton.onButtonPinched.add(() => {
      this.toggleWithAnimation()
    })

    if (this.enableDebugLogs) log.i("ZTweenToggleMover initialisé avec succès.")
  }

  private toggleWithAnimation(): void {
    if (this.currentTween) {
      this.currentTween.cancel()
    }

    if (this.isForward) {
      this.animateTo(this.initialZ)
    } else {
      this.animateTo(this.targetZ)
    }

    this.isForward = !this.isForward
  }

  private animateTo(targetZ: number): void {
    const startZ = this.targetTransform.getLocalPosition().z

    this.currentTween = new LSTween()
      .from(startZ)
      .to(targetZ)
      .duration(this.animationDuration)
      .easing(this.easing as any)
      .onUpdate((z: number) => {
        const pos = this.targetTransform.getLocalPosition()
        pos.z = z
        this.targetTransform.setLocalPosition(pos)
      })
      .onComplete(() => {
        this.currentTween = null
        if (this.enableDebugLogs) log.i(`Animation terminée → Z = ${targetZ.toFixed(2)}`)
      })
      .start()
  }

  // === MÉTHODES PUBLIQUES ===
  public resetToInitial(): void {
    if (this.currentTween) this.currentTween.cancel()
    this.moveToInitialImmediate()
    this.isForward = false
  }

  public forceForward(): void {
    if (this.currentTween) this.currentTween.cancel()
    this.animateTo(this.targetZ)
    this.isForward = true
  }

  private moveToInitialImmediate(): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
  }
}