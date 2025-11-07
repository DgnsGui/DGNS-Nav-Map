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
// @input SceneObject mapSceneObject
// @input AssignableType mapComponent
// @input Component.ColliderComponent fullMapCollider
// @input Component.ColliderComponent miniMapCollider
// @input float scrollSensitivity = 5 {"hint":"Contrôle la vitesse de défilement de la carte. Plus la valeur est petite, plus le défilement est lent. 1.0 = vitesse par défaut."}
// @input bool enableDebugLogs {"hint":"Active les logs de debug pour tracer les événements"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MapManipulation");
Object.setPrototypeOf(script, Module.InteractableManipulation.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapSceneObject", []);
    checkUndefined("mapComponent", []);
    checkUndefined("fullMapCollider", []);
    checkUndefined("miniMapCollider", []);
    checkUndefined("scrollSensitivity", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
