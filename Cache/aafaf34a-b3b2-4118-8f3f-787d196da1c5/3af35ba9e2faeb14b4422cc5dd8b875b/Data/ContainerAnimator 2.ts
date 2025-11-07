import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

const TAG = "[YZToggleMover]"
const log = new NativeLogger(TAG)

@component
export class YZToggleMover extends BaseScriptComponent {
  @input
  @hint("Le PinchButton qui déclenche le déplacement")
  private pinchButton: PinchButton

  @input
  @hint("Objet à déplacer sur les axes Y et Z")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement sur l'axe Y (négative = vers le bas)")
  private moveDistanceY: number = -10.0

  @input
  @hint("Distance de déplacement sur l'axe Z (positive = vers l'avant)")
  private moveDistanceZ: number = 10.0

  @input
  @hint("Durée de l'animation en secondes")
  private animationDuration: number = 0.5

  @input
  @hint("Active les logs dans la console")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialY: number = 0
  private initialZ: number = 0
  private isOut: boolean = false // false = rentré, true = sorti

  // Animation state
  private animating: boolean = false
  private animationStartY: number = 0
  private animationStartZ: number = 0
  private animationEndY: number = 0
  private animationEndZ: number = 0
  private animationElapsed: number = 0

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize()
    })
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== YZToggleMover INITIALIZATION ===")

    if (!this.pinchButton) {
      log.e("PinchButton non assigné !")
      return
    }

    if (!this.targetObject) {
      log.e("Target Object non assigné !")
      return
    }

    this.targetTransform = this.targetObject.getTransform()
    const initialPos = this.targetTransform.getLocalPosition()
    this.initialY = initialPos.y
    this.initialZ = initialPos.z

    // Position de base = rentrée (position initiale)
    this.moveToInitial(true)

    // Abonne au pinch
    this.pinchButton.onButtonPinched.add(() => {
      this.togglePosition()
    })

    // Ajoute l'update event pour l'animation
    this.createEvent("UpdateEvent").bind((eventData) => this.updateAnimation(eventData))

    if (this.enableDebugLogs) log.i("YZToggleMover initialisé avec succès.")
  }

  private togglePosition(): void {
    if (this.animating) return // Ignore si déjà en animation

    const currentPos = this.targetTransform.getLocalPosition()
    this.animationStartY = currentPos.y
    this.animationStartZ = currentPos.z

    if (this.isOut) {
      // Rentrer : retour à la position initiale
      this.animationEndY = this.initialY
      this.animationEndZ = this.initialZ
    } else {
      // Sortir : déplacement vers Y- et Z+
      this.animationEndY = this.initialY + this.moveDistanceY
      this.animationEndZ = this.initialZ + this.moveDistanceZ
    }

    this.animationElapsed = 0
    this.animating = true

    if (this.enableDebugLogs) {
      log.i(`Animation ${this.isOut ? 'rentrée' : 'sortie'} vers Y = ${this.animationEndY}, Z = ${this.animationEndZ}`)
    }

    this.isOut = !this.isOut
  }

  private updateAnimation(eventData): void {
    if (!this.animating) return

    this.animationElapsed += getDeltaTime()
    let t = Math.min(this.animationElapsed / this.animationDuration, 1.0)
    // Ease-in-out
    t = t * t * (3 - 2 * t)

    const newY = this.animationStartY + (this.animationEndY - this.animationStartY) * t
    const newZ = this.animationStartZ + (this.animationEndZ - this.animationStartZ) * t
    
    const pos = this.targetTransform.getLocalPosition()
    pos.y = newY
    pos.z = newZ
    this.targetTransform.setLocalPosition(pos)

    if (t >= 1.0) {
      this.animating = false
      if (this.enableDebugLogs) {
        log.i(`Animation terminée à Y = ${newY}, Z = ${newZ}`)
      }
    }
  }

  // Méthodes publiques utiles (optionnelles)
  public resetToInitial(): void {
    this.moveToInitial(false)
    this.isOut = false
  }

  public forceOut(): void {
    this.moveToTarget(false)
    this.isOut = true
  }

  // Déplacement instantané (pour reset/force)
  private moveToInitial(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.y = this.initialY
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) {
      log.i(`Position rentrée : Y = ${this.initialY}, Z = ${this.initialZ}`)
    }
  }

  private moveToTarget(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.y = this.initialY + this.moveDistanceY
    pos.z = this.initialZ + this.moveDistanceZ
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) {
      log.i(`Position sortie : Y = ${pos.y}, Z = ${pos.z}`)
    }
  }
}