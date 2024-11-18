import { createAction } from '@ngrx/store';

enum UserSettingsActionTypes {
  REINSTATE_UPCOMING_EVENT_BANNER = '[User Settings] Reinstate upcoming event banner',
  CLEAR_UPCOMING_EVENT_BANNER = '[User Settings] Clear upcoming event banner',
  TOGGLE_THEME = '[User Settings] Toggle theme',
  TOGGLE_SAFE_MODE = '[User Settings] Toggle safe mode',
}

export const clearUpcomingEventBanner = createAction(
  UserSettingsActionTypes.CLEAR_UPCOMING_EVENT_BANNER,
);

export const reinstateUpcomingEventBanner = createAction(
  UserSettingsActionTypes.REINSTATE_UPCOMING_EVENT_BANNER,
);

export const toggleTheme = createAction(UserSettingsActionTypes.TOGGLE_THEME);

export const toggleSafeMode = createAction(UserSettingsActionTypes.TOGGLE_SAFE_MODE);
