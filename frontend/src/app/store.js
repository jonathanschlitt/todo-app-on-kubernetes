import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../api/auth/authSlice';
import todoReducer from '../api/todo/todoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});
