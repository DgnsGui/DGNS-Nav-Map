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
// @input AssignableType triggerButton {"hint":"Bouton qui déclenche l'animation (pinch)"}
// @input SceneObject targetObject {"hint":"Objet à animer (le container du tutoriel)"}
// @input float moveDistanceY = -15 {"hint":"Distance de déplacement vers le bas (Y négatif recommandé)"}
// @input float moveDistanceZ = 20 {"hint":"Distance de déplacement vers l'avant (Z positif recommandé)"}
// @input float animationDuration = 0.6 {"hint":"Durée de l'animation en secondes"}
// @input string easingType = "easeOutBack" {"hint":"Type d'easing (easeOutBack recommandé pour l'apparition)"}
// @input bool enableDebugLogs {"hint":"Activer les logs de debug"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/TutorialAnimator");
Object.setPrototypeOf(script, Module.TutorialAnimator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("triggerButton", []);
    checkUndefined("targetObject", []);
    checkUndefined("moveDistanceY", []);
    checkUndefined("moveDistanceZ", []);
    checkUndefined("animationDuration", []);
    checkUndefined("easingType", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
