import { createAction, props } from '@ngrx/store';

enum NavActionTypes {
  NAVIGATION_REQUESTED = '[Nav] Navigation requested',
}

export const navigationRequested = createAction(
  NavActionTypes.NAVIGATION_REQUESTED,
  props<{ path: string }>(),
);
