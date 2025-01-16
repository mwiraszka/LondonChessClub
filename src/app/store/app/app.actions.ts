import { createAction, props } from '@ngrx/store';

import { Url } from '@app/models';

export const upcomingEventBannerCleared = createAction(
  '[App] Upcoming event banner cleared',
);

export const upcomingEventBannerReinstated = createAction(
  '[App] Reinstate upcoming event banner reinstated',
);

export const themeToggled = createAction('[App] Theme toggled');

export const safeModeToggled = createAction('[App] Safe mode toggled');

// Currently only used for article image data Urls;
// 'item' prop type to be expanded when more use cases added
export const itemSetInLocalStorage = createAction(
  '[App] Item set in local storage',
  props<{ key: string; item: Url }>(),
);

export const itemRemovedFromLocalStorage = createAction(
  '[Images] Item removed from local storage',
  props<{ key: string }>(),
);

export const localStorageDetectedUnsupported = createAction(
  '[App] Local storage detected unsupported',
);

export const localStorageDetectedFull = createAction(
  '[App] Local storage detected full',
  props<{ fileSize: string }>(),
);
