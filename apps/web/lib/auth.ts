import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { JwtPayload } from '@daya-lite/shared';
import { COOKIE_NAME, verifyToken } from './jwt';

export { signToken, verifyToken, COOKIE_NAME } from './jwt';

export async function getSession(): Promise<JwtPayload | null> {
  // Mobile clients use Authorization: Bearer <token>
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    const payload = await verifyToken(token);
    if (payload) return payload;
  }

  // Web clients use httpOnly cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function sessionCookie(value: string, maxAge = 60 * 60 * 24 * 7) {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function requireUser(): Promise<JwtPayload | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Не сте удостоверен.' }, { status: 401 });
  }
  return session;
}

export async function requireAdmin(): Promise<JwtPayload | NextResponse> {
  const result = await requireUser();
  if (result instanceof NextResponse) return result;
  if (result.role !== 'admin') {
    return NextResponse.json({ error: 'Забранен достъп.' }, { status: 403 });
  }
  return result;
}
