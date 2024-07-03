import { Action, createReducer, on } from '@ngrx/store';

import * as UserSettingsActions from './user-settings.actions';
import { UserSettingsState, initialState } from './user-settings.state';

const userSettingsReducer = createReducer(
  initialState,

  on(UserSettingsActions.toggleThemeMode, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  })),

  on(UserSettingsActions.clearUpcomingEventBanner, (state) => ({
    ...state,
    showUpcomingEventBanner: false,
    bannerlastCleared: new Date().getTime(),
  })),

  on(UserSettingsActions.reinstateUpcomingEventBanner, (state) => ({
    ...state,
    showUpcomingEventBanner: true,
    bannerlastCleared: null,
  }))
);

export function reducer(state: UserSettingsState, action: Action): UserSettingsState {
  return userSettingsReducer(state, action);
}
