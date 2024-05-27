import { createAction } from '@ngrx/store';

enum UserSettingsActionTypes {
  TOGGLE_THEME_MODE = '[User Settings] Toggle theme mode',
}

export const toggleThemeMode = createAction(UserSettingsActionTypes.TOGGLE_THEME_MODE);
