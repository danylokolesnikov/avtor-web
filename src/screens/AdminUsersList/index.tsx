import { withClientOnly } from '@/shared/hoc/withOnlyClient';
import { Table } from '@/shared/components/Table';
import { Checkbox } from '@/shared/components/Checkbox/Checkbox';
import {
  useLazyGetAdminStatsQuery,
  useUpdateApprovalSettingsMutation,
} from '@/shared/api/v1-admin';
import {
  MobileTableItemProps,
  TableColCell,
  TableContext,
} from '@/shared/components/Table/types';
import { AdminStatsItem } from '@/shared/api/v1-admin/v1-admin-types';
import { useLoadMore } from '@/shared/hooks/useLoadMore';
import { LoadMoreWrapper } from '@/shared/components/LoadMoreWrapper';
import { useGetSettingsQuery } from '@/shared/api/v1';
import { toast } from 'react-toastify';

export const AdminUsersListScreen: React.FC = withClientOnly(() => {
  const [getAdminStats] = useLazyGetAdminStatsQuery();
  const { isError, items, hasMore, loadMore } = useLoadMore(getAdminStats, {});

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

  return (
    <div>
      <div className="flex items-center shadow px-4 py-2 w-max rounded-md">
        <div className='font-bold mr-2'>Кнопки вимкнені</div>
        <Checkbox
          disabled={isLoading}
          checked={approval}
          onChange={handleToggle}
        />
      </div>
      <LoadMoreWrapper
        isError={isError}
        isInitLoading={!items}
        hasMore={hasMore}
        loadMore={loadMore}
      >
        <div className="pt-10">
          <Table
            className="max-w-96"
            cols={cols}
            data={items ?? []}
            renderMobile={MobileTableItem}
          />
        </div>
      </LoadMoreWrapper>
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
