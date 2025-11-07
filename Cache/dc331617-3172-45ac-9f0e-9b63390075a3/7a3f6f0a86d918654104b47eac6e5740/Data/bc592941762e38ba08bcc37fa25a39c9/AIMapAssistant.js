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
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isProcessing = false;
            this.currentAudioTrack = null;
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
            this.aiResponseAnimator = this.aiResponseAnimator;
            this.enableDebugLogs = this.enableDebugLogs;
            this.isProcessing = false;
            this.currentAudioTrack = null;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (this.enableDebugLogs)
                log.i("=== AIMapAssistant INITIALIZATION ===");
            if (!this.mapComponent) {
                log.e("MapComponent is not assigned!");
            }
            else if (this.enableDebugLogs) {
                log.i("MapComponent: OK");
            }
            if (!this.responseText) {
                log.w("Response Text is not assigned - text display will be disabled");
            }
            else if (this.enableDebugLogs) {
                log.i("Response Text: OK");
            }
            if (!this.responseContainer) {
                log.w("Response Container is not assigned - container won't be shown/hidden");
            }
            else {
                if (!this.aiResponseAnimator) {
                    this.responseContainer.enabled = false;
                }
                if (this.enableDebugLogs)
                    log.i("Response Container: OK");
            }
            if (!this.audioComponent) {
                log.w("Audio Component is not assigned - TTS audio won't play");
            }
            else if (this.enableDebugLogs) {
                log.i("Audio Component: OK");
            }
            if (!this.aiResponseAnimator) {
                log.w("AIResponseAnimator is not assigned - animations for response container will be disabled");
            }
            else if (this.enableDebugLogs) {
                log.i("AIResponseAnimator: OK");
            }
            if (this.enableDebugLogs)
                log.i("=== AIMapAssistant initialized successfully ===");
        }
        askAboutCurrentView() {
            if (this.enableDebugLogs) {
                log.i("========================================");
                log.i("askAboutCurrentView() CALLED");
                log.i("========================================");
            }
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                this.displayResponse("⏳ Already processing...", true);
                return;
            }
            if (!this.mapComponent) {
                log.e("MapComponent not assigned!");
                this.displayResponse("❌ Error: Map not configured", true);
                return;
            }
            this.isProcessing = true;
            this.displayResponse("🔍 Analyzing map data...", true);
            if (this.enableDebugLogs)
                log.i("Set isProcessing = true");
            try {
                if (this.enableDebugLogs)
                    log.i("Collecting map context...");
                const context = this.collectMapContext();
                if (this.enableDebugLogs)
                    log.i(`Context collected: ${context.substring(0, Math.min(context.length, 100))}...`);
                const prompt = this.buildPrompt(context);
                if (this.enableDebugLogs)
                    log.i(`Prompt built (${prompt.length} chars)`);
                if (this.enableDebugLogs)
                    log.i("Calling OpenAI API...");
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`❌ Error in askAboutCurrentView: ${error}`);
                this.displayResponse(`❌ Error: ${error}`, true);
                this.isProcessing = false;
            }
        }
        collectMapContext() {
            const context = [];
            try {
                const userLocation = this.mapComponent.getUserLocation();
                if (userLocation) {
                    context.push(`User Location: Latitude ${userLocation.latitude.toFixed(6)}, Longitude ${userLocation.longitude.toFixed(6)}`);
                    if (this.enableDebugLogs)
                        log.i(`User location: ${userLocation.latitude}, ${userLocation.longitude}`);
                }
                else {
                    log.w("User location not available");
                }
                const heading = this.mapComponent.getUserHeading();
                context.push(`User Heading: ${heading.toFixed(2)} degrees`);
                const mapLocation = this.mapComponent.getInitialMapTileLocation();
                if (mapLocation) {
                    context.push(`Map Center: Latitude ${mapLocation.latitude.toFixed(6)}, Longitude ${mapLocation.longitude.toFixed(6)}`);
                }
                context.push(`Zoom Level: ${this.mapComponent.mapZoomLevel}`);
            }
            catch (error) {
                log.e(`Error collecting map context: ${error}`);
            }
            return context.join("\n");
        }
        buildPrompt(context) {
            return `You are a helpful navigation and location assistant for an AR map application on Snap Spectacles.

Current Map Context:
${context}

Provide 2-3 brief, interesting insights about this geographical area. Keep your response under 100 words and conversational.`;
        }
        callOpenAI(prompt) {
            if (this.enableDebugLogs)
                log.i("🚀 Preparing OpenAI request...");
            const request = {
                model: this.openAIModel,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful, concise navigation assistant for AR glasses users. Keep responses very brief and conversational."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            };
            if (this.enableDebugLogs)
                log.i(`Model: ${this.openAIModel}, Max Tokens: ${this.maxTokens}`);
            if (this.enableDebugLogs)
                log.i("Calling OpenAI.chatCompletions()...");
            this.displayResponse("🤖 Asking AI...", true);
            OpenAI_1.OpenAI.chatCompletions(request)
                .then((response) => {
                if (this.enableDebugLogs)
                    log.i("✅ OpenAI response received!");
                this.handleChatResponse(response);
            })
                .catch((error) => {
                log.e(`❌ OpenAI API error: ${error}`);
                this.handleError(`API error: ${error}`);
            });
        }
        handleChatResponse(response) {
            if (this.enableDebugLogs)
                log.i("Processing chat response...");
            try {
                if (response.choices && response.choices.length > 0) {
                    const aiResponse = response.choices[0].message.content;
                    if (aiResponse) {
                        if (this.enableDebugLogs)
                            log.i(`✅ AI Response received (${aiResponse.length} chars)`);
                        if (this.enableDebugLogs)
                            log.i(`Response: ${aiResponse}`);
                        this.displayResponse(aiResponse, true);
                        if (this.enableDebugLogs)
                            log.i("Starting TTS generation...");
                        this.generateAndPlayTTS(aiResponse);
                    }
                    else {
                        this.handleError("No content in AI response");
                    }
                }
                else {
                    this.handleError("No choices in AI response");
                }
            }
            catch (error) {
                log.e(`Error handling chat response: ${error}`);
                this.handleError(`Error: ${error}`);
            }
        }
        generateAndPlayTTS(text) {
            const speechRequest = {
                model: this.ttsModel,
                input: text,
                voice: this.ttsVoice,
                response_format: "mp3"
            };
            if (this.enableDebugLogs)
                log.i("🎤 Generating speech...");
            OpenAI_1.OpenAI.speech(speechRequest)
                .then((audioTrack) => {
                if (this.enableDebugLogs)
                    log.i("✅ Speech generated successfully!");
                this.playAudio(audioTrack);
            })
                .catch((error) => {
                log.e(`❌ TTS error: ${error}`);
            })
                .finally(() => {
                if (this.enableDebugLogs)
                    log.i("Setting isProcessing = false");
                this.isProcessing = false;
            });
        }
        playAudio(audioTrack) {
            try {
                if (!this.audioComponent) {
                    log.w("No audio component assigned - skipping audio playback");
                    this.isProcessing = false;
                    return;
                }
                if (this.enableDebugLogs)
                    log.i("🔊 Playing audio...");
                if (this.audioComponent.isPlaying()) {
                    this.audioComponent.stop(false);
                }
                this.audioComponent.audioTrack = audioTrack;
                this.currentAudioTrack = audioTrack;
                this.audioComponent.play(1);
                if (this.enableDebugLogs)
                    log.i("✅ Audio playback started!");
            }
            catch (error) {
                log.e(`❌ Error playing audio: ${error}`);
                this.isProcessing = false;
            }
        }
        handleError(errorMessage) {
            log.e(`❌ ${errorMessage}`);
            this.displayResponse(`❌ Error: ${errorMessage}`, true);
            this.isProcessing = false;
        }
        displayResponse(text, show) {
            if (this.enableDebugLogs)
                log.i(`Displaying: "${text.substring(0, Math.min(text.length, 50))}"... (show: ${show})`);
            if (this.responseText) {
                this.responseText.text = text;
                if (this.enableDebugLogs)
                    log.i("Text updated successfully");
            }
            else {
                log.w("responseText not assigned, cannot display text");
            }
            if (this.aiResponseAnimator) {
                if (show) {
                    this.aiResponseAnimator.animateIn();
                }
                else {
                    if (this.aiResponseAnimator.getIsVisible()) {
                        this.aiResponseAnimator.animateOut();
                    }
                }
                if (this.enableDebugLogs)
                    log.i(`Container animation triggered via AIResponseAnimator: ${show ? "IN" : "OUT"}`);
            }
            else if (this.responseContainer) {
                this.responseContainer.enabled = show;
                log.w(`AIResponseAnimator not assigned, directly setting responseContainer.enabled to ${show}`);
            }
            else {
                log.w("responseContainer not assigned, cannot show/hide");
            }
        }
        hideResponse() {
            if (this.enableDebugLogs)
                log.i("hideResponse() called");
            // Arrêter l'audio si en cours
            if (this.audioComponent && this.audioComponent.isPlaying()) {
                this.audioComponent.stop(false);
                if (this.enableDebugLogs)
                    log.i("Audio stopped");
            }
            // Vérifier si l'animateur existe et déclencher l'animation
            if (this.aiResponseAnimator) {
                // Forcer l'animation même si déjà marqué comme caché
                if (this.enableDebugLogs)
                    log.i("Forcing animateOut via AIResponseAnimator");
                // Si une animation est en cours, l'annuler d'abord
                if (this.aiResponseAnimator.getIsAnimating()) {
                    if (this.enableDebugLogs)
                        log.i("Animation in progress, will be cancelled by animateOut");
                }
                // Déclencher l'animation de sortie sans vérifier l'état de visibilité
                this.aiResponseAnimator.animateOut();
            }
            else if (this.responseContainer) {
                // Fallback : masquer directement si pas d'animateur
                this.responseContainer.enabled = false;
                log.w("AIResponseAnimator not assigned, directly hiding responseContainer");
            }
        }
        askAboutLocation(latitude, longitude) {
            if (this.enableDebugLogs)
                log.i(`askAboutLocation called: ${latitude}, ${longitude}`);
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                this.displayResponse("⏳ Already processing...", true);
                return;
            }
            this.isProcessing = true;
            this.displayResponse("🌍 Analyzing location...", true);
            try {
                const prompt = `Tell me 2 interesting facts about the location at latitude ${latitude.toFixed(6)}, longitude ${longitude.toFixed(6)}. Keep it very brief.`;
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`Error in askAboutLocation: ${error}`);
                this.displayResponse(`Error: ${error}`, true);
                this.isProcessing = false;
            }
        }
        askAboutPlaces(places) {
            if (this.enableDebugLogs)
                log.i(`askAboutPlaces called with ${places?.length || 0} places`);
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                this.displayResponse("⏳ Already processing...", true);
                return;
            }
            if (!places || places.length === 0) {
                log.w("No places to analyze");
                this.displayResponse("No places found nearby.", true);
                this.isProcessing = false;
                return;
            }
            this.isProcessing = true;
            this.displayResponse("🏪 Analyzing nearby places...", true);
            try {
                const placesContext = places.slice(0, 5).map((place, index) => `${index + 1}. ${place.name} (${place.category})`).join("\n");
                const prompt = `Based on these nearby places:\n${placesContext}\n\nProvide a brief recommendation. Keep it under 50 words.`;
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`Error in askAboutPlaces: ${error}`);
                this.displayResponse(`Error: ${error}`, true);
                this.isProcessing = false;
            }
        }
        cancelRequest() {
            if (this.isProcessing) {
                this.isProcessing = false;
                this.hideResponse();
                if (this.enableDebugLogs)
                    log.i("Request cancelled by user");
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