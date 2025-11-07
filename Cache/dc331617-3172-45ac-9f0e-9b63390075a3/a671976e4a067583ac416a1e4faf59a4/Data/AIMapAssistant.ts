import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "./MapComponent";
import { PlaceInfo } from "./SnapPlacesProvider";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";

const TAG = "[AIMapAssistant]";
const log = new NativeLogger(TAG);

@component
export class AIMapAssistant extends BaseScriptComponent {
  @input
  private mapComponent: MapComponent;

  @input
  @hint("Modèle OpenAI à utiliser")
  private openAIModel: string = "gpt-4o-mini";

  @input
  @hint("Nombre maximum de tokens pour la réponse")
  private maxTokens: number = 150;

  @input
  @hint("Temperature pour la créativité (0-2)")
  private temperature: number = 0.7;

  @input
  @hint("Voix pour le TTS")
  private ttsVoice: string = "alloy";

  @input
  @hint("Modèle TTS à utiliser")
  private ttsModel: string = "tts-1";

  @input
  @allowUndefined
  private responseText: Text;

  @input
  @allowUndefined
  @hint("Container Frame qui contient le texte de réponse")
  private responseContainer: SceneObject;

  @input
  @allowUndefined
  @hint("AudioComponent pour jouer le son TTS")
  private audioComponent: AudioComponent;

  @input
  @hint("Active les logs détaillés pour le debug")
  private enableDebugLogs: boolean = true;

  private isProcessing: boolean = false;
  private currentAudioTrack: AudioTrackAsset | null = null;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    log.i("=== AIMapAssistant INITIALIZATION ===");
    
    if (!this.mapComponent) {
      log.e("MapComponent is not assigned!");
    } else {
      log.i("MapComponent: OK");
    }

    if (!this.responseText) {
      log.w("Response Text is not assigned - text display will be disabled");
    } else {
      log.i("Response Text: OK");
    }

    if (!this.responseContainer) {
      log.w("Response Container is not assigned - container won't be shown/hidden");
    } else {
      log.i("Response Container: OK");
      this.responseContainer.enabled = false;
    }

    if (!this.audioComponent) {
      log.w("Audio Component is not assigned - TTS audio won't play");
    } else {
      log.i("Audio Component: OK");
    }

    log.i("=== AIMapAssistant initialized successfully ===");
  }

  /**
   * Main method to ask AI about the current map view
   */
  public askAboutCurrentView(): void {
    log.i("========================================");
    log.i("askAboutCurrentView() CALLED");
    log.i("========================================");

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
    log.i("Set isProcessing = true");

    try {
      log.i("Collecting map context...");
      const context = this.collectMapContext();
      log.i(`Context collected: ${context.substring(0, 100)}...`);
      
      const prompt = this.buildPrompt(context);
      log.i(`Prompt built (${prompt.length} chars)`);
      
      log.i("Calling OpenAI API...");
      this.callOpenAI(prompt);
      
    } catch (error) {
      log.e(`❌ Error in askAboutCurrentView: ${error}`);
      this.displayResponse(`❌ Error: ${error}`, true);
      this.isProcessing = false;
    }
  }

  /**
   * Collect all relevant context from the current map view
   */
  private collectMapContext(): string {
    const context: string[] = [];

    try {
      // Get the CURRENT center of the visible map (what user is looking at NOW)
      const currentMapCenter = this.mapComponent.getCurrentMapCenterLocation();
      if (currentMapCenter) {
        context.push(`Currently Viewing: Latitude ${currentMapCenter.latitude.toFixed(6)}, Longitude ${currentMapCenter.longitude.toFixed(6)}`);
        log.i(`🗺️ Analyzing map view at: ${currentMapCenter.latitude.toFixed(6)}, ${currentMapCenter.longitude.toFixed(6)}`);
      } else {
        log.w("Current map center not available");
      }

      // Get zoom level - important for understanding scale
      const zoomLevel = this.mapComponent.mapZoomLevel;
      context.push(`Zoom Level: ${zoomLevel}`);
      
      // Add context about zoom level
      if (zoomLevel < 12) {
        context.push(`View Type: Wide area overview (city/region level)`);
      } else if (zoomLevel < 16) {
        context.push(`View Type: Neighborhood level`);
      } else {
        context.push(`View Type: Street level detail`);
      }

      // Optional: include user's actual location for reference
      const userLocation = this.mapComponent.getUserLocation();
      if (userLocation && currentMapCenter) {
        const latDiff = Math.abs(currentMapCenter.latitude - userLocation.latitude);
        const lonDiff = Math.abs(currentMapCenter.longitude - userLocation.longitude);
        
        if (latDiff > 0.01 || lonDiff > 0.01) {
          context.push(`Note: User is exploring a remote area (not their current physical location)`);
          log.i("🌍 User is exploring a different area than their current location");
        } else {
          log.i("📍 User is viewing their current location area");
        }
      }

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

IMPORTANT: The user is asking about the location they are "Currently Viewing" on the map. This is the center of what they see on their AR map display.

Provide 2-3 brief, interesting insights specifically about the location they are viewing. Focus on:
- Notable landmarks, attractions or features in that specific area
- Historical or cultural significance
- Interesting local facts

Keep your response under 100 words, conversational, and speak directly about "this area" or "here". Do NOT mention coordinates.`;
  }

  /**
   * Call OpenAI Chat Completions API
   */
  private callOpenAI(prompt: string): void {
    log.i("🚀 Preparing OpenAI request...");

    const request: OpenAITypes.ChatCompletions.Request = {
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

    log.i(`Model: ${this.openAIModel}, Max Tokens: ${this.maxTokens}`);
    log.i("Calling OpenAI.chatCompletions()...");

    this.displayResponse("🤖 Asking AI...", true);

    OpenAI.chatCompletions(request)
      .then((response) => {
        log.i("✅ OpenAI response received!");
        this.handleChatResponse(response);
      })
      .catch((error) => {
        log.e(`❌ OpenAI API error: ${error}`);
        this.handleError(`API error: ${error}`);
      });
  }

  /**
   * Handle Chat Completion response
   */
  private handleChatResponse(response: OpenAITypes.ChatCompletions.Response): void {
    log.i("Processing chat response...");
    
    try {
      if (response.choices && response.choices.length > 0) {
        const aiResponse = response.choices[0].message.content;
        
        if (aiResponse) {
          log.i(`✅ AI Response received (${aiResponse.length} chars)`);
          log.i(`Response: ${aiResponse}`);
          
          this.displayResponse(aiResponse, true);
          
          log.i("Starting TTS generation...");
          this.generateAndPlayTTS(aiResponse);
        } else {
          this.handleError("No content in AI response");
        }
      } else {
        this.handleError("No choices in AI response");
      }
    } catch (error) {
      log.e(`Error handling chat response: ${error}`);
      this.handleError(`Error: ${error}`);
    }
  }

  /**
   * Generate and play Text-to-Speech
   */
  private generateAndPlayTTS(text: string): void {
    const speechRequest: OpenAITypes.Speech.Request = {
      model: this.ttsModel as OpenAITypes.Speech.Model,
      input: text,
      voice: this.ttsVoice as OpenAITypes.Speech.Voice,
      response_format: "mp3"
    };

    log.i("🎤 Generating speech...");

    OpenAI.speech(speechRequest)
      .then((audioTrack) => {
        log.i("✅ Speech generated successfully!");
        this.playAudio(audioTrack);
      })
      .catch((error) => {
        log.e(`❌ TTS error: ${error}`);
      })
      .finally(() => {
        log.i("Setting isProcessing = false");
        this.isProcessing = false;
      });
  }

  /**
   * Play audio from TTS
   */
  private playAudio(audioTrack: AudioTrackAsset): void {
    try {
      if (!this.audioComponent) {
        log.w("No audio component assigned - skipping audio playback");
        this.isProcessing = false;
        return;
      }

      log.i("🔊 Playing audio...");

      if (this.audioComponent.isPlaying()) {
        this.audioComponent.stop(false);
      }

      this.audioComponent.audioTrack = audioTrack;
      this.currentAudioTrack = audioTrack;
      
      this.audioComponent.play(1);
      
      log.i("✅ Audio playback started!");
      
    } catch (error) {
      log.e(`❌ Error playing audio: ${error}`);
      this.isProcessing = false;
    }
  }

  /**
   * Handle errors
   */
  private handleError(errorMessage: string): void {
    log.e(`❌ ${errorMessage}`);
    this.displayResponse(`❌ Error: ${errorMessage}`, true);
    this.isProcessing = false;
  }

  /**
   * Display response in the UI
   */
  private displayResponse(text: string, show: boolean): void {
    log.i(`Displaying: "${text.substring(0, 50)}..."`);
    
    if (this.responseText) {
      this.responseText.text = text;
      log.i("Text updated successfully");
    } else {
      log.w("responseText not assigned, cannot display text");
    }
    
    if (this.responseContainer) {
      this.responseContainer.enabled = show;
      log.i(`Container ${show ? "shown" : "hidden"}`);
    } else {
      log.w("responseContainer not assigned, cannot show/hide");
    }
  }

  /**
   * Hide the response container
   */
  public hideResponse(): void {
    log.i("hideResponse() called");
    
    if (this.responseContainer) {
      this.responseContainer.enabled = false;
    }
    
    if (this.audioComponent && this.audioComponent.isPlaying()) {
      this.audioComponent.stop(false);
      log.i("Audio stopped");
    }
  }

  /**
   * Ask AI about a specific location
   */
  public askAboutLocation(latitude: number, longitude: number): void {
    log.i(`askAboutLocation called: ${latitude}, ${longitude}`);
    
    if (this.isProcessing) {
      log.w("Already processing a request. Please wait.");
      return;
    }

    this.isProcessing = true;
    this.displayResponse("🌍 Analyzing location...", true);

    try {
      const prompt = `Tell me 2 interesting facts about the location at latitude ${latitude.toFixed(6)}, longitude ${longitude.toFixed(6)}. Keep it very brief.`;
      
      this.callOpenAI(prompt);
      
    } catch (error) {
      log.e(`Error in askAboutLocation: ${error}`);
      this.displayResponse(`Error: ${error}`, true);
      this.isProcessing = false;
    }
  }

  /**
   * Ask AI about nearby places
   */
  public askAboutPlaces(places: PlaceInfo[]): void {
    log.i(`askAboutPlaces called with ${places?.length || 0} places`);
    
    if (this.isProcessing) {
      log.w("Already processing a request. Please wait.");
      return;
    }

    if (!places || places.length === 0) {
      log.w("No places to analyze");
      return;
    }

    this.isProcessing = true;
    this.displayResponse("🏪 Analyzing nearby places...", true);

    try {
      const placesContext = places.slice(0, 5).map((place, index) => 
        `${index + 1}. ${place.name} (${place.category})`
      ).join("\n");

      const prompt = `Based on these nearby places:\n${placesContext}\n\nProvide a brief recommendation. Keep it under 50 words.`;
      
      this.callOpenAI(prompt);
      
    } catch (error) {
      log.e(`Error in askAboutPlaces: ${error}`);
      this.displayResponse(`Error: ${error}`, true);
      this.isProcessing = false;
    }
  }

  /**
   * Cancel current processing
   */
  public cancelRequest(): void {
    if (this.isProcessing) {
      this.isProcessing = false;
      this.hideResponse();
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