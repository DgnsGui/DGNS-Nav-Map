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
  private isForward: boolean = true // <-- Inversé ici

  // Animation state
  private animating: boolean = false
  private animationStartZ: number = 0
  private animationEndZ: number = 0
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

    // Inversé : position de base = avancée
    this.moveToTarget(true)

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
    this.animationStartZ = currentZ
    this.animationEndZ = this.isForward ? this.initialZ : this.initialZ + this.moveDistance
    this.animationElapsed = 0
    this.animating = true

    if (this.enableDebugLogs) log.i(`Animation lancée vers Z = ${this.animationEndZ}`)

    this.isForward = !this.isForward
  }

  private updateAnimation(eventData): void {
    if (!this.animating) return

    this.animationElapsed += getDeltaTime()
    let t = Math.min(this.animationElapsed / this.animationDuration, 1.0)
    // Optionnel : ease-in-out
    t = t * t * (3 - 2 * t)

    const newZ = this.animationStartZ + (this.animationEndZ - this.animationStartZ) * t
    const pos = this.targetTransform.getLocalPosition()
    pos.z = newZ
    this.targetTransform.setLocalPosition(pos)

    if (t >= 1.0) {
      this.animating = false
      if (this.enableDebugLogs) log.i(`Animation terminée à Z = ${newZ}`)
    }
  }

  // Méthodes publiques utiles (optionnelles)
  public resetToInitial(): void {
    this.moveToInitial(false)
    this.isForward = true // <-- Inversé ici
  }

  public forceForward(): void {
    this.moveToTarget(false)
    this.isForward = false // <-- Inversé ici
  }

  // Déplacement instantané (pour reset/force)
  private moveToInitial(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) log.i(`Retour à la position initiale : Z = ${this.initialZ}`)
  }

  private moveToTarget(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ + this.moveDistance
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) log.i(`Déplacé vers l'avant : Z = ${pos.z}`)
  }
}