import Link from 'next/link';
import { requireTeacher } from '@/lib/auth/require';
import { listClasses } from '@/lib/classroom/teacher';
import { datedItems, teacherGradingTodo } from '@/lib/classroom/workspace';
import { query } from '@/lib/db/client';
import { courseColor, PageHeader } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';
import { NewCourseForm } from './new-course-form';

export default async function Dashboard() {
  const teacherId = await requireTeacher();
  const now = new Date();
  const [classes, grading, upcoming, me] = await Promise.all([
    listClasses(teacherId),
    teacherGradingTodo(teacherId),
    datedItems({ teacherId }, now, new Date(now.getTime() + 14 * 864e5)),
    query<{ display_name: string | null }>(`SELECT display_name FROM account WHERE id = $1`, [teacherId]),
  ]);

  return (
    <div className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_300px]">
      <div>
        <PageHeader title="Dashboard" sub={`¡Bienvenidos${me[0]?.display_name ? `, ${me[0].display_name}` : ''}!`} />

        {classes.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-rule p-6">
            <h2 className="text-xl font-bold">Create your first course</h2>
            <p className="mt-1 text-ink-soft">
              Give it a name and a level. You’ll get a join code to send your students.
            </p>
            <div className="mt-5"><NewCourseForm /></div>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {classes.map((c) => (
                <Link key={c.id} href={`/teacher/${c.id}`}
                      className="group overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper text-ink no-underline shadow-sm hover:shadow-md hover:text-ink">
                  <div className="h-28 p-4 text-paper" style={{ background: courseColor(c.id) }}>
                    <p className="font-mono text-xs uppercase tracking-[0.08em] opacity-85">Code {c.class_code}</p>
                  </div>
                  <div className="p-4">
                    <p className="truncate font-bold group-hover:underline" style={{ color: courseColor(c.id) }}>{c.name}</p>
                    <p className="text-sm text-ink-soft">{c.course_name}</p>
                    <p className="mt-3 text-sm text-ink-muted">{c.student_count} student{c.student_count === '1' ? '' : 's'}</p>
                  </div>
                </Link>
              ))}
            </div>
            <details className="mt-8 rounded-[var(--radius-md)] border border-rule p-4">
              <summary className="cursor-pointer font-bold text-primary">+ Create another course</summary>
              <div className="mt-4"><NewCourseForm /></div>
            </details>
          </>
        )}
      </div>

      <aside className="space-y-6">
        <section>
          <h2 className="border-b border-rule pb-2 font-bold">To Do</h2>
          {grading.length === 0
            ? <p className="mt-3 text-sm text-ink-muted">Nothing to grade. ¡Qué bien!</p>
            : (
              <ul className="mt-3 space-y-3">
                {grading.slice(0, 6).map((g) => (
                  <li key={g.assignment_id}>
                    <Link href={`/teacher/${g.class_id}/assignments/${g.assignment_id}`} className="font-bold">Grade {g.title}</Link>
                    <p className="text-sm text-ink-muted">{g.class_name} · {g.waiting} to grade</p>
                  </li>
                ))}
              </ul>
            )}
        </section>
        <section>
          <h2 className="border-b border-rule pb-2 font-bold">Coming Up</h2>
          {upcoming.length === 0
            ? <p className="mt-3 text-sm text-ink-muted">Nothing due in the next two weeks.</p>
            : (
              <ul className="mt-3 space-y-3">
                {upcoming.slice(0, 8).map((u) => (
                  <li key={u.id}>
                    <Link href={`/teacher/${u.class_id}/assignments/${u.id}${u.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{u.title}</Link>
                    <p className="text-sm text-ink-muted">{u.class_name} · <LocalTime iso={u.due_at} /></p>
                  </li>
                ))}
              </ul>
            )}
          <Link href="/teacher/calendar" className="mt-3 inline-block text-sm">View calendar →</Link>
        </section>
      </aside>
    </div>
  );
}
