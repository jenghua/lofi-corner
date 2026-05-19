# LoFi Corner — Agent Guidelines

**LoFi Corner** is a Next.js 14 single-page ambient music + productivity app. This guide helps AI agents be immediately productive.

## Quick Start

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint validation
```

No test setup exists. Use `npx tsc --noEmit` to type-check.

## Architecture at a Glance

| Aspect | Details |
|--------|---------|
| **Type** | Client-side SPA (all components use `"use client"`) |
| **Framework** | Next.js 14 App Router in `src/app/` |
| **Components** | All in `src/components/` (flat structure) |
| **Styling** | Inline `style={{}}` props (no CSS modules, minimal Tailwind) |
| **State** | Local `useState` hooks only (no Redux, no global store) |
| **Audio** | Web Audio API (procedurally generated ambient sounds) |
| **Music** | YouTube embeds (4 stations) |
| **Animations** | Framer Motion for scene effects |

## Key Conventions

### Imports
All imports use `@/` alias (no relative paths):
```ts
import { Scene } from "@/components/Scene";
import { STATIONS } from "@/lib/stations";
```

### Components
- **All client-side:** Every component starts with `"use client"`
- **Inline styles:** Use `style={{}}` or Tailwind classes sparingly
- **Props pattern:** Simple destructuring, no complex prop drilling
- **Data constants:** Static arrays/objects in `lib/stations.ts`

### Layout
- Full viewport: `width: 100vw, height: 100dvh, overflow: hidden`
- Z-index layers:
  - `z-0`: Background (Scene)
  - `z-1`: Vignette overlay
  - `z-2`: Content (Clock)
  - `z-3+`: Interactive UI (Sidebar)

### Color Scheme
- Deep navy/midnight backgrounds: `#0a0e27`, `rgba(10,14,39,0.95)`
- Glass-morphism cards: `background: "rgba(255,255,255,0.04)"`, `border: "1px solid rgba(255,255,255,0.08)"`
- Accent: Gold (#ffd700), Purple, Cyan

## Component Overview

| Component | Purpose |
|-----------|---------|
| `Scene.tsx` | Animated background (stars, moon, sky gradient) using Framer Motion |
| `MusicPlayer.tsx` | YouTube station selection + playback |
| `AmbientMixer.tsx` | 6 Web Audio API ambient sounds (fire, rain, ocean, forest, thunder, coffee shop) |
| `PomodoroTimer.tsx` | 25/5/15 min focus/break/long-break cycles |
| `TodoList.tsx` | Simple task management |
| `Clock.tsx` | Analog clock display |
| `Sidebar.tsx` | Main UI container (collapsible on mobile) |

## Development Tips

1. **Web Audio API**: Ambient sounds are procedurally generated noise (stored in state, not files). Check `AmbientMixer.tsx` for the synthesis algorithm.
2. **YouTube embeds**: Use query params `?autoplay=1&mute=0&controls=0&loop=1` for seamless playback.
3. **Framer Motion**: Scene animations use `animate`, `initial`, `transition` props (no CSS animations).
4. **TypeScript strict mode**: All types required. No `any` unless justified.
5. **Mobile responsive**: Sidebar collapses on small screens; use media queries in `sx` prop.

## Important Notes

- **No backend integration** — This is a browser-only app. No API calls, no auth.
- **No test setup** — Jest not configured.
- **No Prettier hook** — Format manually if needed.
- **No environment variables** — Everything runs client-side.

---

See [README.md](README.md) for generic Next.js info.
