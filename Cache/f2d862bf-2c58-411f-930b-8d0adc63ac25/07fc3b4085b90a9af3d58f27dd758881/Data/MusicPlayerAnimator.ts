import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton" // Assure-toi que le chemin est correct

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
  @hint("Active les logs dans la console")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private initialZ: number = 0
  private isForward: boolean = false

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
    this.moveToInitial()

    // Abonne au pinch
    this.pinchButton.onButtonPinched.add(() => {
      this.togglePosition()
    })

    if (this.enableDebugLogs) log.i("ZToggleMover initialisé avec succès.")
  }

  private togglePosition(): void {
    if (this.isForward) {
      this.moveToInitial()
    } else {
      this.moveForward()
    }
    this.isForward = !this.isForward
  }

  private moveForward(): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ + this.moveDistance
    this.targetTransform.setLocalPosition(pos)

    if (this.enableDebugLogs) log.i(`Déplacé vers l'avant : Z = ${pos.z}`)
  }

  private moveToInitial(): void {
    const pos = this.targetTransform.getLocalPosition()
    pos.z = this.initialZ
    this.targetTransform.setLocalPosition(pos)

    if (this.enableDebugLogs) log.i(`Retour à la position initiale : Z = ${this.initialZ}`)
  }

  // Méthodes publiques utiles (optionnelles)
  public resetToInitial(): void {
    this.moveToInitial()
    this.isForward = false
  }

  public forceForward(): void {
    this.moveForward()
    this.isForward = true
  }
}