import type { IsoDate } from '@app/models';

export interface AppState {
  isDarkMode: boolean;
  isSafeMode: boolean;
  isSubmitting: boolean;
  bannerLastCleared: IsoDate | null;
  showUpcomingEventBanner: boolean;
}

export const initialState: AppState = {
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isSafeMode: false,
  isSubmitting: false,
  bannerLastCleared: null,
  showUpcomingEventBanner: true,
};
