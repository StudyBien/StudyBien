import Link from 'next/link';
import { requireTeacher } from '@/lib/auth/require';
import { datedItems, teacherGradingTodo } from '@/lib/classroom/workspace';
import { PageHeader, Empty } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function Todo() {
  const teacherId = await requireTeacher();
  const now = new Date();
  const [grading, upcoming] = await Promise.all([
    teacherGradingTodo(teacherId),
    datedItems({ teacherId }, now, new Date(now.getTime() + 30 * 864e5)),
  ]);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="To Do" sub="Work waiting for you, and what’s due soon." />
      <section className="mt-6">
        <h2 className="text-lg font-bold">Needs grading</h2>
        <div className="mt-3">
          {grading.length === 0 ? <Empty>Everything is graded. ¡Excelente!</Empty> : (
            <ul className="divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
              {grading.map((g) => (
                <li key={g.assignment_id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <Link href={`/teacher/${g.class_id}/assignments/${g.assignment_id}`} className="font-bold">{g.title}</Link>
                    <p className="text-sm text-ink-muted">{g.class_name}</p>
                  </div>
                  <span className="rounded-full bg-marigold-fill px-3 py-1 text-sm font-bold text-marigold-ink">{g.waiting} to grade</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-bold">Due in the next 30 days</h2>
        <div className="mt-3">
          {upcoming.length === 0 ? <Empty>Nothing due. Assign something from any course’s Assignments tab.</Empty> : (
            <ul className="divide-y divide-rule rounded-[var(--radius-md)] border border-rule">
              {upcoming.map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <Link href={`/teacher/${u.class_id}/assignments/${u.id}${u.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">{u.title}</Link>
                    <p className="text-sm text-ink-muted">{u.class_name}</p>
                  </div>
                  <span className="text-sm"><LocalTime iso={u.due_at} /></span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
