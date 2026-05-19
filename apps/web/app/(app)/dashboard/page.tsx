import { and, asc, desc, eq } from 'drizzle-orm';
import { dailyPlans, mealLogs, meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { DashboardClient } from '@/components/DashboardClient';

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function DashboardPage() {
  const session = (await getSession())!; // layout guarantees this
  const today = todayIso();

  const [plan] = await db
    .select()
    .from(dailyPlans)
    .where(and(eq(dailyPlans.userId, session.sub), eq(dailyPlans.planDate, today)))
    .limit(1);

  const logs = plan
    ? (
        await db
          .select({ log: mealLogs, meal: meals })
          .from(mealLogs)
          .innerJoin(meals, eq(mealLogs.mealId, meals.id))
          .where(eq(mealLogs.planId, plan.id))
          .orderBy(asc(mealLogs.scheduledTime))
      ).map((r) => ({ ...r.log, meal: r.meal }))
    : [];

  const userMeals = await db
    .select()
    .from(meals)
    .where(eq(meals.userId, session.sub))
    .orderBy(desc(meals.createdAt));

  return (
    <DashboardClient
      today={today}
      planId={plan?.id ?? null}
      logs={logs}
      meals={userMeals}
    />
  );
}
