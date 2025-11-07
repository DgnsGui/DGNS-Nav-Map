// --- START OF FILE MapManipulation.ts (FINAL, COMPILES, AND WORKS) ---

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
const log = new NativeLogger(TAG); // CORRECTION : Logger redéclaré
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
  private log = new NativeLogger(TAG); // CORRECTION : Logger redéclaré
  
  private parentMapTransform: Transform;
  private rotatingGridTransform: Transform;

  private originalWorldTransform = CachedTransform;
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

  // CORRECTION : Structure des événements restaurée
  private onTranslationStartEvent = new Event<TranslateEventArg>();
  onTranslationStart: PublicApi<TranslateEventArg> = this.onTranslationStartEvent.publicApi();
  private onTranslationUpdateEvent = new Event<TranslateEventArg>();
  onTranslationUpdate: PublicApi<TranslateEventArg> = this.onTranslationUpdateEvent.publicApi();
  private onTranslationEndEvent = new Event<TranslateEventArg>();
  onTranslationEnd: PublicApi<TranslateEventArg> = this.onTranslationEndEvent.publicApi();

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
    const transformToUse = this.rotatingGridTransform || this.parentMapTransform;
    const localPosition = transformToUse.getInvertedWorldTransform().multiplyPoint(worldPosition);
    return new vec2(localPosition.x / this.colliderSizeX, localPosition.y / this.colliderSizeY);
  }

  private onTriggerUpdate(eventData: InteractorEvent): void {
    if (!this.enabled) return;
    if (this.triggeringInteractor) {
      this.singleInteractorTransform(this.triggeringInteractor);
    }
    // CORRECTION : Utilisation de la variable d'événement privée
    this.onTranslationUpdateEvent.invoke({
        interactable: this.interactable,
        startPosition: this.startTransform.position,
        currentPosition: this.parentMapTransform.getWorldPosition(),
    });
  }

  // --- Le reste du code est restauré à partir de l'original fonctionnel ---
  // --- pour garantir que la manipulation fonctionne comme avant. ---

  private singleInteractorTransform(interactor: Interactor): void {
    if (!this.isInteractorValid(interactor)) { this.log.e("Interactor must be valid"); return; }
    validate(this.parentMapTransform);
    const startPoint = interactor.startPoint ?? vec3.zero();
    const orientation = interactor.orientation ?? quat.quatIdentity();
    const direction = interactor.direction ?? vec3.zero();
    const limitRotation = quat.fromEulerVec(customGetEuler(orientation)).multiply(this.offsetRotation);
    let newPosition: vec3;
    if (this.cachedTargetingMode === TargetingMode.Direct) {
      newPosition = startPoint.add(limitRotation.multiply(this.startTransform.rotation.invert()).multiplyVec3(this.offsetPosition));
      this.updatePosition(newPosition, this.useFilter);
    } else {
      if (!this.triggeringInteractor.planecastPoint) return;
      this.smoothedStretch = MathUtils.lerp(this.smoothedStretch, this.calculateStretchFactor(interactor), getDeltaTime() * STRETCH_SMOOTH_SPEED);
      newPosition = this.triggeringInteractor.planecastPoint.add(direction.uniformScale(this.smoothedStretch));
      this.updatePosition(newPosition, this.useFilter);
    }
  }

  private updatePosition(newPosition: vec3 | null, useFilter = true) {
    if (newPosition === null) return;
    validate(this.parentMapTransform);
    newPosition.x = this.parentMapTransform.getWorldPosition().x;
    newPosition.y = this.parentMapTransform.getWorldPosition().y;
    if (useFilter) newPosition = this.translateFilter.filter(newPosition, getTime());
    this.mapComponent.updateTouch(this.getLocalPosition(newPosition));
  }
  
  private setupColliders(isMiniMap: boolean): void {
    this.miniMapCollider.enabled = isMiniMap; this.fullMapCollider.enabled = !isMiniMap;
    let shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
    if (shape.isOfType("BoxShape")) { const box = shape as BoxShape; this.colliderSizeX = box.size.x / 8; this.colliderSizeY = box.size.y / 8;
    } else if (shape.isOfType("SphereShape")) { const sphere = shape as SphereShape; this.colliderSizeX = sphere.radius; this.colliderSizeY = sphere.radius; }
  }
  private setupCallbacks(): void {
    const stopProp = (e: InteractorEvent) => { if (e.propagationPhase !== "None") e.stopPropagation(); };
    this.unsubscribeBag.push(this.interactable.onInteractorHoverEnter.add((e) => { stopProp(e); this.onHoverToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorHoverExit.add((e) => { stopProp(e); this.onHoverToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onHoverUpdate.add((e) => { stopProp(e); this.onHoverUpdate(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorTriggerStart.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onTriggerUpdate.add((e) => { stopProp(e); this.onTriggerUpdate(e); }));
    this.unsubscribeBag.push(this.interactable.onTriggerCanceled.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
    this.unsubscribeBag.push(this.interactable.onInteractorTriggerEnd.add((e) => { stopProp(e); this.onTriggerToggle(e); }));
  }
  private updateStartValues(): void {
    validate(this.parentMapTransform);
    const interactor = this.getTriggeringInteractor();
    if (!interactor) return;
    this.translateFilter.reset();
    this.startTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
  }
  private cacheTransform(): void {
    validate(this.parentMapTransform);
    this.originalWorldTransform = { transform: this.parentMapTransform.getWorldTransform(), position: this.parentMapTransform.getWorldPosition(), rotation: this.parentMapTransform.getWorldRotation(), scale: this.parentMapTransform.getWorldScale() };
  }
  private onHoverToggle(e: InteractorEvent): void { this.hoveringInteractor = this.getHoveringInteractor(); }
  private onHoverUpdate(e: InteractorEvent): void { if (this.hoveringInteractor && e.interactor.planecastPoint) this.mapComponent.updateHover(this.getLocalPosition(e.interactor.planecastPoint)); }
  private onTriggerToggle(eventData: InteractorEvent): void {
    this.triggeringInteractor = this.getTriggeringInteractor();
    if (this.triggeringInteractor) {
        this.updateStartValues();
        if (this.triggeringInteractor.planecastPoint) this.mapComponent.startTouch(this.getLocalPosition(this.triggeringInteractor.planecastPoint));
        this.onTranslationStartEvent.invoke({interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition()});
    } else {
        if (eventData.interactor.planecastPoint) this.mapComponent.endTouch(this.getLocalPosition(eventData.interactor.planecastPoint));
        this.onTranslationEndEvent.invoke({interactable: this.interactable, startPosition: this.startTransform.position, currentPosition: this.parentMapTransform.getWorldPosition()});
    }
  }
  private getHoveringInteractor(): Interactor { return this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor)[0] || null; }
  private getTriggeringInteractor(): Interactor { return this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor)[0] || null; }
  private isInteractorValid(i: Interactor): boolean { return !!(i && i.startPoint && i.orientation && i.direction && i.distanceToTarget !== null && i.isActive()); }
  private calculateStretchFactor(interactor: Interactor): number {
    if (!this.enableStretchZ) return 1;
    const startPoint = interactor.startPoint ?? vec3.zero();
    const iDist = -this.camera.getTransform().getInvertedWorldTransform().multiplyPoint(startPoint).z;
    if (this.startStretchInteractorDistance === 0) this.startStretchInteractorDistance = iDist;
    const dragAmount = iDist - this.startStretchInteractorDistance;
    const currDist = interactor.distanceToTarget ?? 0;
    const distFactor = (this.zStretchFactorMax / interactor.maxRaycastDistance) * currDist + this.zStretchFactorMin;
    const minStretch = -this.offsetPosition.length + 1;
    const maxStretch = -this.offsetPosition.length + interactor.maxRaycastDistance - 1;
    let finalAmount = MathUtils.clamp(dragAmount * distFactor, minStretch, maxStretch);
    if (interactor.inputType === InteractorInputType.Mobile) {
      const mobi = interactor as MobileInteractor;
      const dragVec = mobi.touchpadDragVector ?? vec3.zero();
      const moveAmount = dragVec.z === 0 ? dragVec.y * MOBILE_DRAG_MULTIPLIER : 0;
      this.mobileStretch += moveAmount * distFactor;
      this.mobileStretch = Math.min(maxStretch - finalAmount, Math.max(minStretch - finalAmount, this.mobileStretch));
      finalAmount += this.mobileStretch;
    }
    return finalAmount;
  }
}