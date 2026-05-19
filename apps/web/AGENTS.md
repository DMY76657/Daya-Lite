# AGENTS — apps/web

Instructions for AI dev agents working on the Daya Lite **Next.js web app**.

## What this is

A Next.js 15 App Router app that serves both the web UI and the REST API consumed by the mobile app. Single deployment target: Netlify.

## Tech

- Next.js 15 (App Router), React 18, TypeScript strict
- Tailwind CSS
- Drizzle ORM via `@daya-lite/shared` (schema-only package)
- `@neondatabase/serverless` HTTP driver
- `jose` for JWT, `bcryptjs` for password hashing
- All UI text in Bulgarian, centralised in `lib/messages.ts`

## Folder roles

| Path | Purpose |
|---|---|
| `app/(auth)/` | Public route group: `/login`, `/register`. Centered card layout. |
| `app/(app)/` | Auth-protected route group: `/dashboard`, `/meals`, `/profile`, `/admin`. Server-side guard in the layout redirects unauthenticated users to `/login`. |
| `app/api/` | REST API — 18 endpoints + `/api/docs` |
| `components/` | Client components (forms, modals, interactive lists) |
| `lib/auth.ts` | `signToken`, `verifyToken`, `getSession`, `requireUser`, `requireAdmin`. Reads both `daya_token` cookie (web) and `Authorization: Bearer` header (mobile). |
| `lib/db.ts` | Drizzle client (constructs schema from `@daya-lite/shared`) |
| `lib/messages.ts` | All Bulgarian UI strings — i18n-ready |
| `lib/validation.ts` | Input validators returning `ValidationResult<T>` |
| `middleware.ts` | Edge middleware that redirects unauthenticated requests away from `/(app)/*` and authenticated ones away from `/login`/`/register` |

## Conventions

- **Server Components by default.** Reach for `'use client'` only when a component needs `useState`, `useEffect`, event handlers, or browser APIs.
- **API response shape:** success → `{ data: ... }`, failure → `{ error: string }` (string in Bulgarian).
- **Auth helpers return `JwtPayload | NextResponse`.** Routes do `if (session instanceof NextResponse) return session;` before continuing.
- **Ownership filter on every query:** scope rows by `user_id` (or via plan ownership join for `meal_logs`).
- **Named exports** for everything except Next.js pages and layouts (which default-export).
- **No comments narrating what the code does.** Comments only when the *why* is non-obvious.

## Adding a new endpoint

1. Add a validator in `lib/validation.ts` if it accepts a body.
2. Create the route file under `app/api/<group>/<segment>/route.ts`.
3. Start with `const session = await requireUser(); if (session instanceof NextResponse) return session;`
4. Query with Drizzle, filtering by `session.sub`.
5. Return `{ data: ... }` on success, `{ error: '...' }` with the correct status on failure.
6. Add an entry to the `ENDPOINTS` array in `app/api/docs/route.ts`.

## Adding a new page

1. Create the file under `app/(app)/<slug>/page.tsx` if it needs auth, or `app/(auth)/<slug>/page.tsx` if public.
2. Default-export an `async` function and fetch data with `db` directly. The `(app)` layout already guarantees the session.
3. Add the user-facing copy to `lib/messages.ts`.
4. If the page has interactive bits, build a Client Component under `components/` and render it from the page.
