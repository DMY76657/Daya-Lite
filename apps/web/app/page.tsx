import Link from 'next/link';
import type { Metadata } from 'next';

// Use a meta-refresh redirect rendered into the static HTML. This avoids
// any server-side redirect() calls in the production runtime that turned
// into a 500 on Netlify.
export const metadata: Metadata = {
  title: 'Daya Lite',
  other: {
    refresh: '0;url=/login',
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-emerald-700">Daya Lite</h1>
        <p className="mt-2 text-slate-600">Личен дневен meal planner</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Вход
        </Link>
      </div>
    </main>
  );
}
