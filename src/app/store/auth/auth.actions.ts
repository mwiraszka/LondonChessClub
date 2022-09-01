import { createAction, props } from '@ngrx/store';

import { LoginRequest, SignUpRequest, User } from '@app/types';

import { CognitoUserSession } from 'amazon-cognito-identity-js';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  SIGN_UP_REQUESTED = '[Auth] Sign up requested',
  SIGN_UP_SUCCEEDED = '[Auth] Sign up succeeded',
  SIGN_UP_FAILED = '[Auth] Sign up failed',

  LOGOUT_SUCCEEDED = '[Auth] Logout succeeded',

  ALREADY_HAVE_ACCOUNT_SELECTED = '[Auth] Already have account selected',
  DONT_HAVE_ACCOUNT_SELECTED = "[Auth] Don't have account selected",
  FORGOT_PASSWORD_SELECTED = '[Auth] Forgot password selected',
  RESEND_VERIFICATION_LINK_SUCCEEDED = '[Auth] Resend verification link succeeded',
}

export const loginRequested = createAction(
  AuthActionTypes.LOGIN_REQUESTED,
  props<{ loginRequest: LoginRequest }>()
);
export const loginSucceeded = createAction(
  AuthActionTypes.LOGIN_SUCCEEDED,
  props<{ user: User; cognitoUserSession: CognitoUserSession }>()
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
  props<{ user: User; cognitoUserSession: CognitoUserSession }>()
);
export const signUpFailed = createAction(
  AuthActionTypes.SIGN_UP_FAILED,
  props<{ errorMessage: string }>()
);

export const logoutSucceeded = createAction(AuthActionTypes.LOGOUT_SUCCEEDED);

// WIP - not implemented yet
export const alreadyHaveAccountSelected = createAction(
  AuthActionTypes.ALREADY_HAVE_ACCOUNT_SELECTED
);

// WIP - not implemented yet
export const dontHaveAccountSelected = createAction(
  AuthActionTypes.DONT_HAVE_ACCOUNT_SELECTED
);

// WIP - not implemented yet
export const forgotPasswordSelected = createAction(
  AuthActionTypes.FORGOT_PASSWORD_SELECTED
);

export const resendVerificationLinkSucceeded = createAction(
  AuthActionTypes.RESEND_VERIFICATION_LINK_SUCCEEDED
);
