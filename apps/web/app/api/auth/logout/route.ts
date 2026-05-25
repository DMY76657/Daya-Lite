import { NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/auth';

export async function POST() {
  const response = jsonResponse({ data: { ok: true } });
  response.cookies.set(sessionCookie('', 0));
  return response;
}

export { OPTIONS } from '@/lib/cors';
import { jsonResponse } from '@/lib/cors';
