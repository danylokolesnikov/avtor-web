import {
  useGetSettingsQuery,
  useGetStatsQuery,
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
} from '@/shared/api/v1';
import { Button } from '@/shared/components/Button';
import { LoadMoreWrapper } from '@/shared/components/LoadMoreWrapper';
import { Table } from '@/shared/components/Table';
import { TableItemProps, TableColCell } from '@/shared/components/Table/types';
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
            render={TableItem}
          />
        </div>
      </LoadMoreWrapper>
    </div>
  );
}

function TableItem({
  data,
  context,
  cols,
}: TableItemProps<OrderEntity, Context>) {
  return (
    <tr
      className={cn(
        'grid grid-cols-1 gap-1 py-2 justify-center md:table-row',
        'border-b border-[var(--gray-100)] last:border-0',
      )}
    >
      {cols.map((col, idx) => {
        const Render = () => {
          switch (col.key) {
            case 'nomer-zakaza':
            case 'manager':
            case 'price':
              return (
                <div>
                  <div className="inline-block md:hidden">{col.label}:</div>{' '}
                  <b>{data[col.key]}</b>
                </div>
              );
            case 'startDate':
            case 'authorDate':
              return (
                <div>
                  <div className="inline-block md:hidden">{col.label}:</div>{' '}
                  <b>{moment(data[col.key]).format('DD.MM.YYYY')}</b>
                </div>
              );
            case 'payment.amount':
              return (
                <div>
                  <div className="inline-block md:hidden">{col.label}:</div>{' '}
                  <b>{data.payment?.amount}</b>
                </div>
              );
            case 'payment.number':
              return (
                <div>
                  <div className="inline-block md:hidden">{col.label}:</div>{' '}
                  <b>
                    {data.payment?.number &&
                      {
                        1: 'Перша оплата',
                        2: 'Друга оплата',
                        3: 'Третя оплата',
                      }[data.payment.number]}
                  </b>
                </div>
              );
            case 'approveButton':
              return (
                <div className="flex mt-2 md:justify-end md:mt-0">
                  <Button
                    onClick={() =>
                      context?.settings?.approval &&
                      data.payment?.needApproval &&
                      context?.handleOrderApprove(data.id)
                    }
                    disabled={
                      !context?.settings?.approval ||
                      !data.payment?.needApproval
                    }
                    variant={data.payment?.needApproval ? 'secondary' : 'green'}
                    size="small"
                    className="md:max-w-[10rem] w-full"
                  >
                    {data.payment?.needApproval
                      ? 'Підтвердити'
                      : 'Підтверджено'}
                  </Button>
                </div>
              );
            default:
              throw new Error(`Unknown column key: "${col.key}"`);
          }
        };

        return (
          <td key={idx} className="md:py-1 ">
            <Render />
          </td>
        );
      })}
    </tr>
  );
}

const colsPending: Array<TableColCell<OrderEntity, Context>> = [
  {
    key: 'nomer-zakaza',
    label: 'Номер замовлення',
  },
  {
    key: 'manager',
    label: 'Менеджер',
  },
  {
    key: 'price',
    label: 'Загальна ціна',
  },
  {
    key: 'payment.amount',
    label: 'Наступна оплата',
  },
  {
    key: 'payment.number',
    label: 'Тип оплати',
  },
  {
    label: null,
    key: 'approveButton',
  },
];

const colsInProgress: Array<TableColCell<OrderEntity, Context>> = [
  {
    label: 'Номер замовлення',
    key: 'nomer-zakaza',
  },
  {
    label: 'Менеджер',
    key: 'manager',
  },
  {
    label: 'Дата закріпки',
    key: 'startDate',
  },
  {
    label: 'Дата здачі',
    key: 'authorDate',
  },
];

const colsPaid: Array<TableColCell<OrderEntity, Context>> = [
  {
    label: 'Номер замовлення',
    key: 'nomer-zakaza',
  },
  {
    label: 'Менеджер',
    key: 'manager',
  },
  {
    label: 'Загальна ціна',
    key: 'price',
  },
  {
    label: 'Дата завершення',
    key: 'authorDate',
  },
];
