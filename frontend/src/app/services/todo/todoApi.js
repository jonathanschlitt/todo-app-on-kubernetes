import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const { REACT_APP_BACKEND_URL } = process.env;

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${REACT_APP_BACKEND_URL}/api/data`,
    cacheDuration: 1000 * 60,
    prepareHeaders: (headers, { getState }) => {
      const { token } = getState().auth.user;
      if (token) headers.set('Authorization', `${token}`);
      return headers;
    },
  }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => `/todos`,
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation({
      query: (todo) => {
        return {
          url: `/todos`,
          method: 'POST',
          body: todo,
        };
      },
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo._id}`,
        method: 'PUT',
        body: todo,
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
