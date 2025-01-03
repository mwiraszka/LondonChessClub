import { createAction, props } from '@ngrx/store';

import type { Toast } from '@app/types';

export const toastAdded = createAction(
  '[Notifications] Toast added',
  props<{ toast: Toast }>(),
);

export const toastExpired = createAction(
  '[Notifications] Toast expired',
  props<{ toast: Toast }>(),
);