import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser, sessionCookie } from '@/lib/auth';
import { validateDeleteAccount } from '@/lib/validation';

// DELETE /api/users/me — self-delete account; requires password confirmation
export async function DELETE(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const validation = validateDeleteAccount(body);
  if (!validation.success) {
    return jsonResponse({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  if (!user) {
    return jsonResponse({ error: 'Потребителят не е намерен.' }, { status: 404 });
  }

  const match = await bcrypt.compare(validation.data!.password, user.passwordHash);
  if (!match) {
    return jsonResponse({ error: 'Грешна парола.' }, { status: 401 });
  }

  await db.delete(users).where(eq(users.id, session.sub));

  const response = jsonResponse({ data: { ok: true } });
  response.cookies.set(sessionCookie('', 0));
  return response;
}

export { OPTIONS } from '@/lib/cors';
import { jsonResponse } from '@/lib/cors';
