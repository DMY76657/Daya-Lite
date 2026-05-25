import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'За Daya Lite',
  description: 'Личен дневен meal planner — за проекта и технологиите',
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        ← Начало
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-emerald-700">За Daya Lite</h1>
      <p className="mt-4 text-slate-700">
        Daya Lite е личен дневен meal planner — помага ти да планираш ястията си за деня,
        да маркираш кое си изял и да следиш приема на калории.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-slate-900">Какво можеш да правиш</h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
        <li>Регистрираш се с имейл и парола</li>
        <li>Поддържаш каталог от собствени ястия с калории</li>
        <li>Планираш ястия за всеки ден</li>
        <li>Маркираш ястия като изядени или пропуснати</li>
        <li>Преглеждаш история на дневните планове</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold text-slate-900">Технологии</h2>
      <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
        <li>Next.js 15 App Router + React + TypeScript + Tailwind</li>
        <li>Expo + React Native (mobile)</li>
        <li>Neon serverless PostgreSQL + Drizzle ORM</li>
        <li>JWT auth с httpOnly cookie (web) и Bearer token (mobile)</li>
        <li>Deploy: Netlify (web + mobile web export)</li>
      </ul>

      <div className="mt-10 flex gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Вход
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-emerald-600 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
        >
          Регистрация
        </Link>
      </div>
    </main>
  );
}
