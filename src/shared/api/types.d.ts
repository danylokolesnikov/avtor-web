import { OrderStatus } from '../helpers/enums';

export type LoginOutput = void;

export type LoginInput = {
  username: string;
  password: string;
};

export type GetOrdersOutput = {
  items: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    status: OrderStatus;
    price: number;
    payment: {
      number: number;
      amount: number | null;
      percent: string;
      needApproval: boolean;
    };
    manager: string;
    authorDate: string;
    'status#updatedAt': string;
    statusName: string;
  }>;
};

export type GetOrdersInput = {
  status: OrderStatus;
  cursor?: string;
  limit?: number;
};
