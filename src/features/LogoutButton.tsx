import { api } from '@/shared/api';
import { authApi, useLogoutMutation } from '@/shared/api/auth';
import { v1Api } from '@/shared/api/v1';
import { BaseButton } from '@/shared/components/BaseButton';
import { useAppDispatch } from '@/shared/store';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await toast.promise(logout().unwrap(), {
        pending: 'Вихід...',
        success: 'Ви вийшли',
        error: 'Помилка виходу',
      });

      dispatch(api.util.resetApiState());
      dispatch(authApi.util.resetApiState());
      dispatch(v1Api.util.resetApiState());
      router.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <BaseButton
      onClick={handleLogout}
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
