// PlacesListScroller.ts
import { ScrollWindow } from "SpectaclesUIKit.lspkg/Scripts/Components/ScrollWindow/ScrollWindow";

@component
export class PlacesListScroller extends BaseScriptComponent {
  @input
  scrollWindow: ScrollWindow;

  @input
  contentParent: SceneObject; // ← Le placesListParent de MapComponent

  @input
  itemSpacing: number = -5; // Même valeur que dans MapComponent

  @input
  fallbackItemCount: number = 10;

  private totalHeight: number = 0;
  private itemHeight: number = 0; // On va le calculer à partir du premier item

  onAwake() {
    if (!this.scrollWindow) {
      print("[PlacesListScroller] ERREUR : ScrollWindow non assigné !");
      return;
    }

    if (!this.contentParent) {
      print("[PlacesListScroller] ERREUR : contentParent non assigné !");
      return;
    }

    // Attendre que la liste soit peuplée (fallback ou vraies données)
    this.createEvent("UpdateEvent").bind(() => {
      this.updateScrollDimensions();
    });

    // On s'abonne à l'événement quand MapComponent ajoute des items
    // Mais comme on n'a pas d'événement direct, on check régulièrement si y'a des enfants
    this.createEvent("LateUpdateEvent").bind(this.checkForNewItems.bind(this));
  }

  private checkForNewItems(): void {
    if (this.contentParent.getChildrenCount() === 0) return;

    // On calcule la hauteur totale seulement si on ne l'a pas encore fait ou si le nombre d'items a changé
    const childCount = this.contentParent.getChildrenCount();
    if (childCount > 0 && this.totalHeight === 0) {
      this.calculateItemHeightAndTotal();
      this.updateScrollDimensions();
    } else if (childCount > 0) {
      // Si de nouveaux items sont ajoutés dynamiquement (rare, mais au cas où)
      this.calculateItemHeightAndTotal();
      this.updateScrollDimensions();
    }
  }

  private calculateItemHeightAndTotal(): void {
    const firstChild = this.contentParent.getChild(0);
    if (!firstChild) return;

    const screenTransform = firstChild.getComponent("ScreenTransform");
    if (!screenTransform) {
      print("[PlacesListScroller] Premier item n'a pas de ScreenTransform !");
      return;
    }

    // Hauteur de l'item (anchors top/bottom ou taille fixe)
    const itemHeightY = screenTransform.anchors.top - screenTransform.anchors.bottom;
    this.itemHeight = itemHeightY;

    const childCount = this.contentParent.getChildrenCount();
    const spacingTotal = Math.abs(this.itemSpacing) * (childCount - 1);
    this.totalHeight = childCount * itemHeightY + spacingTotal;

    print(`[PlacesListScroller] ${childCount} items détectés → hauteur totale = ${this.totalHeight}`);
  }

  private updateScrollDimensions(): void {
    if (this.totalHeight === 0 || this.itemHeight === 0) return;

    // Taille de la fenêtre visible (le container du ScrollWindow)
    const windowSize = this.scrollWindow.getWindowSize();

    // Dimensions du contenu scrollable
    const contentWidth = windowSize.x; // Même largeur que la fenêtre
    const contentHeight = this.totalHeight;

    const scrollDimensions = new vec2(contentWidth, contentHeight);

    this.scrollWindow.setScrollDimensions(scrollDimensions);

    // Optionnel : repositionner au top après mise à jour
    this.scrollWindow.scrollPosition = new vec2(0, this.scrollWindow.topEdge);

    print(`[PlacesListScroller] Scroll activé : window=${windowSize}, content=${scrollDimensions}`);
  }

  // Méthode publique pour forcer la mise à jour (au cas où)
  public refreshScroll(): void {
    this.totalHeight = 0;
    this.itemHeight = 0;
    this.checkForNewItems();
  }
}