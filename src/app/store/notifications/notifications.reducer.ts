import { createReducer, on } from '@ngrx/store';

import * as AppActions from './notifications.actions';
import { NotificationsState, initialState } from './notifications.state';

export const appReducer = createReducer(
  initialState,

  on(
    AppActions.toastAdded,
    (state, action): NotificationsState => ({
      ...state,
      toasts: [...state.toasts.slice(-2), action.toast],
    }),
  ),

  on(
    AppActions.toastExpired,
    (state, action): NotificationsState => ({
      ...state,
      toasts: state.toasts.filter(toast => toast !== action.toast),
    }),
  ),
);
