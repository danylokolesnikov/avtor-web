import cn from 'classnames';
import type { MobileTableItemProps, TableColCell, TableContext } from './types';
import { useScreenSize } from '@/shared/hooks/useScreenSize';

export type TableProps<T extends unknown, C extends TableContext> = {
  context?: C;
  cols: Array<TableColCell<T, C>>;
  data: Array<T>;
  renderMobile?: React.FC<MobileTableItemProps<T, C>>;
  className?: string;
};

export function Table<T extends unknown, C extends TableContext>({
  cols,
  data,
  context,
  renderMobile: RenderMobile,
  className,
}: TableProps<T, C>) {
  const { width, md } = useScreenSize();

  if (!width) return null;

  if (md && typeof RenderMobile === 'function') {
    return (
      <div className={cn('grid grid-cols-1 gap-2', className)}>
        {data.map((elem, idx) => (
          <div
            key={idx}
            className="p-2 border rounded-lg border-[var(--gray-100)]"
          >
            <RenderMobile data={elem} context={context} cols={cols} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <table className={cn('w-full overflow-hidden table-fixed', className)}>
      <thead>
        <tr>
          {cols.map((elem, idx) => (
            <th
              key={idx}
              className={cn('pb-11 px-3 font-medium  h-full text-center')}
            >
              <div className={cn(elem.label && 'h-full font-bold')}>
                {elem.label}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((elem, idx) => (
          <tr
            key={idx}
            className="border-b border-[var(--gray-100)] last:border-0"
          >
            {cols.map((col, idx) => (
              <td
                key={idx}
                className={cn('text-center', !idx ? 'pb-3' : 'py-3')}
              >
                {col.render(elem, context)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
