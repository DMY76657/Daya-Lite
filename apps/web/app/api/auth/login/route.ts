import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { signToken, sessionCookie } from '@/lib/auth';
import { validateLogin } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateLogin(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const { email, password } = validation.data!;

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return NextResponse.json({ error: 'Невалиден имейл или парола.' }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return NextResponse.json({ error: 'Невалиден имейл или парола.' }, { status: 401 });
  }

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(sessionCookie(token));
  return response;
}
