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
// @input AssignableType mapComponent
// @input AssignableType_1 spawnPinButton
// @input AssignableType_2 clearPinsButton
// @input AssignableType_3 zoomInButton
// @input AssignableType_4 zoomOutButton
// @input AssignableType_5 centerMapButton
// @input AssignableType_6 toggleMiniMapButton
// @input AssignableType_7 showAllButton
// @input AssignableType_8 showRestaurantsButton
// @input AssignableType_9 showCafeButton
// @input AssignableType_10 showBarsButton
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
var Module = require("../../../../Modules/Src/Assets/Scripts/MapUIController");
Object.setPrototypeOf(script, Module.MapUIController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapComponent", []);
    checkUndefined("spawnPinButton", []);
    checkUndefined("clearPinsButton", []);
    checkUndefined("zoomInButton", []);
    checkUndefined("zoomOutButton", []);
    checkUndefined("centerMapButton", []);
    checkUndefined("toggleMiniMapButton", []);
    checkUndefined("showAllButton", []);
    checkUndefined("showRestaurantsButton", []);
    checkUndefined("showCafeButton", []);
    checkUndefined("showBarsButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
