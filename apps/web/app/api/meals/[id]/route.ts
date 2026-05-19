import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validateMeal } from '@/lib/validation';

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const [meal] = await db
    .select()
    .from(meals)
    .where(and(eq(meals.id, id), eq(meals.userId, session.sub)))
    .limit(1);

  if (!meal) {
    return NextResponse.json({ error: 'Ястието не е намерено.' }, { status: 404 });
  }

  return NextResponse.json({ data: meal });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validation = validateMeal(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const [meal] = await db
    .update(meals)
    .set(validation.data!)
    .where(and(eq(meals.id, id), eq(meals.userId, session.sub)))
    .returning();

  if (!meal) {
    return NextResponse.json({ error: 'Ястието не е намерено.' }, { status: 404 });
  }

  return NextResponse.json({ data: meal });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const [deleted] = await db
    .delete(meals)
    .where(and(eq(meals.id, id), eq(meals.userId, session.sub)))
    .returning({ id: meals.id });

  if (!deleted) {
    return NextResponse.json({ error: 'Ястието не е намерено.' }, { status: 404 });
  }

  return NextResponse.json({ data: { id: deleted.id } });
}
