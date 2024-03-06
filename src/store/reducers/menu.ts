import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './';
import {
  createMenu,
  createMenuSection,
  createMenuItem,
  editMenuSection,
  editMenuItem,
  updateSectionSortOrder,
  updateItemSortOrder,
  fetchMenu,
} from '@/API/restaurant';
import {
  MenuType,
  MenuSectionType,
  MenuItemType
} from '@/types/menu';
import { startLoading, stopLoading } from './loadingCenter';
import { updateMenus } from './restaurant';
import { setNotification } from './notificationCenter';

interface MenuState {
  menu: MenuType | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menu: null,
  loading: false,
  error: null,
};

export const createRestaurantMenu = createAsyncThunk<MenuType | undefined, { userId: string; restaurantId: string; menuData?: MenuType }, { rejectWithValue: Function, state: RootState }>(
  'restaurant/createMenu',
  async (
    { userId, restaurantId, menuData },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(startLoading('Creating menu...')); 
    if (menuData) {
      try {
        const response = await createMenu(userId, restaurantId, menuData);
  
        if (response.success && response.data) {
          dispatch(stopLoading());
          dispatch(updateMenus(response.data))
          return response.data;
        } else {
          dispatch(stopLoading());
          return rejectWithValue(response.error);
        }
      } catch (error) {
        dispatch(stopLoading());
        return rejectWithValue((error as Error).message);
      }
    } else {
      dispatch(stopLoading());
      return rejectWithValue("Error: Menu data not available");
    }
  }
);

export const createRestaurantMenuSection = createAsyncThunk(
  'restaurant/createMenuSection',
  async (
    { userId, restaurantId, menuId, sectionData }: { userId: string; restaurantId: string; menuId: string; sectionData: MenuSectionType },
    { rejectWithValue }
  ) => {
    try {
      const response = await createMenuSection(userId, restaurantId, menuId, sectionData);

      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createRestaurantMenuItem = createAsyncThunk(
  'restaurant/createMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; itemData: MenuItemType },
    { rejectWithValue }
  ) => {
    try {
      const response = await createMenuItem(userId, restaurantId, menuId, sectionId, itemData);

      if (response.success && response.data) {
        // Include sectionId in the returned payload for easier reducer handling
        return { ...response.data, sectionId }; // Assumes response.data is the item data
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editRestaurantSection = createAsyncThunk(
  'restaurant/editMenuSection',
  async (
    { userId, restaurantId, menuId, sectionId, sectionData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; sectionData: MenuSectionType },
    { rejectWithValue }
  ) => {
    try {
      const response = await editMenuSection(userId, restaurantId, menuId, sectionId, sectionData);

      // Check if the operation was successful and 'data' is present
      if ('success' in response && response.success && 'data' in response && response.data) {
        response.data.id = sectionId
        return response.data
      } else if ('error' in response) {
        // Handle the case where 'error' is present
        return rejectWithValue(response.error);
      } else {
        // Handle any unexpected response shape
        return rejectWithValue("Unexpected response from editMenuSection");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editRestaurantMenuItem = createAsyncThunk(
  'restaurant/editMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemId, itemData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; itemId: string; itemData: MenuItemType },
    { rejectWithValue }
  ) => {
    try {
      const response = await editMenuItem(userId, restaurantId, menuId, sectionId, itemId, itemData);

      if ('success' in response && response.success && 'data' in response && response.data) {
        response.data.id = itemId
        return response.data
      } else if ('error' in response){
        return rejectWithValue(response.error);
      } else {
        return rejectWithValue("Unexpected response from editMenuItem");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sortRestaurantSection = createAsyncThunk(
  'restaurant/sortSection',
  async (
    { userId, restaurantId, menuId, sectionId, newSortOrder }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; newSortOrder: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSectionSortOrder(userId, restaurantId, menuId, sectionId, newSortOrder);

      if (response.success) {
        return { sectionId, newSortOrder };
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sortRestaurantMenuItem = createAsyncThunk(
  'restaurant/sortMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemId, newSortOrder }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; itemId: string; newSortOrder: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateItemSortOrder(userId, restaurantId, menuId, sectionId, itemId, newSortOrder);

      if (response.success) {
        // Return the sectionId, itemId, and newSortOrder to reflect changes in the state
        return { sectionId, itemId, newSortOrder };
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRestaurantMenu = createAsyncThunk<
  MenuType,
  { userId: string; restaurantId: string; menuId: string },
  { rejectValue: string }
>(
  'menu/fetchRestaurantMenu',
  async ({ userId, restaurantId, menuId }, { rejectWithValue }) => {
    try {
      const response = await fetchMenu(userId, restaurantId, menuId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || "An unexpected error occurred");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const menuSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    updateMenu: (state, action) => {
      state.menu = { ...state.menu, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurantMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuType | undefined>) => {
        state.loading = false;
        if (action.payload) { 
          state.menu = {
            ...action.payload,
          };
       }
        state.error = null;
      })
      .addCase(createRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createRestaurantMenuSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurantMenuSection.fulfilled, (state, action: PayloadAction<MenuSectionType>) => {
        state.loading = false;
        if (state.menu) {
          if (!state.menu.sections) {
            state.menu.sections = [];
          }
          
          state.menu.sections.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createRestaurantMenuSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createRestaurantMenuItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurantMenuItem.fulfilled, (state, action: PayloadAction<MenuItemType>) => {
        state.loading = false;
        // Ensure payload is not null or undefined before proceeding
        if (action.payload) {
          const sectionIndex = state.menu?.sections?.findIndex(s => s.id === action.payload.sectionId);
          if (sectionIndex !== undefined && sectionIndex !== -1 && state.menu && state.menu.sections) {
            // Ensure there's an items array to push to
            if (!state.menu.sections[sectionIndex].items) {
              state.menu.sections[sectionIndex].items = [];
            }
            // Push the new item, omitting the sectionId for the stored item
            const { sectionId, ...itemWithoutSectionId } = action.payload;
            state.menu.sections![sectionIndex].items!.push(itemWithoutSectionId);
          }
        } else {
          console.error('Failed to add the menu item, payload is null or undefined');
        }
        state.error = null;
      })
      .addCase(createRestaurantMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editRestaurantSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRestaurantSection.fulfilled, (state, action: PayloadAction<MenuSectionType>) => {
        state.loading = false;
        if (state.menu && state.menu?.sections) {
          const index = state.menu.sections.findIndex(section => section.id === action.payload.id);
          if (index !== -1) {
            state.menu.sections[index] = { ...action.payload };
          }
        }
        state.error = null;
      })
      .addCase(editRestaurantSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editRestaurantMenuItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRestaurantMenuItem.fulfilled, (state, action: PayloadAction<MenuItemType>) => {
        state.loading = false;
        // Locate the section and then the item to update
        const sectionIndex = state.menu?.sections?.findIndex(section => section.id === action.payload.sectionId);
        if (state.menu && sectionIndex !== undefined && sectionIndex >= 0) {
          // Asserting the existence of `sections` array with non-null assertion operator (!)
          const items = state.menu.sections![sectionIndex].items!;
          const itemIndex = items.findIndex(item => item.id === action.payload.id);
          if (itemIndex !== -1) {
            items[itemIndex] = { ...action.payload };
          }
        }
        state.error = null;
      })
      .addCase(editRestaurantMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sortRestaurantSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(sortRestaurantSection.fulfilled, (state, action: PayloadAction<{ sectionId: string; newSortOrder: number }>) => {
        state.loading = false;
        if (state.menu?.sections) {
          const { sectionId, newSortOrder } = action.payload;
          const sectionIndex = state.menu.sections.findIndex(section => section.id === sectionId);
          if (sectionIndex !== -1) {
            // Update the sortOrder of the section
            state.menu.sections[sectionIndex].sortOrder = newSortOrder;
            // Optionally, you might want to sort the sections array based on sortOrder here
            state.menu.sections.sort((a, b) => a.sortOrder - b.sortOrder);
          }
        }
        state.error = null;
      })
      .addCase(sortRestaurantSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sortRestaurantMenuItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(sortRestaurantMenuItem.fulfilled, (state, action: PayloadAction<{ sectionId: string; itemId: string; newSortOrder: number }>) => {
        state.loading = false;
        const { sectionId, itemId, newSortOrder } = action.payload;

        // Find the section and item to update
        const section = state.menu?.sections?.find(section => section.id === sectionId);
        if (section) {
          const itemIndex = section.items?.findIndex(item => item.id === itemId);
          if (itemIndex !== undefined && itemIndex >= 0) {
            // Update the sortOrder of the item
            if (section.items) {
              section.items[itemIndex].sortOrder = newSortOrder;
              // Optionally, you might want to sort the items array based on sortOrder here
              section.items.sort((a, b) => a.sortOrder - b.sortOrder);
            }
          }
        }
        state.error = null;
      })
      .addCase(sortRestaurantMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuType | undefined>) => {
        state.loading = false;
        if (action.payload) { 
          state.menu = action.payload
        };
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set the error message
      });
  },
});

export const { updateMenu } = menuSlice.actions;
export default menuSlice.reducer;