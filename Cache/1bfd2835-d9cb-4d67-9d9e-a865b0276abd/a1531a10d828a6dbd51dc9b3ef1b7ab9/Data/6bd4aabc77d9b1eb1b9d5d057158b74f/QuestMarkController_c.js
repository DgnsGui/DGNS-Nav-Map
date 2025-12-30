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
// @input Asset.ObjectPrefab questMarkerPrefab
// @input Asset.Material inViewMaterial
// @input Asset.Material outOfViewMaterial
// @input float scale = 1
// @input float markerImageOffsetInDegree
// @input float markerHalfWidth = 5
// @input float markerHalfHeight = 5
// @input float labelHalfHeight = 0.7
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../Modules/Src/Assets/Scripts/QuestMarkController");
Object.setPrototypeOf(script, Module.QuestMarkController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapComponent", []);
    checkUndefined("questMarkerPrefab", []);
    checkUndefined("inViewMaterial", []);
    checkUndefined("outOfViewMaterial", []);
    checkUndefined("scale", []);
    checkUndefined("markerImageOffsetInDegree", []);
    checkUndefined("markerHalfWidth", []);
    checkUndefined("markerHalfHeight", []);
    checkUndefined("labelHalfHeight", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
