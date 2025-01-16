import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EventsSelectors } from '@app/store/events';
import { NotificationsSelectors } from '@app/store/notifications';

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

export const selectAppViewModel = createSelector({
  isDarkMode: selectIsDarkMode,
  showToaster: NotificationsSelectors.selectShowToaster,
  showUpcomingEventBanner: selectShowUpcomingEventBanner,
  bannerLastCleared: selectBannerLastCleared,
  nextEvent: EventsSelectors.selectNextEvent,
});
