import { withClientOnly } from '@/shared/hoc/withOnlyClient';
import { Table } from '@/shared/components/Table';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import {
  useGetAdminStatsQuery,
  useUpdateApprovalSettingsMutation,
} from '@/shared/api/v1-admin';
import {
  MobileTableItemProps,
  TableColCell,
  TableContext,
} from '@/shared/components/Table/types';
import { AdminStatsItem } from '@/shared/api/v1-admin/v1-admin-types';
import { useGetSettingsQuery } from '@/shared/api/v1';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

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

      <div className="pt-10">
        <Table
          className="max-w-96"
          cols={cols}
          data={items}
          renderMobile={MobileTableItem}
        />
      </div>
    </div>
  );
});

function MobileTableItem<T extends AdminStatsItem, C extends TableContext>({
  data,
  context,
  cols,
}: MobileTableItemProps<T, C>) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {cols.map((elem, idx) => (
        <div
          key={idx}
          className="border-b pb-1 border-[var(--gray-100)] last:border-b-0"
        >
          <div>{elem.label}</div>
          <div className="font-semibold">
            {elem.render(data, context) || '-'}
          </div>
        </div>
      ))}
    </div>
  );
}

const cols: Array<TableColCell<AdminStatsItem, unknown>> = [
  {
    label: 'Автор',
    render: ({ name }) => name,
  },
  {
    label: 'Сума підтверджених',
    render: ({ waitingForPayment }) => waitingForPayment,
  },
];
