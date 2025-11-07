import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import animate, { CancelFunction } from "SpectaclesInteractionKit.lspkg/Utils/animate";

const TAG = "[AIResponseAnimator]";
const log = new NativeLogger(TAG);

@component
export class AIResponseAnimator extends BaseScriptComponent {
  @input
  @hint("L'objet Container Frame de la réponse AI (AI Clam)")
  private responseContainer: SceneObject;

  @input
  @hint("Position Y quand l'ovale est caché (à l'intérieur)")
  private hiddenPositionY: number = 0;

  @input
  @hint("Position Y quand l'ovale est visible (au-dessus)")
  private visiblePositionY: number = 20;

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
  private frameComponent: any = null;

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

    // Chercher le composant Frame sur le responseContainer
    this.frameComponent = this.findFrameComponent(this.responseContainer);
    
    if (this.frameComponent) {
      if (this.enableDebugLogs) log.i("✅ Frame component found on AI Clam!");
      
      // Vérifier si le close button est activé
      if (this.frameComponent.showCloseButton) {
        if (this.enableDebugLogs) log.i("Close button is enabled, connecting event...");
        
        // Connecter l'événement du close button
        const closeButton = this.frameComponent.closeButton;
        
        if (closeButton) {
          closeButton.onButtonPinched.add(() => {
            if (this.enableDebugLogs) log.i("🔴 CLOSE BUTTON PINCHED!");
            this.handleCloseButton();
          });
          
          closeButton.onTriggerEnd.add(() => {
            if (this.enableDebugLogs) log.i("🔴 CLOSE BUTTON TRIGGER END!");
            this.handleCloseButton();
          });
          
          if (this.enableDebugLogs) log.i("✅ Close button events connected!");
        } else {
          log.w("closeButton property exists but is null");
        }
      } else {
        log.w("Show Close Button is not enabled on Frame! Enable it in the Inspector.");
      }
    } else {
      log.w("Frame component not found on responseContainer");
    }

    if (this.enableDebugLogs) log.i("=== AIResponseAnimator initialized successfully ===");
  }

  /**
   * Cherche le composant Frame sur un SceneObject
   */
  private findFrameComponent(sceneObject: SceneObject): any {
    if (!sceneObject) return null;
    
    const componentCount = sceneObject.getComponentCount("Component.ScriptComponent");
    
    if (this.enableDebugLogs) log.i(`Searching through ${componentCount} script components...`);
    
    for (let i = 0; i < componentCount; i++) {
      const component = sceneObject.getComponentByIndex("Component.ScriptComponent", i);
      
      if (component) {
        const typeName = component.getTypeName();
        if (this.enableDebugLogs) log.i(`Found component: ${typeName}`);
        
        // Vérifier si c'est un Frame en testant plusieurs propriétés
        if ("closeButton" in component && "showCloseButton" in component) {
          if (this.enableDebugLogs) log.i("✅ This is a Frame component!");
          return component;
        }
      }
    }
    
    if (this.enableDebugLogs) log.w("Frame component not found");
    return null;
  }

  /**
   * Méthode appelée quand le bouton close est cliqué
   */
  private handleCloseButton(): void {
    if (this.enableDebugLogs) log.i("========================================");
    if (this.enableDebugLogs) log.i("handleCloseButton() called - CLOSING AI RESPONSE");
    if (this.enableDebugLogs) log.i("========================================");
    
    // Déclencher l'animation de fermeture
    this.animateOut();
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
    if (this.enableDebugLogs) log.i("========================================");
    if (this.enableDebugLogs) log.i("🎬 animateOut() called");
    if (this.enableDebugLogs) log.i(`Current state - isVisible: ${this.isVisible}, isAnimating: ${this.isAnimating}, container.enabled: ${this.responseContainer.enabled}`);
    
    // Si déjà complètement caché, ne rien faire
    if (!this.isVisible && !this.isAnimating && !this.responseContainer.enabled) {
      if (this.enableDebugLogs) log.i("Container already fully hidden, skipping animation.");
      if (this.enableDebugLogs) log.i("========================================");
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
        if (this.enableDebugLogs) log.i("========================================");
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