import {
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
} from '@/shared/api/v1';
import { Button } from '@/shared/components/Button';
import { Table } from '@/shared/components/Table';
import { TableColCell } from '@/shared/components/Table/types';
import { EnumOrderStatus, OrderStatus } from '@/shared/helpers/enums';
import { OrderEntity } from '@/shared/types';
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
  const [items, setItems] = useState<Array<OrderEntity>>([]);
  const [getOrders, { isFetching, isLoading }] = useLazyGetOrdersQuery();

  const loadOrders = async (isLoadMore: boolean) => {
    if (isFetching) return;

    const res = await getOrders({ status, limit: 5, cursor: nextCursor });

    if (res.data) {
      const items = res.data.items;
      setItems(isLoadMore ? (prev) => prev.concat(items) : items);
      setNextCursor(res.data.cursor);
    }
  };

  const loadMore = () => loadOrders(true);

  useEffect(() => {
    loadOrders(false);
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
          prev.map((e) => {
            if (e.id !== id || !e.payment) return e;
            return {
              ...e,
              payment: {
                ...e.payment,
                needApproval: false,
              },
            };
          }),
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
    <div>
      <Table
        cols={
          {
            [EnumOrderStatus.PENDING]: colsPending,
            [EnumOrderStatus.IN_PROGRESS]: colsInProgress,
            [EnumOrderStatus.PAID]: colsPaid,
          }[status]
        }
        context={context}
        data={items}
      />
      {nextCursor && (
        <div className="flex justify-center">
          <Button onClick={loadMore}>Далі</Button>
        </div>
      )}
    </div>
  );
}

const colsPending: Array<TableColCell<OrderEntity, Context>> = [
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
    label: '',
    render: ({ id, payment }, context) => (
      <Button
        onClick={() => payment?.needApproval && context?.handleOrderApprove(id)}
        disabled={!payment?.needApproval}
      >
        Підтвердити
      </Button>
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
