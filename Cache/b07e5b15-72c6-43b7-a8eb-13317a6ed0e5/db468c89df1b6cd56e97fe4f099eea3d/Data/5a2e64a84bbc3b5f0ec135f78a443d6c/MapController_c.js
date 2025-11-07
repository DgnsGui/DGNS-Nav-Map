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
// @input Asset.MapModule mapModule
// @input Asset.ObjectPrefab mapTilePrefab
// @input Asset.Material lineMaterial
// @input Asset.ObjectPrefab mapRenderPrefab
// @input AssignableType placesProvider
// @input float pinDragSensitivity = 1 {"hint":"Contrôle la vitesse de déplacement des pins. 1.0 = vitesse normale, 2.0 = deux fois plus rapide."}
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
var Module = require("../../../../../Modules/Src/Assets/MapComponent/Scripts/MapController");
Object.setPrototypeOf(script, Module.MapController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapModule", []);
    checkUndefined("mapTilePrefab", []);
    checkUndefined("lineMaterial", []);
    checkUndefined("mapRenderPrefab", []);
    checkUndefined("pinDragSensitivity", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
