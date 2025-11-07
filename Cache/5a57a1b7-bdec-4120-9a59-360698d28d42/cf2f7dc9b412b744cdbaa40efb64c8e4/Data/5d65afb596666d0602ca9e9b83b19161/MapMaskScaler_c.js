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
// @input AssignableType containerFrameScript {"hint":"Faites glisser ici le composant SCRIPT ContainerFrame, pas l'objet de la scène."}
// @input AssignableType_1 mapComponent
// @input string parameterScriptName = "Mask_Radius"
// @input float baseInnerWidth = 32 {"hint":"La taille de base (largeur) de l'innerSize du ContainerFrame au démarrage."}
// @input bool debugMode
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
    checkUndefined("containerFrameScript", []);
    checkUndefined("mapComponent", []);
    checkUndefined("parameterScriptName", []);
    checkUndefined("baseInnerWidth", []);
    checkUndefined("debugMode", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
