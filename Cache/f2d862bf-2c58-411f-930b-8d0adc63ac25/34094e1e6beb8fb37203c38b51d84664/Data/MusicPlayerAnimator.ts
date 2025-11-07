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
  @hint("Objet à déplacer sur l'axe Z")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement sur l'axe Z (positive = vers l'avant)")
  private moveDistance: number = 10.0

  @input
  @hint("Durée de l'animation en secondes")
  private animationDuration: number = 0.5

  @input
  @hint("Active les logs dans la console")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialZ: number = 0
  private isForward: boolean = false

  // Animation state
  private animating: boolean = false
  private animationStartZ: number = 0
  private animationEndZ: number = 0
  private animationStartRotY: number = 0
  private animationEndRotY: number = 0
  private animationElapsed: number = 0

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
    this.initialZ = this.targetTransform.getLocalPosition().z

    // Réinitialise à la position de départ
    this.moveToInitial(true)

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

    const currentZ = this.targetTransform.getLocalPosition().z
    const currentRot = this.targetTransform.getLocalRotation().toEulerAngles()
    this.animationStartZ = currentZ
    this.animationStartRotY = currentRot.y

    if (this.isForward) {
      this.animationEndZ = this.initialZ
      this.animationEndRotY = this.animationStartRotY - 180
    } else {
      this.animationEndZ = this.initialZ + this.moveDistance
      this.animationEndRotY = this.animationStartRotY + 180
    }
    this.animationElapsed = 0
    this.animating = true

    if (this.enableDebugLogs) log.i(`Animation lancée vers Z = ${this.animationEndZ}, Y = ${this.animationEndRotY}`)

    this.isForward = !this.isForward
  }

  private updateAnimation(eventData): void {
    if (!this.animating) return

    this.animationElapsed += getDeltaTime()
    let t = Math.min(this.animationElapsed / this.animationDuration, 1.0)
    // Optionnel : ease-in-out
    t = t * t * (3 - 2 * t)

    // Interpolation position Z
    const newZ = this.animationStartZ + (this.animationEndZ - this.animationStartZ) * t
    const pos = this.targetTransform.getLocalPosition()
    pos.z = newZ

    // Interpolation rotation Y
    let newRotY = this.animationStartRotY + (this.animationEndRotY - this.animationStartRotY) * t
    // Pour éviter les valeurs trop grandes, on ramène entre -180 et 180
    newRotY = ((newRotY + 180) % 360) - 180

    const currentRot = this.targetTransform.getLocalRotation().toEulerAngles()
    const newRot = new vec3(currentRot.x, newRotY, currentRot.z)

    this.targetTransform.setLocalPosition(pos)
    this.targetTransform.setLocalRotation(quat.fromEulerAngles(newRot))

    if (t >= 1.0) {
      this.animating = false
      if (this.enableDebugLogs) log.i(`Animation terminée à Z = ${newZ}, Y = ${newRotY}`)
    }
  }

  // Méthodes publiques utiles (optionnelles)
  public resetToInitial(): void {
    this.moveToInitial(false)
    this.isForward = false
  }

  public forceForward(): void {
    this.moveToTarget(false)
    this.isForward = true
  }

  // Déplacement instantané (pour reset/force)
  private moveToInitial(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
    // Remet la rotation Y à 0
    const currentRot = this.targetTransform.getLocalRotation().toEulerAngles()
    this.targetTransform.setLocalRotation(quat.fromEulerAngles(new vec3(currentRot.x, 0, currentRot.z)))
    if (logIt && this.enableDebugLogs) log.i(`Retour à la position initiale : Z = ${this.initialZ}, Y = 0`)
  }

  private moveToTarget(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ + this.moveDistance
    this.targetTransform.setLocalPosition(pos)
    // Met la rotation Y à 180
    const currentRot = this.targetTransform.getLocalRotation().toEulerAngles()
    this.targetTransform.setLocalRotation(quat.fromEulerAngles(new vec3(currentRot.x, 180, currentRot.z)))
    if (logIt && this.enableDebugLogs) log.i(`Déplacé vers l'avant : Z = ${pos.z}, Y = 180`)
  }
}