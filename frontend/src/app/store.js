import { configureStore } from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth/authApi';
import { todoApi } from './services/todo/todoApi';

import authReducer from '../app/services/auth/authSlice';
import todoReducer from '../app/services/todo/todoSlice';

// console.log('authApi', authApi);
// console.log('todoApi', todoApi);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    [authApi.reducerPath]: authApi.reducer,
    [todoApi.reducerPath]: todoApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, todoApi.middleware),
});

setupListeners(store.dispatch);
