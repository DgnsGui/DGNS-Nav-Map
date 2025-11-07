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
// @input SceneObject targetObject {"hint":"Objet à déplacer sur l'axe Z"}
// @input float moveDistance = 10 {"hint":"Distance de déplacement sur l'axe Z (positive = vers l'avant)"}
// @input float animationDuration = 0.5 {"hint":"Durée de l'animation en secondes"}
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
var Module = require("../../../Modules/Src/Assets/ContainerAnimator 2");
Object.setPrototypeOf(script, Module.ZToggleMover.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("pinchButton", []);
    checkUndefined("targetObject", []);
    checkUndefined("moveDistance", []);
    checkUndefined("animationDuration", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
