import { LogoutButton } from '@/shared/components/LogoutButton';
import { useSession } from '@/shared/contexts/Session';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--gray-100)] h-max">
        <div className="px-[var(--screen-space)] py-2.5">
          <div className="max-w-[var(--screen-container)] w-full m-auto grid grid-cols-[1fr_auto] gap-2 justify-between">
            <DisplayUser />
            <LogoutButton />
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

function DisplayUser() {
  const { user } = useSession();

  return (
    <div className="grid grid-cols-[1.5rem_auto] items-center">
      <div className="rounded-full bg-gray-300 size-6 flex justify-center items-center">
        <svg
          className="size-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
          ></path>
        </svg>
      </div>
      <div className="pl-2 truncate inline">{user?.name}</div>
    </div>
  );
}
