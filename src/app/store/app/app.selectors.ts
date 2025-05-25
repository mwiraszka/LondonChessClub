import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppState } from './app.reducer';

export const selectAppState = createFeatureSelector<AppState>('appState');

export const selectIsDarkMode = createSelector(selectAppState, state => state.isDarkMode);

export const selectIsSafeMode = createSelector(selectAppState, state => state.isSafeMode);

export const selectShowUpcomingEventBanner = createSelector(
  selectAppState,
  state => state.showUpcomingEventBanner,
);

export const selectBannerLastCleared = createSelector(
  selectAppState,
  state => state.bannerLastCleared,
);
