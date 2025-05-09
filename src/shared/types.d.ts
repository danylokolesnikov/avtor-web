export type OrderEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  startDate: string;
  authorId: string;
  status: OrderStatus;
  price: number;
  payment?: OrderPaymentEntity;
  manager: string;
  authorDate: string;
  'status#updatedAt': string;
  statusName: string;
  'nomer-zakaza': string;
};

export type OrderPaymentEntity = {
  number: 1 | 2 | 3;
  amount: number | null;
  percent: string;
  needApproval: boolean;
};
