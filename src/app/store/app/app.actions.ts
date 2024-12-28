import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { Id, Toast } from '@app/types';

export const upcomingEventBannerCleared = createAction(
  '[App] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[App] Reinstate upcoming event banner reinstated',
);

export const deleteImageRequested = createAction(
  '[App] Delete image requested',
  props<{ imageId: Id }>(),
);

export const deleteImageSucceeded = createAction(
  '[App] Delete image succeeded',
  props<{ imageId: Id }>(),
);

export const deleteImageFailed = createAction(
  '[App] Delete image failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const themeToggled = createAction('[App] Theme toggled');

export const safeModeToggled = createAction('[App] Safe mode toggled');

export const toastAdded = createAction('[App] Toast added', props<{ toast: Toast }>());

export const toastExpired = createAction(
  '[App] Toast expired',
  props<{ toast: Toast }>(),
);

export const localStorageDetectedUnsupported = createAction(
  '[App] Local storage detected unsupported',
);

export const localStorageDetectedFull = createAction(
  '[App] Local storage detected full',
  props<{ fileSize: string }>(),
);
