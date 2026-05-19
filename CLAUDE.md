# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev           # start dev server at localhost:3000 (uses --webpack flag)
npm run build         # production build (also validates types via Next.js)
npm run lint          # ESLint via eslint-config-next
npm run format        # Prettier write pass
npm run format:check  # Prettier check (used in CI)
npm test              # Jest (jsdom, @testing-library/react)
npm run test:watch    # Jest in watch mode
npm run test:coverage # Jest with v8 coverage
npx tsc --noEmit      # type-check without emitting
```

No test files exist yet, but Jest is configured (`jest.config.ts`, `jest.setup.ts`) with jsdom and `@/` alias support. Use `npx tsc --noEmit` to verify types after changes.

Prettier runs automatically on commit via Husky + lint-staged (`.husky/pre-commit`). Prettier config is `.prettierrc` (100-char width, double quotes, semicolons, trailing commas).

All imports use the `@/` alias (configured in `tsconfig.json` as `"@/*": ["./*"]`). Never use relative paths (`./` or `../`). Examples:

```ts
import { AppLayout } from "@/components/AppLayout/AppLayout";
import { useAppSelector } from "@/store/hooks";
import type { VocabularyItem } from "@/lib/api";
```

**Next.js 16 breaking change:** The `middleware.ts` file convention is deprecated. Use `proxy.ts` at the project root instead, and export a named `proxy` function (not `middleware`). The `config.matcher` shape is unchanged.

The backend is a Spring Boot server expected at `http://localhost:8080` (override via `API_BASE_URL` env var — server-side only, no `NEXT_PUBLIC_` prefix needed).

## Architecture

### Request / API proxy flow

All `/api/*` paths are proxied through the Next.js server to Spring Boot via the `rewrites` rule in `next.config.ts`. The browser never contacts Spring Boot directly.

```
Browser → /api/* → Next.js (rewrite) → http://localhost:8080/api/*
```

`lib/api.ts` is the single fetch wrapper used by all services. It uses relative paths (e.g. `/api/user/profile`) so they resolve to the Next.js rewrite. It reads/writes `studyos_access_token` and `studyos_refresh_token` from `localStorage`, and automatically retries once on 401 by calling `/api/auth/refresh`. All API calls must go through this file — never use `fetch` directly.

Service modules in `lib/services/` (`auth`, `vocabulary`, `stats`, `achievement`, `quest`, `battle`, `shop`, `session`, `music`) each wrap a slice of the REST API and are consumed only by Redux async thunks, never directly from components.

### State management

Ten Redux Toolkit slices in `store/`:

| Slice          | Responsibility                                   |
| -------------- | ------------------------------------------------ |
| `auth`         | JWT tokens, user profile                         |
| `vocabulary`   | Dictionary, study list, review queue             |
| `game`         | RPG state: gold, XP, daily practice count        |
| `userStats`    | HP, streak days, daily review counts from server |
| `achievements` | Achievement list + unlock status                 |
| `quests`       | Daily and weekly quest progress                  |
| `battle`       | Active monster battle state                      |
| `shop`         | Shop items for HP restoration                    |
| `sessions`     | Study session tracking (start/end/history/stats) |
| `music`        | Lofi music tracks and playback state             |

The `game` slice is the only one persisted to `localStorage` (key `studyos-game`). This is done via a `store.subscribe()` call in `store/index.ts`. It initialises from `localStorage` on first load using a function initialiser in the slice, which guards `typeof window === "undefined"` for SSR safety.

Use `useAppDispatch` / `useAppSelector` from `store/hooks.ts` — never the raw `useDispatch`/`useSelector`.

### Page / component conventions

Every page route and reusable component follows a five-file pattern:

```
page.tsx (or Component.tsx)   — JSX only, no logic
use[Name].ts                  — all state + side-effects (React hooks, dispatch, selectors)
[name]Data.ts                 — static constants / config arrays (no functions, no hooks)
[name]Function.ts             — pure utility functions with no React dependencies
[name].type.ts                — TypeScript interfaces for the hook return and props
```

Not every module needs all five files — only create the data/function files when there is content to put in them. The UI file and type file are always present; the hook is present when there is stateful logic.

When a component group has multiple related files, put them in their own sub-folder named after the component. Shared data/function files that are used by more than one group stay at the parent folder level.

```
components/
  AppLayout/               ← group folder
    AppLayout.tsx
    useAppLayout.ts
    appLayout.type.ts
  StoreInitializer.tsx     ← single file, no folder needed
  vocabulary/
    vocabCardData.ts       ← shared: used by VocabCard + StudyListItem
    VocabCard/
      VocabCard.tsx
      useVocabCard.ts
      vocabCard.type.ts
    StudyListItem/
      StudyListItem.tsx
      useStudyListItem.ts
      studyListItemFunction.ts
      studyListItem.type.ts
    ReviewFlashcard/
      ReviewFlashcard.tsx
      useReviewFlashcard.ts
      reviewFlashcard.type.ts

app/dashboard/           ← Next.js App Router folders stay as-is
  page.tsx
  useDashboard.ts
  dashboardData.ts
  dashboard.type.ts
app/login/
  page.tsx
  useLogin.ts
  login.type.ts
app/sessions/            ← study session timer
app/music/               ← lofi music player
app/vocabulary/
app/quests/
app/achievements/
app/shop/
app/profile/
app/register/
```

Pages that require auth call `fetchProfileAsync` in their hook's `useEffect` and redirect to `/login` on failure. No layout-level auth guard exists.

`components/AppLayout/AppLayout.tsx` is the authenticated shell. It reads from `vocabulary`, `game`, and `userStats` slices to display the RPG sidebar: level, XP bar, gold, HP bar, streak days. Wrap every authenticated page with `<AppLayout>`.

### Styling / theming

All MUI overrides live in `lib/theme.ts` (dark RPG theme: deep navy background, gold primary, purple secondary). Component-level style is written inline via the `sx` prop. Tailwind CSS is present but only used for global resets — prefer `sx` for component styling.

`app/providers.tsx` composes `AppRouterCacheProvider` (Emotion cache) → Redux `Provider` → MUI `ThemeProvider` → `CssBaseline`. This is mounted in `app/layout.tsx`.

### RPG game mechanics

`lib/gameUtils.ts` exports `computePlayerStats(studyListSize, gold)` which derives `level`, `xpProgress`, `playerClass`, etc. from raw numbers. XP is purely `studyListSize * 20`. This is a pure function — it does not read from Redux.

`store/gameSlice.ts` exports constants (`WORD_COST`, `DAILY_LIMIT`, `REVIEW_GOLD`, `REVIEW_XP`) used by both the slice and the vocabulary hook. Adding a word to the study list deducts `WORD_COST` gold from the `game` slice before dispatching `addToStudyListAsync`. Gold earnings from reviews are handled in `gameSlice.extraReducers` listening to `submitReviewAsync.fulfilled`.
