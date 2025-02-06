import { createAction } from '@ngrx/store';

export const upcomingEventBannerCleared = createAction(
  '[App] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[App] Reinstate upcoming event banner reinstated',
);

export const themeToggled = createAction('[App] Theme toggled');

export const safeModeToggled = createAction('[App] Safe mode toggled');
