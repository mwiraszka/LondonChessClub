import type { Toast } from '@app/types';

export interface NotificationsState {
  toasts: Toast[];
}

export const initialState: NotificationsState = {
  toasts: [],
};
