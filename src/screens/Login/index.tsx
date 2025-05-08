import { useLoginMutation } from '@/shared/api';
import { LoginInput } from '@/shared/api/types';
import { ROUTE } from '@/shared/helpers/routers';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const LoginScreen: React.FC = () => {
  const [login] = useLoginMutation();
  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        .then(() => push(ROUTE.dashboard)),
      {
        pending: 'Вхід...',
        success: 'Ласкаво просимо!',
        error: 'Не вдалося ввійти',
      },
    );
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input name="username" type="text" required />
        <input name="password" type="password" required />
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};
