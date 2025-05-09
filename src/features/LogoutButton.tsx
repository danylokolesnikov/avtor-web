import { api } from '@/shared/api';
import { useLogoutMutation } from '@/shared/api/auth';
import { Button } from '@/shared/components/Button';
import { ROUTE } from '@/shared/helpers/routers';
import { useAppDispatch } from '@/shared/store';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export function LogoutButton() {
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

      router.push(ROUTE.home);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <Button onClick={handleLogout}>Вихід</Button>;
}
