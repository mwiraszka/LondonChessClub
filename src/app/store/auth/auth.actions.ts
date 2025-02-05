import { createAction, props } from '@ngrx/store';

import type { LccError, User } from '@app/models';

export const loginRequested = createAction(
  '[Auth] Login requested',
  props<{ email: string; password: string }>(),
);
export const loginSucceeded = createAction(
  '[Auth] Login succeeded',
  props<{ user: User }>(),
);
export const loginFailed = createAction(
  '[Auth] Login failed',
  props<{ error: LccError }>(),
);

export const logoutRequested = createAction(
  '[Auth] Logout requested',
  props<{ sessionExpired?: boolean }>(),
);
export const logoutSucceeded = createAction(
  '[Auth] Logout succeeded',
  props<{ sessionExpired?: boolean }>(),
);
export const logoutFailed = createAction(
  '[Auth] Logout failed',
  props<{ error: LccError }>(),
);

export const requestNewCodeSelected = createAction('[Auth] Request new code selected');

export const codeForPasswordChangeRequested = createAction(
  '[Auth] Code for password change requested',
  props<{ email: string }>(),
);
export const codeForPasswordChangeSucceeded = createAction(
  '[Auth] Code for password change succeeded',
);
export const codeForPasswordChangeFailed = createAction(
  '[Auth] Code for password change failed',
  props<{ error: LccError }>(),
);

export const passwordChangeRequested = createAction(
  '[Auth] Password change requested',
  props<{ email: string; password: string; code: string }>(),
);
export const passwordChangeSucceeded = createAction(
  '[Auth] Password change succeeded',
  props<{ user: User }>(),
);
export const passwordChangeFailed = createAction(
  '[Auth] Password change failed',
  props<{ error: LccError }>(),
);
