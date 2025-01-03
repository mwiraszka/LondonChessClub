import { createAction, props } from '@ngrx/store';

import type {
  AdminUser,
  LoginRequest,
  PasswordChangeRequest,
  UnverifiedUser,
} from '@app/types';

export const loginRequested = createAction(
  '[Auth] Login requested',
  props<{ request: LoginRequest }>(),
);
export const loginSucceeded = createAction(
  '[Auth] Login succeeded',
  props<{ user: AdminUser }>(),
);
export const loginFailed = createAction('[Auth] Login failed', props<{ error: Error }>());

export const logoutRequested = createAction('[Auth] Logout requested');
export const logoutSucceeded = createAction('[Auth] Logout succeeded');

export const newPasswordChallengeRequested = createAction(
  '[Auth] New password challenge requested',
  props<{ user: UnverifiedUser; temporaryPassword: string }>(),
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
  props<{ error: Error }>(),
);

export const passwordChangeRequested = createAction(
  '[Auth] Password change requested',
  props<{ request: PasswordChangeRequest }>(),
);
export const passwordChangeSucceeded = createAction(
  '[Auth] Password change succeeded',
  props<{ email: string; newPassword: string }>(),
);
export const passwordChangeFailed = createAction(
  '[Auth] Password change failed',
  props<{ error: Error }>(),
);
