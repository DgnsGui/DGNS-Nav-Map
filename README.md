![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Platform](https://img.shields.io/badge/Platform-Snap_Spectacles24-black.svg)
![Tech](https://img.shields.io/badge/Powered_by-Lens_Studio_5.15-yellow.svg)

<h1 align="center">DGNS Nav Map 1.1</h1>

<p align="center">
  <em>
    An open-source AR navigation system for Snap Spectacles (2024), built on top of the Outdoor Navigation Sample,
    combining real-time mapping, AI assistance, and spatial interactions to explore the world in augmented reality.
  </em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dd3bcb3e-2046-4199-8f39-e17f062f9161" width="600"/>
</p>

---

## 🕶️ Overview

**DGNS Nav Map** is an advanced Lens Studio project built for **Snap Spectacles**, extending the official **Outdoor Navigation Sample** into a fully interactive AR navigation system.

It provides a real-time AR map centered on the user’s GPS position, enriched with nearby places, AI-powered guidance, and spatial interactions.

This project is designed as:
- a **good starting point for AR navigation projects**
- a **more visual extension of the Outdoor Navigation Sample**
- a **modular architecture for location-based experiences**
- a **foundation for AI-assisted spatial applications**

---

## ✨ Core Features

- 🗺️ **AR Map System** — Real-time tiled map synced with GPS and device orientation  
- 🤏 **Gesture Navigation** — Pan, zoom, rotate, and recenter interactions  
- 📍 **Custom Pins** — Create and remove pins dynamically  
- 🧭 **Mini-Map Mode** — Circular bounds with simplified UI  
- 🌍 **Nearby Places** — Real-world locations via Snapchat Places API  
- 🎯 **Quest Markers** — Link AR markers to map locations  
- 🤖 **AI Assistant** — Contextual responses with text + voice (TTS)  
- 🎶 **Audio System** — Built-in music player with volume ducking  

---

## 🧩 Architecture

Modular TypeScript-based system built on top of the Outdoor Navigation Sample:

### UI Controller

`MapUIController.ts`
- Handles Spectacles inputs (pinch, toggle)
- Triggers:
  - Pin creation/removal
  - Zoom, recenter, mini-map toggle
  - Nearby places queries
  - AI assistant interactions

---

### Map System

`MapComponent.ts`
- Core orchestrator
- Extends sample map behavior
- Manages UI states and Places Clam lifecycle
- Synchronizes quest markers

`MapController.ts`
- Tile grid generation
- GPS ↔ screen coordinate conversion
- Scroll physics (inertia, velocity)
- Pin lifecycle management

---

### Pins

`MapPin.ts`
- Instantiates pins from prefabs
- Handles labels and highlighting
- Supports:
  - rectangular bounds (map mode)
  - circular bounds (mini-map mode)

---

### Nearby Places Pipeline

`SnapPlacesProvider.ts`
- Fetches nearby locations via Remote API

Pipeline:
1. `get_nearby_places`
2. `get_place` (details per venue)
3. Parsing into `PlaceInfo`
4. Location-based caching system

`Snapchat Places API Module.js`
- Handles Remote Service Gateway calls

---

### Places Clam UI

`PlacesClamAnimator.ts`
- Animates places list (in/out)
- Adjusts layout when AI panel is active

`MapComponent.ts`
- Handles:
  - loading timeout (3s)
  - fallback logic
  - dynamic pin population

---

### Quest Markers

`PlacesQuestMarkerLinker.ts`
- Links scene markers to pins
- Retry system (multi-pass linking)
- Visibility control

`QuestMarker.ts`
- Marker wrapper (name, distance, visuals)

---

### AI Assistant + TTS

`AIMapAssistant.ts`
- Uses Remote Service Gateway (OpenAI)

Pipeline:
- Get user GPS position
- Generate contextual prompt
- Request AI completion
- Display response
- Generate TTS audio
- Play audio + apply music ducking

`AIFrameAnimator.ts`
- Animates AI response panel
- Syncs with Places Clam UI

---

## ✅ Requirements

- Lens Studio 5.15+
- Snap Spectacles (2024)
- Internet connection

Included packages:
- `SpectaclesUIKit.lspkg`
- `RemoteServiceGateway.lspkg`

---

## 📦 Installation

```bash
git clone https://github.com/DgnsGui/DGNS-Nav-Map

Open in Lens Studio:

DGNS Nav Map 1.1 Backup 4.esproj
⚙️ Configuration

Set API credentials in:

Assets/RemoteServiceGateway.lspkg/RemoteServiceGatewayCredentials.ts

Required:

OpenAI Token (AI + TTS)
Snap Token (Places API)

Optional:

Google Token
🎮 User Experience
Spawn Pin → Create a pin
Clear Pins → Remove all pins
Zoom / Recenter → Navigate the map
Mini Map Toggle → Switch modes
Places Buttons → Discover nearby venues
Ask AI → Get contextual voice guidance
⚠️ Known Issues
Category Filters
Empty filters ("") bypass filtering logic
Fix: use "cafe", "restaurant", "bar"
Places Cache
Incorrect key used in cache lookup
May prevent proper reuse
Audio Ducking Logs
Logged value differs from actual volume applied
🚀 Deployment
Test via Lens Studio (Play)
Publish for Spectacles via your pipeline
🙏 Credits
Snap Remote Service Gateway
Spectacles UIKit
Outdoor Navigation Sample (Snap)
OpenAI API
Snapchat Places API
<p align="center"> Developed with ❤️ by <strong>GuillaumeDGNS</strong> </p> ```
