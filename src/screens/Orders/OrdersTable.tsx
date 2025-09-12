import {
  useGetSettingsQuery,
  useGetStatsQuery,
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
} from '@/shared/api/v1';
import { Button } from '@/shared/components/Button';
import { LoadMoreWrapper } from '@/shared/components/LoadMoreWrapper';
import { Table } from '@/shared/components/Table';
import {
  MobileTableItemProps,
  TableColCell,
} from '@/shared/components/Table/types';
import { EnumOrderStatus, OrderStatus } from '@/shared/helpers/enums';
import { useLoadMore } from '@/shared/hooks/useLoadMore';
import { OrderEntity, SettingsEntity } from '@/shared/types';
import cn from 'classnames';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

type OrdersTableProps = {
  status: OrderStatus;
};

type HandleOrderApprove = (id: string) => Promise<void>;

type Context = {
  handleOrderApprove: HandleOrderApprove;
  status: OrderStatus;
  settings: SettingsEntity | null;
};

export function OrdersTable({ status }: OrdersTableProps) {
  const { data } = useGetStatsQuery();

  const [getOrders] = useLazyGetOrdersQuery();
  const { data: settings } = useGetSettingsQuery();
  const { isError, items, hasMore, loadMore, setItemsMap } = useLoadMore(
    getOrders,
    {
      params: { status },
      deps: [status],
    },
  );

  const [orderApprove] = useOrderApproveMutation();

  const handleOrderApprove: HandleOrderApprove = useCallback(
    async (id) => {
      try {
        await toast.promise(orderApprove({ id }).unwrap(), {
          pending: 'Підтверджується...',
          success: 'Підтвержено!',
          error: 'Не вдалося підтвердити',
        });

        setItemsMap((prev) => {
          if (!prev) {
            return prev;
          }
          const newMap = new Map<string, OrderEntity[]>();

          for (const [key, orders] of newMap.entries()) {
            newMap.set(
              key,
              orders.map((e) =>
                e.id !== id || !e.payment
                  ? e
                  : {
                      ...e,
                      payment: {
                        ...e.payment,
                        needApproval: false,
                      },
                    },
              ),
            );
          }

          return newMap;
        });
      } catch (error) {}
    },
    [orderApprove],
  );

  const context: Context = useMemo(
    () => ({ handleOrderApprove, status, settings: settings ?? null }),
    [handleOrderApprove, status, settings],
  );

  return (
    <div className="pt-7 sm:pt-16">
      {data && EnumOrderStatus.PENDING === status && (
        <div className="bg-[#C9A4FF] w-max rounded-full mr-0 ml-auto p-1.5 px-3 text-xs text-white">
          Загальна сума {data.waitingForPayment} грн
        </div>
      )}
      <LoadMoreWrapper
        isError={isError}
        isInitLoading={!items}
        hasMore={hasMore}
        loadMore={loadMore}
      >
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
      </LoadMoreWrapper>
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
            context?.settings?.approval &&
            payment?.needApproval &&
            context?.handleOrderApprove(id)
          }
          disabled={!context?.settings?.approval || !payment?.needApproval}
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
