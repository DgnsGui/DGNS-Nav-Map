// TutorialAnimator.ts
// VERSION CORRIGÉE – Container caché au départ, animation fluide dès le premier pinch
// Résout le runtime error : vérifie les inputs et initialise correctement

import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

const TAG = "[TutorialAnimator]"
const log = new NativeLogger(TAG)

@component
export class TutorialAnimator extends BaseScriptComponent {
  @input
  @hint("Bouton qui déclenche l'animation (pinch)")
  private triggerButton: PinchButton

  @input
  @hint("Objet à animer (le container du tutoriel/help)")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement vers le bas (Y négatif recommandé)")
  private moveDistanceY: number = -15.0

  @input
  @hint("Distance de déplacement vers l'avant (Z positif recommandé)")
  private moveDistanceZ: number = 20.0

  @input
  @hint("Distance Z très loin pour cacher au départ (négatif fort)")
  private hiddenFarZ: number = -1000.0  // Très loin derrière la caméra

  @input
  @hint("Durée de l'animation en secondes")
  private animationDuration: number = 0.6

  @input
  @hint("Type d'easing (easeOutBack recommandé pour l'apparition)")
  private easingType: string = "easeOutBack"

  @input
  @hint("Activer les logs de debug dans la console")
  private enableDebugLogs: boolean = false

  private targetTransform: Transform
  private hiddenPosition: vec3      // Position rentrée (Y bas, Z normal)
  private farHiddenPosition: vec3   // Position très cachée au départ (Z = -1000)
  private visiblePosition: vec3     // Position sortie

  private isVisible: boolean = false
  private animating: boolean = false
  private animationProgress: number = 0
  private animationStartPos: vec3
  private animationEndPos: vec3

  private easingFunctions: { [key: string]: (t: number) => number } = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    easeOutBack: (t) => {
      const c1 = 1.70158
      const c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    },
  }

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.initialize())
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== TutorialAnimator INITIALISATION ===")

    // Vérification des inputs pour éviter le runtime error
    if (!this.triggerButton) {
      log.e("Trigger Button non assigné ! Assigne-le dans l'Inspector.")
      return
    }
    if (!this.targetObject) {
      log.e("Target Object non assigné ! Assigne-le dans l'Inspector.")
      return
    }

    this.targetTransform = this.targetObject.getTransform()

    // Position de base (rentrée)
    this.hiddenPosition = this.targetTransform.getLocalPosition()

    // Position très cachée au départ (hors champ caméra)
    this.farHiddenPosition = new vec3(
      this.hiddenPosition.x,
      this.hiddenPosition.y,
      this.hiddenFarZ
    )

    // Position visible (sortie)
    this.visiblePosition = new vec3(
      this.hiddenPosition.x,
      this.hiddenPosition.y + this.moveDistanceY,
      this.hiddenPosition.z + this.moveDistanceZ
    )

    // État initial : caché très loin, mais activé
    this.targetObject.enabled = true
    this.targetTransform.setLocalPosition(this.farHiddenPosition)
    this.isVisible = false
    this.animating = false

    // Abonnement au bouton
    this.triggerButton.onButtonPinched.add(() => {
      this.toggle()
    })

    // Update pour animation
    this.createEvent("UpdateEvent").bind(() => this.updateAnimation())

    if (this.enableDebugLogs) log.i("TutorialAnimator prêt – container caché très loin en Z")
  }

  public toggle(): void {
    if (this.animating) return

    if (this.isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }

  public show(): void {
    if (this.isVisible || this.animating) return

    // Part de très loin vers visible
    this.animationStartPos = this.farHiddenPosition
    this.animationEndPos = this.visiblePosition

    this.animating = true
    this.animationProgress = 0

    if (this.enableDebugLogs) log.i("Animation APPARITION lancée depuis très loin")
  }

  public hide(): void {
    if (!this.isVisible || this.animating) return

    // Part de visible vers très loin
    this.animationStartPos = this.visiblePosition
    this.animationEndPos = this.farHiddenPosition

    this.animating = true
    this.animationProgress = 0

    if (this.enableDebugLogs) log.i("Animation DISPARITION lancée vers très loin")
  }

  private updateAnimation(): void {
    if (!this.animating) return

    this.animationProgress += getDeltaTime() / this.animationDuration
    let t = Math.min(this.animationProgress, 1.0)

    const easingFn = this.easingFunctions[this.easingType] || this.easingFunctions.easeInOutCubic
    t = easingFn(t)

    const newPos = vec3.lerp(this.animationStartPos, this.animationEndPos, t)
    this.targetTransform.setLocalPosition(newPos)

    if (this.animationProgress >= 1.0) {
      this.animating = false
      this.targetTransform.setLocalPosition(this.animationEndPos)

      if (this.animationEndPos.equal(this.visiblePosition)) {
        this.isVisible = true
        if (this.enableDebugLogs) log.i("Apparition terminée → visible")
      } else {
        this.isVisible = false
        if (this.enableDebugLogs) log.i("Disparition terminée → caché très loin")
      }
    }
  }

  public reset(): void {
    this.animating = false
    this.isVisible = false
    this.targetTransform.setLocalPosition(this.farHiddenPosition)
  }

  public forceShow(): void {
    this.animating = false
    this.isVisible = true
    this.targetTransform.setLocalPosition(this.visiblePosition)
  }

  public forceHide(): void {
    this.animating = false
    this.isVisible = false
    this.targetTransform.setLocalPosition(this.farHiddenPosition)
  }
}