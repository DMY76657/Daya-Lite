'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { messages } from '@/lib/messages';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? messages.errors.generic);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError(messages.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{messages.auth.name}</span>
        <input
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">{messages.auth.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">{messages.auth.password}</span>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-20 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-sm text-slate-500 hover:text-slate-700"
          >
            {showPassword ? 'Скрий' : 'Покажи'}
          </button>
        </div>
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? '...' : messages.auth.registerBtn}
      </button>

      <p className="text-center text-sm text-slate-600">
        {messages.auth.hasAccount}{' '}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          {messages.auth.login}
        </Link>
      </p>
    </form>
  );
}
