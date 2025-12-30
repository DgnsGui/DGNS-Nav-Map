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
// @input SceneObject listContainer {"hint":"Container principal de la liste (ScrollWindowAnchor ou parent)"}
// @input AssignableType closeButton {"hint":"Bouton X pour fermer la liste"}
// @input float hiddenPositionY {"hint":"Position Y quand caché"}
// @input float visiblePositionY = 15 {"hint":"Position Y quand visible"}
// @input float animationDuration = 0.5 {"hint":"Durée de l'animation (secondes)"}
// @ui {"widget":"separator"}
// @ui {"widget":"label", "label":"=== PLACE SLOTS (10 slots) ==="}
// @ui {"widget":"group_start", "label":"Place 0"}
// @input SceneObject place0Object
// @input SceneObject place0Toggle
// @input SceneObject place0Capsule
// @input Component.Text place0Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 1"}
// @input SceneObject place1Object
// @input SceneObject place1Toggle
// @input SceneObject place1Capsule
// @input Component.Text place1Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 2"}
// @input SceneObject place2Object
// @input SceneObject place2Toggle
// @input SceneObject place2Capsule
// @input Component.Text place2Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 3"}
// @input SceneObject place3Object
// @input SceneObject place3Toggle
// @input SceneObject place3Capsule
// @input Component.Text place3Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 4"}
// @input SceneObject place4Object
// @input SceneObject place4Toggle
// @input SceneObject place4Capsule
// @input Component.Text place4Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 5"}
// @input SceneObject place5Object
// @input SceneObject place5Toggle
// @input SceneObject place5Capsule
// @input Component.Text place5Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 6"}
// @input SceneObject place6Object
// @input SceneObject place6Toggle
// @input SceneObject place6Capsule
// @input Component.Text place6Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 7"}
// @input SceneObject place7Object
// @input SceneObject place7Toggle
// @input SceneObject place7Capsule
// @input Component.Text place7Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 8"}
// @input SceneObject place8Object
// @input SceneObject place8Toggle
// @input SceneObject place8Capsule
// @input Component.Text place8Text
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Place 9"}
// @input SceneObject place9Object
// @input SceneObject place9Toggle
// @input SceneObject place9Capsule
// @input Component.Text place9Text
// @ui {"widget":"group_end"}
// @ui {"widget":"separator"}
// @input bool enableDebugLogs = true {"hint":"Active les logs détaillés"}
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Assets/Places List Manager 2");
Object.setPrototypeOf(script, Module.PlacesListController.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("listContainer", []);
    checkUndefined("closeButton", []);
    checkUndefined("hiddenPositionY", []);
    checkUndefined("visiblePositionY", []);
    checkUndefined("animationDuration", []);
    checkUndefined("place0Object", []);
    checkUndefined("place0Toggle", []);
    checkUndefined("place0Capsule", []);
    checkUndefined("place0Text", []);
    checkUndefined("place1Object", []);
    checkUndefined("place1Toggle", []);
    checkUndefined("place1Capsule", []);
    checkUndefined("place1Text", []);
    checkUndefined("place2Object", []);
    checkUndefined("place2Toggle", []);
    checkUndefined("place2Capsule", []);
    checkUndefined("place2Text", []);
    checkUndefined("place3Object", []);
    checkUndefined("place3Toggle", []);
    checkUndefined("place3Capsule", []);
    checkUndefined("place3Text", []);
    checkUndefined("place4Object", []);
    checkUndefined("place4Toggle", []);
    checkUndefined("place4Capsule", []);
    checkUndefined("place4Text", []);
    checkUndefined("place5Object", []);
    checkUndefined("place5Toggle", []);
    checkUndefined("place5Capsule", []);
    checkUndefined("place5Text", []);
    checkUndefined("place6Object", []);
    checkUndefined("place6Toggle", []);
    checkUndefined("place6Capsule", []);
    checkUndefined("place6Text", []);
    checkUndefined("place7Object", []);
    checkUndefined("place7Toggle", []);
    checkUndefined("place7Capsule", []);
    checkUndefined("place7Text", []);
    checkUndefined("place8Object", []);
    checkUndefined("place8Toggle", []);
    checkUndefined("place8Capsule", []);
    checkUndefined("place8Text", []);
    checkUndefined("place9Object", []);
    checkUndefined("place9Toggle", []);
    checkUndefined("place9Capsule", []);
    checkUndefined("place9Text", []);
    checkUndefined("enableDebugLogs", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
