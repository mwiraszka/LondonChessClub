import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { UserSettingsState } from './user-settings.state';

export const userSettingsFeatureSelector = createFeatureSelector<UserSettingsState>(
  StoreFeatures.USER_SETTINGS,
);

export const isDarkMode = createSelector(
  userSettingsFeatureSelector,
  state => state.isDarkMode,
);

export const showUpcomingEventBanner = createSelector(
  userSettingsFeatureSelector,
  state => state.showUpcomingEventBanner,
);

export const bannerLastCleared = createSelector(
  userSettingsFeatureSelector,
  state => state.bannerlastCleared,
);
