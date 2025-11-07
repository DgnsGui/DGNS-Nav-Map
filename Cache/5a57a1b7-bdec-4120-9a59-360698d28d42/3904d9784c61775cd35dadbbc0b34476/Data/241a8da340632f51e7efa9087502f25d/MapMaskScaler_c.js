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
// @input SceneObject containerFrame
// @input AssignableType mapComponent
// @input string parameterScriptName = "Mask_Radius"
// @input float baseMaskRadius = 1
// @input float baseScale = 1
// @input bool debugMode = true
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
var Module = require("../../../../../Modules/Src/Assets/MapComponent/Scripts/MapMaskScaler");
Object.setPrototypeOf(script, Module.MapMaskScaler_FinalDebug.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("containerFrame", []);
    checkUndefined("mapComponent", []);
    checkUndefined("parameterScriptName", []);
    checkUndefined("baseMaskRadius", []);
    checkUndefined("baseScale", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
