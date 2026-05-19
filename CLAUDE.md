# CLAUDE.md — LoFi Corner Implementation Guide

This file provides guidance for Claude AI when working on this codebase.

See [AGENTS.md](AGENTS.md) for architecture overview and conventions.

## Commands Reference

```bash
npm run dev           # Start dev server at localhost:3000 (Turbopack enabled)
npm run build         # Production build + type validation
npm start             # Run production server locally
npm run lint          # ESLint check (eslint-config-next rules)
npx tsc --noEmit      # Type-check without emitting files
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (no providers needed, client-only)
│   ├── page.tsx                 # Single page, uses "use client"
│   └── globals.css              # Tailwind resets + global styles
├── components/                   # All UI components (flat, no subdirs)
│   ├── Scene.tsx                # Background animation (Framer Motion)
│   ├── MusicPlayer.tsx          # YouTube station player
│   ├── AmbientMixer.tsx         # Web Audio API ambient sounds
│   ├── PomodoroTimer.tsx        # Focus/break timer
│   ├── TodoList.tsx             # Task manager
│   ├── Clock.tsx                # Analog clock
│   └── Sidebar.tsx              # Main UI container
└── lib/                          # Utilities & constants
    └── stations.ts              # Music stations + ambient sounds config
```

## Styling Approach

**NO CSS modules. NO styled-components. NO emotion.** Only inline styles:

```tsx
// ✅ DO: Inline styles
<div style={{
  width: "100vw",
  height: "100dvh",
  background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
  overflow: "hidden"
}}>

// ✅ DO: Tailwind classes (sparingly)
<button className="absolute top-4 right-4 z-50">

// ❌ DON'T: CSS imports, CSS modules, className generators
```

**Color palette:**
- Navy: `#0a0e27`, `#1a1f3a`
- Glass cards: `rgba(255,255,255,0.04)` background + `1px solid rgba(255,255,255,0.08)` border
- Accents: `#ffd700` (gold), `#a855f7` (purple), `#06b6d4` (cyan)

## State Management

**Only `useState` hooks.** No Redux, no Context API, no Zustand.

Components manage their own state:
- `MusicPlayer.tsx` — Current station index
- `AmbientMixer.tsx` — Sound volumes (0–1 range)
- `PomodoroTimer.tsx` — Time remaining, session mode (focus/break/long-break)
- `TodoList.tsx` — Task array
- `Scene.tsx` — Animation frame counter (if needed)

**Pass data down via props, events up via callbacks.** Minimal prop drilling needed since all UI is in `Sidebar.tsx`.

## Web Audio API Implementation

**Ambient sounds** are procedurally generated, not file-based:

```tsx
const generateNoise = (buffer, type) => {
  // type: "white", "pink", "brown", "fire", "rain", "ocean", etc.
  // Fills audio buffer with synthesized waveform
}

// In AmbientMixer.tsx:
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
gainNode.gain.value = volume; // 0–1
```

Each sound has a unique algorithm (e.g., rain = filtered pink noise, fire = brown noise + AM modulation).

## YouTube Embed Pattern

All 4 stations use YouTube embeds with these params:

```tsx
<iframe
  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&loop=1`}
  style={{ position: "absolute", left: "-9999px", visibility: "hidden" }}
/>
```

**Key points:**
- Video stays offscreen and invisible
- Audio plays through Web Audio API / system audio
- `loop=1` auto-restarts video
- `autoplay=1` starts immediately
- `mute=0` allows sound (unmute happens after user interaction for autoplay policy compliance)

## TypeScript

- **Strict mode enabled** in `tsconfig.json`
- **All props typed** — No `any` types without justification
- **Path alias:** `@/*` maps to `./src/`

```ts
// ✅ DO: Export types
export type PomodoroMode = "focus" | "break" | "long-break";

// ✅ DO: Typed props
interface TimerProps {
  onTimerEnd: (mode: PomodoroMode) => void;
}

// ❌ DON'T: any types
const handleTick = (event: any) => { }; // ❌
const handleTick = (event: PointerEvent) => { }; // ✅
```

## Performance Notes

1. **Full viewport layout** — `100vw, 100dvh` locks to device size
2. **Animation frame efficiency** — Scene uses Framer Motion `animate` (GPU-accelerated)
3. **Audio buffer management** — Ambient sounds are ~5s looped buffers (keep small to save memory)
4. **No SSR** — Everything runs client-side; no data fetching on server

## Deployment

This app is Vercel-ready. Build output goes to `.next/`. No custom server config needed.

```bash
npm run build    # Creates optimized Next.js build
npm start        # Serves .next/ locally for testing
```

---

**No backend, no APIs, no external DB calls.**  Everything is browser-only, real-time.
