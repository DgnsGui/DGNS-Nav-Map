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
// @input Asset.RemoteServiceModule remoteServiceModule
// @input AssignableType mapComponent
// @input string openAIApiKey {"hint":"Votre clé API OpenAI"}
// @input string openAIModel = "gpt-4" {"hint":"Modèle OpenAI à utiliser"}
// @input float maxTokens = 150 {"hint":"Nombre maximum de tokens pour la réponse"}
// @input float temperature = 0.7 {"hint":"Temperature pour la créativité (0-2)"}
// @input bool enableTextToSpeech {"hint":"Active le Text-to-Speech pour lire la réponse"}
// @input Component.Text responseText
// @input Component.AudioComponent audioComponent {"hint":"Audio component pour jouer le son TTS"}
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
    checkUndefined("remoteServiceModule", []);
    checkUndefined("mapComponent", []);
    checkUndefined("openAIApiKey", []);
    checkUndefined("openAIModel", []);
    checkUndefined("maxTokens", []);
    checkUndefined("temperature", []);
    checkUndefined("enableTextToSpeech", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
