import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoadingState = {
  loadingCounter: number;
  loadingMessages: string[];
};

const initialState: LoadingState = {
  loadingCounter: 0,
  loadingMessages: [],
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction<string>) {
      state.loadingCounter += 1;
      state.loadingMessages.push(action.payload);
    },
    stopLoading(state) {
      state.loadingCounter = Math.max(0, state.loadingCounter - 1);
      if (state.loadingMessages.length > 0) {
        state.loadingMessages.shift();
      }
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

