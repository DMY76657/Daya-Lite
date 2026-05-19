import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { dailyPlans, meals, mealLogs } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validateLogCreate } from '@/lib/validation';

export async function POST(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const validation = validateLogCreate(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const { planId, mealId, scheduledTime, status } = validation.data!;

  // Verify both plan and meal belong to current user
  const [plan] = await db
    .select({ id: dailyPlans.id })
    .from(dailyPlans)
    .where(and(eq(dailyPlans.id, planId), eq(dailyPlans.userId, session.sub)))
    .limit(1);

  if (!plan) {
    return NextResponse.json({ error: 'Планът не е намерен.' }, { status: 404 });
  }

  const [meal] = await db
    .select({ id: meals.id })
    .from(meals)
    .where(and(eq(meals.id, mealId), eq(meals.userId, session.sub)))
    .limit(1);

  if (!meal) {
    return NextResponse.json({ error: 'Ястието не е намерено.' }, { status: 404 });
  }

  const [log] = await db
    .insert(mealLogs)
    .values({
      planId,
      mealId,
      scheduledTime,
      status,
      eatenAt: status === 'eaten' ? new Date() : null,
    })
    .returning();

  return NextResponse.json({ data: log }, { status: 201 });
}
