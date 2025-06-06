import { createAction, props } from '@ngrx/store';

import { Toast } from '@app/models';

export const upcomingEventBannerCleared = createAction(
  '[App] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[App] Reinstate upcoming event banner reinstated',
);

export const themeToggled = createAction('[App] Theme toggled');

export const safeModeToggled = createAction('[App] Safe mode toggled');

export const toastDisplayed = createAction(
  '[App] Toast displayed',
  props<{ toast: Toast }>(),
);
