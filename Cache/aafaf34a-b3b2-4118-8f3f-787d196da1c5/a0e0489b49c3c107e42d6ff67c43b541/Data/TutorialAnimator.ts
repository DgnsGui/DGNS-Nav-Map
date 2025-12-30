// TutorialAnimator.ts
// VERSION ULTIME – Solution radicale qui élimine TOUT lag au premier clic
// On active l'objet et on le place à la position visible DÈS LE DÉBUT (mais hors écran avec alpha = 0)
// Puis on anime uniquement depuis visible → caché et inversement
// Ainsi, l'objet est TOUJOURS actif, donc zéro problème de "réveil" au premier show

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
  @hint("Objet à animer (le container du tutoriel ou UI)")
  private targetObject: SceneObject

  @input
  @hint("Distance de déplacement vers le bas (Y négatif recommandé)")
  private moveDistanceY: number = -15.0

  @input
  @hint("Distance de déplacement vers l'avant (Z positif recommandé)")
  private moveDistanceZ: number = 20.0

  @input
  @hint("Durée de l'animation en secondes")
  private animationDuration: number = 0.6

  @input
  @hint("Type d'easing : easeOutBack, easeInOutCubic, etc.")
  private easingType: string = "easeOutBack"

  @input
  @hint("Activer les logs de debug dans la console")
  private enableDebugLogs: boolean = false

  // États internes
  private targetTransform: Transform
  private hiddenPosition: vec3
  private visiblePosition: vec3

  private isVisible: boolean = false
  private animating: boolean = false
  private animationProgress: number = 0
  private animationStartPos: vec3
  private animationEndPos: vec3

  // Easing functions
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
    easeInBack: (t) => {
      const c1 = 1.70158
      const c3 = c1 + 1
      return c3 * t * t * t - c1 * t * t
    },
  }

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.initialize())
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== TutorialAnimator INITIALISATION ===")

    if (!this.triggerButton) {
      log.e("Trigger Button non assigné !")
      return
    }
    if (!this.targetObject) {
      log.e("Target Object non assigné !")
      return
    }

    this.targetTransform = this.targetObject.getTransform()

    // Position cachée = position initiale
    this.hiddenPosition = this.targetTransform.getLocalPosition()

    // Position visible
    this.visiblePosition = new vec3(
      this.hiddenPosition.x,
      this.hiddenPosition.y + this.moveDistanceY,
      this.hiddenPosition.z + this.moveDistanceZ
    )

    // === SOLUTION RADICALE ===
    // L'objet reste TOUJOURS activé (enabled = true)
    // On le place à la position cachée au départ
    // On rend invisible en utilisant l'opacité (alpha) des matériaux
    this.targetObject.enabled = true
    this.targetTransform.setLocalPosition(this.hiddenPosition)
    this.setOpacity(0.0) // Invisible au départ

    this.isVisible = false
    this.animating = false

    this.triggerButton.onButtonPinched.add(() => {
      this.toggle()
    })

    this.createEvent("UpdateEvent").bind(() => this.updateAnimation())

    if (this.enableDebugLogs) log.i("TutorialAnimator initialisé – objet toujours actif, caché via opacité")
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

    this.animationStartPos = this.hiddenPosition
    this.animationEndPos = this.visiblePosition

    this.animating = true
    this.animationProgress = 0

    if (this.enableDebugLogs) log.i("Animation APPARITION lancée")
  }

  public hide(): void {
    if (!this.isVisible || this.animating) return

    this.animationStartPos = this.visiblePosition
    this.animationEndPos = this.hiddenPosition

    this.animating = true
    this.animationProgress = 0

    if (this.enableDebugLogs) log.i("Animation DISPARITION lancée")
  }

  private updateAnimation(): void {
    if (!this.animating) return

    this.animationProgress += getDeltaTime() / this.animationDuration
    let t = Math.min(this.animationProgress, 1.0)

    const easingFn = this.easingFunctions[this.easingType] || this.easingFunctions.easeInOutCubic
    t = easingFn(t)

    const newPos = vec3.lerp(this.animationStartPos, this.animationEndPos, t)
    this.targetTransform.setLocalPosition(newPos)

    // Gestion de l'opacité pendant l'animation
    let alpha = 0
    if (this.animationEndPos.equal(this.visiblePosition)) {
      // On montre → opacité monte
      alpha = t
    } else {
      // On cache → opacité descend
      alpha = 1 - t
    }
    this.setOpacity(alpha)

    if (this.animationProgress >= 1.0) {
      this.animating = false
      this.targetTransform.setLocalPosition(this.animationEndPos)

      if (this.animationEndPos.equal(this.visiblePosition)) {
        this.isVisible = true
        this.setOpacity(1.0)
        if (this.enableDebugLogs) log.i("Apparition terminée → visible")
      } else {
        this.isVisible = false
        this.setOpacity(0.0)
        if (this.enableDebugLogs) log.i("Disparition terminée → invisible")
      }
    }
  }

  // === Gestion de l'opacité sur tous les RenderMeshVisualizer des enfants ===
  private setOpacity(alpha: number): void {
    const visualizers = this.targetObject.findComponents("Component.RenderMeshVisualizer") as RenderMeshVisualizer[]
    for (const viz of visualizers) {
      const mat = viz.mainMaterial
      if (mat && mat.mainPass) {
        mat.mainPass.baseColor = mat.mainPass.baseColor.withA(alpha)
      }
    }

    // Optionnel : si tu as des Text ou Image, tu peux ajouter ici
    // const texts = this.targetObject.findComponents("Component.Text") as Text[]
    // for (const text of texts) {
    //   text.textFill.color = text.textFill.color.withA(alpha)
    // }
  }

  // Méthodes publiques
  public reset(): void {
    this.animating = false
    this.isVisible = false
    this.targetTransform.setLocalPosition(this.hiddenPosition)
    this.setOpacity(0.0)
  }

  public forceShow(): void {
    this.animating = false
    this.isVisible = true
    this.targetTransform.setLocalPosition(this.visiblePosition)
    this.setOpacity(1.0)
  }

  public forceHide(): void {
    this.animating = false
    this.isVisible = false
    this.targetTransform.setLocalPosition(this.hiddenPosition)
    this.setOpacity(0.0)
  }
}