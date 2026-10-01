'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const MENU = [
  { href: '/', label: 'Home', en: 'Inicio', icon: '⌂' },
  { href: '/resources/worksheets', label: 'Worksheets', en: 'with answer keys', icon: '▤' },
  { href: '/resources/quizzes', label: 'Quizzes', en: 'auto-graded', icon: '✓' },
  { href: '/resources/tests', label: 'Tests', en: 'unit & final exams', icon: '◈' },
  { href: '/resources/reading', label: 'Reading Comprehension', en: 'reading + writing', icon: '❡' },
  { href: '/games', label: 'Games', en: 'hangman · word search', icon: '★' },
];

const MENU_BG = '#F5FBFF';

/**
 * The site menu. A slim tab with a ☰ button sits on the left; clicking it
 * slides the full menu open over the page.
 */
export function MenuButton() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="no-print relative">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu" aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-primary-tint">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
      </button>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />}
      {open && (
        <div id="site-menu" className="absolute left-0 top-12 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-[var(--radius-lg)] border border-rule p-3 shadow-xl"
             style={{ background: MENU_BG }}>
          <p className="px-3 pb-2 pt-1 font-bold">Menu</p>
          <ul className="space-y-1">
            {MENU.map((m) => (
              <li key={m.href}>
                <Link href={m.href}
                      className={`flex items-start gap-3 rounded-lg px-3 py-2.5 no-underline ${
                        active(m.href) ? 'bg-primary text-paper hover:text-paper' : 'text-ink hover:bg-primary-tint hover:text-ink'
                      }`}>
                  <span aria-hidden className="w-5 text-center text-lg leading-6">{m.icon}</span>
                  <span>
                    <span className="block font-bold leading-6">{m.label}</span>
                    <span className={`block text-xs ${active(m.href) ? 'text-paper/85' : 'text-ink-muted'}`}>{m.en}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-lg border border-rule bg-paper p-3 text-sm">
            <p className="font-bold">¿Eres profesor?</p>
            <p className="mt-1 text-ink-soft">Create a free classroom and unlock every answer key.</p>
            <Link href="/login?mode=up" className="mt-2 inline-block font-bold">Create a classroom →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
