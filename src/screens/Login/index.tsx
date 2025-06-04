import { useLoginMutation } from '@/shared/api/auth';
import type { LoginInput } from '@/shared/api/auth/auth-types';
import { Button } from '@/shared/components/Button';
import { InputField } from '@/shared/components/InputField';
import { useSession } from '@/shared/contexts/Session';
import { ROUTE } from '@/shared/helpers/routers';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const LoginScreen: React.FC = () => {
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const { push } = useRouter();
  const { handleSucssesLogin } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const form = new FormData(e.currentTarget);

    const data: LoginInput = {
      username: form.get('username') as string,
      password: form.get('password') as string,
    };

    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      toast.error('Недійсний ввід');
      console.error(parsed.error.format());
      return;
    }

    toast.promise(
      login(parsed.data)
        .unwrap()
        .then(() => {
          push(ROUTE.dashboard);
          handleSucssesLogin();
        }),
      {
        pending: 'Вхід...',
        success: 'Ласкаво просимо!',
        error: 'Не вдалося ввійти',
      },
    );
  };

  return (
    <div className="px-[var(--screen-space)] h-full">
      <div className="max-w-[var(--screen-container)] m-auto h-full">
        <div className="flex items-center justify-center h-full py-[2.5rem]">
          <div>
            <h1 className="text-2xl text-center">Вхід в особистий кабінет</h1>
            <form onSubmit={handleSubmit} className="grid gap-4 mt-8">
              <InputField
                id="username"
                name="username"
                type="text"
                placeholder="Логін"
                required
              />
              <InputField
                id="password"
                name="password"
                type="password"
                required
                placeholder="Пароль"
              />
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isSuccess}
                className="max-w-[10rem] m-auto w-full mt-2"
              >
                Увійти
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
