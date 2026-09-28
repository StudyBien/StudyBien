import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { listAnnouncements } from '@/lib/classroom/workspace';
import { PageHeader, Empty } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';
import { deleteAnnouncementAction } from '../../workspace-actions';
import { AnnounceForm } from './announce-form';

export default async function Announcements({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  await requireOwnedClass(teacherId, classId);
  const list = await listAnnouncements(classId);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Announcements" sub="Everyone in the course sees these on their course home." />
      <div className="mt-6 max-w-3xl space-y-6">
        <AnnounceForm classId={classId} />
        {list.length === 0 ? <Empty>No announcements yet.</Empty> : list.map((a) => (
          <article key={a.id} className="rounded-[var(--radius-md)] border border-rule p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{a.title}</h2>
                <p className="text-sm text-ink-muted">{a.author} · <LocalTime iso={a.created_at} /></p>
              </div>
              <form action={deleteAnnouncementAction}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="classId" value={classId} />
                <button className="text-sm text-ink-muted hover:text-tangerine">Delete</button>
              </form>
            </div>
            <p className="mt-3 whitespace-pre-line">{a.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
