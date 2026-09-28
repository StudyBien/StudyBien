import Link from 'next/link';
import { requireStudent } from '@/lib/auth/student';
import { studentAssignments } from '@/lib/classroom/workspace';
import { PageHeader, Empty, KIND_ICON, KIND_LABEL } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentTodo() {
  const classes = await requireStudent();
  const work = (await Promise.all(classes.map(async (c) =>
    (await studentAssignments(c.classId, c.rosterEntryId)).map((a) => ({ ...a, c }))))).flat();
  const todo = work.filter((w) => !w.submitted).sort((a, b) => (a.due_at ?? '9').localeCompare(b.due_at ?? '9'));
  const recent = work.filter((w) => w.submitted && w.graded).slice(0, 10);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="To Do" />
      <div className="mt-6">
        {todo.length === 0 ? <Empty>Nothing to do. ¡Excelente!</Empty> : (
          <ul className="divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
            {todo.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center gap-3 p-4">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-lg bg-primary-tint text-primary-deep">{KIND_ICON[w.resource_kind]}</span>
                <div className="flex-1">
                  <Link href={`/student/${w.c.classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{w.title}</Link>
                  <p className="text-sm text-ink-muted">{w.c.className} · {KIND_LABEL[w.resource_kind]}</p>
                </div>
                <span className="text-sm">{w.due_at ? <>Due <LocalTime iso={w.due_at} /></> : 'No due date'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">Recently graded</h2>
          <ul className="mt-3 space-y-2">
            {recent.map((w) => (
              <li key={w.id} className="flex justify-between gap-3 rounded-lg border border-rule px-4 py-2">
                <Link href={`/student/${w.c.classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`}>{w.title}</Link>
                <span className="font-bold">{w.score}{w.kind === 'practice' ? '%' : ` / ${w.points}`}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
