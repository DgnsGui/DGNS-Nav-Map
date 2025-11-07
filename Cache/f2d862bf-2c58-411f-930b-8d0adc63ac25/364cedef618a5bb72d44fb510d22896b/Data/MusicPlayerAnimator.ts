import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate"

const TAG = "[ZTweenToggleMover]"
const log = new NativeLogger(TAG)

@component
export class ZTweenToggleMover extends BaseScriptComponent {
  @input
  private pinchButton!: PinchButton

  @input
  private targetObject!: SceneObject

  @input
  private moveDistance: number = 10.0

  @input
  private animationDuration: number = 0.4

  @input
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
  private easing: string = "ease-out-back"

  @input
  private enableDebugLogs: boolean = false

  private transform!: Transform
  private startZ = 0
  private endZ = 0
  private isForward = false
  private anim: CancelFunction | null = null

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.init())
  }

  private init() {
    if (!this.pinchButton || !this.targetObject) {
      log.e("PinchButton ou Target manquant")
      return
    }

    this.transform = this.targetObject.getTransform()
    this.startZ = this.transform.getLocalPosition().z
    this.endZ = this.startZ + this.moveDistance
    this.reset()

    this.pinchButton.onButtonPinched.add(() => this.toggle())
  }

  private toggle() {
    if (this.anim) this.anim()
    this.animateTo(this.isForward ? this.startZ : this.endZ)
    this.isForward = !this.isForward
  }

  // LIGNE 42 – UN SEUL OBJET
  private animateTo(targetZ: number) {
    const fromZ = this.transform.getLocalPosition().z

    this.anim = animate({
      duration: this.animationDuration,
      easing: this.easing,
      update: (t: number) => {
        const z = MathUtils.lerp(fromZ, targetZ, t)
        const pos = this.transform.getLocalPosition()
        pos.z = z
        this.transform.setLocalPosition(pos)
      },
      ended: () => {
        this.anim = null
        if (this.enableDebugLogs) log.i(`Z = ${targetZ.toFixed(2)}`)
      }
    })
  }

  public reset() {
    if (this.anim) this.anim()
    const pos = this.transform.getLocalPosition()
    pos.z = this.startZ
    this.transform.setLocalPosition(pos)
    this.isForward = false
  }
}