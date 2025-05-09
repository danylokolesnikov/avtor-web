import { api } from '..';

import type * as Types from './auth-types';

export const authApi = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Types.LoginOutput, Types.LoginInput>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: (body) => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
