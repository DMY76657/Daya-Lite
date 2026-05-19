'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { MealLog, Meal } from '@daya-lite/shared';
import { messages } from '@/lib/messages';

type LogWithMeal = MealLog & { meal: Meal };

interface DashboardClientProps {
  today: string;
  planId: string | null;
  logs: LogWithMeal[];
  meals: Meal[];
}

function statusBadge(status: MealLog['status']) {
  if (status === 'eaten') {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
        {messages.dashboard.eaten}
      </span>
    );
  }
  if (status === 'skipped') {
    return (
      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
        {messages.dashboard.skipped}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
      {messages.dashboard.planned}
    </span>
  );
}

export function DashboardClient({ today, planId: initialPlanId, logs, meals }: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [planId, setPlanId] = useState<string | null>(initialPlanId);
  const [adding, setAdding] = useState(false);
  const [mealId, setMealId] = useState<string>(meals[0]?.id ?? '');
  const [time, setTime] = useState('08:00');
  const [error, setError] = useState<string | null>(null);

  async function ensurePlan(): Promise<string | null> {
    if (planId) return planId;
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planDate: today }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? messages.errors.generic);
      return null;
    }
    setPlanId(json.data.id);
    return json.data.id;
  }

  async function markEaten(logId: string) {
    setError(null);
    const res = await fetch(`/api/logs/${logId}/eat`, { method: 'PATCH' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? messages.errors.generic);
      return;
    }
    startTransition(() => router.refresh());
  }

  async function removeLog(logId: string) {
    setError(null);
    const res = await fetch(`/api/logs/${logId}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? messages.errors.generic);
      return;
    }
    startTransition(() => router.refresh());
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const pid = await ensurePlan();
    if (!pid) return;

    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: pid, mealId, scheduledTime: time, status: 'planned' }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? messages.errors.generic);
      return;
    }
    setAdding(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{messages.dashboard.title}</h2>
          <p className="text-sm text-slate-600">{today}</p>
        </div>
        {meals.length > 0 && (
          <button
            onClick={() => setAdding(!adding)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {adding ? '×' : '+ ' + messages.dashboard.addMeal}
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {meals.length === 0 && (
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Нямаш добавени ястия в каталога.{' '}
          <Link href="/meals" className="font-medium underline">
            Добави първото си ястие →
          </Link>
        </div>
      )}

      {adding && meals.length > 0 && (
        <form onSubmit={addLog} className="space-y-3 rounded-lg bg-white p-4 ring-1 ring-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-700">Ястие</span>
              <select
                value={mealId}
                onChange={(e) => setMealId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {meals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-700">Час</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Добави
          </button>
        </form>
      )}

      {logs.length === 0 ? (
        <p className="rounded-lg bg-white px-4 py-8 text-center text-slate-500 ring-1 ring-slate-200">
          {messages.dashboard.noMeals}
        </p>
      ) : (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-slate-500">{log.scheduledTime}</span>
                <div>
                  <p className="font-medium">{log.meal.name}</p>
                  {log.meal.calories !== null && (
                    <p className="text-xs text-slate-500">
                      {log.meal.calories} {messages.meals.caloriesUnit}
                    </p>
                  )}
                </div>
                {statusBadge(log.status)}
              </div>
              <div className="flex gap-2">
                {log.status === 'planned' && (
                  <button
                    onClick={() => markEaten(log.id)}
                    className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    ✓ {messages.dashboard.markEaten}
                  </button>
                )}
                <button
                  onClick={() => removeLog(log.id)}
                  className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-red-600"
                  aria-label="Изтрий"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
