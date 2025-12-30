"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesListScroller = void 0;
var __selfType = requireType("./PlacesListScroller");
function component(target) {
    target.getTypeName = function () { return __selfType; };
    if (target.prototype.hasOwnProperty("getTypeName"))
        return;
    Object.defineProperty(target.prototype, "getTypeName", {
        value: function () { return __selfType; },
        configurable: true,
        writable: true
    });
}
let PlacesListScroller = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PlacesListScroller = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.scrollWindow = this.scrollWindow;
            this.contentParent = this.contentParent; // ← Assigne ici le SceneObject qui contient tous les items de la liste (placesListParent dans MapComponent)
            this.itemSpacing = this.itemSpacing; // ← Même valeur que dans MapComponent.placeItemSpacing
            this.totalHeight = 0;
            this.itemHeight = 0;
            this.previousChildCount = 0;
        }
        __initialize() {
            super.__initialize();
            this.scrollWindow = this.scrollWindow;
            this.contentParent = this.contentParent; // ← Assigne ici le SceneObject qui contient tous les items de la liste (placesListParent dans MapComponent)
            this.itemSpacing = this.itemSpacing; // ← Même valeur que dans MapComponent.placeItemSpacing
            this.totalHeight = 0;
            this.itemHeight = 0;
            this.previousChildCount = 0;
        }
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
        checkForUpdates() {
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
        calculateDimensions() {
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
        updateScrollDimensions() {
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
        refreshScroll() {
            this.previousChildCount = 0;
            this.totalHeight = 0;
            this.itemHeight = 0;
            this.checkForUpdates();
        }
    };
    __setFunctionName(_classThis, "PlacesListScroller");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlacesListScroller = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlacesListScroller = _classThis;
})();
exports.PlacesListScroller = PlacesListScroller;
//# sourceMappingURL=PlacesListScroller.js.map