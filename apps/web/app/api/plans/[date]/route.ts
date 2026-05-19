import { NextResponse } from 'next/server';
import { and, asc, eq } from 'drizzle-orm';
import { dailyPlans, mealLogs, meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';

type Params = { params: Promise<{ date: string }> };

// GET /api/plans/:date  -> returns plan with its logs and meal details for that user+date
export async function GET(_: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { date } = await params;

  const [plan] = await db
    .select()
    .from(dailyPlans)
    .where(and(eq(dailyPlans.userId, session.sub), eq(dailyPlans.planDate, date)))
    .limit(1);

  if (!plan) {
    return NextResponse.json({ data: null });
  }

  const rows = await db
    .select({
      log: mealLogs,
      meal: meals,
    })
    .from(mealLogs)
    .innerJoin(meals, eq(mealLogs.mealId, meals.id))
    .where(eq(mealLogs.planId, plan.id))
    .orderBy(asc(mealLogs.scheduledTime));

  return NextResponse.json({
    data: {
      ...plan,
      logs: rows.map((r) => ({ ...r.log, meal: r.meal })),
    },
  });
}

// PUT /api/plans/:id  -> update notes (path param here is plan ID, not date)
export async function PUT(request: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { date: planId } = await params;
  const body = await request.json().catch(() => null);
  const notes =
    body && typeof (body as { notes?: unknown }).notes === 'string'
      ? (body as { notes: string }).notes.trim() || null
      : null;

  const [updated] = await db
    .update(dailyPlans)
    .set({ notes, updatedAt: new Date() })
    .where(and(eq(dailyPlans.id, planId), eq(dailyPlans.userId, session.sub)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Планът не е намерен.' }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
