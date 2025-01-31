import { createReducer, on } from '@ngrx/store';

import { Toast } from '@app/models';

import * as AppActions from './notifications.actions';

export interface NotificationsState {
  toasts: Toast[];
}

export const notificationsInitialState: NotificationsState = {
  toasts: [],
};

export const notificationsReducer = createReducer(
  notificationsInitialState,

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
