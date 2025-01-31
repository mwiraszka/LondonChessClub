import { createAction, props } from '@ngrx/store';

export const navigationRequested = createAction(
  '[Nav] Navigation requested',
  props<{ path: string }>(),
);

export const appendPathToHistory = createAction(
  '[Nav] Append path to history',
  props<{ path: string }>(),
);
