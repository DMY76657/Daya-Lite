# 02 — Database Schema

Schema file: `packages/shared/src/db/schema.ts`
Database: Neon serverless PostgreSQL
ORM: Drizzle ORM

## Tables (4)

### 1. `users`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `defaultRandom()` |
| `email` | text UNIQUE | login identifier |
| `password_hash` | text | bcryptjs, rounds=10 |
| `name` | text | display name |
| `role` | text enum | `'user'` \| `'admin'` |
| `created_at` | timestamp | `defaultNow()` |

### 2. `meals`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text | |
| `description` | text nullable | |
| `calories` | integer nullable | optional |
| `user_id` | uuid FK → users | CASCADE delete |
| `created_at` | timestamp | |

### 3. `daily_plans`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | CASCADE delete |
| `plan_date` | date | unique per user per day |
| `notes` | text nullable | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### 4. `meal_logs`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `plan_id` | uuid FK → daily_plans | CASCADE delete |
| `meal_id` | uuid FK → meals | CASCADE delete |
| `scheduled_time` | text | format `"HH:MM"` |
| `status` | text enum | `'planned'` \| `'eaten'` \| `'skipped'` |
| `eaten_at` | timestamp nullable | set only when `status='eaten'` |
| `created_at` | timestamp | |

## Relation Chain

```
users
 └── meals (user_id, CASCADE)
 └── daily_plans (user_id, CASCADE)
       └── meal_logs (plan_id, CASCADE)
             └── meals (meal_id, CASCADE)
```

## Drizzle Commands

```bash
npm run db:generate   # generate SQL migration files
npm run db:migrate    # apply migrations to Neon
npm run db:push       # push schema directly (dev only)
npm run db:studio     # open Drizzle Studio
```
