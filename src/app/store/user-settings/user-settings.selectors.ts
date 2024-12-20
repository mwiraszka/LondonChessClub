import { createFeatureSelector, createSelector } from '@ngrx/store';

import { StoreFeatures } from '@app/types';

import { UserSettingsState } from './user-settings.state';

export const selectUserSettingsState = createFeatureSelector<UserSettingsState>(
  StoreFeatures.USER_SETTINGS,
);

export const selectIsDarkMode = createSelector(
  selectUserSettingsState,
  state => state.isDarkMode,
);

export const selectIsSafeMode = createSelector(
  selectUserSettingsState,
  state => state.isSafeMode,
);

export const selectShowUpcomingEventBanner = createSelector(
  selectUserSettingsState,
  state => state.showUpcomingEventBanner,
);

export const selectBannerLastCleared = createSelector(
  selectUserSettingsState,
  state => state.bannerLastCleared,
);
