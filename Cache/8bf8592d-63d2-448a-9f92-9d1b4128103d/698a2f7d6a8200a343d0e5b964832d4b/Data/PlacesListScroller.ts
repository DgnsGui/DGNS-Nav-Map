// PlacesListScroller.ts

import { ScrollWindow } from "SpectaclesUIKit.lspkg/Scripts/Components/ScrollWindow/ScrollWindow";

@component
export class PlacesListScroller extends BaseScriptComponent {
  @input
  scrollWindow: ScrollWindow;

  @input
  contentParent: SceneObject; // ← Assigne ici le SceneObject qui contient tous les items de la liste (placesListParent dans MapComponent)

  @input
  itemSpacing: number = -5; // ← Même valeur que dans MapComponent.placeItemSpacing

  private totalHeight: number = 0;
  private itemHeight: number = 0;
  private previousChildCount: number = 0;

  onAwake() {
    if (!this.scrollWindow) {
      print("[PlacesListScroller] ERREUR : ScrollWindow non assigné dans l'inspecteur !");
      return;
    }

    if (!this.contentParent) {
      print("[PlacesListScroller] ERREUR : contentParent non assigné dans l'inspecteur !");
      return;
    }

    // On vérifie régulièrement si de nouveaux items ont été ajoutés
    this.createEvent("LateUpdateEvent").bind(this.checkForUpdates.bind(this));
  }

  private checkForUpdates(): void {
    const childCount = this.contentParent.getChildrenCount();

    // Rien à faire si pas d'items
    if (childCount === 0) {
      return;
    }

    // Si le nombre d'items a changé ou si on n'a jamais calculé
    if (childCount !== this.previousChildCount || this.totalHeight === 0) {
      this.previousChildCount = childCount;
      this.calculateDimensions();
      this.updateScrollDimensions();
    }
  }

  private calculateDimensions(): void {
    const firstChild = this.contentParent.getChild(0);
    if (!firstChild) {
      return;
    }

    const screenTransform = firstChild.getComponent("ScreenTransform");
    if (!screenTransform) {
      print("[PlacesListScroller] ERREUR : Le premier item n'a pas de ScreenTransform !");
      return;
    }

    // Hauteur d'un item (différence entre anchors top et bottom)
    this.itemHeight = screenTransform.anchors.top - screenTransform.anchors.bottom;

    if (this.itemHeight <= 0) {
      print("[PlacesListScroller] AVERTISSEMENT : itemHeight calculée ≤ 0, vérifie les anchors de l'item prefab");
      this.itemHeight = 10; // fallback minimal pour éviter division par zéro
    }

    const childCount = this.contentParent.getChildrenCount();

    // Espacement total entre les items
    const spacingTotal = Math.abs(this.itemSpacing) * (childCount - 1);

    // Hauteur totale du contenu
    this.totalHeight = childCount * this.itemHeight + spacingTotal;

    print(`[PlacesListScroller] ${childCount} items détectés → hauteur item = ${this.itemHeight}, hauteur totale = ${this.totalHeight}`);
  }

  private updateScrollDimensions(): void {
    if (this.totalHeight === 0 || this.itemHeight === 0) {
      return;
    }

    const windowSize = this.scrollWindow.getWindowSize();

    // Dimensions du contenu scrollable : même largeur que la fenêtre, hauteur totale calculée
    const scrollDimensions = new vec2(windowSize.x, this.totalHeight);

    this.scrollWindow.setScrollDimensions(scrollDimensions);

    // Remet le scroll tout en haut après la mise à jour de la liste
    // scrollPositionNormalized : Y = 1 → tout en haut, Y = -1 → tout en bas
    this.scrollWindow.scrollPositionNormalized = new vec2(0, 1);

    print(`[PlacesListScroller] Scroll mis à jour → windowSize=${windowSize}, scrollDimensions=${scrollDimensions}`);
  }

  /**
   * Méthode publique pour forcer une mise à jour manuelle du scroll
   * Utile si tu veux l'appeler depuis un autre script (ex: après populatePlacesList)
   */
  public refreshScroll(): void {
    this.previousChildCount = 0;
    this.totalHeight = 0;
    this.itemHeight = 0;
    this.checkForUpdates();
  }
}