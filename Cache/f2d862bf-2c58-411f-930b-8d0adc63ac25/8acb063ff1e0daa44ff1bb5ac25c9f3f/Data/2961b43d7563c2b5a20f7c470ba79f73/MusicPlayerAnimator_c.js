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
// @input SceneObject musicObject {"hint":"Le SceneObject du lecteur musique (ex: MusicPlayer)"}
// @input float visibleZ {"hint":"Position Z quand visible (position de base, ex: 0.0)"}
// @input float hiddenZ = -0.5 {"hint":"Position Z quand reculé (ex: -0.5)"}
// @input float animationDuration = 0.3 {"hint":"Durée de l'animation (secondes)"}
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
    checkUndefined("musicObject", []);
    checkUndefined("visibleZ", []);
    checkUndefined("hiddenZ", []);
    checkUndefined("animationDuration", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
