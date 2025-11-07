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
// @input Asset.AudioTrackAsset[] localTracks
// @input string[] localTrackTitles
// @input string[] localTrackArtists
// @input Asset.RemoteReferenceAsset[] remoteTracks
// @input string[] remoteTrackTitles
// @input string[] remoteTrackArtists
// @input Component.AudioComponent audioComponent
// @input Component.ScriptComponent playPauseButton
// @input Component.ScriptComponent nextTrackButton
// @input Component.ScriptComponent prevTrackButton
// @input SceneObject playIcon
// @input SceneObject pauseIcon
// @input Component.Text trackTitleText
// @input Component.Text artistNameText
// @input bool loopPlayback = true
// @input number volume = 1
if (!global.BaseScriptComponent) {
    function BaseScriptComponent() {}
    global.BaseScriptComponent = BaseScriptComponent;
    global.BaseScriptComponent.prototype = Object.getPrototypeOf(script);
    global.BaseScriptComponent.prototype.__initialize = function () {};
    global.BaseScriptComponent.getTypeName = function () {
        throw new Error("Cannot get type name from the class, not decorated with @component");
    };
}
var Module = require("../../../Modules/Src/Packages/SimpleMusicPlayer");
Object.setPrototypeOf(script, Module.SimpleMusicPlayerManager.prototype);
script.__initialize();
let awakeEvent = script.createEvent("OnAwakeEvent");
awakeEvent.bind(() => {
    checkUndefined("localTracks", []);
    checkUndefined("localTrackTitles", []);
    checkUndefined("localTrackArtists", []);
    checkUndefined("remoteTracks", []);
    checkUndefined("remoteTrackTitles", []);
    checkUndefined("remoteTrackArtists", []);
    checkUndefined("audioComponent", []);
    checkUndefined("playPauseButton", []);
    checkUndefined("nextTrackButton", []);
    checkUndefined("prevTrackButton", []);
    checkUndefined("playIcon", []);
    checkUndefined("pauseIcon", []);
    checkUndefined("trackTitleText", []);
    checkUndefined("artistNameText", []);
    checkUndefined("loopPlayback", []);
    checkUndefined("volume", []);
    if (script.onAwake) {
       script.onAwake();
    }
});
