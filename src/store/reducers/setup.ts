import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDefaultSetup } from '@/API/setup';
import { defaults, main } from '@/setup/setup';
import { StaticSetup, FetchedSetup, SetupType } from '@/types/setup';

export const fetchSetup = createAsyncThunk(
  'setup/fetchSetup',
  async (_, thunkAPI) => {
    if (defaults.withDatabaseSetup) {
      try {
        const response = await fetchDefaultSetup();
        if (response.success) {
          const firestoreSetupData = response.data;
          const combinedSetupData: SetupType = {
            ...defaults as StaticSetup,
            ...firestoreSetupData as FetchedSetup
          };
          return combinedSetupData;
        } else {
          throw new Error('Failed to load setup data');
        }
      } catch (error) {
        return thunkAPI.rejectWithValue((error as Error).message);
      }
    } else {      
      const staticSetupData: SetupType = {
        ...defaults as StaticSetup,
        ...main as FetchedSetup
      };
      return staticSetupData
    }
  }
);

const initialState: {
  setup: SetupType | null;
  loading: boolean;
  error: string | null;
} = {
  setup: null,
  loading: false,
  error: null,
};

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    updateSetup: (state, action) => {
      state.setup = { ...state.setup, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSetup.pending, (state) => {      
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSetup.fulfilled, (state, action: PayloadAction<SetupType>) => {      
      state.loading = false;
      state.setup = action.payload;
      state.error = null;
    })
    .addCase(fetchSetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch setup';
    });
  },
});

export const { updateSetup } = setupSlice.actions;

export default setupSlice.reducer;
