import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EventsSelectors } from '@app/store/events';
import { NotificationsSelectors } from '@app/store/notifications';

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

export const selectAppViewModel = createSelector({
  isDarkMode: selectIsDarkMode,
  showUpcomingEventBanner: selectShowUpcomingEventBanner,
  bannerLastCleared: selectBannerLastCleared,
  nextEvent: EventsSelectors.selectNextEvent,
  toasts: NotificationsSelectors.selectToasts,
});
