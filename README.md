![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Platform](https://img.shields.io/badge/Platform-Snap_Spectacles24-black.svg)
![Tech](https://img.shields.io/badge/Powered_by-Lens_Studio_5.10-yellow.svg)

<h1 align="center">DGNS Nav Map - A Navigation experience for Spectacles</h1>

<p align="center">
  <em>DGNS Nav Map is an interactive navigation Lens built for **Snapchat Spectacles (2024) using Lens Studio 5.12.  
It provides a futuristic way to explore your surroundings, find nearby places, drop map pins, and interact with an AI-powered navigation assistant, all within augmented reality.</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dd3bcb3e-2046-4199-8f39-e17f062f9161" alt="Project Preview GIF" width="600"/>
</p>


---

## 🕶️ Overview
An immersive AR navigation experience combining:

- **Real-time Snap Places API
- **Gesture-based map controls
- **AI conversation assistant
- **Custom pins & quest markers
- **Built-in ambient music player

---
## ✨ Features

- 🗺️ **Interactive Map Navigation** — Pan, zoom, and rotate using pinch & drag gestures  
- 📍 **Custom Map Pins** — Drop/remove pins directly on the map  
- 🤖 **AI Map Assistant** — Ask for facts about your geographical location and get answered in natural language  
- 🎶 **Built-in Music Player** — Play your soundtrack while exploring (`SimpleMusicPlayer.ts`)  
- 🎯 **Quest & Landmark Markers** — Dynamic AR waypoints (`QuestMarker.ts`)  
- 🧭 **Smart Centering System** — Auto-recenter on zoom/rotate (`MapController.ts`)  
- 🌍 **Snap Places API Integration** — Real nearby locations appears as pins on your map (`SnapPlacesProvider.ts`)

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

## ✅ Requirements

Before you begin, make sure you have the following installed:

- **[Lens Studio](https://lensstudio.snapchat.com/)** – Version 5.15 or newer recommended.
- **[Git](https://git-scm.com/)** – Version control system.
- **[Git LFS](https://git-lfs.com/)** – Required to handle large assets (audio tracks, textures).


📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

<p align="center"> Developed with ❤️ by <strong>GuillaumeDGNS</strong> </p>
