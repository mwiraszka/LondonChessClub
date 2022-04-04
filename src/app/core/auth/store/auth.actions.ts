import { User } from '@app/shared/types';
import { createAction, props } from '@ngrx/store';

import { LoginRequestData } from '../types/login-request-data.model';
import { SignUpRequestData } from '../types/sign-up-request-data.model';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  SIGN_UP_REQUESTED = '[Auth] Sign up requested',
  SIGN_UP_SUCCEEDED = '[Auth] Sign up succeeded',
  SIGN_UP_FAILED = '[Auth] Sign up failed',

  LOGOUT = '[Auth] Logout',
}

export const loginRequested = createAction(
  AuthActionTypes.LOGIN_REQUESTED,
  props<{ loginRequestData: LoginRequestData }>()
);
export const loginSucceeded = createAction(
  AuthActionTypes.LOGIN_SUCCEEDED,
  props<{ user: User }>()
);
export const loginFailed = createAction(
  AuthActionTypes.LOGIN_FAILED,
  props<{ errorMessage: string }>()
);

export const signupRequested = createAction(
  AuthActionTypes.SIGN_UP_REQUESTED,
  props<{ signUpRequestData: SignUpRequestData }>()
);
export const signupSucceeded = createAction(
  AuthActionTypes.SIGN_UP_SUCCEEDED,
  props<{ user: User }>()
);
export const signupFailed = createAction(
  AuthActionTypes.SIGN_UP_FAILED,
  props<{ errorMessage: string }>()
);

export const logout = createAction(AuthActionTypes.LOGOUT);
