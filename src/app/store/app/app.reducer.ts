import { createReducer, on } from '@ngrx/store';
import moment from 'moment-timezone';

import * as AppActions from './app.actions';
import { AppState, initialState } from './app.state';

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

  on(
    AppActions.toastAdded,
    (state, action): AppState => ({
      ...state,
      toasts: [...state.toasts.slice(-2), action.toast],
    }),
  ),

  on(
    AppActions.toastExpired,
    (state, action): AppState => ({
      ...state,
      toasts: state.toasts.filter(toast => toast !== action.toast),
    }),
  ),
);
