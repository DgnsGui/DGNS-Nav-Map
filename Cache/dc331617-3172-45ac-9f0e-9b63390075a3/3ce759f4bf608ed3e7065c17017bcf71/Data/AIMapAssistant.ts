import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "./MapComponent";
import { PlaceInfo } from "./SnapPlacesProvider";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";
import { AIResponseAnimator } from "../../AIFrameAnimator";

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
  private audioComponent: AudioComponent;

  @input
  @allowUndefined
  @hint("L'animateur de réponse AI pour contrôler les animations du container")
  private aiResponseAnimator: AIResponseAnimator;

  @input
  @hint("Durée estimée de l'audio TTS (secondes) – à ajuster selon la longueur moyenne")
  private estimatedAudioDuration: number = 5.0;

  @input
  @hint("Active les logs détaillés pour le debug")
  private enableDebugLogs: boolean = true;

  private isProcessing: boolean = false;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.initialize();
    });
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== AIMapAssistant INITIALIZATION ===");

    if (!this.mapComponent) log.e("MapComponent is not assigned!");
    if (!this.responseText) log.w("Response Text not assigned");
    if (!this.responseContainer) log.w("Response Container not assigned");
    if (!this.audioComponent) log.w("Audio Component not assigned");
    if (!this.aiResponseAnimator) log.w("AIResponseAnimator not assigned");

    if (this.enableDebugLogs) log.i("=== AIMapAssistant initialized successfully ===");
  }

  public askAboutCurrentView(): void {
    if (this.isProcessing) {
      this.displayResponse("Already processing...", true);
      return;
    }

    if (!this.mapComponent) {
      this.displayResponse("Error: Map not configured", true);
      return;
    }

    this.isProcessing = true;
    this.displayResponse("Analyzing map data...", true);

    const context = this.collectMapContext();
    const prompt = this.buildPrompt(context);
    this.callOpenAI(prompt);
  }

  private collectMapContext(): string {
    const parts: string[] = [];
    const loc = this.mapComponent.getUserLocation();
    if (loc) parts.push(`User: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(2)} degrees`);
    const center = this.mapComponent.getInitialMapTileLocation();
    if (center) parts.push(`Center: ${center.latitude.toFixed(6)}, ${center.longitude.toFixed(6)}`);
    parts.push(`Zoom: ${this.mapComponent.mapZoomLevel}`);
    return parts.join("\n");
  }

  private buildPrompt(context: string): string {
    return `You are a navigation assistant for AR glasses.

Context:
${context}

Give 2-3 brief, interesting facts. Max 100 words.`;
  }

  private callOpenAI(prompt: string): void {
    this.displayResponse("Asking AI...", true);

    const request: OpenAITypes.ChatCompletions.Request = {
      model: this.openAIModel,
      messages: [
        { role: "system", content: "Be concise and conversational." },
        { role: "user", content: prompt }
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature
    };

    OpenAI.chatCompletions(request)
      .then(r => this.handleChatResponse(r))
      .catch(e => this.handleError(`API error: ${e}`));
  }

  private handleChatResponse(response: OpenAITypes.ChatCompletions.Response): void {
    const text = response.choices?.[0]?.message?.content;
    if (!text) {
      this.handleError("Empty response");
      return;
    }

    this.displayResponse(text, true);
    this.generateAndPlayTTS(text);
  }

  private generateAndPlayTTS(text: string): void {
    const req: OpenAITypes.Speech.Request = {
      model: this.ttsModel as OpenAITypes.Speech.Model,
      input: text,
      voice: this.ttsVoice as OpenAITypes.Speech.Voice,
      response_format: "mp3"
    };

    OpenAI.speech(req)
      .then(track => this.playAudio(track))
      .catch(e => {
        log.e(`TTS error: ${e}`);
        this.isProcessing = false;
      });
  }

  private playAudio(audioTrack: AudioTrackAsset): void {
    if (!this.audioComponent) {
      this.isProcessing = false;
      return;
    }

    if (this.audioComponent.isPlaying()) {
      this.audioComponent.stop(false);
    }

    this.audioComponent.audioTrack = audioTrack;
    this.audioComponent.play(1);

    if (this.enableDebugLogs) log.i("Audio started");

    // Utilisation d'un DelayedCallbackEvent avec durée estimée
    const delayEvent = this.createEvent("DelayedCallbackEvent");
    delayEvent.bind(() => {
      if (this.enableDebugLogs) log.i("Estimated audio duration elapsed → hiding response");
      this.hideResponse();
      delayEvent.enabled = false;
    });
    delayEvent.reset(this.estimatedAudioDuration);
    delayEvent.enabled = true;

    this.isProcessing = false;
  }

  private handleError(msg: string): void {
    log.e(msg);
    this.displayResponse(`Error: ${msg}`, true);
    this.isProcessing = false;
  }

  private displayResponse(text: string, show: boolean): void {
    if (this.responseText) {
      this.responseText.text = text;
    }

    if (this.aiResponseAnimator) {
      show ? this.aiResponseAnimator.animateIn() : this.aiResponseAnimator.animateOut();
    } else if (this.responseContainer) {
      this.responseContainer.enabled = show;
    }
  }

  public hideResponse(): void {
    if (this.audioComponent?.isPlaying()) {
      this.audioComponent.stop(false);
    }

    if (this.aiResponseAnimator) {
      this.aiResponseAnimator.animateOut();
    } else if (this.responseContainer) {
      this.responseContainer.enabled = false;
    }
  }

  public askAboutLocation(lat: number, lng: number): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.displayResponse("Analyzing location...", true);
    const prompt = `2 facts about ${lat.toFixed(6)}, ${lng.toFixed(6)}. Keep brief.`;
    this.callOpenAI(prompt);
  }

  public askAboutPlaces(places: PlaceInfo[]): void {
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

  public cancelRequest(): void {
    if (this.isProcessing) {
      this.isProcessing = false;
      this.hideResponse();
    }
  }

  public isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}