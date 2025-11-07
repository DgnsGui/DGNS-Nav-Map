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
            this.maxTokens = this.maxTokens; // Augmenté pour descriptions plus riches
            this.temperature = this.temperature; // Plus de créativité
            this.ttsVoice = this.ttsVoice;
            this.ttsModel = this.ttsModel;
            this.responseText = this.responseText;
            this.responseContainer = this.responseContainer;
            this.audioComponent = this.audioComponent;
            this.musicAudioPlayer = this.musicAudioPlayer;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            // Paramètres de timing
            this.volumeDuckDelay = this.volumeDuckDelay;
            this.minAudioDuration = this.minAudioDuration;
            this.postAudioDelay = this.postAudioDelay;
            this.maxAudioDuration = this.maxAudioDuration; // Timeout de sécurité
            this.isProcessing = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            this.timeoutTimer = null;
            // Nouveaux trackers pour une détection plus fiable
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.FRAMES_TO_CONFIRM_STOP = 10; // ~10 frames pour confirmer l'arrêt
            this.originalMusicVolume = 1.0;
        }
        __initialize() {
            super.__initialize();
            this.mapComponent = this.mapComponent;
            this.openAIModel = this.openAIModel;
            this.maxTokens = this.maxTokens; // Augmenté pour descriptions plus riches
            this.temperature = this.temperature; // Plus de créativité
            this.ttsVoice = this.ttsVoice;
            this.ttsModel = this.ttsModel;
            this.responseText = this.responseText;
            this.responseContainer = this.responseContainer;
            this.audioComponent = this.audioComponent;
            this.musicAudioPlayer = this.musicAudioPlayer;
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            // Paramètres de timing
            this.volumeDuckDelay = this.volumeDuckDelay;
            this.minAudioDuration = this.minAudioDuration;
            this.postAudioDelay = this.postAudioDelay;
            this.maxAudioDuration = this.maxAudioDuration; // Timeout de sécurité
            this.isProcessing = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            this.timeoutTimer = null;
            // Nouveaux trackers pour une détection plus fiable
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.FRAMES_TO_CONFIRM_STOP = 10; // ~10 frames pour confirmer l'arrêt
            this.originalMusicVolume = 1.0;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.updateAudioState());
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== AIMapAssistant INITIALIZED ===");
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
            this.resetAudioState();
            this.isProcessing = true;
            this.displayResponse("Analyzing map...", true);
            const context = this.collectMapContext();
            const prompt = this.buildPrompt(context);
            this.callOpenAI(prompt);
        }
        resetAudioState() {
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.audioStartTime = 0;
            // Annuler tous les timers
            this.cancelAllTimers();
        }
        cancelAllTimers() {
            if (this.volumeDuckTimer) {
                this.volumeDuckTimer.cancel();
                this.volumeDuckTimer = null;
            }
            if (this.hideResponseTimer) {
                this.hideResponseTimer.cancel();
                this.hideResponseTimer = null;
            }
            if (this.timeoutTimer) {
                this.timeoutTimer.cancel();
                this.timeoutTimer = null;
            }
        }
        collectMapContext() {
            const parts = [];
            const loc = this.mapComponent.getUserLocation();
            if (loc) {
                parts.push(`User coordinates: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
            }
            parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(2)} degrees`);
            const center = this.mapComponent.getInitialMapTileLocation();
            if (center) {
                parts.push(`Map center: ${center.latitude.toFixed(6)}, ${center.longitude.toFixed(6)}`);
            }
            parts.push(`Zoom level: ${this.mapComponent.mapZoomLevel}`);
            return parts.join("\n");
        }
        buildPrompt(context) {
            return `You are a helpful, local navigation assistant for AR glasses. 

Context:
${context}

IMPORTANT INSTRUCTIONS:
1. First, identify the EXACT neighborhood, street, or specific location at these coordinates (not just the nearest major city)
2. Describe what's actually at this precise location - is it a residential area, commercial district, park, waterfront, etc.?
3. Give 2-3 brief, interesting facts about THIS SPECIFIC AREA
4. If there are notable landmarks or places within 500m, mention them
5. Keep it conversational and under 100 words
6. Focus on what makes THIS PARTICULAR SPOT unique, not the general city

Example good response: "You're in the Marais district, Paris's historic Jewish quarter. This trendy neighborhood is known for its medieval streets, vintage boutiques, and famous falafel spots on Rue des Rosiers. The nearby Place des Vosges is Paris's oldest planned square."

Example bad response: "You're in Paris, the capital of France. It's known for the Eiffel Tower and great food."`;
        }
        callOpenAI(prompt) {
            this.displayResponse("📡 Getting in touch...", true);
            const request = {
                model: this.openAIModel,
                messages: [
                    {
                        role: "system",
                        content: "You are a knowledgeable local guide. Always identify the specific neighborhood or area first, then share interesting details about that exact location. Never default to generic city facts."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            };
            OpenAI_1.OpenAI.chatCompletions(request)
                .then(r => this.handleChatResponse(r))
                .catch(e => {
                this.handleError(`API error: ${e}`);
                this.cleanupAfterAudio();
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
                this.cleanupAfterAudio();
                this.isProcessing = false;
            });
        }
        playAudio(audioTrack) {
            if (!this.audioComponent) {
                this.cleanupAfterAudio();
                this.isProcessing = false;
                return;
            }
            this.cancelAllTimers();
            if (this.audioComponent.isPlaying()) {
                this.audioComponent.stop(false);
            }
            this.audioComponent.audioTrack = audioTrack;
            this.audioComponent.play(1);
            // Initialiser l'état audio
            this.audioStartTime = getTime();
            this.isAudioActive = true;
            this.consecutiveNotPlayingFrames = 0;
            if (this.enableDebugLogs)
                log.i("TTS playback started → scheduling volume duck");
            // Timer pour baisser le volume
            this.volumeDuckTimer = this.createEvent("DelayedCallbackEvent");
            this.volumeDuckTimer.bind(() => {
                this.duckMusicVolume();
                if (this.enableDebugLogs)
                    log.i("Volume ducked after delay");
            });
            this.volumeDuckTimer.reset(this.volumeDuckDelay);
            // Timer de sécurité au cas où la détection échoue complètement
            this.timeoutTimer = this.createEvent("DelayedCallbackEvent");
            this.timeoutTimer.bind(() => {
                log.w(`Audio timeout reached (${this.maxAudioDuration}s) - forcing cleanup`);
                this.forceCleanup();
            });
            this.timeoutTimer.reset(this.maxAudioDuration);
            this.isProcessing = false;
        }
        // Appelé à chaque frame pour surveiller l'état de l'audio
        updateAudioState() {
            if (!this.isAudioActive || !this.audioComponent)
                return;
            const isPlaying = this.audioComponent.isPlaying();
            const elapsedTime = getTime() - this.audioStartTime;
            if (this.enableDebugLogs && elapsedTime > 0 && Math.floor(elapsedTime * 10) % 10 === 0) {
                // Log tous les 1s environ
                log.i(`Audio state: playing=${isPlaying}, elapsed=${elapsedTime.toFixed(1)}s, frames=${this.consecutiveNotPlayingFrames}`);
            }
            if (!isPlaying) {
                this.consecutiveNotPlayingFrames++;
                // Confirmer l'arrêt après plusieurs frames ET durée minimale écoulée
                if (this.consecutiveNotPlayingFrames >= this.FRAMES_TO_CONFIRM_STOP &&
                    elapsedTime >= this.minAudioDuration) {
                    if (this.enableDebugLogs) {
                        log.i(`Audio confirmed stopped after ${elapsedTime.toFixed(2)}s (${this.consecutiveNotPlayingFrames} frames)`);
                    }
                    this.scheduleCleanup();
                }
            }
            else {
                // L'audio joue, réinitialiser le compteur
                this.consecutiveNotPlayingFrames = 0;
            }
        }
        scheduleCleanup() {
            // Marquer comme inactif pour arrêter le monitoring
            this.isAudioActive = false;
            // Annuler le timer de timeout
            if (this.timeoutTimer) {
                this.timeoutTimer.cancel();
                this.timeoutTimer = null;
            }
            if (this.enableDebugLogs)
                log.i(`Scheduling cleanup in ${this.postAudioDelay}s`);
            // Timer pour le cleanup
            this.hideResponseTimer = this.createEvent("DelayedCallbackEvent");
            this.hideResponseTimer.bind(() => {
                this.cleanupAfterAudio();
            });
            this.hideResponseTimer.reset(this.postAudioDelay);
        }
        forceCleanup() {
            if (this.enableDebugLogs)
                log.w("Force cleanup triggered");
            this.isAudioActive = false;
            this.cleanupAfterAudio();
        }
        cleanupAfterAudio() {
            if (this.enableDebugLogs)
                log.i("Executing cleanup: restoring volume & hiding container");
            this.restoreMusicVolume();
            this.hideResponse();
            this.cancelAllTimers();
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
            this.cleanupAfterAudio();
            this.isProcessing = false;
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
            this.resetAudioState();
            this.isProcessing = true;
            this.displayResponse("Analyzing location...", true);
            const prompt = `You are a local guide for AR glasses.

Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}

Identify the specific neighborhood or area at these exact coordinates, then share 2 interesting facts about this particular spot. Focus on what's unique about THIS location, not the general city. Keep it under 60 words.`;
            this.callOpenAI(prompt);
        }
        askAboutPlaces(places) {
            if (this.isProcessing || !places?.length) {
                this.displayResponse("No places found.", true);
                return;
            }
            this.resetAudioState();
            this.isProcessing = true;
            this.displayResponse("Analyzing places...", true);
            const list = places.slice(0, 5).map((p, i) => `${i + 1}. ${p.name}`).join("\n");
            const prompt = `You are a local guide for AR glasses.

Nearby places:
${list}

Based on these places, tell me what type of area this is (e.g., historic district, shopping area, residential, etc.) and recommend the most interesting spot to visit. Keep it conversational and under 50 words.`;
            this.callOpenAI(prompt);
        }
        cancelRequest() {
            if (this.isProcessing || this.isAudioActive) {
                this.isProcessing = false;
                this.isAudioActive = false;
                this.audioComponent?.stop(false);
                this.cleanupAfterAudio();
            }
        }
        isCurrentlyProcessing() {
            return this.isProcessing || this.isAudioActive;
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