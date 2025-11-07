import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "../MapComponent/Scripts/MapComponent";
import { PlaceInfo } from "../MapComponent/Scripts/SnapPlacesProvider";

const TAG = "[AIMapAssistant]";
const log = new NativeLogger(TAG);

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

@component
export class AIMapAssistant extends BaseScriptComponent {
  @input
  private remoteServiceModule: RemoteServiceModule;

  @input
  private mapComponent: MapComponent;

  @input
  @hint("Votre clé API OpenAI")
  private openAIApiKey: string = "";

  @input
  @hint("Modèle OpenAI à utiliser")
  private openAIModel: string = "gpt-4";

  @input
  @hint("Nombre maximum de tokens pour la réponse")
  private maxTokens: number = 150;

  @input
  @hint("Temperature pour la créativité (0-2)")
  private temperature: number = 0.7;

  @input
  @hint("Active le Text-to-Speech pour lire la réponse")
  private enableTextToSpeech: boolean = true;

  @input
  @allowUndefined
  private responseText: Text;

  private apiModule: any;
  private isProcessing: boolean = false;
  private voiceModule: VoiceMLModule;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (!this.remoteServiceModule) {
      log.e("RemoteServiceModule not assigned!");
      return;
    }

    if (!this.openAIApiKey || this.openAIApiKey === "") {
      log.w("OpenAI API Key not set. Please configure it in the inspector.");
    }

    // Initialize API module for OpenAI
    this.setupOpenAIModule();

    // Initialize Text-to-Speech if enabled
    if (this.enableTextToSpeech) {
      this.voiceModule = VoiceMLModule.createVoiceMLModule();
    }

    log.i("AIMapAssistant initialized successfully");
  }

  private setupOpenAIModule(): void {
    // Create API module configuration for OpenAI
    const ModuleClass = require("LensStudio:RemoteApiModule");
    
    this.apiModule = new ModuleClass.RemoteApiModule({
      module: this.remoteServiceModule,
      apiSpecId: "openai-api",
    });
  }

  /**
   * Main method to ask AI about the current map view
   */
  public async askAboutCurrentView(): Promise<void> {
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
      const response = await this.callOpenAI(prompt);
      
      // Display and speak the response
      this.handleResponse(response);
      
    } catch (error) {
      log.e(`Error in askAboutCurrentView: ${error}`);
      this.displayResponse(`Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Collect all relevant context from the current map view
   */
  private collectMapContext(): string {
    const context: string[] = [];

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

    } catch (error) {
      log.e(`Error collecting map context: ${error}`);
    }

    return context.join("\n");
  }

  /**
   * Build a comprehensive prompt for OpenAI
   */
  private buildPrompt(context: string): string {
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
  private async callOpenAI(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Prepare request body
      const requestBody: OpenAIRequest = {
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

      // Make API call
      this.apiModule.fetch({
        url: "https://api.openai.com/v1/chat/completions",
        method: HttpRequestMethod.Post,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.openAIApiKey}`
        },
        body: JSON.stringify(requestBody)
      })
      .then((response: HttpResponse) => {
        if (response.statusCode === 200) {
          try {
            const data: OpenAIResponse = JSON.parse(response.body);
            
            if (data.choices && data.choices.length > 0) {
              const aiResponse = data.choices[0].message.content;
              log.i("Received response from OpenAI");
              resolve(aiResponse);
            } else {
              reject("No response content from OpenAI");
            }
          } catch (parseError) {
            log.e(`Error parsing OpenAI response: ${parseError}`);
            reject(`Failed to parse response: ${parseError}`);
          }
        } else {
          log.e(`OpenAI API error: ${response.statusCode}`);
          reject(`API error: ${response.statusCode} - ${response.body}`);
        }
      })
      .catch((error) => {
        log.e(`Network error calling OpenAI: ${error}`);
        reject(`Network error: ${error}`);
      });
    });
  }

  /**
   * Handle the AI response - display and optionally speak it
   */
  private handleResponse(response: string): void {
    log.i(`AI Response: ${response}`);
    
    // Display the response
    this.displayResponse(response);
    
    // Speak the response if TTS is enabled
    if (this.enableTextToSpeech && this.voiceModule) {
      this.speakResponse(response);
    }
  }

  /**
   * Display response in the UI
   */
  private displayResponse(text: string): void {
    if (this.responseText) {
      this.responseText.text = text;
    }
    log.i(`Display: ${text}`);
  }

  /**
   * Use Text-to-Speech to read the response
   */
  private speakResponse(text: string): void {
    try {
      // Create TTS request
      const ttsRequest = VoiceMLModule.createTextToSpeechRequest();
      ttsRequest.text = text;
      
      // Set voice parameters (you can customize these)
      ttsRequest.voiceId = "en-US-Neural2-A"; // Example voice ID
      
      log.i("Starting Text-to-Speech...");
      
      // Execute TTS
      this.voiceModule.textToSpeech(
        ttsRequest,
        (audioOutput) => {
          log.i("Text-to-Speech completed successfully");
          
          // Play the audio
          if (audioOutput && audioOutput.audio) {
            this.playAudio(audioOutput.audio);
          }
        },
        (error) => {
          log.e(`Text-to-Speech error: ${error}`);
        }
      );
      
    } catch (error) {
      log.e(`Error in speakResponse: ${error}`);
    }
  }

  /**
   * Play audio from TTS
   */
  private playAudio(audioTrack: AudioTrackAsset): void {
    try {
      const audioComponent = this.getSceneObject().createComponent("Component.AudioComponent");
      audioComponent.audioTrack = audioTrack;
      audioComponent.play(1); // Play once
      
      log.i("Playing audio response");
      
      // Clean up after playing
      this.createEvent("DelayedCallbackEvent").bind(() => {
        if (audioComponent) {
          audioComponent.destroy();
        }
      }).reset(audioTrack.duration + 0.5);
      
    } catch (error) {
      log.e(`Error playing audio: ${error}`);
    }
  }

  /**
   * Ask AI about a specific location (for future use)
   */
  public async askAboutLocation(latitude: number, longitude: number): Promise<void> {
    if (this.isProcessing) {
      log.w("Already processing a request. Please wait.");
      return;
    }

    this.isProcessing = true;
    this.displayResponse("Analyzing location...");

    try {
      const prompt = `Tell me 3 interesting facts about the location at latitude ${latitude.toFixed(6)}, longitude ${longitude.toFixed(6)}. Keep each fact to one sentence.`;
      
      const response = await this.callOpenAI(prompt);
      this.handleResponse(response);
      
    } catch (error) {
      log.e(`Error in askAboutLocation: ${error}`);
      this.displayResponse(`Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Ask AI about nearby places (for integration with PlacesProvider)
   */
  public async askAboutPlaces(places: PlaceInfo[]): Promise<void> {
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
      const placesContext = places.slice(0, 5).map((place, index) => 
        `${index + 1}. ${place.name} (${place.category})`
      ).join("\n");

      const prompt = `Based on these nearby places:\n${placesContext}\n\nProvide a brief recommendation on what to explore or do in this area. Keep it to 2-3 sentences.`;
      
      const response = await this.callOpenAI(prompt);
      this.handleResponse(response);
      
    } catch (error) {
      log.e(`Error in askAboutPlaces: ${error}`);
      this.displayResponse(`Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Cancel current processing
   */
  public cancelRequest(): void {
    if (this.isProcessing) {
      this.isProcessing = false;
      this.displayResponse("Request cancelled");
      log.i("Request cancelled by user");
    }
  }

  /**
   * Check if currently processing a request
   */
  public isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}