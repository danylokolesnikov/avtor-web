import { extractParenthesesContent } from '@/shared/utils/extractParenthesesContent';
import { api } from '..';
import { v1Api } from '../v1';

import type * as Types from './v1-admin-types';
import { parseRtkArgs } from '@/shared/utils/parseRtkArgs';

export const v1AdminApi = api.enhanceEndpoints({}).injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<
      Types.GetAdminStatsOutput,
      Types.GetAdminStatsInput
    >({
      query: (params) => ({
        url: '/api/v1/admin/stats',
        method: 'GET',
        params,
      }),
    }),
    updateApprovalSettings: builder.mutation<
      Types.UpdateApprovalSettingsOutput,
      Types.UpdateApprovalSettingsInput
    >({
      query: (body) => ({
        url: `/api/v1/settings/approval`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async (body, { dispatch, queryFulfilled, getState }) => {
        const target: keyof typeof v1Api.endpoints = 'getSettings';
        try {
          await queryFulfilled;

          for (const queryCache of Object.keys(getState().api.queries)) {
            if (!queryCache.includes(target)) continue;
            const args = extractParenthesesContent(queryCache);

            if (!args) continue;

            dispatch(
              v1Api.util.updateQueryData(target, parseRtkArgs(args), (draft) => {
                draft.approval = body.value;
                return draft;
              }),
            );
          }
        } catch (e) {}
      },
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useLazyGetAdminStatsQuery,
  useUpdateApprovalSettingsMutation,
} = v1AdminApi;
