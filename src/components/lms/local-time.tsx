'use client';

/**
 * Dates render in the viewer's own time zone. The server runs in UTC, so a
 * server-formatted "due 11:59 PM" would be wrong for everyone.
 */
export function LocalTime({ iso, mode = 'datetime' }: { iso: string | null; mode?: 'datetime' | 'date' | 'time' }) {
  if (!iso) return <span>No due date</span>;
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions =
    mode === 'date' ? { weekday: 'short', month: 'short', day: 'numeric' }
    : mode === 'time' ? { hour: 'numeric', minute: '2-digit' }
    : { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  return <time dateTime={iso} suppressHydrationWarning>{d.toLocaleString(undefined, opts)}</time>;
}
