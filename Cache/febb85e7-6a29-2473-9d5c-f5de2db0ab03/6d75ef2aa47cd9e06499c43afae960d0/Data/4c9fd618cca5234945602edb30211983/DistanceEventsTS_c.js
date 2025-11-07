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
// @input SceneObject target {"hint":"Target to measure distance from"}
// @input float[] distances = {} {"hint":"Distances that will trigger events when crossed (in meters)"}
// @input Component.ScriptComponent[] events = {} {"hint":"Script components (like DistanceEventsCallbacks) that have the callback functions"}
// @input string[] eventFunctions = {} {"hint":"Function names to call on the corresponding event scripts (e.g. 'onDistanceThresholdCrossed')"}
// @input bool triggerOnGreaterThan = true {"hint":"Whether to trigger when distance becomes greater than threshold (true) or less than threshold (false)"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Packages/Solvers.lspkg/TS/DistanceEventsTS");
Object.setPrototypeOf(script, Module.DistanceEventsTS.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    if (script.onAwake) {
       script.onAwake();
    }
});
