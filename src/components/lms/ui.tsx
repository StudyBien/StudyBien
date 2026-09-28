import Link from 'next/link';

const PALETTE = [
  'oklch(0.51 0.175 252)', 'oklch(0.52 0.12 182)', 'oklch(0.555 0.175 44)', 'oklch(0.50 0.15 320)',
  'oklch(0.55 0.14 145)', 'oklch(0.45 0.12 280)', 'oklch(0.58 0.15 20)', 'oklch(0.50 0.10 220)',
];

/** A stable color per course, like Canvas's dashboard cards. */
export function courseColor(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function PageHeader({ title, sub, action }: { title: string; sub?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-rule pb-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-ink-soft">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[var(--radius-md)] border border-dashed border-rule p-6 text-center text-ink-muted">{children}</p>;
}

export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'ghost' }) {
  return (
    <Link href={href}
          className={variant === 'primary'
            ? 'rounded-lg bg-primary px-4 py-2 font-bold text-paper no-underline hover:bg-primary-hover hover:text-paper'
            : 'rounded-lg border border-rule px-4 py-2 font-bold text-ink no-underline hover:border-primary hover:text-ink'}>
      {children}
    </Link>
  );
}

export const KIND_LABEL: Record<string, string> = {
  quiz: 'Quiz', test: 'Test', reading: 'Reading', worksheet: 'Worksheet', task: 'Written task', practice: 'Generated practice',
};

export const KIND_ICON: Record<string, string> = {
  quiz: '✓', test: '◈', reading: '❡', worksheet: '▤', task: '✎', practice: '⟳',
};

export const inputCls = 'mt-1 w-full rounded-lg border border-rule px-3 py-2 focus:border-primary focus:outline-none';
export const labelCls = 'block text-sm font-bold';
