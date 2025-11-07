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
// @input float tileCount = 2
// @input SceneObject mapRenderParent
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"Zoom level: 8 far zoom , 21 close zoom"}
// @input float mapZoomLevel {"widget":"slider", "min":8, "max":21, "step":1}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"If user pin should be shown in the map"}
// @input bool showUserPin
// @ui {"widget":"group_start", "label":"User Pin", "showIf":"showUserPin", "showIfValue":true}
// @input Asset.ObjectPrefab userPinVisual
// @input vec2 userPinScale
// @input bool userPinAlignedWithOrientation
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"Map Pins"}
// @ui {"widget":"label", "label":"Make sure your Pin Prefab has ScreenTransform"}
// @input Asset.ObjectPrefab mapPinPrefab
// @input bool mapPinsRotated {"hint":"All the map pins will rotate according to map rotation if enabled"}
// @input float mapPinCursorDetectorSize = 0.02 {"hint":"A circle shape detector is used to detect cursor"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"Interactions"}
// @input bool enableScrolling
// @input float scrollingFriction = 4 {"hint":"Contrôle l'inertie de la carte. Plus la valeur est élevée, plus la carte s'arrête vite. 0 = pas de friction."}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"For setting map location to custom location (not following user location)"}
// @input bool setMapToCustomLocation
// @ui {"widget":"group_start", "label":"Custom Location", "showIf":"setMapToCustomLocation", "showIfValue":true}
// @input string longitude
// @input string latitude
// @input float rotation
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"Rotations"}
// @input bool isMinimapAutoRotate
// @input bool enableMapSmoothing
// @ui {"widget":"label", "label":"How often map should be updated (seconds)"}
// @input float mapUpdateThreshold
// @input bool startedAsMiniMap
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"Auto-Rotation Control"}
// @ui {"widget":"label", "label":"PinchButton to toggle minimap auto-rotation"}
// @input AssignableType autoRotateToggleButton
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/MapComponent/Scripts/MapComponent");
Object.setPrototypeOf(script, Module.MapComponent.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("tileCount", []);
    checkUndefined("mapRenderParent", []);
    checkUndefined("mapZoomLevel", []);
    checkUndefined("showUserPin", []);
    checkUndefined("userPinVisual", [["showUserPin",true]]);
    checkUndefined("userPinScale", [["showUserPin",true]]);
    checkUndefined("userPinAlignedWithOrientation", [["showUserPin",true]]);
    checkUndefined("mapPinPrefab", []);
    checkUndefined("mapPinsRotated", []);
    checkUndefined("mapPinCursorDetectorSize", []);
    checkUndefined("enableScrolling", []);
    checkUndefined("scrollingFriction", []);
    checkUndefined("setMapToCustomLocation", []);
    checkUndefined("longitude", [["setMapToCustomLocation",true]]);
    checkUndefined("latitude", [["setMapToCustomLocation",true]]);
    checkUndefined("rotation", [["setMapToCustomLocation",true]]);
    checkUndefined("isMinimapAutoRotate", []);
    checkUndefined("enableMapSmoothing", []);
    checkUndefined("mapUpdateThreshold", []);
    checkUndefined("startedAsMiniMap", []);
    checkUndefined("autoRotateToggleButton", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
