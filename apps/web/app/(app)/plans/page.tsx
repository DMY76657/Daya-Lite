import { desc, eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { dailyPlans, mealLogs } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export default async function PlansPage() {
  const session = (await getSession())!;

  const rows = await db
    .select({
      id: dailyPlans.id,
      planDate: dailyPlans.planDate,
      total: sql<number>`count(${mealLogs.id})::int`,
      eaten: sql<number>`count(*) filter (where ${mealLogs.status} = 'eaten')::int`,
    })
    .from(dailyPlans)
    .leftJoin(mealLogs, eq(mealLogs.planId, dailyPlans.id))
    .where(eq(dailyPlans.userId, session.sub))
    .groupBy(dailyPlans.id, dailyPlans.planDate)
    .orderBy(desc(dailyPlans.planDate))
    .limit(30);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">История на плановете</h1>
      <p className="mt-1 text-sm text-slate-600">Последни 30 дни с план</p>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Все още няма планирани дни.
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {rows.map((row) => {
            const pct = row.total > 0 ? Math.round((row.eaten / row.total) * 100) : 0;
            return (
              <li
                key={row.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{row.planDate}</p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {row.eaten} от {row.total} изядени ({pct}%)
                    </p>
                  </div>
                  <Link
                    href={`/dashboard?date=${row.planDate}`}
                    className="text-sm font-medium text-emerald-700 hover:underline"
                  >
                    Виж →
                  </Link>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
