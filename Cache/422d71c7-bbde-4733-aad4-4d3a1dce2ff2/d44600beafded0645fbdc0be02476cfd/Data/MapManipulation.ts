// --- START OF FILE MapManipulation.ts (FINAL - Restored Logic with Rotation Fix) ---

import Event, {
  PublicApi,
  unsubscribe,
} from "SpectaclesInteractionKit.lspkg/Utils/Event";
import {
  Interactor,
  InteractorInputType,
  TargetingMode,
} from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import {
  OneEuroFilterConfig,
  OneEuroFilterVec3,
} from "SpectaclesInteractionKit.lspkg/Utils/OneEuroFilter";

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractionManager } from "SpectaclesInteractionKit.lspkg/Core/InteractionManager/InteractionManager";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import { MobileInteractor } from "SpectaclesInteractionKit.lspkg/Core/MobileInteractor/MobileInteractor";
import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import WorldCameraFinderProvider from "SpectaclesInteractionKit.lspkg/Providers/CameraProvider/WorldCameraFinderProvider";
import { validate } from "SpectaclesInteractionKit.lspkg/Utils/validate";
import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { customGetEuler } from "../MapComponent/Scripts/MapUtils";

export type TranslateEventArg = {
  interactable: Interactable;
  startPosition: vec3;
  currentPosition: vec3;
};

const TAG = "[MapManipulation]";
const log = new NativeLogger(TAG);
const STRETCH_SMOOTH_SPEED = 15;
const MOBILE_DRAG_MULTIPLIER = 0.5;
const CachedTransform = { transform: mat4.identity(), position: vec3.zero(), rotation: quat.quatIdentity(), scale: vec3.one() };

@component
export class InteractableManipulation extends BaseScriptComponent {
  @input("SceneObject") private mapSceneObject: SceneObject | null = null;
  @input() private mapComponent: MapComponent;
  @input() private fullMapCollider: ColliderComponent;
  @input() private miniMapCollider: ColliderComponent;
  @input() enableStretchZ: boolean = true;
  @input() @showIf("enableStretchZ", true) showStretchZProperties: boolean = false;
  @input() @showIf("showStretchZProperties", true) zStretchFactorMin: number = 1.0;
  @input() @showIf("showStretchZProperties", true) zStretchFactorMax: number = 12.0;
  @input() private useFilter: boolean = true;
  @input() @showIf("showFilterProperties", true) minCutoff: number = 2;
  @input() @showIf("showFilterProperties", true) beta: number = 0.015;
  @input() @showIf("showFilterProperties", true) dcutoff: number = 1;

  private camera = WorldCameraFinderProvider.getInstance();
  private interactionManager = InteractionManager.getInstance();
  private unsubscribeBag: unsubscribe[] = [];
  private interactable: Interactable | null = null;
  
  // *** AJOUT : Références aux deux transforms ***
  private parentMapTransform: Transform;
  private rotatingGridTransform: Transform;

  private originalWorldTransform = CachedTransform;
  private originalLocalTransform = CachedTransform;
  private startTransform = CachedTransform;
  private offsetPosition = vec3.zero();
  private offsetRotation = quat.quatIdentity();
  private startStretchInteractorDistance = 0;
  private mobileStretch = 0;
  private smoothedStretch = 0;
  private hoveringInteractor: Interactor;
  private triggeringInteractor: Interactor;
  private cachedTargetingMode: TargetingMode = TargetingMode.None;
  private translateFilter!: OneEuroFilterVec3;
  private colliderSizeX: number;
  private colliderSizeY: number;

  onTranslationStart: PublicApi<TranslateEventArg> = new Event<TranslateEventArg>().publicApi();
  onTranslationUpdate: PublicApi<TranslateEventArg> = new Event<TranslateEventArg>().publicApi();
  onTranslationEnd: PublicApi<TranslateEventArg> = new Event<TranslateEventArg>().publicApi();

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName());
    if (!this.interactable) throw new Error("MapManipulation requires an Interactable.");
    
    this.parentMapTransform = this.mapSceneObject.getTransform();

    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.createEvent("OnDestroyEvent").bind(() => this.unsubscribeBag.forEach(u => u()));
    this.cacheTransform();
    this.setupCallbacks();
    this.translateFilter = new OneEuroFilterVec3({ frequency: 60, minCutoff: this.minCutoff, beta: this.beta, dcutoff: this.dcutoff });
    this.mapComponent.onMiniMapToggled.add((isMiniMap: boolean) => this.setupColliders(isMiniMap));
  }

  private onStart(): void {
    this.setupColliders(this.mapComponent.startedAsMiniMap);
    // *** AJOUT : Logique pour récupérer le transform qui tourne, avec une sécurité ***
    if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
        this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
    } else {
        log.e("MapController not ready on Start, retrying...");
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => this.onStart());
        delayedEvent.reset(0.1);
    }
  }

  private getLocalPosition(worldPosition: vec3): vec2 {
    // *** LA CORRECTION PRINCIPALE EST ICI ***
    // On utilise le transform de la grille si il est disponible, sinon on se rabat sur le transform parent.
    const transformToUse = this.rotatingGridTransform || this.parentMapTransform;
    
    const localPosition = transformToUse
      .getInvertedWorldTransform()
      .multiplyPoint(worldPosition);
      
    return new vec2(
      localPosition.x / this.colliderSizeX,
      localPosition.y / this.colliderSizeY
    );
  }

  // --- LE RESTE DU SCRIPT EST RESTAURÉ À L'ORIGINAL ---

  private onTriggerUpdate(eventData: InteractorEvent): void {
    if (!this.enabled) return;
    if (this.triggeringInteractor !== null) {
      // *** RESTAURATION : On rappelle la fonction de mouvement qui avait été supprimée ***
      this.singleInteractorTransform(this.triggeringInteractor);
    }
    (this.onTranslationUpdate as Event<TranslateEventArg>).invoke({
        interactable: this.interactable,
        startPosition: this.startTransform.position,
        currentPosition: this.parentMapTransform.getWorldPosition(),
    });
  }

  private singleInteractorTransform(interactor: Interactor): void {
    if (!this.isInteractorValid(interactor)) {
      this.log.e("Interactor must be valid");
      return;
    }
    validate(this.parentMapTransform);

    const startPoint = interactor.startPoint ?? vec3.zero();
    const orientation = interactor.orientation ?? quat.quatIdentity();
    const direction = interactor.direction ?? vec3.zero();

    const limitRotation = quat.fromEulerVec(customGetEuler(orientation)).multiply(this.offsetRotation);

    let newPosition: vec3;

    if (this.cachedTargetingMode === TargetingMode.Direct) {
      newPosition = startPoint.add(
        limitRotation
          .multiply(this.startTransform.rotation.invert())
          .multiplyVec3(this.offsetPosition)
      );
      this.updatePosition(newPosition, this.useFilter);
    } else {
      if (!this.triggeringInteractor.planecastPoint) {
        return;
      }
      this.smoothedStretch = MathUtils.lerp(
        this.smoothedStretch,
        this.calculateStretchFactor(interactor),
        getDeltaTime() * STRETCH_SMOOTH_SPEED
      );
      newPosition = this.triggeringInteractor.planecastPoint.add(
        direction.uniformScale(this.smoothedStretch)
      );
      this.updatePosition(newPosition, this.useFilter);
    }
  }

  private updatePosition(newPosition: vec3 | null, useFilter = true) {
    if (newPosition === null) return;
    validate(this.parentMapTransform);

    newPosition.x = this.parentMapTransform.getWorldPosition().x;
    newPosition.y = this.parentMapTransform.getWorldPosition().y;

    if (useFilter) {
      newPosition = this.translateFilter.filter(newPosition, getTime());
    }

    const localPos = this.getLocalPosition(newPosition);
    this.mapComponent.updateTouch(localPos);
  }

  // Tout le reste du code est identique à ton script original.
  // ... (fonctions de setup, gestion des hover, trigger, etc.) ...
  private onDestroy(): void { this.unsubscribeBag.forEach((unsubscribeCallback: unsubscribe) => { unsubscribeCallback(); }); this.unsubscribeBag = []; }
  private setupColliders(isMiniMap: boolean): void {
    this.miniMapCollider.enabled = isMiniMap; this.fullMapCollider.enabled = !isMiniMap;
    let shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
    if (shape.isOfType("BoxShape")) { const boxShape = shape as BoxShape; this.colliderSizeX = boxShape.size.x / 8; this.colliderSizeY = boxShape.size.y / 8;
    } else if (shape.isOfType("SphereShape")) { const sphereShape = shape as SphereShape; this.colliderSizeX = sphereShape.radius; this.colliderSizeY = sphereShape.radius;
    } else { this.log.e("Other shapes of collider is not currently supported for map interaction"); }
  }
  private setupCallbacks(): void {
    validate(this.interactable);
    const stopProp = (e: InteractorEvent) => { if (e.propagationPhase === "Target" || e.propagationPhase === "BubbleUp") e.stopPropagation(); };
    this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((e) => { stopProp(e); this.onHoverToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((e) => { stopProp(e); this.onHoverToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((e) => { stopProp(e); this.onHoverUpdate(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((e) => { stopProp(e); this.onTriggerUpdate(e); }));
    this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
  }
  private updateStartValues(): void {
    validate(this.parentMapTransform); validate(this.interactable);
    const interactor: Interactor = this.getTriggeringInteractor();
    this.mobileStretch = 0; this.smoothedStretch = 0; this.startStretchInteractorDistance = 0;
    this.translateFilter.reset();
    this.startTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
    const cameraRotation = this.camera.getTransform().getWorldRotation();
    if (interactor !== null) {
      if (!this.isInteractorValid(interactor)) { this.log.e("Interactor must not be valid for setting initial values"); return; }
      const startPoint = interactor.startPoint ?? vec3.zero(); const orientation = interactor.orientation ?? quat.quatIdentity();
      this.cachedTargetingMode = interactor.activeTargetingMode;
      if (interactor.activeTargetingMode === TargetingMode.Direct) { this.offsetPosition = this.startTransform.position.sub(startPoint); this.offsetRotation = orientation.invert().multiply(this.startTransform.rotation);
      } else { const rayPosition = this.getRayPosition(interactor); this.offsetPosition = rayPosition.sub(startPoint); this.offsetRotation = cameraRotation.invert().multiply(this.startTransform.rotation); }
    }
  }
  private getRayPosition(interactor: Interactor): vec3 { if (!this.isInteractorValid(interactor)) { return vec3.zero(); } const startPoint = interactor.startPoint ?? vec3.zero(); const direction = interactor.direction ?? vec3.zero(); const distanceToTarget = interactor.distanceToTarget ?? 0; return startPoint.add(direction.uniformScale(distanceToTarget)); }
  private cacheTransform() {
    validate(this.parentMapTransform);
    this.originalWorldTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
    this.originalLocalTransform = { transform: mat4.compose(this.parentMapTransform.getLocalPosition(), this.parentMapTransform.getLocalRotation(), this.parentMapTransform.getLocalScale()), position: this.parentMapTransform.getLocalPosition(), rotation: this.parentMapTransform.getLocalRotation(), scale: this.parentMapTransform.getLocalScale() };
  }
  private onHoverToggle(eventData: InteractorEvent): void { if (!this.enabled) return; this.hoveringInteractor = this.getHoveringInteractor(); }
  private onHoverUpdate(eventData: InteractorEvent): void { if (!this.enabled || !this.hoveringInteractor || !this.hoveringInteractor.planecastPoint) return; this.mapComponent.updateHover(this.getLocalPosition(this.hoveringInteractor.planecastPoint)); }
  private onTriggerToggle(eventData: InteractorEvent): void {
    if (!this.enabled) return;
    this.triggeringInteractor = this.getTriggeringInteractor();
    if (this.triggeringInteractor) { this.updateStartValues(); if(this.triggeringInteractor.planecastPoint) this.mapComponent.startTouch(this.getLocalPosition(this.triggeringInteractor.planecastPoint)); (this.onTranslationStart as Event<TranslateEventArg>).invoke({interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition()});
    } else { if(eventData.interactor.planecastPoint) this.mapComponent.endTouch(this.getLocalPosition(eventData.interactor.planecastPoint)); (this.onTranslationEnd as Event<TranslateEventArg>).invoke({interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition()}); }
  }
  private getHoveringInteractor(): Interactor { validate(this.interactable); const interactors: Interactor[] = this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor); if (interactors.length === 0) return null; return interactors[0]; }
  private getTriggeringInteractor(): Interactor { validate(this.interactable); const interactors: Interactor[] = this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor); if (interactors.length === 0) return null; return interactors[0]; }
  private isInteractorValid(interactor: Interactor): boolean { return interactor !== null && interactor.startPoint !== null && interactor.orientation !== null && interactor.direction !== null && interactor.distanceToTarget !== null && interactor.isActive(); }
  private calculateStretchFactor(interactor: Interactor): number {
    if (this.enableStretchZ === false) return 1;
    const startPoint = interactor.startPoint ?? vec3.zero(); const interactorDistance = this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z * -1;
    if (this.startStretchInteractorDistance === 0) this.startStretchInteractorDistance = interactorDistance;
    const dragAmount = interactorDistance - this.startStretchInteractorDistance;
    const currDistance = interactor.distanceToTarget ?? 0; const distanceFactor = (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDistance + this.zStretchFactorMin;
    const minStretch = -this.offsetPosition.length + 1; const maxStretch = -this.offsetPosition.length + interactor.maxRaycastDistance - 1;
    let finalStretchAmount = MathUtils.clamp(dragAmount * distanceFactor, minStretch, maxStretch);
    if (interactor.inputType === InteractorInputType.Mobile) {
      const mobileInteractor = interactor as MobileInteractor; let mobileDragVector = vec3.zero(); if (mobileInteractor.touchpadDragVector !== null) mobileDragVector = mobileInteractor.touchpadDragVector;
      const mobileMoveAmount = mobileDragVector.z === 0 ? mobileDragVector.y * MOBILE_DRAG_MULTIPLIER : 0;
      this.mobileStretch += mobileMoveAmount * distanceFactor;
      this.mobileStretch = Math.min(maxStretch - finalStretchAmount, Math.max(minStretch - finalStretchAmount, this.mobileStretch)); finalStretchAmount += this.mobileStretch;
    }
    return finalStretchAmount;
  }
}