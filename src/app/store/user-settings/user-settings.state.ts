import { isSystemDark } from '@app/utils';

export interface UserSettingsState {
  bannerlastCleared: number | null;
  isDarkMode: boolean;
  showUpcomingEventBanner: boolean;
}

export const initialState: UserSettingsState = {
  bannerlastCleared: null,
  isDarkMode: isSystemDark(),
  showUpcomingEventBanner: true,
};
