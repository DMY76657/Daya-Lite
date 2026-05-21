// Auth is enforced by app/(app)/layout.tsx (server-side session check + redirect).
// We keep middleware.ts as a stub so any future edge-level needs (rate limiting,
// locale detection, etc.) plug in here without restructuring routes.
import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
