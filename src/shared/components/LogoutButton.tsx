import { BaseButton } from '@/shared/components/BaseButton';
import { useSession } from '@/shared/contexts/Session';
import cn from 'classnames';

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useSession();

  return (
    <BaseButton
      onClick={logout}
      className={cn('text-[var(--purple-500)]', className)}
    >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m15.75 8.75 3.5 3.25-3.5 3.25M19 12h-8.25M15.25 4.75h-8.5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h8.5"
        ></path>
      </svg>
      Вийти
    </BaseButton>
  );
}
