import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState =
  createFeatureSelector<NotificationsState>('notificationsState');

export const selectToasts = createSelector(
  selectNotificationsState,
  state => state.toasts,
);
