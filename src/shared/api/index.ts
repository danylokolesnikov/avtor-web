import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_PROXY_API === 'true'
        ? '/api'
        : process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
  }),
  endpoints: () => ({}),
});
