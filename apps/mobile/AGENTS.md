# AGENTS — apps/mobile

Instructions for AI dev agents working on the Daya Lite **Expo mobile app**.

## What this is

A scope-limited Expo + React Native client. Reads from the Daya Lite REST API (served by `apps/web`). Never talks to the database directly.

## Scope (3 screens only)

1. **Login** — email + password, stores returned JWT in `expo-secure-store`.
2. **Today's plan** — lists today's meal logs with their meals, with a "mark as eaten" button per log.
3. **Add meal** — quick form to add a meal to the user's catalog (and optionally to today's plan).

That's it. The mobile app is intentionally narrow — the web app is the primary UI.

## Tech

- Expo SDK 52, expo-router (file-based routing)
- React Native 0.76
- `expo-secure-store` for JWT storage
- TypeScript strict
- No styling library — use React Native `StyleSheet`

## Backend

The mobile app reads `EXPO_PUBLIC_API_BASE_URL` from its `.env`:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api      # dev (phone + laptop on same Wi-Fi)
EXPO_PUBLIC_API_BASE_URL=https://daya-lite.netlify.app/api  # production
```

Auth: every authenticated request must include `Authorization: Bearer <token>` where the token comes from the login response body. The same API endpoints documented at `/api/docs` are used.

## Folder roles (planned)

| Path | Purpose |
|---|---|
| `app/(auth)/login.tsx` | Login screen |
| `app/(app)/index.tsx` | Today's plan (default screen after login) |
| `app/(app)/add-meal.tsx` | Add meal to catalog |
| `app/_layout.tsx` | Stack navigator + auth gate |
| `lib/api.ts` | (planned) `fetch` wrapper that injects the Bearer header |
| `lib/storage.ts` | (planned) Token storage via `expo-secure-store` |

## Conventions

- **All native alerts must have a Web fallback** — `Alert.alert()` doesn't render on Expo Web. Wrap dialogs in a tiny modal abstraction.
- **No web-only APIs.** No `document`, no `window` (except behind `Platform.OS === 'web'`).
- **Bulgarian UI text.** Mirror `apps/web/lib/messages.ts` keys where possible.
- **Loading and error states are mandatory** for every async screen. No silent failures.

## How to run

```bash
npm run dev:mobile
```

This starts Metro and prints a QR code — scan it with the **Expo Go** app on your phone. Make sure your phone is on the same Wi-Fi network as your laptop.
