import { Pagination } from '@/shared/common-types';
import type { OrderStatus } from '@/shared/helpers/enums';
import type { OrderEntity, UserEntity } from '@/shared/types';

export type AdminStatsItem = {
  id: string;
  name: string;
  total: number;
  waitingForApproval: number;
  waitingForPayment: number;
  orders: Array<OrderEntity>;
};

export type GetAdminStatsInput = {};

export type GetAdminStatsOutput = {
  total: {
    numberOfWaitingForPayment: number;
    numberOfWaitingForApproval: number;
    waitingForPayment: number;
    waitingForApproval: number;
    total: number;
  };
  sortedBy: string;
  sortedOrder: string;
  items: Array<AdminStatsItem>;
};

export type UpdateApprovalSettingsOutput = void;
export type UpdateApprovalSettingsInput = {
  value: boolean;
};
