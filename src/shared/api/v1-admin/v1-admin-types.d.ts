import { Pagination } from '@/shared/common-types';
import type { OrderStatus } from '@/shared/helpers/enums';
import type { OrderEntity, UserEntity } from '@/shared/types';

export type AdminStatsItem = {
  id: string;
  name: string;
  total: number;
  waitingForApproval: number;
  waitingForPayment: number;
};

export type GetAdminStatsInput = {
  cursor?: string;
  limit?: number;
};

export type GetAdminStatsOutput = Pagination<AdminStatsItem>;

export type UpdateApprovalSettingsOutput = void;
export type UpdateApprovalSettingsInput = {
  value: boolean;
};
