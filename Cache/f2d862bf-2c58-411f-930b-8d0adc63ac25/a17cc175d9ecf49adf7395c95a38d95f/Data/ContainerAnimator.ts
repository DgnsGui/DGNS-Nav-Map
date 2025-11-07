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
  private isOut: boolean = false // false = rentré, true = sorti

  // Animation state
  private animating: boolean = false
  private animationStartZ: number = 0
  private animationEndZ: number = 0
  private animationElapsed: number = 0
  private shouldHideAtEnd: boolean = false

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

    // Position de base = rentrée et invisible
    this.moveToInitial(true)
    this.targetObject.enabled = false

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

    if (this.isOut) {
      // Rentrer : retour à la position initiale
      this.animationEndZ = this.initialZ
      this.shouldHideAtEnd = true // Masquer à la fin de l'animation
    } else {
      // Sortir : déplacement vers l'avant (Z+)
      this.animationEndZ = this.initialZ + this.moveDistance
      this.shouldHideAtEnd = false
      // Activer immédiatement pour l'animation de sortie
      this.targetObject.enabled = true
    }

    this.animationElapsed = 0
    this.animating = true

    if (this.enableDebugLogs) {
      log.i(`Animation ${this.isOut ? 'rentrée' : 'sortie'} vers Z = ${this.animationEndZ}`)
    }

    this.isOut = !this.isOut
  }

  private updateAnimation(eventData): void {
    if (!this.animating) return

    this.animationElapsed += getDeltaTime()
    let t = Math.min(this.animationElapsed / this.animationDuration, 1.0)
    // Ease-in-out
    t = t * t * (3 - 2 * t)

    const newZ = this.animationStartZ + (this.animationEndZ - this.animationStartZ) * t
    const pos = this.targetTransform.getLocalPosition()
    pos.z = newZ
    this.targetTransform.setLocalPosition(pos)

    if (t >= 1.0) {
      this.animating = false
      
      // Désactiver l'objet si on vient de le rentrer
      if (this.shouldHideAtEnd) {
        this.targetObject.enabled = false
        if (this.enableDebugLogs) log.i("Container masqué")
      }
      
      if (this.enableDebugLogs) {
        log.i(`Animation terminée à Z = ${newZ}`)
      }
    }
  }

  // Méthodes publiques utiles (optionnelles)
  public resetToInitial(): void {
    this.moveToInitial(false)
    this.targetObject.enabled = false
    this.isOut = false
  }

  public forceOut(): void {
    this.moveToTarget(false)
    this.targetObject.enabled = true
    this.isOut = true
  }

  // Déplacement instantané (pour reset/force)
  private moveToInitial(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) log.i(`Position rentrée : Z = ${this.initialZ}`)
  }

  private moveToTarget(logIt = false): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ + this.moveDistance
    this.targetTransform.setLocalPosition(pos)
    if (logIt && this.enableDebugLogs) log.i(`Position sortie : Z = ${pos.z}`)
  }
}