import { createAction, props } from '@ngrx/store';

enum NavActionTypes {
  NAVIGATION_REQUESTED = '[Nav] Navigation requested',
  APPEND_PATH_TO_HISTORY = '[Nav] Append path to history',
}

export const navigationRequested = createAction(
  NavActionTypes.NAVIGATION_REQUESTED,
  props<{ path: string }>()
);

export const appendPathToHistory = createAction(
  NavActionTypes.APPEND_PATH_TO_HISTORY,
  props<{ path: string }>()
);
