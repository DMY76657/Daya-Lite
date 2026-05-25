import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daya Lite — твоят дневен meal planner',
  description:
    'Планирай ястията си, следи калориите и изграждай по-добри хранителни навици. Безплатно. Web + мобилно приложение.',
};

const features = [
  {
    title: 'Личен каталог',
    text: 'Добавяй и подреждай собствените си ястия с име, описание и калории.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    title: 'Дневен план',
    text: 'Подреждай ястията си по час за всеки ден и виждай днешния си план веднага.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Маркиране в реално време',
    text: 'Отбелязвай изяденото и виж историята си за последните 30 дни.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: 'Статистика и тенденции',
    text: 'Седмични и месечни обобщения с графика по дни — видими цели.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 4 4 5-7" />
      </svg>
    ),
  },
  {
    title: 'Web + мобилно',
    text: 'Един акаунт работи и в браузъра, и в мобилното приложение.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7 21h10l-1.121-.621A3 3 0 0115 18.257V17.25m6-12V15a2 2 0 01-2 2H5a2 2 0 01-2-2V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
      </svg>
    ),
  },
  {
    title: 'Бързо и сигурно',
    text: 'JWT auth, bcrypt хеширане, индексирани заявки — work-on-scale-ready.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const stats = [
  { value: '10', label: 'Web екрана' },
  { value: '5', label: 'Mobile екрана' },
  { value: '14', label: 'API endpoint-а' },
  { value: '10K+', label: 'Записа в DB' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <header
        className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur"
        aria-label="Главна навигация"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2" aria-label="Daya Lite — начало">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8 6 6 9 6 13a6 6 0 1012 0c0-4-2-7-6-11zm0 18a4 4 0 01-4-4c0-2 1-4 4-7 3 3 4 5 4 7a4 4 0 01-4 4z" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight">Daya Lite</span>
          </Link>
          <nav aria-label="Връзки за вход" className="flex items-center gap-1 text-sm sm:gap-3">
            <Link
              href="/about"
              className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:inline-block"
              aria-label="Научи повече за Daya Lite"
            >
              За проекта
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              aria-label="Вход за съществуващи потребители"
            >
              Вход
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-slate-800"
              aria-label="Създай нов акаунт"
            >
              Регистрация →
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-slate-200/60"
        aria-labelledby="hero-heading"
      >
        {/* gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
        </div>
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:36px_36px]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            Безплатно през цялото време
          </span>
          <h1
            id="hero-heading"
            className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-6xl"
          >
            Планирай ястията си.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Хапвай по-добре.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-slate-600">
            Daya Lite е лек, бърз дневен meal planner — без излишности.
            Подреди какво ще ядеш, маркирай кое си изял, виж тенденциите си.
          </p>
          <div
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
            role="group"
            aria-label="Основни действия"
          >
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 px-7 py-3.5 font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
              aria-label="Започни безплатно — регистрирай нов акаунт"
            >
              Започни безплатно
              <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              aria-label="Влез в съществуващ акаунт"
            >
              Имам акаунт
            </Link>
          </div>
          {/* Stats strip */}
          <dl
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
            aria-label="Ключови числа за проекта"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-5 backdrop-blur"
              >
                <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {s.label}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-slate-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="relative bg-slate-50 px-4 py-24"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Какво получаваш
            </span>
            <h2
              id="features-heading"
              className="mt-3 text-4xl font-semibold tracking-tight text-slate-900"
            >
              Всичко необходимо. <span className="text-slate-400">Нищо излишно.</span>
            </h2>
          </div>

          <ul
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Списък с функционалности"
          >
            {features.map((f) => (
              <li
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 ring-1 ring-emerald-200/60">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CROSS-PLATFORM SHOWCASE */}
      <section
        className="relative overflow-hidden bg-slate-950 px-4 py-24 text-white"
        aria-labelledby="platforms-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-40"
          aria-hidden="true"
        >
          <div className="absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-teal-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Кросплатформено
          </span>
          <h2
            id="platforms-heading"
            className="mt-3 text-4xl font-semibold tracking-tight"
          >
            Един акаунт. <span className="text-emerald-400">Всеки екран.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-slate-300">
            Web версията е за дълбоко планиране и админ дейности.
            Мобилната — за бързо маркиране, докато си в движение.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <Link
              href="/login"
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/10"
              aria-label="Отвори web приложението"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path strokeLinecap="round" d="M8 21h8M12 17v4" />
                  </svg>
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  Web →
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">Web приложение</h3>
              <p className="mt-1.5 text-sm text-slate-400">
                10 екрана, paging за 10 000+ записа, админ панел, статистика.
              </p>
            </Link>
            <a
              href="https://daya-lite-mobile.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/10"
              aria-label="Отвори мобилното приложение в нов прозорец"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-500/20 text-teal-300">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <path strokeLinecap="round" d="M12 18h.01" />
                  </svg>
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-teal-400">
                  Mobile →
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold">Мобилно приложение</h3>
              <p className="mt-1.5 text-sm text-slate-400">
                Експо Web build — същите данни, същата DB, оптимизиран touch flow.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="px-4 py-24"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-8 py-14 text-center shadow-sm">
          <h2
            id="cta-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
          >
            Готов да започнеш?
          </h2>
          <p className="mt-3 text-slate-600">
            Регистрацията отнема под минута. Безплатно — без кредитна карта.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 font-medium text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.98]"
            aria-label="Регистрирай нов акаунт"
          >
            Създай акаунт безплатно
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t border-slate-200 bg-white"
        aria-label="Долна навигация"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row">
          <span>© 2026 Daya Lite — капстоун проект, SoftUni</span>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-slate-900">
              За проекта
            </Link>
            <a
              href="https://github.com/DMY76657/Daya-Lite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900"
              aria-label="Отвори GitHub репозиторито в нов прозорец"
            >
              GitHub
            </a>
            <Link href="/api/docs" className="hover:text-slate-900">
              API docs
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
