import { createAction, props } from '@ngrx/store';

import { User } from '@app/shared/types';

import { LoginRequest } from '../types/login-request.model';
import { SignUpRequest } from '../types/sign-up-request.model';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  SIGN_UP_REQUESTED = '[Auth] Sign up requested',
  SIGN_UP_SUCCEEDED = '[Auth] Sign up succeeded',
  SIGN_UP_FAILED = '[Auth] Sign up failed',

  LOGOUT_SELECTED = '[Auth] Logout selected',
  ALREADY_HAVE_ACCOUNT_SELECTED = '[Auth] Already have account selected',
  DONT_HAVE_ACCOUNT_SELECTED = "[Auth] Don't have account selected",
  FORGOT_PASSWORD_SELECTED = '[Auth] Forgot password selected',
}

export const loginRequested = createAction(
  AuthActionTypes.LOGIN_REQUESTED,
  props<{ loginRequest: LoginRequest }>()
);
export const loginSucceeded = createAction(
  AuthActionTypes.LOGIN_SUCCEEDED,
  props<{ user: User }>()
);
export const loginFailed = createAction(
  AuthActionTypes.LOGIN_FAILED,
  props<{ errorMessage: string }>()
);

export const signUpRequested = createAction(
  AuthActionTypes.SIGN_UP_REQUESTED,
  props<{ signUpRequest: SignUpRequest }>()
);
export const signUpSucceeded = createAction(
  AuthActionTypes.SIGN_UP_SUCCEEDED,
  props<{ user: User }>()
);
export const signUpFailed = createAction(
  AuthActionTypes.SIGN_UP_FAILED,
  props<{ errorMessage: string }>()
);

export const logoutSelected = createAction(AuthActionTypes.LOGOUT_SELECTED);
export const alreadyHaveAccountSelected = createAction(
  AuthActionTypes.ALREADY_HAVE_ACCOUNT_SELECTED
);
export const dontHaveAccountSelected = createAction(
  AuthActionTypes.DONT_HAVE_ACCOUNT_SELECTED
);
export const forgotPasswordSelected = createAction(
  AuthActionTypes.FORGOT_PASSWORD_SELECTED
); // ::: not implemented yet
