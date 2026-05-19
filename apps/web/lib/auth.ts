import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { JwtPayload } from '@daya-lite/shared';

export const COOKIE_NAME = 'daya_token';
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JwtPayload | null> {
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
