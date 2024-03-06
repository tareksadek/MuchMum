import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const restaurantState = (state: RootState) => state.restaurant.restaurant;
const restaurantLinksState = (state: RootState) => state.restaurant.restaurant?.links;
const restaurantMenusState = (state: RootState) => state.restaurant.restaurant?.menus;
const getLoadingRestaurant = (state: RootState) => state.restaurant.loading;

export const restaurantSelector = createSelector(
  [restaurantState, restaurantLinksState, restaurantMenusState, getLoadingRestaurant],
  (restaurant, restaurantLinks, restaurantMenus, loadingRestaurant) => ({
    restaurant,
    restaurantLinks,
    restaurantMenus,
    loadingRestaurant
  })
);
