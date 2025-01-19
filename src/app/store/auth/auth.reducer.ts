import { createReducer, on } from '@ngrx/store';

import { User } from '@app/models';

import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  hasCode: boolean;
  temporaryPassword: string | null;
}

export const authInitialState: AuthState = {
  user: null,
  hasCode: false,
  temporaryPassword: null,
};

export const authReducer = createReducer(
  authInitialState,

  on(
    AuthActions.loginSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      user,
      temporaryPassword: null,
    }),
  ),

  on(AuthActions.logoutSucceeded, (): AuthState => authInitialState),

  on(
    AuthActions.codeForPasswordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      hasCode: true,
    }),
  ),

  on(
    AuthActions.codeForPasswordChangeFailed,
    AuthActions.requestNewCodeSelected,
    AuthActions.passwordChangeSucceeded,
    (state): AuthState => ({
      ...state,
      hasCode: false,
    }),
  ),

  on(
    AuthActions.newPasswordChallengeRequested,
    (state, { temporaryPassword, user }): AuthState => ({
      ...state,
      user,
      temporaryPassword,
    }),
  ),
);
