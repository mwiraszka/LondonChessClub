export interface UserSettingsState {
  isDarkMode: boolean;
  showUpcomingEventBanner: boolean;
}

export const initialState: UserSettingsState = {
  isDarkMode: false,
  showUpcomingEventBanner: true,
};
