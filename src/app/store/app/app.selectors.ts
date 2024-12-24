import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EventsSelectors } from '@app/store/events';

import { AppState } from './app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

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

export const selectToasts = createSelector(selectAppState, state => state.toasts);

export const selectShowToaster = createSelector(selectAppState, state => !!state.toasts);

export const selectAppViewModel = createSelector({
  isDarkMode: selectIsDarkMode,
  showToaster: selectShowToaster,
  showUpcomingEventBanner: selectShowUpcomingEventBanner,
  bannerLastCleared: selectBannerLastCleared,
  nextEvent: EventsSelectors.selectNextEvent,
});
