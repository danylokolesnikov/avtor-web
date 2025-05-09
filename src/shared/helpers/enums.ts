export const EnumOrderStatus = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  PAID: 'paid',
});

export type OrderStatus =
  (typeof EnumOrderStatus)[keyof typeof EnumOrderStatus];
