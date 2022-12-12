import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import todoService from './todoService';

const initialState = {
  todos: [],
  originalTodos: [],
  todo: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth.user;
      return await todoService.getTodos(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth.user;
      return await todoService.addTodo(todo, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth.user;
      return await todoService.updateTodo(todo, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth.user;
      return await todoService.deleteTodo(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  // normal functions => i.e. reset function
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    searchTodos: (state, action) => {
      const search = action.payload;
      console.log(search);
      if (search.length === 0) {
        state.todos = state.originalTodos;
      } else {
        state.todos = state.originalTodos.filter((todo) => {
          return todo.name.toLowerCase().includes(search.toLowerCase());
        });
      }
    },
  },
  // Async thunks => asynchronous functions go there
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = action.payload; // return value from thunk
        state.originalTodos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // returned error from thunk ==> rejectWithValue
        state.todos = null;
        state.originalTodos = null;
      })
      .addCase(addTodo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = [...state.todos, action.payload];
        state.originalTodos = [...state.originalTodos, action.payload];
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTodo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
        state.originalTodos = state.originalTodos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteTodo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        state.originalTodos = state.originalTodos.filter(
          (todo) => todo._id !== action.payload
        );
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, searchTodos } = todoSlice.actions;
export default todoSlice.reducer;

// We can also use RTK Query to handle async requests
