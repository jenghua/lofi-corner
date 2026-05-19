export interface Station {
  id: string;
  name: string;
  description: string;
  youtubeId: string;
  emoji: string;
  color: string;
}

export const STATIONS: Station[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    description: "Beats to relax/study to",
    youtubeId: "jfKfPfyJRdk",
    emoji: "📚",
    color: "#7c3aed",
  },
  {
    id: "chillhop",
    name: "Chillhop Radio",
    description: "Jazz & chill beats",
    youtubeId: "7NOSDKb0HlU",
    emoji: "🎷",
    color: "#06b6d4",
  },
  {
    id: "lofi-cafe",
    name: "Café Lofi",
    description: "Coffee shop vibes",
    youtubeId: "kgx4WGK0oNU",
    emoji: "☕",
    color: "#d97706",
  },
  {
    id: "synthwave",
    name: "Synthwave Radio",
    description: "Retro neon nights",
    youtubeId: "4xDzrJKXOOY",
    emoji: "🌙",
    color: "#ec4899",
  },
];

export interface AmbientSound {
  id: string;
  name: string;
  emoji: string;
  url: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: "rain", name: "Rain", emoji: "🌧️", url: "/sounds/rain.mp3" },
  { id: "cafe", name: "Café", emoji: "☕", url: "/sounds/cafe.mp3" },
  { id: "fire", name: "Fireplace", emoji: "🔥", url: "/sounds/fire.mp3" },
  { id: "forest", name: "Forest", emoji: "🌲", url: "/sounds/forest.mp3" },
  { id: "ocean", name: "Ocean", emoji: "🌊", url: "/sounds/ocean.mp3" },
  { id: "keyboard", name: "Keyboard", emoji: "⌨️", url: "/sounds/keyboard.mp3" },
];
