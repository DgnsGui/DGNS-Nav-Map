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
// @input SceneObject targetObject {"hint":"Objet à animer (ex: MusicPlayer)"}
// @input float recedeDistance = -0.5 {"hint":"Distance de recul sur Z (ex: -0.5)"}
// @input float duration = 0.3 {"hint":"Durée animation (secondes)"}
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
Object.setPrototypeOf(script, Module.ZToggleAnimator.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("targetObject", []);
    checkUndefined("recedeDistance", []);
    checkUndefined("duration", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
