import { IsoDate } from '@app/types';
import { isSystemDark } from '@app/utils';

export interface UserSettingsState {
  bannerLastCleared: IsoDate | null;
  isDarkMode: boolean;
  isSafeMode: boolean;
  showUpcomingEventBanner: boolean;
}

export const initialState: UserSettingsState = {
  bannerLastCleared: null,
  isDarkMode: isSystemDark(),
  isSafeMode: false,
  showUpcomingEventBanner: true,
};
