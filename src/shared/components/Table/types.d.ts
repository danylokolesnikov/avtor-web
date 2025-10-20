export type TableColCell<T extends unknown, C extends Context> = {
  label: string | null;
  key?: string;
};

export type TableContext = Record<string, unknown>;

export type TableItemProps<T extends unknown, C extends TableContext> = {
  context?: C;
  data: T;
  cols: Array<TableColCell<T, C>>;
  isMobile: boolean;
};
