import { User } from '@app/shared/types';
import { createAction, props } from '@ngrx/store';

import { LoginRequestData } from '../types/login-request-data.model';
import { AccountCreationRequestData } from '../types/account-creation-request-data.model';

enum AuthActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  ACCOUNT_CREATION_REQUESTED = '[Auth] Account creation requested',
  ACCOUNT_CREATION_SUCCEEDED = '[Auth] Account creation succeeded',
  ACCOUNT_CREATION_FAILED = '[Auth] Account creation failed',

  LOGOUT_SELECTED = '[Auth] Logout selected',
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

export const accountCreationRequested = createAction(
  AuthActionTypes.ACCOUNT_CREATION_REQUESTED,
  props<{ accountCreationRequestData: AccountCreationRequestData }>()
);
export const accountCreationSucceeded = createAction(
  AuthActionTypes.ACCOUNT_CREATION_SUCCEEDED,
  props<{ user: User }>()
);
export const accountCreationFailed = createAction(
  AuthActionTypes.ACCOUNT_CREATION_FAILED,
  props<{ errorMessage: string }>()
);

export const logoutSelected = createAction(AuthActionTypes.LOGOUT_SELECTED);
