import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';
import { RootState } from './';
import {
  createRestaurant,
  fetchRestaurantById,
  fetchLinksSubcollection,
  updateRestaurantBasicInfo,
  updateRestaurantAboutInfo,
  updateRestaurantCoverImage,
  updateRestaurantProfileImage,
  updateLinks,
  updateThemeSettings,
  getAllMenus,
} from '@/API/restaurant';
import {
  RestaurantDataType,
  BasicInfoFormDataTypes,
  AboutFormDataTypes,
  LinkType,
  ThemeSettingsType,
  ColorType,
} from '@/types/restaurant';
import {
  MenuType,
} from '@/types/menu';
import { startLoading, stopLoading } from './loadingCenter';
import { setNotification } from './notificationCenter';
import { addRestaurantToUser, setActiveRestaurant } from './user';

interface RestaurantState {
  restaurant: RestaurantDataType | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurant: null,
  loading: false,
  error: null,
};

export const saveRestaurant = createAsyncThunk(
  'restaurant/saveRestaurant',
  async (
    { userId, restaurantData }: { userId: string; restaurantData: RestaurantDataType }, 
    { rejectWithValue, dispatch }
  ) => {
    dispatch(startLoading('Creating restaurant...'));
    try {
      const response = await createRestaurant(userId, restaurantData);

      if ('restaurant' in response && response.success) {
        restaurantData.id = response.restaurant.id

        const sanitizedRestaurantData = {
          ...restaurantData,
          userId,
          coverImageData: {
          url: response.restaurant.data.coverImageData?.url || null
          },
          profileImageData: { 
            url: response.restaurant.data.profileImageData ? response.restaurant.data.profileImageData.url : null, 
            base64: restaurantData.profileImageData ? restaurantData.profileImageData.base64 : null
          },
          createdOn: restaurantData.createdOn,
        };
        dispatch(addRestaurantToUser({restaurantId: response.restaurant.id, restaurantTitle: response.restaurant.title}))
        dispatch(setActiveRestaurant(response.restaurant.id))
        dispatch(stopLoading())
        return sanitizedRestaurantData;
      } else {
        dispatch(stopLoading())
        return rejectWithValue('Failed to create restaurant');
      }
    } catch (error) {
      dispatch(stopLoading())
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRestaurantLinks = createAsyncThunk(
  'restaurant/fetchRestaurantLinks',
  async ({ userId, restaurantId }: { userId: string; restaurantId: string }, { rejectWithValue }) => {
    try {
      const socialLinksResponse = await fetchLinksSubcollection(userId, restaurantId, 'social');
      const customLinksResponse = await fetchLinksSubcollection(userId, restaurantId, 'custom');
      return { social: socialLinksResponse, custom: customLinksResponse };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const getRestaurantById = createAsyncThunk<RestaurantDataType, { userId: string; restaurantId: string; restaurantData?: RestaurantDataType }, { rejectWithValue: Function, state: RootState }>(
  'restaurant/getRestaurantById',
  async (
    { userId, restaurantId, restaurantData },
    { rejectWithValue, dispatch }
  ) => {
    
    if (restaurantData) {
      if (restaurantData.createdOn) {
        const jsDateCreatedOn = new Date(restaurantData.createdOn);
        restaurantData.createdOn = formatISO(jsDateCreatedOn);
      }
      dispatch(fetchRestaurantLinks({ userId, restaurantId }));
      console.log('restaurant data existed from ssr')
      return restaurantData;
    }

    dispatch(startLoading('Almost ready to roll...'));
    try {
      const response = await fetchRestaurantById(userId, restaurantId);

      if (response.success) {
        let restaurantData = response.data;
        restaurantData.id = restaurantId;
        
        if (response.data?.createdOn) {
          const jsDateCreatedOn = new Date(response.data.createdOn);
          restaurantData.createdOn = formatISO(jsDateCreatedOn);
        }
        dispatch(stopLoading());
        dispatch(fetchRestaurantLinks({ userId, restaurantId }));
  
        return restaurantData;
      } else {
        dispatch(stopLoading());
        return rejectWithValue('Failed to fetch restaurant');
      }
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateBasicInfo = createAsyncThunk(
  'restaurant/updateBasicInfo',
  async (
    { userId, restaurantId, formData }: {
      userId: string;
      restaurantId: string;
      formData: BasicInfoFormDataTypes;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateRestaurantBasicInfo(userId, restaurantId, formData);
      console.log('xxx')
      console.log(response)
      if (response.success) {
        dispatch(setNotification({ message: 'Changes Saved', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return formData;
      } else {
        return rejectWithValue('Failed to update basic info');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAboutInfo = createAsyncThunk(
  'restaurant/updateAboutInfo',
  async ({ userId, restaurantId, formData }: { userId: string; restaurantId: string; formData: AboutFormDataTypes }, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateRestaurantAboutInfo(userId, restaurantId, formData);
      if (response.success) {
        dispatch(setNotification({ message: 'Changes Saved', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return formData;
      } else {
        return rejectWithValue('Failed to update about info');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  'restaurant/updateCoverImage',
  async (
    { userId, restaurantId, coverImageData }: { userId: string; restaurantId: string; coverImageData: { url: string | null; base64: string; blob: Blob } },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(startLoading('Updating cover image...'));
    try {
      const updatedImagesResponse = await updateRestaurantCoverImage(userId, restaurantId, coverImageData);
      if (updatedImagesResponse.success) {
        const mergedData = {
          coverImageData: { url: coverImageData.url },
        };
        dispatch(stopLoading());
        dispatch(setNotification({ message: 'Cover image updated successfully', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return mergedData;
      } else {
        dispatch(stopLoading());
        return rejectWithValue('Failed to update cover image');
      }
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  'restaurant/updateProfileImage',
  async (
    { userId, restaurantId, profileImageData }: { userId: string; restaurantId: string; profileImageData: { url: string | null; base64: string; blob: Blob } },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(startLoading('Updating profile image...'));
    try {
      const updatedImagesResponse = await updateRestaurantProfileImage(userId, restaurantId, profileImageData);
      if (updatedImagesResponse.success) {
        const mergedData = {
          profileImageData: { url: profileImageData.url },
        };
        dispatch(stopLoading());
        dispatch(setNotification({ message: 'Profile image updated successfully', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return mergedData;
      } else {
        dispatch(stopLoading());
        return rejectWithValue('Failed to update profile image');
      }
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRestaurantLinks = createAsyncThunk(
  'restaurant/updateRestaurantLinks',
  async (
    { userId, restaurantId, links }: {userId: string, restaurantId: string, links: { social: LinkType[], custom: LinkType[] }},
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateLinks(userId, restaurantId, links);
      if (response.success) {
        dispatch(setNotification({ message: 'Changes Saved', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return links;
      } else {
        dispatch(setNotification({ message: 'Failed to update links', type: 'error', horizontal: 'right', vertical: 'top' }));
        return rejectWithValue('Failed to update links');
      }
      
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to update links', type: 'error', horizontal: 'right', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateThemeSettingsData = createAsyncThunk(
  'restaurant/updateThemeSettings',
  async (
    { userId, restaurantId, themeSettings, favoriteColors }: { userId: string, restaurantId: string, themeSettings: ThemeSettingsType, favoriteColors: ColorType[]},
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateThemeSettings(userId, restaurantId, themeSettings, favoriteColors);
      if (response.success) {
        dispatch(setNotification({ message: 'Changes Saved', type: 'success', horizontal: 'center', vertical: 'bottom' }));
        return { themeSettings, favoriteColors };
      } else {
        dispatch(setNotification({ message: 'Failed to update theme', type: 'error', horizontal: 'center', vertical: 'bottom' }));
        return rejectWithValue('Failed to update theme');
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to update theme', type: 'error', horizontal: 'center', vertical: 'bottom' }));
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchAllRestaurantMenus = createAsyncThunk(
  'restaurant/fetchAllRestaurantMenus',
  async ({ userId, restaurantId }: { userId: string; restaurantId: string }, { rejectWithValue, dispatch }) => {    
    try {
      const response = await getAllMenus(userId, restaurantId);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    updateRestaurant: (state, action) => {
      state.restaurant = { ...state.restaurant, ...action.payload };
    },
    updateMenus: (state, action: PayloadAction<MenuType>) => {
      if (state.restaurant && state.restaurant.menus) {
        state.restaurant.menus.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRestaurant.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveRestaurant.fulfilled, (state, action: PayloadAction<RestaurantDataType>) => {
        state.loading = false;
        state.restaurant = action.payload;
        state.error = null;
      })
      .addCase(saveRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchRestaurantLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurant = {
          ...state.restaurant,
          links: action.payload,
        };
        state.error = null;
      })
      .addCase(fetchRestaurantLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(getRestaurantById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRestaurantById.fulfilled, (state, action: PayloadAction<RestaurantDataType>) => {
        state.loading = false;
        state.restaurant = action.payload;
        state.error = null;
      })
      .addCase(getRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateBasicInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBasicInfo.fulfilled, (state, action: PayloadAction<BasicInfoFormDataTypes>) => {
        if (state.restaurant) {
          console.log('ful')
          state.restaurant.basicInfoData = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateAboutInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAboutInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurant = {
          ...state.restaurant,
          aboutData: action.payload,
        };
        state.error = null;
      })
      .addCase(updateAboutInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateCoverImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        if (state.restaurant) {
          state.restaurant.coverImageData = action.payload.coverImageData;
          state.loading = false;
          state.error = null;
        }
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        if (state.restaurant) {
          state.restaurant.profileImageData = action.payload.profileImageData;
          state.loading = false;
          state.error = null;
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateRestaurantLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRestaurantLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurant = {
          ...state.restaurant,
          links: {
            social: action.payload.social,
            custom: action.payload.custom,
          },
        };
        state.error = null;
      })
      .addCase(updateRestaurantLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateThemeSettingsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateThemeSettingsData.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurant = {
          ...state.restaurant,
          themeSettings: action.payload.themeSettings,
          favoriteColors: action.payload.favoriteColors,
        };
        state.error = null;
      })
      .addCase(updateThemeSettingsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAllRestaurantMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRestaurantMenus.fulfilled, (state, action: PayloadAction<MenuType[] | undefined>) => {
        state.loading = false;
        if (action.payload) { 
          state.restaurant = {
            ...state.restaurant,
            menus: action.payload,
          };
       }
        state.error = null;
      })
      .addCase(fetchAllRestaurantMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });   
  },
});

export const { updateRestaurant, updateMenus } = restaurantSlice.actions;
export default restaurantSlice.reducer;