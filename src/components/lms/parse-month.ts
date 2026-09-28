/** "2026-10" → { year, month } (month 0-based); anything else → this month. */
export function parseMonth(v: string | undefined): { year: number; month: number } {
  const m = /^(\d{4})-(\d{2})$/.exec(v ?? '');
  const now = new Date();
  if (!m) return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  return { year: Number(m[1]), month: Math.min(11, Math.max(0, Number(m[2]) - 1)) };
}
