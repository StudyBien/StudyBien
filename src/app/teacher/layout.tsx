import { requireTeacher } from '@/lib/auth/require';
import { AppNav } from '@/components/lms/app-nav';
import { signOut } from '../login/actions';

export const dynamic = 'force-dynamic';

const ITEMS = [
  { href: '/teacher', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/teacher/courses', label: 'Courses', icon: '📚' },
  { href: '/teacher/calendar', label: 'Calendar', icon: '📅' },
  { href: '/teacher/todo', label: 'To Do', icon: '☑' },
  { href: '/resources/worksheets', label: 'Library', icon: '▤' },
];

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  await requireTeacher();
  return (
    <div className="min-h-screen md:flex">
      <AppNav
        items={ITEMS}
        footer={
          <form action={signOut} className="md:mt-auto">
            <button className="flex min-w-[72px] flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-bold text-paper hover:bg-primary md:w-full md:py-4">
              <span aria-hidden className="text-xl leading-none">⎋</span>Sign out
            </button>
          </form>
        }
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
