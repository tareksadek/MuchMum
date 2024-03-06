import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const menuState = (state: RootState) => state.menu.menu;
const menuSectionsState = (state: RootState) => state.menu.menu?.sections;
const getLoadingMenu = (state: RootState) => state.restaurant.loading;

export const menuSelector = createSelector(
  [menuState, menuSectionsState, getLoadingMenu],
  (menu, menuSections, loadingMenu) => ({
    menu,
    menuSections,
    loadingMenu
  })
);