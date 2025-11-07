if (script.onAwake) {
	script.onAwake();
	return;
};
function checkUndefined(property, showIfData){
   for (var i = 0; i < showIfData.length; i++){
       if (showIfData[i][0] && script[showIfData[i][0]] != showIfData[i][1]){
           return;
       }
   }
   if (script[property] == undefined){
      throw new Error('Input ' + property + ' was not provided for the object ' + script.getSceneObject().name);
   }
}
// @input SceneObject mapSceneObject
// @input AssignableType mapComponent
// @input Component.ColliderComponent fullMapCollider
// @input Component.ColliderComponent miniMapCollider
// @input bool enableStretchZ = true {"hint":"Toggles forward stretch for manipulating objects from afar."}
// @input bool showStretchZProperties {"showIf":"enableStretchZ", "showIfValue":true}
// @input float zStretchFactorMin = 1 {"hint":"Z multiplier on the near end of the stretch scale", "showIf":"showStretchZProperties", "showIfValue":true}
// @input float zStretchFactorMax = 12 {"hint":"Z multiplier on the far end of the stretch scale", "showIf":"showStretchZProperties", "showIfValue":true}
// @input bool useFilter = true {"hint":"Apply filtering to smooth manipulation"}
// @input float minCutoff = 2 {"showIf":"showFilterProperties", "showIfValue":true}
// @input float beta = 0.015 {"showIf":"showFilterProperties", "showIfValue":true}
// @input float dcutoff = 1 {"showIf":"showFilterProperties", "showIfValue":true}
var scriptPrototype = Object.getPrototypeOf(script);
if (!global.BaseScriptComponent){
   function BaseScriptComponent(){}
   global.BaseScriptComponent = BaseScriptComponent;
   global.BaseScriptComponent.prototype = scriptPrototype;
   global.BaseScriptComponent.prototype.__initialize = function(){};
   global.BaseScriptComponent.getTypeName = function(){
       throw new Error("Cannot get type name from the class, not decorated with @component");
   }
}
var Module = require("../../../../Modules/Src/Assets/Scripts/MapManipulation");
Object.setPrototypeOf(script, Module.InteractableManipulation.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapSceneObject", []);
    checkUndefined("mapComponent", []);
    checkUndefined("fullMapCollider", []);
    checkUndefined("miniMapCollider", []);
    checkUndefined("enableStretchZ", []);
    checkUndefined("showStretchZProperties", [["enableStretchZ",true]]);
    checkUndefined("zStretchFactorMin", [["showStretchZProperties",true]]);
    checkUndefined("zStretchFactorMax", [["showStretchZProperties",true]]);
    checkUndefined("useFilter", []);
    checkUndefined("minCutoff", [["showFilterProperties",true]]);
    checkUndefined("beta", [["showFilterProperties",true]]);
    checkUndefined("dcutoff", [["showFilterProperties",true]]);
    if (script.onAwake) {
       script.onAwake();
    }
});
