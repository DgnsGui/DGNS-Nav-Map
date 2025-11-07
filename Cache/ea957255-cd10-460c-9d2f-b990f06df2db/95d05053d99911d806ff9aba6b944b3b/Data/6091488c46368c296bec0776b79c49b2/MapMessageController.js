"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapMessageController = void 0;
var __selfType = requireType("./MapMessageController");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let MapMessageController = class MapMessageController extends BaseScriptComponent {
    onAwake() {
        this.createEvent("OnStartEvent").bind(this.onStart.bind(this));
    }
    onStart() {
        this.container.renderOrder = this.renderOrder;
        this.container.closeButton.onTrigger.add(() => this.handleCloseButtonTriggered());
        this.mapComponent.subscribeOnNoNearbyPlacesFound(() => this.showMessage("No nearby places found"));
        this.mapComponent.subscribeOnNearbyPlacesFailed(() => this.showMessage("Failed to received nearby places. Please check your internet connection."));
        this.handleCloseButtonTriggered();
    }
    showMessage(message) {
        this.container.sceneObject.enabled = true;
        this.textComponent.text = message;
    }
    handleCloseButtonTriggered() {
        this.container.sceneObject.enabled = false;
        this.textComponent.text = "";
    }
};
exports.MapMessageController = MapMessageController;
exports.MapMessageController = MapMessageController = __decorate([
    component
], MapMessageController);
//# sourceMappingURL=MapMessageController.js.map