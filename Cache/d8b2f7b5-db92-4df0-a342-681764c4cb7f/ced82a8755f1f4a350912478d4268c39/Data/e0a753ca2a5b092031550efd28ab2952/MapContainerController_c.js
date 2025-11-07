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
// @input AssignableType mapComponent
// @input float translationXTime = 1
// @input float translationYTime = 0.35
// @input float translationZTime = 0.35
// @input float rotationTime = 0.55
// @input float minFollowDistance = 50
// @input float maxFollowDistance = 160
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MapContainerController");
Object.setPrototypeOf(script, Module.MapContainerController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapComponent", []);
    checkUndefined("translationXTime", []);
    checkUndefined("translationYTime", []);
    checkUndefined("translationZTime", []);
    checkUndefined("rotationTime", []);
    checkUndefined("minFollowDistance", []);
    checkUndefined("maxFollowDistance", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
