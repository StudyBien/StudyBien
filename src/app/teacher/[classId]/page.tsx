import Link from 'next/link';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { listAnnouncements, listAssignmentRows } from '@/lib/classroom/workspace';
import { courseColor, ButtonLink, Empty, KIND_ICON, KIND_LABEL } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';
import { CopyButton } from './copy-button';

export default async function CourseHome({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  const klass = await requireOwnedClass(teacherId, classId);
  const [announcements, assignments] = await Promise.all([listAnnouncements(classId, 3), listAssignmentRows(classId)]);
  const upcoming = assignments.filter((a) => a.due_at && new Date(a.due_at) >= new Date()).slice(0, 5);

  return (
    <div className="grid gap-8 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_280px]">
      <div>
        <section className="rounded-[var(--radius-lg)] p-6 text-paper" style={{ background: courseColor(klass.id) }}>
          <p className="font-mono text-xs uppercase tracking-[0.1em] opacity-85">{klass.course_name}</p>
          <h1 className="mt-1 text-3xl font-bold">{klass.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-[var(--radius-md)] bg-black/15 p-4">
            <div>
              <p className="text-sm opacity-90">Students click <strong>Join classroom as a student</strong> on StudyBien and enter:</p>
              <p className="mt-1 font-mono text-4xl font-bold tracking-[0.25em]">{klass.class_code}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={klass.class_code} label="Copy code" />
              <CopyButton text={`/go/${klass.class_code}`} label="Copy join link" />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent announcements</h2>
            <Link href={`/teacher/${classId}/announcements`} className="text-sm">All announcements →</Link>
          </div>
          <div className="mt-3 space-y-3">
            {announcements.length === 0
              ? <Empty>No announcements yet. <Link href={`/teacher/${classId}/announcements`}>Post the first one</Link>.</Empty>
              : announcements.map((a) => (
                <article key={a.id} className="rounded-[var(--radius-md)] border border-rule p-4">
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="text-xs text-ink-muted"><LocalTime iso={a.created_at} /></p>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-ink-soft">{a.body}</p>
                </article>
              ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="flex flex-col gap-2">
          <ButtonLink href={`/teacher/${classId}/assignments/new`}>+ New assignment</ButtonLink>
          <ButtonLink href={`/teacher/${classId}/announcements`} variant="ghost">+ New announcement</ButtonLink>
          <ButtonLink href={`/teacher/${classId}/people`} variant="ghost">Manage people</ButtonLink>
        </div>
        <section>
          <h2 className="border-b border-rule pb-2 font-bold">Coming Up</h2>
          {upcoming.length === 0 ? <p className="mt-3 text-sm text-ink-muted">Nothing due.</p> : (
            <ul className="mt-3 space-y-3">
              {upcoming.map((a) => (
                <li key={a.id}>
                  <Link href={`/teacher/${classId}/assignments/${a.id}${a.kind === 'practice' ? '?kind=practice' : ''}`} className="font-bold">
                    <span aria-hidden>{KIND_ICON[a.resource_kind]} </span>{a.title}
                  </Link>
                  <p className="text-sm text-ink-muted">{KIND_LABEL[a.resource_kind]} · <LocalTime iso={a.due_at} /></p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
