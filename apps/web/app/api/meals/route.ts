import { NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validateMeal } from '@/lib/validation';

export async function GET() {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const rows = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, session.sub))
    .orderBy(desc(meals.createdAt));

  return NextResponse.json({ data: rows });
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const validation = validateMeal(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const [meal] = await db
    .insert(meals)
    .values({ ...validation.data!, userId: session.sub })
    .returning();

  return NextResponse.json({ data: meal }, { status: 201 });
}
