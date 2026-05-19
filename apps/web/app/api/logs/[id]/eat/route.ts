import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { dailyPlans, mealLogs } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// PATCH /api/logs/:id/eat — marks the meal log as eaten with timestamp
export async function PATCH(_: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;

  // Verify ownership via plan
  const [owned] = await db
    .select({ id: mealLogs.id })
    .from(mealLogs)
    .innerJoin(dailyPlans, eq(mealLogs.planId, dailyPlans.id))
    .where(and(eq(mealLogs.id, id), eq(dailyPlans.userId, session.sub)))
    .limit(1);

  if (!owned) {
    return NextResponse.json({ error: 'Записът не е намерен.' }, { status: 404 });
  }

  const [updated] = await db
    .update(mealLogs)
    .set({ status: 'eaten', eatenAt: new Date() })
    .where(eq(mealLogs.id, id))
    .returning();

  return NextResponse.json({ data: updated });
}
