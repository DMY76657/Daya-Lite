'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Meal } from '@daya-lite/shared';
import { messages } from '@/lib/messages';

interface MealFormState {
  name: string;
  description: string;
  calories: string;
}

const EMPTY: MealFormState = { name: '', description: '', calories: '' };

export function MealsClient({ initialMeals }: { initialMeals: Meal[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<MealFormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  function startEdit(meal: Meal) {
    setEditingId(meal.id);
    setAdding(false);
    setForm({
      name: meal.name,
      description: meal.description ?? '',
      calories: meal.calories?.toString() ?? '',
    });
    setError(null);
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setForm(EMPTY);
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      calories: form.calories.trim() === '' ? null : Number(form.calories),
    };

    const url = editingId ? `/api/meals/${editingId}` : '/api/meals';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? messages.errors.generic);
      return;
    }

    cancel();
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    if (!confirm(messages.meals.confirmDelete)) return;
    const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? messages.errors.generic);
      return;
    }
    startTransition(() => router.refresh());
  }

  const showForm = adding || editingId !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{messages.meals.title}</h2>
        {!showForm && (
          <button
            onClick={startAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + {messages.meals.add}
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-lg bg-white p-4 ring-1 ring-slate-200"
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-700">
              {messages.meals.name}
            </span>
            <input
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-700">
              {messages.meals.description}
            </span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-700">
              {messages.meals.calories} ({messages.meals.caloriesUnit})
            </span>
            <input
              type="number"
              min={0}
              max={100000}
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {editingId ? 'Запази' : messages.meals.add}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
            >
              Отказ
            </button>
          </div>
        </form>
      )}

      {initialMeals.length === 0 ? (
        <p className="rounded-lg bg-white px-4 py-8 text-center text-slate-500 ring-1 ring-slate-200">
          {messages.meals.noMeals}
        </p>
      ) : (
        <ul className="space-y-2">
          {initialMeals.map((m) => (
            <li
              key={m.id}
              className="flex items-start justify-between rounded-lg bg-white p-4 ring-1 ring-slate-200"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                {m.description && (
                  <p className="mt-0.5 text-sm text-slate-600">{m.description}</p>
                )}
                {m.calories !== null && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {m.calories} {messages.meals.caloriesUnit}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(m)}
                  className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                >
                  {messages.meals.edit}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="rounded-lg px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  {messages.meals.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
