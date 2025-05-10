import type { OrderStatus } from '@/shared/helpers/enums';
import type { OrderEntity, UserEntity } from '@/shared/types';

export type GetMeOutput = UserEntity;

export type GetOrdersOutput = {
  items: Array<OrderEntity>;
  cursor?: string;
};

export type GetOrdersInput = {
  status?: OrderStatus;
  cursor?: string;
  limit?: number;
};

export type OrderApproveOutput = {
  id: string;
};

export type OrderApproveInput = {
  id: string;
};
