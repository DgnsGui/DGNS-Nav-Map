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
// @input AssignableType mapComponent
// @input string openAIModel = "gpt-4o-mini"
// @input float maxTokens = 150
// @input float temperature = 0.7
// @input string ttsVoice = "alloy"
// @input string ttsModel = "tts-1"
// @input Component.Text responseText
// @input SceneObject responseContainer
// @input Component.AudioComponent audioComponent
// @input Component.AudioComponent musicAudioPlayer {"hint":"AudioComponent de la musique de fond (ex: Music Audio Player)"}
// @input AssignableType_1 aiResponseAnimator
// @input bool enableDebugLogs = true
// @input float volumeDuckDelay = 0.3
// @input float minAudioDuration = 2
// @input float postAudioDelay = 0.5
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../../../Modules/Src/Assets/MapComponent/Scripts/AIMapAssistant");
Object.setPrototypeOf(script, Module.AIMapAssistant.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("mapComponent", []);
    checkUndefined("openAIModel", []);
    checkUndefined("maxTokens", []);
    checkUndefined("temperature", []);
    checkUndefined("ttsVoice", []);
    checkUndefined("ttsModel", []);
    checkUndefined("enableDebugLogs", []);
    checkUndefined("volumeDuckDelay", []);
    checkUndefined("minAudioDuration", []);
    checkUndefined("postAudioDelay", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
