import { ROUTE } from '@/shared/helpers/routers';

import Image from './assets/image.jpg';
import { Button } from '@/shared/components/Button';
import { useRouter } from 'next/router';

export const HomeScreen: React.FC = () => {
  const { push } = useRouter();

  return (
    <>
      <span
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg bg-cover bg-center -z-[1]"
        style={{ backgroundImage: `url("${Image.src}")` }}
      />
      <div className="flex justify-center items-center h-full text-white">
        <div className="absolute top-14 md:top-26 m-auto w-full flex justify-center">
          <Button
            onClick={() => {
              push(ROUTE.login);
            }}
            className="max-w-[7rem] w-full"
          >
            Увійти
          </Button>
        </div>
        <h1 className="text-2xl md:text-7xl font-extrabold">Openstorinka</h1>
      </div>
    </>
  );
};
