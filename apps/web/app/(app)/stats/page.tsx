import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { dailyPlans, mealLogs, meals } from '@daya-lite/shared';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export default async function StatsPage() {
  const session = (await getSession())!;
  const last7 = daysAgoIso(7);
  const last30 = daysAgoIso(30);

  const eatenLogs = await db
    .select({
      planDate: dailyPlans.planDate,
      calories: meals.calories,
    })
    .from(mealLogs)
    .innerJoin(dailyPlans, eq(mealLogs.planId, dailyPlans.id))
    .innerJoin(meals, eq(mealLogs.mealId, meals.id))
    .where(
      and(
        eq(dailyPlans.userId, session.sub),
        eq(mealLogs.status, 'eaten'),
        gte(dailyPlans.planDate, last30),
      ),
    );

  const total7 = eatenLogs
    .filter((l) => l.planDate >= last7)
    .reduce((sum, l) => sum + (l.calories ?? 0), 0);
  const total30 = eatenLogs.reduce((sum, l) => sum + (l.calories ?? 0), 0);
  const meals7 = eatenLogs.filter((l) => l.planDate >= last7).length;
  const meals30 = eatenLogs.length;

  const byDay = new Map<string, number>();
  for (const log of eatenLogs) {
    if (log.planDate >= last7) {
      byDay.set(log.planDate, (byDay.get(log.planDate) ?? 0) + (log.calories ?? 0));
    }
  }
  const sortedDays = Array.from(byDay.entries()).sort(([a], [b]) =>
    a > b ? -1 : a < b ? 1 : 0,
  );
  const maxCal = Math.max(...sortedDays.map(([, c]) => c), 1);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Статистика</h1>
      <p className="mt-1 text-sm text-slate-600">Прием на калории от изядени ястия</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <StatCard label="Последни 7 дни" value={total7} suffix="ккал" sub={`${meals7} ястия`} />
        <StatCard label="Последни 30 дни" value={total30} suffix="ккал" sub={`${meals30} ястия`} />
      </div>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">По дни (последни 7)</h2>
      {sortedDays.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Няма данни за последните 7 дни.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {sortedDays.map(([date, cal]) => (
            <li key={date} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{date}</span>
                <span className="text-slate-900">{cal} ккал</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${(cal / maxCal) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  sub,
}: {
  label: string;
  value: number;
  suffix: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-emerald-700">
        {value} <span className="text-base font-normal text-slate-500">{suffix}</span>
      </p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}
