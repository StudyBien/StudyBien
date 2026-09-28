'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU = [
  { href: '/', label: 'Inicio', en: 'Home', icon: '⌂' },
  { href: '/resources/worksheets', label: 'Worksheets', en: 'with answer keys', icon: '▤' },
  { href: '/resources/quizzes', label: 'Quizzes', en: 'auto-graded', icon: '✓' },
  { href: '/resources/tests', label: 'Tests', en: 'unit & final exams', icon: '◈' },
  { href: '/resources/reading', label: 'Reading Comprehension', en: 'reading + writing', icon: '❡' },
  { href: '/games', label: 'Games', en: 'hangman · word search', icon: '★' },
];

/** The library menu bar. Collapses to a toggle on narrow screens. */
export function PublicSidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  return (
    <aside className="no-print border-b border-rule bg-paper-sunk/40 md:sticky md:top-[61px] md:h-[calc(100vh-61px)] md:w-64 md:flex-none md:overflow-y-auto md:border-b-0 md:border-r">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-bold md:hidden"
        aria-expanded={open}
      >
        <span>☰ Menú</span><span aria-hidden>{open ? '▴' : '▾'}</span>
      </button>
      <nav className={`${open ? 'block' : 'hidden'} px-3 pb-4 md:block md:pt-5`}>
        <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">Biblioteca</p>
        <ul className="space-y-1">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 no-underline ${
                  active(m.href)
                    ? 'bg-primary text-paper hover:text-paper'
                    : 'text-ink hover:bg-primary-tint hover:text-ink'
                }`}
              >
                <span aria-hidden className="w-5 text-center text-lg leading-6">{m.icon}</span>
                <span>
                  <span className="block font-bold leading-6">{m.label}</span>
                  <span className={`block text-xs ${active(m.href) ? 'text-paper/85' : 'text-ink-muted'}`}>{m.en}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-lg border border-rule bg-paper p-3 text-sm">
          <p className="font-bold">¿Eres profesor?</p>
          <p className="mt-1 text-ink-soft">Create a free classroom and unlock every answer key.</p>
          <Link href="/login?mode=up" className="mt-2 inline-block font-bold">Create a classroom →</Link>
        </div>
      </nav>
    </aside>
  );
}
