export const EnumOrderStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
});

export type OrderStatus =
  (typeof EnumOrderStatus)[keyof typeof EnumOrderStatus];
