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
exports.PlacesQuestMarkerLinker = void 0;
var __selfType = requireType("./PlacesQuestMarkerLinker");
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
/**
 * Script helper pour lier automatiquement les quest markers créés
 * aux places dans le Places Clam
 *
 * IMPORTANT: Ce fichier doit être placé dans le même dossier que MapComponent.ts
 * Par exemple: Assets/MapComponent/Scripts/PlacesQuestMarkerLinker.ts
 */
let PlacesQuestMarkerLinker = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var PlacesQuestMarkerLinker = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
        }
        onStart() {
            if (!this.mapComponent) {
                print("ERROR: MapComponent not assigned to PlacesQuestMarkerLinker!");
                return;
            }
            this.mapController = this.mapComponent.mapController;
            if (!this.mapController) {
                print("ERROR: MapController not found in MapComponent!");
                return;
            }
            // S'abonner à la création des pins pour lier les quest markers
            this.setupQuestMarkerLinking();
        }
        setupQuestMarkerLinking() {
            // Cette méthode doit être appelée après que les pins soient créés
            // et que les quest markers soient générés par le MapController
            // Option 1: Si MapController expose une liste de quest markers
            // On peut itérer dessus et les lier
            // Option 2: Hook dans le processus de création
            // Pour l'instant, on va utiliser une approche par polling
            const delayEvent = this.createEvent("DelayedCallbackEvent");
            delayEvent.bind(() => {
                this.linkExistingQuestMarkers();
            });
            delayEvent.reset(1.0); // Attendre 1 seconde après le chargement
        }
        linkExistingQuestMarkers() {
            // Accéder aux quest markers depuis MapController
            // Note: Cette partie dépend de l'implémentation de MapController
            // Vous devrez peut-être exposer une méthode publique dans MapController
            // pour obtenir la liste des quest markers
            const mapControllerAny = this.mapController;
            if (mapControllerAny.questMarkers) {
                print("Found quest markers array, linking...");
                // Parcourir tous les quest markers
                const questMarkers = mapControllerAny.questMarkers;
                for (let i = 0; i < questMarkers.length; i++) {
                    const questMarker = questMarkers[i];
                    if (questMarker && questMarker.mapPin) {
                        this.mapComponent.linkQuestMarkerToPlace(questMarker.mapPin, questMarker);
                    }
                }
                print("Quest markers linked to places!");
            }
            else {
                print("WARNING: Could not find quest markers in MapController");
                print("You may need to expose questMarkers publicly in MapController");
            }
        }
        /**
         * Appeler cette méthode manuellement si vous créez un quest marker
         * dynamiquement après le chargement initial
         */
        linkQuestMarker(pin, questMarker) {
            this.mapComponent.linkQuestMarkerToPlace(pin, questMarker);
        }
    };
    __setFunctionName(_classThis, "PlacesQuestMarkerLinker");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlacesQuestMarkerLinker = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlacesQuestMarkerLinker = _classThis;
})();
exports.PlacesQuestMarkerLinker = PlacesQuestMarkerLinker;
//# sourceMappingURL=PlacesQuestMarkerLinker.js.map