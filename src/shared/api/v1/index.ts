import { extractParenthesesContent } from '@/shared/utils/extractParenthesesContent';
import { api } from '..';

import type * as Types from './v1-types';
import { parseRtkArgs } from '@/shared/utils/parseRtkArgs';

export const v1Api = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<Types.GetMeOutput, void>({
      query: () => ({
        url: '/api/v1/authors/me',
        method: 'GET',
      }),
    }),
    getOrders: builder.query<Types.GetOrdersOutput, Types.GetOrdersInput>({
      query: (params) => ({
        url: '/api/v1/orders',
        method: 'GET',
        params,
      }),
    }),
    getStats: builder.query<Types.GetStatsOutput, Types.GetStatsInput>({
      query: () => ({
        url: '/api/v1/orders/stats',
        method: 'GET',
      }),
    }),
    getSettings: builder.query<Types.GetSettingsOutput, void>({
      query: () => ({
        url: '/api/v1/settings',
        method: 'GET',
      }),
    }),
    orderApprove: builder.mutation<
      Types.OrderApproveOutput,
      Types.OrderApproveInput
    >({
      query: ({ id }) => ({
        url: `/api/v1/orders/${id}/approve`,
        method: 'POST',
      }),
      onQueryStarted: async (
        { id },
        { dispatch, queryFulfilled, getState },
      ) => {
        const target: keyof typeof v1Api.endpoints = 'getOrders';
        try {
          await queryFulfilled;

          for (const queryCache of Object.keys(getState().api.queries)) {
            if (!queryCache.includes(target)) continue;
            const args = extractParenthesesContent(queryCache);
            if (!args) continue;

            dispatch(
              v1Api.util.updateQueryData(
                target,
                parseRtkArgs(args),
                (draft) => {
                  draft.items.forEach((e) => {
                    if (e.id === id && e.payment) {
                      e.payment.needApproval = false;
                    }
                  });
                },
              ),
            );
          }
        } catch (e) {}
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
  useGetStatsQuery,
  useGetSettingsQuery,
} = v1Api;
