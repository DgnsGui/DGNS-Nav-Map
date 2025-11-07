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
            // Paramètres de timing
            this.volumeDuckDelay = this.volumeDuckDelay;
            this.minAudioDuration = this.minAudioDuration;
            this.postAudioDelay = this.postAudioDelay;
            this.maxAudioDuration = this.maxAudioDuration;
            this.isProcessing = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            this.timeoutTimer = null;
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.FRAMES_TO_CONFIRM_STOP = 10;
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
            // Paramètres de timing
            this.volumeDuckDelay = this.volumeDuckDelay;
            this.minAudioDuration = this.minAudioDuration;
            this.postAudioDelay = this.postAudioDelay;
            this.maxAudioDuration = this.maxAudioDuration;
            this.isProcessing = false;
            this.audioStartTime = 0;
            this.volumeDuckTimer = null;
            this.hideResponseTimer = null;
            this.timeoutTimer = null;
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.FRAMES_TO_CONFIRM_STOP = 10;
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
            this.displayResponse("Analyzing location...", true);
            const loc = this.mapComponent.getUserLocation();
            if (!loc) {
                this.handleError("Location not available");
                return;
            }
            // Utiliser directement GPT pour identifier la localité précise
            const context = this.collectMapContextSimple();
            const prompt = this.buildEnhancedPrompt(loc.latitude, loc.longitude, context);
            this.callOpenAI(prompt);
        }
        collectMapContextSimple() {
            const parts = [];
            const loc = this.mapComponent.getUserLocation();
            if (loc) {
                parts.push(`GPS: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
            }
            parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(0)}°`);
            parts.push(`Zoom: ${this.mapComponent.mapZoomLevel}`);
            return parts.join("\n");
        }
        buildEnhancedPrompt(lat, lng, context) {
            return `You are a precise local guide for AR glasses.

Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}
${context}

CRITICAL INSTRUCTIONS:
1. First, identify the EXACT town/village/city name at these precise coordinates (NOT the nearest major city, but the actual small town or village if applicable)
2. For example, if coordinates are in Hossegor, say "Hossegor" - NOT "Biarritz" or "Landes"
3. If it's a small locality, mention it specifically
4. Then give 2-3 brief interesting facts about that SPECIFIC place
5. Keep it conversational and under 100 words

Start your response with the exact location name (e.g., "You're in Hossegor..." or "You're in the village of...")`;
        }
        resetAudioState() {
            this.isAudioActive = false;
            this.consecutiveNotPlayingFrames = 0;
            this.audioStartTime = 0;
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
        callOpenAI(prompt) {
            this.displayResponse("📡 Locating... 📡", true);
            const request = {
                model: this.openAIModel,
                messages: [
                    {
                        role: "system",
                        content: "You are a precise local guide with excellent geographic knowledge. Always identify the exact small town, village, or neighborhood at the given coordinates - never default to the nearest major city. Be specific and accurate with location names."
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
            this.audioStartTime = getTime();
            this.isAudioActive = true;
            this.consecutiveNotPlayingFrames = 0;
            if (this.enableDebugLogs)
                log.i("TTS playback started → scheduling volume duck");
            this.volumeDuckTimer = this.createEvent("DelayedCallbackEvent");
            this.volumeDuckTimer.bind(() => {
                this.duckMusicVolume();
                if (this.enableDebugLogs)
                    log.i("Volume ducked after delay");
            });
            this.volumeDuckTimer.reset(this.volumeDuckDelay);
            this.timeoutTimer = this.createEvent("DelayedCallbackEvent");
            this.timeoutTimer.bind(() => {
                log.w(`Audio timeout reached (${this.maxAudioDuration}s) - forcing cleanup`);
                this.forceCleanup();
            });
            this.timeoutTimer.reset(this.maxAudioDuration);
            this.isProcessing = false;
        }
        updateAudioState() {
            if (!this.isAudioActive || !this.audioComponent)
                return;
            const isPlaying = this.audioComponent.isPlaying();
            const elapsedTime = getTime() - this.audioStartTime;
            if (!isPlaying) {
                this.consecutiveNotPlayingFrames++;
                if (this.consecutiveNotPlayingFrames >= this.FRAMES_TO_CONFIRM_STOP &&
                    elapsedTime >= this.minAudioDuration) {
                    if (this.enableDebugLogs) {
                        log.i(`Audio confirmed stopped after ${elapsedTime.toFixed(2)}s`);
                    }
                    this.scheduleCleanup();
                }
            }
            else {
                this.consecutiveNotPlayingFrames = 0;
            }
        }
        scheduleCleanup() {
            this.isAudioActive = false;
            if (this.timeoutTimer) {
                this.timeoutTimer.cancel();
                this.timeoutTimer = null;
            }
            if (this.enableDebugLogs)
                log.i(`Scheduling cleanup in ${this.postAudioDelay}s`);
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
            const prompt = `You are a precise local guide.

Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}

Identify the EXACT town/village at these coordinates (not the nearest major city), then give 2 interesting facts about that specific place. Keep it under 60 words. Start with the location name.`;
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
            const prompt = `Based on these nearby places:\n${list}\n\nRecommend the most interesting one and why. Keep it under 50 words.`;
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