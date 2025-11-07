🌐 DGNS Nav Map v1.0

🕶️ Overview

DGNS Nav Map is an interactive navigation Lens built for Spectacles (2024) using Lens Studio 5.12.
It provides a futuristic way to explore your surroundings — find nearby places, drop map pins, and interact with an AI-powered navigation assistant — all within augmented reality.

“Find places. Navigate your surroundings. Set markers and see where to go — intuitively!”

✨ Features

🗺️ Interactive Map Navigation — Pan and zoom using pinch gestures, designed for immersive AR exploration.

📍 Custom Map Pins — Tap or pinch to drop and remove pins directly on the map.

🤖 AI Map Assistant — Ask AI for help to find places or get directions.

🎶 Built-in Music Player — Play your personal soundtrack while exploring (powered by SimpleMusicPlayer.ts).

🎯 Quest & Landmark Markers — Visualize dynamic waypoints through QuestMarker.ts.

🧭 Smart Centering System — Automatically re-centers the map when zooming or rotating (MapController.ts).

🌍 Snap Places API Integration — Access real nearby locations via SnapPlacesProvider.ts.

🧩 Architecture

DGNS Nav Map is organized into modular TypeScript components:

Script	Description
AIMapAssistant.ts	Handles AI queries and conversational map assistance.
SnapPlacesProvider.ts	Integrates Snap’s Places API to display real-world locations.
MapComponent.ts	Core map rendering and state management component.
MapController.ts	Controls map manipulation: zoom, drag, rotate, and re-centering.
MapPin.ts	Defines and manages interactive pins on the map.
QuestMarker.ts	Displays quest-like markers and objectives in AR.
SimpleMusicPlayer.ts	Lightweight UI for audio playback within the Lens.
🧭 How to Use

Navigate the map using pinch gestures.

Tap or pinch to add a Pin on the map.

Tap “Places” to show nearby locations fetched via Snap Places API.

Tap “Clear Pins” to remove all markers.

Press the Music icon 🎵 to toggle the in-Lens music player.

🛠️ Installation & Setup

Open the project in Lens Studio 5.12 or later.

Make sure Spectacles 2024 are selected as the target device.

Ensure the following assets are included:

Scripts/AIMapAssistant.ts

Scripts/SnapPlacesProvider.ts

Scripts/MapController.ts

Scripts/MapPin.ts

Scripts/QuestMarker.ts

Scripts/SimpleMusicPlayer.ts

Build and preview on your Spectacles.

🎵 Credits

Lens Design & Code: DGNS

Original Soundtrack: PaulMX – “Satellite Drift”

📜 Changelog

v1.0

Fixed map scroll reset and recenter logic (MapController.ts)

Improved rotation and alignment (MapManipulation.ts)

New visual design: updated pins, UI shell, and overall style

Added Ask AI functionality

Optimized zoom responsiveness

⚠️ Known Issues

Interface resizing is not supported yet

Pin labels may display outside the clam-shaped map boundary

🔮 Future Improvements

Resizable and adaptive interface

Place filters with toggle buttons

Mini-map mode, GPS arrow, hand tracking, and visual skins

Search bar for specific locations

🧠 Project Vision

DGNS Nav Map was designed as both an artistic experiment and a functional navigation tool — blending creativity, AI, and real-world mapping into one intuitive AR experience.
Built with love for urban explorers and creative technologists.
