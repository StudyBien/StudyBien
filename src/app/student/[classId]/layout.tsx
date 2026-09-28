import Link from 'next/link';
import { requireStudentClass } from '@/lib/auth/student';
import { CourseNav } from '@/components/lms/app-nav';
import { courseColor } from '@/components/lms/ui';

const TABS = [
  { slug: '', label: 'Home' },
  { slug: 'announcements', label: 'Announcements' },
  { slug: 'assignments', label: 'Assignments' },
  { slug: 'grades', label: 'Grades' },
  { slug: 'people', label: 'People' },
];

export default async function StudentCourseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const me = await requireStudentClass(classId);
  return (
    <div>
      <header className="no-print flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-rule px-5 py-3 sm:px-8">
        <span className="h-4 w-4 flex-none rounded-full" style={{ background: courseColor(classId) }} />
        <Link href={`/student/${classId}`} className="text-lg font-bold">{me.className}</Link>
        <span className="text-ink-muted">›</span>
        <span className="text-ink-soft">{me.courseName}</span>
        <span className="ml-auto text-sm text-ink-muted">Signed in as <strong className="text-ink">{me.name}</strong></span>
      </header>
      <div className="md:flex">
        <CourseNav base={`/student/${classId}`} items={TABS} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
