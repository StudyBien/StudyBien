import Link from 'next/link';
import { requireStudentClass } from '@/lib/auth/student';
import { listAnnouncements, studentAssignments } from '@/lib/classroom/workspace';
import { courseColor, Empty, KIND_ICON } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentCourseHome({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const me = await requireStudentClass(classId);
  const [ann, work] = await Promise.all([listAnnouncements(classId, 3), studentAssignments(classId, me.rosterEntryId)]);
  const todo = work.filter((w) => !w.submitted);
  return (
    <div className="grid gap-8 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_280px]">
      <div>
        <section className="rounded-[var(--radius-lg)] p-6 text-paper" style={{ background: courseColor(classId) }}>
          <p className="font-mono text-xs uppercase tracking-[0.1em] opacity-85">{me.courseName}</p>
          <h1 className="mt-1 text-3xl font-bold">{me.className}</h1>
          <p className="mt-2 opacity-90">¡Bienvenido/a, {me.name}!</p>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-bold">Announcements</h2>
          <div className="mt-3 space-y-3">
            {ann.length === 0 ? <Empty>No announcements yet.</Empty> : ann.map((a) => (
              <article key={a.id} className="rounded-[var(--radius-md)] border border-rule p-4">
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-xs text-ink-muted">{a.author} · <LocalTime iso={a.created_at} /></p>
                <p className="mt-2 whitespace-pre-line text-ink-soft">{a.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <aside>
        <h2 className="border-b border-rule pb-2 font-bold">To Do</h2>
        {todo.length === 0 ? <p className="mt-3 text-sm text-ink-muted">All caught up!</p> : (
          <ul className="mt-3 space-y-3">
            {todo.map((w) => (
              <li key={w.id}>
                <Link href={`/student/${classId}/assignments/${w.id}${w.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">
                  <span aria-hidden>{KIND_ICON[w.resource_kind]} </span>{w.title}
                </Link>
                <p className="text-sm text-ink-muted">{w.due_at ? <>Due <LocalTime iso={w.due_at} /></> : 'No due date'}</p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
