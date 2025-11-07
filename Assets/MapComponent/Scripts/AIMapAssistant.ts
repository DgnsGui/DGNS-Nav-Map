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
  @input private maxTokens: number = 200;
  @input private temperature: number = 0.8;
  @input private ttsVoice: string = "alloy";
  @input private ttsModel: string = "tts-1";

  @input @allowUndefined private responseText: Text;
  @input @allowUndefined private loadingText: Text;
  @input @allowUndefined private responseContainer: SceneObject;
  @input @allowUndefined private audioComponent: AudioComponent;

  @input @allowUndefined
  @hint("AudioComponent de la musique de fond (ex: Music Audio Player)")
  private musicAudioPlayer: AudioComponent;

  @input @allowUndefined private aiResponseAnimator: AIResponseAnimator;

  @input private enableDebugLogs: boolean = true;

  // Paramètres de timing
  @input private volumeDuckDelay: number = 0.3;
  @input private minAudioDuration: number = 2.0;
  @input private postAudioDelay: number = 0.5;
  @input private maxAudioDuration: number = 30.0;

  private isProcessing: boolean = false;
  private audioStartTime: number = 0;
  private volumeDuckTimer: DelayedCallbackEvent | null = null;
  private hideResponseTimer: DelayedCallbackEvent | null = null;
  private timeoutTimer: DelayedCallbackEvent | null = null;
  
  private isAudioActive: boolean = false;
  private consecutiveNotPlayingFrames: number = 0;
  private readonly FRAMES_TO_CONFIRM_STOP: number = 10;

  private originalMusicVolume: number = 1.0;
  
  // Animation du texte loading
  private loadingAnimationTimer: DelayedCallbackEvent | null = null;
  private loadingDots: number = 0;
  private loadingBaseText: string = "";
  private isLoadingAnimating: boolean = false;

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.initialize());
    this.createEvent("UpdateEvent").bind(() => this.updateAudioState());
  }

  private initialize(): void {
    if (this.enableDebugLogs) log.i("=== AIMapAssistant INITIALIZED ===");

    if (this.musicAudioPlayer) {
      this.originalMusicVolume = this.musicAudioPlayer.volume;
      if (this.enableDebugLogs) log.i(`Original music volume saved: ${this.originalMusicVolume}`);
    } else {
      log.w("Music Audio Player not assigned – volume ducking disabled");
    }
  }

  public askAboutCurrentView(): void {
    if (this.isProcessing) {
      this.displayLoading("Already processing...", true);
      return;
    }

    if (!this.mapComponent) {
      this.displayLoading("Error: Map not ready", true);
      return;
    }

    this.resetAudioState();
    this.isProcessing = true;
    this.displayLoading("Analyzing location...", true);

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

  private collectMapContextSimple(): string {
    const parts: string[] = [];
    const loc = this.mapComponent.getUserLocation();
    if (loc) {
      parts.push(`GPS: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    }
    parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(0)}°`);
    parts.push(`Zoom: ${this.mapComponent.mapZoomLevel}`);
    return parts.join("\n");
  }

  private buildEnhancedPrompt(lat: number, lng: number, context: string): string {
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

  private resetAudioState(): void {
    this.isAudioActive = false;
    this.consecutiveNotPlayingFrames = 0;
    this.audioStartTime = 0;
    this.cancelAllTimers();
  }

  private cancelAllTimers(): void {
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
    if (this.loadingAnimationTimer) {
      this.loadingAnimationTimer.cancel();
      this.loadingAnimationTimer = null;
    }
  }

  private callOpenAI(prompt: string): void {
    this.displayLoading("🌐 Locating... 📡", true);

    const request: OpenAITypes.ChatCompletions.Request = {
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

    OpenAI.chatCompletions(request)
      .then(r => this.handleChatResponse(r))
      .catch(e => {
        this.handleError(`API error: ${e}`);
        this.cleanupAfterAudio();
      });
  }

  private handleChatResponse(response: OpenAITypes.ChatCompletions.Response): void {
    const text = response.choices?.[0]?.message?.content;
    if (!text) {
      this.handleError("Empty response");
      return;
    }

    // Arrêter l'animation du loading et cacher le texte
    this.stopLoadingAnimation();
    if (this.loadingText) {
      this.loadingText.enabled = false;
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
        this.cleanupAfterAudio();
        this.isProcessing = false;
      });
  }

  private playAudio(audioTrack: AudioTrackAsset): void {
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

    if (this.enableDebugLogs) log.i("TTS playback started → scheduling volume duck");

    this.volumeDuckTimer = this.createEvent("DelayedCallbackEvent");
    this.volumeDuckTimer.bind(() => {
      this.duckMusicVolume();
      if (this.enableDebugLogs) log.i("Volume ducked after delay");
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

  private updateAudioState(): void {
    if (!this.isAudioActive || !this.audioComponent) return;

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
    } else {
      this.consecutiveNotPlayingFrames = 0;
    }
  }

  private scheduleCleanup(): void {
    this.isAudioActive = false;

    if (this.timeoutTimer) {
      this.timeoutTimer.cancel();
      this.timeoutTimer = null;
    }

    if (this.enableDebugLogs) log.i(`Scheduling cleanup in ${this.postAudioDelay}s`);

    this.hideResponseTimer = this.createEvent("DelayedCallbackEvent");
    this.hideResponseTimer.bind(() => {
      this.cleanupAfterAudio();
    });
    this.hideResponseTimer.reset(this.postAudioDelay);
  }

  private forceCleanup(): void {
    if (this.enableDebugLogs) log.w("Force cleanup triggered");
    this.isAudioActive = false;
    this.cleanupAfterAudio();
  }

  private cleanupAfterAudio(): void {
    if (this.enableDebugLogs) log.i("Executing cleanup: restoring volume & hiding container");
    
    this.restoreMusicVolume();
    this.hideResponse();
    this.clearAllText(); // Effacer les textes
    this.cancelAllTimers();
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
    this.cleanupAfterAudio();
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

  private displayLoading(text: string, show: boolean): void {
    if (show) {
      // Démarrer l'animation du loading
      this.loadingBaseText = text;
      this.loadingDots = 0;
      this.startLoadingAnimation();
    } else {
      // Arrêter l'animation
      this.stopLoadingAnimation();
    }

    if (this.aiResponseAnimator) {
      show ? this.aiResponseAnimator.animateIn() : this.aiResponseAnimator.animateOut();
    } else if (this.responseContainer) {
      this.responseContainer.enabled = show;
    }
  }

  private startLoadingAnimation(): void {
    if (this.isLoadingAnimating) return;
    
    this.isLoadingAnimating = true;
    this.animateLoadingText();
  }

  private animateLoadingText(): void {
    if (!this.isLoadingAnimating || !this.loadingText) return;

    // Cycle de points: "", ".", "..", "..."
    const dots = ".".repeat(this.loadingDots);
    this.loadingText.text = this.loadingBaseText + dots;
    this.loadingText.enabled = true;

    this.loadingDots = (this.loadingDots + 1) % 4; // 0, 1, 2, 3, puis retour à 0

    // Répéter toutes les 0.5 secondes
    this.loadingAnimationTimer = this.createEvent("DelayedCallbackEvent");
    this.loadingAnimationTimer.bind(() => this.animateLoadingText());
    this.loadingAnimationTimer.reset(0.5);
  }

  private stopLoadingAnimation(): void {
    this.isLoadingAnimating = false;
    if (this.loadingAnimationTimer) {
      this.loadingAnimationTimer.cancel();
      this.loadingAnimationTimer = null;
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

  private clearAllText(): void {
    // Arrêter l'animation du loading
    this.stopLoadingAnimation();
    
    // Effacer le texte de réponse
    if (this.responseText) {
      this.responseText.text = "";
    }
    
    // Effacer le texte de loading
    if (this.loadingText) {
      this.loadingText.text = "";
      this.loadingText.enabled = false;
    }
    
    if (this.enableDebugLogs) log.i("All text cleared");
  }

  public askAboutLocation(lat: number, lng: number): void {
    if (this.isProcessing) return;
    this.resetAudioState();
    this.isProcessing = true;
    this.displayLoading("Analyzing location...", true);
    
    const prompt = `You are a precise local guide.

Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}

Identify the EXACT town/village at these coordinates (not the nearest major city), then give 2 interesting facts about that specific place. Keep it under 60 words. Start with the location name.`;
    this.callOpenAI(prompt);
  }

  public askAboutPlaces(places: PlaceInfo[]): void {
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

  public cancelRequest(): void {
    if (this.isProcessing || this.isAudioActive) {
      this.isProcessing = false;
      this.isAudioActive = false;
      this.audioComponent?.stop(false);
      this.cleanupAfterAudio();
      this.clearAllText(); // Effacer aussi lors de l'annulation
    }
  }

  public isCurrentlyProcessing(): boolean {
    return this.isProcessing || this.isAudioActive;
  }
}