import Link from 'next/link';
import { requireStudent } from '@/lib/auth/student';
import { studentAssignments } from '@/lib/classroom/workspace';
import { courseColor, PageHeader, KIND_ICON } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentDashboard() {
  const classes = await requireStudent();
  const work = (await Promise.all(classes.map(async (c) =>
    (await studentAssignments(c.classId, c.rosterEntryId)).map((a) => ({ ...a, c }))))).flat();
  const todo = work.filter((w) => !w.submitted).sort((a, b) => (a.due_at ?? '9').localeCompare(b.due_at ?? '9'));

  return (
    <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_300px]">
      <div>
        <PageHeader title="Dashboard" sub={`¡Hola, ${classes[0].name}! 👋`} />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <Link key={c.classId} href={`/student/${c.classId}`}
                  className="group overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper text-ink no-underline shadow-sm hover:shadow-md hover:text-ink">
              <div className="h-28" style={{ background: courseColor(c.classId) }} />
              <div className="p-4">
                <p className="truncate font-bold group-hover:underline" style={{ color: courseColor(c.classId) }}>{c.className}</p>
                <p className="text-sm text-ink-soft">{c.courseName}</p>
                <p className="mt-2 text-sm text-ink-muted">{work.filter((w) => w.c.classId === c.classId && !w.submitted).length} to do</p>
              </div>
            </Link>
          ))}
          <Link href="/go" className="grid min-h-[190px] place-items-center rounded-[var(--radius-md)] border-2 border-dashed border-rule text-ink-muted no-underline hover:border-primary hover:text-primary">
            <span className="text-center"><span className="block text-3xl">+</span>Join another class</span>
          </Link>
        </div>
      </div>
      <aside>
        <h2 className="border-b border-rule pb-2 font-bold">To Do</h2>
        {todo.length === 0 ? <p className="mt-3 text-sm text-ink-muted">You’re all caught up. ¡Bien hecho!</p> : (
          <ul className="mt-3 space-y-3">
            {todo.slice(0, 8).map((w) => (
              <li key={w.id}>
                <Link href={`/student/${w.c.classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">
                  <span aria-hidden>{KIND_ICON[w.resource_kind]} </span>{w.title}
                </Link>
                <p className="text-sm text-ink-muted">{w.c.className}{w.due_at && <> · <LocalTime iso={w.due_at} /></>}</p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
