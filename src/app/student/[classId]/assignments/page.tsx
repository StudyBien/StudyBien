import Link from 'next/link';
import { requireStudentClass } from '@/lib/auth/student';
import { studentAssignments } from '@/lib/classroom/workspace';
import { PageHeader, Empty, KIND_ICON, KIND_LABEL } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentAssignments({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const me = await requireStudentClass(classId);
  const work = await studentAssignments(classId, me.rosterEntryId);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Assignments" />
      <div className="mt-6">
        {work.length === 0 ? <Empty>Your teacher hasn’t assigned anything yet.</Empty> : (
          <ul className="divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
            {work.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-primary-tint text-primary-deep">{KIND_ICON[w.resource_kind]}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/student/${classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{w.title}</Link>
                  <p className="text-sm text-ink-muted">{KIND_LABEL[w.resource_kind]} · {w.due_at ? <>Due <LocalTime iso={w.due_at} /></> : 'No due date'}</p>
                </div>
                <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${
                  !w.submitted ? 'bg-primary-tint text-primary-deep' : !w.graded ? 'bg-marigold-fill text-marigold-ink' : 'bg-teal/20 text-teal-ink'}`}>
                  {!w.submitted ? 'To do' : !w.graded ? 'Submitted' : `${w.score}${w.kind === 'practice' ? '%' : ` / ${w.points}`}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
