import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const selectSetupState = (state: RootState) => state.setup.setup;
const getLoadingSetup = (state: RootState) => state.setup.loading;

export const setupSelector = createSelector(
  [selectSetupState, getLoadingSetup],
  (setup, loadingSetup) => ({
    setup,
    loadingSetup
  })
);
