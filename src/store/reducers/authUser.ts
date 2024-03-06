import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isLoading: true,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.userId = action.payload;
    },
    clearUser(state) {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.userId = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
