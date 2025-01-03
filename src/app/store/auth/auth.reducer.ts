import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState, initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,

  on(
    AuthActions.loginSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      user,
      temporaryPassword: null,
    }),
  ),

  on(AuthActions.logoutSucceeded, (): AuthState => initialState),

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
