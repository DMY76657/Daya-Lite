'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { messages } from '@/lib/messages';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

interface AdminClientProps {
  users: AdminUser[];
  currentUserId: string;
}

export function AdminClient({ users, currentUserId }: AdminClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Сигурен ли си, че искаш да изтриеш ${name}? Това действие е необратимо.`))
      return;

    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? messages.errors.generic);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{messages.admin.title}</h2>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-slate-700">
                {messages.auth.name}
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-700">
                {messages.auth.email}
              </th>
              <th className="px-4 py-2 text-left font-medium text-slate-700">Роля</th>
              <th className="px-4 py-2 text-left font-medium text-slate-700">Създаден</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className={u.id === currentUserId ? 'bg-emerald-50' : ''}>
                <td className="px-4 py-2 font-medium">
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="ml-2 text-xs text-emerald-700">(ти)</span>
                  )}
                </td>
                <td className="px-4 py-2 text-slate-600">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      u.role === 'admin'
                        ? 'rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700'
                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700'
                    }
                  >
                    {u.role === 'admin' ? 'админ' : 'потребител'}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600">
                  {new Date(u.createdAt).toLocaleDateString('bg-BG')}
                </td>
                <td className="px-4 py-2 text-right">
                  {u.id !== currentUserId && (
                    <button
                      onClick={() => deleteUser(u.id, u.name)}
                      disabled={isPending}
                      className="rounded-lg px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {messages.admin.deleteUser}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Общо потребители: {users.length}
      </p>
    </div>
  );
}
