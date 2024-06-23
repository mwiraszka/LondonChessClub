import { Action, createReducer, on } from '@ngrx/store';

import * as UserSettingsActions from './user-settings.actions';
import { UserSettingsState, initialState } from './user-settings.state';

const userSettingsReducer = createReducer(
  initialState,

  on(UserSettingsActions.toggleThemeMode, state => ({
    ...state,
    isDarkMode: !state.isDarkMode,
  })),

  on(UserSettingsActions.clearUpcomingEventBanner, state => ({
    ...state,
    showUpcomingEventBanner: false,
  })),
);

export function reducer(state: UserSettingsState, action: Action): UserSettingsState {
  return userSettingsReducer(state, action);
}
