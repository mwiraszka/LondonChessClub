import { createAction } from '@ngrx/store';

enum NavActionTypes {
  LOGIN_REQUESTED = '[Auth] Login requested',
  LOGIN_SUCCEEDED = '[Auth] Login succeeded',
  LOGIN_FAILED = '[Auth] Login failed',

  LOGOUT_REQUESTED = '[Auth] Logout requested',
  LOGOUT_SUCCEEDED = '[Auth] Logout succeeded',
  LOGOUT_FAILED = '[Auth] Logout failed',
}

export const loginRequested = createAction(NavActionTypes.LOGIN_REQUESTED);
export const loginSucceeded = createAction(NavActionTypes.LOGIN_SUCCEEDED);
export const loginFailed = createAction(NavActionTypes.LOGIN_FAILED);

export const logoutRequested = createAction(NavActionTypes.LOGOUT_REQUESTED);
export const logoutSucceeded = createAction(NavActionTypes.LOGOUT_SUCCEEDED);
export const logoutFailed = createAction(NavActionTypes.LOGOUT_FAILED);
