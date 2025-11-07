import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (le deuxième ovale)")
  private responseContainer: SceneObject;

  @input
  @allowUndefined
  @hint("Le SceneObject qui contient le composant Frame (pour accéder au bouton close)")
  private frameSceneObject: SceneObject;

  @input
  @hint("Position Y quand l'ovale est caché (à l'intérieur)")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible (au-dessus)")
  private visiblePositionY: number = 15;

  @input
  @hint("Durée de l'animation (secondes)")
  private animationDuration: number = 0.5;

  @input
  @hint("Active les logs détaillés")
  private enableDebugLogs: boolean = true;

  private responseTransform: Transform;
  private isAnimating: boolean = false;
  private currentAnimation: CancelFunction | null = null;
  private isVisible: boolean = false;
  private onCloseCallback: (() => void) | null = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== AIResponseAnimator INITIALIZATION ===");

    if (!this.responseContainer) {
      log.e("Response container not assigned!");
      return;
    }

    this.responseTransform = this.responseContainer.getTransform();

    // Set initial position (hidden)
    const initialPos = this.responseTransform.getLocalPosition();
    initialPos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(initialPos);

    // Hide the container initially
    this.responseContainer.enabled = false;
    this.isVisible = false;

    if (this.enableDebugLogs) log.i("Initial position set to hidden, container disabled.");

    // Chercher le composant Frame et connecter le bouton close
    if (this.frameSceneObject) {
      if (this.enableDebugLogs) log.i("Frame SceneObject assigned, searching for Frame component...");
      
      // Chercher le composant Frame sur l'objet ou ses parents/enfants
      const frameComponent = this.findFrameComponent(this.frameSceneObject);
      
      if (frameComponent) {
        if (this.enableDebugLogs) log.i("Frame component found!");
        
        // Accéder au closeButton via la propriété publique
        const closeButton = frameComponent.closeButton;
        
        if (closeButton) {
          if (this.enableDebugLogs) log.i("Close button found, connecting event...");
          
          closeButton.onTriggerUp.add(() => {
            if (this.enableDebugLogs) log.i("🔴 CLOSE BUTTON CLICKED!");
            this.handleCloseButton();
          });
          
          if (this.enableDebugLogs) log.i("✅ Close button event connected successfully!");
        } else {
          log.w("Close button not found on Frame component");
        }
      } else {
        log.w("Frame component not found on the assigned SceneObject");
      }
    } else {
      log.w("Frame SceneObject not assigned - close button won't be automatically connected");
      log.i("You can still manually call animateOut() or use setOnCloseCallback()");
    }

    if (this.enableDebugLogs) log.i("=== AIResponseAnimator initialized successfully ===");
  }

  /**
   * Cherche le composant Frame sur un SceneObject
   */
  private findFrameComponent(sceneObject: SceneObject): any {
    if (!sceneObject) return null;
    
    // Chercher sur l'objet lui-même
    const componentCount = sceneObject.getComponentCount("Component.ScriptComponent");
    for (let i = 0; i < componentCount; i++) {
      const component = sceneObject.getComponentByIndex("Component.ScriptComponent", i);
      // Vérifier si c'est un Frame en testant l'existence de la propriété closeButton
      if (component && "closeButton" in component) {
        if (this.enableDebugLogs) log.i("Found Frame component on current object");
        return component;
      }
    }
    
    // Chercher dans les enfants
    for (let i = 0; i < sceneObject.getChildrenCount(); i++) {
      const child = sceneObject.getChild(i);
      const result = this.findFrameComponent(child);
      if (result) return result;
    }
    
    return null;
  }

  /**
   * Méthode appelée quand le bouton close est cliqué
   */
  private handleCloseButton(): void {
    if (this.enableDebugLogs) log.i("handleCloseButton() called");
    
    // Déclencher l'animation de fermeture
    this.animateOut();
    
    // Appeler le callback si défini
    if (this.onCloseCallback) {
      if (this.enableDebugLogs) log.i("Calling close callback...");
      this.onCloseCallback();
    }
  }

  /**
   * Définir un callback à appeler quand le bouton close est cliqué
   */
  public setOnCloseCallback(callback: () => void): void {
    this.onCloseCallback = callback;
    if (this.enableDebugLogs) log.i("Close callback registered");
  }

  /**
   * Animate the response container sliding in (upward)
   */
  public animateIn(): void {
    if (this.isVisible && !this.isAnimating) {
        if (this.enableDebugLogs) log.i("Container already visible and not animating, skipping animateIn.");
        return;
    }

    if (this.isAnimating) {
      if (this.enableDebugLogs) log.w("Already animating, cancelling previous animation for animateIn...");
      if (this.currentAnimation) {
        this.currentAnimation();
      }
    }

    if (this.enableDebugLogs) log.i("🎬 Starting slide IN animation");
    this.isAnimating = true;
    this.isVisible = true;
    this.responseContainer.enabled = true;

    const targetY = this.visiblePositionY;

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-out-back",
      update: (t: number) => {
        const currentPos = this.responseTransform.getLocalPosition();
        currentPos.y = MathUtils.lerp(this.hiddenPositionY, targetY, t);
        this.responseTransform.setLocalPosition(currentPos);
      },
      ended: () => {
        if (this.enableDebugLogs) log.i("✅ Slide IN animation complete");
        this.isAnimating = false;
        this.currentAnimation = null;
      }
    });
  }

  /**
   * Animate the response container sliding out (downward)
   */
  public animateOut(): void {
    if (this.enableDebugLogs) log.i("🎬 animateOut() called");
    
    // Si déjà complètement caché, ne rien faire
    if (!this.isVisible && !this.isAnimating && !this.responseContainer.enabled) {
      if (this.enableDebugLogs) log.i("Container already fully hidden, skipping animation.");
      return;
    }

    // Annuler toute animation en cours
    if (this.isAnimating) {
      if (this.enableDebugLogs) log.w("Cancelling previous animation...");
      if (this.currentAnimation) {
        this.currentAnimation();
      }
    }

    if (this.enableDebugLogs) log.i("🎬 Starting slide OUT animation");
    this.isAnimating = true;

    const startPos = this.responseTransform.getLocalPosition();
    const targetY = this.hiddenPositionY;

    if (this.enableDebugLogs) log.i(`Animating from Y=${startPos.y.toFixed(2)} to Y=${targetY.toFixed(2)}`);

    this.currentAnimation = animate({
      duration: this.animationDuration,
      easing: "ease-in-quad",
      update: (t: number) => {
        const currentPos = this.responseTransform.getLocalPosition();
        currentPos.y = MathUtils.lerp(startPos.y, targetY, t);
        this.responseTransform.setLocalPosition(currentPos);
      },
      ended: () => {
        if (this.enableDebugLogs) log.i("✅ Slide OUT animation complete");
        this.isAnimating = false;
        this.isVisible = false;
        this.responseContainer.enabled = false;
        this.currentAnimation = null;
        if (this.enableDebugLogs) log.i("Container disabled and hidden");
      }
    });
  }

  /**
   * Force show the response (instant, no animation)
   */
  public showImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.visiblePositionY;
    this.responseTransform.setLocalPosition(pos);
    this.isVisible = true;
    this.isAnimating = false;
    this.responseContainer.enabled = true;

    if (this.enableDebugLogs) log.i("Response shown immediately");
  }

  /**
   * Force hide the response (instant, no animation)
   */
  public hideImmediate(): void {
    if (this.currentAnimation) {
      this.currentAnimation();
      this.currentAnimation = null;
    }

    const pos = this.responseTransform.getLocalPosition();
    pos.y = this.hiddenPositionY;
    this.responseTransform.setLocalPosition(pos);
    this.isVisible = false;
    this.isAnimating = false;
    this.responseContainer.enabled = false;

    if (this.enableDebugLogs) log.i("Response hidden immediately");
  }

  /**
   * Check if currently animating
   */
  public getIsAnimating(): boolean {
    return this.isAnimating;
  }

  /**
   * Check if currently visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }
}