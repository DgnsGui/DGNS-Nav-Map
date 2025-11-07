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
// @input SceneObject responseContainer {"hint":"L'objet Container Frame de la rÃ©ponse AI (le deuxiÃ¨me ovale)"}
// @input float hiddenPositionY {"hint":"Position Y quand l'ovale est cachÃ© (Ã  l'intÃ©rieur)"}
// @input float visiblePositionY = 15 {"hint":"Position Y quand l'ovale est visible (au-dessus)"}
// @input float animationDuration = 0.5 {"hint":"DurÃ©e de l'animation (secondes)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/AIFrameAnimator");
Object.setPrototypeOf(script, Module.AIResponseAnimator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("responseContainer", []);
    checkUndefined("hiddenPositionY", []);
    checkUndefined("visiblePositionY", []);
    checkUndefined("animationDuration", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
