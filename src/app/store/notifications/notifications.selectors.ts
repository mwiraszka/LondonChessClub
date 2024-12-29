import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NotificationsState } from './notifications.state';

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notifications');

export const selectToasts = createSelector(
  selectNotificationsState,
  state => state.toasts,
);

export const selectShowToaster = createSelector(
  selectNotificationsState,
  state => !!state.toasts,
);
