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
  @input private mapComponent: MapComponent;
  @input private openAIModel: string = "gpt-4o-mini";
  @input private maxTokens: number = 150;
  @input private temperature: number = 0.7;
  @input private ttsVoice: string = "alloy";
  @input private ttsModel: string = "tts-1";

  @input @allowUndefined private responseText: Text;
  @input @allowUndefined private responseContainer: SceneObject;
  @input @allowUndefined private audioComponent: AudioComponent;

  @input @allowUndefined
  @hint("AudioComponent de la musique de fond (ex: Music Audio Player)")
  private musicAudioPlayer: AudioComponent;

  @input @allowUndefined private aiResponseAnimator: AIResponseAnimator;

  @input private enableDebugLogs: boolean = true;

  private isProcessing: boolean = false;
  private wasPlaying: boolean = false;
  private audioFinished: boolean = false;

  // Volume original de la musique
  private originalMusicVolume: number = 1.0;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.initialize());
    this.createEvent("UpdateEvent").bind(() => this.checkAudioCompletion());
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== AIMapAssistant INITIALIZED ===");

    // Sauvegarder le volume initial de la musique
    if (this.musicAudioPlayer) {
      this.originalMusicVolume = this.musicAudioPlayer.volume;
      if (this.enableDebugLogs) log.i(`Original music volume saved: ${this.originalMusicVolume}`);
    } else {
      log.w("Music Audio Player not assigned – volume ducking disabled");
    }
  }

  public askAboutCurrentView(): void {
    if (this.isProcessing) {
      this.displayResponse("Already processing...", true);
      return;
    }

    if (!this.mapComponent) {
      this.displayResponse("Error: Map not ready", true);
      return;
    }

    this.isProcessing = true;
    this.audioFinished = false;
    this.wasPlaying = false;
    this.displayResponse("Analyzing map...", true);

    // NE PAS baisser le volume ici — on attend le début du TTS
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
    return `You are a navigation assistant for AR glasses.\n\nContext:\n${context}\n\nGive 2-3 brief, interesting facts. Max 100 words.`;
  }

  private callOpenAI(prompt: string): void {
    this.displayResponse("📡 Asking AI...", true);

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
      .catch(e => {
        this.handleError(`API error: ${e}`);
        this.restoreMusicVolume(); // au cas où
      });
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
        this.restoreMusicVolume();
        this.isProcessing = false;
      });
  }

  private playAudio(audioTrack: AudioTrackAsset): void {
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

    if (this.enableDebugLogs) log.i("TTS playback started → ducking music");

    // BAISSER LE VOLUME ICI, QUAND LE TTS COMMENCE
    this.duckMusicVolume();

    this.wasPlaying = true;
    this.audioFinished = false;
    this.isProcessing = false;
  }

  // Appelé à chaque frame
  private checkAudioCompletion(): void {
    if (!this.audioComponent || !this.wasPlaying) return;

    const isPlaying = this.audioComponent.isPlaying();

    if (this.wasPlaying && !isPlaying && !this.audioFinished) {
      this.audioFinished = true;
      this.wasPlaying = false;

      if (this.enableDebugLogs) log.i("TTS finished → restoring music & hiding response");

      // 1. Remonter le volume
      this.restoreMusicVolume();

      // 2. Cacher le container
      this.hideResponse();
    }

    this.wasPlaying = isPlaying;
  }

  private duckMusicVolume(): void {
    if (this.musicAudioPlayer) {
      this.musicAudioPlayer.volume = 0.35;
      if (this.enableDebugLogs) log.i("Music volume ducked to 0.35");
    }
  }

  private restoreMusicVolume(): void {
    if (this.musicAudioPlayer && this.musicAudioPlayer.volume < this.originalMusicVolume) {
      this.musicAudioPlayer.volume = this.originalMusicVolume;
      if (this.enableDebugLogs) log.i(`Music volume restored to ${this.originalMusicVolume}`);
    }
  }

  private handleError(msg: string): void {
    log.e(msg);
    this.displayResponse(`Error: ${msg}`, true);
    this.restoreMusicVolume();
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
      this.audioComponent?.stop(false);
      this.restoreMusicVolume();
      this.hideResponse();
    }
  }

  public isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}