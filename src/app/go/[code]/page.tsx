import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findClassByCode, rosterForPicker } from '@/lib/classroom/student';
import { StudyBienLogo } from '@/components/logo';
import { JoinPanel } from './join-panel';

export const dynamic = 'force-dynamic';

export default async function JoinClass({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const klass = await findClassByCode(code);
  if (!klass) notFound();
  const roster = await rosterForPicker(klass.id);

  return (
    <div className="min-h-screen bg-[#B8E2F2]">
      <header className="px-6 py-4"><Link href="/" className="text-ink no-underline"><StudyBienLogo height={26} /></Link></header>
      <main className="mx-auto max-w-lg px-6 pb-16 pt-4">
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper p-7 shadow-sm">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">{klass.course_name}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{klass.name}</h1>
          <JoinPanel code={code.toUpperCase()} roster={roster} />
        </div>
      </main>
    </div>
  );
}
