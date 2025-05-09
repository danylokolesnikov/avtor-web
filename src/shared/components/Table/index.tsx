import type { TableColCell, TableContext } from './types';

export type TableProps<T extends unknown, C extends TableContext> = {
  context?: C;
  cols: Array<TableColCell<T, C>>;
  data: Array<T>;
};

export function Table<T extends unknown, C extends TableContext>({
  cols,
  data,
  context,
}: TableProps<T, C>) {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr>
          {cols.map((elem, idx) => (
            <th key={idx} className="text-start">
              {elem.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((elem, idx) => (
          <tr key={idx} className="border-b last:border-0">
            {cols.map((col, idx) => (
              <td key={idx} className='py-2'>{col.render(elem, context)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
