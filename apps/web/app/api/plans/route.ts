import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { dailyPlans } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { validatePlan } from '@/lib/validation';

export async function GET() {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const rows = await db
    .select()
    .from(dailyPlans)
    .where(eq(dailyPlans.userId, session.sub))
    .orderBy(desc(dailyPlans.planDate));

  return NextResponse.json({ data: rows });
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null);
  const validation = validatePlan(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.errors!.join(' ') }, { status: 400 });
  }

  const { planDate, notes } = validation.data!;

  const existing = await db
    .select({ id: dailyPlans.id })
    .from(dailyPlans)
    .where(and(eq(dailyPlans.userId, session.sub), eq(dailyPlans.planDate, planDate)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: 'Вече има план за тази дата.' },
      { status: 409 },
    );
  }

  const [plan] = await db
    .insert(dailyPlans)
    .values({ userId: session.sub, planDate, notes })
    .returning();

  return NextResponse.json({ data: plan }, { status: 201 });
}

export { OPTIONS } from '@/lib/cors';
