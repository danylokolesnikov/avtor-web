import cn from 'classnames';
import Link from 'next/link';

import { LogoutButton } from '@/features/LogoutButton';
import { EnumOrderStatus } from '@/shared/helpers/enums';
import { withClientOnly } from '@/shared/hoc/withOnlyClient';
import { OrdersTable } from './OrdersTable';
import { useNextQueryParams } from '@/shared/hooks/useNextQueryParams';

const statuses = Object.values(EnumOrderStatus);

export const OrdersScreen: React.FC = withClientOnly(() => {
  const { status: statusParam } = useNextQueryParams('status');
  const status = statuses.find((e) => e === statusParam) ?? statuses[0];

  return (
    <div className="max-w-[1280px] m-auto h-full">
      <div className="flex justify-between">
        <div className="grid grid-cols-3 gap-2">
          {statuses.map((elem, idx) => (
            <Link
              key={idx}
              href={{ query: { status: elem } }}
              shallow
              className={cn(status === elem && 'bg-amber-400', 'border p-2')}
            >
              {
                {
                  [EnumOrderStatus.PENDING]: 'Очікують оплати',
                  [EnumOrderStatus.IN_PROGRESS]: 'У процесі (роботи)',
                  [EnumOrderStatus.PAID]: 'Завершені оплати',
                }[elem]
              }
            </Link>
          ))}
        </div>
        <LogoutButton />
      </div>
      <OrdersTable status={status} key={status} />
    </div>
  );
});
