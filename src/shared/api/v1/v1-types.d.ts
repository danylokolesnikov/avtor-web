import { Pagination } from '@/shared/common-types';
import type { OrderStatus } from '@/shared/helpers/enums';
import type { OrderEntity, SettingsEntity, UserEntity } from '@/shared/types';

export type GetMeOutput = UserEntity;

export type GetOrdersOutput = Pagination<OrderEntity>;

export type GetOrdersInput = {
  status?: OrderStatus;
  cursor?: string;
  limit?: number;
};

export type GetStatsOutput = {
  total: number;
  waitingForApproval: number;
  waitingForPayment: number;
};

export type GetStatsInput = void;

export type OrderApproveOutput = {
  id: string;
};

export type OrderApproveInput = {
  id: string;
};

export type GetSettingsOutput = SettingsEntity;