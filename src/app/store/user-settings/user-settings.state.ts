export interface UserSettingsState {
  bannerlastCleared: number | null;
  isDarkMode: boolean;
  showUpcomingEventBanner: boolean;
}

export const initialState: UserSettingsState = {
  bannerlastCleared: null,
  isDarkMode: false,
  showUpcomingEventBanner: true,
};
