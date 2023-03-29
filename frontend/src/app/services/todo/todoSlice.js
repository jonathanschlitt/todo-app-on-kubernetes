import { createSlice } from '@reduxjs/toolkit';
import { todoApi } from './todoApi';

const initialState = {
  todos: [],
  originalTodos: [],
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    reset: (state) => {
      state.todos = [];
      state.originalTodos = [];
    },
    searchTodos: (state, action) => {
      const search = action.payload;
      if (search.length === 0) {
        state.todos = state.originalTodos;
      } else {
        state.todos = state.originalTodos.filter((todo) => {
          return todo.name.toLowerCase().includes(search.toLowerCase());
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        todoApi.endpoints.getTodos.matchFulfilled,
        (state, action) => {
          state.todos = action.payload;
          state.originalTodos = action.payload;
        }
      )
      .addMatcher(todoApi.endpoints.addTodo.matchFulfilled, (state, action) => {
        console.log(action.payload);
        state.todos = [...state.todos, action.payload];
        state.originalTodos = [...state.originalTodos, action.payload];
      })

      .addMatcher(
        todoApi.endpoints.updateTodo.matchFulfilled,
        (state, action) => {
          state.todos = state.todos.map((todo) =>
            todo._id === action.payload._id ? action.payload : todo
          );
          state.originalTodos = state.originalTodos.map((todo) =>
            todo._id === action.payload._id ? action.payload : todo
          );
        }
      )

      .addMatcher(
        todoApi.endpoints.deleteTodo.matchFulfilled,
        (state, action) => {
          state.todos = state.todos.filter(
            (todo) => todo._id !== action.payload
          );
          state.originalTodos = state.originalTodos.filter(
            (todo) => todo._id !== action.payload
          );
        }
      );
  },
});

export const { reset, searchTodos, setTodos, addTodo, updateTodo, deleteTodo } =
  todoSlice.actions;
export default todoSlice.reducer;
