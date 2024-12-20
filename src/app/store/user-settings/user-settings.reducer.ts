import { Action, createReducer, on } from '@ngrx/store';
import moment from 'moment-timezone';

import * as UserSettingsActions from './user-settings.actions';
import { UserSettingsState, initialState } from './user-settings.state';

const userSettingsReducer = createReducer(
  initialState,

  on(UserSettingsActions.themeToggled, state => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  })),

  on(UserSettingsActions.safeModeToggled, state => ({
    ...state,
    isSafeMode: !state.isSafeMode,
  })),

  on(UserSettingsActions.upcomingEventBannerCleared, state => ({
    ...state,
    showUpcomingEventBanner: false,
    bannerLastCleared: moment().toISOString(),
  })),

  on(UserSettingsActions.upcomingEventBannerReinstated, state => ({
    ...state,
    showUpcomingEventBanner: true,
    bannerLastCleared: null,
  })),
);

export function reducer(state: UserSettingsState, action: Action): UserSettingsState {
  return userSettingsReducer(state, action);
}
