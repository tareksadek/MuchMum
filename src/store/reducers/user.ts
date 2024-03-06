import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { UserType } from '@/types/user';
import { RestaurantDataType } from '@/types/restaurant';
import { getUserByRestaurantSuffix, getUserById } from '@/API/user';
import { startLoading, stopLoading } from './loadingCenter';
import { getRestaurantById } from './restaurant';
import { RootState } from '.';

export interface ResponseType<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const initialState: {
  user: UserType | null;
  loading: boolean;
  error: string | null;
} = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk<UserType, string, { rejectWithValue: Function, state: RootState }>(
  'user/fetchUser',
  async (userId: string, { rejectWithValue, getState, dispatch }) => {
    console.log('ppppp')
    dispatch(startLoading('Bringing your card to life...'));
    try {
      const response: ResponseType<UserType> = await getUserById(userId) as ResponseType<UserType>;
      const appSetup = getState().setup.setup;

      if (response.success && response.data) {
        const formattedData: UserType = {
          ...response.data,
          createdOn: response.data.createdOn ? format(new Date(response.data.createdOn), 'yyyy-MMM-dd') : null,
          lastLogin: response.data.lastLogin ? format(new Date(response.data.lastLogin), 'yyyy-MMM-dd') : null,
          redirect: appSetup?.redirect ? appSetup.redirect : response.data.redirect
        };

        console.log(formattedData);
        

        if (formattedData.activeRestaurantId) {
          console.log('fetching restaurant action');
          dispatch(getRestaurantById({userId, restaurantId: formattedData.activeRestaurantId}));
        }

        if (formattedData.isAdmin) {
          console.log('fetching admin action');
        }

        dispatch(stopLoading());
        return formattedData;
      } else {
        // Handle failure case
        dispatch(stopLoading());
        return rejectWithValue('Card does not exist.');
      }
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserByRestaurantSuffix = createAsyncThunk<UserType, 
  { restaurantSuffix: string; userData?: UserType; restaurantData?: RestaurantDataType }, 
  { rejectWithValue: Function, state: RootState }
>(
  'user/fetchUserByRestaurantSuffix',
  async ({ restaurantSuffix, userData, restaurantData }, { rejectWithValue, dispatch, getState }) => {
    if (userData) {
      // const formattedData: UserType = {
      //   ...userData,
      //   createdOn: userData.createdOn ? format(new Date(userData.createdOn), 'yyyy-MMM-dd') : null,
      //   lastLogin: userData.lastLogin ? format(new Date(userData.lastLogin), 'yyyy-MMM-dd') : null,
      //   redirect: userData.redirect || null
      // };
      if (userData.activeRestaurantId) {
        dispatch(getRestaurantById({userId: userData.id, restaurantId: userData.activeRestaurantId, restaurantData}));
      }
      console.log('user data existed from ssr')

      return userData;
    } else {
      dispatch(startLoading('Bringing card to life...'));
      try {
        const response: ResponseType<UserType> = await getUserByRestaurantSuffix(restaurantSuffix);

        if (response.success && response.data) {
          const formattedData: UserType = {
            ...response.data,
            createdOn: response.data.createdOn ? format(new Date(response.data.createdOn), 'yyyy-MMM-dd') : null,
            lastLogin: response.data.lastLogin ? format(new Date(response.data.lastLogin), 'yyyy-MMM-dd') : null,
            redirect: response.data.redirect || null
          };

          if (formattedData.activeRestaurantId && !restaurantData) {
            dispatch(getRestaurantById({userId: formattedData.id, restaurantId: formattedData.activeRestaurantId}));
          }

          return formattedData;
        } else {
          return rejectWithValue('Restaurant does not exist.');
        }
      } catch (error) {
        return rejectWithValue((error as Error).message);
      } finally {
        dispatch(stopLoading());
      }
    }
  }
);


// export const redirectUser = createAsyncThunk('user/redirectUser', async ({ userId, redirectData }, { rejectWithValue }) => {
//   try {
//     const response = await redirectUserProfiles(userId, redirectData);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response.data);
//   }
// });

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addRestaurantToUser: (state, action) => {
      if (!state.user || !state.user.restaurantList) return;
      state.user.restaurantList.push(action.payload);
    },
    setActiveRestaurant: (state, action) => {
      if (!state.user) return;
      state.user.activeRestaurantId = action.payload.restaurantId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

    builder
      .addCase(fetchUserByRestaurantSuffix.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserByRestaurantSuffix.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserByRestaurantSuffix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

    // builder
    //   .addCase(redirectUser.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(redirectUser.fulfilled, (state, action) => {
    //     if (!state.user) return state;
    //     state.loading = false;
    //     state.user.redirect = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(redirectUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
  },
});

export const { updateUser, addRestaurantToUser, setActiveRestaurant } = userSlice.actions;
export default userSlice.reducer;
