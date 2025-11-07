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
// @input AssignableType pinchButton {"hint":"Le PinchButton qui déclenche le déplacement"}
// @input SceneObject targetObject {"hint":"Objet à déplacer"}
// @input vec3 basePosition = {0,0,0} {"hint":"Position de base (départ)"}
// @input vec3 endPosition = {0,0,10} {"hint":"Position de fin (arrivée)"}
// @input float animationDurationZ = 0.5 {"hint":"Durée de l'animation sur Z (secondes)"}
// @input float animationDurationY = 0.5 {"hint":"Durée de l'animation sur Y (secondes)"}
// @input float oscillationAmplitudeZ = 10 {"hint":"Amplitude de l'oscillation sur Z"}
// @input float oscillationAmplitudeY = 10 {"hint":"Amplitude de l'oscillation sur Y"}
// @input bool enableDebugLogs {"hint":"Active les logs dans la console"}
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
Object.setPrototypeOf(script, Module.ZToggleMover.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("pinchButton", []);
    checkUndefined("targetObject", []);
    checkUndefined("basePosition", []);
    checkUndefined("endPosition", []);
    checkUndefined("animationDurationZ", []);
    checkUndefined("animationDurationY", []);
    checkUndefined("oscillationAmplitudeZ", []);
    checkUndefined("oscillationAmplitudeY", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
