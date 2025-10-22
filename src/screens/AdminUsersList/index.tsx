import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { withClientOnly } from '@/shared/hoc/withOnlyClient';
import { Table } from '@/shared/components/Table';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import {
  useGetAdminStatsQuery,
  useUpdateApprovalSettingsMutation,
} from '@/shared/api/v1-admin';
import {
  TableItemProps,
  TableColCell,
  TableContext,
} from '@/shared/components/Table/types';
import { AdminStatsItem } from '@/shared/api/v1-admin/v1-admin-types';
import { useGetSettingsQuery } from '@/shared/api/v1';
import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
import cn from 'classnames';
import { Button } from '@/shared/components/Button';

export const AdminUsersListScreen: React.FC = withClientOnly(() => {
  const { data } = useGetAdminStatsQuery({});

  const { data: settings } = useGetSettingsQuery();
  const approval = !!settings?.approval;

  const [updateApprovalSettings, { isLoading }] =
    useUpdateApprovalSettingsMutation();

  const handleToggle = () => {
    toast.promise(updateApprovalSettings({ value: !approval }).unwrap(), {
      pending: 'Оновлення...',
      success: 'Оновленно!',
      error: 'Не вдалося оновити',
    });
  };

  const items = useMemo(
    () => data?.items.filter((e) => e.waitingForPayment !== 0) ?? [],
    [data],
  );

  return (
    <div>
      <div className="flex items-center shadow px-4 py-2 w-max rounded-md">
        <div className="font-bold mr-2">
          Кнопки {approval ? 'ввімкнені' : 'вимкнені'}
        </div>
        <Checkbox
          disabled={isLoading}
          checked={approval}
          onChange={handleToggle}
        />
      </div>
      <div className="mt-5 grid gap-2">
        <div className="flex gap-2">
          <div>Кількість, що очікують на затвердження:</div>
          <b>{data?.total.numberOfWaitingForApproval} (автора)</b>
        </div>
        <div className="flex gap-2">
          <div>Кількість, що очікують на оплату:</div>
          <b>{data?.total.numberOfWaitingForPayment} (автора)</b>
        </div>
        <div className="flex gap-2">
          <div>Всього:</div>
          <b>{data?.total.total} грн</b>
        </div>
        <div className="flex gap-2">
          <div>Очікують на затвердження:</div>
          <b>{data?.total.waitingForApproval} грн</b>
        </div>
        <div className="flex gap-2">
          <div>Очікують на оплату:</div>
          <b>{data?.total.waitingForPayment} грн</b>
        </div>
      </div>

      <Button size="small" onClick={() => exportToExcel(items)}>
        Експортувати в ексель
      </Button>
      <div className="pt-10">
        <Table
          className="max-w-[600px]"
          cols={cols}
          data={items}
          render={TableItem}
        />
      </div>
    </div>
  );
});

function TableItem<T extends AdminStatsItem, C extends TableContext>({
  data,
  cols,
}: TableItemProps<T, C>) {
  const [open, setOpen] = useState(false);

  const filteredOrders = data.orders.filter((e) => !e.payment?.needApproval);
  const total = filteredOrders
    .reduce((acc, v) => {
      acc += v.payment?.amount ?? 0;
      return acc;
    }, 0)
    .toFixed(2);

  return (
    <>
      <tr
        className={cn(
          'grid grid-cols-1 gap-1 py-1 justify-center md:table-row',
          !open && 'border-b border-[var(--gray-100)] last:border-0',
        )}
      >
        {cols.map((col, idx) => {
          const Render = () => {
            switch (col.key) {
              case 'name':
                return (
                  <div>
                    <div className="inline-block md:hidden">{col.label}:</div>{' '}
                    <b>{data.name}</b>
                  </div>
                );
              case 'sum':
                return (
                  <div>
                    <div className="inline-block  md:hidden">{col.label}:</div>{' '}
                    <b>{total} грн</b>
                  </div>
                );
              case 'orders':
                return (
                  <div className="flex  md:justify-end">
                    <Button
                      size="small"
                      onClick={() => setOpen((prev) => !prev)}
                      className="px-4"
                    >
                      {open ? 'Сховати' : 'Показати'} замовлення
                    </Button>
                  </div>
                );
              default:
                throw new Error(`Unknown column key: "${col.key}"`);
            }
          };

          return (
            <td key={idx} className="md:py-1">
              <Render />
            </td>
          );
        })}
      </tr>
      {open && (
        <tr className="border-y border-[var(--gray-100)] last:border-0">
          <td colSpan={cols.length} className="grid md:table-cell py-2">
            {filteredOrders.map((elem, idx) => {
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[20px_2fr_1fr] gap-4 even:bg-gray-100"
                >
                  <div>{idx + 1}.</div>
                  <div>
                    <b>{elem['nomer-zakaza']}</b> ({elem.status})
                  </div>
                  <div className="text-end">{elem.payment?.amount} грн</div>
                </div>
              );
            })}
          </td>
        </tr>
      )}
    </>
  );
}

const cols: Array<TableColCell<AdminStatsItem, unknown>> = [
  {
    label: 'Автор',
    key: 'name',
  },
  {
    label: 'Сума підтверджених',
    key: 'sum',
  },
  {
    label: 'Замовлення',
    key: 'orders',
  },
];

export function exportToExcel(
  data: AdminStatsItem[],
  fileName = 'export.xlsx',
) {
  const rows: any[] = [];

  data.forEach((item) => {
    const filteredOrders = item.orders.filter((e) => !e.payment?.needApproval);
    const total = filteredOrders
      .reduce((acc, v) => {
        acc += v.payment?.amount ?? 0;
        return acc;
      }, 0)
      .toFixed(2);

    rows.push({
      'Автор / Замовлення': item.name.trim(),
      'Ціна замовлення': '',
      'Загальна сума': total,
    });

    filteredOrders.forEach((order) => {
      rows.push({
        'Автор / Замовлення': `   ${order['nomer-zakaza']}`,
        'Ціна замовлення': order.payment?.amount,
        'Загальна сума': '',
      });
    });

    rows.push({});
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });

  worksheet['!cols'] = [
    { wch: 40 }, // Автор / Замовлення
    { wch: 20 }, // Ціна замовлення
    { wch: 20 }, // Загальна сума
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Автори');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, fileName);
}
