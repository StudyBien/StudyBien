import { requireStudent } from '@/lib/auth/student';
import { AppNav } from '@/components/lms/app-nav';
import { leaveDeviceAction } from './actions';

export const dynamic = 'force-dynamic';

const ITEMS = [
  { href: '/student', label: 'Dashboard', icon: '▦', exact: true },
  { href: '/student/calendar', label: 'Calendar', icon: '📅' },
  { href: '/student/todo', label: 'To Do', icon: '☑' },
  { href: '/learn', label: 'Plumi', icon: '🪶' },
  { href: '/resources/quizzes', label: 'Practice', icon: '✓' },
  { href: '/games', label: 'Games', icon: '★' },
  { href: '/go', label: 'Join class', icon: '+' },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireStudent();
  return (
    <div className="min-h-screen md:flex">
      <AppNav items={ITEMS}
        footer={
          <form action={leaveDeviceAction} className="md:mt-auto">
            <button className="flex min-w-[72px] flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-bold text-paper hover:bg-primary md:w-full md:py-4"
                    title="Sign out of every class on this device">
              <span aria-hidden className="text-xl leading-none">⎋</span>Sign out
            </button>
          </form>
        } />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
