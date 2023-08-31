import { createAction, props } from '@ngrx/store';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

import { LoginRequest, PasswordChangeRequest, SignUpRequest, User } from '@app/types';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  SIGN_UP_REQUESTED = '[Auth] Sign up requested',
  SIGN_UP_SUCCEEDED = '[Auth] Sign up succeeded',
  SIGN_UP_FAILED = '[Auth] Sign up failed',

  LOGOUT_REQUESTED = '[Auth] Logout requested',
  LOGOUT_SUCCEEDED = '[Auth] Logout succeeded',

  FORGOT_PASSWORD_SELECTED = '[Auth] Forgot password selected',
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
  props<{ user: User; session: CognitoUserSession }>(),
);
export const loginFailed = createAction(
  AuthActionTypes.LOGIN_FAILED,
  props<{ error: Error }>(),
);

export const signUpRequested = createAction(
  AuthActionTypes.SIGN_UP_REQUESTED,
  props<{ request: SignUpRequest }>(),
);
export const signUpSucceeded = createAction(
  AuthActionTypes.SIGN_UP_SUCCEEDED,
  props<{ user: User; session: CognitoUserSession }>(),
);
export const signUpFailed = createAction(
  AuthActionTypes.SIGN_UP_FAILED,
  props<{ error: Error }>(),
);

export const logoutRequested = createAction(AuthActionTypes.LOGOUT_REQUESTED);
export const logoutSucceeded = createAction(AuthActionTypes.LOGOUT_SUCCEEDED);

export const forgotPasswordSelected = createAction(
  AuthActionTypes.FORGOT_PASSWORD_SELECTED,
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
);
export const passwordChangeFailed = createAction(
  AuthActionTypes.PASSWORD_CHANGE_FAILED,
  props<{ error: Error }>(),
);
