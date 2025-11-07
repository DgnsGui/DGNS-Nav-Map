import NativeLogger from "SpectaclesInteractionKit.lspkg/Utils/NativeLogger";
import { MapComponent } from "./MapComponent";
import { PlaceInfo } from "./SnapPlacesProvider";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { OpenAITypes } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAITypes";
import { AIResponseAnimator } from "../../AIFrameAnimator";

const TAG = "[AIMapAssistant]";
const log = new NativeLogger(TAG);

interface LocationDetails {
  city: string;
  district: string;
  country: string;
  countryCode: string;
  fullAddress: string;
}

@component
export class AIMapAssistant extends BaseScriptComponent {
  @input private mapComponent: MapComponent;
  @input private openAIModel: string = "gpt-4o-mini";
  @input private maxTokens: number = 200;
  @input private temperature: number = 0.8;
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
    this.displayResponse("Analyzing location...", true);

    const loc = this.mapComponent.getUserLocation();
    if (!loc) {
      this.handleError("Location not available");
      return;
    }

    // D'abord faire le reverse geocoding pour obtenir le nom de la localité
    this.reverseGeocode(loc.latitude, loc.longitude)
      .then(locationDetails => {
        const context = this.collectMapContext(locationDetails);
        const prompt = this.buildPrompt(context, locationDetails);
        this.callOpenAI(prompt);
      })
      .catch(err => {
        log.w(`Reverse geocoding failed: ${err}, falling back to coordinates only`);
        // Fallback: utiliser juste les coordonnées
        const context = this.collectMapContext(null);
        const prompt = this.buildPrompt(context, null);
        this.callOpenAI(prompt);
      });
  }

  private async reverseGeocode(lat: number, lng: number): Promise<LocationDetails> {
    // Utiliser l'API Nominatim d'OpenStreetMap (gratuite, pas de clé requise)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    if (this.enableDebugLogs) log.i(`Reverse geocoding: ${lat}, ${lng}`);

    return new Promise((resolve, reject) => {
      // Utiliser fetch qui est disponible globalement dans Lens Studio
      global.fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'SnapSpectaclesARNav/1.0'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      })
      .then(data => {
        const address = data.address || {};
        
        // Extraction intelligente de la localité (priorité: village > town > city > municipality)
        const city = address.village || address.town || address.city || 
                    address.municipality || address.county || "Unknown location";
        
        const district = address.suburb || address.neighbourhood || address.quarter || "";
        const country = address.country || "";
        const countryCode = address.country_code || "";
        
        const locationDetails: LocationDetails = {
          city: city,
          district: district,
          country: country,
          countryCode: countryCode,
          fullAddress: data.display_name || ""
        };
        
        if (this.enableDebugLogs) {
          log.i(`Geocoded location: ${city}${district ? ', ' + district : ''}, ${country}`);
        }
        
        resolve(locationDetails);
      })
      .catch(error => {
        reject(`Geocoding error: ${error}`);
      });
    });
  }

  private collectMapContext(locationDetails: LocationDetails | null): string {
    const parts: string[] = [];
    
    const loc = this.mapComponent.getUserLocation();
    if (loc) {
      parts.push(`GPS: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`);
    }
    
    // Ajouter les infos de géolocalisation si disponibles
    if (locationDetails) {
      if (locationDetails.city) {
        parts.push(`Location: ${locationDetails.city}`);
      }
      if (locationDetails.district) {
        parts.push(`District: ${locationDetails.district}`);
      }
      if (locationDetails.country) {
        parts.push(`Country: ${locationDetails.country}`);
      }
    }
    
    parts.push(`Heading: ${this.mapComponent.getUserHeading().toFixed(0)}°`);
    parts.push(`Zoom: ${this.mapComponent.mapZoomLevel}`);
    
    return parts.join("\n");
  }

  private buildPrompt(context: string, locationDetails: LocationDetails | null): string {
    let locationName = "this location";
    
    if (locationDetails && locationDetails.city) {
      locationName = locationDetails.city;
      if (locationDetails.district) {
        locationName = `${locationDetails.district}, ${locationDetails.city}`;
      }
    }
    
    return `You are a friendly local guide for AR glasses.

Context:
${context}

Give 2-3 brief, interesting facts about ${locationName}. Keep it conversational, engaging, and under 100 words. Focus on what makes this place special or unique.`;
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
  }

  private callOpenAI(prompt: string): void {
    this.displayResponse("🤖 Thinking...", true);

    const request: OpenAITypes.ChatCompletions.Request = {
      model: this.openAIModel,
      messages: [
        { role: "system", content: "You are a knowledgeable and enthusiastic local guide. Be conversational and interesting." },
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
    
    this.reverseGeocode(lat, lng)
      .then(locationDetails => {
        const locationName = locationDetails.city;
        const prompt = `Give 2 interesting facts about ${locationName}. Keep it brief and conversational, under 60 words.`;
        this.callOpenAI(prompt);
      })
      .catch(err => {
        log.w(`Geocoding failed: ${err}`);
        const prompt = `Give 2 interesting facts about coordinates ${lat.toFixed(6)}, ${lng.toFixed(6)}. Keep brief.`;
        this.callOpenAI(prompt);
      });
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
    }
  }

  public isCurrentlyProcessing(): boolean {
    return this.isProcessing || this.isAudioActive;
  }
}