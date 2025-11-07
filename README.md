![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Platform](https://img.shields.io/badge/Platform-Snap_Spectacles24-black.svg)
![Tech](https://img.shields.io/badge/Powered_by-Lens_Studio_5.10-yellow.svg)

<h1 align="center">DGNS Nav Map - A Navigation experience for Spectacles</h1>

<p align="center">
  <em>DGNS Nav Map is an **interactive navigation Lens** built for **Snapchat Spectacles (2024)** using **Lens Studio 5.12**.  
It provides a futuristic way to explore your surroundings — find nearby places, drop map pins, and interact with an **AI-powered navigation assistant** — all within augmented reality.</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dd3bcb3e-2046-4199-8f39-e17f062f9161" alt="Project Preview GIF" width="600"/>
</p>


---

## 🕶️ Overview
An immersive AR navigation experience combining:

- **Real-time Snap Places API
- **Surface Toggle** – Toggle buttons, to activate projection on floor, walls and ceilings independently.
- **Gesture-based map controls
- **AI conversation assistant
- **Custom pins & quest markers
- **Built-in ambient music player

---
## ✨ Features

- 🗺️ **Interactive Map Navigation** — Pan, zoom, and rotate using pinch & drag gestures  
- 📍 **Custom Map Pins** — Tap or pinch to drop/remove pins directly on the map  
- 🤖 **AI Map Assistant** — Ask for facts about your geographical location and get answered in natural language  
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

## ✅ Requirements

Before you begin, make sure you have the following installed:

- **[Lens Studio](https://lensstudio.snapchat.com/)** – Version 5.x or newer recommended.
- **[Git](https://git-scm.com/)** – Version control system.
- **[Git LFS](https://git-lfs.com/)** – Required to handle large assets (audio tracks, textures).

---

## 🛠️ Installation & Setup

1. **Install Git LFS** (one-time setup):
```bash
   git lfs install
```
Clone the Repository:

```bash
git clone https://github.com/DGNSGui/DGNS-World-FX-Spectacles-Lens.git
```
Open the Project:

Navigate to the cloned directory.

Open the file DGNS World FX V2 Backup 2.lsproj with Lens Studio.


Deploy to Spectacles:

---

📂 Codebase Overview
File	Description
PageManager.ts	Manages navigation between UI pages.

WorldEffectsManager2.ts	Activates/deactivates shader effects, ensuring only one runs at a time.

SimpleMusicPlayer.ts	Controls audio playback and UI updates for the music player.

Control Surfaces 2.ts	Toggles shader surfaces (floor, walls, ceiling).

AdvancedShaderController.js	Links 3D object transform to shader parameters dynamically.

ResetButton.js	Resets object position to its initial state.

WelcomePrefab.js	Handles the welcome screen and changelog display.

---

🤝 Contribution Guidelines
Contributions are welcome! To contribute:

Fork the repository.

Create a feature branch:

```bash
git checkout -b feature/MyNewFeature
```
Commit your changes:

```bash
git commit -m "Add MyNewFeature"
```
Push the branch:

```bash
git push origin feature/MyNewFeature
```
---
📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

<p align="center"> Developed with ❤️ by <strong>GuillaumeDGNS</strong> </p>
