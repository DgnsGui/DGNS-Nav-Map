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
// @input SceneObject musicContainer {"hint":"Le container du panneau musique (ex: ovale avec boutons play/pause)"}
// @input float hiddenPositionY = -15 {"hint":"Position Y cachée (en bas)"}
// @input float visiblePositionY {"hint":"Position Y visible (au-dessus)"}
// @input float animationDuration = 0.4 {"hint":"Durée de l'animation (secondes)"}
// @input bool enableDebugLogs = true {"hint":"Active les logs détaillés"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/MusicPlayerAnimator");
Object.setPrototypeOf(script, Module.MusicPlayerAnimator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("musicContainer", []);
    checkUndefined("hiddenPositionY", []);
    checkUndefined("visiblePositionY", []);
    checkUndefined("animationDuration", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
