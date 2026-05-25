'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { messages } from '@/lib/messages';

interface NavProps {
  userName: string;
  role: 'user' | 'admin';
}

export function Nav({ userName, role }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const links: Array<{ href: string; label: string }> = [
    { href: '/dashboard', label: messages.nav.dashboard },
    { href: '/meals', label: messages.nav.meals },
    { href: '/plans', label: messages.nav.plans },
    { href: '/stats', label: messages.nav.stats },
    { href: '/profile', label: messages.nav.profile },
  ];
  if (role === 'admin') links.push({ href: '/admin', label: messages.nav.admin });

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold text-emerald-700">
            Daya Lite
          </Link>
          <ul className="flex gap-4 text-sm">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + '/');
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={
                      active
                        ? 'font-medium text-emerald-700'
                        : 'text-slate-600 hover:text-slate-900'
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">{userName}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-100"
          >
            {messages.auth.logout}
          </button>
        </div>
      </div>
    </nav>
  );
}
