import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';

import { UserSettingsState } from './user-settings.state';

export const userSettingsFeatureSelector = createFeatureSelector<UserSettingsState>(
  AppStoreFeatureTypes.USER_SETTINGS,
);

export const isDarkMode = createSelector(
  userSettingsFeatureSelector,
  state => state.isDarkMode,
);

export const showUpcomingEventBanner = createSelector(
  userSettingsFeatureSelector,
  state => state.showUpcomingEventBanner,
);
