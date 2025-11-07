"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIMapAssistant = void 0;
var __selfType = requireType("./AIMapAssistant");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const NativeLogger_1 = require("SpectaclesInteractionKit.lspkg/Utils/NativeLogger");
const OpenAI_1 = require("RemoteServiceGateway.lspkg/HostedExternal/OpenAI");
const TAG = "[AIMapAssistant]";
const log = new NativeLogger_1.default(TAG);
let AIMapAssistant = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var AIMapAssistant = _classThis = class extends _classSuper {
        constructor() {
            super();
            this.mapComponent = this.mapComponent;
            this.openAIModel = this.openAIModel;
            this.maxTokens = this.maxTokens;
            this.temperature = this.temperature;
            this.ttsVoice = this.ttsVoice;
            this.ttsModel = this.ttsModel;
            this.responseText = this.responseText;
            this.responseContainer = this.responseContainer;
            this.audioComponent = this.audioComponent;
            this.musicAudioPlayer = this.musicAudioPlayer;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            // Nouveaux paramètres pour gérer le timing sur Spectacles
            this.volumeDuckDelay = this.volumeDuckDelay; // Délai avant de baisser le volume (en secondes)
            this.minAudioDuration = this.minAudioDuration; // Durée minimale avant de considérer l'audio terminé
            this.postAudioDelay = this.postAudioDelay; // Délai après la fin de l'audio avant de ranger le container
            this.isProcessing = false;
            this.wasPlaying = false;
            this.audioFinished = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            // Volume original de la musique
            this.originalMusicVolume = 1.0;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.openAIModel = this.openAIModel;
            this.maxTokens = this.maxTokens;
            this.temperature = this.temperature;
            this.ttsVoice = this.ttsVoice;
            this.ttsModel = this.ttsModel;
            this.responseText = this.responseText;
            this.responseContainer = this.responseContainer;
            this.audioComponent = this.audioComponent;
            this.musicAudioPlayer = this.musicAudioPlayer;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            // Nouveaux paramètres pour gérer le timing sur Spectacles
            this.volumeDuckDelay = this.volumeDuckDelay; // Délai avant de baisser le volume (en secondes)
            this.minAudioDuration = this.minAudioDuration; // Durée minimale avant de considérer l'audio terminé
            this.postAudioDelay = this.postAudioDelay; // Délai après la fin de l'audio avant de ranger le container
            this.isProcessing = false;
            this.wasPlaying = false;
            this.audioFinished = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            // Volume original de la musique
            this.originalMusicVolume = 1.0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.checkAudioCompletion());
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== AIMapAssistant INITIALIZED ===");
            // Sauvegarder le volume initial de la musique
            if (this.musicAudioPlayer) {
                this.originalMusicVolume = this.musicAudioPlayer.volume;
                if (this.enableDebugLogs)
                    log.i(`Original music volume saved: ${this.originalMusicVolume}`);
            }
            else {
                log.w("Music Audio Player not assigned – volume ducking disabled");
            }
        }
        askAboutCurrentView() {
            if (this.isProcessing) {
                this.displayResponse("Already processing...", true);
                return;
            }
            if (!this.mapComponent) {
                this.displayResponse("Error: Map not ready", true);
                return;
            }
            this.isProcessing = true;
            this.audioFinished = false;
            this.wasPlaying = false;
            this.displayResponse("Analyzing map...", true);
            const context = this.collectMapContext();
            const prompt = this.buildPrompt(context);
            this.callOpenAI(prompt);
        }
        collectMapContext() {
            const parts = [];
            const loc = this.mapComponent.getUserLocation();
            if (loc)
                parts.push(`User: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
            parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(2)} degrees`);
            const center = this.mapComponent.getInitialMapTileLocation();
            if (center)
                parts.push(`Center: ${center.latitude.toFixed(6)}, ${center.longitude.toFixed(6)}`);
            parts.push(`Zoom: ${this.mapComponent.mapZoomLevel}`);
            return parts.join("\n");
        }
        buildPrompt(context) {
            return `You are a navigation assistant for AR glasses.\n\nContext:\n${context}\n\nGive 2-3 brief, interesting facts. Max 100 words.`;
        }
        callOpenAI(prompt) {
            this.displayResponse("📡 Getting in touch...", true);
            const request = {
                model: this.openAIModel,
                messages: [
                    { role: "system", content: "Be concise and conversational." },
                    { role: "user", content: prompt }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            };
            OpenAI_1.OpenAI.chatCompletions(request)
                .then(r => this.handleChatResponse(r))
                .catch(e => {
                this.handleError(`API error: ${e}`);
                this.restoreMusicVolume();
            });
        }
        handleChatResponse(response) {
            const text = response.choices?.[0]?.message?.content;
            if (!text) {
                this.handleError("Empty response");
                return;
            }
            this.displayResponse(text, true);
            this.generateAndPlayTTS(text);
        }
        generateAndPlayTTS(text) {
            const req = {
                model: this.ttsModel,
                input: text,
                voice: this.ttsVoice,
                response_format: "mp3"
            };
            OpenAI_1.OpenAI.speech(req)
                .then(track => this.playAudio(track))
                .catch(e => {
                log.e(`TTS error: ${e}`);
                this.restoreMusicVolume();
                this.isProcessing = false;
            });
        }
        playAudio(audioTrack) {
            if (!this.audioComponent) {
                this.restoreMusicVolume();
                this.isProcessing = false;
                return;
            }
            // Annuler les timers précédents si existants
            if (this.volumeDuckTimer) {
                this.volumeDuckTimer.cancel();
                this.volumeDuckTimer = null;
            }
            if (this.hideResponseTimer) {
                this.hideResponseTimer.cancel();
                this.hideResponseTimer = null;
            }
            if (this.audioComponent.isPlaying()) {
                this.audioComponent.stop(false);
            }
            this.audioComponent.audioTrack = audioTrack;
            this.audioComponent.play(1);
            // Enregistrer le temps de début
            this.audioStartTime = getTime();
            if (this.enableDebugLogs)
                log.i("TTS playback started → scheduling volume duck");
            // DÉLAI AVANT DE BAISSER LE VOLUME (pour laisser l'audio démarrer sur Spectacles)
            this.volumeDuckTimer = this.createEvent("DelayedCallbackEvent");
            this.volumeDuckTimer.bind(() => {
                this.duckMusicVolume();
                if (this.enableDebugLogs)
                    log.i("Volume ducked after delay");
            });
            this.volumeDuckTimer.reset(this.volumeDuckDelay);
            this.wasPlaying = true;
            this.audioFinished = false;
            this.isProcessing = false;
        }
        // Appelé à chaque frame
        checkAudioCompletion() {
            if (!this.audioComponent || !this.wasPlaying)
                return;
            const isPlaying = this.audioComponent.isPlaying();
            const elapsedTime = getTime() - this.audioStartTime;
            // Vérifier si l'audio s'est arrêté ET si suffisamment de temps s'est écoulé
            if (this.wasPlaying && !isPlaying && !this.audioFinished && elapsedTime >= this.minAudioDuration) {
                this.audioFinished = true;
                this.wasPlaying = false;
                if (this.enableDebugLogs) {
                    log.i(`TTS finished after ${elapsedTime.toFixed(2)}s → scheduling cleanup`);
                }
                // Délai avant de ranger le container et remonter le volume
                this.hideResponseTimer = this.createEvent("DelayedCallbackEvent");
                this.hideResponseTimer.bind(() => {
                    if (this.enableDebugLogs)
                        log.i("Executing delayed cleanup");
                    this.restoreMusicVolume();
                    this.hideResponse();
                });
                this.hideResponseTimer.reset(this.postAudioDelay);
            }
            this.wasPlaying = isPlaying;
        }
        duckMusicVolume() {
            if (this.musicAudioPlayer) {
                this.musicAudioPlayer.volume = 0.35;
                if (this.enableDebugLogs)
                    log.i("Music volume ducked to 0.35");
            }
        }
        restoreMusicVolume() {
            if (this.musicAudioPlayer && this.musicAudioPlayer.volume < this.originalMusicVolume) {
                this.musicAudioPlayer.volume = this.originalMusicVolume;
                if (this.enableDebugLogs)
                    log.i(`Music volume restored to ${this.originalMusicVolume}`);
            }
        }
        handleError(msg) {
            log.e(msg);
            this.displayResponse(`Error: ${msg}`, true);
            this.restoreMusicVolume();
            this.isProcessing = false;
            // Annuler les timers en cas d'erreur
            if (this.volumeDuckTimer) {
                this.volumeDuckTimer.cancel();
                this.volumeDuckTimer = null;
            }
            if (this.hideResponseTimer) {
                this.hideResponseTimer.cancel();
                this.hideResponseTimer = null;
            }
        }
        displayResponse(text, show) {
            if (this.responseText) {
                this.responseText.text = text;
            }
            if (this.aiResponseAnimator) {
                show ? this.aiResponseAnimator.animateIn() : this.aiResponseAnimator.animateOut();
            }
            else if (this.responseContainer) {
                this.responseContainer.enabled = show;
            }
        }
        hideResponse() {
            if (this.audioComponent?.isPlaying()) {
                this.audioComponent.stop(false);
            }
            if (this.aiResponseAnimator) {
                this.aiResponseAnimator.animateOut();
            }
            else if (this.responseContainer) {
                this.responseContainer.enabled = false;
            }
        }
        askAboutLocation(lat, lng) {
            if (this.isProcessing)
                return;
            this.isProcessing = true;
            this.displayResponse("Analyzing location...", true);
            const prompt = `2 facts about ${lat.toFixed(6)}, ${lng.toFixed(6)}. Keep brief.`;
            this.callOpenAI(prompt);
        }
        askAboutPlaces(places) {
            if (this.isProcessing || !places?.length) {
                this.displayResponse("No places found.", true);
                return;
            }
            this.isProcessing = true;
            this.displayResponse("Analyzing places...", true);
            const list = places.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}`).join("\n");
            const prompt = `Recommend based on:\n${list}\nKeep under 50 words.`;
            this.callOpenAI(prompt);
        }
        cancelRequest() {
            if (this.isProcessing) {
                this.isProcessing = false;
                this.audioComponent?.stop(false);
                this.restoreMusicVolume();
                this.hideResponse();
                // Annuler les timers
                if (this.volumeDuckTimer) {
                    this.volumeDuckTimer.cancel();
                    this.volumeDuckTimer = null;
                }
                if (this.hideResponseTimer) {
                    this.hideResponseTimer.cancel();
                    this.hideResponseTimer = null;
                }
            }
        }
        isCurrentlyProcessing() {
            return this.isProcessing;
        }
    };
    __setFunctionName(_classThis, "AIMapAssistant");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AIMapAssistant = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AIMapAssistant = _classThis;
})();
exports.AIMapAssistant = AIMapAssistant;
//# sourceMappingURL=AIMapAssistant.js.map