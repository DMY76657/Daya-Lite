# 03 — API Endpoints

Base URL: `http://localhost:3000` (dev) / Netlify URL (prod)
Auth: JWT in `httpOnly` cookie `daya_token`
Response format: `{ data: T }` on success, `{ error: string }` on failure

## Auth (3)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login, set cookie |
| POST | `/api/auth/logout` | Any | Clear cookie |

## Meals CRUD (5)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/meals` | User | List own meals |
| GET | `/api/meals/:id` | User | Get one meal |
| POST | `/api/meals` | User | Create meal |
| PUT | `/api/meals/:id` | User | Update meal |
| DELETE | `/api/meals/:id` | User | Delete meal |

## Daily Plans (4)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/plans` | User | List own plans |
| GET | `/api/plans/:date` | User | Get plan for date (with logs + meals) |
| POST | `/api/plans` | User | Create plan |
| PUT | `/api/plans/:id` | User | Update plan notes |

## Meal Logs (4)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/logs` | User | Add meal to plan |
| PUT | `/api/logs/:id` | User | Update log (time, status) |
| PATCH | `/api/logs/:id/eat` | User | Mark as eaten (sets `eaten_at`) |
| DELETE | `/api/logs/:id` | User | Remove meal from plan |

## Admin (3)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/users/:id` | Admin | Get user details |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |

## User Self-Service (1)

| Method | Path | Auth | Description |
|---|---|---|---|
| DELETE | `/api/users/me` | User | Delete own account (password in body) |

**Total: 18 endpoints**
