import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate"

const TAG = "[ZTweenToggleMover]"
const log = new NativeLogger(TAG)

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
  @hint("Le PinchButton qui déclenche l'animation")
  private pinchButton!: PinchButton

  @input
  @hint("Objet à déplacer sur l'axe Z")
  private targetObject!: SceneObject

  @input
  @hint("Distance de déplacement sur Z (cm)")
  private moveDistance: number = 10.0

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.4

  @input
  @hint("Easing de l'animation")
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
  @hint("Active les logs")
  private enableDebugLogs: boolean = false

  private transform!: Transform
  private startZ: number = 0
  private endZ: number = 0
  private isForward: boolean = false
  private currentAnim: CancelFunction | null = null

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.init())
  }

  private init(): void {
    if (this.enableDebugLogs) log.i(`${TAG} init`)

    if (!this.pinchButton) { log.e("PinchButton manquant"); return }
    if (!this.targetObject) { log.e("Target manquant"); return }

    this.transform = this.targetObject.getTransform()
    this.startZ = this.transform.getLocalPosition().z
    this.endZ = this.startZ + this.moveDistance

    this.resetToStart()

    this.pinchButton.onButtonPinched.add(() => this.toggle())
  }

  private toggle(): void {
    if (this.currentAnim) this.currentAnim()

    const targetZ = this.isForward ? this.startZ : this.endZ
    this.animateTo(targetZ)
    this.isForward = !this.isForward
  }

  private animateTo(targetZ: number): void {
    const fromZ = this.transform.getLocalPosition().z

    this.currentAnim = animate({
      duration: this.animationDuration,
      easing: this.easing,
      update: (t: number) => {
        const z = MathUtils.lerp(fromZ, targetZ, t)
        const pos = this.transform.getLocalPosition()
        pos.z = z
        this.transform.setLocalPosition(pos)
      },
      ended: () => {
        this.currentAnim = null
        if (this.enableDebugLogs) log.i(`Z = ${targetZ.toFixed(2)}`)
      }
    })
  }

  public resetToStart(): void {
    if (this.currentAnim) this.currentAnim()
    const pos = this.transform.getLocalPosition()
    pos.z = this.startZ
    this.transform.setLocalPosition(pos)
    this.isForward = false
  }

  public forceForward(): void {
    if (this.currentAnim) this.currentAnim()
    this.animateTo(this.endZ)
    this.isForward = true
  }
}