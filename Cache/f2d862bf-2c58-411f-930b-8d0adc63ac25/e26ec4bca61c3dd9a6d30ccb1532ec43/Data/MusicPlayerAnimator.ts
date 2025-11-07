import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import LSTween from "LensStudio:LSTween"  // ← LSTween natif

const TAG = "[ZTweenToggleMover]"
const log = new NativeLogger(TAG)

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
  @hint("Active les logs")
  private enableDebugLogs: boolean = false

  private transform!: Transform
  private startZ: number = 0
  private endZ: number = 0
  private isForward: boolean = false
  private currentTween: LSTween | null = null

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
    if (this.currentTween) this.currentTween.cancel()

    const targetZ = this.isForward ? this.startZ : this.endZ
    this.animateTo(targetZ)
    this.isForward = !this.isForward
  }

  // LSTween – CORRECT
  private animateTo(targetZ: number): void {
    const fromZ = this.transform.getLocalPosition().z

    this.currentTween = new LSTween()
      .from(fromZ)
      .to(targetZ)
      .duration(this.animationDuration)
      .easing(this.easing as any)
      .onUpdate((z: number) => {
        const pos = this.transform.getLocalPosition()
        pos.z = z
        this.transform.setLocalPosition(pos)
      })
      .onComplete(() => {
        this.currentTween = null
        if (this.enableDebugLogs) log.i(`Z = ${targetZ.toFixed(2)}`)
      })
      .start()
  }

  public resetToStart(): void {
    if (this.currentTween) this.currentTween.cancel()
    const pos = this.transform.getLocalPosition()
    pos.z = this.startZ
    this.transform.setLocalPosition(pos)
    this.isForward = false
  }

  public forceForward(): void {
    if (this.currentTween) this.currentTween.cancel()
    this.animateTo(this.endZ)
    this.isForward = true
  }
}