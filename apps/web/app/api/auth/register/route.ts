import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { signToken, sessionCookie } from '@/lib/auth';
import { validateRegister } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateRegister(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const { email, password, name } = validation.data!;

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Имейлът вече е зает.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ email, name, passwordHash, role: 'user' })
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({ data: user }, { status: 201 });
  response.cookies.set(sessionCookie(token));
  return response;
}
