import cn from 'classnames';
import type { TableItemProps, TableColCell, TableContext } from './types';
import { useScreenSize } from '@/shared/hooks/useScreenSize';

export type TableProps<T extends unknown, C extends TableContext> = {
  context?: C;
  cols: Array<TableColCell<T, C>>;
  data: Array<T>;
  render: React.FC<TableItemProps<T, C>>;
  className?: string;
};

export function Table<T extends unknown, C extends TableContext>({
  cols,
  data,
  context,
  render: Render,
  className,
}: TableProps<T, C>) {
  const { width, md } = useScreenSize();

  if (!width) return null;
  return (
    <table className={cn('w-full overflow-hidden table-fixed', className)}>
      <thead className="hidden md:table-header-group">
        <tr>
          {cols.map((elem, idx) => (
            <th
              key={idx}
              className={cn('pb-11 pr-3 font-medium  h-full text-start')}
            >
              <div className={cn(elem.label && 'h-full font-bold')}>
                {elem.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="grid grid-cols-1 gap-2 md:table-row-group">
        {data.map((elem, idx) => (
          <Render
            key={idx}
            data={elem}
            context={context}
            cols={cols}
            isMobile={md}
          />
        ))}
      </tbody>
    </table>
  );
}
