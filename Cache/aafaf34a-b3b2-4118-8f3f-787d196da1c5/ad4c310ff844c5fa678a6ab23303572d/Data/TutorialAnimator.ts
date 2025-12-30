// TutorialAnimator.ts
// Script indépendant pour animer l'apparition/disparition d'un container
// avec déplacement sur Y (bas) et Z (avant), et gestion propre de la visibilité

import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger"
import { PinchButton } from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"

const TAG = "[TutorialAnimator]"
const log = new NativeLogger(TAG)

@component
export class TutorialAnimator extends BaseScriptComponent {
  // ====================== Inputs ======================
  @input
  @hint("Bouton qui déclenche l'animation (pinch)")
  private triggerButton: PinchButton

  @input
  @hint("Objet à animer (le container du tutoriel)")
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
  @hint("Easing : easeInOut, easeOutBack, easeInQuad, etc. (voir liste ci-dessous)")
  private easingType: string = "easeOutBack"

  @input
  @hint("Activer les logs de debug dans la console")
  private enableDebugLogs: boolean = false

  // ====================== États internes ======================
  private targetTransform: Transform
  private initialPosition: vec3 = new vec3(0, 0, 0)
  private isVisible: boolean = false // false = caché (rentré), true = visible (sorti)

  private animating: boolean = false
  private animationProgress: number = 0
  private animationFrom: vec3 = new vec3(0, 0, 0)
  private animationTo: vec3 = new vec3(0, 0, 0)

  // ====================== Easing functions ======================
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
    easeOutBounce: (t) => {
      const n1 = 7.5625
      const d1 = 2.75
      if (t < 1 / d1) return n1 * t * t
      else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
      else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
      else return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  // ====================== Lifecycle ======================
  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.initialize())
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== TutorialAnimator INITIALISATION ===")

    // Vérifications
    if (!this.triggerButton) {
      log.e("Trigger Button (PinchButton) non assigné !")
      return
    }
    if (!this.targetObject) {
      log.e("Target Object non assigné !")
      return
    }

    this.targetTransform = this.targetObject.getTransform()
    this.initialPosition = this.targetTransform.getLocalPosition()

    // État initial : caché et désactivé
    this.setPosition(this.initialPosition)
    this.targetObject.enabled = false
    this.isVisible = false

    // Abonnement au bouton
    this.triggerButton.onButtonPinched.add(() => {
      this.toggle()
    })

    // Update pour l'animation
    this.createEvent("UpdateEvent").bind((eventData) => this.updateAnimation(getDeltaTime()))

    if (this.enableDebugLogs) log.i("TutorialAnimator prêt et en position cachée.")
  }

  // ====================== Public Methods ======================
  public show(): void {
    if (this.isVisible || this.animating) return
    this.startAnimation(true)
  }

  public hide(): void {
    if (!this.isVisible || this.animating) return
    this.startAnimation(false)
  }

  public toggle(): void {
    if (this.animating) return
    this.startAnimation(!this.isVisible)
  }

  public reset(): void {
    this.animating = false
    this.setPosition(this.initialPosition)
    this.targetObject.enabled = false
    this.isVisible = false
  }

  // ====================== Animation Core ======================
  private startAnimation(show: boolean): void {
    this.animating = true
    this.animationProgress = 0

    // Activer immédiatement si on veut montrer
    if (show) {
      this.targetObject.enabled = true
    }

    const currentPos = this.targetTransform.getLocalPosition()
    this.animationFrom = currentPos

    if (show) {
      this.animationTo = new vec3(
        this.initialPosition.x,
        this.initialPosition.y + this.moveDistanceY,
        this.initialPosition.z + this.moveDistanceZ
      )
      this.isVisible = true
    } else {
      this.animationTo = this.initialPosition
      // isVisible restera false, on le désactive à la fin
    }

    if (this.enableDebugLogs) {
      log.i(`Démarrage animation : ${show ? "APparition" : "Disparition"}`)
    }
  }

  private updateAnimation(deltaTime: number): void {
    if (!this.animating) return

    this.animationProgress += deltaTime / this.animationDuration
    let t = Math.min(this.animationProgress, 1.0)

    // Appliquer l'easing choisi
    const easingFn = this.easingFunctions[this.easingType] || this.easingFunctions.easeInOutCubic
    t = easingFn(t)

    // Interpolation de position
    const newPos = this.animationFrom.lerp(this.animationTo, t)
    this.setPosition(newPos)

    // Fin de l'animation
    if (this.animationProgress >= 1.0) {
      this.animating = false

      // Si on vient de cacher → désactiver l'objet
      if (!this.isVisible) {
        this.targetObject.enabled = false
        if (this.enableDebugLogs) log.i("Container caché et désactivé")
      } else {
        if (this.enableDebugLogs) log.i("Container visible et animation terminée")
      }
    }
  }

  private setPosition(pos: vec3): void {
    this.targetTransform.setLocalPosition(pos)
  }
}