# Check-in

Friend check-in tracker. Expo / React Native (TypeScript), iOS first. Supabase backend comes in a later phase.

## Run it (Mac + Xcode)

1. One-time Xcode setup: open Xcode once and accept the license; in **Xcode > Settings > Components** install an iOS Simulator runtime.
2. In Terminal, from this folder:

   ```
   npm install
   npx expo start
   ```
3. When Metro is running, press `i` in that Terminal window. The iOS Simulator opens and the app loads (Expo installs "Expo Go" in the simulator the first time).

Other commands: `npm run typecheck`, `npm test`.

## Structure

- `app/` – routes (thin; each renders a screen from `src/`)
- `src/features/` – screens and their pieces (dashboard, friends)
- `src/components/` – shared UI (buttons with press-flash, skeletons, avatar)
- `src/lib/` – pure logic (health state, sorting) with tests in `__tests__/`
- `src/data/` – storage behind an interface (local now, Supabase later)
- `src/theme/`, `src/i18n/` – palette, font, English / 简体中文 / Español / 한국어
