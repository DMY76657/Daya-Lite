import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { users } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return NextResponse.json({ data: rows });
}
