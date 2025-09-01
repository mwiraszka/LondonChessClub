import { createReducer, on } from '@ngrx/store';
import moment from 'moment-timezone';

import { IsoDate } from '@app/models';

import * as AppActions from './app.actions';

export interface AppState {
  isDarkMode: boolean;
  isSafeMode: boolean;
  bannerLastCleared: IsoDate | null;
  showUpcomingEventBanner: boolean;
  isGameArchivesLoading: boolean;
}

export const initialState: AppState = {
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isSafeMode: false,
  bannerLastCleared: null,
  showUpcomingEventBanner: true,
  isGameArchivesLoading: false,
};

export const appReducer = createReducer(
  initialState,

  on(
    AppActions.themeToggled,
    (state): AppState => ({
      ...state,
      isDarkMode: !state.isDarkMode,
    }),
  ),

  on(
    AppActions.safeModeToggled,
    (state): AppState => ({
      ...state,
      isSafeMode: !state.isSafeMode,
    }),
  ),

  on(
    AppActions.upcomingEventBannerCleared,
    (state): AppState => ({
      ...state,
      showUpcomingEventBanner: false,
      bannerLastCleared: moment().toISOString(),
    }),
  ),

  on(
    AppActions.upcomingEventBannerReinstated,
    (state): AppState => ({
      ...state,
      showUpcomingEventBanner: true,
      bannerLastCleared: null,
    }),
  ),
);
