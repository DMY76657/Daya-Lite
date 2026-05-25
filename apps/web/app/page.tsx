import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daya Lite — личен дневен meal planner',
  description:
    'Планирай ястията си за деня, маркирай кое си изял и следи приема на калории. Безплатно. С web и мобилно приложение.',
};

const features = [
  {
    icon: '📋',
    title: 'Личен каталог от ястия',
    text: 'Добавяй ястия с име, описание и калории. Редактирай и изтривай по всяко време.',
  },
  {
    icon: '📅',
    title: 'Дневен план',
    text: 'Планирай ястията за всеки ден с конкретен час. Виж днешния план в едно изглед.',
  },
  {
    icon: '✅',
    title: 'Маркиране на изядени',
    text: 'Отбелязвай изяденото и проследявай прогреса си. История за последните 30 дни.',
  },
  {
    icon: '📊',
    title: 'Статистика',
    text: 'Седмични и месечни обобщения за калории. Графика по дни.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header
        className="border-b border-slate-200 bg-white"
        aria-label="Главна навигация"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-xl font-semibold text-emerald-700">Daya Lite</span>
          <nav aria-label="Връзки за вход" className="flex items-center gap-3 text-sm">
            <Link
              href="/about"
              className="text-slate-600 hover:text-slate-900"
              aria-label="Научи повече за Daya Lite"
            >
              За проекта
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-emerald-600 px-4 py-2 font-medium text-emerald-700 hover:bg-emerald-50"
              aria-label="Вход за съществуващи потребители"
            >
              Вход
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
              aria-label="Създай нов акаунт"
            >
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      <section
        className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24"
        aria-labelledby="hero-heading"
      >
        <h1
          id="hero-heading"
          className="text-4xl font-semibold text-slate-900 sm:text-5xl"
        >
          Личен дневен <span className="text-emerald-700">meal planner</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Планирай какво ще ядеш днес, маркирай кое си изял и следи
          приема на калории — без излишни функции.
        </p>
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          role="group"
          aria-label="Основни действия"
        >
          <Link
            href="/register"
            className="rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
            aria-label="Започни безплатно — регистрирай нов акаунт"
          >
            Започни безплатно
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-100"
            aria-label="Влез в съществуващ акаунт"
          >
            Имам акаунт
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Демо акаунт:{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
            user@daya.bg
          </code>{' '}
          /{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
            demo123
          </code>
        </p>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 pb-16"
        aria-labelledby="features-heading"
      >
        <h2
          id="features-heading"
          className="text-center text-2xl font-semibold text-slate-900"
        >
          Какво можеш да правиш
        </h2>
        <ul
          className="mt-8 grid gap-4 sm:grid-cols-2"
          aria-label="Списък с функционалности"
        >
          {features.map((f) => (
            <li
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div
                className="text-3xl"
                aria-hidden="true"
              >
                {f.icon}
              </div>
              <h3 className="mt-2 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mx-auto max-w-5xl px-4 pb-16"
        aria-labelledby="platforms-heading"
      >
        <h2
          id="platforms-heading"
          className="text-center text-2xl font-semibold text-slate-900"
        >
          Web и мобилно приложение
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Един акаунт работи и в браузъра, и в мобилното приложение.
          Данните се синхронизират в реално време.
        </p>
        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm"
          aria-label="Връзки към приложенията"
        >
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            aria-label="Отвори web приложението"
          >
            🌐 Web приложение
          </Link>
          <a
            href="https://daya-lite-mobile.netlify.app"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            aria-label="Отвори мобилното приложение (Expo Web build)"
            target="_blank"
            rel="noopener noreferrer"
          >
            📱 Мобилно приложение
          </a>
        </div>
      </section>

      <footer
        className="border-t border-slate-200 bg-white"
        aria-label="Долна навигация"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 Daya Lite — капстоун проект, SoftUni</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-900">
              За проекта
            </Link>
            <a
              href="https://github.com/DMY76657/Daya-Lite"
              className="hover:text-slate-900"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Отвори GitHub репозиторито в нов прозорец"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
