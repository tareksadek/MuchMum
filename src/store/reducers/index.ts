import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import setupReducer from './setup';
import loadingCenter from './loadingCenter';
import notificationReducer from './notificationCenter';
import authReducer from './authUser';
import userReducer from './user';
import modalReducer from './modal';
import restaurantReducer from './restaurant'
import menuReducer from './menu'

const rootReducer = combineReducers({
  loadingCenter: loadingCenter,
  notificationCenter: notificationReducer,
  modal: modalReducer,
  setup: setupReducer,
  authUser: authReducer,
  user: userReducer,
  restaurant: restaurantReducer,
  menu: menuReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const reducer = (state: RootState | undefined, action: any): RootState => {
  switch (action.type) {
    case HYDRATE:
      const nextState = {
        ...state,
        ...action.payload,
      };
      return nextState;
    default:
      return rootReducer(state, action);
  }
};

const store = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [HYDRATE],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.someField'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production' ? {
    trace: true,
    traceLimit: 25,
  } : false,
});

export const wrapper = createWrapper(store, { debug: process.env.NODE_ENV !== 'production' });
export type AppDispatch = ReturnType<typeof store>['dispatch'];