import { createAction, props } from '@ngrx/store';

import { NavPath } from '@app/models';

export const navigationRequested = createAction(
  '[Nav] Navigation requested',
  props<{ path: NavPath }>(),
);

export const pageAccessDenied = createAction(
  '[Nav] Page access denied',
  props<{ pageTitle: string }>(),
);

export const appendPathToHistory = createAction(
  '[Nav] Append path to history',
  props<{ path: NavPath }>(),
);
