import { EnumOrderStatus } from '@/shared/helpers/enums';
import { withClientOnly } from '@/shared/hoc/withOnlyClient';
import { OrdersTable } from './OrdersTable';
import { useNextQueryParams } from '@/shared/hooks/useNextQueryParams';
import { Button } from '@/shared/components/Button';
import { useRouter } from 'next/router';

const statuses = Object.values(EnumOrderStatus);

export const OrdersScreen: React.FC = withClientOnly(() => {
  const { push } = useRouter();
  const { status: statusParam } = useNextQueryParams('status');
  const status = statuses.find((e) => e === statusParam) ?? statuses[0];

  return (
    <div>
      <div className="grid sm:grid-cols-[repeat(3,12.5rem)] gap-2 overflow-auto pb-2">
        {statuses.map((elem, idx) => (
          <Button
            key={idx}
            onClick={() => {
              push({ query: { status: elem } }, undefined, {
                shallow: true,
              });
            }}
            variant={status === elem ? 'primary' : 'secondary'}
          >
            {
              {
                [EnumOrderStatus.PENDING]: 'Очікують оплати',
                [EnumOrderStatus.IN_PROGRESS]: 'Графік робіт',
                [EnumOrderStatus.PAID]: 'Завершені оплати',
              }[elem]
            }
          </Button>
        ))}
      </div>
      <OrdersTable status={status} key={status} />
    </div>
  );
});
