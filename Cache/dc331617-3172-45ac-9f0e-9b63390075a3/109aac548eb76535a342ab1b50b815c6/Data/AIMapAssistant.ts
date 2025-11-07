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
  @input private maxTokens: number = 200; // Augmenté pour descriptions plus riches
  @input private temperature: number = 0.8; // Plus de créativité
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

  // Paramètres de timing
  @input private volumeDuckDelay: number = 0.3;
  @input private minAudioDuration: number = 2.0;
  @input private postAudioDelay: number = 0.5;
  @input private maxAudioDuration: number = 30.0; // Timeout de sécurité

  private isProcessing: boolean = false;
  private audioStartTime: number = 0;
  private volumeDuckTimer: DelayedCallbackEvent | null = null;
  private hideResponseTimer: DelayedCallbackEvent | null = null;
  private timeoutTimer: DelayedCallbackEvent | null = null;
  
  // Nouveaux trackers pour une détection plus fiable
  private isAudioActive: boolean = false;
  private consecutiveNotPlayingFrames: number = 0;
  private readonly FRAMES_TO_CONFIRM_STOP: number = 10; // ~10 frames pour confirmer l'arrêt

  private originalMusicVolume: number = 1.0;

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
      this.displayResponse("Already processing...", true);
      return;
    }

    if (!this.mapComponent) {
      this.displayResponse("Error: Map not ready", true);
      return;
    }

    this.resetAudioState();
    this.isProcessing = true;
    this.displayResponse("Analyzing map...", true);

    const context = this.collectMapContext();
    const prompt = this.buildPrompt(context);
    this.callOpenAI(prompt);
  }

  private resetAudioState(): void {
    this.isAudioActive = false;
    this.consecutiveNotPlayingFrames = 0;
    this.audioStartTime = 0;
    
    // Annuler tous les timers
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
  }

  private collectMapContext(): string {
    const parts: string[] = [];
    const loc = this.mapComponent.getUserLocation();
    if (loc) {
      parts.push(`User coordinates: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    }
    parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(2)} degrees`);
    const center = this.mapComponent.getInitialMapTileLocation();
    if (center) {
      parts.push(`Map center: ${center.latitude.toFixed(6)}, ${center.longitude.toFixed(6)}`);
    }
    parts.push(`Zoom level: ${this.mapComponent.mapZoomLevel}`);
    return parts.join("\n");
  }

  private buildPrompt(context: string): string {
    return `You are a helpful, local navigation assistant for AR glasses. 

Context:
${context}

IMPORTANT INSTRUCTIONS:
1. First, identify the EXACT neighborhood, street, or specific location at these coordinates (not just the nearest major city)
2. Describe what's actually at this precise location - is it a residential area, commercial district, park, waterfront, etc.?
3. Give 2-3 brief, interesting facts about THIS SPECIFIC AREA
4. If there are notable landmarks or places within 500m, mention them
5. Keep it conversational and under 100 words
6. Focus on what makes THIS PARTICULAR SPOT unique, not the general city

Example good response: "You're in the Marais district, Paris's historic Jewish quarter. This trendy neighborhood is known for its medieval streets, vintage boutiques, and famous falafel spots on Rue des Rosiers. The nearby Place des Vosges is Paris's oldest planned square."

Example bad response: "You're in Paris, the capital of France. It's known for the Eiffel Tower and great food."`;
  }

  private callOpenAI(prompt: string): void {
    this.displayResponse("📡 Getting in touch...", true);

    const request: OpenAITypes.ChatCompletions.Request = {
      model: this.openAIModel,
      messages: [
        { 
          role: "system", 
          content: "You are a knowledgeable local guide. Always identify the specific neighborhood or area first, then share interesting details about that exact location. Never default to generic city facts." 
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

    // Initialiser l'état audio
    this.audioStartTime = getTime();
    this.isAudioActive = true;
    this.consecutiveNotPlayingFrames = 0;

    if (this.enableDebugLogs) log.i("TTS playback started → scheduling volume duck");

    // Timer pour baisser le volume
    this.volumeDuckTimer = this.createEvent("DelayedCallbackEvent");
    this.volumeDuckTimer.bind(() => {
      this.duckMusicVolume();
      if (this.enableDebugLogs) log.i("Volume ducked after delay");
    });
    this.volumeDuckTimer.reset(this.volumeDuckDelay);

    // Timer de sécurité au cas où la détection échoue complètement
    this.timeoutTimer = this.createEvent("DelayedCallbackEvent");
    this.timeoutTimer.bind(() => {
      log.w(`Audio timeout reached (${this.maxAudioDuration}s) - forcing cleanup`);
      this.forceCleanup();
    });
    this.timeoutTimer.reset(this.maxAudioDuration);

    this.isProcessing = false;
  }

  // Appelé à chaque frame pour surveiller l'état de l'audio
  private updateAudioState(): void {
    if (!this.isAudioActive || !this.audioComponent) return;

    const isPlaying = this.audioComponent.isPlaying();
    const elapsedTime = getTime() - this.audioStartTime;

    if (this.enableDebugLogs && elapsedTime > 0 && Math.floor(elapsedTime * 10) % 10 === 0) {
      // Log tous les 1s environ
      log.i(`Audio state: playing=${isPlaying}, elapsed=${elapsedTime.toFixed(1)}s, frames=${this.consecutiveNotPlayingFrames}`);
    }

    if (!isPlaying) {
      this.consecutiveNotPlayingFrames++;
      
      // Confirmer l'arrêt après plusieurs frames ET durée minimale écoulée
      if (this.consecutiveNotPlayingFrames >= this.FRAMES_TO_CONFIRM_STOP && 
          elapsedTime >= this.minAudioDuration) {
        
        if (this.enableDebugLogs) {
          log.i(`Audio confirmed stopped after ${elapsedTime.toFixed(2)}s (${this.consecutiveNotPlayingFrames} frames)`);
        }
        
        this.scheduleCleanup();
      }
    } else {
      // L'audio joue, réinitialiser le compteur
      this.consecutiveNotPlayingFrames = 0;
    }
  }

  private scheduleCleanup(): void {
    // Marquer comme inactif pour arrêter le monitoring
    this.isAudioActive = false;

    // Annuler le timer de timeout
    if (this.timeoutTimer) {
      this.timeoutTimer.cancel();
      this.timeoutTimer = null;
    }

    if (this.enableDebugLogs) log.i(`Scheduling cleanup in ${this.postAudioDelay}s`);

    // Timer pour le cleanup
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
    this.resetAudioState();
    this.isProcessing = true;
    this.displayResponse("Analyzing location...", true);
    const prompt = `You are a local guide for AR glasses.

Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}

Identify the specific neighborhood or area at these exact coordinates, then share 2 interesting facts about this particular spot. Focus on what's unique about THIS location, not the general city. Keep it under 60 words.`;
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
    const prompt = `You are a local guide for AR glasses.

Nearby places:
${list}

Based on these places, tell me what type of area this is (e.g., historic district, shopping area, residential, etc.) and recommend the most interesting spot to visit. Keep it conversational and under 50 words.`;
    this.callOpenAI(prompt);
  }

  public cancelRequest(): void {
    if (this.isProcessing || this.isAudioActive) {
      this.isProcessing = false;
      this.isAudioActive = false;
      this.audioComponent?.stop(false);
      this.cleanupAfterAudio();
    }
  }

  public isCurrentlyProcessing(): boolean {
    return this.isProcessing || this.isAudioActive;
  }
}