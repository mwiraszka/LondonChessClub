import type { IsoDate } from '@app/types';

export interface AppState {
  isDarkMode: boolean;
  isSafeMode: boolean;
  bannerLastCleared: IsoDate | null;
  showUpcomingEventBanner: boolean;
}

export const initialState: AppState = {
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isSafeMode: false,
  bannerLastCleared: null,
  showUpcomingEventBanner: true,
};
