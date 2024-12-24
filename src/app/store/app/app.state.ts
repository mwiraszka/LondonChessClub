import { IsoDate, Toast } from '@app/types';
import { isSystemDark } from '@app/utils';

export interface AppState {
  isDarkMode: boolean;
  isSafeMode: boolean;
  bannerLastCleared: IsoDate | null;
  showUpcomingEventBanner: boolean;
  toasts: Toast[];
}

export const initialState: AppState = {
  isDarkMode: isSystemDark(),
  isSafeMode: false,
  bannerLastCleared: null,
  showUpcomingEventBanner: true,
  toasts: [],
};
