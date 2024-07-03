import { createAction } from '@ngrx/store';

enum UserSettingsActionTypes {
  REINSTATE_UPCOMING_EVENT_BANNER = '[User Settings] Reinstate upcoming event banner',
  CLEAR_UPCOMING_EVENT_BANNER = '[User Settings] Clear upcoming event banner',
  TOGGLE_THEME_MODE = '[User Settings] Toggle theme mode',
}

export const toggleThemeMode = createAction(UserSettingsActionTypes.TOGGLE_THEME_MODE);

export const clearUpcomingEventBanner = createAction(
  UserSettingsActionTypes.CLEAR_UPCOMING_EVENT_BANNER
);

export const reinstateUpcomingEventBanner = createAction(
  UserSettingsActionTypes.REINSTATE_UPCOMING_EVENT_BANNER
);
