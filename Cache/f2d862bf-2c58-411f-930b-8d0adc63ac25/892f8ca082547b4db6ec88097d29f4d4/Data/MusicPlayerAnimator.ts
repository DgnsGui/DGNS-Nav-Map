import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

const TAG = "[ZToggleMover]"
const log = new NativeLogger(TAG)

@component
export class ZToggleMover extends BaseScriptComponent {
  @input
  @hint("Le PinchButton qui déclenche le déplacement")
  private pinchButton: PinchButton

  @input
  @hint("Objet à déplacer")
  private targetObject: SceneObject

  @input
  @hint("Position de base (départ)")
  private basePosition: vec3 = new vec3(0, 0, 0)

  @input
  @hint("Position de fin (arrivée)")
  private endPosition: vec3 = new vec3(0, 0, 10)

  @input
  @hint("Durée de l'animation sur Z (secondes)")
  private animationDurationZ: number = 0.5

  @input
  @hint("Durée de l'animation sur Y (secondes)")
  private animationDurationY: number = 0.5

  @input
  @hint("Amplitude de l'oscillation sur Z")
  private oscillationAmplitudeZ: number = 10.0

  @input
  @hint("Amplitude de l'oscillation sur Y")
  private oscillationAmplitudeY: number = 10.0

  @input
  @hint("Active les logs dans la console")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private isForward: boolean = false

  // Animation state
  private animating: boolean = false
  private animationElapsedZ: number = 0
  private animationElapsedY: number = 0
  private oscillateForward: boolean = true

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== ZToggleMover INITIALIZATION ===")

    if (!this.pinchButton) {
      log.e("PinchButton non assigné !")
      return
    }

    if (!this.targetObject) {
      log.e("Target Object non assigné !")
      return
    }

    this.targetTransform = this.targetObject.getTransform()

    // Place à la position de base au départ
    this.moveToBase(true)

    // Abonne au pinch
    this.pinchButton.onButtonPinched.add(() => {
      this.togglePosition()
    })

    // Ajoute l'update event pour l'animation
    this.createEvent("UpdateEvent").bind((eventData) => this.updateAnimation(eventData))

    if (this.enableDebugLogs) log.i("ZToggleMover initialisé avec succès.")
  }

  private togglePosition(): void {
    if (this.animating) return // Ignore si déjà en animation

    this.animationElapsedZ = 0
    this.animationElapsedY = 0
    this.animating = true

    // Alterne le sens de l'oscillation à chaque animation
    this.oscillateForward = !this.oscillateForward;

    if (this.enableDebugLogs) log.i(`Animation lancée vers ${this.isForward ? "base" : "fin"}, oscillateForward = ${this.oscillateForward}`)

    this.isForward = !this.isForward
  }

  private updateAnimation(eventData): void {
    if (!this.animating) return

    // Animation Z
    this.animationElapsedZ += getDeltaTime()
    let tZ = Math.min(this.animationElapsedZ / this.animationDurationZ, 1.0)
    tZ = tZ * tZ * (3 - 2 * tZ) // ease-in-out

    // Animation Y
    this.animationElapsedY += getDeltaTime()
    let tY = Math.min(this.animationElapsedY / this.animationDurationY, 1.0)
    tY = tY * tY * (3 - 2 * tY) // ease-in-out

    // Interpolation position
    let start = this.isForward ? this.endPosition : this.basePosition
    let end = this.isForward ? this.basePosition : this.endPosition

    // Position Z
    let newZ = start.z + (end.z - start.z) * tZ

    // Oscillation Z
    let oscZStart = this.oscillateForward ? this.oscillationAmplitudeZ : -this.oscillationAmplitudeZ
    let oscZEnd = -oscZStart
    let oscZ = oscZStart + (oscZEnd - oscZStart) * tZ

    // Position Y
    let newY = start.y + (end.y - start.y) * tY

    // Oscillation Y
    let oscYStart = this.oscillateForward ? this.oscillationAmplitudeY : -this.oscillationAmplitudeY
    let oscYEnd = -oscYStart
    let oscY = oscYStart + (oscYEnd - oscYStart) * tY

    // Position X (toujours interpolée)
    let newX = start.x + (end.x - start.x) * tZ

    // Applique la position avec oscillations
    this.targetTransform.setLocalPosition(new vec3(
      newX,
      newY + oscY,
      newZ + oscZ
    ))

    if (tZ >= 1.0 && tY >= 1.0) {
      this.animating = false
      if (this.enableDebugLogs) log.i(`Animation terminée à X = ${newX}, Y = ${newY + oscY}, Z = ${newZ + oscZ}`)
    }
  }

  // Méthodes publiques utiles (optionnelles)
  public moveToBase(logIt = false): void {
    this.targetTransform.setLocalPosition(this.basePosition)
    if (logIt && this.enableDebugLogs) log.i(`Retour à la position de base : ${this.basePosition}`)
  }

  public moveToEnd(logIt = false): void {
    this.targetTransform.setLocalPosition(this.endPosition)
    if (logIt && this.enableDebugLogs) log.i(`Déplacé à la position de fin : ${this.endPosition}`)
  }
}