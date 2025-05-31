import { createReducer, on } from '@ngrx/store';

import { User } from '@app/models';

import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  hasCode: boolean;
}

export const initialState: AuthState = {
  user: null,
  hasCode: false,
};

export const authReducer = createReducer(
  initialState,

  on(
    AuthActions.loginSucceeded,
    AuthActions.passwordChangeSucceeded,
    (state, { user }): AuthState => ({
      ...state,
      user,
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
);
