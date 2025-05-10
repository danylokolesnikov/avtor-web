export type TableColCell<T extends unknown, C extends Context> = {
  label: string | null;
  key?: string;
  render: (data: T, context: C | undefined) => React.ReactNode;
};

export type TableContext = Record<string, unknown>;

export type MobileTableItemProps<T extends unknown, C extends TableContext> = {
  context?: C;
  data: T;
  cols: Array<TableColCell<T, C>>;
};
