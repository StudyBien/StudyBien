'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = { href: string; label: string; icon: string; exact?: boolean };

/**
 * The global navigation: a dark rail down the left on wide screens, a bar
 * along the top on phones — the shape Canvas users already know.
 */
export function AppNav({ items, footer }: { items: NavItem[]; footer?: React.ReactNode }) {
  const path = usePathname();
  const isActive = (i: NavItem) => (i.exact ? path === i.href : path === i.href || path.startsWith(`${i.href}/`));
  return (
    <nav className="no-print flex bg-primary-deep text-paper md:sticky md:top-0 md:h-screen md:w-[92px] md:flex-none md:flex-col">
      <Link href="/" className="hidden h-[72px] place-items-center text-2xl font-bold text-paper no-underline hover:text-paper md:grid"
            title="StudyBien home">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-paper text-lg text-primary-deep">SB</span>
      </Link>
      <ul className="flex flex-1 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href}
                  className={`flex min-w-[72px] flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-bold no-underline md:py-3.5 ${
                    isActive(i) ? 'bg-paper text-primary-deep hover:text-primary-deep' : 'text-paper hover:bg-primary hover:text-paper'
                  }`}>
              <span aria-hidden className="text-xl leading-none">{i.icon}</span>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
      {footer}
    </nav>
  );
}

/** A course's own menu, down the left of the course like Canvas. */
export function CourseNav({ base, items }: { base: string; items: Array<{ slug: string; label: string }> }) {
  const path = usePathname();
  return (
    <nav className="no-print border-b border-rule md:w-48 md:flex-none md:border-b-0 md:border-r">
      <ul className="flex overflow-x-auto px-2 md:block md:space-y-0.5 md:px-3 md:py-4">
        {items.map((i) => {
          const href = i.slug ? `${base}/${i.slug}` : base;
          const active = i.slug ? path.startsWith(href) : path === base;
          return (
            <li key={i.slug}>
              <Link href={href}
                    className={`block whitespace-nowrap border-b-2 px-3 py-2.5 text-[15px] no-underline md:rounded-md md:border-b-0 md:border-l-4 md:py-2 ${
                      active ? 'border-primary font-bold text-ink hover:text-ink' : 'border-transparent text-primary hover:bg-paper-sunk'
                    }`}>
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
