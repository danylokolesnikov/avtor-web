export type TableColCell<T extends unknown, C extends Context> = {
  label: string;
  render: (data: T, context: C | undefined) => React.ReactNode;
};

export type TableContext = Record<string, unknown>;
