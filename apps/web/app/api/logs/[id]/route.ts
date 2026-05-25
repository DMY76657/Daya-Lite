import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { dailyPlans, mealLogs } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validateLogUpdate } from '@/lib/validation';

type Params = { params: Promise<{ id: string }> };

// Loads log row + its plan owner in one query; returns null if not found or not owned.
async function loadOwnedLog(logId: string, userId: string) {
  const [row] = await db
    .select({ log: mealLogs, plan: dailyPlans })
    .from(mealLogs)
    .innerJoin(dailyPlans, eq(mealLogs.planId, dailyPlans.id))
    .where(and(eq(mealLogs.id, logId), eq(dailyPlans.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function PUT(request: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const validation = validateLogUpdate(body);
  if (!validation.success) {
    return jsonResponse({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const owned = await loadOwnedLog(id, session.sub);
  if (!owned) {
    return jsonResponse({ error: 'Записът не е намерен.' }, { status: 404 });
  }

  const patch: Partial<typeof mealLogs.$inferInsert> = {};
  if (validation.data!.scheduledTime !== undefined) {
    patch.scheduledTime = validation.data!.scheduledTime;
  }
  if (validation.data!.status !== undefined) {
    patch.status = validation.data!.status;
    patch.eatenAt = validation.data!.status === 'eaten' ? new Date() : null;
  }

  const [updated] = await db
    .update(mealLogs)
    .set(patch)
    .where(eq(mealLogs.id, id))
    .returning();

  return jsonResponse({ data: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const owned = await loadOwnedLog(id, session.sub);
  if (!owned) {
    return jsonResponse({ error: 'Записът не е намерен.' }, { status: 404 });
  }

  await db.delete(mealLogs).where(eq(mealLogs.id, id));
  return jsonResponse({ data: { id } });
}

export { OPTIONS } from '@/lib/cors';
import { jsonResponse } from '@/lib/cors';
