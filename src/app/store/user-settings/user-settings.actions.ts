import { createAction } from '@ngrx/store';

export const upcomingEventBannerCleared = createAction(
  '[User Settings] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[User Settings] Reinstate upcoming event banner reinstated',
);

export const themeToggled = createAction('[User Settings] Theme toggled');

export const safeModeToggled = createAction('[User Settings] Safe mode toggled');
