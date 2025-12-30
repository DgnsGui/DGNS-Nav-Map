if (script.onAwake) {
    script.onAwake();
    return;
}
function checkUndefined(property, showIfData) {
    for (var i = 0; i < showIfData.length; i++) {
        if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]) {
            return;
        }
    }
    if (script[property] == undefined) {
        throw new Error("Input " + property + " was not provided for the object " + script.getSceneObject().name);
    }
}
// @input SceneObject listContainer {"hint":"Container principal de la liste (l'ovale)"}
// @input AssignableType closeButton {"hint":"Bouton X pour fermer la liste"}
// @input Asset.ObjectPrefab listItemPrefab {"hint":"Prefab pour un item de liste (doit contenir: PinchButton, 2x Text, 2x Visual Indicators)"}
// @input SceneObject listItemsParent {"hint":"Parent où instancier les items (ScrollView content)"}
// @input float hiddenPositionY {"hint":"Position Y quand caché"}
// @input float visiblePositionY = 15 {"hint":"Position Y quand visible"}
// @input float animationDuration = 0.5 {"hint":"Durée de l'animation (secondes)"}
// @input bool enableDebugLogs = true {"hint":"Active les logs détaillés"}
// @input string toggleButtonName = "ToggleButton" {"hint":"Nom du SceneObject contenant le PinchButton toggle"}
// @input string nameTextName = "NameText" {"hint":"Nom du SceneObject contenant le Text du nom"}
// @input string addressTextName = "AddressText" {"hint":"Nom du SceneObject contenant le Text de l'adresse"}
// @input string toggleOnVisualName = "ToggleOn" {"hint":"Nom du SceneObject visual ON"}
// @input string toggleOffVisualName = "ToggleOff" {"hint":"Nom du SceneObject visual OFF"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/Untitled TypeScript");
Object.setPrototypeOf(script, Module.PlacesListController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("listContainer", []);
    checkUndefined("closeButton", []);
    checkUndefined("listItemPrefab", []);
    checkUndefined("listItemsParent", []);
    checkUndefined("hiddenPositionY", []);
    checkUndefined("visiblePositionY", []);
    checkUndefined("animationDuration", []);
    checkUndefined("enableDebugLogs", []);
    checkUndefined("toggleButtonName", []);
    checkUndefined("nameTextName", []);
    checkUndefined("addressTextName", []);
    checkUndefined("toggleOnVisualName", []);
    checkUndefined("toggleOffVisualName", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
