import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: 'Потребителят не е намерен.' }, { status: 404 });
  }

  return NextResponse.json({ data: user });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  if (id === session.sub) {
    return NextResponse.json(
      { error: 'Не можеш да изтриеш собствения си админ акаунт от тук.' },
      { status: 400 },
    );
  }

  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (!deleted) {
    return NextResponse.json({ error: 'Потребителят не е намерен.' }, { status: 404 });
  }

  return NextResponse.json({ data: { id: deleted.id } });
}

export { OPTIONS } from '@/lib/cors';
