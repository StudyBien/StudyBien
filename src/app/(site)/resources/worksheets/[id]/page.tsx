import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { worksheetById } from '@/lib/content/catalog';
import { readingById } from '@/lib/content/readings';
import { levelById } from '@/lib/content/levels';
import { currentAccountId } from '@/lib/auth/session';
import { WorksheetView } from '@/components/worksheet-view';
import { PrintButton } from '@/components/print-button';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ws = worksheetById((await params).id);
  return ws ? { title: `${ws.title} — ${levelById(ws.level)?.name} worksheet` } : {};
}

export default async function WorksheetPage({ params, searchParams }: Props) {
  const { id } = await params;
  const ws = worksheetById(id);
  if (!ws) notFound();
  const wantsKey = (await searchParams).tab === 'key';
  const teacher = wantsKey ? await currentAccountId() : null;
  const reading = ws.readingId ? readingById(ws.readingId) : undefined;
  const here = `/resources/worksheets/${ws.id}`;

  return (
    <>
      <div className="no-print">
        <Link href={`/resources/worksheets?level=${ws.level}`} className="text-sm">← {levelById(ws.level)?.name} worksheets</Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" className="flex gap-1 rounded-lg bg-paper-sunk p-1">
            <Link href={here} role="tab" aria-selected={!wantsKey}
                  className={`rounded-md px-4 py-2 font-bold no-underline ${!wantsKey ? 'bg-paper text-ink shadow-sm' : 'text-ink-soft'}`}>
              Worksheet
            </Link>
            <Link href={`${here}?tab=key`} role="tab" aria-selected={wantsKey}
                  className={`rounded-md px-4 py-2 font-bold no-underline ${wantsKey ? 'bg-paper text-ink shadow-sm' : 'text-ink-soft'}`}>
              Answer key
            </Link>
          </div>
          {(!wantsKey || teacher) && <PrintButton label={wantsKey ? 'Print answer key' : 'Print worksheet'} />}
        </div>
      </div>

      <div className="mt-6">
        {wantsKey && !teacher ? (
          <div className="rounded-[var(--radius-lg)] border border-rule p-8 text-center">
            <p className="text-lg font-bold">Answer keys are for teachers</p>
            <p className="mt-2 text-ink-soft">They’re free: sign in or create a teacher account to see this one.</p>
            <Link href={`/login?next=${encodeURIComponent(`${here}?tab=key`)}`}
                  className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-paper no-underline hover:bg-primary-hover hover:text-paper">
              Sign up / Sign in
            </Link>
          </div>
        ) : (
          <WorksheetView ws={ws} reading={reading} showKey={wantsKey} />
        )}
      </div>
    </>
  );
}
