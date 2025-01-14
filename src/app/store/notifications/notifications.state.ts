import type { Toast } from '@app/models';

export interface NotificationsState {
  toasts: Toast[];
}

export const initialState: NotificationsState = {
  toasts: [],
};
