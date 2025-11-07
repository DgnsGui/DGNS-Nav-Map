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
            this.remoteServiceModule = this.remoteServiceModule;
            this.mapComponent = this.mapComponent;
            this.openAIApiKey = this.openAIApiKey;
            this.openAIModel = this.openAIModel;
            this.maxTokens = this.maxTokens;
            this.temperature = this.temperature;
            this.enableTextToSpeech = this.enableTextToSpeech;
            this.responseText = this.responseText;
            this.audioComponent = this.audioComponent;
            this.isProcessing = false;
        }
        __initialize() {
            super.__initialize();
            this.remoteServiceModule = this.remoteServiceModule;
            this.mapComponent = this.mapComponent;
            this.openAIApiKey = this.openAIApiKey;
            this.openAIModel = this.openAIModel;
            this.maxTokens = this.maxTokens;
            this.temperature = this.temperature;
            this.enableTextToSpeech = this.enableTextToSpeech;
            this.responseText = this.responseText;
            this.audioComponent = this.audioComponent;
            this.isProcessing = false;
        }
        onAwake() {
            this.createEvent("OnStartEvent").bind(() => {
                this.initialize();
            });
        }
        initialize() {
            if (!this.remoteServiceModule) {
                log.e("RemoteServiceModule not assigned!");
                return;
            }
            if (!this.openAIApiKey || this.openAIApiKey === "") {
                log.w("OpenAI API Key not set. Please configure it in the inspector.");
            }
            log.i("AIMapAssistant initialized successfully");
        }
        /**
         * Main method to ask AI about the current map view
         */
        askAboutCurrentView() {
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                return;
            }
            if (!this.openAIApiKey || this.openAIApiKey === "") {
                log.e("Cannot make request: OpenAI API Key is not configured");
                this.displayResponse("Error: API Key not configured");
                return;
            }
            this.isProcessing = true;
            this.displayResponse("Analyzing map data...");
            try {
                // Collect context from the map
                const context = this.collectMapContext();
                // Build the prompt
                const prompt = this.buildPrompt(context);
                log.i("Sending request to OpenAI...");
                // Call OpenAI API
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`Error in askAboutCurrentView: ${error}`);
                this.displayResponse(`Error: ${error}`);
                this.isProcessing = false;
            }
        }
        /**
         * Collect all relevant context from the current map view
         */
        collectMapContext() {
            const context = [];
            try {
                // Get user location
                const userLocation = this.mapComponent.getUserLocation();
                if (userLocation) {
                    context.push(`User Location: Latitude ${userLocation.latitude.toFixed(6)}, Longitude ${userLocation.longitude.toFixed(6)}`);
                }
                // Get user heading
                const heading = this.mapComponent.getUserHeading();
                context.push(`User Heading: ${heading.toFixed(2)} degrees`);
                // Get initial map tile location (what's displayed)
                const mapLocation = this.mapComponent.getInitialMapTileLocation();
                if (mapLocation) {
                    context.push(`Map Center: Latitude ${mapLocation.latitude.toFixed(6)}, Longitude ${mapLocation.longitude.toFixed(6)}`);
                }
                // Get zoom level
                context.push(`Zoom Level: ${this.mapComponent.mapZoomLevel}`);
                // Check if map is centered
                const isCentered = this.mapComponent.isMapCentered();
                context.push(`Map Centered on User: ${isCentered}`);
                // Get auto-rotate status
                const autoRotate = this.mapComponent.getMinimapAutoRotate();
                context.push(`Auto-Rotate: ${autoRotate}`);
            }
            catch (error) {
                log.e(`Error collecting map context: ${error}`);
            }
            return context.join("\n");
        }
        /**
         * Build a comprehensive prompt for OpenAI
         */
        buildPrompt(context) {
            return `You are a helpful navigation and location assistant for an AR map application on Snap Spectacles. 

Current Map Context:
${context}

Based on this information, provide 3 brief, interesting, and useful insights about:
1. The geographical area being viewed
2. Notable features or points of interest nearby
3. A helpful navigation or exploration tip

Keep each insight to one sentence. Be conversational and engaging. Focus on information that would be useful for someone exploring this area in AR.`;
        }
        /**
         * Call OpenAI API via Remote Service Gateway
         */
        callOpenAI(prompt) {
            // Prepare request body
            const requestBody = {
                model: this.openAIModel,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful, concise navigation assistant for AR glasses users. Keep responses brief and conversational."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            };
            // Create HTTP request
            const request = RemoteServiceHttpRequest.create();
            request.url = "https://api.openai.com/v1/chat/completions";
            request.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
            // Set headers
            request.setHeader("Content-Type", "application/json");
            request.setHeader("Authorization", `Bearer ${this.openAIApiKey}`);
            // Set body
            request.body = JSON.stringify(requestBody);
            // Perform request
            this.remoteServiceModule.performHttpRequest(request, (response) => {
                this.handleHttpResponse(response);
            });
        }
        /**
         * Handle HTTP response from OpenAI
         */
        handleHttpResponse(response) {
            try {
                if (response.statusCode === 200) {
                    const responseBody = response.body;
                    try {
                        const data = JSON.parse(responseBody);
                        if (data.choices && data.choices.length > 0) {
                            const aiResponse = data.choices[0].message.content;
                            log.i("Received response from OpenAI");
                            this.handleResponse(aiResponse);
                        }
                        else {
                            this.handleError("No response content from OpenAI");
                        }
                    }
                    catch (parseError) {
                        log.e(`Error parsing OpenAI response: ${parseError}`);
                        this.handleError(`Failed to parse response: ${parseError}`);
                    }
                }
                else {
                    log.e(`OpenAI API error: ${response.statusCode}`);
                    this.handleError(`API error: ${response.statusCode}`);
                }
            }
            catch (error) {
                log.e(`Error handling response: ${error}`);
                this.handleError(`Error: ${error}`);
            }
            finally {
                this.isProcessing = false;
            }
        }
        /**
         * Handle the AI response - display and optionally speak it
         */
        handleResponse(response) {
            log.i(`AI Response: ${response}`);
            // Display the response
            this.displayResponse(response);
            // Speak the response if TTS is enabled
            if (this.enableTextToSpeech) {
                this.speakResponse(response);
            }
        }
        /**
         * Handle errors
         */
        handleError(errorMessage) {
            log.e(errorMessage);
            this.displayResponse(`Error: ${errorMessage}`);
            this.isProcessing = false;
        }
        /**
         * Display response in the UI
         */
        displayResponse(text) {
            if (this.responseText) {
                this.responseText.text = text;
            }
            log.i(`Display: ${text}`);
        }
        /**
         * Use Text-to-Speech to read the response (simplified version)
         */
        speakResponse(text) {
            try {
                log.i(`TTS: ${text}`);
                // Note: Spectacles TTS implementation varies by version
                // This is a placeholder - you may need to use a different TTS solution
                // or the built-in audio playback with pre-generated TTS
                if (this.audioComponent) {
                    log.i("Audio component available for TTS playback");
                    // You would need to integrate with a TTS service that returns audio
                    // or use Spectacles' native TTS if available in your SDK version
                }
                else {
                    log.w("No audio component assigned for TTS");
                }
            }
            catch (error) {
                log.e(`Error in speakResponse: ${error}`);
            }
        }
        /**
         * Ask AI about a specific location
         */
        askAboutLocation(latitude, longitude) {
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                return;
            }
            this.isProcessing = true;
            this.displayResponse("Analyzing location...");
            try {
                const prompt = `Tell me 3 interesting facts about the location at latitude ${latitude.toFixed(6)}, longitude ${longitude.toFixed(6)}. Keep each fact to one sentence.`;
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`Error in askAboutLocation: ${error}`);
                this.displayResponse(`Error: ${error}`);
                this.isProcessing = false;
            }
        }
        /**
         * Ask AI about nearby places
         */
        askAboutPlaces(places) {
            if (this.isProcessing) {
                log.w("Already processing a request. Please wait.");
                return;
            }
            if (!places || places.length === 0) {
                log.w("No places to analyze");
                return;
            }
            this.isProcessing = true;
            this.displayResponse("Analyzing nearby places...");
            try {
                // Build context about places
                const placesContext = places.slice(0, 5).map((place, index) => `${index + 1}. ${place.name} (${place.category})`).join("\n");
                const prompt = `Based on these nearby places:\n${placesContext}\n\nProvide a brief recommendation on what to explore or do in this area. Keep it to 2-3 sentences.`;
                this.callOpenAI(prompt);
            }
            catch (error) {
                log.e(`Error in askAboutPlaces: ${error}`);
                this.displayResponse(`Error: ${error}`);
                this.isProcessing = false;
            }
        }
        /**
         * Cancel current processing
         */
        cancelRequest() {
            if (this.isProcessing) {
                this.isProcessing = false;
                this.displayResponse("Request cancelled");
                log.i("Request cancelled by user");
            }
        }
        /**
         * Check if currently processing a request
         */
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