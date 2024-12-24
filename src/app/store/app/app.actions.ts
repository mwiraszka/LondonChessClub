import { createAction, props } from '@ngrx/store';

import { Toast } from '@app/types';

export const upcomingEventBannerCleared = createAction(
  '[App] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[App] Reinstate upcoming event banner reinstated',
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
