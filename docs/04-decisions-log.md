# 04 — Architecture Decisions Log

## 2026-05-17 — Initial setup

### JWT stored as httpOnly cookie (not localStorage)
XSS attacks cannot read httpOnly cookies. localStorage is vulnerable to script injection.
Cookie is `secure` in production, `sameSite: 'lax'` to allow redirects.

### `jose` library for JWT (not `jsonwebtoken`)
`jsonwebtoken` uses Node.js `crypto` which is not available in Next.js Edge Runtime.
`jose` is Web Crypto API-based and works in both Node and Edge.

### Drizzle ORM (not Prisma)
Course requirement. Also: Drizzle is closer to raw SQL, schema as TypeScript is type-safe.
No code-generation step needed at runtime — schema IS the types.

### `packages/shared` for schema + types
Both `apps/web` and `apps/mobile` need the same types (User, Meal, etc.).
Avoids duplication and drift. Web app imports DB client from `lib/db.ts` which wraps shared schema.

### `@neondatabase/serverless` driver
Neon's recommended driver for serverless environments (no persistent TCP connections).
Works with Drizzle via `drizzle-orm/neon-http`.

### Self-delete requires password in body (not email confirmation)
Course scope excludes email service (Resend). Password confirmation is simpler and still secure.

### Bulgarian UI text centralized in `lib/messages.ts`
All user-facing strings in one file makes future i18n straightforward.
Architecture is i18n-ready even though real translation is out of MVP scope.
