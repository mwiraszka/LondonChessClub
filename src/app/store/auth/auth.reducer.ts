import { createReducer, on } from '@ngrx/store';

import { CallState, User } from '@app/models';

import * as AuthActions from './auth.actions';

export interface AuthState {
  callState: CallState;
  user: User | null;
  hasCode: boolean;
}

export const initialState: AuthState = {
  callState: {
    status: 'idle',
    loadStart: null,
    error: null,
  },
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
      callState: {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      },
    }),
  ),

  on(
    AuthActions.loginFailed,
    AuthActions.logoutFailed,
    AuthActions.passwordChangeFailed,
    (state, { error }): AuthState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error,
      },
    }),
  ),

  on(
    AuthActions.loginSucceeded,
    AuthActions.passwordChangeSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      callState: initialState.callState,
      user,
    }),
  ),

  on(AuthActions.logoutSucceeded, (): AuthState => ({ ...initialState })),

  on(
    AuthActions.codeForPasswordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      callState: initialState.callState,
      hasCode: true,
    }),
  ),

  on(
    AuthActions.codeForPasswordChangeFailed,
    (state, { error }): AuthState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error,
      },
      hasCode: false,
    }),
  ),

  on(
    AuthActions.requestNewCodeSelected,
    AuthActions.passwordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      callState: initialState.callState,
      hasCode: false,
    }),
  ),

  on(
    AuthActions.requestTimedOut,
    (state): AuthState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error: { name: 'LCCError', message: 'Request timed out' },
      },
    }),
  ),
);
