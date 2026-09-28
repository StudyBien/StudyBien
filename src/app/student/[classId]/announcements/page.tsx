import { requireStudentClass } from '@/lib/auth/student';
import { listAnnouncements } from '@/lib/classroom/workspace';
import { PageHeader, Empty } from '@/components/lms/ui';
import { LocalTime } from '@/components/lms/local-time';

export default async function StudentAnnouncements({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  await requireStudentClass(classId);
  const list = await listAnnouncements(classId);
  return (
    <div className="px-5 py-6 sm:px-8">
      <PageHeader title="Announcements" />
      <div className="mt-6 max-w-3xl space-y-4">
        {list.length === 0 ? <Empty>No announcements yet.</Empty> : list.map((a) => (
          <article key={a.id} className="rounded-[var(--radius-md)] border border-rule p-5">
            <h2 className="text-lg font-bold">{a.title}</h2>
            <p className="text-sm text-ink-muted">{a.author} · <LocalTime iso={a.created_at} /></p>
            <p className="mt-3 whitespace-pre-line">{a.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
