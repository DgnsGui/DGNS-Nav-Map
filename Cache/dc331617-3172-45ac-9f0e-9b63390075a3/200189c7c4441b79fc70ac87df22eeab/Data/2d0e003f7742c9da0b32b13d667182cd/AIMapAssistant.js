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
            this.isProcessing = false;
            this.originalMusicVolume = 1.0;
            // === TIMER POUR TTS ===
            this.ttsEndTime = null;
            this.ttsTimerActive = false;
            this.ttsWasPlaying = false;
            this.ttsFinished = false;
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
            this.isProcessing = false;
            this.originalMusicVolume = 1.0;
            // === TIMER POUR TTS ===
            this.ttsEndTime = null;
            this.ttsTimerActive = false;
            this.ttsWasPlaying = false;
            this.ttsFinished = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => this.initialize());
            this.createEvent("UpdateEvent").bind(() => this.updateTTSTimer());
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
            this.displayResponse("Analyzing map...", true);
            // NE PAS baisser le volume ici — on attend le début du TTS
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
                this.restoreMusicVolume(); // au cas où
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
                .then(track => this.playAudio(track, text))
                .catch(e => {
                log.e(`TTS error: ${e}`);
                this.restoreMusicVolume();
                this.isProcessing = false;
            });
        }
        // Estimation de la durée du TTS à partir du texte (2.5 mots/seconde + 1.5s de buffer, clampée entre 2 et 15s)
        estimateTTSDuration(text) {
            const words = text.trim().split(/\s+/).length;
            const seconds = words / 2.5 + 1.5;
            return Math.max(2, Math.min(seconds, 15));
        }
        playAudio(audioTrack, ttsText) {
            if (!this.audioComponent) {
                this.restoreMusicVolume();
                this.isProcessing = false;
                return;
            }
            if (this.audioComponent.isPlaying()) {
                this.audioComponent.stop(false);
            }
            this.audioComponent.audioTrack = audioTrack;
            this.audioComponent.play(1);
            if (this.enableDebugLogs)
                log.i("TTS playback started → ducking music");
            this.duckMusicVolume();
            // Estime la durée du TTS à partir du texte
            let duration = 3.0;
            if (ttsText) {
                duration = this.estimateTTSDuration(ttsText);
            }
            if (this.enableDebugLogs)
                log.i("TTS estimated duration: " + duration + "s");
            this.ttsEndTime = getTime() + duration;
            this.ttsTimerActive = true;
            this.ttsWasPlaying = true;
            this.ttsFinished = false;
            this.isProcessing = false;
        }
        // Timer manuel pour la fin du TTS + surveillance de isPlaying()
        updateTTSTimer() {
            if (this.ttsFinished)
                return;
            // Timer classique
            if (this.ttsTimerActive && this.ttsEndTime !== null) {
                if (getTime() >= this.ttsEndTime) {
                    if (this.enableDebugLogs)
                        log.i("TTS finished (timer) → restoring music & hiding response");
                    this.finishTTS();
                    return;
                }
            }
            // Surveillance de isPlaying()
            if (this.ttsWasPlaying && this.audioComponent && !this.audioComponent.isPlaying()) {
                if (this.enableDebugLogs)
                    log.i("TTS finished (isPlaying) → restoring music & hiding response");
                this.finishTTS();
                return;
            }
        }
        finishTTS() {
            this.ttsTimerActive = false;
            this.ttsEndTime = null;
            this.ttsWasPlaying = false;
            this.ttsFinished = true;
            this.restoreMusicVolume();
            this.hideResponse();
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
                // Annule aussi le timer TTS si besoin
                this.ttsTimerActive = false;
                this.ttsEndTime = null;
                this.ttsWasPlaying = false;
                this.ttsFinished = true;
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