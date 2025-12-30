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
// @input SceneObject placesClamContainer {"hint":"Le container du Places Clam (l'ovale avec la liste)"}
// @input float baseVisibleY = 15 {"hint":"Position Y quand le container est visible (valeur de base, sans AI)"}
// @input float hiddenOffset = -30 {"hint":"Offset Y pour cacher le container"}
// @input float animationDuration = 0.5 {"hint":"Durée de toutes les animations (secondes)"}
// @input bool enableDebugLogs {"hint":"Active les logs détaillés"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/PlacesClamAnimator");
Object.setPrototypeOf(script, Module.PlacesClamAnimator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("placesClamContainer", []);
    checkUndefined("baseVisibleY", []);
    checkUndefined("hiddenOffset", []);
    checkUndefined("animationDuration", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
