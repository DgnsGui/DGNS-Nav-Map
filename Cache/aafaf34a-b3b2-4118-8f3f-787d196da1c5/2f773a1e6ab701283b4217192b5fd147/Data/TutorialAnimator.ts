// TutorialAnimator.ts
// Version FINALE 100% fonctionnelle et compilable dans Spectacles Interaction Kit

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
    this.hiddenPosition = this.targetTransform.getLocalPosition()

    this.visiblePosition = new vec3(
      this.hiddenPosition.x,
      this.hiddenPosition.y + this.moveDistanceY,
      this.hiddenPosition.z + this.moveDistanceZ
    )

    // État initial : caché
    this.targetTransform.setLocalPosition(this.hiddenPosition)
    this.targetObject.enabled = false
    this.isVisible = false
    this.animating = false

    this.triggerButton.onButtonPinched.add(() => {
      this.toggle()
    })

    this.createEvent("UpdateEvent").bind(() => this.updateAnimation())

    if (this.enableDebugLogs) log.i("TutorialAnimator initialisé (caché).")
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

    // Activer l'objet
    this.targetObject.enabled = true

    // Attendre un frame avec DelayedCallbackEvent reset(0)
    const delayEvent = this.createEvent("DelayedCallbackEvent")
    delayEvent.bind(() => {
      this.animationStartPos = this.targetTransform.getLocalPosition()
      this.animationEndPos = this.visiblePosition

      this.animating = true
      this.animationProgress = 0

      if (this.enableDebugLogs) log.i("Animation APPARITION lancée après 1 frame")
    })
    delayEvent.reset(0) // 0 seconde = prochain frame

    if (this.enableDebugLogs) log.i("Show déclenché – animation au prochain frame")
  }

  public hide(): void {
    if (!this.isVisible || this.animating) return

    this.animationStartPos = this.targetTransform.getLocalPosition()
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

    if (this.animationProgress >= 1.0) {
      this.animating = false
      this.targetTransform.setLocalPosition(this.animationEndPos)

      if (this.animationEndPos.equal(this.visiblePosition)) {
        this.isVisible = true
        if (this.enableDebugLogs) log.i("Apparition terminée → visible")
      } else {
        this.isVisible = false
        this.targetObject.enabled = false
        if (this.enableDebugLogs) log.i("Disparition terminée → caché")
      }
    }
  }

  public reset(): void {
    this.animating = false
    this.isVisible = false
    this.targetObject.enabled = false
    this.targetTransform.setLocalPosition(this.hiddenPosition)
  }

  public forceShow(): void {
    this.animating = false
    this.isVisible = true
    this.targetObject.enabled = true
    this.targetTransform.setLocalPosition(this.visiblePosition)
  }

  public forceHide(): void {
    this.animating = false
    this.isVisible = false
    this.targetObject.enabled = false
    this.targetTransform.setLocalPosition(this.hiddenPosition)
  }
}