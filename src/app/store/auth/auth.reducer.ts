import { createReducer, on } from '@ngrx/store';

import { CallState, User } from '@app/models';

import * as AuthActions from './auth.actions';

export interface AuthState {
  callState: CallState;
  user: User | null;
  hasCode: boolean;
}

export const initialState: AuthState = {
  callState: 'idle',
  user: null,
  hasCode: false,
};

export const authReducer = createReducer(
  initialState,

  on(
    AuthActions.loginRequested,
    AuthActions.logoutRequested,
    AuthActions.codeForPasswordChangeRequested,
    AuthActions.passwordChangeRequested,
    (state): AuthState => ({
      ...state,
      callState: 'loading',
    }),
  ),

  on(
    AuthActions.loginFailed,
    AuthActions.logoutFailed,
    AuthActions.passwordChangeFailed,
    (state): AuthState => ({
      ...state,
      callState: 'error',
    }),
  ),

  on(
    AuthActions.loginSucceeded,
    AuthActions.passwordChangeSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      callState: 'idle',
      user,
    }),
  ),

  on(
    AuthActions.logoutSucceeded,
    (): AuthState => ({
      ...initialState,
      callState: 'idle',
    }),
  ),

  on(
    AuthActions.codeForPasswordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      callState: 'idle',
      hasCode: true,
    }),
  ),

  on(
    AuthActions.codeForPasswordChangeFailed,
    (state): AuthState => ({
      ...state,
      callState: 'error',
      hasCode: false,
    }),
  ),

  on(
    AuthActions.requestNewCodeSelected,
    AuthActions.passwordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      callState: 'idle',
      hasCode: false,
    }),
  ),
);
