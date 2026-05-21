// Edge-safe JWT helpers: zero imports from next/headers so this module
// can be used from middleware.ts without dragging in Node-only APIs.

import { SignJWT, jwtVerify } from 'jose';
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
