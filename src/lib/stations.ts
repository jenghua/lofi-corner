export interface Station {
  id: string;
  name: string;
  description: string;
  youtubeId: string;
  emoji: string;
  color: string;
  source: string; // YouTube channel credit
}

export const STATIONS: Station[] = [
  {
    id: "lofi-girl",
    name: "Study Corner",
    description: "Focus & relax beats",
    youtubeId: "X4VbdwhkE10",
    emoji: "📚",
    color: "#7c3aed",
    source: "Lofi Girl",
  },
  {
    id: "chillhop",
    name: "Mellow Grooves",
    description: "Jazz-infused hip-hop",
    youtubeId: "7NOSDKb0HlU",
    emoji: "🎷",
    color: "#06b6d4",
    source: "Chillhop Music",
  },
  {
    id: "lofi-cafe",
    name: "Café Jazz",
    description: "Coffee shop afternoon",
    youtubeId: "7n9Dqsy3aj4",
    emoji: "☕",
    color: "#d97706",
    source: "Jazz For Soul",
  },
  {
    id: "synthwave",
    name: "Neon City",
    description: "Retro cyberpunk vibes",
    youtubeId: "4xDzrJKXOOY",
    emoji: "🌙",
    color: "#ec4899",
    source: "NowhereTravelers",
  },
];
