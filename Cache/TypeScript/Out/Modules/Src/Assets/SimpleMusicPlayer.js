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
exports.SimpleMusicPlayerManager = void 0;
var __selfType = requireType("./SimpleMusicPlayer");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let SimpleMusicPlayerManager = (() => {
    let _classDecorators = [component];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = BaseScriptComponent;
    var SimpleMusicPlayerManager = _classThis = class extends _classSuper {
        constructor() {
            super();
            // --- Local Tracks Inputs ---
            this.localTracks = this.localTracks;
            this.localTrackTitles = this.localTrackTitles;
            this.localTrackArtists = this.localTrackArtists;
            // --- Remote Tracks Inputs ---
            this.remoteTracks = this.remoteTracks;
            this.remoteTrackTitles = this.remoteTrackTitles;
            this.remoteTrackArtists = this.remoteTrackArtists;
            this.audioComponent = this.audioComponent;
            this.playPauseButton = this.playPauseButton;
            this.nextTrackButton = this.nextTrackButton;
            this.prevTrackButton = this.prevTrackButton;
            this.playIcon = this.playIcon;
            this.pauseIcon = this.pauseIcon;
            this.trackTitleText = this.trackTitleText;
            this.artistNameText = this.artistNameText;
            this.loopPlayback = this.loopPlayback;
            this.volume = this.volume;
            // --- Private variables ---
            this.allTracksData = [];
            this.currentTrackIndex = 0;
            this.isPlaying = false;
            this.isPaused = false;
            this.audioInitialized = false;
            this.isProcessing = false; // Protection contre les clics multiples
            this.isLoadingRemote = false;
            this.isManualStop = false;
            this.expectTrackFinish = false;
            this.lastPinchTimePlayPause = 0;
            this.lastPinchTimeNext = 0;
            this.lastPinchTimePrev = 0;
            this.DEBOUNCE_TIME = 0.5;
            this.pendingDelayedCalls = [];
        }
        __initialize() {
            super.__initialize();
            // --- Local Tracks Inputs ---
            this.localTracks = this.localTracks;
            this.localTrackTitles = this.localTrackTitles;
            this.localTrackArtists = this.localTrackArtists;
            // --- Remote Tracks Inputs ---
            this.remoteTracks = this.remoteTracks;
            this.remoteTrackTitles = this.remoteTrackTitles;
            this.remoteTrackArtists = this.remoteTrackArtists;
            this.audioComponent = this.audioComponent;
            this.playPauseButton = this.playPauseButton;
            this.nextTrackButton = this.nextTrackButton;
            this.prevTrackButton = this.prevTrackButton;
            this.playIcon = this.playIcon;
            this.pauseIcon = this.pauseIcon;
            this.trackTitleText = this.trackTitleText;
            this.artistNameText = this.artistNameText;
            this.loopPlayback = this.loopPlayback;
            this.volume = this.volume;
            // --- Private variables ---
            this.allTracksData = [];
            this.currentTrackIndex = 0;
            this.isPlaying = false;
            this.isPaused = false;
            this.audioInitialized = false;
            this.isProcessing = false; // Protection contre les clics multiples
            this.isLoadingRemote = false;
            this.isManualStop = false;
            this.expectTrackFinish = false;
            this.lastPinchTimePlayPause = 0;
            this.lastPinchTimeNext = 0;
            this.lastPinchTimePrev = 0;
            this.DEBOUNCE_TIME = 0.5;
            this.pendingDelayedCalls = [];
        }
        // --- Core Methods ---
        onAwake() {
            if (!this.validateInputs()) {
                print("SimpleMusicPlayerManager Error: Input validation failed. Script will not run.");
                return;
            }
            this.combineTrackData();
            this.setupCallbacks();
            this.updatePlayPauseIcons();
            this.updateTrackInfoUI();
            this.startMusicAutomatically();
            this.createEvent("UpdateEvent").bind(() => {
                this.checkDelayedCalls();
            });
            print(`SimpleMusicPlayerManager Initialized with ${this.localTracks?.length || 0} local, ${this.remoteTracks?.length || 0} remote. Total: ${this.allTracksData.length} tracks. Auto-playing.`);
        }
        // --- Combine Track Data ---
        combineTrackData() {
            this.allTracksData = [];
            // Add local tracks
            if (this.localTracks) {
                for (let i = 0; i < this.localTracks.length; i++) {
                    if (this.localTracks[i] &&
                        this.localTrackArtists?.[i] !== undefined &&
                        this.localTrackTitles?.[i] !== undefined) {
                        this.allTracksData.push({
                            asset: this.localTracks[i],
                            artist: this.localTrackArtists[i],
                            title: this.localTrackTitles[i],
                            isRemote: false
                        });
                    }
                }
            }
            // Add remote tracks
            if (this.remoteTracks) {
                for (let i = 0; i < this.remoteTracks.length; i++) {
                    if (this.remoteTracks[i] &&
                        this.remoteTrackArtists?.[i] !== undefined &&
                        this.remoteTrackTitles?.[i] !== undefined) {
                        this.allTracksData.push({
                            asset: this.remoteTracks[i],
                            artist: this.remoteTrackArtists[i],
                            title: this.remoteTrackTitles[i],
                            isRemote: true
                        });
                    }
                }
            }
        }
        // --- Delayed Call System ---
        delayedCall(delay, callback) {
            if (!callback)
                return;
            if (delay <= 0) {
                try {
                    callback();
                }
                catch (e) {
                    print(`Error in immediate callback: ${e}`);
                }
                return;
            }
            const executeTime = getTime() + delay;
            this.pendingDelayedCalls.push({ executeTime, callback });
        }
        checkDelayedCalls() {
            if (this.pendingDelayedCalls.length === 0)
                return;
            const currentTime = getTime();
            for (let i = this.pendingDelayedCalls.length - 1; i >= 0; i--) {
                const call = this.pendingDelayedCalls[i];
                if (currentTime >= call.executeTime) {
                    this.pendingDelayedCalls.splice(i, 1);
                    try {
                        call.callback();
                    }
                    catch (e) {
                        print(`Error in delayed callback: ${e}`);
                    }
                }
            }
        }
        // --- Validation ---
        validateInputs() {
            let isValid = true;
            // Validation de l'AudioComponent
            if (!this.audioComponent) {
                print("SimpleMusicPlayerManager Error: Audio component not defined.");
                isValid = false;
            }
            else {
                if (!this.audioComponent.enabled || !this.audioComponent.getSceneObject().enabled) {
                    print("SimpleMusicPlayerManager Error: The AudioComponent or its SceneObject is disabled in the Inspector!");
                    isValid = false;
                }
            }
            // Validation des pistes locales
            const numLocalTracks = this.localTracks?.length || 0;
            if (numLocalTracks > 0) {
                if (!this.localTrackTitles || this.localTrackTitles.length !== numLocalTracks) {
                    print(`SimpleMusicPlayerManager Error: Mismatch local tracks (${numLocalTracks}) vs titles (${this.localTrackTitles?.length || 0}).`);
                    isValid = false;
                }
                if (!this.localTrackArtists || this.localTrackArtists.length !== numLocalTracks) {
                    print(`SimpleMusicPlayerManager Error: Mismatch local tracks (${numLocalTracks}) vs artists (${this.localTrackArtists?.length || 0}).`);
                    isValid = false;
                }
                if (this.localTracks.some(track => track == null)) {
                    print("SimpleMusicPlayerManager Error: One or more local tracks are null.");
                    isValid = false;
                }
            }
            // Validation des pistes distantes
            const numRemoteTracks = this.remoteTracks?.length || 0;
            if (numRemoteTracks > 0) {
                if (!this.remoteTrackTitles || this.remoteTrackTitles.length !== numRemoteTracks) {
                    print(`SimpleMusicPlayerManager Error: Mismatch remote tracks (${numRemoteTracks}) vs titles (${this.remoteTrackTitles?.length || 0}).`);
                    isValid = false;
                }
                if (!this.remoteTrackArtists || this.remoteTrackArtists.length !== numRemoteTracks) {
                    print(`SimpleMusicPlayerManager Error: Mismatch remote tracks (${numRemoteTracks}) vs artists (${this.remoteTrackArtists?.length || 0}).`);
                    isValid = false;
                }
                if (this.remoteTracks.some(track => track == null)) {
                    print("SimpleMusicPlayerManager Error: One or more remote tracks are null.");
                    isValid = false;
                }
            }
            // Vérifier qu'il y a au moins des pistes
            if (numLocalTracks === 0 && numRemoteTracks === 0) {
                print("SimpleMusicPlayerManager Error: No tracks provided (local or remote).");
                isValid = false;
            }
            // Avertissements pour les composants optionnels
            if (!this.playPauseButton)
                print("SimpleMusicPlayerManager Warning: Play/Pause button not defined.");
            if (!this.nextTrackButton)
                print("SimpleMusicPlayerManager Warning: Next Track button not defined.");
            if (!this.prevTrackButton)
                print("SimpleMusicPlayerManager Warning: Previous Track button not defined.");
            if (!this.playIcon)
                print("SimpleMusicPlayerManager Warning: Play icon not defined.");
            if (!this.pauseIcon)
                print("SimpleMusicPlayerManager Warning: Pause icon not defined.");
            if (!this.trackTitleText)
                print("SimpleMusicPlayerManager Warning: Track Title Text component not defined.");
            if (!this.artistNameText)
                print("SimpleMusicPlayerManager Warning: Artist Name Text component not defined.");
            return isValid;
        }
        // --- Setup Callbacks ---
        setupCallbacks() {
            // Setup Play/Pause button
            if (this.playPauseButton) {
                this.onPlayPauseCallback = (event) => {
                    const currentTime = getTime();
                    if (currentTime - this.lastPinchTimePlayPause < this.DEBOUNCE_TIME)
                        return;
                    if (this.isProcessing)
                        return;
                    this.lastPinchTimePlayPause = currentTime;
                    this.togglePlayPause();
                };
                this.playPauseButton.onButtonPinched.add(this.onPlayPauseCallback);
            }
            // Setup Next Track button
            if (this.nextTrackButton) {
                this.onNextTrackCallback = (event) => {
                    const currentTime = getTime();
                    if (currentTime - this.lastPinchTimeNext < this.DEBOUNCE_TIME)
                        return;
                    if (this.isProcessing)
                        return;
                    this.lastPinchTimeNext = currentTime;
                    this.playNextTrack();
                };
                this.nextTrackButton.onButtonPinched.add(this.onNextTrackCallback);
            }
            // Setup Previous Track button
            if (this.prevTrackButton) {
                this.onPrevTrackCallback = (event) => {
                    const currentTime = getTime();
                    if (currentTime - this.lastPinchTimePrev < this.DEBOUNCE_TIME)
                        return;
                    if (this.isProcessing)
                        return;
                    this.lastPinchTimePrev = currentTime;
                    this.playPrevTrack();
                };
                this.prevTrackButton.onButtonPinched.add(this.onPrevTrackCallback);
            }
            // Setup track finished callback
            this.onTrackFinishedCallback = (audioComponent) => {
                if (!this.expectTrackFinish || audioComponent !== this.audioComponent || !this.isPlaying || this.isLoadingRemote || this.isManualStop || this.isPaused) {
                    if (this.isManualStop)
                        this.isManualStop = false;
                    return;
                }
                print("Background track finished, auto-playing next.");
                this.expectTrackFinish = false;
                this.handleAutoAdvance();
            };
            if (this.audioComponent) {
                this.audioComponent.setOnFinish(this.onTrackFinishedCallback);
            }
        }
        // --- Music Control ---
        startMusicAutomatically() {
            if (!this.allTracksData || this.allTracksData.length === 0)
                return;
            this.currentTrackIndex = 0;
            this.loadTrack(this.currentTrackIndex, true);
        }
        loadTrack(index, playImmediately) {
            this.expectTrackFinish = false;
            if (this.isProcessing)
                return;
            this.isProcessing = true;
            try {
                if (index < 0 || index >= this.allTracksData.length) {
                    print(`Invalid track index: ${index}`);
                    return;
                }
                if (!this.audioComponent) {
                    print("Audio component not available");
                    return;
                }
                const trackData = this.allTracksData[index];
                if (!trackData) {
                    print(`Track data not available for index ${index}`);
                    return;
                }
                // Arrêter la piste actuelle si elle joue
                if (this.audioInitialized) {
                    this.audioComponent.stop(false);
                }
                this.currentTrackIndex = index;
                this.audioInitialized = false;
                this.isManualStop = false;
                // Stop current playback
                if ((this.isPlaying || this.isPaused) && this.audioComponent) {
                    if (this.audioComponent.isPlaying() || this.audioComponent.isPaused()) {
                        print("Stopping previous track...");
                        try {
                            this.audioComponent.stop(false);
                        }
                        catch (e) {
                            print("Error stopping previous: " + e);
                        }
                    }
                }
                this.isPlaying = false;
                this.isPaused = false;
                if (this.audioComponent) {
                    try {
                        this.audioComponent.audioTrack = null;
                    }
                    catch (e) { }
                }
                this.updateTrackInfoUI();
                print(`Loading track ${index}: ${trackData.title} by ${trackData.artist} (${trackData.isRemote ? 'Remote' : 'Local'}) - Play: ${playImmediately}`);
                if (trackData.isRemote) {
                    // Remote track loading
                    this.isLoadingRemote = true;
                    const remoteAsset = trackData.asset;
                    const onDownloaded = (asset) => {
                        if (this.currentTrackIndex !== index || !this.isLoadingRemote) {
                            print(`Download callback ignored for index ${index}`);
                            this.isLoadingRemote = (this.currentTrackIndex === index && this.isLoadingRemote);
                            return;
                        }
                        this.isLoadingRemote = false;
                        if (asset && asset.isOfType("Asset.AudioTrackAsset")) {
                            const audioTrack = asset;
                            print(`Successfully downloaded: ${trackData.title}`);
                            if (!this.audioComponent) {
                                print("Error: AudioComponent missing after download");
                                this.handleLoadError(index, "AudioComponent missing");
                                return;
                            }
                            try {
                                this.audioComponent.audioTrack = audioTrack;
                                this.audioInitialized = true;
                                if (playImmediately) {
                                    print("Auto-playing downloaded remote track.");
                                    this.delayedCall(0.05, () => this.playTrack());
                                }
                                else {
                                    print(`Remote track loaded: ${trackData.title}. Ready to play.`);
                                }
                                this.updatePlayPauseIcons();
                                this.updateTrackInfoUI();
                            }
                            catch (error) {
                                print(`Error setting downloaded track: ${error}`);
                                this.handleLoadError(index, "Failed to set track");
                            }
                        }
                        else {
                            const assetType = asset ? asset.getTypeName() : "null";
                            print(`Error: Downloaded asset has invalid type: ${assetType}`);
                            this.handleLoadError(index, "Invalid asset type");
                        }
                    };
                    const onFailed = () => {
                        if (this.currentTrackIndex !== index || !this.isLoadingRemote) {
                            print(`Download failure callback ignored for index ${index}`);
                            this.isLoadingRemote = (this.currentTrackIndex === index && this.isLoadingRemote);
                            return;
                        }
                        this.isLoadingRemote = false;
                        print(`Error: Download failed for track ${index}.`);
                        this.handleLoadError(index, "Download failed");
                    };
                    try {
                        print(`Starting download for: "${trackData.title}"`);
                        remoteAsset.downloadAsset(onDownloaded, onFailed);
                    }
                    catch (error) {
                        print("Error initiating download: " + error);
                        this.isLoadingRemote = false;
                        this.handleLoadError(index, "Download initialization failed");
                    }
                }
                else {
                    // Local track loading
                    if (!this.audioComponent) {
                        print("Error: AudioComponent missing for local track");
                        this.handleLoadError(index, "AudioComponent missing");
                        return;
                    }
                    try {
                        const localAsset = trackData.asset;
                        this.audioComponent.audioTrack = localAsset;
                        this.audioInitialized = true;
                        print(`Local track loaded: ${trackData.title}`);
                        if (playImmediately) {
                            print("Auto-playing local track.");
                            this.delayedCall(0.05, () => this.playTrack());
                        }
                        else {
                            print(`Local track loaded: ${trackData.title}. Ready to play.`);
                        }
                        this.updatePlayPauseIcons();
                        this.updateTrackInfoUI();
                    }
                    catch (error) {
                        print(`Error loading local track: ${error}`);
                        this.handleLoadError(index, "Local track load error");
                    }
                }
            }
            catch (error) {
                print(`Error loading track ${index}: ${error}`);
                this.handleLoadError(index, "General load error");
            }
            finally {
                this.isProcessing = false;
            }
        }
        handleLoadError(failedIndex, reason) {
            print(`Handle load error for track ${failedIndex}: ${reason}`);
            if (this.currentTrackIndex === failedIndex) {
                // Reset state for current track
                this.isPlaying = false;
                this.isPaused = false;
                this.audioInitialized = false;
                this.isLoadingRemote = false;
                if (this.audioComponent) {
                    try {
                        this.audioComponent.audioTrack = null;
                    }
                    catch (e) { }
                }
                this.updatePlayPauseIcons();
                this.updateTrackInfoUI();
            }
            else {
                print(`Load error for track ${failedIndex} ignored, current track is ${this.currentTrackIndex}.`);
            }
        }
        playTrack() {
            if (this.isLoadingRemote) {
                print("Play ignored: Loading remote track.");
                return;
            }
            if (!this.audioInitialized || !this.audioComponent || !this.audioComponent.audioTrack) {
                print(`Cannot play: Track not initialized.`);
                if (this.currentTrackIndex !== -1) {
                    this.loadTrack(this.currentTrackIndex, true);
                }
                return;
            }
            try {
                this.expectTrackFinish = true;
                const trackData = this.allTracksData[this.currentTrackIndex];
                const title = trackData?.title || "Unknown";
                if (this.isPaused) {
                    print(`Resuming: ${title}`);
                    this.audioComponent.resume();
                    this.isPlaying = true;
                    this.isPaused = false;
                }
                else if (!this.isPlaying) {
                    print(`Starting: ${title}`);
                    this.audioComponent.play(this.volume);
                    this.isPlaying = true;
                    this.isPaused = false;
                }
                else {
                    print(`Play called while already playing ${title}.`);
                    this.expectTrackFinish = this.isPlaying;
                }
                this.isManualStop = false;
                this.updatePlayPauseIcons();
            }
            catch (error) {
                print(`Error playing/resuming track: ${error}`);
                this.expectTrackFinish = false;
                this.handleLoadError(this.currentTrackIndex, "Playback error");
            }
        }
        togglePlayPause() {
            if (this.isLoadingRemote) {
                print("Play/Pause ignored: Loading remote track.");
                return;
            }
            if (this.allTracksData.length === 0) {
                print("Play/Pause ignored: No tracks available.");
                return;
            }
            if (!this.audioInitialized) {
                this.startMusicAutomatically();
                return;
            }
            if (this.isPlaying) {
                this.pauseMusic();
            }
            else {
                this.resumeMusic();
            }
        }
        pauseMusic() {
            if (!this.audioComponent || !this.isPlaying)
                return;
            try {
                this.audioComponent.pause();
                this.isPlaying = false;
                this.isPaused = true;
                this.expectTrackFinish = false;
                this.updatePlayPauseIcons();
                print("Music paused.");
            }
            catch (error) {
                print(`Error pausing music: ${error}`);
            }
        }
        resumeMusic() {
            if (!this.audioComponent || !this.audioInitialized)
                return;
            try {
                if (this.isPaused) {
                    this.audioComponent.resume();
                }
                else {
                    this.audioComponent.play(this.volume);
                }
                this.isPlaying = true;
                this.isPaused = false;
                this.expectTrackFinish = true;
                this.updatePlayPauseIcons();
                print("Music resumed.");
            }
            catch (error) {
                print(`Error resuming music: ${error}`);
            }
        }
        stopMusic() {
            if (!this.audioComponent)
                return;
            try {
                this.isManualStop = true;
                this.expectTrackFinish = false;
                if (this.audioInitialized) {
                    this.audioComponent.stop(false);
                }
                this.isPlaying = false;
                this.isPaused = false;
                this.currentTrackIndex = -1;
                this.audioInitialized = false;
                this.updatePlayPauseIcons();
                this.updateTrackInfoUI();
                print("Music stopped.");
            }
            catch (error) {
                print(`Error stopping music: ${error}`);
            }
        }
        handleAutoAdvance() {
            if (!this.allTracksData || this.allTracksData.length === 0)
                return;
            let nextIndex = this.currentTrackIndex + 1;
            if (nextIndex >= this.allTracksData.length) {
                if (this.loopPlayback) {
                    nextIndex = 0;
                }
                else {
                    print("All tracks finished, stopping playback.");
                    this.stopMusic();
                    return;
                }
            }
            this.loadTrack(nextIndex, true);
        }
        playNextTrack() {
            if (!this.allTracksData || this.allTracksData.length === 0) {
                print("No tracks available");
                return;
            }
            if (this.isLoadingRemote) {
                print("Next track ignored: Loading remote track.");
                return;
            }
            let nextIndex = this.currentTrackIndex + 1;
            if (nextIndex >= this.allTracksData.length) {
                nextIndex = this.loopPlayback ? 0 : this.allTracksData.length - 1;
            }
            if (nextIndex >= 0 && nextIndex < this.allTracksData.length) {
                this.loadTrack(nextIndex, true);
            }
        }
        playPrevTrack() {
            if (!this.allTracksData || this.allTracksData.length === 0) {
                print("No tracks available");
                return;
            }
            if (this.isLoadingRemote) {
                print("Previous track ignored: Loading remote track.");
                return;
            }
            let prevIndex = this.currentTrackIndex - 1;
            if (prevIndex < 0) {
                prevIndex = this.loopPlayback ? this.allTracksData.length - 1 : 0;
            }
            if (prevIndex >= 0 && prevIndex < this.allTracksData.length) {
                this.loadTrack(prevIndex, true);
            }
        }
        // --- UI & Icon Management ---
        updatePlayPauseIcons() {
            try {
                if (this.playIcon && this.pauseIcon) {
                    this.pauseIcon.enabled = this.isPlaying;
                    this.playIcon.enabled = !this.isPlaying;
                }
            }
            catch (error) {
                print(`Error updating play/pause icons: ${error}`);
            }
        }
        updateTrackInfoUI() {
            try {
                let title = "---";
                let artist = "---";
                if (this.isLoadingRemote && this.currentTrackIndex !== -1 && this.currentTrackIndex < this.allTracksData.length) {
                    const trackData = this.allTracksData[this.currentTrackIndex];
                    title = trackData?.title || "Loading...";
                    artist = trackData?.artist || "";
                }
                else if (this.currentTrackIndex !== -1 && this.currentTrackIndex < this.allTracksData.length) {
                    const trackData = this.allTracksData[this.currentTrackIndex];
                    if (trackData) {
                        title = trackData.title;
                        artist = trackData.artist;
                    }
                    else {
                        title = "Error";
                        artist = "Invalid Track";
                    }
                }
                else if (this.currentTrackIndex !== -1) {
                    title = "Error";
                    artist = "Invalid Index";
                }
                if (this.trackTitleText) {
                    this.trackTitleText.text = title;
                }
                if (this.artistNameText) {
                    this.artistNameText.text = artist;
                }
            }
            catch (error) {
                print(`Error updating track info UI: ${error}`);
            }
        }
        // --- Cleanup ---
        onDestroy() {
            print("Destroying SimpleMusicPlayerManager.");
            this.expectTrackFinish = false;
            this.pendingDelayedCalls = [];
            if (this.audioComponent) {
                try {
                    this.audioComponent.setOnFinish(null);
                }
                catch (e) { }
                if (this.isPlaying || this.isPaused) {
                    try {
                        this.audioComponent.stop(false);
                    }
                    catch (e) { }
                }
                try {
                    this.audioComponent.audioTrack = null;
                }
                catch (e) { }
            }
            // Nettoyer les callbacks
            try {
                if (this.playPauseButton && this.onPlayPauseCallback) {
                    this.playPauseButton.onButtonPinched.remove(this.onPlayPauseCallback);
                }
                if (this.nextTrackButton && this.onNextTrackCallback) {
                    this.nextTrackButton.onButtonPinched.remove(this.onNextTrackCallback);
                }
                if (this.prevTrackButton && this.onPrevTrackCallback) {
                    this.prevTrackButton.onButtonPinched.remove(this.onPrevTrackCallback);
                }
            }
            catch (error) {
                print(`Error during cleanup: ${error}`);
            }
        }
    };
    __setFunctionName(_classThis, "SimpleMusicPlayerManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SimpleMusicPlayerManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SimpleMusicPlayerManager = _classThis;
})();
exports.SimpleMusicPlayerManager = SimpleMusicPlayerManager;
//# sourceMappingURL=SimpleMusicPlayer.js.map