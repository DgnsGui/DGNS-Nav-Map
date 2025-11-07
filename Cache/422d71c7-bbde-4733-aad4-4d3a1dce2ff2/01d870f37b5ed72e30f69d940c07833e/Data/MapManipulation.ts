// --- START OF FILE MapManipulation.ts (CORRECTED - FINAL V2) ---

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

const TAG = "[MapManipulation]";
const log = new NativeLogger(TAG);
const CachedTransform = { transform: mat4.identity(), position: vec3.zero(), rotation: quat.quatIdentity(), scale: vec3.one() };

@component
export class InteractableManipulation extends BaseScriptComponent {
  @input("SceneObject") private mapSceneObject: SceneObject | null = null;
  @input() private mapComponent: MapComponent;
  @input() private fullMapCollider: ColliderComponent;
  @input() private miniMapCollider: ColliderComponent;

  // ... (autres inputs inchangés) ...
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
  
  private parentMapTransform: Transform;
  private rotatingGridTransform: Transform; // La référence clé !

  private originalWorldTransform = CachedTransform;
  private originalLocalTransform = CachedTransform;
  private startTransform = CachedTransform;
  private offsetPosition = vec3.zero();
  private offsetRotation = quat.quatIdentity();
  private hoveringInteractor: Interactor;
  private triggeringInteractor: Interactor;
  private cachedTargetingMode: TargetingMode = TargetingMode.None;
  private translateFilter!: OneEuroFilterVec3;
  private colliderSizeX: number;
  private colliderSizeY: number;

  onTranslationStart: PublicApi<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }> = new Event<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }>().publicApi();
  onTranslationUpdate: PublicApi<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }> = new Event<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }>().publicApi();
  onTranslationEnd: PublicApi<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }> = new Event<{ interactable: Interactable; startPosition: vec3; currentPosition: vec3; }>().publicApi();

  onAwake(): void {
    this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName());
    if (!this.interactable) throw new Error("MapManipulation requires an Interactable.");
    
    this.parentMapTransform = this.mapSceneObject.getTransform();

    this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    this.createEvent("OnDestroyEvent").bind(() => this.unsubscribeBag.forEach(u => u()));

    this.setupCallbacks();
    this.translateFilter = new OneEuroFilterVec3({ frequency: 60, minCutoff: this.minCutoff, beta: this.beta, dcutoff: this.dcutoff });
    this.mapComponent.onMiniMapToggled.add((isMiniMap: boolean) => this.setupColliders(isMiniMap));
  }

  private onStart(): void {
    this.setupColliders(this.mapComponent.startedAsMiniMap);
    if (this.mapComponent.mapController && this.mapComponent.mapController.config) {
        // *** CORRECTION #1 ICI ***
        this.rotatingGridTransform = this.mapComponent.mapController.config.gridScreenTransform.getTransform();
    } else {
        log.e("MapController not ready on Start, retrying...");
        // *** CORRECTION #2 ICI ***
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => this.onStart());
        delayedEvent.reset(0.1);
    }
  }
  
  private setupColliders(isMiniMap: boolean): void {
    this.miniMapCollider.enabled = isMiniMap;
    this.fullMapCollider.enabled = !isMiniMap;
    const shape = isMiniMap ? this.miniMapCollider.shape : this.fullMapCollider.shape;
    if (shape.isOfType("BoxShape")) {
        const boxShape = shape as BoxShape;
        this.colliderSizeX = boxShape.size.x / 8;
        this.colliderSizeY = boxShape.size.y / 8;
    }
  }

  private getLocalPosition(worldPosition: vec3): vec2 {
    if (!this.rotatingGridTransform) {
        log.w("rotatingGridTransform not yet available.");
        return vec2.zero();
    }
    const localPosition = this.rotatingGridTransform
      .getInvertedWorldTransform()
      .multiplyPoint(worldPosition);
    return new vec2(
      localPosition.x / this.colliderSizeX,
      localPosition.y / this.colliderSizeY
    );
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

  private onHoverToggle(eventData: InteractorEvent): void { if (this.enabled) this.hoveringInteractor = this.getHoveringInteractor(); }
  private onHoverUpdate(eventData: InteractorEvent): void {
      if (!this.enabled || !this.hoveringInteractor || !this.hoveringInteractor.planecastPoint) return;
      this.mapComponent.updateHover(this.getLocalPosition(this.hoveringInteractor.planecastPoint));
  }
  private onTriggerToggle(eventData: InteractorEvent): void {
      if (!this.enabled) return;
      this.triggeringInteractor = this.getTriggeringInteractor();
      if (this.triggeringInteractor && this.triggeringInteractor.planecastPoint) {
          this.mapComponent.startTouch(this.getLocalPosition(this.triggeringInteractor.planecastPoint));
      } else if (eventData.interactor.planecastPoint) {
          this.mapComponent.endTouch(this.getLocalPosition(eventData.interactor.planecastPoint));
      }
  }
  private onTriggerUpdate(eventData: InteractorEvent): void {
      if (!this.enabled || !this.triggeringInteractor || !this.triggeringInteractor.planecastPoint) return;
      this.updatePosition(this.triggeringInteractor.planecastPoint);
  }
  private updatePosition(newPosition: vec3 | null, useFilter = true) {
      if (!newPosition) return;
      if (useFilter) newPosition = this.translateFilter.filter(newPosition, getTime());
      this.mapComponent.updateTouch(this.getLocalPosition(newPosition));
  }
  private getHoveringInteractor(): Interactor { return this.interactionManager.getInteractorsByType(this.interactable.hoveringInteractor)[0] || null; }
  private getTriggeringInteractor(): Interactor { return this.interactionManager.getInteractorsByType(this.interactable.triggeringInteractor)[0] || null; }
}