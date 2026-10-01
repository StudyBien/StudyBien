import { SiteNav, SiteFooter } from '@/components/site-chrome';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <div className="md:flex">
        <div className="min-w-0 flex-1">
          <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">{children}</main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
