import { useGetOrdersQuery } from '@/shared/api';
import { EnumOrderStatus, OrderStatus } from '@/shared/helpers/enums';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const statuses = Object.values(EnumOrderStatus);

export const TasksScreen: React.FC = () => {
  const { query } = useRouter();

  const rawStatus = Array.isArray(query.status)
    ? query.status[0]
    : query.status;

  const status = statuses.find((e) => e === rawStatus) ?? statuses[0];

  const { currentData } = useGetOrdersQuery({ status });

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {statuses.map((elem, idx) => (
          <Link
            key={idx}
            href={{ query: { status: elem } }}
            shallow
            className={cn(status === elem && 'bg-amber-400')}
          >
            {elem}
          </Link>
        ))}
      </div>
      <div className="grid gap-2">
        {currentData?.items.map((elem, idx) => (
          <div key={idx}>
            {elem.id}, {elem.status}, {elem.authorId}, {elem['status#updatedAt']}
          </div>
        ))}
      </div>
    </div>
  );
};
