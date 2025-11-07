import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "./MapComponent";
import { PlaceInfo } from "./SnapPlacesProvider";

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
  private enableTextToSpeech: boolean = false;

  @input
  @allowUndefined
  private responseText: Text;

  @input
  @allowUndefined
  @hint("Audio component pour jouer le son TTS")
  private audioComponent: AudioComponent;

  private isProcessing: boolean = false;

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

    log.i("AIMapAssistant initialized successfully");
  }

  /**
   * Main method to ask AI about the current map view
   */
  public askAboutCurrentView(): void {
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
      
    } catch (error) {
      log.e(`Error in askAboutCurrentView: ${error}`);
      this.displayResponse(`Error: ${error}`);
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
  private callOpenAI(prompt: string): void {
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
  private handleHttpResponse(response: RemoteServiceHttpResponse): void {
    try {
      if (response.statusCode === 200) {
        const responseBody = response.body;
        
        try {
          const data: OpenAIResponse = JSON.parse(responseBody);
          
          if (data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            log.i("Received response from OpenAI");
            this.handleResponse(aiResponse);
          } else {
            this.handleError("No response content from OpenAI");
          }
        } catch (parseError) {
          log.e(`Error parsing OpenAI response: ${parseError}`);
          this.handleError(`Failed to parse response: ${parseError}`);
        }
      } else {
        log.e(`OpenAI API error: ${response.statusCode}`);
        this.handleError(`API error: ${response.statusCode}`);
      }
    } catch (error) {
      log.e(`Error handling response: ${error}`);
      this.handleError(`Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Handle the AI response - display and optionally speak it
   */
  private handleResponse(response: string): void {
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
  private handleError(errorMessage: string): void {
    log.e(errorMessage);
    this.displayResponse(`Error: ${errorMessage}`);
    this.isProcessing = false;
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
   * Use Text-to-Speech to read the response (simplified version)
   */
  private speakResponse(text: string): void {
    try {
      log.i(`TTS: ${text}`);
      
      // Note: Spectacles TTS implementation varies by version
      // This is a placeholder - you may need to use a different TTS solution
      // or the built-in audio playback with pre-generated TTS
      
      if (this.audioComponent) {
        log.i("Audio component available for TTS playback");
        // You would need to integrate with a TTS service that returns audio
        // or use Spectacles' native TTS if available in your SDK version
      } else {
        log.w("No audio component assigned for TTS");
      }
      
    } catch (error) {
      log.e(`Error in speakResponse: ${error}`);
    }
  }

  /**
   * Ask AI about a specific location
   */
  public askAboutLocation(latitude: number, longitude: number): void {
    if (this.isProcessing) {
      log.w("Already processing a request. Please wait.");
      return;
    }

    this.isProcessing = true;
    this.displayResponse("Analyzing location...");

    try {
      const prompt = `Tell me 3 interesting facts about the location at latitude ${latitude.toFixed(6)}, longitude ${longitude.toFixed(6)}. Keep each fact to one sentence.`;
      
      this.callOpenAI(prompt);
      
    } catch (error) {
      log.e(`Error in askAboutLocation: ${error}`);
      this.displayResponse(`Error: ${error}`);
      this.isProcessing = false;
    }
  }

  /**
   * Ask AI about nearby places
   */
  public askAboutPlaces(places: PlaceInfo[]): void {
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
      
      this.callOpenAI(prompt);
      
    } catch (error) {
      log.e(`Error in askAboutPlaces: ${error}`);
      this.displayResponse(`Error: ${error}`);
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