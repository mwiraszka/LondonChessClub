import { createAction, props } from '@ngrx/store';

import type { Toast } from '@app/types';

export const toastAdded = createAction(
  '[Toaster] Toast added',
  props<{ toast: Toast }>(),
);

export const toastExpired = createAction(
  '[Toaster] Toast expired',
  props<{ toast: Toast }>(),
);

// TODO: Refactor all these misc. Toast/Modal stores as a single,
// more generic App/Notification store?

export const localStorageDetectedUnsupported = createAction(
  '[Toaster] Local storage detected unsupported',
);

export const localStorageDetectedFull = createAction(
  '[Toaster] Local storage detected full',
  props<{ fileSize: string }>(),
);
