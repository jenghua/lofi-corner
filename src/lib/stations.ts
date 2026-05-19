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
    youtubeId: "7n9Dqsy3aj4",
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
