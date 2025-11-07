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
// @input SceneObject containerFrame {"hint":"Le ContainerFrame qui contient la map et l'interface"}
// @input Asset.Material mapTileMaterial {"hint":"Le material MapTile qui contient le shader avec le paramètre exposé"}
// @input string parameterScriptName = "Mask_Radius" {"hint":"Script Name du paramètre dans le Material Graph"}
// @input float baseMaskRadius = 1 {"hint":"Valeur de base du mask radius"}
// @input float baseScale = 1 {"hint":"Scale de base du ContainerFrame"}
// @input float testRadius = 0.5 {"hint":"Test - Changer pour tester la connection"}
// @input bool debugMode = true {"hint":"Activer le mode debug"}
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
Object.setPrototypeOf(script, Module.MapMaskScaler.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("containerFrame", []);
    checkUndefined("mapTileMaterial", []);
    checkUndefined("parameterScriptName", []);
    checkUndefined("baseMaskRadius", []);
    checkUndefined("baseScale", []);
    checkUndefined("testRadius", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
