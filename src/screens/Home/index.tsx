import Link from 'next/link';

import { ROUTE } from '@/shared/helpers/routers';

import Image from './assets/image.jpg';

export const HomeScreen: React.FC = () => {
  return (
    <>
      <span
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg bg-cover bg-center -z-[1]"
        style={{ backgroundImage: `url("${Image.src}")` }}
      />
      <div className="flex justify-center items-center h-full text-white">
        <Link href={ROUTE.auth} className=" absolute top-26 m-auto ">
          Увійти
        </Link>

        <h1>Openstorinka</h1>
      </div>
    </>
  );
};
