import { createAction, props } from '@ngrx/store';

import type {
  AdminUser,
  LoginRequest,
  PasswordChangeRequest,
  UnverifiedUser,
} from '@app/types';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  LOGOUT_REQUESTED = '[Auth] Logout requested',
  LOGOUT_SUCCEEDED = '[Auth] Logout succeeded',

  NEW_PASSWORD_CHALLENGE_REQUESTED = '[Auth] New password challenge requested',

  REQUEST_NEW_CODE_SELECTED = '[Auth] Request new code selected',

  CODE_FOR_PASSWORD_CHANGE_REQUESTED = '[Auth] Code for password change requested',
  CODE_FOR_PASSWORD_CHANGE_SUCCEEDED = '[Auth] Code for password change succeeded',
  CODE_FOR_PASSWORD_CHANGE_FAILED = '[Auth] Code for password change failed',

  PASSWORD_CHANGE_REQUESTED = '[Auth] Password change requested',
  PASSWORD_CHANGE_SUCCEEDED = '[Auth] Password change succeeded',
  PASSWORD_CHANGE_FAILED = '[Auth] Password change failed',
}

export const loginRequested = createAction(
  AuthActionTypes.LOGIN_REQUESTED,
  props<{ request: LoginRequest }>(),
);
export const loginSucceeded = createAction(
  AuthActionTypes.LOGIN_SUCCEEDED,
  props<{ user: AdminUser }>(),
);
export const loginFailed = createAction(
  AuthActionTypes.LOGIN_FAILED,
  props<{ error: Error }>(),
);

export const logoutRequested = createAction(AuthActionTypes.LOGOUT_REQUESTED);
export const logoutSucceeded = createAction(AuthActionTypes.LOGOUT_SUCCEEDED);

export const newPasswordChallengeRequested = createAction(
  AuthActionTypes.NEW_PASSWORD_CHALLENGE_REQUESTED,
  props<{ user: UnverifiedUser; tempInitialPassword: string }>(),
);

export const requestNewCodeSelected = createAction(
  AuthActionTypes.REQUEST_NEW_CODE_SELECTED,
);

export const codeForPasswordChangeRequested = createAction(
  AuthActionTypes.CODE_FOR_PASSWORD_CHANGE_REQUESTED,
  props<{ email: string }>(),
);
export const codeForPasswordChangeSucceeded = createAction(
  AuthActionTypes.CODE_FOR_PASSWORD_CHANGE_SUCCEEDED,
);
export const codeForPasswordChangeFailed = createAction(
  AuthActionTypes.CODE_FOR_PASSWORD_CHANGE_FAILED,
  props<{ error: Error }>(),
);

export const passwordChangeRequested = createAction(
  AuthActionTypes.PASSWORD_CHANGE_REQUESTED,
  props<{ request: PasswordChangeRequest }>(),
);
export const passwordChangeSucceeded = createAction(
  AuthActionTypes.PASSWORD_CHANGE_SUCCEEDED,
  props<{ email: string; newPassword: string }>(),
);
export const passwordChangeFailed = createAction(
  AuthActionTypes.PASSWORD_CHANGE_FAILED,
  props<{ error: Error }>(),
);
