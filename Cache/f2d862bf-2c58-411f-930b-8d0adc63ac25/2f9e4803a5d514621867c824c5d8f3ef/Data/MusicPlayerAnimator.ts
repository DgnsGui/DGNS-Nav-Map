import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate"

const TAG = "[ZTweenToggleMover]"
const log = new NativeLogger(TAG)

// Types d'easing valides pour SIK `animate`
type EasingType =
  | "linear"
  | "ease-in-sine" | "ease-out-sine" | "ease-in-out-sine"
  | "ease-in-quad" | "ease-out-quad" | "ease-in-out-quad"
  | "ease-in-cubic" | "ease-out-cubic" | "ease-in-out-cubic"
  | "ease-in-quart" | "ease-out-quart" | "ease-in-out-quart"
  | "ease-in-quint" | "ease-out-quint" | "ease-in-out-quint"
  | "ease-in-expo" | "ease-out-expo" | "ease-in-out-expo"
  | "ease-in-circ" | "ease-out-circ" | "ease-in-out-circ"
  | "ease-in-back" | "ease-out-back" | "ease-in-out-back"
  | "ease-in-elastic" | "ease-out-elastic" | "ease-in-out-elastic"
  | "ease-in-bounce" | "ease-out-bounce" | "ease-in-out-bounce"

@component
export class ZTweenToggleMover extends BaseScriptComponent {
  @input
  @hint("PinchButton déclencheur")
  private pinchButton: PinchButton

  @input
  @hint("Objet à déplacer")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement (cm)")
  private moveDistance: number = 10.0

  @input
  @hint("Durée de l'animation")
  private animationDuration: number = 0.4

  @input
  @hint("Easing")
  @widget("combobox", [
    "linear",
    "ease-in-sine", "ease-out-sine", "ease-in-out-sine",
    "ease-in-quad", "ease-out-quad", "ease-in-out-quad",
    "ease-in-cubic", "ease-out-cubic", "ease-in-out-cubic",
    "ease-in-quart", "ease-out-quart", "ease-in-out-quart",
    "ease-in-quint", "ease-out-quint", "ease-in-out-quint",
    "ease-in-expo", "ease-out-expo", "ease-in-out-expo",
    "ease-in-circ", "ease-out-circ", "ease-in-out-circ",
    "ease-in-back", "ease-out-back", "ease-in-out-back",
    "ease-in-elastic", "ease-out-elastic", "ease-in-out-elastic",
    "ease-in-bounce", "ease-out-bounce", "ease-in-out-bounce"
  ])
  private easing: EasingType = "ease-out-back"

  @input
  @hint("Logs")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialZ: number = 0
  private targetZ: number = 0
  private isForward: boolean = false
  private currentAnimation: CancelFunction | null = null

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.initialize())
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("ZTweenToggleMover: Init")

    if (!this.pinchButton) { log.e("PinchButton manquant"); return }
    if (!this.targetObject) { log.e("Target manquant"); return }

    this.targetTransform = this.targetObject.getTransform()
    this.initialZ = this.targetTransform.getLocalPosition().z
    this.targetZ = this.initialZ + this.moveDistance

    this.resetToInitial()

    this.pinchButton.onButtonPinched.add(() => this.toggleWithAnimation())

    if (this.enableDebugLogs) log.i("Prêt")
  }

  private toggleWithAnimation(): void {
    if (this.currentAnimation) this.currentAnimation()

    const destination = this.isForward ? this.initialZ : this.targetZ
    this.animateTo(destination)
    this.isForward = !this.isForward
  }

  private animateTo(targetZ: number): void {
    const startZ = this.targetTransform.getLocalPosition().z

    // UN SEUL OBJET → CORRECT
    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: this.easing,
      update: (t: number) => {
        const z = MathUtils.lerp(startZ, targetZ, t)
        const pos = this.targetTransform.getLocalPosition()
        pos.z = z
        this.targetTransform.setLocalPosition(pos)
      },
      ended: () => {
        this.currentAnimation = null
        if (this.enableDebugLogs) log.i(`Z = ${targetZ.toFixed(2)}`)
      }
    })
  }

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