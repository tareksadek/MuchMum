import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const getUserId = (state: RootState) => state.authUser.userId;
const getIsLoggedIn = (state: RootState) => state.authUser.isLoggedIn;
const getIsAdmin = (state: RootState) => state.user.user?.isAdmin;
const getCurrentUser = (state: RootState) => state.user.user;

export const authSelector = createSelector(
  [getUserId, getIsLoggedIn, getIsAdmin, getCurrentUser],
  (userId, isLoggedIn, isAdmin, currentUser) => ({
    userId,
    isLoggedIn,
    isAdmin,
    currentUser,
  })
);
