import Link from 'next/link';
import { requireTeacher, requireOwnedClass } from '@/lib/auth/require';
import { CourseNav } from '@/components/lms/app-nav';
import { courseColor } from '@/components/lms/ui';

const TABS = [
  { slug: '', label: 'Home' },
  { slug: 'announcements', label: 'Announcements' },
  { slug: 'assignments', label: 'Assignments' },
  { slug: 'grades', label: 'Grades' },
  { slug: 'people', label: 'People' },
  { slug: 'mastery', label: 'Mastery' },
];

export default async function CourseLayout({ children, params }: { children: React.ReactNode; params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const teacherId = await requireTeacher();
  const klass = await requireOwnedClass(teacherId, classId);
  return (
    <div>
      <header className="no-print flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-rule px-5 py-3 sm:px-8">
        <span className="h-4 w-4 flex-none rounded-full" style={{ background: courseColor(klass.id) }} />
        <Link href={`/teacher/${klass.id}`} className="text-lg font-bold">{klass.name}</Link>
        <span className="text-ink-muted">›</span>
        <span className="text-ink-soft">{klass.course_name}</span>
        <span className="ml-auto font-mono text-sm">Join code <strong className="tracking-[0.2em]">{klass.class_code}</strong></span>
      </header>
      <div className="md:flex">
        <CourseNav base={`/teacher/${klass.id}`} items={TABS} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
