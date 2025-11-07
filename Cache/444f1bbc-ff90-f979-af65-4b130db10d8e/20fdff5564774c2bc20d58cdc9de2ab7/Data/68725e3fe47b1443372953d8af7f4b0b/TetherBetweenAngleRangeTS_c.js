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
// @input SceneObject target {"hint":"Target object that the content should follow"}
// @input float angleThreshold = 45 {"hint":"Minimum angle (in degrees) required to trigger repositioning"}
// @input float verticalDistanceThreshold = 150 {"hint":"Minimum vertical distance required to trigger repositioning"}
// @input float horizontalDistanceThreshold = 150 {"hint":"Minimum horizontal distance required to trigger repositioning"}
// @input vec3 offset = {0,0,-100} {"hint":"Offset for positioning content relative to target"}
// @input float lerpSpeed = 5 {"hint":"Speed of position lerping"}
// @input bool showDebug {"hint":"Show debug information"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Solvers.lspkg/TS/TetherBetweenAngleRangeTS");
Object.setPrototypeOf(script, Module.TetherBetweenAngleRangeTS.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    if (script.onAwake) {
       script.onAwake();
    }
});
