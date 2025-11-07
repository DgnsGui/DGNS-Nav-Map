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
// @input string openAIModel = "gpt-4o-mini" {"hint":"ModÃ¨le OpenAI Ã  utiliser"}
// @input float maxTokens = 150 {"hint":"Nombre maximum de tokens pour la rÃ©ponse"}
// @input float temperature = 0.7 {"hint":"Temperature pour la crÃ©ativitÃ© (0-2)"}
// @input string ttsVoice = "alloy" {"hint":"Voix pour le TTS"}
// @input string ttsModel = "tts-1" {"hint":"ModÃ¨le TTS Ã  utiliser"}
// @input Component.Text responseText
// @input SceneObject responseContainer {"hint":"Container Frame qui contient le texte de rÃ©ponse"}
// @input Component.AudioComponent audioComponent
// @input AssignableType_1 aiResponseAnimator {"hint":"L'animateur de rÃ©ponse AI pour contrÃ´ler les animations du container"}
// @input bool enableDebugLogs = true {"hint":"Active les logs dÃ©taillÃ©s pour le debug"}
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
    if (script.onAwake) {
       script.onAwake();
    }
});
