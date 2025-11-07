import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate"

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
    "linear", "quadratic-in", "quadratic-out", "quadratic-in-out",
    "cubic-in", "cubic-out", "cubic-in-out",
    "quartic-in", "quartic-out", "quartic-in-out",
    "quintic-in", "quintic-out", "quintic-in-out",
    "sine-in", "sine-out", "sine-in-out",
    "circular-in", "circular-out", "circular-in-out",
    "exponential-in", "exponential-out", "exponential-in-out",
    "elastic-in", "elastic-out", "elastic-in-out",
    "back-in", "back-out", "back-in-out",
    "bounce-in", "bounce-out", "bounce-in-out"
  ])
  private easing: string = "back-out"

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialZ: number = 0
  private targetZ: number = 0
  private isForward: boolean = false
  private currentAnimation: CancelFunction | null = null

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== ZTweenToggleMover INIT ===")

    if (!this.pinchButton) {
      log.e("PinchButton manquant !")
      return
    }
    if (!this.targetObject) {
      log.e("Target Object manquant !")
      return
    }

    this.targetTransform = this.targetObject.getTransform()
    this.initialZ = this.targetTransform.getLocalPosition().z
    this.targetZ = this.initialZ + this.moveDistance

    this.resetToInitial() // Position de départ

    this.pinchButton.onButtonPinched.add(() => {
      this.toggleWithAnimation()
    })

    if (this.enableDebugLogs) log.i("ZTweenToggleMover prêt.")
  }

  private toggleWithAnimation(): void {
    if (this.currentAnimation) {
      this.currentAnimation() // Annule l'animation en cours
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

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: this.easing,
      start: 0,
      end: 1,
      update: (t: number) => {
        const z = MathUtils.lerp(startZ, targetZ, t)
        const pos = this.targetTransform.getLocalPosition()
        pos.z = z
        this.targetTransform.setLocalPosition(pos)
      },
      ended: () => {
        this.currentAnimation = null
        if (this.enableDebugLogs) log.i(`Animation → Z = ${targetZ.toFixed(2)}`)
      }
    })
  }

  // === MÉTHODES PUBLIQUES ===
  public resetToInitial(): void {
    if (this.currentAnimation) this.currentAnimation()
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
    this.isForward = false
  }

  public forceForward(): void {
    if (this.currentAnimation) this.currentAnimation()
    this.animateTo(this.targetZ)
    this.isForward = true
  }
}