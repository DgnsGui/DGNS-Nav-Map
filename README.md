# 🌐 DGNS Nav Map v1.0

[![DGNS Nav Map Demo][(https://s12.gifyu.com/images/b3yc1.gif)

> **“Find places. Navigate your surroundings. Set markers and see where to go — intuitively!”**

DGNS Nav Map is an **interactive navigation Lens** built for **Snapchat Spectacles (2024)** using **Lens Studio 5.12**.  
It provides a futuristic way to explore your surroundings — find nearby places, drop map pins, and interact with an **AI-powered navigation assistant** — all within augmented reality.

---

## 🕶️ Overview

https://www.youtube.com/watch?v=xyz123 (optionnel : remplace par ta vidéo démo si tu en as une)

An immersive AR navigation experience combining:
- Real-time Snap Places API
- Gesture-based map controls
- AI conversation assistant
- Custom pins & quest markers
- Built-in ambient music player

---

## ✨ Features

- 🗺️ **Interactive Map Navigation** — Pan, zoom, and rotate using pinch & drag gestures  
- 📍 **Custom Map Pins** — Tap or pinch to drop/remove pins directly on the map  
- 🤖 **AI Map Assistant** — Ask for directions, places, or tips in natural language  
- 🎶 **Built-in Music Player** — Play your soundtrack while exploring (`SimpleMusicPlayer.ts`)  
- 🎯 **Quest & Landmark Markers** — Dynamic AR waypoints (`QuestMarker.ts`)  
- 🧭 **Smart Centering System** — Auto-recenter on zoom/rotate (`MapController.ts`)  
- 🌍 **Snap Places API Integration** — Real nearby locations (`SnapPlacesProvider.ts`)

---

## 🧩 Architecture

Modular TypeScript components:

| Script                  | Description                                      |
|-------------------------|--------------------------------------------------|
| `AIMapAssistant.ts`     | AI queries & conversational navigation helper    |
| `SnapPlacesProvider.ts` | Snap Places API → real-world location display    |
| `MapComponent.ts`       | Core map rendering & state management            |
| `MapController.ts`      | Zoom, drag, rotate, recenter logic               |
| `MapPin.ts`             | Interactive pin creation & management            |
| `QuestMarker.ts`        | Quest/objective AR markers                       |
| `SimpleMusicPlayer.ts`  | Lightweight in-Lens audio player UI              |

---

## 🧭 How to Use

1. **Navigate** → Pinch to zoom, drag to pan, two-finger rotate  
2. **Drop a Pin** → Tap or pinch anywhere on the map  
3. **Find Places** → Tap **"Places"** button → see real locations around you  
4. **Clear Pins** → Tap **"Clear Pins"**  
5. **Music** → Tap 🎵 to toggle the ambient player  

---

## 🛠️ Installation & Setup

```bash
1. Open in Lens Studio 5.12+
2. Target device: Spectacles (2024)
3. Required scripts (must be in /Scripts/):
   ├── AIMapAssistant.ts
   ├── SnapPlacesProvider.ts
   ├── MapController.ts
   ├── MapPin.ts
   ├── QuestMarker.ts
   └── SimpleMusicPlayer.ts
4. Build → Preview on Spectacles
