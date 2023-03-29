import { createSlice } from '@reduxjs/toolkit';

// Get user from local storage
const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: user ? user : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log(action.payload);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signUpSuccess: (state, action) => {
      console.log(action.payload);
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutSuccess: (state) => {
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess, signUpSuccess } = authSlice.actions;
export default authSlice.reducer;
