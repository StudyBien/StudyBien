'use client';

import Link from 'next/link';
import { courseColor } from './ui';

export type CalItem = { id: string; title: string; due_at: string; class_id: string; class_name: string; href: string };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Month grid built in the browser, so items fall on the viewer's local day. */
export function MonthCalendar({ year, month, items, base }: { year: number; month: number; items: CalItem[]; base: string }) {
  const first = new Date(year, month, 1);
  const start = new Date(first); start.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const byDay = new Map<string, CalItem[]>();
  for (const it of items) {
    const d = new Date(it.due_at);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    byDay.set(k, [...(byDay.get(k) ?? []), it]);
  }
  const today = new Date();
  const prev = new Date(year, month - 1, 1); const next = new Date(year, month + 1, 1);
  const q = (d: Date) => `${base}?month=${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const classes = [...new Map(items.map((i) => [i.class_id, i.class_name])).entries()];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href={q(prev)} className="rounded-lg border border-rule px-3 py-1.5 font-bold no-underline" aria-label="Previous month">‹</Link>
        <h2 className="min-w-[180px] text-center text-xl font-bold" suppressHydrationWarning>
          {first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h2>
        <Link href={q(next)} className="rounded-lg border border-rule px-3 py-1.5 font-bold no-underline" aria-label="Next month">›</Link>
        <Link href={base} className="text-sm">Today</Link>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[700px] grid-cols-7 border-l border-t border-rule">
          {WEEKDAYS.map((w) => <div key={w} className="border-b border-r border-rule bg-paper-sunk/60 px-2 py-1.5 text-sm font-bold">{w}</div>)}
          {days.map((d) => {
            const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            const isToday = d.toDateString() === today.toDateString();
            const inMonth = d.getMonth() === month;
            return (
              <div key={k} className={`min-h-[104px] border-b border-r border-rule p-1.5 ${inMonth ? '' : 'bg-paper-sunk/30 text-ink-muted'}`}>
                <span className={`inline-grid h-6 min-w-6 place-items-center rounded-full px-1 text-sm ${isToday ? 'bg-primary font-bold text-paper' : ''}`} suppressHydrationWarning>
                  {d.getDate()}
                </span>
                <ul className="mt-1 space-y-1">
                  {(byDay.get(k) ?? []).map((it) => (
                    <li key={it.id}>
                      <Link href={it.href} title={`${it.title} · ${it.class_name}`}
                            className="block truncate rounded px-1.5 py-0.5 text-xs font-bold text-paper no-underline hover:text-paper hover:opacity-90"
                            style={{ background: courseColor(it.class_id) }}>
                        {it.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {classes.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-4 text-sm">
          {classes.map(([id, name]) => (
            <li key={id} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: courseColor(id) }} />{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
