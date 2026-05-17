# AGENTS.md — Daya Lite Capstone

This file instructs AI coding assistants (Claude Code, GitHub Copilot) how to work in this repository.

## Project Overview

**Daya Lite** is a personal daily meal planner — an MVP slice of the commercial product [mydaya.app](https://mydaya.app).
Built as a SoftUni "Full-Stack Apps with AI" capstone project. Deadline: **2026-05-27 16:00**.

## Monorepo Structure

```
apps/web/        → Next.js 14 App Router (web frontend + API)
apps/mobile/     → Expo + React Native (mobile frontend)
packages/shared/ → Drizzle schema, shared TypeScript types
docs/            → Architecture decisions and API reference
```

## Language Rules

- **UI text (user-facing strings):** Bulgarian only. Centralize in `apps/web/lib/messages.ts`.
- **Code, filenames, git commits, comments:** English only.
- **Variable/function names:** English camelCase.

## TypeScript Conventions (SoftUni course requirements)

- Strict mode is ON (`"strict": true` in all tsconfigs).
- Use **interfaces** for object shapes (not `type` aliases for plain objects).
- Use **type aliases** for union types and enum-like string literals:
  ```ts
  type UserRole = 'user' | 'admin';
  type MealLogStatus = 'planned' | 'eaten' | 'skipped';
  ```
- Use `?` for optional properties.
- Use `ValidationResult<T>` pattern for user input validation:
  ```ts
  interface ValidationResult<T> { success: boolean; data?: T; errors?: string[]; }
  ```
- Write reusable generic utilities where duplication appears.

## API Response Format

All API routes return either:
```ts
{ data: T }      // success
{ error: string } // failure
```
Use HTTP status codes correctly (200/201/400/401/403/404/500).

## Component Rules (Next.js App Router)

- **Default to Server Components.** Add `'use client'` only when state/events are needed.
- Named exports for all components (except Next.js `page.tsx` and `layout.tsx`).
- Keep API route logic thin — business logic goes in `lib/` service files.

## Database Rules

- Schema is the single source of truth: `packages/shared/src/db/schema.ts`.
- Never write raw SQL — use Drizzle ORM queries only.
- All FK relations use `CASCADE` delete.
- Run `npm run db:generate` after schema changes, then `npm run db:migrate`.

## Auth Rules

- JWT stored in `httpOnly` cookie named `daya_token`.
- Middleware at `apps/web/middleware.ts` protects all `(app)` routes.
- Admin routes (`/admin`, `/api/admin/*`) require `role === 'admin'`.
- Self-delete (`DELETE /api/users/me`) requires password confirmation in body.

## What NOT to implement (out of MVP scope)

- AI/OpenAI suggestions
- Push/email/Telegram notifications
- Stripe payments
- File uploads (meal photos)
- Weekly view
- Real i18n (architecture is i18n-ready via `messages.ts`)

## Commit Style

```
feat: add meal CRUD API routes
fix: correct JWT expiry header in logout
chore: run drizzle migration 0001
```

Use imperative mood, English, present tense. Min 15 commits total across min 3 different calendar days.

## Running Locally

```bash
cp .env.example .env          # fill DATABASE_URL and JWT_SECRET
npm install                   # installs all workspaces
npm run db:push               # push schema to Neon (first time)
npm run dev:web               # http://localhost:3000
npm run dev:mobile            # Expo dev server
```
