import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { api } from '..';

import type * as Types from './v1-types';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

const v1Api = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Types.GetOrdersOutput, Types.GetOrdersInput>({
      query: (params) => ({
        url: '/api/v1/orders',
        method: 'GET',
        params,
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
            const args = queryCache.match(/\((.*?)\)/g)?.[0].slice(1, -1);
            if (!args) continue;

            dispatch(
              v1Api.util.updateQueryData(
                'getOrders',
                JSON.parse(args),
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
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useOrderApproveMutation,
} = v1Api;
