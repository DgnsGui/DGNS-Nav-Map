import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "./MapComponent";
import { PlaceInfo } from "./SnapPlacesProvider";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";
import { AIResponseAnimator } from "../AIFrameAnimator"; // Assurez-vous que le chemin d'importation est correct, il pourrait varier selon votre structure de projet.

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
  @allowUndefined
  @hint("L'animateur de réponse AI pour contrôler les animations du container")
  private aiResponseAnimator: AIResponseAnimator;

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
    if (this.enableDebugLogs) log.i("=== AIMapAssistant INITIALIZATION ===");

    // Verify all required components
    if (!this.mapComponent) {
      log.e("MapComponent is not assigned!");
    } else if (this.enableDebugLogs) {
      log.i("MapComponent: OK");
    }

    if (!this.responseText) {
      log.w("Response Text is not assigned - text display will be disabled");
    } else if (this.enableDebugLogs) {
      log.i("Response Text: OK");
    }

    if (!this.responseContainer) {
      log.w("Response Container is not assigned - container won't be shown/hidden");
    } else {
      // Si l'animateur n'est pas assigné, nous nous assurons que le container est désactivé au démarrage.
      // L'animateur gérera son propre état enabled/disabled.
      if (!this.aiResponseAnimator) {
        this.responseContainer.enabled = false;
      }
      if (this.enableDebugLogs) log.i("Response Container: OK");
    }

    if (!this.audioComponent) {
      log.w("Audio Component is not assigned - TTS audio won't play");
    } else if (this.enableDebugLogs) {
      log.i("Audio Component: OK");
    }

    if (!this.aiResponseAnimator) {
      log.w("AIResponseAnimator is not assigned - animations for response container will be disabled");
    } else if (this.enableDebugLogs) {
      log.i("AIResponseAnimator: OK");
    }

    if (this.enableDebugLogs) log.i("=== AIMapAssistant initialized successfully ===");
  }

  /**
   * Main method to ask AI about the current map view
   */
  public askAboutCurrentView(): void {
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
    if (this.enableDebugLogs) log.i("Set isProcessing = true");

    try {
      if (this.enableDebugLogs) log.i("Collecting map context...");
      const context = this.collectMapContext();
      if (this.enableDebugLogs) log.i(`Context collected: ${context.substring(0, Math.min(context.length, 100))}...`);

      const prompt = this.buildPrompt(context);
      if (this.enableDebugLogs) log.i(`Prompt built (${prompt.length} chars)`);

      if (this.enableDebugLogs) log.i("Calling OpenAI API...");
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
      const userLocation = this.mapComponent.getUserLocation();
      if (userLocation) {
        context.push(`User Location: Latitude ${userLocation.latitude.toFixed(6)}, Longitude ${userLocation.longitude.toFixed(6)}`);
        if (this.enableDebugLogs) log.i(`User location: ${userLocation.latitude}, ${userLocation.longitude}`);
      } else {
        log.w("User location not available");
      }

      const heading = this.mapComponent.getUserHeading();
      context.push(`User Heading: ${heading.toFixed(2)} degrees`);

      const mapLocation = this.mapComponent.getInitialMapTileLocation();
      if (mapLocation) {
        context.push(`Map Center: Latitude ${mapLocation.latitude.toFixed(6)}, Longitude ${mapLocation.longitude.toFixed(6)}`);
      }

      context.push(`Zoom Level: ${this.mapComponent.mapZoomLevel}`);

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

Provide 2-3 brief, interesting insights about this geographical area. Keep your response under 100 words and conversational.`;
  }

  /**
   * Call OpenAI Chat Completions API
   */
  private callOpenAI(prompt: string): void {
    if (this.enableDebugLogs) log.i("🚀 Preparing OpenAI request...");

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

    if (this.enableDebugLogs) log.i(`Model: ${this.openAIModel}, Max Tokens: ${this.maxTokens}`);
    if (this.enableDebugLogs) log.i("Calling OpenAI.chatCompletions()...");

    this.displayResponse("🤖 Asking AI...", true);

    OpenAI.chatCompletions(request)
      .then((response) => {
        if (this.enableDebugLogs) log.i("✅ OpenAI response received!");
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
    if (this.enableDebugLogs) log.i("Processing chat response...");

    try {
      if (response.choices && response.choices.length > 0) {
        const aiResponse = response.choices[0].message.content;

        if (aiResponse) {
          if (this.enableDebugLogs) log.i(`✅ AI Response received (${aiResponse.length} chars)`);
          if (this.enableDebugLogs) log.i(`Response: ${aiResponse}`);

          this.displayResponse(aiResponse, true);

          if (this.enableDebugLogs) log.i("Starting TTS generation...");
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

    if (this.enableDebugLogs) log.i("🎤 Generating speech...");

    OpenAI.speech(speechRequest)
      .then((audioTrack) => {
        if (this.enableDebugLogs) log.i("✅ Speech generated successfully!");
        this.playAudio(audioTrack);
      })
      .catch((error) => {
        log.e(`❌ TTS error: ${error}`);
      })
      .finally(() => {
        if (this.enableDebugLogs) log.i("Setting isProcessing = false");
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

      if (this.enableDebugLogs) log.i("🔊 Playing audio...");

      if (this.audioComponent.isPlaying()) {
        this.audioComponent.stop(false);
      }

      this.audioComponent.audioTrack = audioTrack;
      this.currentAudioTrack = audioTrack;

      this.audioComponent.play(1);

      if (this.enableDebugLogs) log.i("✅ Audio playback started!");

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
   * Display response in the UI and trigger animation
   * @param text Le texte à afficher.
   * @param show Si true, affiche et anime l'entrée ; si false, anime la sortie et masque.
   */
  private displayResponse(text: string, show: boolean): void {
    if (this.enableDebugLogs) log.i(`Displaying: "${text.substring(0, Math.min(text.length, 50))}"... (show: ${show})`);

    if (this.responseText) {
      this.responseText.text = text;
      if (this.enableDebugLogs) log.i("Text updated successfully");
    } else {
      log.w("responseText not assigned, cannot display text");
    }

    if (this.aiResponseAnimator) {
      if (show) {
        this.aiResponseAnimator.animateIn();
      } else {
        // Appeler animateOut uniquement si l'animateur est visible, sinon pas besoin d'animer
        if (this.aiResponseAnimator.getIsVisible()) {
            this.aiResponseAnimator.animateOut();
        }
      }
      if (this.enableDebugLogs) log.i(`Container animation triggered via AIResponseAnimator: ${show ? "IN" : "OUT"}`);
    } else if (this.responseContainer) {
      // Fallback si l'animateur n'est pas assigné : gérer directement la visibilité
      this.responseContainer.enabled = show;
      log.w(`AIResponseAnimator not assigned, directly setting responseContainer.enabled to ${show}`);
    } else {
      log.w("responseContainer not assigned, cannot show/hide");
    }
  }

  /**
   * Hide the response container and trigger animation OUT.
   * Cette méthode est publique et destinée à être appelée par un bouton "X" ou une autre interaction.
   */
  public hideResponse(): void {
    if (this.enableDebugLogs) log.i("hideResponse() called");

    if (this.aiResponseAnimator) {
      if (this.aiResponseAnimator.getIsVisible()) {
        this.aiResponseAnimator.animateOut(); // Déclenche l'animation de sortie
        if (this.enableDebugLogs) log.i("Triggered animateOut via AIResponseAnimator");
      } else {
          if (this.enableDebugLogs) log.i("AIResponseAnimator is already hidden, no animation needed.");
      }
    } else if (this.responseContainer) {
      // Fallback si l'animateur n'est pas assigné
      this.responseContainer.enabled = false;
      log.w("AIResponseAnimator not assigned, directly hiding responseContainer");
    }

    // Arrêter l'audio si en cours de lecture
    if (this.audioComponent && this.audioComponent.isPlaying()) {
      this.audioComponent.stop(false);
      if (this.enableDebugLogs) log.i("Audio stopped");
    }
  }

  /**
   * Ask AI about a specific location
   */
  public askAboutLocation(latitude: number, longitude: number): void {
    if (this.enableDebugLogs) log.i(`askAboutLocation called: ${latitude}, ${longitude}`);

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
    if (this.enableDebugLogs) log.i(`askAboutPlaces called with ${places?.length || 0} places`);

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
      this.hideResponse(); // Appelle hideResponse qui gérera l'animation
      if (this.enableDebugLogs) log.i("Request cancelled by user");
    }
  }

  /**
   * Check if currently processing a request
   */
  public isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}