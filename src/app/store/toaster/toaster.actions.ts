import { createAction, props } from '@ngrx/store';

import type { Toast } from '@app/types';

enum ToasterActionTypes {
  TOAST_ADDED = '[Toaster] Toast added',
  TOAST_EXPIRED = '[Toaster] Toast expired',
  LOCAL_STORAGE_DETECTED_UNSUPPORTED = '[Toaster] Local storage detected unsupported',
  LOCAL_STORAGE_DETECTED_FULL = '[Toaster] Local storage detected full',
}

export const toastAdded = createAction(
  ToasterActionTypes.TOAST_ADDED,
  props<{ toast: Toast }>(),
);

export const toastExpired = createAction(
  ToasterActionTypes.TOAST_EXPIRED,
  props<{ toast: Toast }>(),
);

// TODO: Refactor all these misc. Toast/Modal stores as a single,
// more generic App/Notification store?

export const localStorageDetectedUnsupported = createAction(
  ToasterActionTypes.LOCAL_STORAGE_DETECTED_UNSUPPORTED,
);

export const localStorageDetectedFull = createAction(
  ToasterActionTypes.LOCAL_STORAGE_DETECTED_FULL,
  props<{ fileSize: string }>(),
);
