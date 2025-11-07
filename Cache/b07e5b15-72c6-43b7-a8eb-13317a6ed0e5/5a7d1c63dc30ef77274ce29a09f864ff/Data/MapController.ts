// =========================
// MapController.ts (version corrigée par votre assistante dévouée)
// =========================

import { tweenToPosition } from "./MapUtils";
import { log } from "./Logger";

const CENTER_MAP_TWEEN_DURATION = 0.5;

export class MapController {
    private mapObject: SceneObject;
    private userPin: SceneObject;
    private onMapCenteredEvent = new Event();
    public onMapCentered = this.onMapCenteredEvent.publicApi();
    private mapScale: number = 1.0;
    private isDragging: boolean = false;
    private shouldAutoCenter: boolean = false; // <-- Désactive le recentrage automatique

    constructor(mapObject: SceneObject, userPin: SceneObject) {
        this.mapObject = mapObject;
        this.userPin = userPin;
    }

    /**
     * Appelé lorsqu'une manipulation (pinch/scroll) débute
     */
    onManipulationStart(): void {
        this.isDragging = true;
        log.d("MapController", "Manipulation start");
    }

    /**
     * Appelé lorsque la manipulation se termine
     */
    onManipulationEnd(): void {
        this.isDragging = false;
        log.d("MapController", "Manipulation end");

        // 🔧 Ancienne ligne problématique :
        // this.centerMap();

        // ✅ Nouvelle logique : ne recentre que si explicitement activé
        if (this.shouldAutoCenter) {
            this.centerMap();
        }
    }

    /**
     * Centre la carte sur le pin utilisateur
     */
    centerMap(): void {
        if (!this.userPin || !this.mapObject) {
            log.w("MapController", "centerMap() called but mapObject or userPin is missing");
            return;
        }

        const userPos = this.userPin.getTransform().getWorldPosition();
        const mapTransform = this.mapObject.getTransform();
        const currentPos = mapTransform.getWorldPosition();

        // Tween vers le centre
        tweenToPosition(mapTransform, currentPos, userPos, CENTER_MAP_TWEEN_DURATION, () => {
            this.onMapCenteredEvent.invoke();
            log.i("MapController", "Map centered on user");
        });
    }

    /**
     * Permet de définir si le recentrage automatique est activé
     */
    setAutoCenter(enabled: boolean): void {
        this.shouldAutoCenter = enabled;
        log.i("MapController", "AutoCenter set to: " + enabled);
    }

    /**
     * Exemple de mise à jour du zoom / échelle
     */
    updateMapScale(scale: number): void {
        this.mapScale = scale;
        this.mapObject.getTransform().setWorldScale(new vec3(scale, scale, scale));
    }

    /**
     * Vérifie si la carte est actuellement centrée
     */
    isMapCentered(): boolean {
        // Ici vous pouvez raffiner le test selon votre logique de distance
        return false;
    }
}
