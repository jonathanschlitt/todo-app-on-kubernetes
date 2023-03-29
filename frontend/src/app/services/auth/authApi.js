import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const { REACT_APP_BACKEND_URL } = process.env;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${REACT_APP_BACKEND_URL}/api/auth`,
    cacheDuration: 1000 * 60,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: () => `/login`,

      query: (data) => {
        console.log('data', data);
        return {
          url: `/login`,
          method: 'POST',
          body: data,
        };
      },
      transformResponse: (response) => {
        console.log('response', response);
        const user = response;
        console.log('user', user);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response;
      },

      providesTags: [],
    }),
    signUp: builder.mutation({
      query: (data) => {
        console.log('data', data);
        return {
          url: `/signup`,
          method: 'POST',
          body: data,
        };
      },
      transformResponse: (response) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response;
      },
      providesTags: [],
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation } = authApi;
