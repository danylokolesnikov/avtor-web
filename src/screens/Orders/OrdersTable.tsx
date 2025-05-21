import {
  useGetStatsQuery,
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
} from '@/shared/api/v1';
import { Button } from '@/shared/components/Button';
import { Table } from '@/shared/components/Table';
import {
  MobileTableItemProps,
  TableColCell,
} from '@/shared/components/Table/types';
import { EnumOrderStatus, OrderStatus } from '@/shared/helpers/enums';
import { OrderEntity } from '@/shared/types';
import cn from 'classnames';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type OrdersTableProps = {
  status: OrderStatus;
};

type HandleOrderApprove = (id: string) => Promise<void>;

type Context = {
  handleOrderApprove: HandleOrderApprove;
  status: OrderStatus;
};

export function OrdersTable({ status }: OrdersTableProps) {
  const [nextCursor, setNextCursor] = useState<string>();
  const [items, setItems] = useState<Array<OrderEntity> | null>(null);
  const [isError, setIsError] = useState(false);
  const [getOrders, { isFetching }] = useLazyGetOrdersQuery();
  const { data } = useGetStatsQuery();

  const loadOrders = async () => {
    if (isFetching) return;

    const res = await getOrders({ status, cursor: nextCursor });

    if (res.data) {
      const items = res.data.items;
      setIsError(false);
      setItems((prev) => (prev ? prev.concat(items) : items));
      setNextCursor(res.data.cursor);
    } else {
      setIsError(true);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [status]);

  const [orderApprove] = useOrderApproveMutation();

  const handleOrderApprove: HandleOrderApprove = useCallback(
    async (id) => {
      try {
        await toast.promise(orderApprove({ id }).unwrap(), {
          pending: 'Підтверджується...',
          success: 'Підтвержено!',
          error: 'Не вдалося підтвердити',
        });

        setItems((prev) =>
          prev
            ? prev.map((e) => {
                if (e.id !== id || !e.payment) return e;
                return {
                  ...e,
                  payment: {
                    ...e.payment,
                    needApproval: false,
                  },
                };
              })
            : prev,
        );
      } catch (error) {}
    },
    [orderApprove],
  );

  const context: Context = useMemo(
    () => ({ handleOrderApprove, status }),
    [handleOrderApprove, status],
  );

  return (
    <div className="pt-7 sm:pt-16">
      {data && (
        <div className="bg-[#C9A4FF] w-max rounded-full mr-0 ml-auto p-1.5 px-3 text-xs text-white">
          Загальна сума {data.total} грн
        </div>
      )}
      <div className="pt-3">
        <Table
          cols={
            {
              [EnumOrderStatus.PENDING]: colsPending,
              [EnumOrderStatus.IN_PROGRESS]: colsInProgress,
              [EnumOrderStatus.PAID]: colsPaid,
            }[status]
          }
          context={context}
          data={items ?? []}
          renderMobile={MobileTableItem}
        />
      </div>
      {isError ? (
        <div className="grid items-center justify-center gap-2 text-center">
          <h4 className="text-[1.2rem]">Сталася помилка!</h4>
          <Button variant="secondary" size="small" onClick={loadOrders}>
            Спробувати ще раз
          </Button>
        </div>
      ) : !items ? (
        <div className="text-center">Завантаження...</div>
      ) : (
        nextCursor && (
          <div className="flex justify-center pt-7 sm:pt-16">
            <Button onClick={loadOrders} className="max-w-[10rem] w-full">
              Далі
            </Button>
          </div>
        )
      )}
    </div>
  );
}

function MobileTableItem<T extends OrderEntity, C extends Context>({
  data,
  context,
  cols,
}: MobileTableItemProps<OrderEntity, Context>) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {cols.map((elem, idx) => {
        const isApproveButton = elem.key === 'approveButton';
        return (
          <div
            key={idx}
            className={cn(
              {
                'flex justify-between': !isApproveButton,
              },
              ' border-b pb-1 border-[var(--gray-100)] last:border-b-0',
            )}
          >
            <div>{elem.label}</div>
            <div className="font-semibold">
              {elem.render(data, context) || '-'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const colsPending: Array<TableColCell<OrderEntity, Context>> = [
  {
    key: 'number',
    label: 'Номер замовлення',
    render: (data) => data['nomer-zakaza'],
  },
  {
    label: 'Менеджер',
    render: ({ manager }) => manager,
  },
  {
    label: 'Загальна ціна',
    render: ({ price }) => price,
  },
  {
    label: 'Наступна оплата',
    render: ({ payment }) => payment?.amount,
  },
  {
    label: 'Тип оплати',
    render: ({ payment }) =>
      payment?.number &&
      {
        1: 'Перша оплата',
        2: 'Друга оплата',
        3: 'Третя оплата',
      }[payment.number],
  },
  {
    label: null,
    key: 'approveButton',
    render: ({ payment, id }, context) => (
      <div className="flex mt-2 md:justify-end md:mt-0">
        <Button
          onClick={() =>
            payment?.needApproval && context?.handleOrderApprove(id)
          }
          disabled={!payment?.needApproval}
          variant="secondary"
          size="small"
          className="md:max-w-[10rem] w-full"
        >
          {payment?.needApproval ? 'Підтвердити' : 'Підтверджено'}
        </Button>
      </div>
    ),
  },
];

const colsInProgress: Array<TableColCell<OrderEntity, Context>> = [
  {
    label: 'Номер замовлення',
    render: (data) => data['nomer-zakaza'],
  },
  {
    label: 'Менеджер',
    render: ({ manager }) => manager,
  },
  {
    label: 'Дата закріпки',
    render: ({ startDate }) => moment(startDate).format('DD.MM.YYYY'),
  },
  {
    label: 'Дата здачі',
    render: ({ authorDate }) => moment(authorDate).format('DD.MM.YYYY'),
  },
];

const colsPaid: Array<TableColCell<OrderEntity, Context>> = [
  {
    label: 'Номер замовлення',
    render: (data) => data['nomer-zakaza'],
  },
  {
    label: 'Менеджер',
    render: ({ manager }) => manager,
  },
  {
    label: 'Загальна ціна',
    render: ({ price }) => price,
  },
  {
    label: 'Дата завершення',
    render: ({ authorDate }) => moment(authorDate).format('DD.MM.YYYY'),
  },
];
