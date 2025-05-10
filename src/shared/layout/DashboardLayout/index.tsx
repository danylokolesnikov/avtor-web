import { LogoutButton } from '@/features/LogoutButton';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--gray-100)] h-max">
        <div className="px-[var(--screen-space)] py-2.5">
          <div className="max-w-[var(--screen-container)] m-auto flex justify-end">
            <LogoutButton className=''/>
          </div>
        </div>
      </header>
      <div className="px-[var(--screen-space)]">
        <div className="max-w-[var(--screen-container)] m-auto h-full py-[2.5rem] ">
          {children}
        </div>
      </div>
    </>
  );
}
