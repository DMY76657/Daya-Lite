'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { messages } from '@/lib/messages';

interface ProfileClientProps {
  user: { email: string; name: string; role: 'user' | 'admin'; createdAt: Date };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirmDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/users/me', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? messages.errors.generic);
      return;
    }

    router.push('/login');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{messages.profile.title}</h2>

      <dl className="space-y-3 rounded-lg bg-white p-4 ring-1 ring-slate-200">
        <div className="flex justify-between">
          <dt className="text-sm text-slate-600">{messages.auth.name}</dt>
          <dd className="text-sm font-medium">{user.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-slate-600">{messages.auth.email}</dt>
          <dd className="text-sm font-medium">{user.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-slate-600">Роля</dt>
          <dd className="text-sm font-medium">
            {user.role === 'admin' ? 'Администратор' : 'Потребител'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm text-slate-600">Регистриран на</dt>
          <dd className="text-sm font-medium">
            {new Date(user.createdAt).toLocaleDateString('bg-BG')}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
        <h3 className="font-medium text-red-800">Опасна зона</h3>
        <p className="mt-1 text-sm text-red-700">{messages.profile.deleteWarning}</p>
        <button
          onClick={() => setShowDelete(true)}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {messages.profile.deleteAccount}
        </button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">{messages.profile.deleteAccount}</h3>
            <p className="mt-2 text-sm text-slate-700">{messages.profile.deleteWarning}</p>

            <form onSubmit={confirmDelete} className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  {messages.profile.deleteConfirm}
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? '...' : 'Изтрий завинаги'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete(false);
                    setPassword('');
                    setError(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Отказ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
