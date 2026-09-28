import Link from 'next/link';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { listAssignmentRows } from '@/lib/classroom/workspace';
import { PageHeader, Empty, ButtonLink, KIND_ICON, KIND_LABEL } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function Assignments({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  await requireOwnedClass(teacherId, classId);
  const rows = await listAssignmentRows(classId);
  const now = new Date();
  const groups = [
    { title: 'Upcoming', rows: rows.filter((r) => r.due_at && new Date(r.due_at) >= now) },
    { title: 'Undated', rows: rows.filter((r) => !r.due_at) },
    { title: 'Past', rows: rows.filter((r) => r.due_at && new Date(r.due_at) < now) },
  ];
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Assignments"
        action={<div className="flex flex-wrap gap-2">
          <ButtonLink href={`/teacher/${classId}/assign`} variant="ghost">+ Generated practice</ButtonLink>
          <ButtonLink href={`/teacher/${classId}/assignments/new`}>+ Assignment</ButtonLink>
        </div>} />
      {rows.length === 0 ? <div className="mt-6"><Empty>Nothing assigned yet. Assign a quiz, test, reading or worksheet from the library, or a written task of your own.</Empty></div> : (
        groups.filter((g) => g.rows.length).map((g) => (
          <section key={g.title} className="mt-6">
            <h2 className="rounded-t-[var(--radius-md)] border border-rule bg-paper-sunk/60 px-4 py-2 font-bold">{g.title} Assignments</h2>
            <ul className="divide-y divide-rule rounded-b-[var(--radius-md)] border-x border-b border-rule">
              {g.rows.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-primary-tint text-primary-deep">{KIND_ICON[a.resource_kind]}</span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/teacher/${classId}/assignments/${a.id}${a.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{a.title}</Link>
                    <p className="text-sm text-ink-muted">
                      {KIND_LABEL[a.resource_kind]} · {a.due_at ? <>Due <LocalTime iso={a.due_at} /></> : 'No due date'} · {a.kind === 'practice' ? 'scored %' : `${a.points} pts`}
                    </p>
                  </div>
                  <span className="text-sm text-ink-soft">{a.submitted}/{a.students} submitted</span>
                  {a.needs_grading > 0 && <span className="rounded-full bg-marigold-fill px-2.5 py-0.5 text-sm font-bold text-marigold-ink">{a.needs_grading} to grade</span>}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
