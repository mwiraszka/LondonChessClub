import { createAction, props } from '@ngrx/store';

import type { Toast } from '@app/types';

enum ToasterActionTypes {
  TOAST_ADDED = '[Toaster] Toast added',
  TOAST_EXPIRED = '[Toaster] Toast expired',
}

export const toastAdded = createAction(
  ToasterActionTypes.TOAST_ADDED,
  props<{ toast: Toast }>()
);

export const toastExpired = createAction(
  ToasterActionTypes.TOAST_EXPIRED,
  props<{ toast: Toast }>()
);
