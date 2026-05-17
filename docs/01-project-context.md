# 01 — Project Context

## What is Daya Lite?

A personal daily meal planner — MVP slice of the commercial product [mydaya.app](https://mydaya.app).
Built as a capstone project for the SoftUni course **"Full-Stack Apps with AI"** (March 2026 cohort).

**Author:** Diyan (Bulgarian entrepreneur, based between Ansbach, Germany and Morava, Bulgaria)
**Deadline:** 2026-05-27 at 16:00

## Tech Stack

| Layer | Technology |
|---|---|
| Backend + Web Frontend | Next.js 14 App Router |
| Database | Neon serverless PostgreSQL |
| ORM | Drizzle ORM + Drizzle Migrations |
| Web UI | React + TypeScript + Tailwind CSS |
| Mobile | Expo + React Native + TypeScript |
| Auth | Custom JWT (jose library, httpOnly cookie) |
| Deploy (web) | Netlify |
| Deploy (DB) | Neon |

## Monorepo Structure

```
apps/web/        → Next.js App Router (web + API routes)
apps/mobile/     → Expo Router (React Native)
packages/shared/ → Drizzle schema + shared TypeScript types
docs/            → Architecture, API reference, decisions
```

## MVP Scope — IN

- Register / Login / Logout with JWT
- Personal meals CRUD (catalog)
- Daily plans with meal logs (planned / eaten / skipped)
- Mark meal as eaten (with timestamp)
- Self-delete account (password confirmation)
- Admin panel (see + delete all users)

**Web screens (6):** `/login`, `/register`, `/dashboard`, `/meals`, `/profile`, `/admin`
**Mobile screens (3):** Login, Today's plan (mark eaten), Add meal

## MVP Scope — OUT (roadmap)

- AI meal suggestions (OpenAI)
- Push / email / Telegram notifications
- Stripe payments / subscriptions
- Meal photo uploads
- Weekly view
- Real i18n (architecture is i18n-ready via `lib/messages.ts`)

## Language Conventions

- **UI text:** Bulgarian only (centralized in `apps/web/lib/messages.ts`)
- **Code, filenames, commits, comments:** English
- **TypeScript:** strict mode ON, interfaces for objects, type aliases for unions
