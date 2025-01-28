import { createReducer, on } from '@ngrx/store';

import { User } from '@app/models';

import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  hasCode: boolean;
}

export const authInitialState: AuthState = {
  user: null,
  hasCode: false,
};

export const authReducer = createReducer(
  authInitialState,

  on(
    AuthActions.loginSucceeded,
    AuthActions.passwordChangeSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      user,
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
);
