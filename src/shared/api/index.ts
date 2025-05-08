import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type * as Types from './types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_PROXY_API === 'true'
        ? '/api'
        : process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Types.LoginOutput, Types.LoginInput>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    getOrders: builder.query<Types.GetOrdersOutput, Types.GetOrdersInput>({
      query: (params) => ({
        url: '/api/v1/orders',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetOrdersQuery, useLazyGetOrdersQuery } =
  api;
