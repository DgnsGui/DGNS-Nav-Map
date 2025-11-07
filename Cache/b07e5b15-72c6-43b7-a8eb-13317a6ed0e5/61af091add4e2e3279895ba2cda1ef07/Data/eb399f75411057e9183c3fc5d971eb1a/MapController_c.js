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
// @input Asset.MapModule mapModule
// @input Asset.ObjectPrefab mapTilePrefab
// @input Asset.Material lineMaterial
// @input Asset.ObjectPrefab mapRenderPrefab
// @input AssignableType placesProvider
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"=== DEBUG CONTROLS ==="}
// @input bool enableAutoFollowLocation = true {"hint":"Active le suivi automatique de la position utilisateur"}
// @input bool enableAutoRecenter {"hint":"Active le recentrage automatique de la carte"}
// @input bool enableLocationUpdates = true {"hint":"Active la mise à jour automatique de la position"}
// @input bool enableMapRotation = true {"hint":"Active les rotations de la carte"}
// @input bool enableDetailedLogs {"hint":"Active les logs détaillés pour debug"}
// @input bool forceResetViewScrolled {"hint":"Force le flag viewScrolled à false (pour debug)"}
// @input bool blockAutoRecenter = true {"hint":"Bloque complètement le recentrage automatique"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
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
    checkUndefined("enableAutoFollowLocation", []);
    checkUndefined("enableAutoRecenter", []);
    checkUndefined("enableLocationUpdates", []);
    checkUndefined("enableMapRotation", []);
    checkUndefined("enableDetailedLogs", []);
    checkUndefined("forceResetViewScrolled", []);
    checkUndefined("blockAutoRecenter", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
